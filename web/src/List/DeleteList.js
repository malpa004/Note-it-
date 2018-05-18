import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class DeleteList extends Component {
  constructor(props) {
    super(props);
    this.state = {itemName:""};
	this.deletetask = this.deletetask.bind(this);
  }

deletetask(){
	  var listId = this.props.match.params.id;
      var userId = this.props.profile.sub;
     let myRequest = new Request('/api/db/deleteList', {
      method: 'POST',
      body: "userid="+ userId+"&listid="+listId  ,
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
      this.props.history.push("/home/");
    })
    .catch(function (error) {
      console.error(error);
    });
  }

  componentDidMount() {
	  console.log(this.props.match.params.id);
	  var listid = this.props.match.params.id;
      var userId = this.props.profile.sub;
     let myRequest = new Request('/api/db/exitList', {
      method: 'POST',
      body: "userid="+ userId+"&listid="+listid  ,
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
		 itemName:json.lists.list_name
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
             <p className="modal-card-title">Delete List</p>
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

export default DeleteList;
