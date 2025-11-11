const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const models = require('../models');
const { Op } = models.Sequelize;
const { requireAuth, requireRole } = require('../middleware/auth');

// Admin: create store
router.post('/stores', requireAuth, requireRole('admin'), [
  body('name').isLength({ min: 20, max: 60 }),
  body('email').optional().isEmail(),
  body('address').optional().isLength({ max: 400 }),
  body('ownerId').optional().isInt()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { name, email, address, ownerId } = req.body;
    const store = await models.Store.create({ name, email, address, ownerId });
    res.json({ store });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: create user (admin or owner or normal user)
router.post('/users', requireAuth, requireRole('admin'), [
  body('name').isLength({ min: 20, max: 60 }),
  body('email').isEmail(),
  body('password').isLength({ min: 8, max: 16 }).matches(/(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*/),
  body('address').optional().isLength({ max: 400 }),
  body('role').isIn(['admin','user','owner'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { name, email, password, address, role } = req.body;
    const exists = await models.User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email already exists' });
    const user = models.User.build({ name, email, address, role });
    await user.setPassword(password);
    await user.save();
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin dashboard totals
router.get('/dashboard', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const totalUsers = await models.User.count();
    const totalStores = await models.Store.count();
    const totalRatings = await models.Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: list users with filters
router.get('/users', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { name, email, address, role, sort = 'name', order = 'asc', page = 1, limit = 50 } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const users = await models.User.findAll({ where, order: [[sort, order.toUpperCase()]], limit: parseInt(limit), offset: (parseInt(page)-1)*parseInt(limit) });
    res.json({ data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: get user details (include owner rating if role is owner)
router.get('/users/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await models.User.findByPk(userId, { attributes: ['id','name','email','address','role'] });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const result = { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role };

    if (user.role === 'owner') {
      // compute average rating across stores owned by this user
      const stores = await models.Store.findAll({ where: { ownerId: user.id }, include: [{ model: models.Rating, as: 'ratings' }] });
      const storeSummaries = stores.map(s => ({ id: s.id, name: s.name, ratingsCount: s.ratings.length, average: s.ratings.length ? Number((s.ratings.reduce((a,b)=>a+b.score,0)/s.ratings.length).toFixed(2)) : null }));
      // overall owner average across all owned stores
      const allScores = stores.flatMap(s => s.ratings.map(r => r.score));
      const ownerAverage = allScores.length ? Number((allScores.reduce((a,b)=>a+b,0)/allScores.length).toFixed(2)) : null;
      result.owner = { averageRating: ownerAverage, stores: storeSummaries };
    }

    res.json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: list stores with filters
router.get('/stores', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { name, email, address, sort = 'name', order = 'asc', page = 1, limit = 50 } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await models.Store.findAll({ where, order: [[sort, order.toUpperCase()]], limit: parseInt(limit), offset: (parseInt(page)-1)*parseInt(limit), include: [{ model: models.Rating, as: 'ratings' }] });

    const data = stores.map(s => ({ id: s.id, name: s.name, email: s.email, address: s.address, rating: s.ratings.length ? Number((s.ratings.reduce((a,b)=>a+b.score,0)/s.ratings.length).toFixed(2)) : null }));
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: recent ratings
router.get('/ratings', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const ratings = await models.Rating.findAll({
      include: [
        { model: models.User, as: 'user', attributes: ['id','name','email'] },
        { model: models.Store, as: 'store', attributes: ['id','name','address'] }
      ],
      order: [['created_at','DESC']],
      limit: parseInt(limit)
    });
    res.json({ data: ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

