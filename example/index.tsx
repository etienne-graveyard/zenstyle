import React from 'react';
import ReactDOM from 'react-dom';
import { WithTheme } from './theme';
import { Styled, StyledComponent, StyledTag, StyledTagWithProps } from '../src';

const Button: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <button className={className}>Button</button>;
};

const StyledButton = StyledComponent(Button)({
  background: '#5C6BC0',
});

const StyledButtonTag = StyledTag.button(
  {
    background: '#388E3C',
  },
  theme => ({
    textTransform: 'uppercase',
  })
);

const StyledButtonVariant = StyledTagWithProps.button<{
  variant: 'red' | 'blue';
}>(({ variant, ...props }) => {
  return {
    zs: {
      color: 'white',
      background: variant === 'blue' ? '#1E88E5' : '#D32F2F',
    },
    ...props,
    type: 'button',
  };
});

const App: React.FC = () => {
  return (
    <div>
      <Styled.div zs={{ width: 300, background: '#EF5350', padding: '2rem' }}>
        Hello
      </Styled.div>
      <StyledButton zs={{ background: '#EF5350', padding: '2rem' }} />
      <StyledButton zs={{ padding: '2rem' }} />
      <StyledButtonTag type="button" zs={{ fontSize: '2rem' }}>
        Hello
      </StyledButtonTag>
      <StyledButtonVariant variant="red" zs={{ fontSize: '2rem' }}>
        Variant
      </StyledButtonVariant>
      <h2>Theme</h2>
      <WithTheme />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
