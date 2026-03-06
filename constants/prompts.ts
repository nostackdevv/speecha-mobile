import type { Prompt, PromptCategory, PromptCategoryId } from '@/types/prompts';

/* eslint-disable @typescript-eslint/no-require-imports */
export const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    id: 'interview',
    name: 'Interview',
    image: require('@/assets/images/categories/interview.png'),
    promptCount: 10,
  },
  {
    id: 'presentations',
    name: 'Presentations',
    image: require('@/assets/images/categories/presentations.png'),
    promptCount: 10,
  },
  {
    id: 'storytelling',
    name: 'Storytelling',
    image: require('@/assets/images/categories/storytelling.png'),
    promptCount: 10,
  },
  {
    id: 'opinions',
    name: 'Opinions & Ideas',
    image: require('@/assets/images/categories/opinions.png'),
    promptCount: 10,
  },
  {
    id: 'everyday',
    name: 'Everyday Chat',
    image: require('@/assets/images/categories/everyday.png'),
    promptCount: 10,
  },
  {
    id: 'random',
    name: 'Random Prompts',
    image: require('@/assets/images/categories/random.png'),
    promptCount: 10,
  },
  // {
  //   id: 'storytellings',
  //   name: 'Storytelling',
  //   image: require('@/assets/images/categories/storytelling.png'),
  //   promptCount: 10,
  // },
  // {
  //   id: 'opinionss',
  //   name: 'Opinions & Ideas',
  //   image: require('@/assets/images/categories/opinions.png'),
  //   promptCount: 10,
  // },
  // {
  //   id: 'everydays',
  //   name: 'Everyday Chat',
  //   image: require('@/assets/images/categories/everyday.png'),
  //   promptCount: 10,
  // },
  // {
  //   id: 'randoms',
  //   name: 'Random Prompts',
  //   image: require('@/assets/images/categories/random.png'),
  //   promptCount: 10,
  // },
];

export const PROMPTS: Record<PromptCategoryId, Prompt[]> = {
  interview: [
    { id: 'interview-1', text: 'Tell me about yourself' },
    { id: 'interview-2', text: 'Why should we hire you?' },
    { id: 'interview-3', text: 'What is your greatest strength?' },
    { id: 'interview-4', text: 'Where do you see yourself in 5 years?' },
    { id: 'interview-5', text: 'Describe a challenge you overcame' },
    { id: 'interview-6', text: 'Why are you leaving your current job?' },
    { id: 'interview-7', text: 'What motivates you at work?' },
    { id: 'interview-8', text: 'Tell me about a time you led a team' },
    { id: 'interview-9', text: 'How do you handle conflict at work?' },
    { id: 'interview-10', text: 'What questions do you have for us?' },
  ],
  presentations: [
    { id: 'presentations-1', text: 'Pitch your favorite product' },
    { id: 'presentations-2', text: 'Explain a complex topic simply' },
    {
      id: 'presentations-3',
      text: 'Present quarterly results to stakeholders',
    },
    { id: 'presentations-4', text: 'Introduce yourself at a conference' },
    { id: 'presentations-5', text: 'Deliver a project status update' },
    { id: 'presentations-6', text: 'Propose a new initiative to leadership' },
    { id: 'presentations-7', text: 'Explain your team\u2019s workflow' },
    { id: 'presentations-8', text: 'Give a demo of a new feature' },
    { id: 'presentations-9', text: 'Present a case study to clients' },
    { id: 'presentations-10', text: 'Summarize key takeaways from a meeting' },
  ],
  storytelling: [
    { id: 'storytelling-1', text: 'Tell a story about a lesson you learned' },
    {
      id: 'storytelling-2',
      text: 'Describe your most memorable travel experience',
    },
    { id: 'storytelling-3', text: 'Share a childhood memory that shaped you' },
    { id: 'storytelling-4', text: 'Tell about a time you surprised yourself' },
    { id: 'storytelling-5', text: 'Describe a person who changed your life' },
    { id: 'storytelling-6', text: 'Share a funny thing that happened to you' },
    { id: 'storytelling-7', text: 'Tell about your biggest adventure' },
    { id: 'storytelling-8', text: 'Describe a moment you felt truly proud' },
    { id: 'storytelling-9', text: 'Share a story about overcoming fear' },
    { id: 'storytelling-10', text: 'Tell about a tradition you cherish' },
  ],
  opinions: [
    { id: 'opinions-1', text: 'Should remote work be the default?' },
    { id: 'opinions-2', text: 'Is social media doing more harm than good?' },
    { id: 'opinions-3', text: 'What makes a great leader?' },
    { id: 'opinions-4', text: 'Should college be free for everyone?' },
    { id: 'opinions-5', text: 'Is AI going to replace most jobs?' },
    {
      id: 'opinions-6',
      text: 'What\u2019s the most important skill to learn?',
    },
    { id: 'opinions-7', text: 'Should we explore space or fix Earth first?' },
    { id: 'opinions-8', text: 'Is failure necessary for success?' },
    { id: 'opinions-9', text: 'What would you change about education?' },
    {
      id: 'opinions-10',
      text: 'Is it better to be a specialist or generalist?',
    },
  ],
  everyday: [
    { id: 'everyday-1', text: 'What did you do this weekend?' },
    { id: 'everyday-2', text: 'Describe your morning routine' },
    { id: 'everyday-3', text: 'What are you currently watching or reading?' },
    { id: 'everyday-4', text: 'Plan a perfect day off' },
    { id: 'everyday-5', text: 'Recommend a restaurant to a friend' },
    { id: 'everyday-6', text: 'Describe your ideal workspace' },
    { id: 'everyday-7', text: 'What hobby would you pick up?' },
    { id: 'everyday-8', text: 'Tell someone about your favorite recipe' },
    { id: 'everyday-9', text: 'Describe your neighborhood to a newcomer' },
    { id: 'everyday-10', text: 'What\u2019s on your bucket list?' },
  ],
  random: [
    { id: 'random-1', text: 'If you could have dinner with anyone, who?' },
    { id: 'random-2', text: 'Explain your job to a 5-year-old' },
    { id: 'random-3', text: 'What would you do with a million dollars?' },
    { id: 'random-4', text: 'Describe your perfect vacation' },
    { id: 'random-5', text: 'If you could live anywhere, where would it be?' },
    { id: 'random-6', text: 'What superpower would you choose and why?' },
    { id: 'random-7', text: 'Convince someone to try your favorite food' },
    { id: 'random-8', text: 'If you could master any skill instantly, what?' },
    { id: 'random-9', text: 'Describe your life in three words' },
    { id: 'random-10', text: 'What advice would you give your younger self?' },
  ],
};

const PROMPTS_BY_ID = new Map<string, Prompt>();
// Populate flat lookup map
Object.values(PROMPTS)
  .flat()
  .forEach((prompt) => PROMPTS_BY_ID.set(prompt.id, prompt));

export const getPromptById = (id: string): Prompt | undefined =>
  PROMPTS_BY_ID.get(id);
