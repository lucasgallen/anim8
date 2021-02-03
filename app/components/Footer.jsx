import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  font-size: 1.8rem;
  height: ${props => props.height};
  justify-content: space-evenly;
  width: 100%;
`;

function Footer(props) {
  return (
    <StyledFooter height={props.height} >
      <span>buy me a coffee</span>
      <span>© {new Date().getFullYear()} anim8</span>
      <span>built by <a href='https://lucas.devhop.net' target='_blank' rel='noreferrer'>devhop</a></span>
    </StyledFooter>
  );
}

export default Footer;
