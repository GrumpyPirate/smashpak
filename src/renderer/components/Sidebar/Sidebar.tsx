/* eslint-disable react/jsx-one-expression-per-line */
import { mix, rem } from 'polished';
import React, { FunctionComponent, useContext } from 'react';
import { Info } from 'react-feather';
import styled from 'styled-components';

import pkg from '../../../../package.json';
import logo from '../../assets/images/hammer.png';
import { appBg, gutter, palette } from '../../config/styles';
import { OptionsContext, ResourcePackSize } from '../../context-providers/OptionsContext';
import {
  Field,
  FieldHelp,
  FieldHelpButton,
  FieldHelpText,
  FieldLabel,
  FieldLabelText,
} from '../Forms/Field';
import Input from '../Forms/Input/Input';
import Select from '../Forms/Select/Select';

const Brand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BrandDivider = styled.hr`
  margin: ${rem(20)} ${rem(16)} ${rem(32)};
  border-width: ${rem(1)};
  border-style: none none solid;
  border-color: ${mix(0.25)(palette.lightShades)(palette.darkShades)};
`;

const Logo = styled.img`
  height: ${rem(48)};
  width: auto;
  margin-right: ${rem(4)};
`;

const Title = styled.h1`
  color: #fff;
  font-size: ${rem(16)};
  line-height: 1;
  margin: ${rem(6)} 0 0;
`;

const ListItem = styled.li`
  &:not(:last-of-type) {
    ${Field} {
      margin-bottom: ${rem(32)};
    }
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Wrapper = styled.aside`
  padding: ${rem(24)} ${rem(gutter)};
  background-color: ${appBg};
`;

const Sidebar: FunctionComponent = () => {
  const [{ packName, initialSize }, setOptions] = useContext(OptionsContext);

  return (
    <Wrapper>
      <Brand>
        <Logo src={logo} alt="" />
        <Title>{pkg.productName}</Title>
      </Brand>

      <BrandDivider />

      <List>
        <ListItem>
          <Field>
            <FieldLabel htmlFor="field__pack-name">
              <FieldLabelText>Resource Pack Name</FieldLabelText>
              <FieldHelp>
                <FieldHelpButton aria-label="More information">
                  <Info />
                </FieldHelpButton>
                <FieldHelpText>
                  This will be used when naming the generated zip files.
                </FieldHelpText>
              </FieldHelp>
              <Input
                type="text"
                id="field__pack-name"
                placeholder="e.g. BetterPickaxes"
                onChange={(e) => {
                  setOptions({ packName: e.target.value });
                }}
                defaultValue={packName}
              />
            </FieldLabel>
          </Field>
        </ListItem>
        <ListItem>
          <Field>
            <FieldLabel htmlFor="field__initial-size">
              <FieldLabelText>Initial Size</FieldLabelText>
              <FieldHelp>
                <FieldHelpButton aria-label="More information">
                  <Info />
                </FieldHelpButton>
                <FieldHelpText>
                  <p>The resolution of the source files in your resource pack.</p>
                  <p>
                    {pkg.productName} will attempt to detect this when you select the source
                    directory.
                  </p>
                </FieldHelpText>
              </FieldHelp>
              <Select
                id="field__initial-size"
                value={initialSize}
                onChange={(e) => {
                  const parsedValue = parseInt(e.target.value, 10);

                  setOptions({
                    initialSize: !Number.isNaN(parsedValue)
                      ? (parsedValue as ResourcePackSize)
                      : undefined,
                  });
                }}
              >
                <>
                  <option value="none">---</option>
                  {[...Array(5)].map((_, i) => {
                    const size = 512 / 2 ** i;

                    return (
                      <option key={size} value={String(size)}>
                        {`${size}x`}
                      </option>
                    );
                  })}
                </>
              </Select>
            </FieldLabel>
          </Field>
        </ListItem>
        <ListItem>
          <Field>
            <FieldLabel htmlFor="field__resize-count">
              <FieldLabelText># of times to resize</FieldLabelText>
              <FieldHelp>
                <FieldHelpButton aria-label="More information">
                  <Info />
                </FieldHelpButton>
                <FieldHelpText>
                  Your source designs will be resized down this many times, inclusive.
                  <br />
                  <br />
                  For example, a set of 512x designs resized 5 times will generate 512x, 256x, 128x,
                  64x and 32x size packs.
                  <br />
                  <br />A set of 128x designs resized 2 times will generate 128x and 64x size packs.
                </FieldHelpText>
              </FieldHelp>
              <Input
                id="field__resize-count"
                type="number"
                step="1"
                min="1"
                max="5"
                onChange={(e) => {
                  const parsedValue = parseInt(e.target.value, 10);

                  setOptions({
                    resizeCount: !Number.isNaN(parsedValue)
                      ? (parsedValue as ResourcePackSize)
                      : undefined,
                  });
                }}
              />
            </FieldLabel>
          </Field>
        </ListItem>
      </List>
    </Wrapper>
  );
};

export default Sidebar;
