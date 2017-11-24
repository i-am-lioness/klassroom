/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

const ROOT_FOLDER = '1jhCLoVcxO0wD7MKZ4jtEtF6qCxixGo5c';

class FolderContents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      path: [],
      currentFolderId: '',
    };

    this.navigate = this.navigate.bind(this);
    this.eachFile = this.eachFile.bind(this);
    this.eachLevel = this.eachLevel.bind(this);
    this.navToFolder = this.navToFolder.bind(this);
    this.init = this.init.bind(this);
    this.handleAddLink = this.handleAddLink.bind(this);
    this.eachLink = this.eachLink.bind(this);

    this.currentLine = null;
  }

  componentDidMount() {
    this.sessionStart = new Date();
    this.init();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!Object.prototype.hasOwnProperty.call(prevProps.folderMap, ROOT_FOLDER)) this.init();
  }

  init() {
    if (Object.prototype.hasOwnProperty.call(this.props.folderMap, ROOT_FOLDER)) {
      this.navToFolder({ id: ROOT_FOLDER, name: 'Resources' }, -1);
    }
  }

  navigate(data, e, level) {
    e.preventDefault();
    this.navToFolder(data, level);
  }

  navToFolder(data, level) {
    const folderID = data.id;

    let path;
    if (level > -1) {
      path = update(this.state.path, { $splice: [[level + 1]] });
    } else {
      path = update(this.state.path, { $push: [data] });
    }

    this.setState({
      path,
      currentFolderId: folderID,
    });
  }

  handleAddLink(e) {
    e.preventDefault();

    this.props.onAddLink(this.state.currentFolderId);
  }

  eachFile(file, idx) {
    const viewLink = `https://drive.google.com/file/d/${file.id}/view`;
    let contentLink = (
      <a
        href={viewLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        {file.name}
      </a>);

    if (file.mimeType === 'application/vnd.google-apps.folder') {
      contentLink = file.name;
    }

    return (
      <button
        type="button"
        className="folder-content-item list-group-item list-group-item-action"
        onClick={(e) => { this.navigate(file, e, -1); }}
        key={file.id}
      >
        {contentLink}
      </button>);
  }

  eachLink(link, idx) {
    const isNew = link.timestamp && (link.timestamp > this.sessionStart);
    const newClass = isNew ? 'list-group-item-info' : 'list-group-item-warning';
    return (
      <a
        href={link.url}
        className={`folder-content-item list-group-item list-group-item-action ${newClass}`}
        key={idx}
      >
        {link.name}
      </a>);
  }

  eachLevel(file, idx) {
    return (
      <li key={file.id} className="breadcrumb-item">
        <a
          href="#"
          onClick={(e) => { this.navigate(file, e, idx); }}
        >
          {file.name}
        </a>
      </li>);
  }

  render() {
    let files = [];
    let links = [];
    const folderID = this.state.currentFolderId;

    if (Object.prototype.hasOwnProperty.call(this.props.folderMap, folderID)) {
      files = this.props.folderMap[folderID];
    }

    if (Object.prototype.hasOwnProperty.call(this.props.linkMap, folderID)) {
      links = this.props.linkMap[folderID];
    }

    const fileDisplay = files.map(this.eachFile);
    const linkDisplay = links.map(this.eachLink);
    const path = this.state.path.map(this.eachLevel);

    const addLinkBtn = this.props.admin && (
      <button
        className="btn btn-primary"
        onClick={this.handleAddLink}
        href="#portfolioModalB"
        data-toggle="modal"
      >
        Add Link
      </button>);

    return (
      <div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            {path}
          </ol>
          {addLinkBtn}
        </nav>
        <div
          className="list-group"
        >
          {fileDisplay}
          {linkDisplay}
        </div>
      </div>);
  }
}

FolderContents.defaultProps = {
  admin: false,
  onAddLink: null,
};

FolderContents.propTypes = {
  folderMap: PropTypes.objectOf(PropTypes.array).isRequired,
  linkMap: PropTypes.objectOf(PropTypes.array).isRequired,
  admin: PropTypes.bool,
  onAddLink: PropTypes.func,
};

export default FolderContents;
