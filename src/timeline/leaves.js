// The leaves that grow from the timeline's line, one for each thing noted on
// a day: drawn like the petals of the eight forms on the Game B page (a soft
// watercolour shape with a fine ink edge and veins), each kind with a shape
// of its own, so a meteor shower is a starry leaf and an eclipse a crescent.
// Each grows from its base at (0, 0) upwards, in a 32 × 34 box.
export const LEAVES = {
  // a local happening: an almond leaf with its midrib
  gathering: {
    pigment: '#d7745c',
    shape: 'M0 0 C-11 -8 -12 -22 0 -31 C12 -22 11 -8 0 0Z',
    veins: ['M0 -2 L0 -27', 'M0 -9 L-6 -14', 'M0 -9 L6 -14', 'M0 -16 L-5 -21', 'M0 -16 L5 -21'],
  },
  // a quest or a project: a rounder leaf
  hex: {
    pigment: '#c25a72',
    shape: 'M0 0 C-14 -5 -15 -24 0 -30 C15 -24 14 -5 0 0Z',
    veins: ['M0 -2 L0 -26', 'M0 -10 L-7 -15', 'M0 -10 L7 -15'],
  },
  // a note
  note: {
    pigment: '#cf8a4f',
    shape: 'M0 0 C-9 -9 -10 -22 2 -30 C11 -20 9 -8 0 0Z',
    veins: ['M0 -2 Q1 -15 2 -26'],
  },
  // the sun turning: a round leaf, its veins like rays
  sun: {
    pigment: '#e3b04f',
    shape: 'M0 -2 C-13 -2 -14 -28 0 -28 C14 -28 13 -2 0 -2Z',
    veins: ['M0 -15 L0 -24', 'M0 -15 L7 -20', 'M0 -15 L8 -12', 'M0 -15 L0 -6', 'M0 -15 L-8 -12', 'M0 -15 L-7 -20'],
  },
  // the sky's lights (meteors, a comet): a starry leaf
  star: {
    pigment: '#dcb25c',
    shape: 'M0 -1 Q-3 -9 -11 -10 Q-5 -15 -8 -23 Q-1 -19 0 -30 Q1 -19 8 -23 Q5 -15 11 -10 Q3 -9 0 -1Z',
    veins: ['M0 -4 L0 -24', 'M0 -14 L-7 -11', 'M0 -14 L7 -11'],
  },
  // an eclipse: a crescent leaf
  moon: {
    pigment: '#7d8bb0',
    shape: 'M2 -1 C-14 -4 -14 -27 4 -30 C-6 -22 -6 -8 2 -1Z',
    veins: ['M1 -3 Q-7 -15 3 -27'],
  },
  // the wider world, seeing ahead: a slender willow leaf
  vision: {
    pigment: '#8fae6b',
    shape: 'M0 0 C-7 -10 -7 -24 0 -32 C7 -24 7 -10 0 0Z',
    veins: ['M0 -2 L0 -29', 'M0 -12 L-3 -16', 'M0 -12 L3 -16', 'M0 -20 L-3 -24', 'M0 -20 L3 -24'],
  },
  // the wheel of the year (the solstices, equinoxes and the days between):
  // a round leaf with eight spokes for veins
  wheel: {
    pigment: '#c9a54a',
    shape: 'M0 -1 C-14 -1 -15 -29 0 -29 C15 -29 14 -1 0 -1Z',
    veins: ['M0 -15 L0 -26', 'M0 -15 L8 -23', 'M0 -15 L11 -15', 'M0 -15 L8 -7', 'M0 -15 L0 -4', 'M0 -15 L-8 -7', 'M0 -15 L-11 -15', 'M0 -15 L-8 -23'],
  },
  // a bonfire night: a flame-shaped leaf
  fire: {
    pigment: '#e0703a',
    shape: 'M0 0 C-12 -4 -10 -16 -3 -22 C-4 -16 0 -14 1 -18 C2 -24 0 -28 4 -32 C6 -24 12 -18 10 -8 C9 -3 5 0 0 0Z',
    veins: ['M0 -2 Q3 -12 2 -22'],
  },
  // an open question, still to be decided: a speech-bubble leaf
  question: {
    pigment: '#a9c6dc',
    shape: 'M-1 0 L1 -6 C-9 -6 -13 -13 -11 -20 C-9 -28 9 -28 11 -20 C13 -13 9 -6 4 -6Z',
    veins: ['M-3 -19 C-3 -24 4 -24 4 -20 C4 -17 0 -17 0 -13', 'M0 -10 L0 -9.6'],
  },
  // the land's time: a lobed oak leaf
  eco: {
    pigment: '#7fa65a',
    shape: 'M0 0 C-4 -3 -9 -4 -8 -9 C-12 -11 -11 -15 -7 -16 C-10 -20 -7 -25 -3 -23 C-3 -28 3 -28 3 -23 C7 -25 10 -20 7 -16 C11 -15 12 -11 8 -9 C9 -4 4 -3 0 0Z',
    veins: ['M0 -2 L0 -24', 'M0 -9 L-6 -12', 'M0 -9 L6 -12', 'M0 -16 L-5 -19', 'M0 -16 L5 -19'],
  },
  // relational time: a heart-shaped leaf
  heart: {
    pigment: '#c25a72',
    shape: 'M0 -2 C-14 -10 -12 -26 -4 -26 C-1 -26 0 -23 0 -21 C0 -23 1 -26 4 -26 C12 -26 14 -10 0 -2Z',
    veins: ['M0 -4 L0 -20', 'M0 -12 L-5 -16', 'M0 -12 L5 -16'],
  },
};
export const leafFor = (symbol) => LEAVES[symbol] ?? LEAVES.gathering;
