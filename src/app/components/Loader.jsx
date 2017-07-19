import React, {Component} from 'react';
import '../css/loader.css';

const Loader = (propName) => (WrappedComponent) => {
	return class Loader extends Component {
		isEmpty(prop) {
			return (
				prop === null ||
			    prop === undefined ||
		  	    (prop.hasOwnProperty('length') && prop.length === 0)
		 	);
		}

		render() {
			return this.isEmpty(this.props[propName]) ? <div className="loader">loader</div> : 
				<WrappedComponent {...this.props}/>;
		}
	}
}

export default Loader;