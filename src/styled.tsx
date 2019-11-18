import React from 'react';
import {
  getRegisteredStyles,
  EmotionCache,
  insertStyles,
} from '@emotion/utils';
import { serializeStyles, ObjectInterpolation } from '@emotion/serialize';
import createCache from '@emotion/cache';
import { ThemeContext } from '@emotion/core';
import { Tag, TagToElement, tags } from './tags';

type JSXInEl = JSX.IntrinsicElements;

export type StyledCSS = ObjectInterpolation<{}>;
export type StyledFn<Theme> = (theme: Theme) => StyledCSS;
export type Styled<Theme> = Array<StyledFn<Theme> | StyledCSS>;

type StyledProps<Theme, P> = P & {
  styled?: Styled<Theme>;
  className?: string;
};

export const EmotionCacheContext = React.createContext<EmotionCache>(
  createCache()
);

export const CacheProvider = EmotionCacheContext.Provider;

type StyledTagResult<Theme, T extends Tag> = React.FC<
  StyledProps<Theme, JSXInEl[T]>
>;

type StyledComponentResult<Theme, Props> = React.FC<StyledProps<Theme, Props>>;

type StyledWrapperResult<Theme, T extends Tag> = <Props = {}>(
  factory: StyledWrapperFactory<Theme, T, Props>
) => React.ForwardRefExoticComponent<
  Pick<any, string | number | symbol> & React.RefAttributes<any>
>;

interface FactoryResult<Theme, T extends Tag> {
  styled: Styled<Theme>;
  props: StyledProps<Theme, JSXInEl[T]>;
}

export type StyledWrapperProps<T extends Tag, Props = {}> = JSXInEl[T] & Props;
export type StyledWrapperFactory<Theme, T extends Tag, P> = (
  props: React.PropsWithChildren<StyledWrapperProps<T, P>>
) => FactoryResult<Theme, T>;

type StyledFactoryResultProps<Theme, T extends Tag> = JSXInEl[T] & {
  styled?: Styled<Theme>;
};

type StyledFactoryResult<Theme, T extends Tag> = (
  ...styled: Styled<Theme>
) => React.FC<StyledFactoryResultProps<Theme, T>>;

export function createStyled<Theme>() {
  function createStyledTag<T extends Tag>(tag: T): StyledTagResult<Theme, T> {
    const Result: StyledTagResult<Theme, T> = React.forwardRef<
      HTMLElement,
      StyledProps<Theme, JSXInEl[T]>
    >((props, ref) => {
      const { className, styled, ...tagProps } = props;
      const cache = React.useContext(EmotionCacheContext);
      const theme = React.useContext(ThemeContext);

      let finalClassName = '';
      let classInterpolations: string[] = [];

      const styles: Array<any> = [styled];

      if (typeof className === 'string') {
        finalClassName += getRegisteredStyles(
          cache.registered,
          classInterpolations,
          className
        );
      }
      const serialized = serializeStyles(
        styles.concat(classInterpolations),
        cache.registered,
        theme
      );
      insertStyles(cache, serialized, true);
      finalClassName += `${cache.key}-${serialized.name}`;

      const TagName = tag as any;

      return <TagName className={finalClassName} ref={ref} {...tagProps} />;
    }) as any;
    Result.displayName = `Styled.${tag}`;
    return Result;
  }

  function createStyledFactory<T extends Tag>(
    tag: T
  ): StyledFactoryResult<Theme, T> {
    const Component = (StyledComponent as any)[tag];
    return (
      ...styled: Styled<Theme>
    ): React.FC<StyledFactoryResultProps<Theme, T>> => {
      const Result: React.FC<StyledFactoryResultProps<
        Theme,
        T
      >> = React.forwardRef<any, StyledFactoryResultProps<Theme, T>>(
        (props, ref) => {
          const { styled: propsStyled, ...otherProps } = props;
          const styledResolved = propsStyled
            ? [...styled, ...propsStyled]
            : styled;
          return (
            <Component styled={styledResolved} ref={ref} {...otherProps} />
          );
        }
      ) as any;
      Result.displayName = `StyledFactory.${tag}`;
      return Result;
    };
  }

  function createStyledWrapper(tag: Tag) {
    return function styledWrapper<T extends Tag, Props = {}>(
      factory: StyledWrapperFactory<Theme, T, Props>
    ) {
      return React.forwardRef<TagToElement[T], StyledWrapperProps<T, Props>>(
        (propsIn, ref) => {
          const Comp = StyledComponent[tag];
          const { props, styled } = factory(propsIn);
          const allProps: any = {
            styled,
            ref,
            ...props,
          };
          return <Comp {...allProps} />;
        }
      );
    };
  }

  function CreateStyledComponent<Props, RefType>(
    Component: React.ComponentType<Props>
  ): StyledComponentResult<Theme, Props> {
    const Comp: React.RefForwardingComponent<
      RefType,
      StyledProps<Theme, Props>
    > = (props, ref) => {
      const { className, styled, ...otherProps } = props;
      const cache = React.useContext(EmotionCacheContext);
      const theme = React.useContext(ThemeContext);

      let finalClassName = '';
      let classInterpolations: string[] = [];

      const styles: Array<any> = [styled];

      if (typeof className === 'string') {
        finalClassName += getRegisteredStyles(
          cache.registered,
          classInterpolations,
          className
        );
      }
      const serialized = serializeStyles(
        styles.concat(classInterpolations),
        cache.registered,
        theme
      );
      insertStyles(cache, serialized, true);
      finalClassName += `${cache.key}-${serialized.name}`;

      return (
        <Component
          className={finalClassName}
          ref={ref}
          {...(otherProps as any)}
        />
      );
    };

    return React.forwardRef<RefType, StyledProps<Theme, Props>>(Comp) as any;
  }

  function StyledComponentFactory<Props>(
    Component: React.ComponentType<Props>
  ) {
    const StyledComp = CreateStyledComponent(Component) as any;

    return (...styled: Styled<Theme>) => {
      return React.forwardRef<any, Props>((props, ref) => (
        <StyledComp ref={ref} styled={styled} {...props} />
      ));
    };
  }

  const StyledComponent: {
    [T in Tag]: StyledTagResult<Theme, T>;
  } = tags.reduce<any>((acc, key) => {
    acc[key] = createStyledTag(key);
    return acc;
  }, {});

  const StyledFactory: {
    [T in Tag]: StyledFactoryResult<Theme, T>;
  } = tags.reduce<any>((acc, key) => {
    acc[key] = createStyledFactory(key);
    return acc;
  }, {});

  const StyledWrapper: {
    [T in Tag]: StyledWrapperResult<Theme, T>;
  } = tags.reduce<any>((acc, key) => {
    acc[key] = createStyledWrapper(key);
    return acc;
  }, {});

  return {
    StyledComponentFactory,
    StyledComponent,
    StyledFactory,
    StyledWrapper,
  };
}
