///* Experience section */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import Cookies from 'js-cookie';
import moment from 'moment';

export default class Experience extends React.Component {
    constructor(props) {
        super(props);
        const experience = props.experienceData ? this.props.experienceData : []
        const visaExpiryDate = this.props.visaExpiryDate ? moment(this.props.visaExpiryDate) : moment();
            
        this.state = ({
            showAddSection: false,
            showEditSection: false,
            updateId: "",
            addedExperience: experience,
            amyExperience: {
                company: "",
                position: "",
                responsibilities: "",
                start: moment(),
                end: moment()
            },
            myExperience: {
                company: "",
                position: "",
                responsibilities: "",
                start: moment(),
                end: moment()
            }
        })
        this.handleChange = this.handleChange.bind(this);
        this.handleAddnewClick = this.handleAddnewClick.bind(this);
        this.handleAddCancel = this.handleAddCancel.bind(this);
        this.handleAddNewExperience = this.handleAddNewExperience.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleEditCancel = this.handleEditCancel.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleAddDataChange = this.handleAddDataChange.bind(this);

    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            addedExperience: nextProps.experienceData
        })
        console.log("exp++++", this.state.addedExperience)
    }
    handleStartDateChange(event) {
        const data = Object.assign({}, this.state.amyExperience)
        data[event.target.name] = event.target.value
        this.setState({ amyExperience: data })
    }

    handleEndDateChange(event) {
        const data = Object.assign({}, this.state.amyExperience)
        data[event.target.name] = event.target.value
        this.setState({ amyExperience: data })
    }
    handleAddDataChange(event) {
        const data = Object.assign({}, this.state.amyExperience)
        data[event.target.name] = event.target.value
        this.setState({
            amyExperience: data
        })

    }

    handleChange() {
        const data = Object.assign({}, this.state.myExperience)
        data[event.target.name] = event.target.value
        this.setState({
            myExperience: data
        })

    }
    handleAddnewClick() {
        //const experience = this.props.experienceData
        this.setState({
            showAddSection: true,
            amyExperience: {
                company: "",
                position: "",
                responsibilities: "",
                start: moment(),
                end: moment()
            }
        })
    }

    handleAddCancel() {
        this.setState({
            showAddSection: false
        })
    }

    handleEdit(expdata) {
        console.log("exp++++", expdata)
        this.setState({
            showEditSection: true,
            myExperience: expdata,
            updateId: expdata.id
        })
    }

    handleAddNewExperience() {
        if (this.state.amyExperience.position == "" || this.state.amyExperience.company == "" ||
            this.state.amyExperience.start == "" || this.state.amyExperience.end == "" ||
            this.state.amyExperience.responsibilities == "") {
            TalentUtil.notification.show("Please fill out all required fields", "error", null, null)
        }
        else {
            var exp = this.state.amyExperience;
            //console.log("experience ++++" + JSON.stringify(exp));
            const data = this.state.addedExperience;
            data.push(exp);
            this.setState({
                showAddSection: false,
                addedExperience: data
            })
            this.props.updateProfileData(this.props.componentId, data)
        }
    }
    handleEditCancel() {
        this.setState({
            showEditSection: false
        })
    }
    handleUpdate(data) {
        let temp = this.props.experienceData
        //console.log("temp", item)
        const index = temp.findIndex(x => x.id == data.id)
        console.log("index here" + index)
        temp[index].company = this.state.myExperience.company
        temp[index].position = this.state.myExperience.position
        temp[index].responsibilities = this.state.myExperience.responsibilities
        temp[index].start = this.state.myExperience.start
        temp[index].end = this.state.myExperience.end
        console.log("Update: ", temp)
        this.props.updateProfileData(this.props.componentId, temp)
        this.handleEditCancel();
}

    handleDelete(item) {
        let temp = this.props.experienceData
        console.log("temp", item)
        const index = temp.findIndex(x => x.id == item.id)
        console.log("delete index", index)
        temp.splice(index, 1)
        console.log("delete", temp)
        this.props.updateProfileData(temp)

    }
    renderAddExperience() {
        console.log("exp edit", moment(this.state.amyExperience.start).format('YYYY-MM-DD'))
        return (
            <div className="ui two column grid">
                    <div className="ui eight wide column">
                        <h5>Company</h5>
                    <ChildSingleInput
                        inputType="Text"
                        maxLength={50}
                        name="company"
                        errorMessage="Please enter name of a company"
                        controlFunc={this.handleAddDataChange}
                        value={this.state.amyExperience.company}
                    >
                    </ChildSingleInput>
                    </div>
                <div className="ui eight wide column">
                        <h5>Position</h5>
                    <ChildSingleInput
                        inputType="Text"
                        maxLength={50}
                        name="position"
                        errorMessage="Please enter your position"
                        controlFunc={this.handleAddDataChange}
                        value={this.state.amyExperience.position}
                    >
                    </ChildSingleInput>
                </div>
                <div className="ui eight wide column">
                        <h5>StartDate</h5>

                    <input type="date"
                        name="start"
                        errorMessage="Please enter start date"
                        onChange={this.handleStartDateChange}
                        value={this.state.amyExperience.start}
                        placeholder="yyyy/mm/dd"
                    >
                    </input>
                    </div>
                <div className="ui eight wide column">
                        <h5>EndDate</h5>
                    <input type="date"
                        name="end"
                        errorMessage="Please enter end date"
                        onChange={this.handleEndDateChange}
                        value={this.state.amyExperience.end}
                        placeholder="yyyy/mm/dd"
                    >
                    </input>
                </div>
                <div className="ui sixteen wide column">
                        <h5>Responsibilities</h5>
                    <ChildSingleInput
                        inputType="Text"
                        maxLength={100}
                        name="responsibilities"
                        errorMessage="Please enter your responsibilities"
                        controlFunc={this.handleAddDataChange}
                        value={this.state.amyExperience.responsibilities}
                    >
                    </ChildSingleInput>
                    </div>
                <div></div>
                <div className="ui sixteen wide column">
                    <button type="button" onClick={this.handleAddNewExperience} className="ui blue basic button">Add</button>
                    <button type="button" className="ui pink basic button" onClick={this.handleAddCancel}>Cancel</button>
                    </div>
                <div></div>
                </div>
            )
    }

    render() {
        console.log("check exp ", this.props.experienceData)
        const upExp = this.props.experienceData;
        let tableExperience = null;
        if (upExp != null) {
            tableExperience =
                upExp.map(exp => <tr key={exp.id}>
                    {this.state.showEditSection && exp.id == this.state.updateId ?
                    <React.Fragment>
                            <td colSpan="6">
                                <div className="ui two column grid">
                                    <div className="ui eight wide column">
                                        <h5>Company</h5>
                                        <ChildSingleInput
                                            inputType="Text"
                                            maxLength={50}
                                            name="company"
                                            errorMessage="Please enter name of a company"
                                            controlFunc={this.handleChange}
                                            value={this.state.myExperience.company}
                                        >
                                        </ChildSingleInput>
                                    </div>

                                    <div className="ui eight wide column">
                                        <h5>Position</h5>
                                        <ChildSingleInput
                                            inputType="Text"
                                            maxLength={50}
                                            name="position"
                                            errorMessage="Please enter your position"
                                            controlFunc={this.handleChange}
                                            value={this.state.myExperience.position}
                                        >
                                        </ChildSingleInput>
                                    </div>

                                    <div className="ui eight wide column">
                                        <h5>StartDate</h5>
                                        <input type="date"
                                            name="start"
                                            errorMessage="Please enter start date"
                                            onChange={this.handleChange}
                                            value={moment(this.state.myExperience.start).format('YYYY-MM-DD')}
                                            placeholder="yyyy/mm/dd"
                                        >
                                        </input>
                                    </div>

                                    <div className="ui eight wide column">
                                        <h5>EndDate</h5>
                                        <input type="date"
                                            name="end"
                                            errorMessage="Please enter end date"
                                            onChange={this.handleChange}
                                            value={moment(this.state.myExperience.end).format('YYYY-MM-DD')}
                                            placeholder="yyyy/mm/dd"
                                        />
                                    </div>

                                    <div className="ui sixteen wide column">
                                        <h5>Responsibilities</h5>
                                        <ChildSingleInput
                                            inputType="Text"
                                            maxLength={100}
                                            name="responsibilities"
                                            errorMessage="Please enter your responsibilities"
                                            controlFunc={this.handleChange}
                                            value={this.state.myExperience.responsibilities}
                                        >
                                        </ChildSingleInput>
                                    </div>

                                    <div></div>

                                    <div className="ui sixteen wide column">
                                        <button type="button" className="ui blue basic button" onClick={this.handleUpdate.bind(this, this.state.myExperience)}>Update</button>
                                        <button type="button" className="ui pink basic button" onClick={this.handleEditCancel}>Cancel</button>
                                    </div>
                                    <div></div>
                                </div>
                            </td>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <td>{exp.company}</td>
                        <td>{exp.position}</td>
                        <td>{exp.responsibilities}</td>
                        <td>{moment(exp.start).format('Do MMM, YYYY')}</td>
                        <td>{moment(exp.end).format('Do MMM, YYYY')}</td>
                        <td>
                            <div className="ui right floated labeled button" onClick={this.handleEdit.bind(this, exp)} tabIndex="0">
                                <i className="write icon"></i>
                            </div>
                            <div className="ui right floated labeled button" onClick={this.handleDelete.bind(this, exp)} tabIndex="0">
                                <i className="delete icon"></i>
                            </div>
                        </td>
                        </React.Fragment>
                        }
                    </tr>)
                
        }

        return (
            <div className='ui one column grid'>
                {this.state.showAddSection ? this.renderAddExperience() : ""}
                <div className="ui sixteen wide column">
                    <table className="ui celled table">
                        <thead>
                            <th>Company</th>
                            <th>Position</th>
                            <th>Responsibilities</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>
                                <div className="ui right floated labeled button" tabIndex="0">
                                    <button type="button" className="ui teal button" onClick={this.handleAddnewClick}>
                                        <i className="plus icon"></i>Add New
                                    </button>
                                </div>
                            </th>
                            </thead>
                            <tbody>
                                {tableExperience}
                            </tbody>
                    </table>
                </div>
                <div></div>
            </div>
            )
    }
}
