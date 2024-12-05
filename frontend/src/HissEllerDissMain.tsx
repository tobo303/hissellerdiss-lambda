import React from 'react';
import HED_NavBar from './components/navbar/HED_NavBar';

import 'bootstrap/dist/css/bootstrap.min.css';
import "./sass/hed_style.scss";
import HED_Entries from './components/entry/HED_Entries';

const HissEllerDissMain: React.FC = () => {
    return (
        <div>
            <HED_NavBar />
            <div>
                <HED_Entries />
            </div>
        </div>
    );
};

export default HissEllerDissMain;