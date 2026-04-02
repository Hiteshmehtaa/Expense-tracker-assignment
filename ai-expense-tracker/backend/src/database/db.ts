import Database from 'better-sqlite3';

const db = new Database('expenses.db');

export interface ParsedExpense {
  amount: number;
  currency: string;
  category: string;
  description: string;
  merchant: string | null;
}

export interface Expense extends ParsedExpense {
  id: number;
  original_input: string;
  created_at: string;
}

export const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount DECIMAL(10,2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'INR',
      category VARCHAR(50) NOT NULL,
      description TEXT NOT NULL,
      merchant VARCHAR(100),
      original_input TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

export const createExpense = (expense: ParsedExpense, original_input: string): Expense => {
  const stmt = db.prepare(`
    INSERT INTO expenses (amount, currency, category, description, merchant, original_input)
    VALUES (@amount, @currency, @category, @description, @merchant, @original_input)
  `);
  const info = stmt.run({ ...expense, original_input });
  
  const getStmt = db.prepare('SELECT * FROM expenses WHERE id = ?');
  return getStmt.get(info.lastInsertRowid) as Expense;
};

export const getAllExpenses = (): Expense[] => {
  const stmt = db.prepare('SELECT * FROM expenses ORDER BY created_at DESC');
  return stmt.all() as Expense[];
};

export const deleteExpense = (id: number): boolean => {
  const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
};

export const updateExpense = (id: number, expense: Partial<ParsedExpense>): Expense | null => {
  const fields = Object.keys(expense).map(f => `${f} = @${f}`).join(', ');
  const stmt = db.prepare(`UPDATE expenses SET ${fields} WHERE id = @id`);
  const info = stmt.run({ ...expense, id });
  
  if (info.changes === 0) return null;
  
  const getStmt = db.prepare('SELECT * FROM expenses WHERE id = ?');
  return getStmt.get(id) as Expense;
};
