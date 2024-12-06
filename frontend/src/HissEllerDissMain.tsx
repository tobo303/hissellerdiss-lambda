import React from 'react';
import HED_NavBar from './components/navbar/HED_NavBar';

import 'bootstrap/dist/css/bootstrap.min.css';
import "./sass/hed_style.scss";
import HED_Entries from './components/entry/HED_Entries';
import { Container } from 'react-bootstrap';

const HissEllerDissMain: React.FC = () => {
    return (
        <div>
            <HED_NavBar />
            <Container style={{ marginTop: '10%' }} className="d-flex justify-content-center">
                <HED_Entries />
            </Container>
        </div>
    );
};

export default HissEllerDissMain;