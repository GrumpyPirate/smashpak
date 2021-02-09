/* eslint-disable react/jsx-props-no-spreading */
import { rem } from 'polished';
import React, { FunctionComponent, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  checkboxId: string;
};

const LabelText = styled.span`
  font-size: ${rem(16)};
`;
const Label = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
`;
const Input = styled.input`
  margin-left: ${rem(4)};
`;

const Checkbox: FunctionComponent<Props> = ({ checkboxId, children, ...rest }) => (
  <Label>
    <LabelText>{children}</LabelText>
    <Input {...rest} type="checkbox" />
  </Label>
);

export default Checkbox;
