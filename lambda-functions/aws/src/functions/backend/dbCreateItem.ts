import { APIGatewayProxyResult, Handler } from 'aws-lambda';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

import { StatusCodes } from '../../statusCodes';
import CreateItemRequest from '../../types/Requests/createItemRequest';
import dbItem from '../../types/dbItem';
import { DB_NAME, HED_EXT_API_TABLE, HED_TABLE_NAME } from '../../globals';
import ItemDto from '../../types/ItemDto';
import { HEDApiKey } from '../../types/hedApiKey';
import { CreateApiKeyResponse } from '../../types/Responses/createNewApiKeyResponse';
import { CreateApiKeyRequest } from '../../types/Requests/createApiKeyRequest';

const client = new DynamoDB();
const db = DynamoDBDocument.from(client);

export const createHedItem: Handler = async (event: CreateItemRequest): Promise<APIGatewayProxyResult> => {

    const item = event;
    if (!item || !item.name) {
        return {
            statusCode: StatusCodes.BAD_REQUEST,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Missing required fields (name): " + JSON.stringify(item) + " || " + JSON.stringify(event),
            }),
        };
    }

    // Create a new item

    const docId = uuidv4();
    const nameRegex = /^[a-zA-Z0-9\s-!,.?"åäöÅÄÖ]+$/;
    if (!nameRegex.test(item.name) || !nameRegex.test(item.description)) {
        return {
            statusCode: StatusCodes.BAD_REQUEST,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Name/description can only contain alphanumeric characters, spaces, and hyphens."
            }),
        };
    }

    const newItem: dbItem = {
        pk: HED_TABLE_NAME,
        sk: docId,
        name: item.name,
        description: item.description,
        votes: 0,
        isDeleted: false,
        createdAt: new Date().toISOString()
    };

    // Store the new item in the database

    const result = await db.put({
        TableName: DB_NAME,
        Item: newItem
    });

    console.log("Created item:", newItem.name);

    if (result.$metadata.httpStatusCode !== StatusCodes.OK) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Error creating item"
            }),
        }
    }

    const response: ItemDto = {
        sk: docId,
        name: item.name,
        description: item.description,
        votes: 0,
        isDeleted: false,
    }

    return {
        statusCode: StatusCodes.OK,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
    };
};

export const createApiKey: Handler = async (request: CreateApiKeyRequest): Promise<APIGatewayProxyResult> => {

    if (!request || !request.name) {
        return {
            statusCode: StatusCodes.BAD_REQUEST,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Missing required fields (name): " + JSON.stringify(request),
            }),
        };
    }

    // Create a new api key

    const secretKey = uuidv4();

    const newApiKey: HEDApiKey = {
        pk: HED_EXT_API_TABLE,
        sk: secretKey,
        name: request.name,
        isDeleted: false,
        createdAt: new Date().toISOString()
    };

    // Store the new item in the database

    const result = await db.put({
        TableName: DB_NAME,
        Item: newApiKey
    });

    console.log("Created api-key:", newApiKey.name);

    if (result.$metadata.httpStatusCode !== StatusCodes.OK) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Error creating api key"
            }),
        }
    }

    const response: CreateApiKeyResponse = {
        secretKey: secretKey,
    }

    return {
        statusCode: StatusCodes.OK,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
    };
};