import firebaseRef from "./firebaseRef";
import auth from "./auth";

const database = firebaseRef.getFirebase().database();
const articles = database.ref('articles');

const getKeyForTitle = (articleTitle) => { 
    articleTitle = articleTitle.replace(RegExp("-", "g"), "%2D");
    articleTitle = encodeURIComponent(articleTitle.trim().replace(RegExp(" ", "g"), "-"));
	return articleTitle.replace(RegExp("%252D", "g"), "-");
};

module.exports = {
    // addArticle expects article to be an object that has a title and content key
    addArticle: function(article) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                const articleKey = this.getKeyForTitle(article.title);
                articles.child(articleKey).set(article);
            }
        });
    },

    // updateArticle expects article to be an object that has a title and content key
    updateArticle: function(article, key) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                articles.child(key).set(article);
            }
        });
    },

    deleteArticle: function(articleTitle, onDelete) {
        const article = articles.child(articleTitle);
        article.remove((err) => {
            onDelete(err);
        })
    },

    getKeyForTitle
};
