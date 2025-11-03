const nodemailer = require('nodemailer');
const logger = require('./logger');

// Email configuration
const transporterConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

// Create transporter
const transporter = nodemailer.createTransport(transporterConfig);

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    logger.error('Email service error:', error);
  } else {
    logger.info('Email service is ready to send messages');
  }
});

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"TupPhim" <${transporterConfig.auth.user}>`,
      to: email,
      subject: 'Đặt lại mật khẩu - TupPhim',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #1f2937; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #fbbf24; margin: 0; font-size: 28px;">TupPhim</h1>
            <h2 style="color: white; margin: 20px 0; font-size: 24px;">Đặt lại mật khẩu</h2>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Xin chào,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản TupPhim của mình. 
              Nhấp vào nút bên dưới để đặt lại mật khẩu:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #fbbf24; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                Đặt lại mật khẩu
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
              Hoặc sao chép và dán liên kết này vào trình duyệt của bạn:
            </p>
            <p style="color: #3b82f6; font-size: 14px; word-break: break-all; margin: 5px 0 0 0;">
              ${resetUrl}
            </p>
            
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: bold;">
                ⚠️ Lưu ý quan trọng:
              </p>
              <ul style="color: #92400e; font-size: 14px; margin: 10px 0 0 0; padding-left: 20px;">
                <li>Liên kết này sẽ hết hạn sau 1 giờ</li>
                <li>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này</li>
                <li>Để bảo mật, không chia sẻ liên kết này với bất kỳ ai</li>
              </ul>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p>Email này được gửi tự động từ hệ thống TupPhim</p>
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to ${email}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, fullName) => {
  try {
    const mailOptions = {
      from: `"TupPhim" <${transporterConfig.auth.user}>`,
      to: email,
      subject: 'Chào mừng đến với TupPhim!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #1f2937; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #fbbf24; margin: 0; font-size: 28px;">TupPhim</h1>
            <h2 style="color: white; margin: 20px 0; font-size: 24px;">Chào mừng bạn!</h2>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Xin chào <strong>${fullName}</strong>,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Cảm ơn bạn đã đăng ký tài khoản tại TupPhim! Chúng tôi rất vui được chào đón bạn 
              đến với cộng đồng yêu phim của chúng tôi.
            </p>
            
            <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #0369a1; margin: 0 0 15px 0; font-size: 18px;">🎬 Những gì bạn có thể làm:</h3>
              <ul style="color: #0369a1; font-size: 14px; margin: 0; padding-left: 20px;">
                <li>Xem phim miễn phí với chất lượng cao</li>
                <li>Lưu danh sách yêu thích</li>
                <li>Theo dõi lịch sử xem phim</li>
                <li>Thêm phim vào danh sách "Xem sau"</li>
                <li>Tìm kiếm phim theo thể loại, quốc gia, năm</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                 style="background-color: #fbbf24; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                Bắt đầu xem phim ngay
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p>Chúc bạn có những trải nghiệm tuyệt vời với TupPhim!</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Welcome email sent to ${email}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail
};
