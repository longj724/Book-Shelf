const path = require('path');
const express = require('express');
const crawler = require('./crawler');

const app = express();

app.get('', (req, res) => {
    const thing = crawler.getStatus();
    const thing2 = crawler.add();
    res.send({
        message1: 'Hello World',
        message2: thing2
    })
});

app.listen(3000, () => console.log('Listening on port 3000'));