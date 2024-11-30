import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { LambdaClient, InvokeCommand, InvocationType } from "@aws-sdk/client-lambda";

import CreateItemRequest from '../../types/createItemRequest';
import { StatusCodes } from '../../statusCodes';
const lambdaClient = new LambdaClient({});

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const item = JSON.parse(event.body || '{}') as CreateItemRequest;

    // const invokeParams = {
    //   FunctionName: 'aws-service-dev-dbCreateitem',
    //   InvocationType: InvocationType.RequestResponse,
    //   Payload: JSON.stringify(item)
    // };
  
    const invokeParams = {
      FunctionName: 'aws-service-dev-dbCreateItem',
      InvocationType: InvocationType.RequestResponse,
      Payload: JSON.stringify(item),
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
        statusCode: StatusCodes.OK,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: JSON.parse(Buffer.from(response.Payload).toString())
        }),
    };
};