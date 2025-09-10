import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

export async function sendVerificationEmail(
  to: string,
  token: string,
  name?: string
) {
  const verifyUrl = `${process.env.CLIENT_APP_URL}/auth/verify?token=${token}`;

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to,
    subject: "Verify your account",
    html: `
      <h3>Hi ${name ?? ""}</h3>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link will expire in 30 minutes.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}
export { transporter };