'use client';

import { useMemo, useState } from 'react';
import type {
  Question,
  QuestionErrors,
  QuestionRendererProps,
} from './questionTypes';

function getInitialAnswer(question: Question) {
  switch (question.type) {
    case 'checkbox':
      return [] as string[];
    default:
      return '';
  }
}

function getQuestionError(question: Question, answer: string | string[]) {
  const value = Array.isArray(answer) ? answer : answer.trim();

  if (question.required) {
    const isEmpty = Array.isArray(answer)
      ? answer.length === 0
      : value.length === 0;
    if (isEmpty) {
      return 'This field is required.';
    }
  }

  if (typeof value === 'string') {
    if (
      question.minLength &&
      value.length > 0 &&
      value.length < question.minLength
    ) {
      return `Must be at least ${question.minLength} characters.`;
    }

    if (question.maxLength && value.length > question.maxLength) {
      return `Must be at most ${question.maxLength} characters.`;
    }

    if (question.pattern && value.length > 0) {
      try {
        const regex = new RegExp(question.pattern);
        if (!regex.test(value)) {
          return 'Please match the expected format.';
        }
      } catch {
        return 'Invalid validation pattern.';
      }
    }
  }

  return '';
}

function buildInitialAnswers(questions: Question[]) {
  return questions.reduce<Record<string, string | string[]>>(
    (acc, question) => {
      acc[question.id] = getInitialAnswer(question);
      return acc;
    },
    {}
  );
}

function buildInitialTouched(questions: Question[]) {
  return questions.reduce<Record<string, boolean>>((acc, question) => {
    acc[question.id] = false;
    return acc;
  }, {});
}

export function QuestionRenderer({
  questions,
  allowPasting = false,
  onSubmit,
}: QuestionRendererProps) {
  const defaultAnswers = useMemo(
    () => buildInitialAnswers(questions),
    [questions]
  );

  const [answers, setAnswers] =
    useState<Record<string, string | string[]>>(defaultAnswers);
  const [touched, setTouched] = useState<Record<string, boolean>>(
    buildInitialTouched(questions)
  );
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => {
    return questions.reduce<QuestionErrors>((acc, question) => {
      const answer = answers[question.id] ?? getInitialAnswer(question);
      acc[question.id] = getQuestionError(question, answer);
      return acc;
    }, {});
  }, [answers, questions]);

  const isFormValid = Object.values(errors).every((error) => error === '');

  const handleChange = (id: string, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
    setTouched((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const handleOptionChange = (
    questionId: string,
    optionValue: string,
    type: 'checkbox' | 'radio'
  ) => {
    if (type === 'checkbox') {
      const current = (answers[questionId] ?? []) as string[];
      const next = current.includes(optionValue)
        ? current.filter((item) => item !== optionValue)
        : [...current, optionValue];
      handleChange(questionId, next);
      return;
    }

    handleChange(questionId, optionValue);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setTouched(
      questions.reduce<Record<string, boolean>>((acc, question) => {
        acc[question.id] = true;
        return acc;
      }, {})
    );

    if (isFormValid) {
      onSubmit(answers);
    }
  };

  const preventPaste = (
    event: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!allowPasting) {
      event.preventDefault();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {questions.map((question) => {
        const error = errors[question.id];
        const showError = Boolean(error && (touched[question.id] || submitted));
        const inputId = `question-${question.id}`;
        const errorId = `${inputId}-error`;
        const ariaDescribedBy = showError ? errorId : undefined;

        const commonInputClasses =
          'block w-full rounded-md border border-red-300 bg-white px-3 py-2 text-sm text-black shadow-sm placeholder:text-red-500 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600';

        return (
          <div key={question.id} className="space-y-2">
            {question.type === 'radio' || question.type === 'checkbox' ? (
              <fieldset className="rounded-md border border-red bg-white p-4">
                <legend className="text-sm font-medium text-black">
                  {question.label}
                </legend>
                {question.description ? (
                  <p className="text-sm text-red-600">{question.description}</p>
                ) : null}
                <div className="mt-3 space-y-3">
                  {question.options.map((option) => {
                    const fieldId = `${inputId}-${option.value}`;
                    const checked =
                      question.type === 'checkbox'
                        ? ((answers[question.id] ?? []) as string[]).includes(
                            option.value
                          )
                        : answers[question.id] === option.value;

                    return (
                      <label
                        key={option.value}
                        htmlFor={fieldId}
                        className="flex items-center gap-3 text-sm text-black"
                      >
                        <input
                          id={fieldId}
                          name={question.id}
                          type={question.type}
                          value={option.value}
                          checked={checked}
                          onChange={() =>
                            handleOptionChange(
                              question.id,
                              option.value,
                              question.type === 'checkbox'
                                ? 'checkbox'
                                : 'radio'
                            )
                          }
                          aria-invalid={Boolean(showError)}
                          aria-describedby={ariaDescribedBy}
                          className="h-4 w-4 accent-red-600 border-red-600 focus:ring-red-600"
                        />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
                {showError ? (
                  <p id={errorId} className="mt-2 text-sm text-red-600">
                    {error}
                  </p>
                ) : null}
              </fieldset>
            ) : (
              <div className="space-y-2">
                <label
                  htmlFor={inputId}
                  className="block text-sm font-medium text-black"
                >
                  {question.label}
                </label>
                {question.description ? (
                  <p className="text-sm text-red-200">{question.description}</p>
                ) : null}
                {question.type === 'text' ? (
                  <input
                    id={inputId}
                    type="text"
                    value={(answers[question.id] as string) ?? ''}
                    placeholder={question.placeholder}
                    onChange={(event) =>
                      handleChange(question.id, event.target.value)
                    }
                    onBlur={() =>
                      setTouched((prev) => ({
                        ...prev,
                        [question.id]: true,
                      }))
                    }
                    onPaste={preventPaste}
                    aria-invalid={Boolean(showError)}
                    aria-describedby={ariaDescribedBy}
                    className={commonInputClasses}
                  />
                ) : question.type === 'textarea' ? (
                  <textarea
                    id={inputId}
                    value={(answers[question.id] as string) ?? ''}
                    placeholder={question.placeholder}
                    rows={5}
                    onChange={(event) =>
                      handleChange(question.id, event.target.value)
                    }
                    onBlur={() =>
                      setTouched((prev) => ({
                        ...prev,
                        [question.id]: true,
                      }))
                    }
                    onPaste={preventPaste}
                    aria-invalid={Boolean(showError)}
                    aria-describedby={ariaDescribedBy}
                    className={`${commonInputClasses} min-h-35 resize-vertical`}
                  />
                ) : question.type === 'select' ? (
                  <select
                    id={inputId}
                    value={(answers[question.id] as string) ?? ''}
                    onChange={(event) =>
                      handleChange(question.id, event.target.value)
                    }
                    onBlur={() =>
                      setTouched((prev) => ({
                        ...prev,
                        [question.id]: true,
                      }))
                    }
                    aria-invalid={Boolean(showError)}
                    aria-describedby={ariaDescribedBy}
                    className={commonInputClasses}
                  >
                    <option value="">Select an option</option>
                    {question.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : null}
                {showError ? (
                  <p id={errorId} className="text-sm text-red-600">
                    {error}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={!isFormValid}
        className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
      >
        Submit
      </button>
    </form>
  );
}
