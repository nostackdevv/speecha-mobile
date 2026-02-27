import { ImageSourcePropType } from "react-native";

export type PromptCategory = {
  icon?: ImageSourcePropType;
  id: string;
  name: string;
  prompts: Prompt[];
};

export type Prompt = {
  categoryId: string;
  id: string;
  text: string;
};
