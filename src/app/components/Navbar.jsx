import React from "react";

import {
	withRouter,
  	Link
} from 'react-router-dom'

class Navbar extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			navlinks:   [ "about", "articles"],
			adminNavlinks: [ "about", "admin", "articles", "create", "drafts", "photos"],
			currentNavlinks : []
		};
	}	

	componentWillReceiveProps(nextProps){
		console.log();

		let {navlinks, adminNavlinks} = this.state;
		let {isAdmin} = nextProps;
		this.setState({ currentNavlinks : isAdmin ? adminNavlinks : navlinks});
	}

	isHomeLink(link) {
		const currentUrl = this.props.location.pathname;
        return currentUrl.slice(1) === link || (currentUrl === "/" && link === "articles");
	}

	render() {
		return (
				<ul id="navbar" className="navcontainer">
					{
						this.state.currentNavlinks.reduce((links, current, index) => {
							let isLast = index === (this.state.currentNavlinks.length - 1);
							links.push(<Link 	key={index}
				  							 	className={"navitem navlink topnavlink navlink:active " + (this.isHomeLink(current) ? "navlink-underline"  : "")}
				  								to={"/" + current}>
				  								{current}
										</Link>);

							if (!isLast) {
								links.push(<li key={index + "divider"} className="divider">|</li>);
							}	
							return links;
						}, [])
					}
		        </ul>
		)
	}
}

export default withRouter(Navbar);