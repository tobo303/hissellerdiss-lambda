import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult, Context, Callback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { HED_USERS_TABLE } from '../../globals';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayTokenAuthorizerEvent, context: Context, callback: Callback<APIGatewayAuthorizerResult>) => {
    const token = event.authorizationToken;

    if (!token) {
        callback('Unauthorized');
        return;
    }

    try {
        const params = {
            TableName: HED_USERS_TABLE,
            Key: {
                'YourPrimaryKey': token
            }
        };

        const result = await dynamoDb.get(params).promise();

        if (!result.Item) {
            callback('Unauthorized');
            return;
        }

        const apiKey = uuidv4();

        // callback(null, policy);
    } catch (error) {
        console.error(error);
        callback('Unauthorized');
    }
};
