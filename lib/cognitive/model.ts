// lib/cognitive/model.ts

export interface CognitiveAnalysis {
  beliefType: string;
  emotionalCharge: number;
  coreNeed: string;
  rewrite: string;
  nextQuestion: string;
}

export const emptyAnalysis: CognitiveAnalysis = {
  beliefType: "",
  emotionalCharge: 0,
  coreNeed: "",
  rewrite: "",
  nextQuestion: ""
};
