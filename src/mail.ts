import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "frogcat5412@gmail.com",
    pass: "rrqc ssdo hpkh nnxt"
  }
});

async function sleep(ms?: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let i = 0;

async function main() {
  while (true) {
    let mailOptions = {
      from: "youremail@gmail.com",
      to: "alexander.eveland-dewan@student.csd509j.net,ojas.bhat@student.csd509j.net",
      subject: "Email",
      text: (i++).toString()
    };
    transporter.sendMail(mailOptions, function (error: any, info: { response: string; }) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    await sleep(1000 / 1);
  }
}

main();
