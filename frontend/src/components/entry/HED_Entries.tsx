import React from 'react';
import HED_Entry from './HED_Entry';
import useHEDEntries from './entriesQuery';

const HED_Entries: React.FC = () => {

    const { data: items, isLoading } = useHEDEntries();
    
    // React.useEffect(() => {
    //     if (items) {
    //         console.log("Got data: ", items);
    //     }
    //     if (error) {
    //         console.error('Error fetching entries:', error);
    //     }
    // }, [items, error]);
    
    return (
        <div>
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