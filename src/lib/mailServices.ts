import nodemailer from "nodemailer";
import dns from "dns";
import net from "net";
import validator from "validator";
import isEmail from "isemail";
import axios from 'axios';


export function generateOTP() {
  let digits = "0123456789";
  let OTP = "";
  let len = digits.length;
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * len)];
  }
  return OTP as string;
}


export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sarojdhakal307@gmail.com",
    pass: "sggt tsqe jzsb sawj",
  },
});

export const signUpMailOTP = async (email: string, userName: string) => {
  const OTP: number = parseInt(generateOTP());
  const signupOTP_MailOptions = {
    from: "sarojdhakal307@gmail.com",
    to: email,
    subject: "SignUp - OTP verification",
    html: `
    <b>Dear ${userName}</b>, 

    <p>To complete your verification, please use the One-Time Password (OTP) provided below:<p>
    <b>your OTP: ${OTP}</b>

   <p> Thank you for chosing <b>RMS</b>.</p>
       `,
  };
  await transporter.sendMail(signupOTP_MailOptions);

  return { signupOTP_MailOptions, OTP };
};

export const validateEmailFormat = async (email: string) => {
  return await validator.isEmail(email);
};

export const validateDomainName = async (email: string) => {
  const domain = email.split("@")[1];
  
    dns.resolve(domain, "MX", (err, addresses) => {
      if (err || addresses.length === 0) {
        return false;
      } else {
        return true;
      }
    });
  
};


