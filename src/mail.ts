import nodemailer from "nodemailer";
import { getMaxLen } from "./maxLen";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "brandon.robertson@student.csd509j.net",
    pass: "fkjg tveo axow qzki"
  }
});

async function sleep(ms?: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mailBot() {
  while (true) {
    let mailOptions = {
      from: "youremail@gmail.com",
      to: "alexander.eveland-dewan@student.csd509j.net,ojas.bhat@student.csd509j.net",
      subject: "Email",
      text: getMaxLen()
    };
    transporter.sendMail(mailOptions, function (error: any, info: { response: string }) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    await sleep(1000 / 10);
  }
}
