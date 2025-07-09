export const ResetPasswordConstants = {
  keyPrefix: "reset_token:",
  expirySeconds: 900, // 15 minutes
  linkPrefix:
    process.env.RESET_PASSWORD_LINK_PREFIX ||
    "http://localhost:3000/api/reset-password/",
};
