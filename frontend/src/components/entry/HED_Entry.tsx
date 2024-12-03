import React from 'react';

interface HED_EntryProps {
    id: string;
}

const HED_Entry: React.FC<HED_EntryProps> = ({ id }) => {
    return (
        <div id={id}>
            <h1>HED Entry Component</h1>
        </div>
    );
};

export default HED_Entry;