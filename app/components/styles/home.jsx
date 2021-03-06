import { Link } from 'react-router-dom';

import styled from 'styled-components';

const HomeContainer = styled.div`
  margin: 0 auto;
  padding-top: 2rem;
  max-width: 75%;
  width: 90rem;
`;

const LinkContainer = styled.div`
  text-align: center;
  width: 100%;
`;

const StyledLink = styled(Link)`
  background-color: ivory;
  box-shadow: inset 0px 0px 0 1px black, 0 0 0 1px black;
  color: black;
  display: block;
  font-family: sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 5rem;
  padding: 2rem;
  position: relative;
  text-decoration: none;
  text-transform: uppercase;
  width: 10rem;

  &::after {
    border-left: 10px solid black;
    border-right: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    content: '';
    height: 0;
    left: 2px;
    position: absolute;
    transition: left 0.25s, opacity 0.1s;
    top: calc(50% - 10px);
    width: 0;
    opacity: 0;
  }

  &:hover {
    &::after {
      left: -25px;
      opacity: 1;
    }
  }
`;

const DrawpassLink = styled(StyledLink)`
  border: 5px solid cadetblue;
`;

const FlipbookLink = styled(StyledLink)`
  border: 5px solid aquamarine;
`;

const TitleContainer = styled.div`
  box-shadow: 0 10px 0 0 aquamarine, 0 30px 0 -10px cadetblue, 0 50px 0 -20px black;
  margin: 0 auto 11rem;
  padding: 1rem 0;
  width: 100%;
`;

const Title = styled.h1`
  font-family: sans-serif;
  font-size: 45px;
  font-weight: bold;
  text-align: center;
`;

export {
  DrawpassLink,
  HomeContainer,
  FlipbookLink,
  LinkContainer,
  TitleContainer,
  Title,
};
