'use client';

import { useState } from 'react';
import { QuestionRenderer } from '@/components/QuestionRenderer/QuestionRenderer';
import type { Question } from '@/components/QuestionRenderer/questionTypes';

const questions: Question[] = [
  {
    id: 'fullName',
    label: 'Full name',
    type: 'text',
    required: true,
    minLength: 3,
    placeholder: 'Enter your full name',
  },
  {
    id: 'motivation',
    label: 'Motivation',
    type: 'textarea',
    required: true,
    minLength: 10,
    placeholder: 'Why do you want to join?',
  },
  {
    id: 'educationLevel',
    label: 'Education level',
    type: 'select',
    required: true,
    options: [
      { label: 'High school', value: 'highschool' },
      { label: "Bachelor's", value: 'bachelors' },
      { label: "Master's", value: 'masters' },
    ],
  },
  {
    id: 'preferredTrack',
    label: 'Preferred track',
    type: 'radio',
    required: true,
    options: [
      { label: 'Fullstack', value: 'fullstack' },
      { label: 'Frontend', value: 'frontend' },
      { label: 'Backend', value: 'backend' },
    ],
  },
  {
    id: 'skills',
    label: 'Skills',
    type: 'checkbox',
    required: true,
    options: [
      { label: 'HTML', value: 'html' },
      { label: 'CSS', value: 'css' },
      { label: 'JavaScript', value: 'javascript' },
    ],
  },
];

export default function QuestionRendererDemoPage() {
  const [submittedData, setSubmittedData] = useState<Record<
    string,
    unknown
  > | null>(null);
  
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-6">
        <div className="rounded-3xl border border-red bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold text-black">
            QuestionRenderer demo
          </h1>
          <p className="mt-3 text-black">
            This demo shows a reusable form renderer with text, textarea,
            select, radio, and checkbox question types.
          </p>
          
        </div>

        <div className="rounded-3xl border border-red bg-white p-6 shadow-sm">
          <QuestionRenderer
            questions={questions}
            allowPasting={false}
            onSubmit={(answers) => setSubmittedData(answers)}
          />
        </div>

        {submittedData ? (
          <div className="rounded-3xl border border-red bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-black">
              Submitted answers
            </h2>
            <pre className="mt-4 overflow-x-auto rounded-md bg-black p-4 text-sm text-white">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        ) : null}
      </div>
    </main>
  );
}
