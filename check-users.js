const mongoose = require('mongoose');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const User = require('./models/User');
    const users = await User.find({}).select('email username fullName createdAt').limit(10);
    
    console.log(`\n📧 Found ${users.length} users in database:`);
    users.forEach((user, i) => {
      console.log(`${i+1}. Email: ${user.email}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Name: ${user.fullName}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });
    
    // Check if the test email exists
    const testUser = await User.findOne({ email: 'lehungg2005@gmail.com' });
    if (testUser) {
      console.log('✅ Test user "lehungg2005@gmail.com" found in database');
      console.log(`   Username: ${testUser.username}`);
      console.log(`   Name: ${testUser.fullName}`);
    } else {
      console.log('❌ Test user "lehungg2005@gmail.com" NOT found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkUsers();
