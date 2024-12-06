import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { LambdaClient, InvokeCommand, InvocationType } from "@aws-sdk/client-lambda";

import { StatusCodes } from '../../../statusCodes';
import { CreateApiKeyRequest } from '../../../types/Requests/createApiKeyRequest';
const lambdaClient = new LambdaClient({});

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const keyRequest = JSON.parse(event.body || '{}') as CreateApiKeyRequest;

    if (!keyRequest || !keyRequest.name) {
        return {
            statusCode: StatusCodes.BAD_REQUEST,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Missing required fields (name): " + JSON.stringify(keyRequest),
            }),
        };
    }

    const invokeParams = {
        FunctionName: 'aws-service-dev-dbCreateApiKey',
        InvocationType: InvocationType.RequestResponse,
        Payload: JSON.stringify(keyRequest)
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
            api: JSON.parse(Buffer.from(response.Payload).toString())
        }),
    };
};