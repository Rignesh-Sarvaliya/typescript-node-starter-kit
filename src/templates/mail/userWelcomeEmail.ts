export const userWelcomeEmail = (name: string, otp: string) => {
  return {
    subject: "🎉 Welcome to Smartinbox – Your OTP Inside!",
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 8px rgba(0,0,0,0.05);">
        <h2 style="color: #3b82f6;">Welcome, ${name} 👋</h2>
        <p>Thanks for registering with <strong>Smartinbox</strong>.</p>
        <p>Your One-Time Password (OTP) is:</p>
        <div style="font-size: 24px; font-weight: bold; color: #10b981; margin: 20px 0;">${otp}</div>
        <p>This OTP is valid for 10 minutes.</p>
        <hr style="margin: 24px 0;">
        <p style="font-size: 12px; color: #777;">If you did not request this, please ignore this email.</p>
      </div>
    </div>
    `,
  };
};
