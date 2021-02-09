import { darken, desaturate, lighten, mix, rem } from 'polished';
import { css } from 'styled-components';

export const gutter = 12;

export const palette = {
  lightShades: '#FBFBFC',
  accentLight: '#55AED1',
  mainBrand: '#2AA3BE',
  accentDark: '#4D7CBA',
  darkShades: '#1B1A2C',
};

export const appBg = lighten(0.0625)(palette.darkShades);
export const inputBg = desaturate(0.1)(palette.darkShades);

export const fontSmoothingAntialiased = css`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export const buttonReset = css`
  ${fontSmoothingAntialiased}
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  cursor: pointer;

  /* inherit font & color from ancestor */
  color: inherit;
  font: inherit;

  /* Normalize 'line-height'. Cannot be changed from 'normal' in Firefox 4+. */
  line-height: normal;

  /* Corrects inability to style clickable 'input' types in iOS */
  -webkit-appearance: none;

  /* Remove excess padding and border in Firefox 4+ */
  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  touch-action: manipulation;

  &:focus {
    box-shadow: none;
    outline: 0;
  }
`;

export const inputPaddingX = 12;
export const inputPaddingY = 8;
export const inputHeight = 44;
export const inputReset = css`
  border-radius: 0;
  background: 0;
  box-shadow: none;
  border: 0;
`;

export const inputStyles = css`
  ${inputReset}
  display: block;
  width: 100%;
  height: ${rem(inputHeight)};
  padding: ${rem(inputPaddingY)} ${rem(inputPaddingX)};
  background-color: ${inputBg};
  color: ${palette.lightShades};
  border-width: ${rem(1)};
  border-style: solid;
  border-color: transparent;
  border-radius: ${rem(6)};
  transition-property: border-color, color, box-shadow;
  transition-duration: 0.1s;
  overflow: hidden;
  text-overflow: ellipsis;

  &:focus {
    box-shadow: none;
    outline: 0;
    border-color: ${mix(0.5)(palette.lightShades)(inputBg)};
  }

  &[readonly] {
    color: ${darken(0.25)(palette.lightShades)};
    background-color: ${lighten(0.05)(inputBg)};

    &:focus {
      border-color: ${mix(0.25)(palette.lightShades)(inputBg)};
    }
  }
`;

export const fontFamilyBody = '"Source Sans Pro", sans-serif';
export const fontFamilyHeadings = 'Comfortaa, cursive';
