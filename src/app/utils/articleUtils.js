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
	},

	deleteArticle : function(articleTitle, onDelete) {
		const article = articles.child(articleTitle);
		article.remove((err)=>{
			onDelete(err);
		})
	}
};