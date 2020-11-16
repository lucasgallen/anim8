import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const StyledHeader = styled.header`
  align-items: center;
  display: flex;
  font-size: 2.5rem;
  height: ${props => props.height};
  justify-content: space-evenly;
  width: 100%;
`;

const StyledNavLink = styled(NavLink)`
  background: hotpink;
  border: 4px solid lavender;
  box-shadow: 0 0 0 2px #323236, 0 0 0 4px aquamarine;
  color: black;
  display: inline-block;
  font-weight: bold;
  letter-spacing: 2px;
  padding: 0.5rem;
  text-decoration: none;
  text-transform: lowercase;
  transition: all 0.2s ease-in-out;

  &:hover {
    border: 4px solid hotpink;
    box-shadow: 0 0 0 2px lavender, 0 0 0 4px #323236;
    background: black;
    color: white;
  }
`;

const activeHide = { display: 'none' };

function Header(props) {
  return (
    <StyledHeader height={props.height}>
      <StyledNavLink activeStyle={activeHide} exact to="/">Anim8</StyledNavLink>
      <StyledNavLink activeStyle={activeHide} to="/drawpass">Drawpass</StyledNavLink>
      <StyledNavLink activeStyle={activeHide} to="/flipbook">Flipbook</StyledNavLink>
    </StyledHeader>
  );
}

export default Header;
