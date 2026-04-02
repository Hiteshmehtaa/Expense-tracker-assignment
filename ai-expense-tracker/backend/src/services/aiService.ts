import Groq from 'groq-sdk';
import { ParsedExpense } from '../database/db';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are an expense parser. Extract expense information from natural language input.

RULES:
1. Extract the amount as a number (no currency symbols)
2. Default currency is INR unless explicitly mentioned (USD, EUR, etc.)
16: 3. Categorize into EXACTLY one of these categories:
17:    - Food & Dining (restaurants, cafes, food delivery, groceries)
18:    - Transport (uber, ola, taxi, fuel, parking, metro)
19:    - Shopping (clothes, electronics, amazon, flipkart)
20:    - Entertainment (movies, netflix, spotify, games)
21:    - Bills & Utilities (electricity, water, internet, phone)
22:    - Health (medicine, doctor, gym, pharmacy)
23:    - Travel (flights, hotels, trips)
24:    - Personal Care (haircut, spa, salon, cosmetics)
25:    - Education (books, courses, tuition, school)
26:    - Investments (stocks, crypto, mutual funds, gold)
27:    - Subscriptions (netflix, gym, cloud storage, software)
28:    - Gifts & Charity (presents, donations, NGOs)
29:    - Home & Rent (rent, mortgage, housing repairs, furniture)
30:    - Income (salary, bonus, returns, refunds, cash inflow)
31:    - Other (anything that doesn't fit above)
4. Description should be a clean summary (not the raw input)
5. Merchant is the company/store name if mentioned, null otherwise

RESPOND ONLY WITH VALID JSON, no other text:
{
  "amount": <number>,
  "currency": "<string>",
  "category": "<string>",
  "description": "<string>",
  "merchant": "<string or null>"
}

If the input is invalid or you cannot extract an amount, respond:
{
  "error": "Could not parse expense. Please include an amount.",
  "amount": null
}
`;

export const parseExpense = async (text: string): Promise<ParsedExpense> => {
  if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing from environment variables.");
  }
  
  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text }
      ],
      model: 'llama-3.1-8b-instant', // Fast model
      temperature: 0,
      response_format: { type: 'json_object' }
    });

    const output = response.choices[0]?.message?.content;
    if (!output) throw new Error("No response from AI");
    
    const parsed = JSON.parse(output);
    if (parsed.error && !parsed.amount) {
      throw new Error(parsed.error);
    }
    
    // Safety matching
    return {
      amount: Number(parsed.amount),
      currency: parsed.currency || 'INR',
      category: parsed.category || 'Other',
      description: parsed.description || 'Unknown expense',
      merchant: parsed.merchant || null
    };

  } catch (err: any) {
    if (err.message) {
        throw err;
    }
    throw new Error("Failed to parse expense using AI.");
  }
};

export const getFinancialInsight = async (stats: { spent: number; topCategories: any[] }): Promise<string> => {
  if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing.");
  }
  
  const statsString = `
    Total Monthly Spend: ₹${stats.spent}
    Categories of Spend: ${stats.topCategories.map(c => `${c.category}: ₹${c.amount}`).join(', ')}
  `;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: 'You are a world-class financial advisor. Analyze the user spend and provide a single, actionable, 2-sentence tip to save money or optimize their budget. Be encouraging but direct. Do not use markdown bolding.' 
        },
        { role: 'user', content: `Here is my spending breakdown: ${statsString}. Give me an insight.` }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 100,
    });

    return response.choices[0]?.message?.content?.trim() || "You are doing great with your finances! Keep tracking your expenses to stay on top.";
  } catch (err) {
    console.error("AI Insight Error:", err);
    return "Keep an eye on your top categories to find saving opportunities.";
  }
};
