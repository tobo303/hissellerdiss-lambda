import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { DynamoDB, QueryCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import GetItemsResponse from '../../types/getItemsResponse';
import { DB_NAME, HED_TABLE_NAME } from '../../globals';
import dbItem from '../../types/dbItem';

const client = new DynamoDB();
const db = DynamoDBDocument.from(client);

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // const authHeader = event.headers['Authorization'];

    // if (!authHeader) {
    //     return {
    //         statusCode: 401,
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             message: "Unauthorized: Missing Authorization header"
    //         }),
    //     };
    // }

    const command = new QueryCommand({
        TableName: DB_NAME,
        ExpressionAttributeValues: { 
            ':pk': { S: HED_TABLE_NAME },
            ':isDeleted': { BOOL: false }
        },
        KeyConditionExpression: 'pk = :pk AND isDeleted = :isDeleted',
    });

    const result = await db.send(command);
    result.Items?.forEach((item) => {
        console.log(item);
    });

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: "Hello from:" + JSON.stringify(event)
        }),
    };
};