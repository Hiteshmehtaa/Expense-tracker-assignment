import { Router, Request, Response } from 'express';
import { parseExpense } from '../services/aiService';
import { createExpense, getAllExpenses, deleteExpense, updateExpense } from '../database/db';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { input } = req.body;
    if (!input || typeof input !== 'string') {
      res.status(400).json({ success: false, error: 'Input is required' });
      return;
    }

    const parsedData = await parseExpense(input);
    const savedExpense = createExpense(parsedData, input);

    res.status(201).json({
      success: true,
      expense: savedExpense
    });
  } catch (error: any) {
    console.error("Parse Error:", error);
    res.status(400).json({
      success: false,
      error: error.message || 'Could not parse expense.'
    });
  }
});

router.get('/', (req: Request, res: Response) => {
  try {
    const expenses = getAllExpenses();
    res.status(200).json({
      success: true,
      expenses
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const deleted = deleteExpense(id);
    
    if (deleted) {
      res.status(200).json({ success: true, message: 'Expense deleted successfully' });
    } else {
      res.status(404).json({ success: false, error: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete expense' });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { amount, category, description, merchant } = req.body;
    
    const updated = updateExpense(id, { 
      amount: amount ? Number(amount) : undefined, 
      category, 
      description, 
      merchant 
    });
    
    if (updated) {
      res.status(200).json({ success: true, expense: updated });
    } else {
      res.status(404).json({ success: false, error: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update expense' });
  }
});

export default router;
