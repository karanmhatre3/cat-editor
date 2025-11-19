export interface TMMatch {
  id: string;
  source: string;
  target: string;
  matchPercentage: number;
  type: 'TB' | 'TM';
}

export interface AISuggestion {
  text: string;
  confidence: number;
}

export interface Issue {
  id: string;
  type: 'error' | 'warning';
  category: 'reviewer' | 'ai-qa';
  message: string;
  severity: 'high' | 'medium' | 'low';
  // For reviewer feedback
  badges?: string[];
  // For AI QA
  quotedText?: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  message: string;
  timestamp: string;
}

export interface SegmentData {
  id: number;
  source: string;
  target: string;
  suggestedText?: string;
  status: 'draft' | 'translated' | 'editing' | 'approved';
  hasWarning?: boolean;
  aiSuggestion?: AISuggestion;
  tmMatches?: TMMatch[];
  issues?: Issue[];
  comments?: Comment[];
}
