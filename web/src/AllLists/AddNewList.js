import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class AddNewList extends Component {
  constructor(props) {
    super(props);
    this.state = {itemName:"", user:"", found:[], sharingWith:[]};
    this.addnewtask = this.addnewtask.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }



  addnewtask(){
    console.log(this.state);
    console.log(this.props.getAuthorizationHeader());
    let myRequest = new Request('/api/db/addNewList', {
      method: 'POST',
      body: "userid="+ this.props.profile.sub+"&listname="+this.state.itemName+"&sharedWith="+this.state.shareWith,
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

    })
    .catch(function (error) {
      console.error(error);
    });
  }

  componentDidMount() {
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
    })
    .then(res => res.json())
    .then(json => {
      console.log(json);
      this.setState({
        lists: json.lists
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

getUsers(event){
  console.log("get users called");
  const target = event.target;
  const value = target.value;

  this.setState({
    user: value
  });

  let myRequest = new Request('/api/db/findusers', {
    method: 'POST',
    body: "text="+ value  ,
    // this header sends the user token from auth0
    headers: {
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
      this.setState({
        found: json.users
      })
    })
    .catch(function (error) {
      console.error(error);
    });
  }

render() {
  const {goBack} = this.props.history;
  return (
    <div className="modal is-active">
       <div className="modal-background"></div>
       <div className="modal-card">

          <header className="modal-card-head">
             <p className="modal-card-title">New list</p>
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
<pre>{JSON.stringify(this.state)}</pre>
             <div className="field">
                <label className="label">Share with</label>
                <div className="control">
                <input type="text" name="selectuser" value={this.state.user} onChange={this.getUsers} placeholder="Share with"/>

                </div>
             </div>
          </section>
          <footer className="modal-card-foot">
             <button className="button is-success" onClick={this.addnewtask}>Save changes</button>
             <button className="button" onClick={() => goBack()}>Cancel</button>
          </footer>
       </div>
    </div>
  );
}
}

export default AddNewList;
