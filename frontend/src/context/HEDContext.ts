import { createContext, useContext } from 'react';
import { HEDItemContextType } from './HEDItemContext';

export const HEDItemContext = createContext<HEDItemContextType | null>(null);

export function useHEDItemContext() {
    return useContext(HEDItemContext);
};

