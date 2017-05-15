import firebaseRef from "./firebaseRef";

module.exports = {
	onAuthStateChanged : function(callback) {
		firebaseRef.getFirebase().auth().onAuthStateChanged(callback);
	}
}