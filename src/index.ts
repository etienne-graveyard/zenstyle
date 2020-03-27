import { createZenStyle } from './styled';

export const {
  Styled,
  StyledComponent,
  StyledTag,
  StyledTagWithProps,
} = createZenStyle<unknown>();

export default Styled;

export { Tag } from './tags';
export * from './styled';
