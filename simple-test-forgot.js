const mongoose = require('mongoose');
require('dotenv').config();

async function simpleTest() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check if user exists
    const User = require('./models/User');
    const testEmail = 'lehungg2005@gmail.com';
    const user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log('❌ User not found:', testEmail);
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('   Username:', user.username);
    console.log('   Name:', user.fullName);
    
    // Generate reset token (same as in the API)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour
    
    // Update user with reset token
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();
    
    console.log('✅ Reset token generated and saved');
    console.log('   Token:', resetToken);
    console.log('   Expires:', resetExpires.toLocaleString());
    
    // Test email service
    console.log('\n📧 Testing email service...');
    try {
      const { sendPasswordResetEmail } = require('./services/emailService');
      const emailResult = await sendPasswordResetEmail(testEmail, resetToken);
      
      if (emailResult.success) {
        console.log('✅ Email sent successfully!');
      } else {
        console.log('❌ Email failed:', emailResult.error);
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

simpleTest();
