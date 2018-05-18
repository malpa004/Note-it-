import React, { Component } from 'react';
import './listitem.css';
import { Link } from 'react-router-dom'

const border={
  'border': '1px solid #eee'
}

const imgH ={
  'max-height': '180px',
  'min-height': '180px'
}

const walmartTitle={
  'line-height':' 1.2em',
'height': '2.4em'

}

class ItemComponent extends Component{
  constructor(props) {
    super(props);
	this.state = {
    isStar: false,
    }
    this.handleChange = this.handleChange.bind(this);
	this.handlestarchange = this.handlestarchange.bind(this);  
  }

  handleChange(event){
    this.props.checkboxChange(event);
  }
	
  handlestarchange(isStar, name, event){
	  console.log(name);
	  this.props.starChange(isStar, name, event);
  }	

  render(){
    console.log("Item received");
    console.log(this.props.cat);

    if(this.props.cat != "To-Do List"){
      var walmartstuff = this.props.item.wal.map((walmart)=>
      <div style={border} className="column">
        <a href={"http://walmart.com"+walmart.productPageUrl} target="_blank">
          <p style={walmartTitle}>{walmart.title}</p>
          <img src={walmart.imageUrl} />
          <p>{walmart.price}</p>
        </a>
      </div>
    );
    }

    return(
      <div className="listy">
		  <div className="box task-box">
      <div className=" level is-mobile">
      <div className={"level-left "+ (this.props.item.checked === "true" ? 'completeTask' : '')}>
       <input type="checkbox" name={this.props.item._id} onChange={this.handleChange} checked={this.props.item.checked === "true"}/>
       {this.props.item.name}
       </div>
      <div className="level-right">
      <Link to={'/editListItem/'+this.props.item._id}  className="editbutton button is-medium level-item">
      <span className="editicon icon">
       <i className="fa fa-pencil"></i>
      </span>
      </Link>
      <Link to={'/deleteListItem/'+this.props.item._id} className="deletebutton button is-medium level-item">
      <span className="deleteicon icon">
       <i className="fa fa-trash"></i>
      </span>
      </Link>
      </div>
      </div>

<div className={ this.props.hiddenwal==true ? "noshow":"columns"}>
{walmartstuff}
</div>
			</div>


      </div>

    );
  }
}

export default ItemComponent;
