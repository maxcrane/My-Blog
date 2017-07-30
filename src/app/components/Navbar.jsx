import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

export class Navbar extends React.Component{

	render() {
		return (
				<ul className="navcontainer">
			        <Link className="navitem navlink topnavlink" to="/about">about</Link><li className="divider">/</li>
			        <Link className="navitem navlink topnavlink" to="/articles">articles</Link>
		        </ul>
		)
	}
}
