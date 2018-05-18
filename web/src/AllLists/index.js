import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Card from './ListCard';
import './listPage.css'

class AllLists extends Component {

	constructor(props) {
		super(props);
		this.state = {listOfLists:[], toDoList:{}};
	}



	componentDidMount() {
        console.log(this.state);
		let myRequest = new Request('/api/db/getAllLists', {
			method: 'POST',
			body: "userid="+this.props.profile.sub,
			// this header sends the user token from auth0
			headers: {'Authorization':this.props.getAuthorizationHeader(),
			'Content-Type': 'application/x-www-form-urlencoded'}

		});

		fetch(myRequest)
		.then(function(response) {
		if (!response.ok) {
				throw Error(response.statusText);
		}
		return response;
		}).then(res => res.json())
		.then(json => {
			console.log(json);
			console.log("called");
			this.setState({
				listOfLists: json.lists
			})
			this.props.history.push("/home/list/"+json.lists[0]._id);
		})
		.catch(function (error) {
			console.error(error);
		});


	}

	render() {
		return (
			<div>
			<div className="listPage box">
			<div className="sub-title all-list-top">

			<Link to='/newList' >
			<span className="fa fa-plus addButton" aria-hidden="true"></span>&nbsp;
			<span>Create new List</span></Link>
			</div>
			<div><Card list={this.state.listOfLists} /></div>
			</div>
			</div>
		);
	}
}

export default AllLists;
