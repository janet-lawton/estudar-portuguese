import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// GET /api/cards/random - returns a random card
router.get('/random', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM cards ORDER BY RANDOM() LIMIT 1'
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'No cards found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/cards/score - saves whether the user got it right or wrong
router.post('/score', async (req: Request, res: Response) => {
  try {
    const { card_id, correct } = req.body;
    await pool.query(
      'INSERT INTO scores (card_id, correct) VALUES ($1, $2)',
      [card_id, correct]
    );
    res.json({ message: 'Score saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/cards/progress
router.get('/progress', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE correct = true) as correct,
        COUNT(*) FILTER (WHERE correct = false) as incorrect
      FROM scores
    `);
    res.json({
      correct: result.rows[0].correct || 0,
      incorrect: result.rows[0].incorrect || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/scores - resets all scores
router.delete('/reset', async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM scores');
    res.json({ message: 'Scores reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/cards/stats - total card count and distinct category count
// Read-only, additive: does not modify any existing route or table.
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) FROM cards');
    const categoryResult = await pool.query(
      'SELECT COUNT(DISTINCT category) FROM cards'
    );
    res.json({
      totalCards: Number(totalResult.rows[0].count),
      totalCategories: Number(categoryResult.rows[0].count)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;