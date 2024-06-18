// TODO: write documentation for colors and palette in own markdown file and add links from here

const palette = {
  white: '#ffffff',
  white_muted: 'rgba(255, 255, 255, 0.5)',
  black: '#000000',
  black_muted: 'rgba(0, 0, 0, 0.5)',
  black_muted2: 'rgba(0, 0, 0, 0.)',

  dark: '#1E283C',
  grey: '#495361',
  light: '#A2A4AA',

  black_dark: '#0c1117',

  green_dark: '#379a29',
  green: '#41B530',
  green_light: '#5ec04f',

  blues_dark: '#62A8D2',
  blues: '#3160b0',
  blues_light: '#26A9FC',

  yellow_dark: '#d5ac00',
  yellow: 'rgb(253,224,71)',
  yellow_light: '#fcd226',

  red_dark: '#c92b40',
  red: '#ED334B',
  red_light: '#f05266',

  blue_dark: '#1461d1',
  blue: '#1872F6',
  blue_light: '#c6dcfd',

  blue_pastel_dark: '#3774A8',
  blue_pastel: '#4A98DB',
  blue_pastel_light: '#57B2FF',

  orange_dark: '#d9691c',
  orange: '#FF7B21',
  orange_light: '#ff8f42',

  gold: '#5385bd'
};

export const colors = Object.assign({}, palette, {
  transparent: 'rgba(0, 0, 0, 0)',

  text: palette.white,

  textDim: palette.white_muted,

  background: '#D8E0EF',

  error: '#e52937',

  danger: palette.red,

  card: '#0c1117',
  warning: palette.blue_pastel,
  primary: palette.blues,

  bg2: '#0c1117',
  bg3: '#434242',
  bg4: '#35373b',
  bg5: '#212f40',

  border: 'rgba(255,255,255,0.1)',

  icon_blue: '#1872F6'
});

export type ColorTypes = keyof typeof colors;
