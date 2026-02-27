import { Pressable, ScrollView, Text, View } from "react-native";

import { useAnalyzeRecording } from "@/hooks/useAnalyzeRecording";
import { useRecording } from "@/hooks/useRecording";

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const TestScreen = () => {
  const recording = useRecording();
  const analysis = useAnalyzeRecording();

  const handleRecord = async () => {
    if (recording.status === "idle" || recording.status === "stopped") {
      await recording.start();
    } else if (recording.status === "recording") {
      const uri = await recording.stop();
      if (uri) {
        analysis.analyze(uri);
      }
    }
  };

  const recordLabel =
    recording.status === "recording" ? "Stop & Analyze" : "Record";

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <View className="p-6 gap-6">
        {/* Recording controls */}
        <View className="items-center gap-3">
          <Text className="text-4xl font-bold text-black dark:text-white">
            {formatDuration(recording.durationSeconds)}
          </Text>

          <Pressable
            className="rounded-full bg-red-500 px-8 py-4 active:opacity-70"
            disabled={analysis.isPending}
            onPress={handleRecord}
          >
            <Text className="text-lg font-semibold text-white">
              {recordLabel}
            </Text>
          </Pressable>

          {recording.error && (
            <Text className="text-red-500">{recording.error}</Text>
          )}
        </View>

        {/* Analysis status */}
        {analysis.isPending && (
          <View className="items-center rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
            <Text className="text-base text-gray-600 dark:text-gray-400">
              {analysis.status === "transcribing"
                ? "Transcribing audio..."
                : "Analyzing fillers..."}
            </Text>
          </View>
        )}

        {/* Error */}
        {analysis.error && (
          <View className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
            <Text className="font-semibold text-red-600 dark:text-red-400">
              Error
            </Text>
            <Text className="mt-1 text-red-600 dark:text-red-400">
              {analysis.error.message}
            </Text>
          </View>
        )}

        {/* Results */}
        {analysis.data && (
          <>
            {/* Clarity score */}
            {analysis.data.clarityScore && (
              <View className="items-center rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                <Text className="text-sm text-blue-600 dark:text-blue-400">
                  Clarity Score
                </Text>
                <Text className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                  {analysis.data.clarityScore.score}
                </Text>
              </View>
            )}

            {/* Stats */}
            <View className="flex-row justify-between rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
              <View className="items-center">
                <Text className="text-2xl font-bold text-black dark:text-white">
                  {analysis.data.fillerStats.totalFillers}
                </Text>
                <Text className="text-xs text-gray-500">Fillers</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-black dark:text-white">
                  {analysis.data.fillerStats.fillersPerMinute}
                </Text>
                <Text className="text-xs text-gray-500">Per min</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-black dark:text-white">
                  {analysis.data.fillerStats.totalWords}
                </Text>
                <Text className="text-xs text-gray-500">Words</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-black dark:text-white">
                  {Math.round(analysis.data.duration)}s
                </Text>
                <Text className="text-xs text-gray-500">Duration</Text>
              </View>
            </View>

            {/* Top fillers */}
            {analysis.data.fillerStats.topFillers.length > 0 && (
              <View className="rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
                <Text className="mb-2 font-semibold text-black dark:text-white">
                  Top Fillers
                </Text>
                {analysis.data.fillerStats.topFillers.map((f) => (
                  <View
                    className="flex-row justify-between py-1"
                    key={f.text}
                  >
                    <Text className="text-gray-700 dark:text-gray-300">
                      &quot;{f.text}&quot;
                    </Text>
                    <Text className="font-medium text-gray-700 dark:text-gray-300">
                      {f.count}x
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Transcript */}
            <View className="rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
              <Text className="mb-2 font-semibold text-black dark:text-white">
                Transcript
              </Text>
              <Text className="leading-6 text-gray-700 dark:text-gray-300">
                {analysis.data.transcript || "No speech detected"}
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default TestScreen;
