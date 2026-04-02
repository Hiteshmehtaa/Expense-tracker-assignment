# AI Expense Tracker (Premium Fintech Edition)

A professional, full-stack expense tracking app that uses LLM-powered parsing to transform natural language input into structured financial data.

Built by: [Hitesh Mehta]
GitHub: [https://github.com/Hiteshmehtaa/Expense-tracker-assignment]
Time to build: ~2.5 hours (with AI assistance)

## 🎥 Demo
[Link to your screen recording]

## 🛠️ Tech Stack
- **Mobile:** React Native, Expo, TypeScript, Lucide, Reanimated
- **Backend:** Node.js, Express, TypeScript, SQLite (better-sqlite3)
- **AI:** Groq SDK (Llama 3.1 8B)
- **Testing:** Jest, ts-test

## ✨ Key Features (Including Bonuses)
- **Natural Language Parsing**: "Spent 500 on coffee at Starbucks" -> Parsed automatically.
- **Edit & Delete Support (Bonus)**: Tap any transaction to edit its amount, category or description via a premium Modal UI.
- **Professional Unit Testing (Bonus)**: Jest tests for the AI "Brain" logic (`backend/src/services/__tests__`).
- **Premium Fintech UI**: Minimalist design with seamless list transitions, hairline dividers, and iOS-style haptics.
- **Dual Summary Header**: Real-time monthly tracking for both "Spent" and "Received" amounts.
- **Color-Coded Feedback**: Emerald Green for income/refunds, Deep Red for expenses.

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
# Add your GROQ_API_KEY to .env
npm run build   # Compiles TypeScript to dist/
npm start       # Runs the production server
```

### Mobile
```bash
cd mobile
npm install
npx expo start
# Scan the QR code with the Expo Go app (Android) or Camera app (iOS)
```

## 📁 Project Structure

```text
ai-expense-tracker/
├── backend/
│   ├── src/
│   │   ├── services/aiService.ts  # The AI Parsing "Brain"
│   │   ├── database/db.ts         # SQLite Schema & CRUD
│   │   └── routes/expenses.ts     # REST API Endpoints
│   └── src/tests/                 # AI Service Unit Tests
├── mobile/
│   ├── src/
│   │   ├── screens/               # Premium Fintech UI
│   │   ├── components/            # Reusable components (EditModal, DeleteModal, etc.)
│   │   └── services/api.ts        # Backend Communication
```

## 🤖 AI Assisted Workflow (Evaluation Criteria)

This project was built with a heavy emphasis on **AI Efficiency**. I steered the AI through several high-impact phases:
1.  **Architecture Design**: Used AI to scaffold a clean, monorepo TS structure.
2.  **Prompt Engineering**: Iteratively refined a 15-category system prompt that handles complex inputs like "Got 500 cashback" vs "Spent 500".
3.  **UI Redesign**: Guided the AI to transform a basic "dashboard box" layout into a typography-focused "Fintech Premium" app in under 20 minutes.
4.  **Issue Resolution**: Leveraged AI to instantly solve Android networking quirks (`10.0.2.2`).

### System Prompt Strategy:
The core engine uses a strictly typed JSON schema with fallback logic to ensure that even "messy" human input is categorized accurately into the correct financial bucket.
