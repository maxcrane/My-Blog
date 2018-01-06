import React from "react";
import {withRouter} from 'react-router-dom'
import articleUtils from "../../utils/articleUtils";
import {ArticleEditor} from "./ArticleEditor.jsx";


class EditArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            articleKey: undefined,
            articleUrl: undefined,
            draftKey: undefined,
            title: undefined,
            content: undefined,
            thumbnailName: undefined,
            thumbnailUrl: undefined,
            creationDate: undefined,
            authorUid: undefined,
            isDraft: this.props.isDraft
        };
    }

    componentDidMount() {
        const {draftKey, articleTitle} = this.props.match.params;
        this.setState({draftKey, articleTitle});
        this.fetchDraftOrArticle(this.state.isDraft, draftKey, articleTitle);
    }

    fetchDraftOrArticle(isDraft, draftKey, articleTitle) {
        if (isDraft) {
            articleUtils.getDraft(draftKey)
                .then(this.setState.bind(this))
                .catch((err) => console.log(err));
        }
        else {
            articleUtils.getArticleWithKeyAtUrl(articleTitle)
                .then(this.setState.bind(this))
                .catch((err) => console.log(err));
        }
    }

    getButtons() {
        const {isDraft} = this.state;
        const publishButtonTitle = isDraft ? "publish draft" : "publish changes now";
        const draftButtonTitle = isDraft ? "save changes to draft" : "save changes as draft";
        const buttons = [
            {name: publishButtonTitle, callback: this.onPublishClicked.bind(this)},
            {name: draftButtonTitle, callback: this.onSaveDraftClicked.bind(this)}
        ];

        if (isDraft) {
            buttons.push({
                name: "delete draft",
                callback: this.onDeleteDraftClicked.bind(this)
            })
        }

        return buttons;
    }

    onDeleteDraftClicked() {
        if (!confirm(`Are you sure you want to delete this draft?`)) {
            return;
        }

        const {draftKey, articleKey} = this.state;

        articleUtils.deleteDraft(draftKey, articleKey)
            .then(() => {
                alert("draft deleted");
                this.props.history.push('/drafts');
            }).catch((err) => alert(err));
    }

    onPublishClicked(title, content, thumbnailUrl, thumbnailName) {
        console.log('publish clicked');
        //console.log(this.state);

        const updateDate = new Date().toJSON();
        const contents = {title, content, thumbnailUrl, thumbnailName, updateDate};
        this.state.isDraft ? this.publishDraft(contents) : this.updateArticle(contents);
    }

    publishDraft(contents) {
        const {articleKey, authorUid, creationDate, draftKey} = this.state;
        const draft = Object.assign(contents, {authorUid, creationDate});


        articleUtils.publishDraft(draft, draftKey, articleKey)
            .then((key) => {
                alert(`Draft published!`);
                const articleLink = `/article/${key}`;
                this.props.history.push(articleLink);
            })
            .catch((err) => {
                alert(err)
            });
    }

    updateArticle(contents) {
        const {articleKey, authorUid, creationDate, url} = this.state;
        const updateDate = new Date().toJSON();
        const article = Object.assign(contents, {authorUid, creationDate, url, updateDate});

        articleUtils.updateArticle(article, articleKey).then(() => {
            alert(`Article updated!`);
            const articleLink = `/article/${url}`;
            this.props.history.push(articleLink);
        }).catch((err) => {
            alert(err);
        });
    }

    onSaveDraftClicked(title, content, thumbnailUrl, thumbnailName) {
        console.log(`save draft clicked....`);
        console.log(this.state);

        this.setState({title, content, thumbnailName, thumbnailUrl});
        const {authorUid, creationDate, draftKey, articleKey, url} = this.state;

        const draft = {title, content, thumbnailUrl, thumbnailName,
                        authorUid, creationDate, articleKey, url};

        articleUtils.saveDraft(draft, draftKey)
            .then((draftKey) => {
                alert(`Draft saved successfully`);
                this.props.history.push(`/edit-draft/${draftKey}`);
                this.setState({isDraft: true, draftKey});
            })
            .catch(err => alert(`error: ${err}`));
    }

    render() {
        const buttons = this.getButtons();

        return (
            <div>
                <ArticleEditor {...this.state} buttons={buttons}/>
            </div>
        );
    }
}

export default withRouter(EditArticle);