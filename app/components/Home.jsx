import React from 'react';

import useAppContainer from '/app/hooks/useAppContainer';

import {
  DrawpassLink,
  HomeContainer,
  FlipbookLink,
  LinkContainer,
  TitleContainer,
  Title,
} from './styles/home';


function Home(props) {
  const appContainer = useAppContainer(props);

  return appContainer(
    <HomeContainer>
      <TitleContainer>
        <Title>Anim8</Title>
      </TitleContainer>

      <LinkContainer>
        <FlipbookLink to='/flipbook'>flipbook</FlipbookLink>
        <DrawpassLink to='/drawpass'>drawpass</DrawpassLink>
      </LinkContainer>
    </HomeContainer>
  );
}

export default Home;
