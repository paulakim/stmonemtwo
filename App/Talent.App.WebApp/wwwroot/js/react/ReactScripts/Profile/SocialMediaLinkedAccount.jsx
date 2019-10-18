/* Social media JSX */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Popup } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);
        const linkedAccounts = props.linkedAccounts ?
            Object.assign({}, props.linkedAccounts)
            : {
                linkedIn: "",
                github: ""
            }
        this.state = {
            showEditSection: false,
            socialAccount: linkedAccounts 
        }
        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.saveSocialMediaLink = this.saveSocialMediaLink.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
    }

    componentDidMount() {
        $('.ui.button.social-media')
            .popup();
    }

    openEdit() {
        const linkedAccounts = Object.assign({}, this.props.linkedAccounts)
        this.setState({
            showEditSection: true,
            socialAccount: linkedAccounts
            
        })
    }
    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }
    handleChange(event) {
        const data = Object.assign({}, this.state.socialAccount)
        data[event.target.name] = event.target.value
        this.setState({
            socialAccount: data
        })
    }
    saveSocialMediaLink() {
        const profileData = {}
        profileData.linkedAccounts = Object.assign({}, this.state.socialAccount)
        this.props.saveProfileData(profileData)
        this.closeEdit()
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderDisplay() {
        let linkedIn = this.props.linkedAccounts ? this.props.linkedAccounts.linkedIn : "";
        let gitHub = this.props.linkedAccounts ? this.props.linkedAccounts.github : "";
        console.log("social " + linkedIn)
        return (
            <div className='row'>
                <div className="ui four wide column">
                    <button class="ui linkedin fluid button" type="button" onClick={e => window.open(this.props.linkedAccounts.linkedIn, "_blank")}>
                        <i aria-hidden="true" class="linkedin icon"></i>
                        LinkedIn
                    </button>
                </div>
                <div className="ui four wide column">
                    <button class="ui black fluid button" type="button" onClick={e => window.open(this.props.linkedAccounts.github,"_blank")} >
                        <i aria-hidden="true" class="github icon"></i>
                        GitHub
                    </button>
                </div>
                    <div className="ui eight wide column">
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
            )
    }

    renderEdit() {
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="linkedIn"
                    name="linkedIn"
                    value={this.state.socialAccount.linkedIn}
                    controlFunc={this.handleChange}
                    maxLength={100}
                    placeholder="Enter your LinkedIn Url"
                    errorMessage="Please enter LinkedIn Url"
                />
                <ChildSingleInput
                    inputType="text"
                    label="github"
                    name="github"
                    value={this.state.socialAccount.github}
                    controlFunc={this.handleChange}
                    maxLength={100}
                    placeholder="Enter your GitHub Url"
                    errorMessage="Please enter GitHub Url"
                />
                <button type="button" className="ui teal button" onClick={this.saveSocialMediaLink}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

}