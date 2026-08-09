// ============================================================
//  Cloud Cassette — Station Configuration (9 Stations)
//
//  mobileFocal: CSS objectPosition value (e.g. '20% 50%').
//    Stored as plain CSS so it's applied via inline style and
//    avoids Tailwind's build-time purging of arbitrary values.
//
//  audioSrc: local path in /public/audio/tracks/
//  videoBg:  local path in /public/backgrounds/
// ============================================================

export const STATIONS = [
  {
    id: 'raining-on-street',
    name: '01. Rainy Alleyway',
    genre: 'Cozy Rain & Chillhop',
    badge: '🌧️ Rainy Beats',
    audioSrc: '/audio/tracks/01-raining-on-street.mp3',
    videoBg: '/backgrounds/raining-on-street.webm',
    mobileFocal: '50% 50%',
    accentColor: '#A8D8EA',
  },
  {
    id: 'lakeside-cabin',
    name: '02. Lakeside Glass Cabin',
    genre: 'Acoustic Chords & Rain',
    badge: '🏡 Fireside Studio',
    audioSrc: '/audio/tracks/11-workspace.mp3',
    videoBg: '/backgrounds/lakeside-cabin.webm',
    mobileFocal: '50% 50%',
    accentColor: '#F8B088',
  },
  {
    id: 'char-gaming',
    name: '03. Pixel Gamer Room',
    genre: 'Cozy Nostalgia & Beats',
    badge: '🎮 Pixel Warmth',
    audioSrc: '/audio/tracks/08-char-gaming.mp3',
    videoBg: '/backgrounds/char-gaming.webm',
    mobileFocal: '20% 50%',
    accentColor: '#F4B5C6',
  },
  {
    id: 'misty-church',
    name: '04. Crimson Sanctuary',
    genre: 'Dark & Atmospheric Lofi',
    badge: '⛪ Misty Chords',
    audioSrc: '/audio/tracks/04-church.mp3',
    videoBg: '/backgrounds/misty-church.webm',
    mobileFocal: '65% 50%',
    accentColor: '#E88D72',
  },
  {
    id: 'cyber-city',
    name: '05. Cyberpunk Rooftops',
    genre: 'Synthwave & Midnight Beats',
    badge: '👾 Neon Alley',
    audioSrc: '/audio/tracks/05-cyber-city.mp3',
    videoBg: '/backgrounds/cyber-city.webm',
    mobileFocal: '35% 50%',
    accentColor: '#FFB7B2',
  },
  {
    id: 'avatar-sky',
    name: '06. Sky Bison Flight',
    genre: 'Celestial & Floating Ambient',
    badge: '🌙 Moonlit Glide',
    audioSrc: '/audio/tracks/02-avatar.mp3',
    videoBg: '/backgrounds/avatar-sky.webm',
    mobileFocal: '50% 50%',
    accentColor: '#C3B1E1',
  },
  {
    id: 'green-scenery',
    name: '07. Meadow Horizon',
    genre: 'Acoustic & Nature Lofi',
    badge: '🍃 Peaceful Fields',
    audioSrc: '/audio/tracks/06-green-scenery.mp3',
    videoBg: '/backgrounds/green-scenery.webm',
    mobileFocal: '65% 50%',
    accentColor: '#98B682',
  },
  {
    id: 'messy-room',
    name: '08. Messy Pixel Bedroom',
    genre: 'Messy Room & Soft Beats',
    badge: '🛏️ Lived-in Haven',
    audioSrc: '/audio/tracks/09-room.mp3',
    videoBg: '/backgrounds/messy-room.webm',
    mobileFocal: '75% 50%',
    accentColor: '#E9C46A',
  },
  {
    id: 'snowy-temple',
    name: '09. Winter Shrine',
    genre: 'Cold Chill & Quiet Snow',
    badge: '❄️ Falling Snow',
    audioSrc: '/audio/tracks/10-snowy.mp3',
    videoBg: '/backgrounds/snowy-temple.webm',
    mobileFocal: '50% 50%',
    accentColor: '#B5EAD7',
  },
];

// ── Helper: extract just the emoji character from a badge string ──
// e.g. '🌧️ Rainy Beats' → '🌧️'
export const getBadgeEmoji = (badge = '') => badge.split(' ')[0] ?? '🎵';

// ============================================================
//  Ambient Sound Configuration
// ============================================================
export const AMBIENT_TRACKS = [
  {
    id: 'rain',
    label: 'Rain',
    emoji: '🌧️',
    src: '/audio/ambient/rain.mp3',
    fallbackSrc: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8f6c6e1bd.mp3',
  },
  {
    id: 'cafe',
    label: 'Café Noise',
    emoji: '☕',
    src: '/audio/ambient/cafe.mp3',
    fallbackSrc: 'https://cdn.pixabay.com/audio/2022/03/15/audio_3c0e35cd4e.mp3',
  },
  {
    id: 'fire',
    label: 'Fireplace',
    emoji: '🔥',
    src: '/audio/ambient/fire.mp3',
    fallbackSrc: 'https://cdn.pixabay.com/audio/2022/03/09/audio_7d99a9c479.mp3',
  },
];