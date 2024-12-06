import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { HEDItem } from '../../types/hed/HEDItem';
import { Button } from 'react-bootstrap';
import { hed_updateEntry } from '../../scripts/api/HED_API';

interface HED_EntryProps {
    item: HEDItem;
}

const HED_Entry: React.FC<HED_EntryProps> = ({ item }) => {
    // const { data: items, error, isLoading } = useHEDEntries();
    const queryClient = useQueryClient();

    const likeMutation = useMutation({
        mutationFn: async (updateItem: HEDItem) => {
          return await hed_updateEntry<HEDItem>(updateItem, 1);
        },
        onSuccess: () => {
            queryClient.invalidateQueries();
        }
    });

    const dislikeMutation = useMutation({
        mutationFn: async (updateItem: HEDItem) => {
          return await hed_updateEntry<HEDItem>(updateItem, -1);
        },
        onSuccess: () => {
            queryClient.invalidateQueries();
        }
    });

    return (
        <div id={item.sk} className="d-flex flex-column border p-3 mt-2">
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-between align-items-center w-100">
                    <div><h3>{item.name}</h3></div>
                    <div className='ms-2'>
                        <Button className="me-2" variant="outline-primary" onClick={() => likeMutation.mutate(item)}>👍</Button>
                        <Button variant="outline-primary" onClick={() => dislikeMutation.mutate(item)}>👎</Button>
                    </div>
                </div>
                <div className="ms-2">{item.votes}</div>
            </div>
            <div>
                {item.description}
            </div>
        </div>
    );
};

export default HED_Entry;