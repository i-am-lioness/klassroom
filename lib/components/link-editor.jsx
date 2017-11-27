/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';
import { linkTypes } from '../klassroom-util';
import { getYTdata } from '../youtube';

class LinkEditor extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearValues = this.clearValues.bind(this);
    this.searchYoutube = this.searchYoutube.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.linkToModify) && (this.props.linkToModify === null)) {
      this.linkNameInput.value = nextProps.linkToModify.name;
      this.linkUrlInput.value = nextProps.linkToModify.url;
      this.linkTypeSelector.value = nextProps.linkToModify.type;
    }
  }

  clearValues() {
    this.linkNameInput.value = '';
    this.linkUrlInput.value = '';
    this.linkTypeSelector.value = null;
  }

  handleSubmit(event) {
    event.preventDefault();

    const linkData = {
      name: this.linkNameInput.value,
      url: this.linkUrlInput.value,
      type: +this.linkTypeSelector.value,
      timestamp: new Date(),
    };
    if (linkData.type === linkTypes.YOUTUBE_VIDEO) {
      linkData.videoID = this.videoID;
    }

    if (this.props.linkToModify) {
      this.props.onSave(linkData);
    } else {
      this.props.onAdd(linkData);
    }
    this.clearValues();
  }

  searchYoutube(e) {
    getYTdata(e.target.value).then((res) => {
      const data = res.snippet;
      this.videoID = res.id;
      const { title } = data;
      this.linkNameInput.value = title;
      this.linkTypeSelector.value = linkTypes.YOUTUBE_VIDEO;
    }).catch(() => {});
  }

  render() {
    const linkTypeOptions = Object.getOwnPropertyNames(linkTypes).map((t) => {
      const val = linkTypes[t];
      return (<option key={val} value={val}>{t}</option>);
    });

    const buttonText = this.props.linkToModify ? 'Save' : 'Add';

    const form = (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="exampleFormControlInput1">URL</label>
          <input
            id="exampleFormControlInput1"
            type="text"
            className="form-control"
            placeholder="ex: http://youtube.com/"
            onChange={this.searchYoutube}
            ref={(input) => { this.linkUrlInput = input; }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleFormControlInput1">Name of Link</label>
          <input
            id="exampleFormControlInput1"
            type="text"
            className="form-control"
            placeholder="ex: Bohr's Model"
            ref={(input) => { this.linkNameInput = input; }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleFormControlSelect1">Link type</label>
          <select
            className="form-control"
            ref={(select) => { this.linkTypeSelector = select; }}
          >
            {linkTypeOptions}
          </select>
        </div>
        <div className="modal-footer">
          <button type="submit" className="btn btn-primary">
            {buttonText}
          </button>
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
        </div>
      </form>
    );
    return (
      <div
        className="portfolio-modal modal fade"
        id="portfolioModalB"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="close-modal" data-dismiss="modal">
              <div className="lr">
                <div className="rl" />
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="modal-body">
                    <h2>Add Link</h2>
                    <hr className="star-primary" />
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

LinkEditor.defaultProps = {
  linkToModify: null,
};

LinkEditor.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  linkToModify: PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
    type: (props, propName) => {
      const prop = props[propName];
      return (isNaN(prop));
    },
  }),
};

export default LinkEditor;
