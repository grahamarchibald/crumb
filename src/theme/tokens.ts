// Design tokens from the Crumb handoff (README "Design Tokens")

export const C = {
  canvas: '#EDE7D9',
  screen: '#F6F2E8',
  card: '#FFFDF8',
  insetPanel: '#F4F0E4',
  insetPanelAlt: '#EFE9DA',
  positivePanel: '#EDF2E6',
  negativePanel: '#F6ECE3',

  ink: '#33402A',
  body: '#6E7862',
  body2: '#7A8570',
  muted: '#9AA38C',
  muted2: '#B0A88F',
  heading2: '#4A5540',
  sage: '#8A9578',

  green: '#6B8E5A',
  greenDark: '#557045',
  wheat: '#C9A86A',
  clay: '#B0764C',

  protein: '#6B8E5A',
  carbs: '#C9A86A',
  fat: '#C77B54',

  border: '#EFE9DA',
  border2: '#DDD5C2',
  border3: '#EAE3D3',
  border4: '#D8D0BC',
  borderGreen: '#C7D9B6',
  chipBorder: '#E4DECF',
  chevron: '#CFC7B2',
  trackTexture: '#E7E0CF',
  handle: '#E0D9C7',
  closeBg: '#F1ECDD',
  negFill: '#C9BFA6',
  negTag: '#A99F86',
} as const;

export const F = {
  serif400: 'Newsreader_400Regular',
  serif500: 'Newsreader_500Medium',
  serif600: 'Newsreader_600SemiBold',
  sans400: 'NunitoSans_400Regular',
  sans600: 'NunitoSans_600SemiBold',
  sans700: 'NunitoSans_700Bold',
  sans800: 'NunitoSans_800ExtraBold',
} as const;

export const SHADOW = {
  card: '0 1px 2px rgba(60,50,30,0.05), 0 8px 24px rgba(60,50,30,0.05)',
  libraryCard: '0 1px 2px rgba(60,50,30,0.04)',
  sheet: '0 -12px 40px rgba(40,45,30,0.22)',
  insetRing: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
  insetRingThumb: 'inset 0 0 0 1px rgba(0,0,0,0.05)',
} as const;
