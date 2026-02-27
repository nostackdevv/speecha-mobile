import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { Colors } from "@/constants/Colors";

type WeekProgressProps = {
  completedDays: boolean[];
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const WeekProgress = ({ completedDays }: WeekProgressProps) => {
  return (
    <View className="w-full flex-row justify-between">
      {DAY_LABELS.map((day, index) => {
        const isCompleted = completedDays[index] ?? false;

        return (
          <View className="items-center gap-2" key={day}>
            <Text
              className={`text-body-s font-medium ${
                isCompleted ? "text-black" : "text-grey-600"
              }`}
            >
              {day}
            </Text>
            <View
              className={`size-9 items-center justify-center rounded-full ${
                isCompleted ? "bg-brand-blue" : "bg-grey-300"
              }`}
            >
              {isCompleted && (
                <Ionicons color={Colors.white} name="checkmark" size={18} />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};
