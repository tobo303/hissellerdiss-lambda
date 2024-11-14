import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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