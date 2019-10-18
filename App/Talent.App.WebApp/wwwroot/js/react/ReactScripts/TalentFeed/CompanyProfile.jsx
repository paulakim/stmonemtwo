import React from 'react';
import Cookies from 'js-cookie';
import { Loader } from 'semantic-ui-react';

export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);
        const companyContact = {
            name: "",
            location: "",
            email: "",
            phone: ""
        }
        this.state = ({
            companyContact: companyContact
        })
        this.loadData = this.loadData.bind(this);
        this.saveData = this.saveData.bind(this);
    }
    componentDidMount() {
        this.loadData();
    }

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            //url: 'http://localhost:60290/profile/profile/getEmployerProfile',
            url: 'https://talentservicesprofilepaula.azurewebsites.net/profile/profile/getEmployerProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {
                //this.setState({ companyDetails: Object.assign({}, res.employer.companyContact) })
                this.saveData(res.employer)
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })
    }

    saveData(data) {
        console.log(data)
        this.setState({
            companyContact: Object.assign({}, data.companyContact)
        })
        
    }
    render() {
        const { name, phone, email, location } = this.state.companyContact;
       // console.log("test==" + city + country)
        return (
            <div className="ui card">
                <div className="content">
                    <h1 style={{ textAlign: "center" }}>
                        <img className="ui avatar image" src="https://react.semantic-ui.com/images/wireframe/image.png" />
                    </h1>
                    <div className="center aligned header">{name}</div>
                    <div className="center aligned meta"><i className="marker icon" />{location.city}, {location.country}</div>
                    <div className="center aligned description">
                        <p>We do not have specific skills that we desire.</p>
                    </div>
                </div>
                <div className="extra content">
                    <div className="meta"><i className="phone icon" />: {phone}</div>
                    <div className="meta"><i className="mail icon" />: {email}</div>
                </div>
            </div>
        )
    }
}