import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { LambdaClient, InvokeCommand, InvocationType } from "@aws-sdk/client-lambda";

import { StatusCodes } from "../../statusCodes";
import { GetItemByIdRequest } from '../../types/Requests/getItemByIdRequest';

const lambdaClient = new LambdaClient({
    region: 'eu-north-1'
});

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const item : GetItemByIdRequest = {id: event.pathParameters?.id || ""};

    console.log("getItems function invoked with id: ", item);

    const invokeParams = {
        FunctionName: 'aws-service-dev-dbReadItemById',
        InvocationType: InvocationType.RequestResponse,
        Payload: JSON.stringify(item),
    };

    console.log("Invoking lambda function");

    const response = await lambdaClient.send(new InvokeCommand(invokeParams));

    console.log("Response received");

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
            message: JSON.parse(Buffer.from(response.Payload).toString())
        }),
    };
};
