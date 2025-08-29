import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock cocktailService to avoid network
vi.mock('../services/cocktailService', () => ({
  cocktailService: {
    getAllCocktails: async () => [
      { id: 1, name: 'Mojito', description: 'Fresh', price: 9.5, category: 'Cocktail', origin: 'CU', image: '/images/mojito.jpg' },
    ],
  },
}));

import App from '../App';

describe('App rendering', () => {
  beforeEach(() => {
    // ensure clean localStorage for protected routes
    localStorage.clear();
  });

  it('renders CocktailList on root route', async () => {
    // Set location to root; App uses BrowserRouter internally
    window.history.pushState({}, '', '/');
    render(<App />);

    // Logo or some text should appear once list loads
    expect(await screen.findByAltText('Logo Chillies')).toBeInTheDocument();
  });

  it('redirects to /login for /admin without token', async () => {
    window.history.pushState({}, '', '/admin');
    render(<App />);
    expect(await screen.findByText(/connexion/i)).toBeInTheDocument();
  });
});
