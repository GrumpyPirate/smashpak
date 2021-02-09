import React, { DetailedHTMLProps, FunctionComponent, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

import { inputStyles } from '../../../config/styles';
import { FieldGroup } from '../Field';

type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  className?: string;
  webkitdirectory?: string | boolean;
};

const Input: FunctionComponent<Props> = ({ className, ...rest }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <input className={className} {...rest} />
);

export default styled(Input)`
  ${inputStyles}

  ${FieldGroup} & {
    width: auto;
    flex-grow: 1;
    border-right-style: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`;
