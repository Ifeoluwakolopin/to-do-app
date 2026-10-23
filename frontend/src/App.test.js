import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the signed-out hierarchical to-do landing page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Welcome to Hierarchical To-Do!' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
});
