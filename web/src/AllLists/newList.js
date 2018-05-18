import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const userFound = {
  'height': '60px',
'overflow': 'auto'
};

class newList extends Component {
  constructor(props) {
    super(props);
    this.state = {itemName:"", user:"", found:[], sharingWith:[], category:"To-Do List"};
    this.addnewtask = this.addnewtask.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.getUsers=this.getUsers.bind(this);
  }

  handleClose(e){
   this.props.history.push("/");
 }

  addnewtask(){
    console.log(this.state);
    console.log(this.props.getAuthorizationHeader());
    let myRequest = new Request('/api/db/addNewList', {
      method: 'POST',
      body: "userid="+ this.props.profile.sub+"&listname="+this.state.itemName+"&sharedWith="+JSON.stringify(this.state.sharingWith)+"&category="+this.state.category,
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
      console.log("kjhkjjhkj POP");
      console.log(json);
       this.props.history.push("/home/list/"+json.insertedIds[0]);
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
  console.log(value);
  this.setState({
    [name]: value
  });
}

shareChk(email,username, event){
  var target = event.target;
  var value = target.checked;
  var name = target.name;
  // var username = target.userName;
  // var email = target.email;
  console.log(name+ ' '+ email + ' '+ username+ ' ' +value);

  if(!!value){
    this.setState({
      sharingWith: [...this.state.sharingWith, {'_id':name, 'name':username, 'email':email}]
    });
  }else{
    var t = this.state.found;
    for(var i in t){
      if(t[i]._id == name){
        break;
      }
    }
    t[i].checked = false;
    this.setState({
      found: t
    });
    var s = this.state.sharingWith;
    for(var i in s){
      if(name == s[i]._id)
      break;
    }
    s.splice(i, 1);
    this.setState({
      sharingWith: s
    })
  }
}

getUsers(event){
  console.log("get users called");
  const target = event.target;
  const value = target.value;

  this.setState({
    user: value
  });

  if(!!value.trim() || value.trim().length==0){
    this.setState({
      found: []
    })
  }

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

  for(var i in this.state.sharingWith){
    for(var j in this.state.found){
      if(this.state.sharingWith[i]._id == this.state.found[j]._id){
        this.state.found[j].checked = true;
      }
    }
  }

  for(var j in this.state.found){
    console.log("Created By: "+this.props.profile.sub);
    if(this.props.profile.sub == this.state.found[j]._id){
      this.state.found.splice(j, 1);
    }
  }
  var u = this.state.found.map((user) =>
  <div>
  <span><input type="checkbox" name={user._id} email={user.email} userName={user.name} checked={user.checked == true || user.checked == "true"} onChange={(e) => this.shareChk(user.email, user.name,  e)}/>{user.name} ({user.email})</span>
  </div>
);

var shared = this.state.sharingWith.map((user)=>
<span> {user.name} ( {user.email} ),</span>
);
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

			  <div>

        <div class="field">
        <label class="label">Category</label>
        <div class="control">
          <div class="select">
            <select id="select-category" value={this.state.category}
     			 onChange={this.handleInputChange} name="category">
              <option value="Grocery">Grocery</option>
              <option value="To-Do List">To-Do List</option>
              <option value="Household Essentials">Household Essentials</option>
              <option value="Party">Party</option>
            </select>
          </div>
        </div>
      </div>
		</div>


             <div className="field">
                <label className="label">Share with</label>

                {shared}

                <div className="control">
                   <input
                  className="input"
                  name="selectuser"
                  value={this.state.user}
                  onChange={this.getUsers}
                  placeholder="Share with" />
                </div>
             </div>
             <div style={userFound}>
             {u}
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

export default newList;
