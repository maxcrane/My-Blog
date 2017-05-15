import firebase from "firebase";

var config = {
    apiKey: "AIzaSyB3033HOIzxeeoSLsHsiWBCoRpG_Sbo-4A",
    authDomain: "blog-987eb.firebaseapp.com",
    databaseURL: "https://blog-987eb.firebaseio.com",
    projectId: "blog-987eb",
    storageBucket: "blog-987eb.appspot.com",
    messagingSenderId: "198509011282"
};
firebase.initializeApp(config);

module.exports = {
	getFirebase : function() {
		return firebase;
	}
}