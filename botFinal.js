const TelegramBot = require('node-telegram-bot-api');
const token = '1211798370:AAHPiFjg7MiBZtvjZXPbABYsXI-Q_bNAtWw';
const fs = require("fs");
const request = require('request');

const mongojs = require('mongojs')
var instring = 'mongodb+srv://Avinash:06112001a@cluster0.eh423.gcp.mongodb.net/Studentails?retryWrites=true&w=majority';
const db = mongojs(instring, ['Coll1'])

const Nightmare = require("nightmare");
const { setTimeout } = require("timers");
const nightmare = Nightmare({ show: true });

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  var chatId = msg.chat.id
  var mesname = msg.chat.first_name

  bot.sendMessage(chatId, "Hey there " + mesname + " ,I can do various tasks..\n<b>i</b>.I can get you the name associated with a roll number\n<b>ii.</b>I can get your attendance from ecap.\n\n<i>Otherwise I have a good collection of jokes</i> ", { parse_mode: "HTML" });
  bot.sendMessage(chatId, 'Syntax for:\n1.Rollno : "\/rollno rollnum"\n2.Attendance : "\/attendance rollnum;pass"\n3.Joke : \/joke');

});

bot.on('message', (msg) => {

  var recMsg = msg.text;
  var chatId = msg.chat.id

  var hi = "Hey";
  var hii = "Hi"
  if (msg.text.toString().toLowerCase().indexOf(hi) === 0) {
    bot.sendMessage(msg.chat.id, "Hello there mate!");
  }

  var bye = "bye";
  if (msg.text.toString().toLowerCase().includes(bye)) {
    bot.sendMessage(msg.chat.id, "Yo, looks like you found out things. See ya around!");
  }
})

bot.onText(/\/attendance (.+)/, (msg, match) => {

  const resp = match[1];
  const chatId = msg.chat.id;
  const fname = msg.chat.first_name;
  recMsg = resp;
  data = recMsg.split(";");
  const username = data[0];
  const password = data[1]
  function main(username, scrn) {
    nightmare
      .viewport(1440, 900)
      .goto('https://bvrit.edu.in')
      .wait(3000)
      //.type('#txtId2',username)
      //.type('#txtPwd2',password)
      .insert('#txtId2', username)
      .insert('#txtPwd2', password)
      .click('#imgBtn2')
      .wait(12000)
      .screenshot('atten.png')
      .end()
      .then(console.log)
      .catch((error) => {
        bot.sendMessage(chatId, 'Sorry ' + fname + ' ,Iam unable to serve you right now.')
      });
    setTimeout(scrn, 27000);
  }

  function scrn() {
    fs.readFile('atten.png', function (err, data) {
      if (err) {
        console.log(err);
      }
      else {
        bot.sendPhoto(chatId, data);
      }
    });
  }
  main(username, scrn);

  //fs.unlinkSync('atten.png')



});

bot.onText(/\/rollno (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1].toUpperCase();
  console.log(resp)


  db.Coll1.find({ rollno: resp }, function (err, docs) {
    console.log(docs[0].name);
    bot.sendMessage(chatId, docs[0].name + ' ,is the name of the person with the roll no ' + resp);

  })



})

bot.onText(/\/joke/, (msg) => {
  var chatId = msg.chat.id
  var mesname = msg.chat.first_name
  // Original site https://api.chucknorris.io

  request('https://api.chucknorris.io/jokes/random', function (err, res, body) {
    if (!err && res.statusCode == 200) {

      console.log(JSON.parse(body).value)
      var jk1 = JSON.parse(body).value;
      bot.sendMessage(chatId, "Here's a Chuck Norris joke for ya\n\n" + jk1)
    }
  })

});



// Git branch change
