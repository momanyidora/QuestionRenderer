# QuestionRenderer

A reusable React component for rendering dynamic forms from question data.

## Features

- Dynamic rendering of `text`, `textarea`, `select`, `radio`, and `checkbox` questions.
- Validation for required fields, `minLength`, `maxLength`, and `pattern`.
- Disabled submit button until all questions are valid.
- Global `allowPasting` flag blocks or allows paste for text-based fields.
- Accessible markup with labels, `aria-invalid`, `aria-describedby`, and fieldsets for grouped inputs.

## Running the demo

From the project root:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000/question-renderer-demo`.

## Running tests

```bash
npm test
```

## Example question data

```ts
const questions = [
  {
    id: 'fullName',
    label: 'Full name',
    type: 'text',
    required: true,
    minLength: 3,
  },
  {
    id: 'skills',
    label: 'Skills',
    type: 'checkbox',
    required: true,
    options: [
      { label: 'HTML', value: 'html' },
      { label: 'CSS', value: 'css' },
    ],
  },
];
```

## How `allowPasting` works

Pass `allowPasting={false}` to disable paste on text and textarea fields. When `false`, paste events are prevented at the input level. When `true`, users can paste normally.

## Assumptions

- The component is used inside a Next.js project and is intentionally self-contained.
- Checkbox answers should be returned as string arrays, while text, textarea, select, and radio answers return strings.
- The component expects every checkbox, radio, and select question to include `options`.
