
const TelegramBot = require('node-telegram-bot-api');

const token = '6639095834:AAFcuhlgwmyT4oEi9wPigLbd2A47NMBco6g';
const bot = new TelegramBot(token, { polling: true });
let exit = true

let answers = {};


const questions = [
    {
        question: 'What city? (with a small letter in Latin)',
        type: 'text'
    },
    {
        question: 'How many rooms? (fork from-to, 5+ if maximum)',
        type: 'text'
    },
    {
        question: 'What price? (fork from-to)',
        type: 'text'
    },
    {
        question: 'What quadrature? (fork from-to)',
        type: 'text'
    },
    {
        question: 'Age of advertisements. (from date in format 10.12.2023)',
        type: 'text'
    },
     {
        question: 'Renting or buying?',
        options: ['Rent', 'Buy']
    },
     {
        question: 'House or apartment?',
        options: ['House', 'Apartment']
    },
     {
        question: 'Agency, owner or investor?',
        options: ['Agency', 'Owner', 'Investor']
    }
];

function askQuestion(chatId, questionIndex) {

       if (!exit) {
        console.log(`I'm tired. Maybe I'll help you later... or not.`)
        return
    }
 
    if (questionIndex < questions.length) {
        const currentQuestion = questions[questionIndex].question;
        const currentType = questions[questionIndex].type;

        if (currentType === 'text') {
            bot.sendMessage(chatId, currentQuestion);
  
          } else {
            const options = questions[questionIndex].options;
            const optionsKeyboard = {
                reply_markup: {
                    keyboard: options.map(option => [{ text: option }])
                }
            };
            bot.sendMessage(chatId, currentQuestion, optionsKeyboard);
          
        }
    
        bot.once('message', (msg) => {
            const userAnswer = msg.text;
            answers[currentQuestion] = userAnswer;
            askQuestion(chatId, questionIndex + 1);
        });
    } else {
     
        let response = 'So, lets look...\n';
        for (const question in answers) {
            response += `${answers[question]}\n`;
        }
       
         bot.sendMessage(chatId, response);
         console.log(response);
         [[DATA]] = response;
         exit = false;
          
    }
}

bot.onText(/\/start/, (msg) => {

    const chatId = msg.chat.id;
    answers = {};
    bot.sendMessage(chatId, 'Is it you again? So what this time?');
    askQuestion(chatId, 0);


});

bot.onText(/\/reload/, (msg) => {
    const chatId = msg.chat.id;
    answers = {};
    bot.sendMessage(chatId, 'Lets start all over again.');
    askQuestion(chatId, 0);

});

bot.startPolling();

while (exit) {

    await(new Promise((resolve) => {
        setTimeout(resolve);
    }));
}





