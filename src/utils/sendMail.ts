import { mailTransport } from "../config/mail.config";

export const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  return mailTransport.sendMail({
    from: process.env.MAIL_FROM || "no-reply@smartinbox.ai",
    to,
    subject,
    html,
  });
};
