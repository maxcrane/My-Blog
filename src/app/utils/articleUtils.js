import firebaseRef from "./firebaseRef";
import auth from "./auth";
import moment from "moment";
import slugify from "slugify";
slugify.extend({ '%': ' percent' })

const database = firebaseRef.getFirebase().database();
const articles = database.ref('articles');
const drafts = database.ref('drafts');

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

const getDrafts = function() {
    return new Promise((resolve, reject) => {

        drafts.once('value', (data) => {
            const articles = [];
            const values = data.val();
            resolve(values || []);
        }, (err) => {
            reject(err);
        });
    });
}

const getArticle = function(articleKey) {
    return new Promise((resolve, reject) => {
        const articleRef = articles.child(articleKey);
        articleRef.once("value", function(snapshot) {
            const article = snapshot.val();
            resolve(article);
        }, function(errorObject) {
            reject(errorObject);
        });
    });
}

const getDraft = function(articleKey) {
    return new Promise((resolve, reject) => {
        const draftRef = drafts.child(articleKey);
        draftRef.once("value", function(snapshot) {
            const draft = snapshot.val();
            resolve(draft);
        }, function(errorObject) {
            reject(errorObject);
        });
    });
}

const deleteDraft = (articleKey) => {    
    const draft = drafts.child(articleKey);
    return draft.remove();        
}


module.exports = {
    // addArticle expects article to be an object that has a title and content key
    publishArticle: function(article, key) {
        const validationErrors = isArticleValid(article);

        if (validationErrors.length) {
            return Promise.reject(validationErrors.join(', '));
        }

        return new Promise((resolve, reject) => {
            auth.onAuthStateChanged((user) => {
                if (!Boolean(user)) {
                    reject('User not authorized');
                } 

                const articleKey = key || this.getKeyForTitle(article.title);
                articles.child(articleKey).set(article)
                    .then(() =>  deleteDraft(articleKey))
                    .then(resolve)
                    .catch(reject);
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

    deleteDraft: function(articleKey) {
        const article = articles.child(articleKey);
        return article.remove();        
    },

    saveArticleDraft : function(article, key) {
        const validationErrors = isArticleValid(article);

        if (validationErrors.length) {
            return Promise.reject(validationErrors.join(', '));
        }

        return new Promise((resolve, reject) => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    const articleKey = key || this.getKeyForTitle(article.title);
                    drafts.child(articleKey).set(article).then(resolve).catch(reject);
                } else {
                    reject('User not authorized');
                }
            });
        });
    },

    getKeyForTitle,
    addImage,
    getPrettyCreationDate,
    getDrafts,
    getArticle,
    getDraft,
    deleteDraft
};