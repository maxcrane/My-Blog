import firebaseRef from "./firebaseRef";
import moment from "moment";
import slugify from "slugify";
import _ from "lodash";

slugify.extend({'%': ' percent'});

const database = firebaseRef.getFirebase().database();
const articles = database.ref('articles');
const drafts = database.ref('drafts');

const defaultPageSize = 3;

const getKeyForTitle = (articleTitle) => {
    return slugify(articleTitle, '_');
};

//converts the post title into a nice looking url (for which uniqueness is enforced)
const getUrlFromTitle = (articleTitle) => {
    return slugify(articleTitle, '_');
};

const getPrettyCreationDate = (rawdate) => {
    const articleCreationDate = new Date(rawdate);
    return moment(articleCreationDate).format("MMMM Do, YYYY");
};


const getDrafts = function () {
    return new Promise((resolve) => {
        drafts.orderByKey().once("value", (snapshot) => {
            resolve(_.reverse(snapshot.val()) || {});
        });
    });
};


const getDraft = function (articleKey) {
    return new Promise((resolve, reject) => {
        const draftRef = drafts.child(articleKey);
        draftRef.once("value", function (snapshot) {
            const draft = snapshot.val();
            resolve(draft);
        }, function (errorObject) {
            reject(errorObject);
        });
    });
};

const deleteDraft = (draftKey, articleKey) => {
    return new Promise((resolve, reject) => {
        const draft = drafts.child(draftKey);

        //If it's a draft of a published article, we have to remove the "draftKey" prop
        // of the article child
        if (articleKey) {
            const updates = {};
            updates[`/articles/${articleKey}/draftKey`] = null;
            updates[`/drafts/${draftKey}`] = null;

            return firebaseRef.getFirebase().database().ref().update(updates);
        }
        else {
            draft.remove().then(resolve).catch(reject);
        }
    });


};

const getArticleAtUrl = (url) => {
    return new Promise((resolve, reject) => {
        articles.orderByChild('url').equalTo(url).on("value", function (snapshot) {
            const val = snapshot.val();
            val === null ?
                reject(`Article not found`) :
                resolve(_.values(val)[0]);
        });
    });
};

const getArticleWithKeyAtUrl = (url) => {
    return new Promise((resolve, reject) => {
        articles.orderByChild('url').equalTo(url).on("value", function (snapshot) {
            const val = snapshot.val();
            const articleKey = _.keys(val)[0];

            val === null ?
                reject(`Article not found`) :
                resolve(_.assign(_.values(val)[0], {articleKey}));
        });
    });
};

const confirmArticleUrlUnique = (article) => {
    return new Promise((resolve, reject) => {
        const articleUrl = article.url;
        articles.orderByChild('url').equalTo(articleUrl).on("value", function (snapshot) {
            snapshot.val() === null ?
                resolve(article) :
                reject(`Article at url articles/${articleUrl} already exists`);
        });
    });
};

const pushArticle = (article) => {
    return new Promise((resolve, reject) => {
        const key = articles.push(article, (err) => {
            err ? reject(err) : resolve(key);
        }).key;
    });
};

//TODO: figure out better way to get articles, will this work with hundreds of artsicles?
const getArticles = () => {
    return new Promise((resolve, reject) => {
        articles.orderByKey().once("value", (snapshot) => {
            resolve(_.reverse(snapshot.val()) || {});
        }, (err) => {
            reject(err)
        });
    });
};


// Four situations
// it is a new draft without a published article
// it is an update to a draft without a published article
// it is a new draft of a change to an existing article
// it is an update of a draft changing an existing article
function saveDraft(draft, draftKey) {
    const isNewDraft = !Boolean(draftKey);
    const draftToSave = _.assign(_.pickBy(draft, _.identity), {updateDate: new Date().toJSON()});
    const updates = {};

    return new Promise((resolve, reject) => {
        draftKey = draftKey || drafts.push(draftToSave).key;

        if (draft.articleKey) {
            updates[`/articles/${draft.articleKey}/draftKey`] = draftKey;
        }

        if (!isNewDraft) {
            _.keys(draftToSave).map(key => {
                updates[`/drafts/${draftKey}/${key}`] = draftToSave[key];
            });
        }

        firebaseRef.getFirebase().database().ref().update(updates)
            .then(() => resolve(draftKey))
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
}

// Two situations
// draft of changes to published article
// draft for new article that has never been published
function publishDraft(draft, draftKey, articleKey) {
    console.log('publish draft utils ', arguments);

    return new Promise((resolve, reject) => {
        const updates = {};
        draft.url = getUrlFromTitle(draft.title);

        if (articleKey) {
            console.log(draft);

            updates[`/drafts/${draftKey}`] = null;
            updates[`/articles/${articleKey}/draftKey`] = null;
            _.keys(_.pickBy(draft, _.identity)).map(key => {
                updates[`/articles/${articleKey}/${key}`] = draft[key];
            });

            firebaseRef.getFirebase().database().ref().update(updates)
                .then((res) => {
                    console.log(res);
                    resolve(draft.url);
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        }
        else {
            //Write the draft to the articles child, then delete it under the drafts child
            confirmArticleUrlUnique(draft)
                .then(pushArticle)
                .then(() => deleteDraft(draftKey))
                .then(() => resolve(draft.url))
                .catch(reject);
        }
    });



}

module.exports = {
    // addArticle expects article to be an object that has a title and content url
    publishArticle: function (article) {
        return new Promise((resolve, reject) => {
            confirmArticleUrlUnique(article)
                .then(pushArticle)
                .then(resolve)
                .catch(reject);
        });
    },

    publishDraft,

    updateArticle: function (article, articleKey) {
        return new Promise((resolve, reject) => {
            articles.child(articleKey).update(article)
                .then(resolve)
                .catch(reject);
        });
    },

    deleteArticle: function (articleKey, onDelete) {
        const article = articles.child(articleKey);
        article.remove((err) => {
            onDelete(err);
        })
    },

    saveDraft,
    getKeyForTitle,
    getPrettyCreationDate,
    getDrafts,
    getDraft,
    deleteDraft,
    getUrlFromTitle,
    getArticleAtUrl,
    defaultPageSize,
    getArticles,
    getArticleWithKeyAtUrl
};