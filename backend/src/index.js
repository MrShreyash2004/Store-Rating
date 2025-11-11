const express = require('express');
const cors = require('cors');
const bodyParser = require('express').json;
const models = require('./models');
const sequelize = models.sequelize;
const authRoutes = require('./routes/auth');
const storesRoutes = require('./routes/stores');
const adminRoutes = require('./routes/admin');
const ratingsRoutes = require('./routes/ratings');
const ownerRoutes = require('./routes/owner');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser());

app.get('/', (req,res) => res.json({ message: 'Store Ratings API' }));
app.use('/auth', authRoutes);
app.use('/stores', storesRoutes);
app.use('/ratings', ratingsRoutes);
app.use('/admin', adminRoutes);
app.use('/owner', ownerRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('DB connection established');
    await sequelize.sync({ alter: true });
    console.log('DB synced');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
