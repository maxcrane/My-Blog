import React, {Component} from 'react';
import '../css/loader.css';

const Loader = (propName) => (WrappedComponent) => {
    return class Loader extends Component {
        static isEmpty(prop) {
            return (
                prop === null ||
                prop === undefined
            );
        }

        render() {
            return Loader.isEmpty(this.props[propName]) ? <div className="loader">loader</div> :
                <WrappedComponent {...this.props}/>;
        }
    }
}

export default Loader;