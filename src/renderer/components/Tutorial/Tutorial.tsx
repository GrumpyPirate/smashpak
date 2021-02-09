/* eslint-disable react/jsx-one-expression-per-line */
import { rem } from 'polished';
import React, { FunctionComponent, useState } from 'react';
import { useLocalStorage } from 'react-use';
import styled from 'styled-components';

import pkg from '../../../../package.json';
import tutorialImage1 from '../../assets/images/tutorial-1.png';
import Button from '../Forms/Button/Button';
import Checkbox from '../Forms/Checkbox/Checkbox';

type Props = {
  close: () => void;
};

const CloseButton = styled(Button)`
  margin-top: ${rem(16)};
  width: auto;
`;

const ListItemTitle = styled.span`
  display: inline-block;
  margin-bottom: ${rem(16)};
`;

const TutorialImage = styled.img`
  border-radius: ${rem(6)};
  display: block;
  width: 25%;
  height: auto;
  margin: 0 auto;
`;

const ListItem = styled.li`
  &:not(:last-child) {
    margin-bottom: ${rem(16)};
  }
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style-position: inside;
`;

const Title = styled.h2`
  margin: 0;
  text-align: center;
`;

const Tutorial: FunctionComponent<Props> = ({ close }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [, storeDontShowAgain] = useLocalStorage<boolean>('skipTutorial');

  return (
    <>
      <Title>How to use</Title>

      <List>
        <ListItem>
          <ListItemTitle>
            Prepare your source files, by organising them into a folder like so:
          </ListItemTitle>
          <TutorialImage alt="" src={tutorialImage1} />
        </ListItem>
        <ListItem>
          Tell {pkg.productName} where this source folder is, either by selecting it manually, or by
          dragging and dropping it onto the window.
          <br />
          By default, {pkg.productName} will place your generated packs in an adjacent{' '}
          <code>./size-packs</code> folder, though this can be customised.
        </ListItem>
        <ListItem>Hit Generate 🚀</ListItem>
      </List>
      <p>
        <small>
          Note - Relax, {pkg.productName} won&apos;t modify your source files in any way! It simply
          reads from them and makes resized copies.
        </small>
      </p>
      <CloseButton
        type="button"
        onClick={() => {
          if (dontShowAgain) {
            storeDontShowAgain(true);
          }

          close();
        }}
      >
        Got it
      </CloseButton>
      <div>
        <Checkbox
          checkboxId="checkbox--dont-show-again"
          checked={dontShowAgain}
          onChange={() => {
            setDontShowAgain(!dontShowAgain);
          }}
        >
          Don&apos;t show this again
        </Checkbox>
      </div>
    </>
  );
};

export default Tutorial;
