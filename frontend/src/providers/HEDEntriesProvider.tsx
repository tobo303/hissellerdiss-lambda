import React, { useEffect, useState } from "react";
import { HEDItem } from "../types/hed/HEDItem";
import useHEDEntries from "../components/entry/entriesQuery";
import { HEDItemContext } from "../context/HEDContext";

type HEDEntriesProviderProps = {
    children: React.ReactNode;
};

const HEDEntriesProvider : React.FC<HEDEntriesProviderProps> = ({ children }) => {

    
    const [entries, setEntries] = useState<HEDItem[]>([]);
    const {data: entryData, isLoading} = useHEDEntries();
   
    useEffect(() => {
        if (!entryData || isLoading || !entryData.items) {
            return;
        }
        
        switch (entryData.items.length > 0) {
            case true:
                setEntries(entryData.items);
            break;
        }
    }, [isLoading, entryData]);

    function getEntries() {
        return entries || [];
    }

    return (
        <HEDItemContext.Provider value={{ getEntries, isLoading }}>
            {children}
        </HEDItemContext.Provider>
    );
}

export default HEDEntriesProvider;