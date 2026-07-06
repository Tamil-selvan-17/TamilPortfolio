export const TILE = 48
export const MAP_COLS = 40
export const MAP_ROWS = 32
export const MAP_W = MAP_COLS * TILE   // 1920
export const MAP_H = MAP_ROWS * TILE   // 1536

export type SectionKey =
  | 'about'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'contact'
  | 'resume'
  | 'secret'

export interface BuildingConfig {
  id: SectionKey
  label: string
  icon: string
  color: string
  glowColor: string
  tileX: number
  tileY: number
  widthTiles: number
  heightTiles: number
  doorTileX: number   // relative column of door
  doorTileY: number   // relative row — always bottom row
  floatIcon: string
}

export interface NPCConfig {
  id: string
  name: string
  color: string
  tileX: number
  tileY: number
  dialog: string[]
  wanderRadius: number
}

export interface CollectibleConfig {
  id: string
  type: 'coin' | 'star' | 'key'
  tileX: number
  tileY: number
}

export interface AchievementConfig {
  id: string
  name: string
  description: string
  icon: string
  secret?: boolean
}

export const BUILDINGS: BuildingConfig[] = [
  {
    id: 'about',
    label: 'About Me',
    icon: '👤',
    color: '#4ade80',
    glowColor: '#22c55e',
    tileX: 3,
    tileY: 4,
    widthTiles: 5,
    heightTiles: 4,
    doorTileX: 2,
    doorTileY: 3,
    floatIcon: '👤',
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: '⚡',
    color: '#60a5fa',
    glowColor: '#3b82f6',
    tileX: 12,
    tileY: 4,
    widthTiles: 5,
    heightTiles: 4,
    doorTileX: 2,
    doorTileY: 3,
    floatIcon: '⚡',
  },
  {
    id: 'experience',
    label: 'Experience',
    icon: '💼',
    color: '#f59e0b',
    glowColor: '#d97706',
    tileX: 3,
    tileY: 14,
    widthTiles: 5,
    heightTiles: 4,
    doorTileX: 2,
    doorTileY: 3,
    floatIcon: '💼',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: '🚀',
    color: '#a78bfa',
    glowColor: '#8b5cf6',
    tileX: 12,
    tileY: 14,
    widthTiles: 5,
    heightTiles: 4,
    doorTileX: 2,
    doorTileY: 3,
    floatIcon: '🚀',
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: '✉️',
    color: '#f472b6',
    glowColor: '#ec4899',
    tileX: 21,
    tileY: 14,
    widthTiles: 5,
    heightTiles: 4,
    doorTileX: 2,
    doorTileY: 3,
    floatIcon: '✉️',
  },
  {
    id: 'resume',
    label: 'Resume',
    icon: '📄',
    color: '#34d399',
    glowColor: '#10b981',
    tileX: 21,
    tileY: 4,
    widthTiles: 5,
    heightTiles: 4,
    doorTileX: 2,
    doorTileY: 3,
    floatIcon: '📄',
  },
  {
    id: 'secret',
    label: 'Secret Cave',
    icon: '❓',
    color: '#e2e8f0',
    glowColor: '#94a3b8',
    tileX: 34,
    tileY: 2,
    widthTiles: 4,
    heightTiles: 3,
    doorTileX: 1,
    doorTileY: 2,
    floatIcon: '❓',
  },
]

export const NPCS: NPCConfig[] = [
  {
    id: 'npc1',
    name: 'Guide',
    color: '#fbbf24',
    tileX: 8,
    tileY: 9,
    wanderRadius: 2,
    dialog: [
      "Yo! Welcome to Portfolio Quest! 🎮",
      "Don't just stand there — use WASD or Arrow Keys!",
      "Walk into those glowing buildings. Trust me, it's worth it. 🔥",
    ],
  },
  {
    id: 'npc2',
    name: 'Dev Fan',
    color: '#34d399',
    tileX: 17,
    tileY: 9,
    wanderRadius: 2,
    dialog: [
      "Did you see his Angular code? It's dangerously clean. 🚀",
      "He built VMS and managed 300+ freelancers with it!",
      "Go check the Projects building before it blows up! 💥",
    ],
  },
  {
    id: 'npc3',
    name: 'Tech Sage',
    color: '#a78bfa',
    tileX: 8,
    tileY: 19,
    wanderRadius: 2,
    dialog: [
      ".NET Core backend + Angular frontend... a legendary combo.",
      "They say his servers haven't gone down since the Mesozoic era. 🦖",
      "His Skills page is basically a cheat code. Go look! ⚡",
    ],
  },
  {
    id: 'npc4',
    name: 'Recruiter',
    color: '#f472b6',
    tileX: 26,
    tileY: 9,
    wanderRadius: 3,
    dialog: [
      "I'm literally throwing offers at the screen right now. 💸",
      "Docker, Redis, Cloud... he's got the full Infinity Gauntlet!",
      "Slide into his DMs — hit the Contact building! ✉️",
    ],
  },
  {
    id: 'npc5',
    name: 'Traveler',
    color: '#fb923c',
    tileX: 30,
    tileY: 20,
    wanderRadius: 3,
    dialog: [
      "Listen closely... there's a Secret Cave hidden in the northeast. 🗝️",
      "Only the worthy (who collect stars and keys) can enter.",
      "Go claim your easter egg, champion! 🥚",
    ],
  },
]

export const COLLECTIBLES: CollectibleConfig[] = [
  { id: 'coin1',  type: 'coin', tileX: 6,  tileY: 10 },
  { id: 'coin2',  type: 'coin', tileX: 15, tileY: 11 },
  { id: 'coin3',  type: 'coin', tileX: 20, tileY: 6  },
  { id: 'coin4',  type: 'coin', tileX: 25, tileY: 17 },
  { id: 'coin5',  type: 'coin', tileX: 10, tileY: 20 },
  { id: 'coin6',  type: 'coin', tileX: 18, tileY: 22 },
  { id: 'coin7',  type: 'coin', tileX: 30, tileY: 12 },
  { id: 'coin8',  type: 'coin', tileX: 33, tileY: 18 },
  { id: 'coin9',  type: 'coin', tileX: 7,  tileY: 23 },
  { id: 'coin10', type: 'coin', tileX: 22, tileY: 28 },
  { id: 'star1',  type: 'star', tileX: 11, tileY: 7  },
  { id: 'star2',  type: 'star', tileX: 28, tileY: 6  },
  { id: 'star3',  type: 'star', tileX: 16, tileY: 24 },
  { id: 'key1',   type: 'key',  tileX: 32, tileY: 7  },
]

export const ACHIEVEMENTS: AchievementConfig[] = [
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Visit all 6 main buildings',
    icon: '🗺️',
  },
  {
    id: 'project_hunter',
    name: 'Project Hunter',
    description: 'View all 3 projects',
    icon: '🔍',
  },
  {
    id: 'completed',
    name: 'Portfolio Complete',
    description: 'Discover every section',
    icon: '🏆',
  },
  {
    id: 'secret_finder',
    name: 'Secret Finder',
    description: 'Find the hidden cave',
    icon: '🕵️',
    secret: true,
  },
  {
    id: 'collector',
    name: 'Collector',
    description: 'Collect 10 coins',
    icon: '🪙',
  },
  {
    id: 'speedrunner',
    name: 'Speedrunner',
    description: 'Sprint for 5 seconds total',
    icon: '⚡',
  },
  {
    id: 'social',
    name: 'Social Butterfly',
    description: 'Talk to all 5 NPCs',
    icon: '💬',
  },
]

export const PLAYER_SPEED = 3.5
export const PLAYER_SPRINT_SPEED = 6.5
export const DAY_NIGHT_CYCLE_MS = 5 * 60 * 1000  // 5 minutes

export const SPAWN_TILE_X = 14
export const SPAWN_TILE_Y = 11
