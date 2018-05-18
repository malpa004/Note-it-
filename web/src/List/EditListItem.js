import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class EditListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {itemName:""};
    this.handleInputChange = this.handleInputChange.bind(this);
	this.edittask = this.edittask.bind(this);
  }
	
edittask(){
    console.log(this.props.match.params.id);
	const {goBack} = this.props.history;
	  var taskId = this.props.match.params.id;
      var userId = this.props.profile.sub;
	  var taskName = this.state.itemName;
     let myRequest = new Request('/api/db/editTask', {
      method: 'POST',
      body: "userid="+ userId+"&taskid="+taskId+"&taskname="+taskName  ,
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


handleInputChange(event) {
  console.log("handle event called");
  const target = event.target;
  const value = target.value;
  const name = target.name;
  console.log(name);
  this.setState({
    [name]: value
  });
}

render() {
	const {goBack} = this.props.history;
	console.log(this.state);
  return (
    <div className="modal is-active">
       <div className="modal-background"></div>
       <div className="modal-card">
          <header className="modal-card-head">
             <p className="modal-card-title">Edit List Item</p>
             <button className="delete" aria-label="close" onClick={() => goBack()}></button>
          </header>
          <section className="modal-card-body">
             <div className="field">
                <label className="label">Name</label>
                <div className="control">
                   <input
                   className="input"
                  name="itemName"
                  value={this.state.itemName}
                  onChange={this.handleInputChange}
                  placeholder="Text input" />
                </div>
             </div>
          </section>
          <footer className="modal-card-foot">
             <button className="button is-success" onClick={this.edittask}>Save changes</button>
             <button className="button" onClick={() => goBack()}>Cancel</button>
          </footer>
       </div>
    </div>
  );
}
}

export default EditListItem;
