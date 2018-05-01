import React from "react";
import {withRouter} from 'react-router-dom'
import articleUtils from "../../utils/articleUtils";
import {ArticleEditor} from "./ArticleEditor.jsx";
import _ from 'lodash';

class EditArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            draftKey: undefined,
            title: undefined,
            content: undefined,
            thumbnailName: undefined,
            thumbnailUrl: undefined,
            creationDate: undefined,
            authorUid: undefined,
            firebaseDraft: undefined //draft as it is saved in firebase
        };
    }

    componentDidMount() {
        const {draftKey} = this.props.match.params;
        this.setState({draftKey});
        this.fetchDraft(draftKey);
    }

    fetchDraft(draftKey) {
        articleUtils.getDraft(draftKey)
            .then((firebaseDraft) => {
                this.setState(_.assign({firebaseDraft}, firebaseDraft.latestVersion));
            })
            .catch((err) => console.log(err));
    }

    getButtons() {
        const isDraft = true;//this.state;
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
        const updatedState = {title, content, thumbnailName, thumbnailUrl};
        this.setState(updatedState);
        const {draftKey, firebaseDraft} = this.state;

        articleUtils.publishDraft(draftKey, firebaseDraft, updatedState)
            .then((key) => {
                alert(`Draft published!`);
                const articleLink = `/article/${key}`;
                this.props.history.push(articleLink);
            })
            .catch((err) => {
                alert(err);
            })
    }

    onSaveDraftClicked(title, content, thumbnailUrl, thumbnailName) {
        const updatedState = {title, content, thumbnailName, thumbnailUrl};
        this.setState(updatedState);
        const {draftKey, firebaseDraft} = this.state;

        articleUtils.updateDraft(draftKey, firebaseDraft, updatedState)
            .then((updatedFirebaseDraft) => {
                alert(`draft saved successfully`);
                this.setState({firebaseDraft: updatedFirebaseDraft});
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