import React, {Component} from "react";
import ArticleCard from './ArticleCard.jsx';
import Loader from "../Loader.jsx";
import ReactPaginate from 'react-paginate';
import {articleUtils, defaultPageSize} from '../../utils/articleUtils';
import _ from "lodash";

class ArticleList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            numArticles: undefined,
            pageCount: undefined,
            articlesPerPage: defaultPageSize,
        }
    }

    componentDidMount() {
       this.setPageCount(this.props.articles.length);
    }

    componentWillReceiveProps(nextProps) {
        this.setPageCount(nextProps.articles.length);
    }

    setPageCount(length) {
        const {currentPage} = this.state;
        const newPageCount =
            Math.ceil(length / defaultPageSize);
        const newCurrentPage = currentPage > newPageCount ? newPageCount : currentPage;

        this.setState({
            pageCount: newPageCount,
            currentPage: newCurrentPage
        });
    }

    handlePageClick = (data) => {
        const currentPage = data.selected + 1;
        this.props.getPage(currentPage, _.first(this.props.articles).url);
        this.setState({currentPage});
    };

    render() {
        const {currentPage, pageCount} = this.state;
        const {articles} = this.props;

        const startIndex = (currentPage - 1) * defaultPageSize;
        const endIndex = currentPage * defaultPageSize;

        return (
            <div className="articleAndPaginator">
                <div className="articleList">
                    {
                        articles.slice(startIndex, endIndex)
                                .map((article, index) =>
                            <ArticleCard key={index}
                                         article={article}
                                         index={index}
                                         isDraft={this.props.isListOfDrafts}
                                         history={this.props.history}
                                         deleteArticle={this.props.deleteArticle.bind(this)}
                                         isAdmin={this.props.isAdmin}/>
                        )
                    }
                    {
                        articles.hasOwnProperty('length') && articles.length === 0 ?
                            <p>
                                no articles yet :(
                            </p> : null
                    }
                </div>

                <div className="articlePaginator">
                    {
                        pageCount > 1 ? <ReactPaginate previousLabel={"PREVIOUS"}
                                                       nextLabel={"NEXT"}
                                                       pageCount={pageCount}
                                                       marginPagesDisplayed={2}
                                                       pageRangeDisplayed={5}
                                                       forcePage={currentPage - 1}
                                                       onPageChange={this.handlePageClick}
                                                       containerClassName={"pagination"}
                                                       subContainerClassName={"pages pagination"}
                                                       activeClassName={"active"}/> : null

                    }
                </div>
            </div>
        );
    }
}

export default Loader('articles')(ArticleList);