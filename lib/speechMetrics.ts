import { PROMPT_CATEGORIES } from '@/constants/prompts';
import type { SpeechAnalysis } from '@/types/database';
import type { PromptCategoryId } from '@/types/prompts';

export type SessionType = 'prompt' | 'random';

type WeekSummary = {
  avgClarity: number;
  fillersPerMinute: number;
  sessions: number;
};

type TopFiller = {
  count: number;
  word: string;
};

const categoryNamesById = new Map(
  PROMPT_CATEGORIES.map((category) => [category.id, category.name])
);

const toSessionDate = (value: string): Date => new Date(value);

const isValidDate = (value: Date): boolean => !Number.isNaN(value.getTime());

const getWeekStartMonday = (referenceDate: Date): Date => {
  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);
  const mondayIndexedDay = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - mondayIndexedDay);
  return start;
};

const getWeekRange = (referenceDate: Date) => {
  const weekStart = getWeekStartMonday(referenceDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  return { weekEnd, weekStart };
};

const getPromptCategoryName = (promptId: string): string | undefined => {
  const categoryId = promptId.split('-')[0];
  return categoryNamesById.get(categoryId as PromptCategoryId);
};

const roundToSingleDecimal = (value: number): number =>
  Math.round(value * 10) / 10;

const toTitleCase = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

const readFillers = (session: SpeechAnalysis): string[] => {
  const data = session.transcript_data;

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return [];
  }

  const maybeFillers = (data as { fillers?: unknown }).fillers;
  if (!Array.isArray(maybeFillers)) {
    return [];
  }

  return maybeFillers
    .map((filler) => {
      if (!filler || typeof filler !== 'object') return null;
      const displayText = (filler as { displayText?: unknown }).displayText;
      return typeof displayText === 'string' ? displayText.trim() : null;
    })
    .filter((text): text is string => Boolean(text));
};

export const getSessionType = (promptId: string | null): SessionType =>
  promptId ? 'prompt' : 'random';

export const getSessionTitle = (promptId: string | null): string => {
  if (!promptId) return 'Random Practice';
  return getPromptCategoryName(promptId) ?? 'Prompt Practice';
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.max(0, seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatSessionDate = (dateStr: string): string => {
  const date = toSessionDate(dateStr);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return `Today, ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
      minute: '2-digit',
    })}`;
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

export const formatHomeDate = (date: Date = new Date()): string =>
  date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    weekday: 'long',
  });

export const formatTimeAgo = (
  dateStr: string,
  referenceDate: Date = new Date()
): string => {
  const date = toSessionDate(dateStr);
  const diffMs = referenceDate.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes <= 0) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
};

export const getCompletedDaysThisWeek = (
  sessions: SpeechAnalysis[],
  referenceDate: Date = new Date()
): boolean[] => {
  const completedDays = [false, false, false, false, false, false, false];
  const { weekEnd, weekStart } = getWeekRange(referenceDate);

  sessions.forEach((session) => {
    const sessionDate = toSessionDate(session.created_at);

    if (
      !isValidDate(sessionDate) ||
      sessionDate < weekStart ||
      sessionDate >= weekEnd
    ) {
      return;
    }

    const mondayIndexedDay = (sessionDate.getDay() + 6) % 7;
    completedDays[mondayIndexedDay] = true;
  });

  return completedDays;
};

export const getThisWeekSummary = (
  sessions: SpeechAnalysis[],
  referenceDate: Date = new Date()
): WeekSummary => {
  const { weekEnd, weekStart } = getWeekRange(referenceDate);
  const thisWeekSessions = sessions.filter((session) => {
    const sessionDate = toSessionDate(session.created_at);
    return (
      isValidDate(sessionDate) &&
      sessionDate >= weekStart &&
      sessionDate < weekEnd
    );
  });

  if (thisWeekSessions.length === 0) {
    return { avgClarity: 0, fillersPerMinute: 0, sessions: 0 };
  }

  const clarityTotal = thisWeekSessions.reduce(
    (total, session) => total + session.clarity_score,
    0
  );
  const fillersPerMinuteTotal = thisWeekSessions.reduce(
    (total, session) => total + session.fillers_per_minute,
    0
  );

  return {
    avgClarity: Math.round(clarityTotal / thisWeekSessions.length),
    fillersPerMinute: roundToSingleDecimal(
      fillersPerMinuteTotal / thisWeekSessions.length
    ),
    sessions: thisWeekSessions.length,
  };
};

export const getTopFillersThisMonth = (
  sessions: SpeechAnalysis[],
  limit: number = 4,
  referenceDate: Date = new Date()
): TopFiller[] => {
  const targetMonth = referenceDate.getMonth();
  const targetYear = referenceDate.getFullYear();
  const counts = new Map<string, number>();

  sessions.forEach((session) => {
    const sessionDate = toSessionDate(session.created_at);

    if (
      !isValidDate(sessionDate) ||
      sessionDate.getMonth() !== targetMonth ||
      sessionDate.getFullYear() !== targetYear
    ) {
      return;
    }

    readFillers(session).forEach((filler) => {
      const normalized = filler.toLowerCase();
      counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .map(([word, count]) => ({ count, word: toTitleCase(word) }))
    .sort((a, b) => {
      if (a.count === b.count) {
        return a.word.localeCompare(b.word);
      }
      return b.count - a.count;
    })
    .slice(0, limit);
};
