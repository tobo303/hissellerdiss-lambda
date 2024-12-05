import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { LambdaClient, InvokeCommand, InvocationType } from "@aws-sdk/client-lambda";

import { StatusCodes } from '../../statusCodes';
import UpdateItemRequest from '../../types/Requests/updateItemRequest';

const lambdaClient = new LambdaClient({});

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const item = JSON.parse(event.body || '{}') as UpdateItemRequest;
    item.id = event.pathParameters?.id || "";
    
    console.log("patchItem function invoked with item: ", item);

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

    const invokeParams = {
      FunctionName: 'aws-service-dev-dbUpdateItem',
      InvocationType: InvocationType.RequestResponse,
      Payload: JSON.stringify(item),
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
        statusCode: StatusCodes.OK,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: JSON.parse(Buffer.from(response.Payload).toString())
        }),
    };
};