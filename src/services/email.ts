import nodemailer from 'nodemailer';

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cidukascido@gmail.com',
    pass: 'Rekles123'
  },
})

export const sendEmail = (req: any, res: any, pdf: any, emailInfo: any) => {
  const mailOptions = {
    from: emailInfo.from,
    to: emailInfo.to,
    subject: 'Report',
    text: `You got this message, because ${emailInfo.from} sent it to you`,
    attachments: [{
      filename: 'attachment.pdf',
      content: pdf
    }]
  }
  mailer.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('sent', info);
    }
  })
}