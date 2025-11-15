const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send registration confirmation email
const sendRegistrationEmail = async (registration) => {
  try {
    const transporter = createTransporter();

    // Email content
    const mailOptions = {
      from: `"Aarambh Bootcamp" <${process.env.SMTP_USER}>`,
      to: registration.email,
      subject: '🎉 Registration Confirmed - Aarambh Web Development Bootcamp',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7ee787 0%, #388bfd 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #7ee787; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #388bfd; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Aarambh!</h1>
              <p>Your registration is confirmed</p>
            </div>
            <div class="content">
              <h2>Hi ${registration.name || registration.fullName || 'there'},</h2>
              <p>Thank you for registering for the <strong>Aarambh Web Development Bootcamp</strong>!</p>
              
              <div class="info-box">
                <h3>📋 Your Registration Details:</h3>
                <p><strong>Name:</strong> ${registration.name || registration.fullName}</p>
                <p><strong>Email:</strong> ${registration.email}</p>
                <p><strong>Phone:</strong> ${registration.phone || registration.phoneNumber || 'N/A'}</p>
                ${registration.college ? `<p><strong>College:</strong> ${registration.college}</p>` : ''}
                ${registration.year ? `<p><strong>Year:</strong> ${registration.year}</p>` : ''}
              </div>

              <div class="info-box">
                <h3>📅 Event Details:</h3>
                <p><strong>Date:</strong> November 22, 2025</p>
                <p><strong>Time:</strong> 10:00 AM - 6:00 PM</p>
                <p><strong>Venue:</strong> Ramgarh Engineering College, Ramgarh</p>
              </div>

              <h3>What to Bring:</h3>
              <ul>
                <li>💻 Your laptop (fully charged)</li>
                <li>📝 Notebook and pen</li>
                <li>🔌 Charger and extension cord</li>
                <li>☕ Water bottle</li>
              </ul>

              <h3>What You'll Learn:</h3>
              <ul>
                <li>✅ Roadmap Understanding</li>
                <li>✅ Build real interactive features</li>
                <li>✅ Move into real-world tools</li>
                <li>✅ Creating Interactive UI</li>
                <li>✅ Real-world Project Idea</li>
                <li>✅ Practice Strategy</li>
              </ul>

              <p>We're excited to have you join us! If you have any questions, feel free to reply to this email.</p>

              <p style="margin-top: 30px;">
                <strong>See you at the bootcamp!</strong><br>
                Team Aarambh
              </p>
            </div>
            <div class="footer">
              <p>© 2025 Aarambh - Ramgarh Engineering College</p>
              <p>This is an automated email. Please do not reply directly.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hi ${registration.name || registration.fullName || 'there'},

Thank you for registering for the Aarambh Web Development Bootcamp!

📋 Your Registration Details:
Name: ${registration.name || registration.fullName}
Email: ${registration.email}
Phone: ${registration.phone || registration.phoneNumber || 'N/A'}
${registration.college ? `College: ${registration.college}` : ''}
${registration.year ? `Year: ${registration.year}` : ''}

📅 Event Details:
Date: November 22, 2025
Time: 10:00 AM - 6:00 PM
Venue: Ramgarh Engineering College, Ramgarh

What to Bring:
- Your laptop (fully charged)
- Notebook and pen
- Charger and extension cord
- Water bottle

See you at the bootcamp!
Team Aarambh
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send admin notification email
const sendAdminNotification = async (registration) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Aarambh Bootcamp" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: '🔔 New Registration - Aarambh Bootcamp',
      html: `
        <h2>New Registration Received</h2>
        <p><strong>Name:</strong> ${registration.name || registration.fullName}</p>
        <p><strong>Email:</strong> ${registration.email}</p>
        <p><strong>Phone:</strong> ${registration.phone || registration.phoneNumber}</p>
        ${registration.college ? `<p><strong>College:</strong> ${registration.college}</p>` : ''}
        ${registration.year ? `<p><strong>Year:</strong> ${registration.year}</p>` : ''}
        <p><strong>Registered at:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification sent');
  } catch (error) {
    console.error('❌ Error sending admin notification:', error);
  }
};

module.exports = {
  sendRegistrationEmail,
  sendAdminNotification,
};
