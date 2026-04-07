import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';

const PENDING_QUEUE_KEY = '@speecha/pending-recordings';

export type PendingRecording = {
  audioUri: string;
  createdAt: string;
  id: string;
  promptId: string | null;
};

export class QueuedForSyncError extends Error {
  pendingId: string;

  constructor(pendingId: string) {
    super('Recording queued for offline sync');
    this.name = 'QueuedForSyncError';
    this.pendingId = pendingId;
  }
}

const getPendingDir = (): Directory =>
  new Directory(Paths.document, 'speecha/pending');

const ensurePendingDir = (): Directory => {
  const pendingDir = getPendingDir();

  if (!pendingDir.exists) {
    pendingDir.create({ idempotent: true, intermediates: true });
  }

  return pendingDir;
};

const getPendingFile = (id: string): File =>
  new File(getPendingDir(), `${id}.m4a`);

const generatePendingId = (): string =>
  `pending-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const readQueue = async (): Promise<PendingRecording[]> => {
  const raw = await AsyncStorage.getItem(PENDING_QUEUE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as PendingRecording[];
  } catch {
    return [];
  }
};

const writeQueue = async (queue: PendingRecording[]) => {
  await AsyncStorage.setItem(PENDING_QUEUE_KEY, JSON.stringify(queue));
};

export const pendingRecordingQueue = {
  enqueue: async ({
    promptId,
    tempUri,
  }: {
    promptId?: string;
    tempUri: string;
  }): Promise<PendingRecording> => {
    ensurePendingDir();

    const id = generatePendingId();
    const tempFile = new File(tempUri);
    const targetFile = getPendingFile(id);

    if (targetFile.exists) {
      targetFile.delete();
    }

    try {
      tempFile.move(targetFile);
    } catch {
      tempFile.copy(targetFile);
      if (tempFile.exists) {
        tempFile.delete();
      }
    }

    const item: PendingRecording = {
      audioUri: targetFile.uri,
      createdAt: new Date().toISOString(),
      id,
      promptId: promptId ?? null,
    };

    const queue = await readQueue();
    await writeQueue([...queue, item]);

    return item;
  },

  list: async (): Promise<PendingRecording[]> => {
    const queue = await readQueue();
    return queue.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  remove: async (id: string): Promise<void> => {
    const queue = await readQueue();
    const nextQueue = queue.filter((item) => item.id !== id);
    await writeQueue(nextQueue);

    const file = getPendingFile(id);
    if (file.exists) {
      file.delete();
    }
  },

  count: async (): Promise<number> => {
    const queue = await readQueue();
    return queue.length;
  },

  pruneMissingFiles: async (): Promise<number> => {
    const queue = await readQueue();
    const nextQueue = queue.filter((item) => {
      const file = new File(item.audioUri);
      return file.exists;
    });

    if (nextQueue.length !== queue.length) {
      await writeQueue(nextQueue);
    }

    return queue.length - nextQueue.length;
  },
};
