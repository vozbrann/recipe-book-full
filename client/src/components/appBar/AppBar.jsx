import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

import styled from 'styled-components';

import {Link} from 'react-router-dom';
import UserLinks from './UserLinks';
import GuestLinks from './GuestLinks';

const AppBarStyled = styled(Navbar)`
  height:70px;
`;

const AppBar = ({user, logout}) => {
  return (
    <AppBarStyled bg="light" expand="lg">
      <Container>
        <Navbar.Brand className="font-weight-bold" as={Link} to="/recipes">Recipe book</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          {user ?
            <UserLinks user={user} logout={logout}/> :
            <GuestLinks/>
          }
        </Navbar.Collapse>
      </Container>
    </AppBarStyled>


  );
};

export default AppBar;
