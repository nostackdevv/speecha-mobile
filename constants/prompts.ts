import { Prompt, PromptCategory } from "@/types/prompts";

const createPrompts = (categoryId: string, texts: string[]): Prompt[] =>
  texts.map((text, i) => ({
    categoryId,
    id: `${categoryId}-${i + 1}`,
    text,
  }));

export const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    // icon: require("@/assets/images/icon.png"),
    id: "interview",
    name: "Interview",
    prompts: createPrompts("interview", [
      "Tell us about yourself for 30 seconds",
      "What is your greatest strength?",
      "Describe a challenge you overcame at work",
      "Why should we hire you?",
      "Where do you see yourself in five years?",
      "Tell me about a time you led a team",
      "How do you handle pressure and tight deadlines?",
      "What motivates you in your career?",
      "Describe your ideal work environment",
      "What questions do you have for us?",
    ]),
  },
  {
    // icon: require("@/assets/images/icon.png"),
    id: "presentations",
    name: "Presentations",
    prompts: createPrompts("presentations", [
      "Introduce a new product to your team",
      "Explain a complex topic in simple terms",
      "Present quarterly results to stakeholders",
      "Pitch a startup idea in 60 seconds",
      "Give a project status update",
      "Explain why your team should adopt a new tool",
      "Present a case study with key takeaways",
      "Summarize a book you recently read",
      "Deliver a keynote opening for a conference",
      "Present a proposal for a new initiative",
    ]),
  },
  {
    // icon: require("@/assets/images/icon.png"),
    id: "storytelling",
    name: "Storytelling",
    prompts: createPrompts("storytelling", [
      "Tell a story about a lesson you learned the hard way",
      "Describe your most memorable travel experience",
      "Share a funny childhood memory",
      "Tell the story of how you chose your career",
      "Describe a moment that changed your perspective",
      "Share a story about someone who inspired you",
      "Tell about a time you took a big risk",
      "Describe your proudest achievement",
      "Share a story about overcoming a fear",
      "Tell about a random act of kindness you experienced",
    ]),
  },
  {
    // icon: require("@/assets/images/icon.png"),
    id: "opinions",
    name: "Opinions & Ideas",
    prompts: createPrompts("opinions", [
      "What skill should everyone learn?",
      "Is remote work better than office work?",
      "What is the most important invention of the last century?",
      "Should social media have age restrictions?",
      "What makes a great leader?",
      "Is it better to be a specialist or a generalist?",
      "What would you change about the education system?",
      "Should AI replace certain jobs?",
      "What is the most overrated trend right now?",
      "What advice would you give to your younger self?",
    ]),
  },
  {
    // icon: require("@/assets/images/icon.png"),
    id: "everyday",
    name: "Everyday Chat",
    prompts: createPrompts("everyday", [
      "Describe your perfect weekend",
      "What are you currently excited about?",
      "Tell someone about your favorite hobby",
      "Describe your morning routine",
      "What show are you binge-watching and why?",
      "Recommend a restaurant and explain why you love it",
      "Describe your dream vacation destination",
      "What is the best meal you have ever had?",
      "Talk about a podcast or book you enjoy",
      "What do you do to unwind after a long day?",
    ]),
  },
  {
    // icon: require("@/assets/images/icon.png"),
    id: "random",
    name: "Random Prompts",
    prompts: createPrompts("random", [
      "If you could have dinner with anyone, who would it be?",
      "Explain your job to a five-year-old",
      "What would you do with a million dollars?",
      "Describe an alien your favorite food",
      "If you could live in any era, which would you choose?",
      "What superpower would you want and why?",
      "Convince someone to visit your hometown",
      "Describe the plot of your favorite movie",
      "If you started a business tomorrow, what would it be?",
      "What three items would you bring to a deserted island?",
    ]),
  },
];

export const getAllPrompts = (): Prompt[] =>
  PROMPT_CATEGORIES.flatMap((c) => c.prompts);

export const getPromptsByCategory = (categoryId: string): Prompt[] =>
  PROMPT_CATEGORIES.find((c) => c.id === categoryId)?.prompts ?? [];
