import firebaseRef from "./firebaseRef";

module.exports = {
	onAuthStateChanged : function(callback) {
		firebaseRef.getFirebase().auth().onAuthStateChanged(callback);
	},

	signOut : function(success, err) {
		firebaseRef.getFirebase().auth().signOut().then(success).catch(err);
	}


}