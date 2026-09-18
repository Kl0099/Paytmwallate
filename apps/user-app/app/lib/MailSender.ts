"use server";

import nodemailer from "nodemailer";
// import nodemailer from "nodemailer";
interface mailsender {
  number?: string;
  email: string;
  title: string;
  body: string;
}
console.log("MAIL_USER =", process.env.MAIL_USER);
console.log("MAIL_HOST =", process.env.MAIL_HOST);
console.log("MAIL_PORT =", process.env.MAIL_PORT);
const mailSender = async ({ email, number, title, body }: mailsender) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
	console.log("process.env.MAIL_USER" ,process.env.MAIL_PASS)
    let info = transporter.sendMail({
      from: '"Paytm Wallet" <no-reply@paytm.com>',
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    return info;
  } catch (error) {
    //@ts-ignore
    console.log(error.message);
    return error;
  }
};

export async function nodemailerEmailSending({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  try {
    let response = await mailSender({
      email: email,
      title: "Verification Email",
      body: bodyHtml(otp),
    });
    // console.log("Email sent successfully");
    return {
      success: true,
      message: "success",
    };
  } catch (error) {
    console.log("error ocuured while sending email", error);
    return {
      success: false,
      message: "error while sending email",
    };
  }
}

const bodyHtml = (otp: string) => {
  return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>OTP Verification Email</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}
	
			.logo {
				max-width: 200px;
				margin-bottom: 20px;
				background-color: white;
			}
	
			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}
	
			.cta {
				display: inline-block;
				padding: 10px 20px;
				background-color: #FFD60A;
				color: #000000;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
	
			.highlight {
				font-weight: bold;
			}
		</style>
	
	</head>
	
	<body>
		<div class="container">
			<a href="#"><img class="logo"
					src="https://res.cloudinary.com/dkzp8h6xw/image/upload/v1720426316/paytm_flhmni.png" alt="Paytm Logo"></a>
			<div class="message">OTP Verification Email</div>
			<div class="body">
				<p>Dear User,</p>
				<p>To complete your registration, please use the following OTP
					(One-Time Password) to verify your account:</p>
				<h2 class="highlight">${otp}</h2>
				<p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.
				Once your account is verified, you will have access to our platform and its features.</p>
			</div>
		</div>
	</body>
	
	</html>`;
};
