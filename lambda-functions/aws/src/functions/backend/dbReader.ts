import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { DynamoDB, QueryCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import GetItemsResponse from '../../types/getItemsResponse';
import { DB_NAME, HED_TABLE_NAME } from '../../globals';
import dbItem from '../../types/dbItem';
import ItemDto from '../../types/ItemDto';
import { StatusCodes } from '../../statusCodes';

const client = new DynamoDB();
const db = DynamoDBDocument.from(client);

export const getAllItems: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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

    // const command = new QueryCommand({
    //     TableName: DB_NAME,
    //     KeyConditionExpression: 'pk = :pk AND isDeleted = :isDeleted AND sk = :sk',
    //     ExpressionAttributeValues: { 
    //         ':pk': { S: HED_TABLE_NAME },
    //         ':isDeleted': { BOOL: false }
    //     },
    // });



    // const result = await db.get() .send(command);
    // const items: ItemDto[] = result.Items?.map((item) => <ItemDto> {
    //         sk: item.sk.S || '',
    //         name: item.name.S || '',
    //         description: item.description.S || '',
    //         votes: item.votes.N ? parseInt(item.votes.N) : 0,
    //         isDeleted: item.isDeleted.BOOL || false
    // }) || [];

    return {
        statusCode: items.length > 0 ? StatusCodes.OK : StatusCodes.NO_CONTENT,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            items
        }),
    };
};