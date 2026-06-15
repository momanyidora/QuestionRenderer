import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect } from 'vitest';
import { QuestionRenderer } from './QuestionRenderer';
import type { Question } from './questionTypes';

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

describe('QuestionRenderer', () => {
  it('renders text questions correctly', () => {
    render(
      <QuestionRenderer
        questions={[questions[0]]}
        allowPasting={false}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });
  it('renders textarea questions correctly', () => {
    render(
      <QuestionRenderer
        questions={[questions[1]]}
        allowPasting={false}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByLabelText(/motivation/i)).toBeInTheDocument();
  });

  it('renders select questions with all options', () => {
    render(
      <QuestionRenderer
        questions={[questions[2]]}
        allowPasting={false}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'High school' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: "Bachelor's" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: "Master's" })
    ).toBeInTheDocument();
  });

  it('renders radio questions with all options', () => {
    render(
      <QuestionRenderer
        questions={[questions[3]]}
        allowPasting={false}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByLabelText(/Fullstack/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Frontend/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Backend/i)).toBeInTheDocument();
  });

  it('renders checkbox questions with all options', () => {
    render(
      <QuestionRenderer
        questions={[questions[4]]}
        allowPasting={false}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByLabelText(/HTML/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CSS/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/JavaScript/i)).toBeInTheDocument();
  });

  it('blocks submission when required text input is empty', async () => {
    const user = userEvent.setup();
    render(
      <QuestionRenderer
        questions={[questions[0]]}
        allowPasting={false}
        onSubmit={vi.fn()}
      />
    );
    const submit = screen.getByRole('button', { name: /submit/i });
    expect(submit).toBeDisabled();
    await user.type(screen.getByLabelText(/full name/i), 'Jo');
    expect(submit).toBeDisabled();
  });

  it('blocks submission when required textarea is empty', async () => {
    const user = userEvent.setup();
    render(
      <QuestionRenderer
        questions={[questions[1]]}
        allowPasting={false}
        onSubmit={vi.fn()}
      />
    );
    const submit = screen.getByRole('button', { name: /submit/i });
    expect(submit).toBeDisabled();
    await user.type(screen.getByLabelText(/motivation/i), 'Short');
    expect(submit).toBeDisabled();
  });

  it('blocks submission when required select has no value', () => {
    render(
      <QuestionRenderer
        questions={[questions[2]]}
        allowPasting={false}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('blocks submission when required radio has no selected option', () => {
    render(
      <QuestionRenderer
        questions={[questions[3]]}
        allowPasting={false}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('blocks submission when required checkbox has no selected option', () => {
    render(
      <QuestionRenderer
        questions={[questions[4]]}
        allowPasting={false}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('shows error messages for invalid fields', async () => {
    const user = userEvent.setup();
    render(
      <QuestionRenderer
        questions={[questions[0]]}
        allowPasting={false}
        onSubmit={vi.fn()}
      />
    );
    const input = screen.getByLabelText(/full name/i);
    await user.type(input, 'Jo');
    fireEvent.blur(input);
    expect(
      screen.getByText(/must be at least 3 characters/i)
    ).toBeInTheDocument();
  });

  it('enables submit when all required fields are valid', async () => {
    const user = userEvent.setup();
    render(
      <QuestionRenderer
        questions={questions}
        allowPasting={false}
        onSubmit={vi.fn()}
      />
    );
    await user.type(screen.getByLabelText(/full name/i), 'Dorah Whali');
    await user.type(
      screen.getByLabelText(/motivation/i),
      'I want to join because I love building apps.'
    );
    await user.selectOptions(screen.getByRole('combobox'), 'bachelors');
    await user.click(screen.getByLabelText(/Fullstack/i));
    await user.click(screen.getByLabelText(/HTML/i));
    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
  });

  it('submits checkbox answers as an array and other answers as strings', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <QuestionRenderer
        questions={questions}
        allowPasting={false}
        onSubmit={onSubmit}
      />
    );

    await user.type(screen.getByLabelText(/full name/i), 'Dorah Whali');

    await user.type(
      screen.getByLabelText(/motivation/i),
      'I want to join because I am serious about becoming a software engineer.'
    );

    await user.selectOptions(screen.getByRole('combobox'), 'bachelors');
    await user.click(screen.getByLabelText(/Fullstack/i));
    await user.click(screen.getByLabelText(/HTML/i));
    await user.click(screen.getByLabelText(/CSS/i));

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      fullName: 'Dorah Whali',
      motivation:
        'I want to join because I am serious about becoming a software engineer.',
      educationLevel: 'bachelors',
      preferredTrack: 'fullstack',
      skills: ['html', 'css'],
    });
  });

  it('blocks paste into text input when allowPasting is false', () => {
    render(
      <QuestionRenderer
        questions={[questions[0]]}
        allowPasting={false}
        onSubmit={vi.fn()}
      />
    );
    const input = screen.getByLabelText(/full name/i);
    const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
    const spy = vi.spyOn(pasteEvent, 'preventDefault');
    input.dispatchEvent(pasteEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('blocks paste into textarea when allowPasting is false', () => {
    render(
      <QuestionRenderer
        questions={[questions[1]]}
        allowPasting={false}
        onSubmit={vi.fn()}
      />
    );
    const textarea = screen.getByLabelText(/motivation/i);
    const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
    const spy = vi.spyOn(pasteEvent, 'preventDefault');
    textarea.dispatchEvent(pasteEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('allows paste into text input and textarea when allowPasting is true', () => {
    render(
      <QuestionRenderer
        questions={[questions[0], questions[1]]}
        allowPasting={false}
        onSubmit={vi.fn()}
      />
    );
    const input = screen.getByLabelText(/full name/i);
    const textarea = screen.getByLabelText(/motivation/i);
    const inputEvent = new Event('paste', { bubbles: true, cancelable: true });
    const textareaEvent = new Event('paste', {
      bubbles: true,
      cancelable: true,
    });
    const inputSpy = vi.spyOn(inputEvent, 'preventDefault');
    const textareaSpy = vi.spyOn(textareaEvent, 'preventDefault');
    input.dispatchEvent(inputEvent);
    textarea.dispatchEvent(textareaEvent);
    expect(inputSpy).not.toHaveBeenCalled();
    expect(textareaSpy).not.toHaveBeenCalled();
  });
});
