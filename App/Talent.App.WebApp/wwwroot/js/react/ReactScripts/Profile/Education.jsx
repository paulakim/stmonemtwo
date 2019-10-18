/* Education section */
import React from 'react';
import Cookies from 'js-cookie';
import { default as Countries } from '../../../../../wwwroot/util/jsonFiles/countries.json'

export default class Education extends React.Component {
    constructor(props) {
        super(props)
    };

    render() {
        return (<div className='row'>
            <div className="ui sixteen wide column">
                <p>Education</p>
            </div>
        </div>)
    }
}
