import React, { Component } from 'react';
import Checkbox from './Checkbox';
import AddTask from './addtask';
import ItemComponent from './itemComponent';
import { Link } from 'react-router-dom';
import './listitem.css';

const font={
    'font-family': "Times New Roman"
}


class List extends Component {

  componentWillMount(){
    this.getFromDb(this.props);
  }

  componentWillReceiveProps(newProps){
    this.getFromDb(newProps);
  }

  getFromDb(props){
    // var listId = this.props.location.pathname.split('/list/')[1
    console.log("did mount called");
    var listId = props.match.params.id;
    // console.log();
    var userId = props.profile.sub;

    let myRequest = new Request('/api/db/getList', {
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
    }).then(res => res.json())
    .then(json => {
      console.log(json);


      let myRequest = new Request('/api/db/getuser', {
        method: 'POST',
        body: "userid="+ JSON.stringify(json.lists.sharedWith) ,
        // this header sends the user token from auth0
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}

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
          sharingWith: json.user
        });
      })
      .catch(function (error) {
        console.error(error);
      });

      this.setState({
        list: json.lists
        //   sharingWith: json.lists.sharedWith
      });
    })
    .catch(function (error) {
      console.error(error);
    });
  }

  constructor(props){
    super(props);
    this.state={
      toAdd:"",
      hiddenwal: false
    }
    this.addtemptask = this.addtemptask.bind(this);
    this.addtask = this.addtask.bind(this);
    this.checkboxChange = this.checkboxChange.bind(this);



    		this.hidewal=this.hidewal.bind(this);
  }

  hidewal(){
    this.setState({
      hiddenwal: !this.state.hiddenwal
    });

  }

  checkboxChange(event){
    var target = event.target;
    var name = target.name;
    var checked = target.checked;
	console.log(target)

    const list = this.state.list;

    for(var i in list.tasks){
      if(list.tasks[i]._id == name)
      break;
    }
    list.tasks[i].checked = ""+checked;
    this.setState({
      list: list
    });

    let myRequest = new Request('/api/db/changeCompleted', {
      method: 'POST',
      body: "itemid="+ name+"&listid="+this.props.match.params.id+"&checked="+checked  ,
      // this header sends the user token from auth0
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}

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

    console.log("handle change called: " + name+" "+checked);
  }

   starChange(isStar, name, event){
		console.log("Hello!!!");
	   var target = event.target;
//    var isStar = target.isStar;
	console.log(isStar);
	console.log(name);

    const list = this.state.list;

    for(var i in list.tasks){
      if(list.tasks[i]._id == name)
      break;
    }
    list.tasks[i].isStar = isStar;
    this.setState({
      list: list
    });

    let myRequest = new Request('/api/db/changeStar', {
      method: 'POST',
      body: "itemid="+ name+"&listid="+this.props.match.params.id+"&isStar="+isStar  ,
      // this header sends the user token from auth0
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}

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

    console.log("handle change called: " + name);
	}

  addtemptask(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      toAdd: value
    })
  }

  addtask(){
    if(!!this.state.toAdd.trim()){
      this.setState({
        toAdd: ""
      })
      let myRequest = new Request('/api/db/addNewTask', {
        method: 'POST',
        body: "data="+ this.state.toAdd.trim()+"&listid="+this.props.match.params.id+"&userid="+this.props.profile.sub,
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
        const list = this.state.list;
        list.tasks.push(json);
        this.setState({
          list: list
        })
      })
      .catch(function (error) {
        console.error(error);
      });
    }
  }







    render() {


//for(var i=0; i<this.state.list)
      if(!!this.state.list){
        var name = this.state.list.list_name;
        console.log("ADding a new task");
        console.log(this.state);
        if(!!this.state.list){
        //   var a = this.state.list.tasks.map((item) =>
        //   if(!!item.checked)
        //     return <ItemComponent item={item} checkboxChange={this.checkboxChange} />
        // );

        var incomplete = this.state.list.tasks.reverse().map(function(item, i) {

        if(item.checked == "false" || item.checked == false){

            return <ItemComponent item={item} cat={this.state.list.category} hiddenwal={this.state.hiddenwal} checkboxChange={this.checkboxChange} />;

        }
        else {
            return;
        }

    }.bind(this));

    var totalCount = 0;
    var compConunt = 0;
    for(var i in this.state.list.tasks){
      if(this.state.list.tasks[i].checked == "true"){
        compConunt++;
      }
      totalCount++;
    }

    if(compConunt/totalCount < 0.5){
      var pClass = "is-danger";
    }else if(compConunt/totalCount < 0.75){
      var pClass = "is-warning";
    }else{
      var pClass = "is-success";
    }


    var completedTrue = false;
    var completed = this.state.list.tasks.reverse().map(function(item, i) {
      console.log("kjhkjhk " + item.checked);
    if(item.checked == "true" || item.checked == true){
      completedTrue = true;
      console.log("category: " + this.state.list.category);

        return <ItemComponent item={item} cat={this.state.list.category} hiddenwal={this.state.hiddenwal} checkboxChange={this.checkboxChange} />;

    }
    else {
        return null;
    }

}.bind(this));
      }
    }


if(!!completed)
console.log("completed: " + completed.length);
var completedTasks = completedTrue ?
(<div><h2 className="subtitle">Completed Tasks</h2> <div>{completed}</div></div>) : null;

return (
  <div>

  <div className="columns level">
    <div className="column is-10 level-left">
      <p className="listtitle title">{name}</p>

    </div>

    <div className="level-right">
    <Link to={'/editList/'+this.props.match.params.id} aria-hidden="true" className="editbutton level-item"><span className="editiconn icon">
     		<i className="ei fa fa-pencil fa-2x"></i>
    	</span></Link>
    <Link to={'/deleteList/'+this.props.match.params.id} aria-hidden="true" className="deletebutton level-item"><span className="deleteiconn icon">
     		<i className="di fa fa-trash fa-2x"></i>
    	</span></Link>
    </div>
  </div>

  <progress className={"progress " + pClass} value={compConunt} max={totalCount}>30%</progress>
  <AddTask {...this.state} addtemptask={this.addtemptask} addtask={this.addtask}/>
  <button onClick={this.hidewal}>Hide Walmart stuff</button>
  {incomplete}
{completedTasks}


  </div>
);
}
}

export default List;
