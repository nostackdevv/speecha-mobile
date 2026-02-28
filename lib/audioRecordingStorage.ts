import { Directory, File, Paths } from 'expo-file-system';

const getRecordingsDir = (): Directory => {
  return new Directory(Paths.document, 'speecha/recordings');
};

const getFile = (analysisId: string): File => {
  return new File(getRecordingsDir(), `${analysisId}.m4a`);
};

export const audioRecordingStorage = {
  save: (analysisId: string, tempUri: string): string => {
    const recordingsDir = getRecordingsDir();
    if (!recordingsDir.exists) {
      recordingsDir.create();
    }

    const tempFile = new File(tempUri);
    const destFile = getFile(analysisId);
    tempFile.move(destFile);

    return destFile.uri;
  },

  getUri: (analysisId: string): string => {
    return getFile(analysisId).uri;
  },

  exists: (analysisId: string): boolean => {
    return getFile(analysisId).exists;
  },

  delete: (analysisId: string): void => {
    const file = getFile(analysisId);
    if (file.exists) {
      file.delete();
    }
  },

  deleteMany: (analysisIds: string[]): void => {
    analysisIds.forEach((id) => audioRecordingStorage.delete(id));
  },

  list: (): string[] => {
    const recordingsDir = getRecordingsDir();
    if (!recordingsDir.exists) {
      return [];
    }

    const contents = recordingsDir.list();
    return contents
      .filter(
        (item): item is File =>
          item instanceof File && item.uri.endsWith('.m4a')
      )
      .map((file) => file.name.replace('.m4a', ''));
  },

  // Returns: in (bytes)
  getStorageUsed: (): number => {
    const recordingsDir = getRecordingsDir();
    return recordingsDir.exists ? (recordingsDir.size ?? 0) : 0;
  },
};
