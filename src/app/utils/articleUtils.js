import firebaseRef from "./firebaseRef";
import auth from "./auth";

var database = firebaseRef.getFirebase().database(); 
var articles = database.ref('articles');

module.exports = {
	// addArticle expects article to be an object that has a title and content key
	addArticle : function(article) {
		auth.onAuthStateChanged((user)=>{
			if (user) {
				articles.child(article.title).set(article);
			}
		});
	},

	// updateArticle expects article to be an object that has a title and content key
	updateArticle : function(article, titleChanged, oldTitle) {
		console.log("titleChanged?" , titleChanged);

		if (titleChanged) {
			this.deleteArticle(oldTitle, (err)=>{
				if (err){
					console.log("error deleting old article ", err);
				}
			});
		} 
		
		this.addArticle(article);
	},

	deleteArticle : function(articleTitle, onDelete) {
		const article = articles.child(articleTitle);
		article.remove((err)=>{
			onDelete(err);
		})
	}
};