const express = require('express')
const path = require('path');
const firebase = require("firebase");
const app = express()
var config = {
    apiKey: "AIzaSyB3033HOIzxeeoSLsHsiWBCoRpG_Sbo-4A",
    authDomain: "blog-987eb.firebaseapp.com",
    databaseURL: "https://blog-987eb.firebaseio.com",
    projectId: "blog-987eb",
    storageBucket: "blog-987eb.appspot.com",
    messagingSenderId: "198509011282"
};
firebase.initializeApp(config);
var database = firebase.database(); 
var articles = database.ref('articles');

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.use(express.static(path.join(__dirname, '../dist')));

app.get('/api/articles', function(req, res) {
	articles.once('value', (data)=>{
		const articles = [];
		const values = data.val();
		Object.keys(values).forEach((key)=>{
			articles.push({
				title: values[key].title
			});
		});
		res.send(articles);
	}, (err)=>{
		res.send(err);
	});
});

app.get('/api/login', function(req, res) {
	var email = "maxlccrane@gmail.com";
	var pass = "adminadmin";
	firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// [START_EXCLUDE]
		if (errorCode === 'auth/wrong-password') {
			alert('Wrong password.');
		} else {
			alert(errorMessage);
		}
		console.log(error);
	});
	res.send("logging in...");
});




app.get('/api/:name', function(req, res) {
	articles.push({
		title: req.params.name
	});
	res.send("added");
});

app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

app.listen(3000, function() {
    console.log('Express server running at http://localhost:3000/');
})
