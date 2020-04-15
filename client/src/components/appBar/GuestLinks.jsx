import React from 'react';
import Nav from 'react-bootstrap/Nav';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const GuestLinks = () => {
  return (
    <>
      <Nav className="ml-auto">
        <Button className="ml-3" as={Link} to="login" variant="outline-primary">Login</Button>
        <Button className="ml-3" as={Link} to="signUp" variant="primary">Sign up</Button>
      </Nav>
    </>
  );
};

export default GuestLinks;
