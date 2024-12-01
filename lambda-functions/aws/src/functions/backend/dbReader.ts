import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { APIGateway } from 'aws-sdk';
import { DynamoDB, QueryCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, GetCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"; // ES6 import
import GetItemsResponse from '../../types/getItemsResponse';
import { DB_NAME, HED_TABLE_NAME } from '../../globals';
import dbItem from '../../types/dbItem';
import ItemDto from '../../types/ItemDto';
import { StatusCodes } from '../../statusCodes';

const client = new DynamoDB();
const db = DynamoDBDocument.from(client); // client is DynamoDB client

export const getAllItems: Handler = async (): Promise<APIGatewayProxyResult> => {

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