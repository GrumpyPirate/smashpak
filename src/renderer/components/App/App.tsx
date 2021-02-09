import { rem } from 'polished';
import React, { FunctionComponent, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useLocalStorage } from 'react-use';
import styled, { createGlobalStyle } from 'styled-components';

import ComfortaaLightTTF from '../../assets/fonts/Comfortaa/static/Comfortaa-Light.ttf';
import ComfortaaLightWOFF from '../../assets/fonts/Comfortaa/static/Comfortaa-Light.woff';
import ComfortaaMediumTTF from '../../assets/fonts/Comfortaa/static/Comfortaa-Medium.ttf';
import ComfortaaMediumWOFF from '../../assets/fonts/Comfortaa/static/Comfortaa-Medium.woff';
import ComfortaaRegularTTF from '../../assets/fonts/Comfortaa/static/Comfortaa-Regular.ttf';
import ComfortaaRegularWOFF from '../../assets/fonts/Comfortaa/static/Comfortaa-Regular.woff';
import SourceSansProLightTTF from '../../assets/fonts/Source_Sans_Pro/SourceSansPro-Light.ttf';
import SourceSansProLightWOFF from '../../assets/fonts/Source_Sans_Pro/SourceSansPro-Light.woff';
import SourceSansProRegularTTF from '../../assets/fonts/Source_Sans_Pro/SourceSansPro-Regular.ttf';
import SourceSansProRegularWOFF from '../../assets/fonts/Source_Sans_Pro/SourceSansPro-Regular.woff';
import SourceSansProSemiBoldTTF from '../../assets/fonts/Source_Sans_Pro/SourceSansPro-SemiBold.ttf';
import SourceSansProSemiBoldWOFF from '../../assets/fonts/Source_Sans_Pro/SourceSansPro-SemiBold.woff';
import { appBg, fontSmoothingAntialiased } from '../../config/styles';
import OptionsContextProvider from '../../context-providers/OptionsContext';
import Modal from '../Modal/Modal';
import Sidebar from '../Sidebar/Sidebar';
import Tutorial from '../Tutorial/Tutorial';
import WorkArea from '../WorkArea/WorkArea';

const GlobalStyle = createGlobalStyle`
  /* Comfortaa (Headings) */
  @font-face {
    font-family: 'Comfortaa';
    font-weight: 300;
    src: url(${ComfortaaLightWOFF}) format('woff'),
        url(${ComfortaaLightTTF}) format('truetype');
  }

  @font-face {
    font-family: 'Comfortaa';
    font-weight: normal;
    src: url(${ComfortaaRegularWOFF}) format('woff'),
        url(${ComfortaaRegularTTF}) format('truetype');
  }

  @font-face {
    font-family: 'Comfortaa';
    font-weight: 500;
    src: url(${ComfortaaMediumWOFF}) format('woff'),
        url(${ComfortaaMediumTTF}) format('truetype');
  }

  /* Source Sans Pro (Body copy) */
  @font-face {
    font-family: 'Source Sans Pro';
    font-weight: 300;
    src: url(${SourceSansProLightWOFF}) format('woff'),
        url(${SourceSansProLightTTF}) format('truetype');
  }

  @font-face {
    font-family: 'Source Sans Pro';
    font-weight: normal;
    src: url(${SourceSansProRegularWOFF}) format('woff'),
        url(${SourceSansProRegularTTF}) format('truetype');
  }

  @font-face {
    font-family: 'Source Sans Pro';
    font-weight: 600;
    src: url(${SourceSansProSemiBoldWOFF}) format('woff'),
        url(${SourceSansProSemiBoldTTF}) format('truetype');
  }

  body {
    background-color: #fff;
    font-family: 'Source Sans Pro', sans-serif;
  }

  strong, b {
    font-weight: 600;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    ${fontSmoothingAntialiased}
    font-family: 'Comfortaa', cursive;
    font-weight: 500;
    margin-top: 0;
  }

  pre, code {
    font-size: 0.75em;
  }
`;

const Main = styled.main`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: ${rem(240)} auto;
  background-color: ${appBg};
  color: #fff;
  user-select: none;
`;

const App: FunctionComponent = () => {
  const [skipTutorial] = useLocalStorage<boolean>('skipTutorial');
  const [isTutorialOpen, setIsTutorialOpen] = useState(!skipTutorial);

  const closeTutorialModal = () => {
    setIsTutorialOpen(false);
  };

  return (
    <OptionsContextProvider>
      <GlobalStyle />
      <Main>
        <Modal close={closeTutorialModal} isActive={isTutorialOpen}>
          <Tutorial close={closeTutorialModal} />
        </Modal>

        <Sidebar />

        <DndProvider backend={HTML5Backend}>
          <WorkArea />
        </DndProvider>
      </Main>
    </OptionsContextProvider>
  );
};

export default App;
