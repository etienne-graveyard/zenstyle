import React from 'react';
import { createZenStyle } from '../src';
import { ThemeProvider } from '@emotion/react';

interface Theme {
  color: string;
}

const { Styled } = createZenStyle<Theme>();

const Main: React.FC = () => {
  return (
    <Styled.div
      zs={theme => ({
        background: theme.color,
        color: 'blue',
        span: {
          color: 'yellow',
        },
      })}
    >
      Yoo
      <span>Hello</span>
    </Styled.div>
  );
};

const LIGHT_THEME: Theme = {
  color: '#E0E0E0',
};

const DARK_THEME: Theme = {
  color: '#212121',
};

export const WithTheme: React.FC = () => {
  const [darkTheme, setDarkTheme] = React.useState(false);

  return (
    <ThemeProvider theme={darkTheme ? DARK_THEME : LIGHT_THEME}>
      <button onClick={() => setDarkTheme(p => !p)}>Switch Theme</button>
      <Main />
    </ThemeProvider>
  );
};
