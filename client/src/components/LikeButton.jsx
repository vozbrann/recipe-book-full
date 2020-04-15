import React from 'react';
import styled from 'styled-components';

const StyledEditButton = styled.span`
  color: #000;
  text-decoration: none;
  transition: all 0.3s ease;
  :hover {
    color: dodgerblue;
    cursor: pointer;
  }
  &.active {
    color: dodgerblue;
  }
`;

const LikeButton = (props) => {
  return (
    <StyledEditButton {...props} className={"material-icons ml-1 " + (props.active ? "active " : "")}>favorite</StyledEditButton>
  );
};

export default LikeButton;
