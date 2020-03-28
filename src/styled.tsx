import React from 'react';
import {
  getRegisteredStyles,
  EmotionCache,
  insertStyles,
} from '@emotion/utils';
import { serializeStyles } from '@emotion/serialize';
import createCache from '@emotion/cache';
import { ThemeContext } from '@emotion/core';
import { Tag, TagToElement, tags } from './tags';
import {
  ZenStyle,
  StyledElem,
  StyledProps,
  StyledTagFactory,
  StyledTagProps,
  ZsArray,
  StyledTagWithPropsExternalProps,
  StyledTagWithPropsTransformProps,
  BaseStyledProps,
  StyledComponentResult,
  StyledComponentProps,
  StyledTagWithPropsFactory,
} from './types';
import { mergeZs } from './utils';

export const EmotionCacheContext = React.createContext<EmotionCache>(
  createCache()
);

export const CacheProvider = EmotionCacheContext.Provider;

export function createZenStyle<Theme>(): ZenStyle<Theme> {
  function createStyled<T extends Tag>(tag: T): StyledElem<Theme, T> {
    const Result: StyledElem<Theme, T> = React.forwardRef<
      HTMLElement,
      StyledProps<Theme, T>
    >((props, ref) => {
      const { className, zs, ...tagProps } = props;
      const cache = React.useContext(EmotionCacheContext);
      const theme = React.useContext(ThemeContext);

      let finalClassName = '';
      let classInterpolations: string[] = [];

      const styles: Array<any> = [zs];

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

  function createStyledTag<T extends Tag>(tag: T): StyledTagFactory<Theme, T> {
    const Component = (Styled as any)[tag];
    return (...zs: ZsArray<Theme>): React.FC<StyledTagProps<Theme, T>> => {
      const Result: React.FC<StyledTagProps<Theme, T>> = React.forwardRef<
        any,
        StyledTagProps<Theme, T>
      >((props, ref) => {
        const { zs: zsProp, ...otherProps } = props;
        const zsResolved = mergeZs(zs, zsProp);
        return <Component zs={zsResolved} ref={ref} {...otherProps} />;
      }) as any;
      Result.displayName = `StyledFactory.${tag}`;
      return Result;
    };
  }

  function createStyledTagWithProps(tag: Tag) {
    return function styledWrapper<T extends Tag, Props = {}>(
      factory: StyledTagWithPropsTransformProps<Theme, T, Props>
    ) {
      const Comp = Styled[tag];

      return React.forwardRef<
        TagToElement[T],
        StyledTagWithPropsExternalProps<Theme, T, Props>
      >((allPassedProps, ref) => {
        const { zs: passedZs, ...passedProps } = allPassedProps;
        const allComputedProps = factory(passedProps as any);
        const { zs: computedZs, ...computedProps } = allComputedProps;
        const zsResolved = mergeZs(computedZs, passedZs);
        const allProps: any = {
          zs: zsResolved,
          ref,
          ...computedProps,
          ...passedProps,
        };
        return <Comp {...allProps} />;
      });
    };
  }

  function createBaseStyledComponent<Props, RefType>(
    Component: React.ComponentType<Props>
  ) {
    const Comp: React.RefForwardingComponent<
      RefType,
      BaseStyledProps<Theme, Props>
    > = (props, ref) => {
      const { className, zs, ...otherProps } = props;
      const cache = React.useContext(EmotionCacheContext);
      const theme = React.useContext(ThemeContext);

      let finalClassName = '';
      let classInterpolations: string[] = [];

      const styles: Array<any> = [zs];

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
    return React.forwardRef<RefType, BaseStyledProps<Theme, Props>>(Comp);
  }

  function StyledComponent<Props>(
    Component: React.ComponentType<Props>
  ): StyledComponentResult<Theme, Props> {
    const StyledComp = createBaseStyledComponent(Component) as any;

    return (
      ...zs: ZsArray<Theme>
    ): React.ForwardRefExoticComponent<StyledComponentProps<Theme, Props>> => {
      return React.forwardRef<any, StyledComponentProps<Theme, Props>>(
        (props, ref) => {
          const { zs: zsProp, ...otherProps } = props;
          const zsResolved = mergeZs(zs, zsProp);
          return <StyledComp ref={ref} zs={zsResolved} {...otherProps} />;
        }
      ) as any;
    };
  }

  const Styled: {
    [T in Tag]: StyledElem<Theme, T>;
  } = tags.reduce<any>((acc, key) => {
    acc[key] = createStyled(key);
    return acc;
  }, {});

  const StyledTag: {
    [T in Tag]: StyledTagFactory<Theme, T>;
  } = tags.reduce<any>((acc, key) => {
    acc[key] = createStyledTag(key);
    return acc;
  }, {});

  const StyledTagWithProps: {
    [T in Tag]: StyledTagWithPropsFactory<Theme, T>;
  } = tags.reduce<any>((acc, key) => {
    acc[key] = createStyledTagWithProps(key);
    return acc;
  }, {});

  return {
    Styled,
    StyledComponent,
    StyledTag,
    StyledTagWithProps,
  };
}
