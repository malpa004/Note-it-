import React, { Component } from 'react';
import './listitem.css'

class AddTask extends Component{
  constructor(props) {
    super(props);
    this.addtemptask = this.addtemptask.bind(this);
    this.addtask = this.addtask.bind(this);
    this.isEnter = this.isEnter.bind(this);
  }

  addtemptask(e){
    this.props.addtemptask(e);
  }

  addtask(){
    this.props.addtask();
  }

  isEnter(e){
    if(e.keyCode == 13){
      this.addtask();
    }
  }

  render(){
    return(
      <div className="AddList control has-icons-left">
			<input className="AddListy input is-medium" type="text" placeholder="Add task" onKeyDown={this.isEnter} onChange={this.addtemptask} name="newtask" value={this.props.toAdd}/>
			<span class="icon is-small is-left">
      			<i class="fa fa-plus"></i>
    		</span>
      </div>
    );
  }
}

export default AddTask;
