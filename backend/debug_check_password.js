require('dotenv').config();
const models = require('./src/models');
(async ()=>{
  try{
    await models.sequelize.authenticate();
    console.log('DB connected');
    const User = models.User;
    const email = 'admin@storely.test';
    const user = await User.findOne({ where: { email } });
    if(!user){
      console.log('User not found:', email);
      process.exit(0);
    }
    console.log('User id:', user.id);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('password_hash (first 60 chars):', (user.password_hash||'').slice(0,60));
    console.log('password_hash length:', (user.password_hash||'').length);
    const testPassword = 'Admin@1234';
    const result = await user.validatePassword(testPassword);
    console.log(`validatePassword('${testPassword}') =>`, result);
    process.exit(0);
  }catch(err){
    console.error('Error:', err);
    process.exit(1);
  }
})();
