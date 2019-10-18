import React from 'react'
import Cookies from 'js-cookie'
import { error } from 'util';
import { Progress } from 'semantic-ui-react'


export default class CVUpload extends React.Component {
    constructor(props) {
        super(props)

    }

    render() {
        return (<div className='row'>
            <div className="ui sixteen wide column">
                <p>CV Upload</p>
            </div>
        </div>)
    }
   
}
