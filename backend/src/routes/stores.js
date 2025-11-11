const express = require('express');
const router = express.Router();
const models = require('../models');
const { Op, fn, col } = models.Sequelize;
const { optionalAuth } = require('../middleware/auth');

// GET /stores - list stores with average rating and current user's rating (if auth)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { qName, qAddress, sort = 'name', order = 'asc', page = 1, limit = 20 } = req.query;
    const where = {};
    if (qName) where.name = { [Op.like]: `%${qName}%` };
    if (qAddress) where.address = { [Op.like]: `%${qAddress}%` };

    const stores = await models.Store.findAll({
      where,
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      include: [
        { model: models.Rating, as: 'ratings', attributes: ['score', 'userId'] }
      ]
    });

    const result = stores.map(s => {
      const scores = s.ratings.map(r => r.score);
      const avg = scores.length ? (scores.reduce((a,b)=>a+b,0)/scores.length) : null;
      let userScore = null;
      if (req.user) {
        const r = s.ratings.find(x => x.userId === req.user.id);
        if (r) userScore = r.score;
      }
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        averageRating: avg ? Number(avg.toFixed(2)) : null,
        userRating: userScore
      };
    });

    res.json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
