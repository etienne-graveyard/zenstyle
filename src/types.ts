import * as CSS from 'csstype';
import { Tag, TagToElement } from './tags';

type TagToProps = JSX.IntrinsicElements;

export type CSSProperties = CSS.Properties<string | number>;

export type CSSPseudos = { [K in CSS.Pseudos]?: ZsObject };

export interface ZsObject extends CSSProperties, CSSPseudos {
  [key: string]: ZsObject | string | number | undefined;
}

export type ZsFn<Theme> = (theme: Theme) => ZsObject;
export type ZsItem<Theme> = ZsFn<Theme> | ZsObject | null | undefined;
export type ZsArray<Theme> = Array<ZsItem<Theme>>;
export type Zs<Theme> = ZsArray<Theme> | ZsItem<Theme>;

export type BaseStyledProps<Theme, Props> = Props & {
  zs?: Zs<Theme>;
  className?: string;
};

type PropsOfTag<T extends Tag> = TagToProps[T];

/**
 * Styled
 */

export type StyledProps<Theme, T extends Tag> = PropsOfTag<T> & {
  zs?: Zs<Theme>;
};

export type StyledElem<Theme, T extends Tag> = React.FC<StyledProps<Theme, T>>;

/**
 * StyledTagWithProps
 */

export type StyledTagWithPropsInternalProps<
  T extends Tag,
  Props = {}
> = React.PropsWithChildren<PropsOfTag<T> & Props>;

export type StyledTagWithPropsExternalProps<
  Theme,
  T extends Tag,
  Props = {}
> = StyledTagWithPropsInternalProps<T, Props> & { zs?: Zs<Theme> };

export type StyledTagWithPropsTransformedProps<
  Theme,
  T extends Tag
> = React.PropsWithChildren<PropsOfTag<T> & { zs?: Zs<Theme> }>;

export type StyledTagWithPropsTransformProps<Theme, T extends Tag, P> = (
  props: StyledTagWithPropsInternalProps<T, P>
) => StyledTagWithPropsTransformedProps<Theme, T>;

export type StyledTagWithPropsFactory<Theme, T extends Tag> = <Props = {}>(
  transformProps: StyledTagWithPropsTransformProps<Theme, T, Props>
) => React.ForwardRefExoticComponent<
  React.PropsWithoutRef<StyledTagWithPropsExternalProps<Theme, T, Props>> &
    React.RefAttributes<TagToElement[T]>
>;

/**
 * StyledComponent
 */

export type StyledComponentProps<Theme, Props> = React.PropsWithoutRef<Props> &
  React.RefAttributes<any> & { zs?: Zs<Theme> };

export type StyledComponentResult<Theme, Props> = (
  ...zs: ZsArray<Theme>
) => React.ForwardRefExoticComponent<StyledComponentProps<Theme, Props>>;

export type StyledComponentFactory<Theme> = <Props>(
  Component: React.ComponentType<Props>
) => StyledComponentResult<Theme, Props>;

/**
 * StyledTag
 */

export type StyledTagProps<Theme, T extends Tag> = React.PropsWithChildren<
  PropsOfTag<T> & {
    zs?: Zs<Theme>;
  }
>;

export type StyledTagElem<Theme, T extends Tag> = React.FC<
  StyledTagProps<Theme, T>
>;

export type StyledTagFactory<Theme, T extends Tag> = (
  ...zs: ZsArray<Theme>
) => StyledTagElem<Theme, T>;

/**
 * ZenStyle
 */

export type StyledObj<Theme> = {
  [T in Tag]: StyledElem<Theme, T>;
};

export type StyledTagObj<Theme> = {
  [T in Tag]: StyledTagFactory<Theme, T>;
};
export type StyledTagWithPropsObj<Theme> = {
  [T in Tag]: StyledTagWithPropsFactory<Theme, T>;
};

export interface ZenStyle<Theme> {
  Styled: StyledObj<Theme>;
  StyledTag: StyledTagObj<Theme>;
  StyledTagWithProps: StyledTagWithPropsObj<Theme>;
  StyledComponent: StyledComponentFactory<Theme>;
}
