import { APIGatewayProxyResult, Handler } from 'aws-lambda';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

import { StatusCodes } from '../../statusCodes';
import dbItem from '../../types/dbItem';
import { DB_NAME, HED_TABLE_NAME } from '../../globals';
import ItemDto from '../../types/ItemDto';
import UpdateItemRequest from '../../types/Requests/updateItemRequest';

const client = new DynamoDB();
const db = DynamoDBDocument.from(client);

export const handler: Handler = async (event: UpdateItemRequest): Promise<APIGatewayProxyResult> => {

    const item = event;
    if (!item || !item.id) {
        return {
            statusCode: StatusCodes.BAD_REQUEST,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Missing required fields (id): " + JSON.stringify(item),
            }),
        };
    }

    // Get item
    const getItemParams = {
        TableName: DB_NAME,
        Key: {
            pk: HED_TABLE_NAME,
            sk: item.id
        }
    };
    
    const getItemResult = await db.get(getItemParams);

    if (!getItemResult.Item) {
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

    const existingItem = getItemResult.Item as dbItem;

    // Update the item
    const docId = existingItem.sk;
    existingItem.votes += item.vote;
    const result = db.update({
        TableName: DB_NAME,
        Key: {
            pk: HED_TABLE_NAME,
            sk: docId
        },
        UpdateExpression: "set votes = :votes, isDeleted = :isDeleted",
        ExpressionAttributeValues: {
            ":votes": existingItem.votes,
            ":isDeleted": existingItem.isDeleted
        }
    });

    console.log("Updated item:", existingItem.sk);

    if (!result) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Error updating item"
            }),
        }
    }

    const response = CreateDto(existingItem);

    return {
        statusCode: StatusCodes.OK,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
    };
};

function CreateDto(existingItem: dbItem): ItemDto {
    return {
        sk: existingItem.sk,
        name: existingItem.name,
        description: existingItem.description,
        votes: existingItem.votes,
        isDeleted: existingItem.isDeleted
    } as ItemDto;
}