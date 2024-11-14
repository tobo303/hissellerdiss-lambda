export default interface dbItem {
    pk: string;
    sk: string;
    name: string;
    description: string;
    votes: number;
    isDeleted: boolean;
    createdAt: string;
}