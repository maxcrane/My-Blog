import React from "react";
import articleUtils from "../../utils/articleUtils";
import ArticleList from "./ArticleList.jsx";

//TODO: Link drafts to special draft preview instead of published article page
export default class Drafts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drafts: [],
            waitingOnResponse: true
        }
    }


    componentDidMount() {
        this.getDrafts();
    }

    getDrafts() {
        articleUtils.getDrafts().then((drafts) => {
            this.setState({
                drafts: Object.keys(drafts).map((key) => {
                    let draft = drafts[key];
                    draft.key = key;
                    return draft;
                }),
                waitingOnResponse: false
            })
        }).catch((err) => {
            alert(err);
        });
    }

    deleteDraft(draftToDelete) {
        if (!confirm(`Are you sure you want to delete the draft with title ${draftToDelete.title}?`)) {
            return;
        }

        console.log(draftToDelete);

        articleUtils.deleteDraft(draftToDelete.key, draftToDelete.articleKey)
            .then(() => {
                this.setState({
                    drafts: this.state.drafts.filter((draft) => draft.key !== draftToDelete.key)
                });
                alert("draft deleted");
            }).catch((err) => {
            alert(`Error deleting draft ${err}`);
        });
    }

    render() {
        const {drafts, waitingOnResponse} = this.state;
        return (
            <div>
                {
                    drafts.length ?
                        <ArticleList isAdmin={this.props.isAdmin}
                                     deleteArticle={this.deleteDraft.bind(this)}
                                     isListOfDrafts={true}
                                     articles={this.state.drafts}/> :
                        waitingOnResponse ? null :
                            <p className="noDraftFoundText">no drafts found</p>
                }
            </div>
        );
    }
}