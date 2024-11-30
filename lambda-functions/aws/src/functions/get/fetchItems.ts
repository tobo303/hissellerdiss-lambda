import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { LambdaClient, InvokeCommand, InvocationType } from "@aws-sdk/client-lambda";

import { StatusCodes } from '../../statusCodes';

const lambdaClient = new LambdaClient({});

export const getItems: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const invokeParams = {
        FunctionName: 'aws-service-dev-dbReadItems',
        InvocationType: InvocationType.RequestResponse,
        Qualifier: '1',
      //   ClientContext: Buffer.from(JSON.stringify({ apiKey: 'your-api-key' })).toString('base64')
      };

      const response = await lambdaClient.send(new InvokeCommand(invokeParams));

      if (!response.Payload || response.StatusCode !== 200) {
        return {
            statusCode: response.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Internal Server Error: No valid response from the Lambda function",
            }),
        };
    }  

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            response: response.Payload
        }),
    };
};

export const getItemById: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const itemId = event.pathParameters?.id;

    if (!itemId) {
        return {
            statusCode: StatusCodes.BAD_REQUEST,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Item ID is required",
            }),
        };
    }

    return {
        statusCode: StatusCodes.OK,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: `Get item with ID: ${itemId}`,
        }),
    };
};