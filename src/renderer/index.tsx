import React from 'react';
import { render } from 'react-dom';

import App from './components/App/App';

import 'sanitize.css';
import 'sanitize.css/typography.css';

render(<App />, document.getElementById('app'));
