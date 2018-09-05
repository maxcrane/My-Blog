const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();
const sitemap = require('./sitemap');

//gzip compression
app.use(compression());
app.use(express.static(path.resolve(__dirname, '..', 'dist')));

app.get('/sitemap.xml', function(req, res) {
    res.header('Content-Type', 'application/xml');
    res.send( sitemap.getSitemap() );
});


app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
});

const port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log(`Express server running at http://localhost:${port}/`);
});
