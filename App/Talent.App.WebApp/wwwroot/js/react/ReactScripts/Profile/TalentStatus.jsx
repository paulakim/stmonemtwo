import React from 'react'
import { Form, Checkbox } from 'semantic-ui-react';
import { SingleInput } from '../Form/SingleInput.jsx';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);
        const talentstatus = this.props.status ?
            Object.assign({}, this.props.status)
            : {

            }
        this.state = {
            status: '',
            options: [
                { value: 'Actively looking for a job', text: 'Actively looking for a job' },
                { value: 'Not looking for a job at the moment', text: 'Not looking for a job at the moment' },
                { value: 'Currently employed but open to offers', text: 'Currently employed but open to offers' },
                { value: 'Will be available on later date', text: 'Will be available on later date'}
            ]
        }
        this.handleChange = this.handleChange.bind(this)
        this.saveData = this.saveData.bind(this)
    }
    handleChange(name) {

        //const data = Object.assign({}, this.props.status)
        //data[event.target.name] = event.target.value
        //this.setState({
        //    status: data
        //})
        console.log("status++++" + name)
        this.setState({
            status: name
        })
        console.log("status++++" + this.state.status)
        console.log("status++++", this.props.componentId)
        const ddata = { status: name, availableDate: null }
       // this.props.updateProfileData({ jobSeekingStatus: ddata })
        this.props.saveProfileData({ jobSeekingStatus: ddata })
        //this.props.saveProfileData( data )
        //console.log("status", data);
    }

    saveData() {
        const data = Object.assign({}, this.props.status)
        this.props.saveProfileData({ jobSeekingStatus: data })
    }

    render() {

        console.log("status", this.props.status);
        const checked = this.props.status ? this.props.status.status : ''
        console.log("status check"+ checked);
        const options = this.state.options.map(option => {
            return (
                <tr>
                    <label >
                        <input className="form-check-input" type="radio" name={option.value} key={option.value}
                            value={option.value} ref={option.value} onClick={this.handleChange.bind(this, option.value)} checked={this.props.status ? this.props.status.status == option.value : false} /> {option.value} </label>
                </tr>
            );
        });

        return (<div className='row'>
            <div className="ui sixteen wide column">
                <h5>Current Status</h5>
                <table>
                    {options}
                </table>
             
            </div>
        </div>)
    }
}