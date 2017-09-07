import React from "react";
import articleUtils from "../../utils/articleUtils";
import {sortByDate} from "../../utils/dateSorter";
import axios from "axios";
import ArticleList from "./ArticleList.jsx";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


export class ArticleListContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
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
        axios.get('/api/articles')
            .then((res) => {
                this.setState({
                    articles: res.data.filter(article => article.title).sort(sortByDate('creationDate'))
                });
            }).catch(function (error) {
            console.log(error);
        });
    }

    openDialog = () => {
        this.setState({dialogOpen: true});
    };

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

    onDeleteArticle(key) {
        this.setState({
            dialogTitle: `are you sure you want to delete ${key}?`,
            dialogMessage: 'this will unpublish the article',
            dialogOpen: true,
            confirmDeleteArticleKey: key,
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
        this.setState({
            articles: this.state.articles.filter(article =>
                article.key !== deletedArticleKey)
        });
    }

    render() {
        return (
            <div>
                <ArticleList articles={this.state.articles}
                             isAdmin={this.state.isAdmin}
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