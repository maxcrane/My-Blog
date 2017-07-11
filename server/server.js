const express = require('express');
const path = require('path');
const firebase = require("firebase");
const compression = require('compression');
const app = express();
const config = {
    apiKey: "AIzaSyB3033HOIzxeeoSLsHsiWBCoRpG_Sbo-4A",
    authDomain: "blog-987eb.firebaseapp.com",
    databaseURL: "https://blog-987eb.firebaseio.com",
    projectId: "blog-987eb",
    storageBucket: "blog-987eb.appspot.com",
    messagingSenderId: "198509011282"
};
firebase.initializeApp(config);
const database = firebase.database();
const articles = database.ref('articles');

//gzip compression
app.use(compression());

// Middleware that allows cross origin (for development only)
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.static(path.resolve(__dirname, '..', 'dist')));

app.get('/api/articles', function(req, res) {
    articles.once('value', (data) => {
        const articles = [];
        const values = data.val();

        if (values) {
            Object.keys(values).forEach((key) => {
                const article = values[key];
                article.key = key;
                articles.push(article);
            });
        }
        res.send(articles);
    }, (err) => {
        res.send(err);
    });
});

app.get('/api/:articleName', function(req, res) {
    const articleName = encodeURIComponent(req.params.articleName); 
    const articleRef = articles.child(articleName);

    articleRef.once("value", function(snapshot) {
        const article = snapshot.val();
        if (article) {
            res.send(article);
        } else {
            res.send("not found");
        }
    }, function(errorObject) {
        res.send(errorObject.code);
    });
});

app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log(`Express server running at http://localhost:${port}/`);
})
