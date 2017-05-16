import firebaseRef from "./firebaseRef";
import auth from "./auth";

var database = firebaseRef.getFirebase().database(); 
var articles = database.ref('articles');

module.exports = {
	addArticle : function(article) {
		auth.onAuthStateChanged((user)=>{
			if (user) {
				articles.child(article.title).set(article);
			}
		});
	}
};