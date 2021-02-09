import { darken, position, rem, size, transparentize } from 'polished';
import styled from 'styled-components';

import { buttonReset, fontFamilyHeadings, inputPaddingX, palette } from '../../../config/styles';

export const FieldHelpText = styled.span`
  display: block;
  padding: ${rem(12)};
  margin-top: ${rem(4)};
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  position: absolute;
  top: calc(-0.5em - ${rem(8)});
  left: calc(100% + ${rem(8)});
  width: ${rem(240)};
  border-radius: 4px;
  box-shadow: 0 ${rem(2)} ${rem(4)} 0 ${transparentize(0.5)(darken(0.125)(palette.darkShades))};
  background-color: #333;
  transition-property: visibility, opacity;
  transition-duration: 0.2s;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: ${rem(12)};
    left: ${rem(-4)};
    display: block;
    border-color: transparent #333 transparent transparent;
    border-style: solid;
    border-width: ${rem(4)} ${rem(4)} ${rem(4)} 0;
    z-index: -1;
  }
`;

export const FieldHelpButton = styled.button`
  ${buttonReset};
  position: relative;
  display: block;
  width: 1.25em;
  height: 1.25em;

  svg {
    ${position('absolute', 0, 0)}
    ${size('100%')}
    display: block;
  }

  &:focus,
  &:hover {
    & + ${FieldHelpText} {
      opacity: 1;
      visibility: visible;
    }
  }
`;

export const FieldHelp = styled.span`
  position: absolute;
  top: 0;
  right: ${rem(inputPaddingX)};
  display: block;
`;

export const Field = styled.div`
  & + & {
    margin-top: ${rem(32)};
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
`;

export const FieldLabel = styled.label`
  position: relative;
  flex-basis: 100%;
  width: 100%;
  display: block;
  font-family: ${fontFamilyHeadings};
  font-size: ${rem(12)};
`;

export const FieldLabelText = styled.span`
  display: block;
  margin-bottom: ${rem(4)};
  text-transform: uppercase;
  padding: 0 ${rem(inputPaddingX)};
`;

export const FieldAddon = styled.div`
  display: flex;
  flex-direction: column;

  > * {
    flex-grow: 1;
  }
`;
