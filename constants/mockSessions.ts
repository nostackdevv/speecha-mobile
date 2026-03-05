type MockSession = {
  clarityScore: number;
  date: string;
  durationSeconds: number;
  fillerCount: number;
  fillersPerMinute: number;
  id: string;
  title: string;
  type: 'prompt' | 'random';
};

export const MOCK_SESSIONS: MockSession[] = [
  {
    clarityScore: 88,
    date: '2026-02-25T10:24:00.000Z',
    durationSeconds: 59,
    fillerCount: 3,
    fillersPerMinute: 3.1,
    id: '1',
    title: 'Interview',
    type: 'prompt',
  },
  {
    clarityScore: 72,
    date: '2026-02-24T04:24:00.000Z',
    durationSeconds: 192,
    fillerCount: 5,
    fillersPerMinute: 1.6,
    id: '2',
    title: 'Presentation',
    type: 'prompt',
  },
  {
    clarityScore: 65,
    date: '2026-02-23T20:29:00.000Z',
    durationSeconds: 192,
    fillerCount: 8,
    fillersPerMinute: 2.5,
    id: '3',
    title: 'Random Practice',
    type: 'random',
  },
  {
    clarityScore: 90,
    date: '2026-02-22T20:29:00.000Z',
    durationSeconds: 192,
    fillerCount: 2,
    fillersPerMinute: 0.6,
    id: '4',
    title: 'Meeting',
    type: 'prompt',
  },
  {
    clarityScore: 78,
    date: '2026-02-21T20:29:00.000Z',
    durationSeconds: 192,
    fillerCount: 4,
    fillersPerMinute: 1.3,
    id: '5',
    title: 'Random Practice',
    type: 'random',
  },
  {
    clarityScore: 82,
    date: '2026-02-20T14:15:00.000Z',
    durationSeconds: 192,
    fillerCount: 3,
    fillersPerMinute: 0.9,
    id: '6',
    title: 'Social conversation',
    type: 'prompt',
  },
  {
    clarityScore: 70,
    date: '2026-02-19T09:30:00.000Z',
    durationSeconds: 192,
    fillerCount: 6,
    fillersPerMinute: 1.9,
    id: '7',
    title: 'Random Practice',
    type: 'random',
  },
  {
    clarityScore: 85,
    date: '2026-02-18T16:00:00.000Z',
    durationSeconds: 120,
    fillerCount: 2,
    fillersPerMinute: 1.0,
    id: '8',
    title: 'Storytelling',
    type: 'prompt',
  },
  {
    clarityScore: 75,
    date: '2026-02-10T11:00:00.000Z',
    durationSeconds: 180,
    fillerCount: 5,
    fillersPerMinute: 1.7,
    id: '9',
    title: 'Opinions',
    type: 'prompt',
  },
  {
    clarityScore: 68,
    date: '2026-02-05T08:00:00.000Z',
    durationSeconds: 150,
    fillerCount: 7,
    fillersPerMinute: 2.8,
    id: '10',
    title: 'Random Practice',
    type: 'random',
  },
];

export const MOCK_CURRENT_STREAK = 5;
export const MOCK_LONGEST_STREAK = 15;

export const MOCK_WEEK_SUMMARY = {
  avgClarity: 80,
  fillersPerMinute: 3.0,
  sessions: 10,
};

export const MOCK_TOP_FILLERS = [
  { count: 6, word: 'Um' },
  { count: 2, word: 'Like' },
  { count: 10, word: 'Actually' },
  { count: 9, word: 'So' },
];

export const MOCK_PRACTICED_DATES = new Set(
  MOCK_SESSIONS.map((s) => s.date.split('T')[0])
);

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatSessionDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  }

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    hour: 'numeric',
    hour12: true,
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
