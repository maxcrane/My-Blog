import React from "react";
import ReactDOM from "react-dom";
import {About} from "./components/About.jsx";
import {Home} from "./components/Home.jsx";
import {Article} from "./components/Article.jsx";
import {ArticleList} from "./components/ArticleList.jsx";
import {Navbar} from "./components/Navbar.jsx";
import {Admin} from "./components/Admin.jsx";
import {CreateArticle} from "./components/CreateArticle.jsx";
import {EditArticle} from "./components/EditArticle.jsx";


import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

ReactDOM.render(
	<Router>
		<div>
		  	<Navbar/>
		  	
		    <Switch>
		   		<Route exact path="/"          component={Home}/>
		   		<Route path="/edit/:title"     component={EditArticle}/>
		   		<Route path="/article/:title"  component={Article}/>	
		  		<Route path="/about"      component={About}/>
		  		<Route path="/articles"   component={ArticleList}/>
		  		<Route path="/admin"      component={Admin}/>	
		  		<Route path="/create"     component={CreateArticle}/>
		  		
		    </Switch>
		</div>
  	</Router>,
  	document.getElementById("app")
);
