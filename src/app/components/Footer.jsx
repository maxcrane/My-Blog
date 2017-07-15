import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

export class Footer extends React.Component{

	render() {
		const currentYear = new Date().getFullYear();
		return (
			<footer>
			  <p>&copy; Max Crane, {currentYear}</p>
			</footer>
		)
	}
}
