import firebaseRef from "./firebaseRef";
import auth from "./auth";
import moment from "moment";
import slugify from "slugify";
slugify.extend({ '%': ' percent' })

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

const getPrettyCreationDate = (rawdate) => {
    const articleCreationDate = new Date(rawdate);
    return moment(articleCreationDate).format("MMMM Do, YYYY");
};

const isArticleValid = (article) => {
    const errors = [];
    const { title, content, creationDate } = article;

    if (!(title)) {
        errors.push("No title found");
    }

    if (!(content)) {
        errors.push("No content found");
    }

    if (!(creationDate)) {
        errors.push("No creation date found");
    }

    return errors;
};

module.exports = {
    // addArticle expects article to be an object that has a title and content key
    saveArticle: function(article, key) {
        const validationErrors = isArticleValid(article);

        if (validationErrors.length) {
            return Promise.reject(validationErrors.join(', '));
        }

        return new Promise((resolve, reject) => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    const articleKey = key || this.getKeyForTitle(article.title);
                    articles.child(articleKey).set(article).then(resolve).catch(reject);
                } else {
                    reject('User not authorized');
                }
            });
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
    addImage,
    getPrettyCreationDate
};