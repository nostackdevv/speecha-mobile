import { type ReactNode } from "react";
import {
  Modal as RNModal,
  Pressable,
  View,
} from "react-native";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
  visible: boolean;
};

export const Modal = ({ children, onClose, visible }: ModalProps) => {
  return (
    <RNModal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50"
        onPress={onClose}
      >
        <View
          accessibilityViewIsModal
          className="mx-6 max-h-[80%] w-full max-w-sm rounded-2xl bg-white p-6"
          onStartShouldSetResponder={() => true}
        >
          {children}
        </View>
      </Pressable>
    </RNModal>
  );
};
