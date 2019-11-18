import { createStyled } from './styled';

export const {
  StyledComponent,
  StyledComponentFactory,
  StyledFactory,
  StyledWrapper,
} = createStyled<unknown>();

export {
  createStyled,
  CacheProvider,
  EmotionCacheContext,
  Styled,
  StyledCSS,
  StyledFn,
  StyledWrapperFactory,
  StyledWrapperProps,
} from './styled';
export { Tag } from './tags';
