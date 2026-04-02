import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { parseExpense } from '../aiService';
import Groq from 'groq-sdk';

// Mock Groq SDK
jest.mock('groq-sdk');

const mockCreate = jest.fn() as any;
(Groq as unknown as jest.Mock).mockImplementation(() => ({
  chat: {
    completions: {
      create: mockCreate,
    },
  },
}));

describe('aiService - parseExpense', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GROQ_API_KEY = 'test-key';
  });

  it('successfully parses a food expense', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              amount: 500,
              currency: 'INR',
              category: 'Food & Dining',
              description: 'Lunch at office',
              merchant: null,
            }),
          },
        },
      ],
    });

    const result = await parseExpense('lunch 500');

    expect(result.amount).toBe(500);
    expect(result.category).toBe('Food & Dining');
    expect(result.currency).toBe('INR');
  });

  it('correctly identifies income', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              amount: 50000,
              currency: 'INR',
              category: 'Income',
              description: 'Monthly salary',
              merchant: 'Company Name',
            }),
          },
        },
      ],
    });

    const result = await parseExpense('Received salary 50000');

    expect(result.category).toBe('Income');
    expect(result.amount).toBe(50000);
  });

  it('throws error when amount is missing', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              error: 'Could not parse expense. Please include an amount.',
              amount: null,
            }),
          },
        },
      ],
    });

    await expect(parseExpense('coffee')).rejects.toThrow('Could not parse expense. Please include an amount.');
  });
});
