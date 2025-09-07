export type FeedbackType = 'FEEDBACK' | 'BUG';

export interface FeedbackDTO {
  type: FeedbackType;
  message: string;
}

export interface FeedbackSubmissionResponse {
  success: boolean;
  message: string;
}
