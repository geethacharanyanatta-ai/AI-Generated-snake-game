/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber City Nights',
    artist: 'SynthWave AI',
    cover: 'https://picsum.photos/seed/cyber1/400/400',
    audioUrl: '#',
    duration: 180,
  },
  {
    id: '2',
    title: 'Grid Runner',
    artist: 'Digital Velocity',
    cover: 'https://picsum.photos/seed/grid2/400/400',
    audioUrl: '#',
    duration: 215,
  },
  {
    id: '3',
    title: 'Digital Mirage',
    artist: 'Ethereal Bits',
    cover: 'https://picsum.photos/seed/mirage3/400/400',
    audioUrl: '#',
    duration: 154,
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const MIN_SPEED = 60;
export const SPEED_INCREMENT = 2;
