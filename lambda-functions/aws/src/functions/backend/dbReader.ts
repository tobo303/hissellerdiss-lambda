import { APIGatewayProxyResult, Handler } from 'aws-lambda';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { DB_NAME, HED_EXT_API_TABLE, HED_TABLE_NAME } from '../../globals';
import ItemDto from '../../types/ItemDto';
import { StatusCodes } from '../../statusCodes';
import { GetItemByIdRequest } from '../../types/Requests/getItemByIdRequest';
import { ValidateApiKeyRequest } from '../../types/Requests/validateApiKeyRequest';
import { ValidateApiKeyResponse } from '../../types/Responses/validationResponse';

const client = new DynamoDB();
const db = DynamoDBDocument.from(client); // client is DynamoDB client

export const getAllItems: Handler = async (): Promise<APIGatewayProxyResult> => {

    // Skapad med NoSQL Workbench
    const params : QueryCommandInput = {
        TableName: DB_NAME,
        KeyConditionExpression: "#b2050 = :b2050",
        FilterExpression: "#b2051 = :b2051",
        ExpressionAttributeValues: {
            ":b2050": HED_TABLE_NAME,
            ":b2051": false
        },
        ExpressionAttributeNames: {
            "#b2050": "pk",
            "#b2051": "isDeleted"
        }
    };

    const items = await db.query(params);

    const mappedItems = items.Items?.map((item) => {
        return {
            sk: item.sk,
            name: item.name,
            description: item.description,
            votes: item.votes,
            isDeleted: item.isDeleted
        } as ItemDto;
    }) || [];

    const response: APIGatewayProxyResult = {
        statusCode: StatusCodes.OK,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            items: mappedItems
        }),
    }

    return response;
};

export const getItemById: Handler = async (request: GetItemByIdRequest): Promise<APIGatewayProxyResult> => {
    
    console.log("Getting item with id: ", request.id);

    // Skapad med NoSQL Workbench
    const getItemParams : QueryCommandInput = {
        TableName: DB_NAME,
        KeyConditionExpression: "#9d2d0 = :9d2d0 And #9d2d1 = :9d2d1",
        FilterExpression: "#9d2d2 = :9d2d2",
        ExpressionAttributeNames: {"#9d2d0":"pk","#9d2d1":"sk","#9d2d2":"isDeleted"},
        ExpressionAttributeValues: {":9d2d0": HED_TABLE_NAME, ":9d2d1": request.id, ":9d2d2": false}
    }

    const getItemResult = await db.query(getItemParams);

    if (!getItemResult.Items || !getItemResult.Count || getItemResult.Count === 0) {
        return {
            statusCode: StatusCodes.NOT_FOUND,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Item not found"
            }),
        }
    }

    const item = getItemResult.Items[0] as ItemDto;

    const response: APIGatewayProxyResult = {
        statusCode: StatusCodes.OK,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            item: item
        }),
    }

    return response;
}

export const getApiKey: Handler = async (request: ValidateApiKeyRequest): Promise<APIGatewayProxyResult> => {
    
    console.log("Getting api-key with key: ", request.secretKey);

    if (!request.secretKey) {
        console.log("Missing required fields (secretKey)");
        return {
            statusCode: StatusCodes.BAD_REQUEST,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Missing required fields (secretKey)",
            }),
        };
    }

    // Skapad med NoSQL Workbench
    const getApiKeyParams : QueryCommandInput = {
        TableName: DB_NAME,
        KeyConditionExpression: "#9d2d0 = :9d2d0 And #9d2d1 = :9d2d1",
        FilterExpression: "#9d2d2 = :9d2d2",
        ExpressionAttributeNames: {"#9d2d0":"pk","#9d2d1":"sk","#9d2d2":"isDeleted"},
        ExpressionAttributeValues: {":9d2d0": HED_EXT_API_TABLE, ":9d2d1": request.secretKey, ":9d2d2": false}
    }

    const getApiQueryResult = await db.query(getApiKeyParams);

    console.log("Query result: ", getApiQueryResult);

    if (!getApiQueryResult.Items || !getApiQueryResult.Count || getApiQueryResult.Count === 0) {
        console.log("Unauthorized access");
        return {
            statusCode: StatusCodes.UNAUTHORIZED,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Unauthorized access"
            }),
        }
    }

    const item = getApiQueryResult.Items[0] as ValidateApiKeyResponse;

    console.log("Api key found: ", item);

    const response: APIGatewayProxyResult = {
        statusCode: StatusCodes.OK,
        headers: {
            "Content-Type": "application/json",
        },
        body: ''
    }

    return response;
}