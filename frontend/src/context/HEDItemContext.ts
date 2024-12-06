import { HEDItem } from "../types/hed/HEDItem";

export type HEDItemContextType = {
    getEntries: () => HEDItem[];
    isLoading: boolean;
};