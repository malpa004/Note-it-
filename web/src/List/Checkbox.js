import React, { Component, PropTypes } from 'react';

class Checkbox extends Component {
  state = {
    isChecked: false,
  }

  toggleCheckboxChange = () => {
    const { handleCheckboxChange, label } = this.props;

    this.setState(({ isChecked }) => (
      {
        isChecked: !isChecked,
      }
    ));

    handleCheckboxChange(label);
  }

  render() {
    const { label } = this.props;
    const { isChecked } = this.state;

    return (
      <div className="checkbox notification">
        <label className="checkbox">
          <input type="checkbox" value={label} checked={isChecked} onChange={this.toggleCheckboxChange}/>
          {label}
        </label>
			<br></br>
      </div>
	
    );
  }
}


export default Checkbox;

