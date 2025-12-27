
import { Question } from './types';

export const SAMPLE_RESUME = `Jane Doe
(555) 987-6543 | jane.doe@email.com | LinkedIn/jane-doe-pm

Summary
Highly experienced Product Manager with 8 years in the SaaS industry, specializing in B2B platform development. Expert in Agile methodologies, user story mapping, and cross-functional team leadership. Successfully launched two major products that generated over $15M in ARR within the first year.

Experience
Senior Product Manager | Growth Solutions SaaS | 2019 – Present
- Defined product strategy and roadmap for a complex analytics dashboard used by 500+ enterprise clients.
- Led a team of designers, engineers, and marketers from concept to launch.
- Increased user engagement by 40% through iterative feature releases and A/B testing.

Product Manager | E-Commerce Innovations | 2017 – 2019
- Managed the lifecycle of the mobile application, leading to a 30% rise in mobile transactions.

Education
MBA, Technology Management | Stanford University
B.S. in Economics | UC Berkeley`;

export const SAMPLE_JOB_DESC = `Job Title: Principal Product Manager, AI Solutions
Company: FutureTech Global

We seek a Principal Product Manager to drive the strategy and execution of our next-generation AI-powered B2B platform. This role requires deep technical acumen and exceptional leadership skills.

Responsibilities:
- Own the end-to-end product lifecycle for machine learning features.
- Define market requirements, competitive analysis, and success metrics (KPIs).
- Collaborate closely with AI/ML engineering teams and data scientists.

Requirements:
- 7+ years of product management experience, preferably in AI/ML.
- Strong knowledge of data science workflows and model deployment.
- MBA or advanced technical degree preferred.`;

export const APTITUDE_QUESTIONS: Question[] = [
  {
    questionNumber: 1,
    question: "If a train running at 50 km/h crosses a man standing on a platform in 10 seconds, what is the length of the train in meters?",
    options: { A: "138.9 m", B: "145.5 m", C: "160.2 m", D: "125.8 m" },
    correctAnswer: "A",
    explanation: "Length = Speed × Time. 50 km/h = 13.89 m/s. 13.89 * 10 = 138.9 meters."
  },
  {
    questionNumber: 2,
    question: "Choose the word that is opposite in meaning to 'Frugal'.",
    options: { A: "Economical", B: "Wasteful", C: "Thrifty", D: "Miserly" },
    correctAnswer: "B",
    explanation: "'Frugal' means sparing. The opposite is 'Wasteful'."
  },
  {
    questionNumber: 3,
    question: "Find the next number in the series: 3, 7, 15, 31, 63, ...",
    options: { A: "127", B: "128", C: "129", D: "131" },
    correctAnswer: "A",
    explanation: "The pattern is (x * 2) + 1. (63 * 2) + 1 = 127."
  },
  {
    questionNumber: 4,
    question: "Which of the following is not a standard agile ceremony?",
    options: { A: "Sprint Planning", B: "Daily Standup", C: "Executive Monthly Review", D: "Sprint Retrospective" },
    correctAnswer: "C",
    explanation: "Standard Agile ceremonies include Planning, Standup, Review, and Retrospective. Executive reviews are separate organizational meetings."
  },
  {
    questionNumber: 5,
    question: "A project has a 20% chance of failing. If it fails, the loss is $100k. What is the expected loss?",
    options: { A: "$10k", B: "$20k", C: "$50k", D: "$80k" },
    correctAnswer: "B",
    explanation: "Expected Value = Probability * Outcome. 0.20 * $100,000 = $20,000."
  },
  {
    questionNumber: 6,
    question: "What is 40% of 350?",
    options: { A: "120", B: "140", C: "160", D: "180" },
    correctAnswer: "B",
    explanation: "0.40 * 350 = 140."
  }
];
