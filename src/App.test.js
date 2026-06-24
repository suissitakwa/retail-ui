import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./api', () => ({
  fetchProfile: jest.fn().mockResolvedValue({ data: null }),
  fetchCart: jest.fn().mockResolvedValue({ data: [] }),
  API: { interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } } },
  NOTIF_API: { interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } } },
}));

test('renders the navbar', () => {
  render(<App />);
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});
