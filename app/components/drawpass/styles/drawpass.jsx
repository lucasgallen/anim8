import styled from 'styled-components';

const Container = styled.div`
  margin: 0 auto 0;
  max-width: 842px;
  position: relative;
  width: calc(100% - 8rem);

  @media (min-width: 700px)  {
    margin: 0 auto;
  }
`;

const LoadingContainer = styled.div`
  height: 10rem;
  position: relative;
  width: 100%;
`;

const Title = styled.div`
  display: inline-block;
  box-shadow: 1rem 0 0 -1px aquamarine, 3rem 0 0 -1rem cadetblue, 5rem 0 0 -2rem black;
  font-family: sans-serif;
  font-size: 45px;
  font-weight: bold;
  margin: 0 3rem 2rem 0;
  padding: 3rem 1rem;
  text-align: center;
  width: auto;

  @media (min-width: 700px) {
    box-shadow: 1.5rem 0 0 -1px aquamarine, 4.5rem 0 0 -1.5rem cadetblue, 7.5rem 0 0 -3rem black;
    margin: 0 auto 2rem;
    padding: 7rem 3rem;
  }
`;

export {
  Container,
  LoadingContainer,
  Title,
};
