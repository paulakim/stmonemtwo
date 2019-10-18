///* Skill section */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import Cookies from 'js-cookie';

export default class Skill extends React.Component {
    constructor(props) {
        super(props);
        const skill = this.props.skillData ?
            Object.assign([], this.props.skillData)
            : []
        this.state = ({
            showAddSection: false,
            showEditSection: false,
            updateId: "",
            addedSkill: skill,
            newSkill: {
                name: '',
                level:''
            },
            anewSkill: {
                name: '',
                level: ''
            }
        })
        this.loadData = this.loadData.bind(this);
        this.handleAddnewClick = this.handleAddnewClick.bind(this);
        this.handleAddCancle = this.handleAddCancle.bind(this);
        this.handleChageName = this.handleChageName.bind(this);
        this.handleChageDropdown = this.handleChageDropdown.bind(this)
        this.handleAddSave = this.handleAddSave.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleEditCancel = this.handleEditCancel.bind(this);
        this.updateEdit = this.updateEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handledrChange = this.handledrChange.bind(this);
        this.updateWithoutSave = this.updateWithoutSave.bind(this);
    };

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
           // url: 'http://localhost:60290/profile/profile/getSkill',
            url: 'https://talentservicesprofilepaula.azurewebsites.net/profile/profile/getSkill',
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
        let newLang = Object.assign([], this.state.addedSkill, newValues)
        this.setState({
            addedSkill: newLang
        })
        console.log(this.state.addedSkill)
    }
    componentDidMount() {
        this.loadData();
    };
    handleChageName(event) {
        const data = Object.assign({}, this.state.newSkill)
        data[event.target.name] = event.target.value
        this.setState({
            newSkill: data
        })
    }
    handleChageDropdown(event) {
        const data = Object.assign({}, this.state.newSkill)
        data[event.target.name] = event.target.value
        this.setState({ newSkill: data })
    }
    handleAddnewClick() {
        this.setState({
            showAddSection: true
        })
    }

    handleAddCancle() {
        this.setState({
            showAddSection: false
        })
    }
    handleAddSave() {
        const addednewSkill = this.state.anewSkill;
        let isNull = addednewSkill.level == 0 || addednewSkill.name.length == 0;
        if (isNull) {
            TalentUtil.notification.show("Please enter Level and Name of Skill", "error", null, null)
        }
        else {
            var cookies = Cookies.get('talentAuthToken');
            $.ajax({
                //url: 'http://localhost:60290/profile/profile/addSkill',
                url: 'https://talentservicesprofilepaula.azurewebsites.net/profile/profile/addSkill',
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                type: "POST",
                data: JSON.stringify(this.state.anewSkill),
                success: function (res) {
                    console.log(res)
                    if (res.success == true) {
                        TalentUtil.notification.show("Language added sucessfully", "success", null, null)
                        this.loadData();
                        this.handleAddCancle();
                        //window.location = "/TalentProfile";
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
    handleEdit(sk) {
        this.setState({
            showEditSection: true,
            newSkill: sk,
            updateId: sk.id
        })
    }

    handleEditCancel() {
        this.setState({
            showEditSection: false
        })
    }
    updateEdit(data) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
           // url: 'http://localhost:60290/profile/profile/updateSkill',
            url: 'https://talentservicesprofilepaula.azurewebsites.net/profile/profile/updateSkill',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(data),
            success: function (res) {
                console.log(res)
                if (res.success == true) {
                    TalentUtil.notification.show("Skill is sucessfully updated", "success", null, null)
                    this.setState({
                        addedSkill: res.data
                    });
                    this.loadData();
                    this.handleEditCancel();
                    //window.location = "/TalentProfile";
                } else {
                    TalentUtil.notification.show("Skill is not updated", "error", null, null)
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
        //const data = this.state.languages.find(x => x.id == id);
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            //url: 'http://localhost:60290/profile/profile/deleteSkill',
            url: 'https://talentservicesprofilepaula.azurewebsites.net/profile/profile/deleteSkill',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(data),
            success: function (res) {
                console.log(res)
                if (res.success == true) {
                    TalentUtil.notification.show("Skill is sucessfully deleted", "success", null, null)
                    this.setState({
                        addedSkill: res.data
                    });
                    this.loadData();
                    //window.location = "/TalentProfile";
                    //this.handleEditCancel();
                } else {
                    TalentUtil.notification.show("Skill is not updated", "error", null, null)
                }

            }.bind(this),
            error: function (res, a, b) {
                console.log(res)
                console.log(a)
                console.log(b)
            }
        })
    }
    handleChange(event) {
        const data = Object.assign({}, this.state.anewSkill)
        data[event.target.name] = event.target.value
        this.setState({
            anewSkill: data
        })

    }
    handledrChange(event) {
        const data = Object.assign({}, this.state.anewSkill)
        data[event.target.name] = event.target.value
        this.setState({
            anewSkill: data
        })

    }
    renderAddSkill() {
        const { anewSkill } = this.state;
        console.log("add name: ", anewSkill)
        return (
            <div className="ui row">
                <div className="ui five wide column">
                    <ChildSingleInput
                        inputType="Text"
                        maxLength={50}
                        placeholder="Add Skill"
                        controlFunc={this.handleChange}
                        value={this.state.anewSkill.name}
                        name="name"
                        errorMessage="Please enter a language"
                    >
                    </ChildSingleInput>
                </div>
                <div className="ui five wide column">
                    <select
                        placeholder="Skill Level"
                        value={this.state.anewSkill.level}
                        onChange={this.handleChange}
                        name="level"
                    >
                        <option value="">Skill Level</option>
                        <option key="Beginner" value="Beginner">Beginner</option>
                        <option key="Intermediate" value="Intermediate">Intermediate</option>
                        <option key="Expert" value="Expert">Expert</option>
                    </select>
                </div>
                <div className="ui six wide column">
                    <button type="button" className="ui teal button" onClick={this.handleAddSave}>Add</button>
                    <button type="button" className="ui button" onClick={this.handleAddCancle}>Cancel</button>
                </div>
            </div>
        )
    }
  
    
    render() {
        const upSkill = this.state.addedSkill;
        //const upid = this.state.updateId;
        let tableSkill = null;
        if(upSkill != null) {
            tableSkill =
                upSkill.map(x => <tr key={x.id} reloadData={this.loadData}>
                {this.state.showEditSection && x.id == this.state.updateId ?
                    <React.Fragment>
                        <td>
                            <div className="ui four wide column">
                                <ChildSingleInput
                                    inputType="Text"
                                    maxLength={50}
                                    name="name"
                                    errorMessage="Please enter a skill"
                                    controlFunc={this.handleChageName}
                                    value={this.state.newSkill.name}
                                >
                                </ChildSingleInput>
                            </div>
                        </td>
                        <td>
                            <div className="ui four wide column">
                                <select
                                    placeholder="Skill Level"
                                    value={this.state.newSkill.level}
                                    onChange={this.handleChageDropdown}
                                    name="level"
                                >
                                    <option vale="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                        </td>
                        <td>
                            <div className="six wide column">
                                <button type="button" className="ui blue basic button" onClick={this.updateEdit.bind(this, this.state.newSkill)} > Update</button>
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
                }</tr>)
        
        }
        return (
            <div className='ui three column grid'>
                {this.state.showAddSection ? this.renderAddSkill() : ""}

                <div className="ui sixteen wide column">
                    <table className="ui celled table">
                        <thead>
                            <th>Skill</th>
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
                            {tableSkill}
                        </tbody>
                    </table>
                </div>
                <div></div>
                <div></div>
            </div>
           )
    }
}
