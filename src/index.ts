import { createZenStyle } from './styled';

export const {
  Styled,
  StyledComponent,
  StyledTag,
  StyledTagWithProps,
} = createZenStyle<unknown>();

export default Styled;

export { Tag } from './tags';
export {
  createZenStyle,
  CacheProvider,
  ZsProp,
  EmotionCacheContext,
  StyleArray,
  StyledComponentProps,
  StyledProps,
  StyledTagProps,
  StyledTagWithPropsExternalProps,
  StyledTagWithPropsInternalProps,
  StyledTagWithPropsTransformedProps,
  StyledTagWithPropsTransformProps,
  StyleFn,
  StyleItem,
  CSSObject,
} from './styled';
