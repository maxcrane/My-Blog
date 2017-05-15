import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

export class Navbar extends React.Component{
	render() {
		return (
			<nav className="navbar navbar-inverse">
			  <div className="container-fluid">
			    <div className="navbar-header">
			      <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
			        <span className="icon-bar"></span>
			        <span className="icon-bar"></span>
			        <span className="icon-bar"></span>                        
			      </button>
			      <Link to="/" className="navbar-brand">Home</Link>
			    </div>
			    <div className="collapse navbar-collapse" id="myNavbar">
			      <ul className="nav navbar-nav">
			        <li className="active"><Link to="/about">About</Link></li>
			        <li><Link to="/articles">Articles</Link></li>
			      </ul>
			    </div>
			  </div>
			</nav>
		)
	}
}