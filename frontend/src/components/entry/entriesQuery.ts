import { useQuery } from "@tanstack/react-query";
import { hed_getEntries } from "../../scripts/api/HED_API";
import { EntriesList } from "./entriesList";

const useHEDEntries = () => {
    return useQuery({
        queryKey: ["entries"],
        queryFn: async () => await hed_getEntries<EntriesList>(),
    });
}

export default useHEDEntries;