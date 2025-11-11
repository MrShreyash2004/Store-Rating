const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const models = require('../models');
const { requireAuth, requireRole } = require('../middleware/auth');

// Submit or update rating for a store (normal user)
router.post('/:storeId', requireAuth, requireRole('user'), [
  body('score').isInt({ min: 1, max: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const userId = req.user.id;
    const storeId = parseInt(req.params.storeId);
    const { score } = req.body;

    const store = await models.Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    let rating = await models.Rating.findOne({ where: { userId, storeId } });
    if (rating) {
      rating.score = score;
      await rating.save();
      return res.json({ message: 'Rating updated', rating });
    }

    rating = await models.Rating.create({ userId, storeId, score });
    res.json({ message: 'Rating submitted', rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
