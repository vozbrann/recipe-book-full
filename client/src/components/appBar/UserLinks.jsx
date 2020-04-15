import React from 'react';

import { Link } from 'react-router-dom'

import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';


import styled from 'styled-components';

const UserRoundImage = styled(Image)`
  width: 40px;
  height:40px;
  object-fit: cover;
`;

const UserLinks = ({user, logout}) => {

  return (
    <>
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/recipes/my">My recipes</Nav.Link>
        <Nav.Link as={Link} to="/recipes/liked">Liked recipes</Nav.Link>
      </Nav>
      <Nav className="ml-auto">
        <NavDropdown
          alignRight
          title={<>{user.name}<UserRoundImage src="https://smk.org.uk/wp-content/uploads/avatar.jpg" roundedCircle /></>}
        >
          <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </>
  );
};

export default UserLinks;
