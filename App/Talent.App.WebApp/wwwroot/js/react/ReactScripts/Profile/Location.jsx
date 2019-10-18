import React from 'react'
import { countries, countryOptions } from '../Employer/common.js'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export class Address extends React.Component {
    constructor(props) {
        super(props)
        const address = this.props.addressData ?
            Object.assign({}, this.props.addressData)
            : {
                number: "",
                street: "",
                suburb: "",
                city: "",
                country: "",
                postCode: ""
            }
        this.state = ({
            showEditSection: false,
            editedAddress: address
        })
        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.saveAddress = this.saveAddress.bind(this)
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {

    }
    openEdit() {
        const address = Object.assign({},this.props.addressData)
        this.setState({
            showEditSection: true,
            editedAddress: address
        })
    }
    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }
    saveAddress() {
        const profileData = {}
        profileData.address = Object.assign({}, this.state.editedAddress)
        this.props.saveProfileData(profileData)
        this.closeEdit()
    }
   
    handleChange(event) {
        const data = Object.assign({}, this.state.editedAddress)
        data[event.target.name] = event.target.value;
        this.setState({
            editedAddress: data
        })
        this.props.updateWithoutSave(data)
    }
    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
            )
    }
    renderDisplay() {
        let numberDisplay = this.props.addressData ? this.props.addressData.number : ""
        let streetDisplay = this.props.addressData ? this.props.addressData.street : ""
        let suburbDisplay = this.props.addressData ? this.props.addressData.suburb : ""
        let postcodeDisplay = this.props.addressData ? this.props.addressData.postCode : ""
        let cityDisplay = this.props.addressData ? this.props.addressData.city : ""
        let countryDisplay = this.props.addressData ? this.props.addressData.country : ""
        console.log("eeeee" + numberDisplay)
        return (
            <div className="row">
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Address: {numberDisplay}, {streetDisplay}, {suburbDisplay}, {postcodeDisplay}</p>
                        <p>City: {cityDisplay}</p>
                        <p>Country: {countryDisplay}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
            )
    }
    renderEdit() {
       
        let countryOptions = [];
        let cityOptions = [];
        const selectedCountry = this.state.editedAddress.country;
        const selectedCity = this.state.editedAddress.city;

        countryOptions = Object.keys(Countries).map((x) => <option key={x} value={x}>{x}</option>);

        if (selectedCountry != null && selectedCountry != "") {
            let Cities = Countries[selectedCountry]

            cityOptions = (Cities).map((x) => <option key={x} value={x}>{x}</option>);
        }
    
        return (
            <div className="ui three column grid">
            <div className="ui four wide column">
                   
                    <ChildSingleInput
                        inputType="text"
                        label="Number"
                        name="number"
                        value={this.state.editedAddress.number}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Enter your address number"
                        errorMessage="Please enter a valid address number"
                        floated
                    />
            </div>
            <div className="ui eight wide column">
                    <ChildSingleInput
                        inputType="text"
                        label="Street"
                        name="street"
                        value={this.state.editedAddress.street}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Enter your street"
                        errorMessage="Please enter a valid street"
                        floated
                    />
            </div>
            <div className="ui four wide column">
                    <ChildSingleInput
                        inputType="text"
                        label="Suburb"
                        name="suburb"
                        value={this.state.editedAddress.suburb}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Enter your suburb"
                        errorMessage="Please enter a valid suburb"
                        floated
                    />
            </div>
                <div className="ui six wide column">
                    <h5>Country</h5>
                    <select className="ui right labeled dropdown"
                        placeholder="Country"
                        onChange={this.handleChange}
                        value={selectedCountry}
                        name="country">

                        <option value="">Select a country</option>
                        {countryOptions}
                    </select>
                    
                </div>
                <div className="ui six wide column">
                    <h5>City</h5>
                        <select className="ui right labeled dropdown"
                            placeholder="City"
                            onChange={this.handleChange}
                            value={selectedCity}
                            name="city">

                            <option value="">Select a city</option>
                        {cityOptions}
                        </select>
                    <br />
                </div>
                <div className="ui four wide column">
                    <h5>PostCode</h5>
                    <input
                        type="number"
                        value={this.state.editedAddress.postCode}
                        onChange={this.handleChange}
                        placeholder="Enter a postcode"
                        name="postCode"
                    />
                </div>
                <div className="ui six wide column">
                    <button type="button" className="ui teal button" onClick={this.saveAddress}>Save</button>
                    <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
                </div>
                <div className="ui six wide column">
                </div>
                <div className="ui four wide column">
                </div>
                </div>
        )
    }

}

export class Nationality extends React.Component {
    constructor(props) {
        super(props)
        const nationalityData = this.props.nationalityData ?
            Object.assign({}, this.props.nationalityData) : "";
        this.state = {
            newNationality: nationalityData
        }
        this.handleNationalityChange = this.handleNationalityChange.bind(this);
       // this.saveNationality = this.saveNationality.bind(this);
    }
    handleNationalityChange(event) {
        const data = Object.assign({}, this.state.newNationality)
        data[event.target.name] = event.target.value;
        this.setState({
            newNationality: data
        })
        //this.props.updateWithoutSave(data)
        this.props.saveProfileData(data)
    }
    //saveNationality() {
    //    let data = { newNationality: this.state.newNationality }
    //    this.props.saveProfileData(data)
    //}
    
    render() {
        let countryOptions = [];
        //const selectedNationality = this.state.newNationality;
        const selectedNationality = this.props.nationalityData
        countryOptions = Object.keys(Countries).map((x) => <option key={x} value={x}>{x}</option>);

        return (<div className='row'>
            <div className="ui six wide column">
                <select
                    className="ui right labeled dropdown"
                    placeholder="nationality"
                    onChange={this.handleNationalityChange}
                    value={selectedNationality}
                    name="nationality"
                >
                    <option value="">Select your nationality</option>
                    {countryOptions}
                </select>
            </div>
        </div>)
    }
}