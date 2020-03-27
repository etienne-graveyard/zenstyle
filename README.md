# Zenstyle

This library exposes a new interface to [emotion](https://emotion.sh/docs/introduction).

## Gist

```ts
import { Styled, StyledTag } from 'zenstyle';

// Use the Styled.tag components
const inlineStyle = <Styled.div zs={{ color: 'red' }}></Styled.div>;

// Or create a styled tag
const Button = StyledTag.button({
  color: 'violet',
});

const button = <Button />;
```

## The ZS props

The ZS props accept one of the following types:

- A `CSSObject`
- `null`
- A function `(theme: Theme) => CSSObject`
- An array of any of the above

The `CSSObject` accept any css properties including pseudo selector and child selector (this object is directly passed to emotion).

## API

### Styled

> Ready to use components that accept a zs props

### StyledTag

> A factory to create a styled component (similar to styled component)

```ts
import { StyledTag } from 'zenstyle';

const Button = StyledTag.button([
  { color: 'violet' },
  theme => ({ background: theme.background }),
]);
```

### StyledComponent

> Inject a `className` to an existing componnent

```ts
import { StyledComponent } from 'zenstyle';
import { Link } from 'react-router-dom';

const RedLink = StyledComponent(Link)({
  color: 'red',
});
```

### StyledTagWithProps

> Add custom props on an html element to control it's style

```ts
import { StyledTagWithProps } from 'zenstyle';

const Button = StyledTagWithProps.button<{ primary?: boolean }>(({ primary = false, ...props }) => {
  return {
    ...props,
    zs: {
      fontSize: primary ? '1rem' : '1.3rem',
      fontWeoght: primary ? : 'bold' : 'normal'
    }
  }
});
```
