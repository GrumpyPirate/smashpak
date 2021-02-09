import { desaturate, lighten, rem, transparentize } from 'polished';
import React, { FunctionComponent } from 'react';
import styled, { keyframes } from 'styled-components';

import { inputPaddingX, palette } from '../../config/styles';
import Button from '../Forms/Button/Button';

const spin = keyframes`
  from {
    transform: rotateZ(0turn);
  }

  to {
    transform: rotateZ(1turn);
  }
`;

const spinnerBaseColour = transparentize(0.25)(
  lighten(0.0625)(desaturate(0.375)(palette.accentDark)),
);

const Wrapper = styled.figure`
  position: relative;
  margin: 0;
  width: ${rem(24)};
  height: ${rem(24)};
  display: block;
  border-width: ${rem(2)};
  border-style: solid;
  border-color: ${spinnerBaseColour} ${spinnerBaseColour} ${palette.accentLight};
  border-radius: 50%;
  animation: ${spin} 0.75s infinite linear;

  ${Button} & {
    display: inline-block;
    width: 1.25em;
    height: 1.25em;
    margin-left: ${rem(inputPaddingX / 2)};
    border-color: ${spinnerBaseColour} ${spinnerBaseColour} ${palette.accentLight};
  }
`;

const Spinner: FunctionComponent = () => <Wrapper role="presentation" aria-label="Loading..." />;

export default Spinner;
