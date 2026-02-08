import { QuizQuestion, QuizDifficulty, QuizTopic } from '../types/backend-types';

export const defaultQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What percentage of your income should you save according to the 50/30/20 rule?',
    options: ['10%', '20%', '30%', '50%'],
    correctAnswer: '20%',
    explanation: 'The 50/30/20 rule suggests allocating 50% to needs, 30% to wants, and 20% to savings and debt repayment.',
    realLifeTip: 'Start with 10% if 20% seems difficult, then gradually increase your savings rate as you optimize expenses.',
    topic: QuizTopic.budgeting,
    difficulty: QuizDifficulty.easy,
  },
  {
    id: 'q2',
    question: 'How many months of expenses should an emergency fund ideally cover?',
    options: ['1-2 months', '3-6 months', '12 months', '24 months'],
    correctAnswer: '3-6 months',
    explanation: 'Financial experts recommend having 3-6 months of essential living expenses saved in an easily accessible emergency fund.',
    realLifeTip: 'Start with a goal of one month\'s expenses, then gradually build up to 3-6 months over time.',
    topic: QuizTopic.emergencyFunds,
    difficulty: QuizDifficulty.easy,
  },
];
