import React from 'react';
import styled from 'styled-components';
import Spinner from 'react-bootstrap/Spinner';

const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: dodgerblue;
  opacity: 0.2;
  z-index: 9999;
`;

const LoadingFullscreen = () => {
  return (
    <Container>
      <Spinner variant="light" animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </Container>
  );
};

export default LoadingFullscreen;
