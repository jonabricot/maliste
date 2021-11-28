import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter } from "react-router-dom";
import { globalCss } from '@/stitches.config';

const globalStyles = globalCss({
  '*': { margin: 0, padding: 0, boxSizing: 'border-box', lineHeight: 1.2 },
  body: {
    fontFamily: '$normal',
    background: '$background',
    color: '$text',
    fontSize: '$root',
  },
  'html, body, #root': {
    height: '100%',
    overflow: 'auto'
  }
  // '@import': ['https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;700&display=swap'],
});

globalStyles()

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
