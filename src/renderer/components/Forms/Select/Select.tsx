import { rem } from 'polished';
import styled from 'styled-components';

import { inputPaddingX, inputStyles } from '../../../config/styles';

const Select = styled.select`
  ${inputStyles}
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FBFBFC' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-down'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position: right ${rem(inputPaddingX)} center;
  background-size: 1em;
`;

export default Select;
