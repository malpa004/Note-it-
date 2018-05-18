import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class DeleteListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {itemName:""};
	this.deletetask = this.deletetask.bind(this);
  }
	
deletetask(){
	const {goBack} = this.props.history;
	var taskId = this.props.match.params.id;
    var userId = this.props.profile.sub;
    let myRequest = new Request('/api/db/deleteTask', {
      method: 'POST',
      body: "userid="+ userId+"&taskid="+taskId  ,
      // this header sends the user token from auth0
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}

    });

    fetch(myRequest)
    .then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then(res => res.json())
    .then(json => {
      console.log(json);
      this.setState({
        list: json.lists,
		 itemName:json.lists.tasks[0].name
      })
    })
    .catch(function (error) {
      console.error(error);
    });
	goBack();
  }	

  componentDidMount() {
	  console.log(this.props.match.params.id);
	  var taskId = this.props.match.params.id;
      var userId = this.props.profile.sub;
     let myRequest = new Request('/api/db/getTask', {
      method: 'POST',
      body: "userid="+ userId+"&taskid="+taskId  ,
      // this header sends the user token from auth0
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}

    });

    fetch(myRequest)
    .then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then(res => res.json())
    .then(json => {
      console.log(json);
      this.setState({
        list: json.lists,
		 itemName:json.lists.tasks[0].name
      })
    })
    .catch(function (error) {
      console.error(error);
    });
  }

render() {
	console.log(this.state);
	const {goBack} = this.props.history;
  return (
    <div className="modal is-active">
       <div className="modal-background"></div>
       <div className="modal-card">
          <header className="modal-card-head">
             <p className="modal-card-title">Delete List Item</p>
             <button className="delete" aria-label="close" onClick={() => goBack()}></button>
          </header>
          <section className="modal-card-body">
             <div className="field">
                <label className="label">Are you sure you want to delete this item?</label>
             </div>
			  <p>{this.state.itemName}</p>
          </section>
          <footer className="modal-card-foot">
             <button className="button is-danger" onClick={this.deletetask}>Yes</button>
             <button className="button" onClick={() => goBack()}>No</button>
          </footer>
       </div>
    </div>
  );
}
}

export default DeleteListItem;
