import { APIGatewayRequestAuthorizerEventV2, APIGatewaySimpleAuthorizerResult, Handler } from 'aws-lambda';
import { LambdaClient, InvokeCommand, InvocationType } from "@aws-sdk/client-lambda";
import { ValidateApiKeyRequest } from '../../../types/Requests/validateApiKeyRequest';
import { ValidateApiKeyResponse } from '../../../types/Responses/validationResponse';
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

const lambdaClient = new LambdaClient({
    region: 'eu-north-1'
});

const eventBridgeClient = new EventBridgeClient({
    region: 'eu-north-1'
});

export const handler: Handler = async (event: APIGatewayRequestAuthorizerEventV2): Promise<APIGatewaySimpleAuthorizerResult> => {
    // const apiRequest = JSON.parse(event.body || '{}') as ValidateApiKeyRequest;
    console.log("apiAuth function invoked", event);

    const apiRequest : ValidateApiKeyRequest = 
    {
        secretKey: event.headers?.authorization || ''
    }

    if (!apiRequest || !apiRequest.secretKey) {
        return {
            isAuthorized: false,
        };
    }

    console.log("apiAuth function invoked", apiRequest);

    const invokeParams = {
        FunctionName: 'aws-service-dev-dbGetApiKey',
        InvocationType: InvocationType.RequestResponse,
        Payload: JSON.stringify(apiRequest),
      };

    console.log("Getting api key");

    const response = await lambdaClient.send(new InvokeCommand(invokeParams));

    console.log("Response received", response);

    if (!response.Payload || response.StatusCode !== 200) {
        return {
            isAuthorized: false,
        };
    }  

    const apiResponse : ValidateApiKeyResponse = JSON.parse(Buffer.from(response.Payload).toString());
    // console.log("RAW BUFFER:", JSON.parse(Buffer.from(response.Payload).toString()));

    const eventBusParams = {
        Entries: [
            {
                Source: 'apiAuth',
                DetailType: 'API Key Validation',
                Detail: JSON.stringify({ message: 'API Key Validated: ' + apiRequest.secretKey + ' ' + (apiResponse.statusCode === 200)}),
                EventBusName: 'hed-log',
            },
        ],
    };

    await eventBridgeClient.send(new PutEventsCommand(eventBusParams));

    return {
        isAuthorized: apiResponse.statusCode === 200,
    };
};

