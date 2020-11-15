import React from 'react';

import {
  DrawpassLink,
  HomeContainer,
  FlipbookLink,
  LinkContainer,
  TitleContainer,
  Title,
} from './styles/home';


function Home() {
  return (
    <div>
      <HomeContainer>
        <TitleContainer>
          <Title>Anim8</Title>
        </TitleContainer>

        <LinkContainer>
          <FlipbookLink to='/flipbook'>flipbook</FlipbookLink>
          <DrawpassLink to='/drawpass'>drawpass</DrawpassLink>
        </LinkContainer>
      </HomeContainer>
    </div>
  );
}

export default Home;
