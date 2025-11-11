const express = require('express');
const router = express.Router();
const models = require('../models');
const { requireAuth, requireRole } = require('../middleware/auth');

// Owner: list ratings for a store they own + average
router.get('/stores/:storeId/ratings', requireAuth, requireRole('owner'), async (req, res) => {
  try {
    const ownerId = req.user.id;
    const storeId = parseInt(req.params.storeId);
    const store = await models.Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    if (store.ownerId !== ownerId) return res.status(403).json({ message: 'Forbidden: you do not own this store' });

    const ratings = await models.Rating.findAll({ where: { storeId }, include: [{ model: models.User, as: 'user', attributes: ['id','name','email','address'] }] });
    const avg = ratings.length ? Number((ratings.reduce((a,b)=>a+b.score,0)/ratings.length).toFixed(2)) : null;
    res.json({ store: { id: store.id, name: store.name }, averageRating: avg, ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Owner: list stores owned by authenticated owner with rating summaries
router.get('/stores', requireAuth, requireRole('owner'), async (req, res) => {
  try {
    const ownerId = req.user.id;
    const stores = await models.Store.findAll({ where: { ownerId }, include: [{ model: models.Rating, as: 'ratings' }] });
    const data = stores.map(s => ({ id: s.id, name: s.name, address: s.address, ratingsCount: s.ratings.length, average: s.ratings.length ? Number((s.ratings.reduce((a,b)=>a+b.score,0)/s.ratings.length).toFixed(2)) : null }));
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
