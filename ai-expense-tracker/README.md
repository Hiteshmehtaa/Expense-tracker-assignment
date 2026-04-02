# AI Expense Tracker

A premium, full-stack expense tracking app that uses LLM-powered parsing to transform natural language input into structured financial data.

Built by: [YOUR NAME]
GitHub: [YOUR GITHUB]
Time to build: 2.5 hours (with AI assistance)

## 🎥 Demo

[Link to your screen recording]

## 🛠️ Tech Stack

- **Mobile:** React Native, Expo, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Database:** SQLite (better-sqlite3)
- **AI:** Groq SDK (Llama 3.1 8B) 

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI / Expo Go app
- **Groq API Key** (Get one at console.groq.com)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Open .env and add your GROQ_API_KEY
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npm start
# Scan the QR code with the Expo Go app on Android or Camera app on iOS
```

## 📁 Project Structure

```text
ai-expense-tracker/
├── backend/
│   ├── src/
│   │   ├── services/aiService.ts  # The AI Parsing "Brain"
│   │   ├── database/db.ts         # SQLite Schema & CRUD
│   │   └── routes/expenses.ts     # REST API Endpoints
├── mobile/
│   ├── src/
│   │   ├── screens/               # Premium Fintech UI
│   │   ├── components/            # Reusable Clean UI components
│   │   └── services/api.ts        # Backend Communication
```

## 🤖 AI Prompt Design

I used a high-precision System Prompt to ensure the LLM strictly follows JSON formatting and categorizes expenses into a diversified set of 15 categories.

### System Prompt Logic:
```text
You are an expense parser. Extract expense information from natural language input.

RULES:
1. Extract the amount as a number (no currency symbols)
2. Default currency is INR unless explicitly mentioned (USD, EUR, etc.)
3. Categorize into EXACTLY one of these categories:
   - Food & Dining, Transport, Shopping, Entertainment, Bills & Utilities, 
     Health, Travel, Personal Care, Education, Investments, Subscriptions, 
     Gifts & Charity, Home & Rent, Income, Other.
4. Description should be a clean summary.
5. Merchant should be identified where possible.

RESPOND ONLY WITH VALID JSON.
```

## ✨ Key Features
- **Natural Language Parsing**: "Spent 500 on coffee at Starbucks" -> Parsed automatically.
- **Premium Fintech UI**: Minimalist design with seamless list transitions and hairline dividers.
- **Haptic & Visual Feedback**: Physical vibrations and button transformations for successful actions.
- **Dual Summary Header**: Real-time monthly tracking for both "Spent" and "Received" amounts.
- **Color-Coded Status**: Red for expenses, Green for income.
