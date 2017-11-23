/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';

const linkTypes = {
  OTHER: 0,
  WEBSITE: 1,
  VIDEO: 2,
  DOCUMENT: 3,
};

class LinkEditor extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit({
      name: this.linkNameInput.value,
      url: this.linkUrlInput.value,
      type: this.linkTypeSelector.value,
    });
  }

  render() {

    const linkTypeOptions = Object.getOwnPropertyNames(linkTypes).map((t) => {
      const val = linkTypes[t];
      return (<option key={val} value={val}>{t}</option>);
    });

    const form = (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="exampleFormControlInput1">Name of Link</label>
          <input
            type="text"
            className="form-control"
            placeholder="ex: Bohr's Model"
            ref={(input) => this.linkNameInput = input}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleFormControlInput1">URL</label>
          <input
            type="text"
            className="form-control"
            placeholder="ex: http://youtube.com/"
            ref={(input) => this.linkUrlInput = input}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleFormControlSelect1">Link type</label>
          <select
            className="form-control"
            ref={(select) => this.linkTypeSelector = select}
          >
           {linkTypeOptions}
          </select>
        </div>
        <div className="modal-footer">
          <button type="button" type="submit" className="btn btn-primary">Add</button>
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </form>
    );
    return (
    <div className="portfolio-modal modal fade" id="portfolioModalB" tabIndex="-1" role="dialog" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="close-modal" data-dismiss="modal">
            <div className="lr">
              <div className="rl"></div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <div className="modal-body">
                  <h2>Add Link</h2>
                  <hr className="star-primary"/>
                  {form}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
   
  }
}

LinkEditor.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default LinkEditor;
