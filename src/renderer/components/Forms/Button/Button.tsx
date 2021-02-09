import { darken, desaturate, lighten, mix, rem } from 'polished';
import styled from 'styled-components';

import {
  buttonReset,
  fontFamilyHeadings,
  inputHeight,
  inputPaddingX,
  inputPaddingY,
  palette,
} from '../../../config/styles';
import { FieldAddon } from '../Field';

const Button = styled.button`
  ${buttonReset}
  font-family: ${fontFamilyHeadings};
  font-weight: 500;
  font-size: ${rem(14)};
  line-height: 1;
  height: ${rem(inputHeight)};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: ${palette.mainBrand};
  color: ${palette.lightShades};
  border: ${rem(1)} solid ${palette.mainBrand};
  border-radius: ${rem(6)};
  padding: ${rem(inputPaddingY + 1)} ${rem(inputPaddingX)} ${rem(inputPaddingY - 1)};
  letter-spacing: 0.0625em;
  transition-property: color, background-color, border-color;
  transition-duration: 0.1s;

  &:hover,
  &:focus {
    background-color: ${lighten(0.05)(palette.mainBrand)};
    color: ${palette.lightShades};
  }

  &:active {
    background-color: ${darken(0.05)(palette.mainBrand)};
    border-color: ${mix(0.5)(palette.lightShades)(palette.mainBrand)};
  }

  &[disabled] {
    cursor: default;

    &,
    &:hover,
    &:focus,
    &:active {
      border-color: ${desaturate(0.75)(palette.mainBrand)};
      background-color: ${desaturate(0.75)(palette.mainBrand)};
      color: ${darken(0.125)(palette.lightShades)};
    }
  }

  ${FieldAddon} & {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
`;

export default Button;
