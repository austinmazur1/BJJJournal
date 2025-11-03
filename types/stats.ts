export type StatKey = 
  | 'totalSessions'
  | 'totalTimeTrained'
  | 'sessionsThisMonth'
  | 'sessionsThisWeek'
  | 'averageDuration'
  | 'giVsNoGi'
  | 'mostCommonPartner'
  | 'mostCommonPartnerThisMonth'
  | 'mostCommonArea'
  | 'trainingFrequency'
  | 'mostCommonType'
  | 'favoriteLocation'
  | 'mostCommonProfessor'
  | 'trainingStreak'

export interface StatConfig {
  key: StatKey
  label: string
  description: string
  category: 'overview' | 'training' | 'partners' | 'advanced'
  icon?: string
}

export const STAT_DEFINITIONS: StatConfig[] = [
  {
    key: 'totalSessions',
    label: 'Total Sessions',
    description: 'All-time training sessions',
    category: 'overview',
  },
  {
    key: 'totalTimeTrained',
    label: 'Total Time Trained',
    description: 'Cumulative training time',
    category: 'overview',
  },
  {
    key: 'sessionsThisMonth',
    label: 'Sessions This Month',
    description: 'Training sessions this calendar month',
    category: 'overview',
  },
  {
    key: 'sessionsThisWeek',
    label: 'Sessions This Week',
    description: 'Training sessions this week',
    category: 'overview',
  },
  {
    key: 'averageDuration',
    label: 'Average Session Duration',
    description: 'Average length of training sessions',
    category: 'training',
  },
  {
    key: 'giVsNoGi',
    label: 'Gi vs NoGi',
    description: 'Breakdown of Gi vs NoGi sessions',
    category: 'training',
  },
  {
    key: 'mostCommonArea',
    label: 'Most Common Area',
    description: 'Area you focus on most (Guard, Pass, etc.)',
    category: 'training',
  },
  {
    key: 'trainingFrequency',
    label: 'Training Frequency',
    description: 'Average sessions per week',
    category: 'training',
  },
  {
    key: 'mostCommonType',
    label: 'Most Common Type',
    description: 'Class vs Open Mat vs Other',
    category: 'training',
  },
  {
    key: 'mostCommonPartner',
    label: 'Most Frequent Partner',
    description: 'Your most common training partner (all time)',
    category: 'partners',
  },
  {
    key: 'mostCommonPartnerThisMonth',
    label: 'Top Partner This Month',
    description: 'Most frequent training partner this month',
    category: 'partners',
  },
  {
    key: 'favoriteLocation',
    label: 'Favorite Location',
    description: 'Most visited training location',
    category: 'advanced',
  },
  {
    key: 'mostCommonProfessor',
    label: 'Most Common Professor',
    description: 'Instructor you train with most',
    category: 'advanced',
  },
  {
    key: 'trainingStreak',
    label: 'Current Streak',
    description: 'Consecutive weeks with training',
    category: 'advanced',
  },
]

export interface UserStatsPreferences {
  enabled: StatKey[]
  order?: StatKey[]
}

export const DEFAULT_ENABLED_STATS: StatKey[] = [
  'totalSessions',
  'totalTimeTrained',
  'sessionsThisMonth',
]