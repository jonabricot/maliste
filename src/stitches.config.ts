import { createStitches } from '@stitches/react';

export const nordColors = {
  nord_0: '#242933',
  nord0: '#2e3440',
  nord1: '#3b4252',
  nord2: '#434c5e',
  nord3: '#4c566a',
  nord4: '#d8dee9',
  nord5: '#e5e9f0',
  nord6: '#eceff4',
  nord7: '#8fbcbb',
  nord8: '#88c0d0',
  nord9: '#81a1c1',
  nord10: '#5e81ac',
  nord11: '#bf616a',
  nord12: '#d08770',
  nord13: '#ebcb8b',
  nord14: '#a3be8c',
  nord15: '#b48ead',
}

export const breakpoints = {
  tablet: '500px',
  laptop: '1000px',
  desktop: '1500px',
}

function generateMediaQueries(breakpoints) {
  let queries = {}
  for (let key in breakpoints) {
    let value = breakpoints[key]
    queries[key] = `(min-width: ${value})`
  }
  return queries
}

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      ...nordColors,
      background: '$nord_0',
      foreground: nordColors.nord0,
      active: nordColors.nord2,
      text: nordColors.nord6,
      
      danger: nordColors.nord11,
      success: nordColors.nord14,
      warning: nordColors.nord12,
      
      default: nordColors.nord2,
      primary: nordColors.nord8,
      secondary: nordColors.nord9,
      tertiary: nordColors.nord10,
    },
    space: {
      tiny: '.25rem',
      small: '.5rem',
      normal: '1rem',
      medium: '1.5rem',
      large: '2rem',
      big: '3rem',
      huge: '5rem',
    },
    fontSizes: {
      root: '16px',
      tiny: '.25rem',
      small: '.5rem',
      normal: '1rem',
      medium: '1.5rem',
      large: '2rem',
      big: '3rem',
      huge: '5rem',
    },
    sizes: {
      tiny: '.25rem',
      small: '.5rem',
      normal: '1rem',
      medium: '1.5rem',
      large: '2rem',
      big: '3rem',
      huge: '5rem',
    },
    fonts: {
      normal: 'Rubik, apple-system, sans-serif',
      mono: 'Söhne Mono, menlo, monospace',
    },
    radii: {
      normal: '.5rem'
    },
    shadows: {
      normal: '0px 3px 6px 0px'
    }
  },
  media: generateMediaQueries(breakpoints),
});