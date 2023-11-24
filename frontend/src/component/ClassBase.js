import React from 'react';
import withHoc from './withHoc';
import CustomerCart from './CustomerCart';
import Home from './Home';
import HocComponent from './HocComponent';
class ClassBase extends React.Component{
    constructor() {
        super();
        this.state = {}
    }
    myName() {
        return (
            <div>
                <HocComponent />
            </div>
        )
    }
    render() {
        return (
            <div>
                {withHoc(Home)}
                {this.myName()}
            </div>
        )
    }
}
export default ClassBase;