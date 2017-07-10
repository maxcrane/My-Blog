import firebaseRef from "./firebaseRef";
import auth from "./auth";
import slugify from "slugify";
slugify.extend({'%': ' percent'})

const database = firebaseRef.getFirebase().database();
const articles = database.ref('articles');

const getKeyForTitle = (articleTitle) => { 
	return slugify(articleTitle, '_');
};

const addImage = (image, progress, err, complete) => { 
    const storageRef = firebaseRef.getFirebase().storage().ref(`photos/${image.name}`);
    const task = storageRef.put(image);
    task.on('state_changed', progress, err, complete);
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

    getKeyForTitle,
    addImage
};
