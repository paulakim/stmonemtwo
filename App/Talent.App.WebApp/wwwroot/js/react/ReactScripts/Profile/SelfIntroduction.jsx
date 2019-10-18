/* Self introduction section */
import React, { Component } from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import Cookies from 'js-cookie' 

export default class SelfIntroduction extends React.Component {
    constructor(props) {
        super(props);
        //const summary = props.summary ? props.summary : ''
        //const description = props.description ? props.description : ''
        //this.state = {
        //    newSummary: summary,
        //    newDescription: description
        //}
        this.handleChage = this.handleChage.bind(this)
        //this.handleChageDescription = this.handleChageDescription.bind(this)
        this.saveContent = this.saveContent.bind(this)
    };

    handleChage(event) {
        //const dataSummary = event.target.value
        //this.setState({
        //    newSummary: dataSummary
        //})
       // this.props.updateWithoutSave(dataSummary)
        let data = {}
        data[event.target.name] = event.target.value;
       // this.props.updateProfileData(data);
        this.props.updateWithoutSave(data)
    }
    //handleChageDescription(event) {
    //    const dataDescription = event.target.value
    //    this.setState({
    //        newDescription: dataDescription
    //    })
    //   // this.props.updateWithoutSave(dataDescription)
    //}

    saveContent() {
        //const { dataSummary, dataDescription } = this.state
        //let data = { summary: dataSummary, description: dataDescription }
        //this.props.updateProfileData(data);
        let data = {}
        data.summary = this.props.summary;
        data.description = this.props.description;
        this.props.updateProfileData(data);
    }



    render() {
        const summary = this.props.summary ? this.props.summary : ''
        const description = this.props.description ? this.props.description : ''
        return (
            <div className="ui sixteen wide column">
                
                <ChildSingleInput
                    inputType="text"
                    name="summary"
                    maxLength={150}
                    controlFunc={this.handleChage}
                    value={summary}
                    placeholder="Please provide a short summary about yourself"
                    errorMessage="Please  provide valid text."
                />
                <p>Summary must be more than 150 characters.</p>
                <div className="field" >
                    <textarea
                        maxLength={600}
                        name="description"
                        onChange={this.handleChage}
                        placeholder="Please tell us about any hobbies, additional experties, or anything else you'd like to add."
                        value={description}>
                    </textarea>
                </div>
                <p>Description must be between 150-600 characters.</p>
                <button type="button" className="ui right floated teal button" onClick={this.saveContent}>Save</button>
            </div>
            )
    }
}



