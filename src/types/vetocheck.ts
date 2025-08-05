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
  followUpQuestions?: string[];
  requiredConditions?: QuestionCondition[];
  ageWeight?: AgeWeight;
  timeContext?: boolean;
}

export interface QuestionCondition {
  questionId: string;
  answer: AnswerValue;
}

export interface AgeWeight {
  puppy?: number; // 0-12 months
  adult?: number; // 12-84 months  
  senior?: number; // 84+ months
}

export interface ConfirmationQuestion {
  id: string;
  parentQuestionId: string;
  text: string;
  type: 'duration' | 'intensity' | 'frequency' | 'circumstances';
}

export type AnswerValue = 'oui' | 'non' | 'ne_sais_pas';

export interface Answer {
  questionId: string;
  value: AnswerValue;
  details?: AnswerDetails;
  timestamp?: Date;
}

export interface AnswerDetails {
  duration?: string;
  intensity?: 'low' | 'medium' | 'high';
  frequency?: string;
  circumstances?: string;
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
  dangerousPatterns: DangerousPattern[];
  timeToVet?: string;
  vetContact?: VetContact;
  followUpActions: string[];
  confidenceLevel: number;
}

export interface DangerousPattern {
  name: string;
  symptoms: string[];
  urgencyLevel: 'immediate' | 'urgent' | 'soon';
  description: string;
}

export interface VetContact {
  phone: string;
  address?: string;
  distance?: number;
  isEmergency: boolean;
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
