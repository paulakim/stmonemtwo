import React from 'react'
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { SingleInput } from '../Form/SingleInput.jsx';
import moment from 'moment';

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props);
        //const visastatus = props.visaStatus
        const visastatus = this.props.visaStatus ? this.props.visaStatus : "";
        const visaExpiryDate = this.props.visaExpiryDate ? moment(this.props.visaExpiryDate) : moment();
      //  const visaExpiryDate = this.props.visaExpiryDate ? this.props.visaExpiryDate : moment();

        this.state = ({
            visatype: visastatus,
            changedExpiryDate: visaExpiryDate
        })
        this.handleChange = this.handleChange.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.saveStatusDate = this.saveStatusDate.bind(this);
    }

    componentWillReceiveProps(willProps) {
        console.log(willProps.visaStatus)
        console.log(willProps.visaExpiryDate)
        //let index = nextProps.languageData.map(x => x.id)
        //console.log(index)
        this.setState({
            visatype: willProps.visaStatus,
            changedExpiryDate: willProps.visaExpiryDate

        });
    }

    handleDate(e) {
        //event.persist()
        //e.preventDefault();
        console.log("ttttest");
        this.setState({
            changedExpiryDate: e.target.value
        })
        console.log("vist++++" + this.state.changedExpiryDate)
    }

    handleChange(e) {
        this.setState({ visatype: e.target.value }, this.saveVisaType);
        
    }
    saveVisaType() {
        console.log("save visa status", this.state.visatype)
        let data = {
            visaStatus: this.state.visatype,
            visaExpiryDate: null
        }
        if (this.state.visatype == 'Citizen' || this.state.visatype == 'Permanent Resident') {
            this.props.saveProfileData(data)
        }
    }

    saveStatusDate() {
        //console.log(this.props.componentId)
        //console.log(this.state.newAddress)
        console.log("vvvv" + this.state.visatype)
        console.log("vvvv" + moment(this.state.changedExpiryDate).format('DD MM YYYY'))
        let data = {
            visaStatus: this.state.visatype,
            visaExpiryDate: this.state.changedExpiryDate
        }
        this.props.saveProfileData(data)
    }



    renderVisaExpiryDate() {
        return (
            <div className="ui six wide column">
                <h5>Visa expiry date</h5>
                <input type="date"
                    name="expirydate"
                    onChange={this.handleDate}
                    placeholder="yyyy/mm/dd">
                </input>
            </div>
            )
    }
    

    render() {
        console.log("gggg" + this.props.visaStatus)
        console.log("dddd" + moment(this.props.visaExpiryDate).format('YYYY-MM-DD'))
        console.log("sss" + this.state.visatype)
        console.log("ssdd" + moment(this.state.changedExpiryDate).format('DD MM YYYY'))
        ////this.setState({
        ////    visatype: this.props.visaStatus
        ////})
        return (
            <div className='row'>
                <div className="ui three column grid">
                    <div className="ui six wide column">
                        <h5>Visa type</h5>
                        <select onChange={this.handleChange}
                            value={this.state.visatype}
                        >
                            <option value="">Select a visa type</option>
                            <option value="Citizen">Citizen</option>
                            <option value="Permanent Resident">Permanent Resident</option>
                            <option value="Work Visa">Work Visa</option>
                            <option value="Student Visa">Student Visa</option>
                        </select>
                    </div>
                    {
                        this.state.visatype == 'Work Visa' || this.state.visatype == 'Student Visa' ?
                            <div className="ui six wide column">
                                <h5>Visa expiry date</h5>
                                <input type="date"
                                    name="expirydate"
                                    value={moment(this.state.changedExpiryDate).format('YYYY-MM-DD')}
                                    onChange={this.handleDate}
                                    placeholder="yyyy/mm/dd">
                                </input>
                            </div>
                            : ""
                    }
                    {
                        this.state.visatype == 'Work Visa' || this.state.visatype == 'Student Visa' ?
                        <div className="ui four wide column">
                                <h1></h1>
                                <button type="button" className="ui teal button" onClick={this.saveStatusDate}>Save</button>
                            </div>
                            : ""
                    }
            </div>
        </div>)
    }
}