import React from "react";
import ReactDOM from "react-dom";

//Root folder
import {About} from "./components/About.jsx";
import {Home} from "./components/Home.jsx";
import {Navbar} from "./components/Navbar.jsx";
import {Footer} from "./components/Footer.jsx";
import Admin from "./components/Admin.jsx";

//Photo folder
import {Photos} from "./components/photos/Photos.jsx";
import {AddPhoto} from "./components/photos/AddPhoto.jsx";
import {PhotoPicker} from "./components/photos/PhotoPicker.jsx";

//Article folder
import {Article} from "./components/articles/Article.jsx";
import {ArticleList} from "./components/articles/ArticleList.jsx";
import {ArticleListContainer} from "./components/articles/ArticleListContainer.jsx";
import ArticleCard from "./components/articles/ArticleCard.jsx";
import CreateArticle from "./components/articles/CreateArticle.jsx";
import EditArticle from "./components/articles/EditArticle.jsx";
import Drafts from "./components/articles/Drafts.jsx";

//material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

//Inline css
import './css/app.css';
import './css/background.css';
import './css/simplemde.min.css';
import './css/default.min.css';
import './css/roboto.css';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

import auth from "./utils/auth";

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isAdmin: undefined
		};
	}

	componentDidMount() {
		this.setupAuth();
	}

	setupAuth() {
		auth.onAuthStateChanged(function(user) {
		    this.setState({
		    	isAdmin : Boolean(user)
		    }); 
		}.bind(this));
	}

	render() {
		let {isAdmin} = this.state;

		return (
			<MuiThemeProvider>
				<Router>
					<div>
					  	<Navbar isAdmin={isAdmin}/>
					    <Switch>
					   		<Route exact path="/"         component={ArticleListContainer}/>
					   		<Route path="/edit/:title"    component={EditArticle}/>
					   		<Route path="/article/:title" component={Article}/>	
					  		<Route path="/about"          component={About}/>
					  		<Route path="/articles"       exact render={() => (<ArticleListContainer isAdmin={isAdmin}/>)}/>	
					  		<Route path="/admin"          exact render={() => (<Admin                isAdmin={isAdmin}/>)}/>	
					  		<Route path="/drafts"         exact render={() => (<Drafts               isAdmin={isAdmin}/>)}/>	
					  		<Route path="/create"         exact render={() => (<CreateArticle 		 isAdmin={isAdmin}/>)}/>
					  		<Route exact path="/photos"   component={Photos}/>
					  		<Route path="/photos/add"     component={AddPhoto}/>
					    </Switch>
					    <Footer/>
					</div>
			  	</Router>
		  	</MuiThemeProvider>
		)
	}
}