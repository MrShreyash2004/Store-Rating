const models = require('../src/models');

async function seed(){
  try{
    const sequelize = models.sequelize;
    await sequelize.authenticate();
    console.log('DB connected');
    await sequelize.sync({ alter: true });

    const { User, Store, Rating } = models;

    // create admin
    let admin = await User.findOne({ where: { email: 'admin@storely.test' } });
    if (!admin){
      admin = User.build({ name: 'Administrator of Storely Platform', email: 'admin@storely.test', address: 'Platform HQ', role: 'admin' });
      await admin.setPassword('Admin@1234');
      await admin.save();
      console.log('Created admin user: admin@storely.test / Admin@1234');
    }

    // create owner
    let owner = await User.findOne({ where: { email: 'owner@storely.test' } });
    if (!owner){
      owner = User.build({ name: 'Outstanding Store Owner', email: 'owner@storely.test', address: 'Owner Address 1', role: 'owner' });
      await owner.setPassword('Owner@1234');
      await owner.save();
      console.log('Created owner user: owner@storely.test / Owner@1234');
    }

    // create normal user
    let user = await User.findOne({ where: { email: 'user@storely.test' } });
    if (!user){
      user = User.build({ name: 'Everyday Normal User Demo', email: 'user@storely.test', address: 'User address', role: 'user' });
      await user.setPassword('User@1234');
      await user.save();
      console.log('Created normal user: user@storely.test / User@1234');
    }

    // sample stores
    const sampleStores = [
      { name: 'The Great Coffee Roastery and Brew House', email: 'coffee@store.test', address: '123 Bean Lane', ownerId: owner.id },
      { name: 'Bright Books & Stationery Emporium', email: 'books@store.test', address: '45 Paper St', ownerId: owner.id },
      { name: 'Green Grocers and Organic Market', email: 'grocer@store.test', address: '77 Fresh Ave', ownerId: owner.id }
    ];

    for (const s of sampleStores){
      let store = await Store.findOne({ where: { email: s.email } });
      if (!store) {
        store = await Store.create(s);
        console.log('Created store', store.name);
      }
    }

    // add some ratings by normal user
    const stores = await Store.findAll();
    for (const s of stores){
      const exists = await Rating.findOne({ where: { userId: user.id, storeId: s.id } });
      if (!exists){
        const score = Math.floor(Math.random()*5)+1;
        await Rating.create({ userId: user.id, storeId: s.id, score });
        console.log(`User ${user.email} rated ${s.name} ${score}`);
      }
    }

    console.log('Seed complete');
    process.exit(0);
  }catch(err){
    console.error('Seed failed', err);
    process.exit(1);
  }
}

seed();
