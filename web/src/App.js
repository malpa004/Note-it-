import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import { Link, Redirect } from 'react-router-dom';

import { withAuth } from './Auth';
import Header from './Header';
import AllLists from './AllLists';
import List from './List'
import Test from './Test'
import NewList from './AllLists/newList';
import EditListItem from './List/EditListItem';
import EditListDetails from'./List/EditListDetails';
import DeleteListItem from './List/DeleteListItem'
import DeleteList from './List/DeleteList'
import LoginBackground from './background.png';
import HomeBackground from './home.jpg';
import LoginLogout from './Header/LoginLogout';


const marginTop={
  'margin-top':"10px",
  'background-color':"whitesmoke",
  'height':"-webkit-fill-available"
}

const posFix={
  'position':'fixed',
  'height' : '500px',
  'overflow-y' : 'auto',
  'margin-top':'10px'
}

const loginPage ={
  'backgroundImage': `url(${LoginBackground})`,
  'backgroundSize': "cover",
  'height':" -webkit-fill-available",
};

const homePage ={
  'background-color':"whitesmoke"
};


class App extends Component {
  constructor(props){
    super(props);
    this.isAuthenticated = this.props.isAuthenticated.bind(this);
  }

  render() {

    // this.props has a bunch of stuff in it related to auth0 (from `withAuth` below)
    // console.log('props', this.props);
    if(this.isAuthenticated() && !!this.props.profile){

      let myRequest = new Request('/api/db/user', {
        method: 'POST',
        body: "profile="+JSON.stringify(this.props.profile)  ,
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



      var todisplay =
      <div className="columns" style={marginTop}>
                  <div className="column is-3" style={posFix}>
                    <Redirect from="/" exact to="/home" />
                    <Route path="/home" render={props => <AllLists {...props} {...this.props} />}/>
                  </div>
                  <div className="column is-9 is-offset-3" style={marginTop}>
                      <Route exact path="/home/list/:id"render={props => <List {...props} {...this.props} />}/>
                      <Route path="/test"render={props => <Test {...props} {...this.props} />}/>
                      <Route path="/newList" render={props => <NewList {...props} {...this.props} />}/>
					            <Route path="/editListItem/:id" render={props => <EditListItem {...props} {...this.props} />}/>
					            <Route path="/deleteListItem/:id" render={props => <DeleteListItem {...props} {...this.props} />}/>
                      <Route path="/editList/:id" render={props => <EditListDetails {...props} {...this.props} />}/>
                      <Route path="/deleteList/:id" render={props => <DeleteList {...props} {...this.props} />}/>
                  </div>
                </div>
    }else{
      var todisplay =
      <div style={loginPage}>
      <article class="message is-success">
        <div class="message-body">
        If you wish to forget anything on the spot, make a note that this thing is to be remembered
        </div>
      </article>
      </div>
    }
    return (
      <div className="App">
        <Header {...this.props} />
        <div style={homePage}>
        {todisplay}
        </div>

      </div>
    );
  }
}

export default withAuth(App);
// <div className="columns">
//   <div className="column is-3">
//     <AllLists />
//   </div>
//   <div className="column is-9">
//     <Route path="/list"render={props => <List {...props} {...this.props} />}/>
//   </div>
// </div>
