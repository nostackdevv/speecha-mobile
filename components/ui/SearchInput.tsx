import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";

import { Colors } from "@/constants/Colors";

type SearchInputProps = {
  onChangeText: (text: string) => void;
  placeholder?: string;
  value: string;
};

export const SearchInput = ({
  onChangeText,
  placeholder = "Search",
  value,
}: SearchInputProps) => {
  return (
    // TODO: Add style={{ borderCurve: 'continuous' }} for smoother iOS corners
    <View className="h-12 flex-row items-center gap-2 rounded-full bg-grey-100 px-4">
      <Ionicons color={Colors.grey[400]} name="search" size={20} />
      <TextInput
        accessibilityLabel={placeholder}
        className="flex-1 text-body-base text-black"
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.grey[400]}
        value={value}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")}>
          <Ionicons color={Colors.grey[400]} name="close-circle" size={20} />
        </Pressable>
      )}
    </View>
  );
};
