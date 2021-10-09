import styled from 'styled-components';

const Container = styled.div`
  margin: 0 auto;
  overflow: hidden;
  padding: 2.5rem 0;
  width: calc(100vw - 5rem);
`;

const FlipbookContainer = styled.div`
  height: calc(100% - 30rem);
  width: calc(20rem * 233.33%);

  @media (min-width: 700px) {
    height: calc(100% - 2rem);
    width: 100%;
  }

  @media (min-width: 900px) {
    float: left;
    max-width: calc(50% - 0.5rem);
    width: 70rem;
  }
`;

const TitleContainer = styled.div`
  text-align: center;
  width: 100%;
`;

export {
  Container,
  FlipbookContainer,
  TitleContainer,
};
