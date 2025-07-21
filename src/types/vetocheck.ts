export type Species = 'chien' | 'chat';
export type Gender = 'male' | 'femelle';

export interface AnimalProfile {
  name: string;
  species: Species;
  age: number;
  gender: Gender;
  isNeutered: boolean;
  isOverweight: boolean;
}

export interface Question {
  id: string;
  category: string;
  text: string;
  weight: number;
  isCritical?: boolean;
  species?: Species[];
}

export type AnswerValue = 'oui' | 'non' | 'ne_sais_pas';

export interface Answer {
  questionId: string;
  value: AnswerValue;
}

export type RiskLevel = 'green' | 'orange' | 'red';

export interface DiagnosticResult {
  riskLevel: RiskLevel;
  score: number;
  uncertaintyRate: number;
  mainCategory: string;
  recommendations: string[];
  emergencyAlert?: string;
  sterilizationMessage?: string;
  criticalSymptoms: string[];
}

export interface QuestionCategory {
  id: string;
  name: string;
  questions: Question[];
}

export interface Feedback {
  name: string;
  rating: number; // 1-5
  comment?: string;
}
