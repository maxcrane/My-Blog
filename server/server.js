const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();

//gzip compression
app.use(compression());
app.use(express.static(path.resolve(__dirname, '..', 'dist')));

app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log(`Express server running at http://localhost:${port}/`);
});
