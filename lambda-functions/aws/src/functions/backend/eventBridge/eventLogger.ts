import { EventBridgeEvent } from 'aws-lambda';
// import AWS from 'aws-sdk';

// const eventBridge = new AWS.EventBridge();

export const handler = async (event: EventBridgeEvent<string, any>) => {
    console.log('Event received:', event);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Event processed successfully',
        }),
    };
};