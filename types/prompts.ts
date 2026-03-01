export type PromptCategoryId =
  | 'interview'
  | 'presentations'
  | 'storytelling'
  | 'opinions'
  | 'everyday'
  | 'random';

export type PromptCategory = {
  id: PromptCategoryId;
  image: number;
  name: string;
  promptCount: number;
};

export type Prompt = {
  id: string;
  text: string;
};
