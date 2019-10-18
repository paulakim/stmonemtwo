///* Language section */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import Cookies from 'js-cookie';
import { Table, Icon } from 'semantic-ui-react';

export default class Language extends React.Component {
    constructor(props) {
        super(props);
        const language = this.props.languageData ?
            Object.assign([], this.props.languageData)
            : []
        this.state = ({
            showAddSection: false,
            showEditSection: false,
            languages: [],
            addedLanguage: language,
            updateId: "",
            newLanguage: {
                name: '',
                level: ''
            }
        })
        this.updateWithoutSave = this.updateWithoutSave.bind(this);
        this.loadData = this.loadData.bind(this);
        this.handleChage = this.handleChage.bind(this)
        this.handleChageName = this.handleChageName.bind(this)
        this.handleAddnewClick = this.handleAddnewClick.bind(this);
        this.handleAddSave = this.handleAddSave.bind(this);
        this.handleAddCancle = this.handleAddCancle.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.updateEdit = this.updateEdit.bind(this);
        this.handleEditCancel = this.handleEditCancel.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
   
    componentDidMount() {
        this.loadData();
    };

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            //url: 'http://localhost:60290/profile/profile/getLanguage',
            url: 'https://talentservicesprofilepaula.azurewebsites.net/profile/profile/getLanguage',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {
                this.updateWithoutSave(res.data)
            }.bind(this)
        })
    }

    updateWithoutSave(newValues) {
        console.log(newValues)
        let newLang = Object.assign([], this.state.addedLanguage, newValues)
        this.setState({
            addedLanguage: newLang
        })
        
    }
    handleAddnewClick() {
        this.setState({
            showAddSection: true,
            newLanguage: {
                name: '',
                level: ''
            }
        })
    }
    handleChageName(event) {
        const data = Object.assign({}, this.state.newLanguage)
        data[event.target.name] = event.target.value
        this.setState({
            newLanguage: data
        })
    }

    handleAddSave() {
        const addednewlan = this.state.newLanguage;
        let isNull = addednewlan.level == 0 || addednewlan.name.length == 0;
        if (isNull) {
            TalentUtil.notification.show("Please enter Level and Name of Language", "error", null, null)
        }
        else {
            var cookies = Cookies.get('talentAuthToken');
            $.ajax({
                //url: 'http://localhost:60290/profile/profile/addLanguage',
                url: 'https://talentservicesprofilepaula.azurewebsites.net/profile/profile/addLanguage',
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                type: "POST",
                data: JSON.stringify(this.state.newLanguage),
                success: function (res) {
                    console.log(res)
                    if (res.success == true) {
                        TalentUtil.notification.show("Language added sucessfully", "success", null, null)
                        
                        this.loadData();
                        this.handleAddCancle();
                    } else {
                        TalentUtil.notification.show("Language hasn't been added", "error", null, null)
                    }

                }.bind(this),
                error: function (res, a, b) {
                    console.log(res)
                    //console.log(a)
                    //console.log(b)
                }
            })
        }
    }
    handleChage(event) {
        const data = Object.assign({}, this.state.newLanguage)
        data[event.target.name] = event.target.value
        this.setState({ newLanguage: data })
    }
    handleAddCancle() {
        this.setState({
            showAddSection: false 
        })
    }

    handleEdit(lan) {
        console.log("data nid" + lan.id)
        this.setState({
            showEditSection: true,
            newLanguage: lan,
            updateId:lan.id
        })
    }

    handleEditCancel() {
        console.log("edit===")
        this.setState({
            showEditSection: false,
           
        })
        
    }
    updateEdit(data) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            //url: 'http://localhost:60290/profile/profile/updateLanguage',
            url: 'https://talentservicesprofilepaula.azurewebsites.net/profile/profile/updateLanguage',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(data),
            success: function (res) {
                console.log(res)
                if (res.success == true) {
                    TalentUtil.notification.show("Profile updated sucessfully", "success", null, null)
                    this.setState({
                        addedSkill: res.data
                    });
                    this.loadData();
                    this.handleEditCancel();
                    //window.location = "/TalentProfile";
                } else {
                    TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
                }
            }.bind(this),
            error: function (res, a, b) {
                console.log(res)
                //console.log(a)
                //console.log(b)
            }
        })
    }
    handleDelete(data) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            //url: 'http://localhost:60290/profile/profile/deleteLanguage',
            url: 'https://talentservicesprofilepaula.azurewebsites.net/profile/profile/deleteLanguage',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(data),
            success: function (res) {
                console.log(res)
                if (res.success == true) {
                    TalentUtil.notification.show("Profile updated sucessfully", "success", null, null)
                    this.setState({
                        addedLanguage: res.data,
                    });
                    this.loadData();
                } else {
                    TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
                }

            }.bind(this),
            error: function (res, a, b) {
                console.log(res)
                //console.log(a)
                //console.log(b)
            }
        })
    }

    renderAddLnaguage() {
        return (
            <div className="ui row">
            <div className="ui five wide column">
                <ChildSingleInput
                    inputType="Text"
                    maxLength={50}
                        value={this.state.newLanguage.name}
                        controlFunc={this.handleChageName}
                    placeholder="Add Language"
                        name="name"
                    errorMessage="Please enter a language"
                >
                </ChildSingleInput>
            </div>
            <div className="ui five wide column">
                    <select
                        placeholder="Language Level"
                        value={this.state.newLanguage.level}
                        onChange={this.handleChage}
                        name="level"
                    >
                    <option value="">Language Level</option>
                    <option key="Basic" vale="Basic">Basic</option>
                    <option key="Conversational" value="Conversational">Conversational</option>
                    <option key="Fluent" value="Fluent">Fluent</option>
                    <option key="Native/Bilingual" value="Native/Bilingual">Native/Bilingual</option>
                </select>
                </div>
                <div className="ui six wide column">
                    <button type="button" className="ui teal button" onClick={this.handleAddSave}>Add</button>
                    <button type="button" className="ui button" onClick={this.handleAddCancle}>Cancel</button>
                </div>
            </div>
            )
    }

    renderEdit() {
        let lanid = this.props.languageData.id
        let langname = this.props.languageData.name
        let langlevel = this.props.languageData.level
        const newName = this.state.newLanguage.level;
        console.log("name: " + newName)
        
        return (
            <tbody>
                <td>
                <div className="ui four wide column">
                <ChildSingleInput
                            inputType="Text"
                            maxLength={50}
                            name="name"
                            errorMessage="Please enter a language"
                            controlFunc={this.handleChageName}
                            value={this.state.newLanguage.name}
                >
                    </ChildSingleInput>
                    </div>
                </td>
                <td>
                <div className="ui four wide column">
                        <select
                            placeholder="Language Level"
                            value={this.state.newLanguage.level}
                            onChange={this.handleChage}
                            name="level">
                            
                            <option key="Basic" vale="Basic">Basic</option>
                            <option key="Conversational" value="Conversational">Conversational</option>
                            <option key="Fluent" value="Fluent">Fluent</option>
                            <option key="Native/Bilingual" value="Native/Bilingual">Native/Bilingual</option>
                    </select>
                    </div>
                </td>
                <td>
                    <div className="six wide column">
                        <button type="button" className="ui blue basic button" onClick={this.updateEdit.bind(this, this.state.newLanguage)}>Update</button>
                        <button type="button" className="ui pink basic button" onClick={this.handleEditCancel}>Cancel</button>
                    </div>
                    </td>
            </tbody>
            )
    }

    render() {
        const upLan = this.state.addedLanguage;
        const upid = this.state.updateId;
        let tableLanguage = null;
        if (upLan != null) {
            
            tableLanguage =
                upLan.map(x => <tr key={x.id}>
                    {this.state.showEditSection && x.id == this.state.updateId ?
                    <React.Fragment>
                        <td>
                            <div className="ui four wide column">
                                <ChildSingleInput
                                    inputType="Text"
                                    maxLength={50}
                                    name="name"
                                    errorMessage="Please enter a language"
                                    controlFunc={this.handleChageName}
                                    value={this.state.newLanguage.name}
                                >
                                </ChildSingleInput>
                            </div>
                        </td>
                        <td>
                            <div className="ui four wide column">
                                <select
                                    placeholder="Language Level"
                                    value={this.state.newLanguage.level}
                                    onChange={this.handleChage}
                                    name="level">

                                    <option key="Basic" vale="Basic">Basic</option>
                                    <option key="Conversational" value="Conversational">Conversational</option>
                                    <option key="Fluent" value="Fluent">Fluent</option>
                                    <option key="Native/Bilingual" value="Native/Bilingual">Native/Bilingual</option>
                                </select>
                            </div>
                        </td>
                        <td>
                            <div className="six wide column">
                                <button type="button" className="ui blue basic button" onClick={this.updateEdit.bind(this, this.state.newLanguage)}>Update</button>
                                <button type="button" className="ui pink basic button" onClick={this.handleEditCancel}>Cancel</button>
                            </div>
                        </td>
                        </React.Fragment>
                    :
                    <React.Fragment>
                        <td>{x.name}</td>
                        <td>{x.level}</td>
                        <td>
                            <div className="ui right floated labeled button" onClick={this.handleEdit.bind(this, x)} tabIndex="0">
                                <i className="write icon"></i>
                            </div>
                            <div className="ui right floated labeled button" onClick={this.handleDelete.bind(this, x)} tabIndex="0">
                                <i className="delete icon"></i>
                            </div>
                        </td>
                        </React.Fragment>
            }
                </tr>)
        }
        return (<div className='ui three column grid'>
            {this.state.showAddSection ? this.renderAddLnaguage() : ""}
            
            <div className="ui sixteen wide column">
                <table className="ui celled table">
                    <thead>
                        <th>Language</th>
                        <th>Level</th>
                        <th>
                            <div className="ui right floated labeled button" tabIndex="0">
                                <button type="button" className="ui teal button" onClick={this.handleAddnewClick}>
                            <i className="plus icon"></i>Add New
                            </button>
                            </div>
                        </th>
                    </thead>
                    <tbody>
                        {tableLanguage}
                    </tbody>
                </table>
            </div>
            <div></div>
            <div></div>
        </div>)
    }
}
