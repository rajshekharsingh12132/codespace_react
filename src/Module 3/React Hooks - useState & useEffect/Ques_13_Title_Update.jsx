import { render, screen, fireEvent } from '@testing-library/react';
import TitleUpdate from './Ques_13_Title_Update';

describe('TitleUpdate component', () => {
  beforeEach(() => {
    // Reset document title before each test
    document.title = 'React App';
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('initial renders with count 0 and correct document title', () => {
    render(<TitleUpdate />);
    expect(screen.getByText(/You clicked 0 times/i)).toBeInTheDocument();
    expect(document.title).toBe('React App'); // Initial title not updated yet
  });

  test('clicking button increments count and updates document title with debounce', () => {
    render(<TitleUpdate />);
    const button = screen.getByText(/Click me/i);

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    // The count should be 3 immediately
    expect(screen.getByText(/You clicked 3 times/i)).toBeInTheDocument();

    // Document title update is debounced - not updated immediately
    expect(document.title).toBe('React App');

    // Fast-forward debounce timer
    jest.advanceTimersByTime(300);

    // Now document title should be updated
    expect(document.title).toBe('Clicked 3 times');
  });

  test('document title shows singular "time" when count is 1', () => {
    render(<TitleUpdate />);
    const button = screen.getByText(/Click me/i);
    fireEvent.click(button);

    jest.advanceTimersByTime(300);
    expect(document.title).toBe('Clicked 1 time');
  });
});
