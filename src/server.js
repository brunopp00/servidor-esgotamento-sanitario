import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config()

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.options('/', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Length', '0');
  res.send(200);
});

app.post('/', function (req, res) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.SENHA_EMAIL,
      authMethod: 'LOGIN'
    },
  });

  const mailOptions = {
    from: req.body.email,
    to: process.env.EMAIL,
    subject: req.body.title,
    text: req.body.conteudo,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(500).json({ error: 'Erro ao enviar o email' });
    } else {
        const transporter2 = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.SENHA_EMAIL,
              authMethod: 'LOGIN'
            },
          });
        
          const mailOptions2 = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject:'Enviado com sucesso!!!',
            text: `Sua duvida foi enviada com sucesso e será respondida em breve.
                    Site: https://esgotamento-sanitario.vercel.app/`,
          };
          transporter2.sendMail(mailOptions2);
      res.status(200).json({ message: 'Email enviado com sucesso' });
    }
  });
});

app.listen(3333, function () {
});
