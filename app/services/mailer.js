"use strict";
const path = require("path");
const nodemailer = require("nodemailer");
var hbs = require('nodemailer-express-handlebars');

const transport = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 25,
    auth: {
        user: "apikey",
        pass: "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"
    }
});

const options = {
     viewEngine: {
         extname: '.hbs',
         layoutsDir: './app/html/mail/',
         partialsDir : './app/html/mail/'
     },
     viewPath: './app/html/mail/',
     extName: '.html'
 };

transport.use("compile", hbs(options));

module.exports = transport;
