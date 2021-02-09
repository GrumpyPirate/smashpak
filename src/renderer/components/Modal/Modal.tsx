import { desaturate, position, rem, size, transparentize } from 'polished';
import React, { FunctionComponent } from 'react';
import { X } from 'react-feather';
import styled, { css } from 'styled-components';

import { appBg } from '../../config/styles';
import Button from '../Forms/Button/Button';

type Props = {
  isActive: boolean;
  close: () => void;
};

const CloseButton = styled(Button)`
  position: absolute;
  top: ${rem(16)};
  right: ${rem(16)};
  background: 0;
  border: none;
  z-index: 1;

  > svg {
    display: block;
    width: ${rem(24)};
    height: ${rem(24)};
    fill: currentColor;
  }
`;

const Content = styled.div`
  ${position('absolute', 32, 32)}
  ${size(`calc(100% - ${rem(64)})`, `calc(100% - ${rem(64)})`)}
  background-color: ${appBg};
  border-radius: ${rem(6)};
  padding: ${rem(32)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Wrapper = styled.div<{ isActive: boolean }>`
  ${position('absolute', 0, 0)}
  ${size('100%')}
  background-color: ${transparentize(0.5)(desaturate(0.5)(appBg))};
  text-align: center;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transition-property: visibility, opacity;
  transition-duration: 0.2s;
  z-index: 1;

  ${({ isActive }) =>
    isActive &&
    css`
      visibility: visible;
      opacity: 1;
      pointer-events: auto;
    `}
`;

const Modal: FunctionComponent<Props> = ({ isActive, children, close }) => (
  <Wrapper isActive={isActive}>
    <Content>
      <CloseButton type="button" onClick={close}>
        <X />
      </CloseButton>
      {children}
    </Content>
  </Wrapper>
);

export default Modal;
