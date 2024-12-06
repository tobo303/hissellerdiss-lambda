type HEDAxiosMessage = {
    statusCode: number;
    headers:    Headers;
    body:       string;
}

// type HEDAxiosErrorResponse = {
// 	statusCode: 500;
// }

/* Generic Type (Alias) */
type HEDAxiosSuccessResponse = {
    message: HEDAxiosMessage;
}


export type HEDAxiosResponse = HEDAxiosSuccessResponse;