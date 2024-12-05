export default interface CreateItemResponse {
    id: string;
    name: string;
    description: string;
    votes: number;
    isDeleted: boolean;
}