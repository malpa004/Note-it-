import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './listPage.css'


class Card extends Component {
	constructor(props) {
		super(props);
		this.state = { data: {} }
		//this.handleOpenListEvent = this.handleOpenListEvent.bind(this);
	}

	// handleOpenListEvent(){
	// 	ReactDOM.render((
	//
	// 	), document.getElementById('root'));
	//
	// }

	componentWillReceiveProps(newProps){
		this.setState({data : newProps.list});
	}

	render() {

		var data = this.state.data;
		var isData = Object.keys(data).length === 0 && data.constructor === Object;
		if(!isData){

			const listItems = data.map((list) =>

			<nav className="list-box ">
			<span className={list.category=="Grocery" ? "fa asas fa-shopping-cart": list.category=="Household Essentials" ? "fa asas fa-home": list.category=="Party" ? "fa asas fa-map-pin": "fa asas fa-list"} aria-hidden="true"><Link to={"/home/list/"+list._id} className="listlink">{list.list_name}</Link></span>
<hr></hr>
			</nav>

		);
		return (
			<div className="column">
			{listItems}
			</div>
		);
	}else{
		return null;
	}
}
}

export default Card;
