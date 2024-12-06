import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { LambdaClient, InvokeCommand, InvocationType } from "@aws-sdk/client-lambda";

import { StatusCodes } from '../../statusCodes';
import UpdateItemRequest from '../../types/Requests/updateItemRequest';

const lambdaClient = new LambdaClient({});

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id || "";
    
    console.log("delete item function invoked with id: ", id);

    if (!id || id.length === 0) {
        return {
            statusCode: StatusCodes.BAD_REQUEST,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Missing required fields (id): " + id,
            }),
        };
    }

    const item: UpdateItemRequest = {
        id: id,
        vote: 0,
        isDeleted: true
    };

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
        statusCode: StatusCodes.NO_CONTENT,
        headers: {
            "Content-Type": "application/json",
        },
        body: ''
    };
};