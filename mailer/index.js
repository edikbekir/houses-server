require('dotenv').config();
const nodemailer = require('nodemailer');

const config = require('./config');
const {
  userEmail,
  userPassword
} = config.default;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    secure: true,
    user: process.env.SENDER_GMAIL_EMAIL,
    pass: process.env.SENDER_GMAIL_PASSWORD
  }
});

const send = ( data ) => {
  const mailOptions = {
    to: data.email,
    subject: `Отчет о плитке`,
    text: `
      Общая площадь: ${data.area} м2 \n
      Количество поддонов: ${data.quantityPallets} шт \n
      Общий вес: ${data.weightPallets} кг \n
      ----------------------Данные о поддонах----------------------
      Название: ${data.name} \n
      Размер поддона: ${data.one_pallet} м2 \n
      Вес одного поддона: ${data.weight_pallet} кг \n
      Цвет: ${data.color}`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) =>
      error ? reject(error) : resolve(info)
    )
  })
}

export default send;
