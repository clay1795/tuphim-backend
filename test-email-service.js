const mongoose = require('mongoose');
require('dotenv').config();

async function testEmailService() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Test email service
    console.log('📧 Testing email service...');
    try {
      const { sendPasswordResetEmail } = require('./services/emailService');
      
      // Test with a real user email
      const testEmail = 'lehungg2005@gmail.com';
      const testToken = 'test-token-' + Date.now();
      
      const emailResult = await sendPasswordResetEmail(testEmail, testToken);
      
      if (emailResult.success) {
        console.log('✅ Email service working perfectly!');
        console.log('   Email sent to:', testEmail);
        console.log('   Test token:', testToken);
      } else {
        console.log('❌ Email service failed:', emailResult.error);
      }
    } catch (emailError) {
      console.log('❌ Email service error:', emailError.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testEmailService();
