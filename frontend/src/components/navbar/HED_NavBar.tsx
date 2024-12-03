import React from 'react';
import { Navbar, Nav, NavItem, Stack } from 'react-bootstrap';


const HED_NavBar: React.FC = () => {

    return (
        <div>
            <Navbar bg="dark" variant="dark" fixed='top' className='mb-3'>
                <Navbar.Brand href="/" className='navbar-brand'>HISS ELLER DISS</Navbar.Brand>
                <Nav className='me-auto'>
                    {/* <NavItem>
                        <Nav.Link href="/produkter">GODIS</Nav.Link>
                    </NavItem>
                    <NavItem>
                        <Nav.Link href="/omoss">OM OSS</Nav.Link>
                    </NavItem> */}
                </Nav>
                Login
            </Navbar>
            <Navbar bg="dark" variant="dark" fixed='bottom'>
                <Stack className='text-light d-flex align-items-center'>
                    ALL YOUR VOTES ARE BELONG TO US!
                </Stack>
            </Navbar>
        </div>
    );
};

export default HED_NavBar;