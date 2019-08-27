const path = require('path');
const hbs = require('hbs');
const express = require('express');
const crawler = require('./serverJS/crawler');

const app = express();

// Define paths for Express config
const viewsPath = path.join(__dirname, 'templates/views');
const staticDirectoryPath = path.join(__dirname, 'static');

// Setup handlebars engine and views location
app.set('views', viewsPath)
app.set('view engine', 'hbs');

// Setup static directory to serve
app.use(express.static(staticDirectoryPath));

app.get('', (req, res) => {
    res.render('main', {

    })
});

app.get('/sign-in', (req, res) => {
    res.render('signIn')
})

app.get('/books', (req, res) => {
    res.render('books')
})

app.get('/book-info/:title', (req, res) => {
    crawler.getStatus(req.params.title).then((response) => response)
    .then((response) => {
        return response
    }).then((response) => {
        res.render('book-info', {
        info: response,
        name: 'Justin'
        })
    })
})

app.listen(3000, () => console.log('Listening on port 3000'));