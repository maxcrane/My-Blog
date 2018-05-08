import moment from "moment";
import _ from "lodash";
import slugify from "slugify";
slugify.extend({'%': ' percent'});

import firebaseRef from "./firebaseRef";
const database = firebaseRef.getFirebase().database();
const articles = database.ref('articles');
const drafts = database.ref('drafts');

const defaultPageSize = 3;
const firebaseDraftProps = ['articleKey', 'authorUid', 'creationDate', 'lastUpdatedDate',
                            'latestVersion', 'url', 'version', 'versions', 'published'];
const draftProps = ['content', 'title', 'thumbnailUrl', 'thumbnailName'];

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
        drafts.orderByChild('published')
            .equalTo(false)
            .once("value", (snapshot) => {
                const snapshotValue = snapshot.val();

                const drafts = _.keys(snapshotValue).map((key) => {
                    const draft = snapshotValue[key];
                    const latestDraftVersion = draft.latestVersion;
                    const creationDate = draft.creationDate;
                    const lastUpdatedDate = draft.lastUpdatedDate;

                    return  _.assign({},
                        latestDraftVersion,
                        {key, creationDate, lastUpdatedDate});
                });

                resolve(drafts);
            });
    });
};


const getDraft = function (draftKey) {
    return new Promise((resolve, reject) => {
        const draftRef = drafts.child(draftKey);
        draftRef.once("value", function (snapshot) {
            resolve(snapshot.val());
        }, function (errorObject) {
            reject(errorObject);
        });
    });
};

/**
 *
 * @param draftKey - key which draft is stored under
 * @param firebaseDraft - the representation of the draft as stored in firebase
 * @param updatedDraftProps - updated key/values for the draft
 * @returns Promise - containing updated firebase representation of draft
 */
const updateDraft = function (draftKey, firebaseDraft, updatedDraftProps) {
    const writtenDate = new Date().toJSON();
    const newVersionNum = firebaseDraft.version + 1;
    const newVersion = _.assign(_.pick(updatedDraftProps, draftProps), {writtenDate});

    const updatedFirebaseDraft = _.assign({}, firebaseDraft, {
        version: newVersionNum,
        latestVersion: newVersion,
        lastUpdatedDate: writtenDate,
        versions: firebaseDraft.versions.concat([newVersion])
    });

    return new Promise((resolve, reject) => {
        drafts.child(draftKey).set(updatedFirebaseDraft)
            .then(() => resolve(updatedFirebaseDraft))
            .catch(reject);
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

const confirmArticleUrlUnique = (url) => {
    return new Promise((resolve, reject) => {

        articles.orderByChild('url').equalTo(url).on("value", function (snapshot) {
            snapshot.val() === null ?
                resolve() :
                reject(`Article at url articles/${url} already exists`);
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

const getArticles = () => {
    return new Promise((resolve, reject) => {
        articles.orderByKey().once("value", (snapshot) => {
            resolve(_.reverse(snapshot.val()) || {});
        }, (err) => {
            reject(err)
        });
    });
};


/**
 *
 * @param draft - must contain these props: 'authorUid', 'title'
 *                can optionally contain 'content', 'thumbnailName', 'thumbnailUrl'
 *
 * @returns Promise which will resolve with newly saved draft object which contains
 *          it's firebase key as the value for 'key'
 */
function createDraft(draft) {
    const creationDate = new Date().toJSON();
    const lastUpdatedDate = creationDate;
    const authorUid = draft.authorUid;
    const draftToSave = _.assign({}, _.pick(draft, draftProps), {writtenDate: lastUpdatedDate});

    const objectToSave = {
        published: false,
        creationDate,
        lastUpdatedDate,
        versions: [draftToSave],
        latestVersion : draftToSave,
        authorUid,
        version: 1
    };

    return new Promise((resolve, reject) => {
        drafts.push(objectToSave)
              .then(result => resolve(_.assign({},  {key: result.key}, objectToSave)))
              .catch(reject);
    });
}



function applyUpdates(updates) {
    return new Promise((resolve, reject) => {
        firebaseRef.getFirebase().database().ref().update(updates)
            .then(resolve)
            .catch(reject);
    });
}

function publishDraft(draftKey, firebaseDraft, updatedDraftProps) {
    const draftNeedsToBeSaved = containsUpdates(firebaseDraft, updatedDraftProps);

    if (draftNeedsToBeSaved) {
        return new Promise((resolve, reject) => {
            updateDraft(draftKey, firebaseDraft, updatedDraftProps)
                .then((updatedFirebaseDraft) => publishLatestDraftVersion(draftKey, updatedFirebaseDraft))
                .then((url) => resolve(url))
                .catch(reject);
        });
    }
    else {
        return publishLatestDraftVersion(draftKey, firebaseDraft);
    }
}

function publishLatestDraftVersion(draftKey, firebaseDraft) {
    const updateToExistingArticle = Boolean(firebaseDraft.articleKey);
    const url = updateToExistingArticle ? firebaseDraft.url : getUrlFromTitle(firebaseDraft.latestVersion.title);
    const publishedDate = new Date().toJSON();

    return new Promise((resolve, reject) => {
        if (updateToExistingArticle) {
            const updatedArticle = _.assign({url},
                _.pick(firebaseDraft.latestVersion, draftProps),
                {authorUid: firebaseDraft.authorUid});

            updateArticle(firebaseDraft.articleKey, updatedArticle)
                .then(() => markLatestUpdateAsPublished(draftKey, firebaseDraft.articleKey, firebaseDraft.url, publishedDate, firebaseDraft))
                .then(() => resolve(firebaseDraft.url))
                .catch(reject);
        }
        else {
            const newArticle = _.assign({url},
                {creationDate: publishedDate},
                {draftKey},
                _.pick(firebaseDraft.latestVersion, draftProps),
                {authorUid: firebaseDraft.authorUid});

            confirmArticleUrlUnique(url)
                .then(() => pushArticle(newArticle))
                .then((newArticleKey) => markLatestUpdateAsPublished(draftKey, newArticleKey, url, publishedDate, firebaseDraft))
                .then((updatedFirebaseDraft) => resolve(updatedFirebaseDraft.url))
                .catch(reject);
        }
    });
}

function updateArticle(articleKey, article) {
    const lastUpdatedDate = new Date().toJSON();
    const updates = {};

    draftProps.forEach((prop) => {
        if (article[prop]) {
            updates[`articles/${articleKey}/${prop}`] = article[prop];
        }
    });

    updates[`articles/${articleKey}/lastUpdatedDate`] = lastUpdatedDate;

    return applyUpdates(updates);
}

function markLatestUpdateAsPublished(draftKey, articleKey, url, publishedDate, firebaseDraft) {
    const updatedFirebaseDraft = _.pick(_.assign(firebaseDraft, {articleKey, url},
                                    {lastUpdatedDate: publishedDate}, {published: true}), firebaseDraftProps);

    updatedFirebaseDraft.versions[updatedFirebaseDraft.version - 1].publishedDate = publishedDate;

    return new Promise((resolve, reject) => {
        drafts.child(draftKey).set(updatedFirebaseDraft)
            .then(() => resolve(updatedFirebaseDraft))
            .catch(reject);
    });
}


function containsUpdates(firebaseDraft, updatedDraftProps) {
    const savedProps = _.pickBy(_.pick(firebaseDraft.latestVersion, draftProps), _.identity);
    const maybeUpdatedProps = _.pickBy(_.pick(updatedDraftProps, draftProps));
    return !(_.isEqual(savedProps, maybeUpdatedProps));
}

function publishNewArticle(article) {
    return new Promise((resolve, reject) => {
        const url = getUrlFromTitle(article.title);

        confirmArticleUrlUnique(url)
            .then(() => createDraft(article))
            .then((firebaseDraft) => publishLatestDraftVersion(firebaseDraft.key, firebaseDraft))
            .then(() => resolve(url))
            .catch(reject);
    });
}

function deleteArticle(articleKey, onDelete) {
    const article = articles.child(articleKey);
    article.remove((err) => {
        onDelete(err);
    })
}

module.exports = {
    //create
    createDraft,
    publishNewArticle,

    //read
    getDraft,
    getDrafts,
    getArticles,
    getArticleAtUrl,

    //update
    updateDraft,
    publishDraft,

    //delete
    deleteDraft,
    deleteArticle,

    //constants
    draftProps,
    defaultPageSize,

    //utils
    getUrlFromTitle,
    getPrettyCreationDate,
};