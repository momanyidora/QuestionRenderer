export type QuestionOption = {
  label: string;
  value: string;
};

export type QuestionBase = {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  placeholder?: string;
};

export type TextQuestion = QuestionBase & {
  type: 'text';
};

export type TextareaQuestion = QuestionBase & {
  type: 'textarea';
};

export type SelectQuestion = QuestionBase & {
  type: 'select';
  options: QuestionOption[];
};

export type RadioQuestion = QuestionBase & {
  type: 'radio';
  options: QuestionOption[];
};

export type CheckboxQuestion = QuestionBase & {
  type: 'checkbox';
  options: QuestionOption[];
};

export type Question =
  | TextQuestion
  | TextareaQuestion
  | SelectQuestion
  | RadioQuestion
  | CheckboxQuestion;

export type AnswerValue = string | string[];

export type AnswerMap = Record<string, AnswerValue>;

export type QuestionErrors = Record<string, string>;

export type QuestionRendererProps = {
  questions: Question[];
  allowPasting?: boolean;
  onSubmit: (answers: AnswerMap) => void;
};
