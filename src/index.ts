import { createZenStyle } from './styled';

export { mergeZs } from './utils';
export { Tag } from './tags';
export { createZenStyle, CacheProvider } from './styled';

export * from './types';

export const {
  Styled,
  StyledComponent,
  StyledTag,
  StyledTagWithProps,
} = createZenStyle<unknown>();

export default Styled;
