interface HEDBodyResponse {
    statusCode: number;
    body: string;
}

export interface LambdaResponse {
    message: HEDBodyResponse;
}