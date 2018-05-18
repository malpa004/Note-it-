import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Test extends Component {

  constructor(props) {
    super(props);
    this.state={
      InsertTask: ""
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  sendData(){
    console.log("button clicked: " +this.state.InsertTask);
    console.log(this.props.getAuthorizationHeader());
    let myRequest = new Request('/api/db/addNewList', {
      method: 'POST',
      body: "userid="+ this.props.profile.sub+"&listname="+this.state.InsertTask  ,
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

  handleInputChange(event) {
    event.preventDefault();
    console.log("handle event called");
    const target = event.target;
    const value = target.value;
    const name = target.name;
    console.log(name);
    this.setState({
      [name]: value
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
    }).then(res => res.json())
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

  render() {
    return (
      <div>
      <h1>Test</h1>
      <InsertTask {...this.state} handleInput={this.handleInputChange} sendData={this.sendData}/>
      </div>
    );
  }
}

class InsertTask extends Component{
  constructor(props){
    super(props);
    this.state = {
      user: "",
      found: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
    this.getUsers = this.getUsers.bind(this);
  }

  sendData(){
    this.props.sendData();
  }
  handleChange(e){
    this.props.handleInput(e);
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

  render(){
    if(!!this.state.found){
      var u = this.state.found.map((user) =>
      <div>
        <div>{user.name} ({user.email})</div>
      </div>
    );
    }

    if(!!this.props.lists){
      console.log("Lisstsskdajskfhkj");
      var l = this.props.lists.map((list) =>
      // <h1>JSON.stringify(list)</h1>
      <Link to={"/list/"+list._id}><div>{list.list_name}</div></Link>
    );
    }

    return(
      <div>
      <pre>{JSON.stringify(this.props)}</pre>
      <pre>{JSON.stringify(this.state)}</pre>
      <input type = "text" name = "InsertTask" value={this.props.text} onChange={this.handleChange}/>
      <button className='button' onClick={this.sendData}>Send task</button>
      <input type="text" name="selectuser" value={this.state.user} onChange={this.getUsers}/>
      <div>{u}</div>
      <div>{l}</div>
      </div>
    )
  }
}

export default Test;
