import ItemDto from "./ItemDto";

export default interface LambdaCreateItemResponse {
    message: string;
    statuscode: number;
    item: ItemDto;
}