import React from 'react';

import { AppContainer } from '/app/components/styles/atoms';

function useAppContainer({ headerHeight, footerHeight }) {
  const height = {
    header: headerHeight || '0px',
    footer: footerHeight || '0px',
  };

  const wrapInContainer = children => {
    return (
      <AppContainer
        headerHeight={height.header}
        footerHeight={height.footer}
      >
        {children}
      </AppContainer>
    );
  };

  return wrapInContainer;
}

export default useAppContainer;
