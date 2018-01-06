import React from "react";
import articleUtils from "../../utils/articleUtils";
import ArticleList from "./ArticleList.jsx";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import _ from 'lodash';

export class ArticleListContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: null,
            isAdmin: props.isAdmin,
            dialogOpen: false,
            dialogOptions: [],
            dialogTitle: '',
            dialogMessage: '',
            confirmDeleteArticleKey: undefined
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isAdmin: nextProps.isAdmin
        });
    }

    componentDidMount() {
        this.getArticles();
    }

    getArticles() {
        articleUtils.getArticles()
            .then(this.prepareArticlesForView)
            .then(this.assignArticlesToState.bind(this))
            .catch(console.log.bind(this));
    }

    prepareArticlesForView(articles) {
        _.forOwn(articles, function(value, key) {

            value.key = key;
            value.preview = value.content.substring(0, 150);
        });

        return Promise.resolve(_.reverse(_.values(articles)));
    }

    assignArticlesToState(articles) {
        this.setState({articles});
    }

    closeDialog = () => {
        this.setState({dialogOpen: false});
    };

    deleteArticleConfirmed = () => {
        articleUtils.deleteArticle(this.state.confirmDeleteArticleKey, (err) => {
            if (err) {
                this.setState({
                    dialogOpen: true,
                    dialogTitle: `Error deleting article`,
                    dialogMessage: `${err}`,
                    dialogOptions: [
                        <FlatButton
                            label="Cancel"
                            primary={true}
                            onClick={this.closeDialog}
                        />
                    ]
                });
            }
            else {
                this.closeDialog();
                this.articleDeleted(this.state.confirmDeleteArticleKey);
            }
        });
    };

    onDeleteArticle(article) {
        this.setState({
            dialogTitle: `are you sure you want to delete ${article.title}?`,
            dialogMessage: 'this will unpublish the article',
            dialogOpen: true,
            confirmDeleteArticleKey: article.key,
            dialogOptions: [
                <FlatButton
                    label="Cancel"
                    primary={true}
                    onClick={this.closeDialog}
                />,
                <FlatButton
                    label="Confirm"
                    primary={true}
                    onClick={this.deleteArticleConfirmed}
                />
            ]
        });
    }

    articleDeleted(deletedArticleKey) {
        const articles = this.state.articles.filter(article =>
            article.key !== deletedArticleKey);


        this.setState({articles});
    }

    getPage(pageNum, startKey) {
        this.getArticles(pageNum, startKey);
    }

    render() {
        return (
            <div>
                <ArticleList articles={this.state.articles}
                             isAdmin={this.state.isAdmin}
                             isListOfDrafts={false}
                             getPage={this.getPage.bind(this)}
                             deleteArticle={this.onDeleteArticle.bind(this)}
                             history={this.props.history}/>
                <div>
                    <Dialog
                        title={this.state.dialogTitle}
                        actions={this.state.dialogOptions}
                        modal={false}
                        open={this.state.dialogOpen}
                        onRequestClose={this.closeDialog}
                    >
                        {this.state.dialogMessage}
                    </Dialog>
                </div>
            </div>
        );
    }
}