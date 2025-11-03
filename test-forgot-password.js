const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

async function testForgotPassword() {
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
    
    // Test forgot password API
    console.log('\n🧪 Testing forgot password API...');
    
    try {
      const response = await axios.post('http://localhost:3001/api/auth/forgot-password', {
        email: testEmail
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ API Response:', response.data);
      
      if (response.data.success) {
        console.log('✅ Forgot password successful!');
        if (response.data.resetToken) {
          console.log('📧 Reset token provided:', response.data.resetToken.substring(0, 10) + '...');
        }
      } else {
        console.log('❌ Forgot password failed:', response.data.message);
      }
      
    } catch (apiError) {
      console.log('❌ API Error:', apiError.response?.data || apiError.message);
      
      if (apiError.code === 'ECONNREFUSED') {
        console.log('💡 Backend server is not running. Please start it with: node server.js');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testForgotPassword();
