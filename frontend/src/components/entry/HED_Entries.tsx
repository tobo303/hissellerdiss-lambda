import React from 'react';
import { hed_getEntries } from '../../scripts/api/HED_API';
import { LambdaResponse } from '../../types/aws/LambdaResponse';
import { useQuery } from '@tanstack/react-query';
import { HEDItem } from '../../types/hed/HEDItem';

const HED_Entries: React.FC = () => {

    const { data, error, isLoading } = useQuery({
        queryKey: ['entries'], 
        queryFn: hed_getEntries<HEDItem[]>}
    );
    
    React.useEffect(() => {
        if (data) {
            console.log("Got data: ", data);
        }
        if (error) {
            console.error('Error fetching entries:', error);
        }
    }, [data, error]);
    
    return (
        <div>
            <h1>HED Entries</h1>
        </div>
    );
};

export default HED_Entries;