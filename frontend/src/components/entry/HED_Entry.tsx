import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { HEDItem } from '../../types/hed/HEDItem';
import { Button } from 'react-bootstrap';

interface HED_EntryProps {
    item: HEDItem;
}

const queryClient = useQueryClient();

const mutation = useMutation({

});

function vote(id: string, value: number) {

    mutation.mutate({ id, value });
}

const HED_Entry: React.FC<HED_EntryProps> = ({ item }) => {
    return (
        <div id={item.sk}>
            <div>{item.name}</div>
            <div>{item.description}</div>
            <div>{item.votes}</div>
            <div><Button>👍</Button></div>
            <div><Button>👎</Button></div>
        </div>
    );
};

export default HED_Entry;