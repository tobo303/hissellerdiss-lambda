import React from 'react';
import { hed_getEntries } from '../../scripts/api/HED_API';
import { LambdaResponse } from '../../types/aws/LambdaResponse';
import { useQuery } from '@tanstack/react-query';
import { HEDItem } from '../../types/hed/HEDItem';
import HED_Entry from './HED_Entry';

type TestItem = {
    items: HEDItem[];
}

const HED_Entries: React.FC = () => {

    const { data: items, error, isLoading } = useQuery({
        queryKey: ['entries'], 
        queryFn: hed_getEntries<TestItem>}
    );
    
    React.useEffect(() => {
        if (items) {
            console.log("Got data: ", items);
        }
        if (error) {
            console.error('Error fetching entries:', error);
        }
    }, [items, error]);
    
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            {isLoading && <p>Loading...</p>}
            {items && items.items.map((item) => (
            <div key={item.sk}>
                <HED_Entry item={item} />
            </div>
            ))}
        </div>
    );
};

export default HED_Entries;