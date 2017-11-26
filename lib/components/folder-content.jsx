/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { linkTypes } from '../klassroom-util';

const ROOT_FOLDER = '1jhCLoVcxO0wD7MKZ4jtEtF6qCxixGo5c';

const mimeTypes = {
  FOLDER: 'application/vnd.google-apps.folder',
  POWERPOINT: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  PDF: 'application/pdf',
};

function iconByType(listing) {
  let icon;
  if (Object.prototype.hasOwnProperty.call(listing, 'mimeType')) {
    switch (listing.mimeType) {
      case mimeTypes.FOLDER:
        icon = 'folder';
        break;
      case mimeTypes.POWERPOINT:
        icon = 'file-powerpoint-o';
        break;
      case mimeTypes.PDF:
        icon = 'file-pdf-o';
        break;
      default:
        icon = 'file';
    }
  } else {
    switch (+listing.type) {
      case linkTypes.DOCUMENT:
        icon = 'file-text-o';
        break;
      case linkTypes.VIDEO:
        icon = 'film';
        break;
      case linkTypes.WEBSITE:
      default:
        icon = 'link';
    }
  }

  return (<span><i className={`fa fa-${icon} fa-fw`} aria-hidden="true" /> &nbsp;</span>);
}

function compareByTypeThenName(a, b) {
  if ((a.mimeType === mimeTypes.FOLDER) && (b.mimeType !== mimeTypes.FOLDER)) {
    return -1;
  } else if ((a.mimeType !== mimeTypes.FOLDER) && (b.mimeType === mimeTypes.FOLDER)) {
    return 1;
  }
  return (a.name > b.name);
}

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
    if (this.props.updateCurrentFolder) this.props.updateCurrentFolder(folderID);
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

    if (file.mimeType === mimeTypes.FOLDER) {
      contentLink = (
        <a
          href={`#${file.name}`}
          onClick={(e) => { this.navigate(file, e, -1); }}
        >
          <strong>{file.name}</strong>
        </a>);
    }

    return (
      <li
        className="folder-content-item list-group-item list-group-item-action"
        key={file.id}
      >
        {iconByType(file)}
        {contentLink}
      </li>);
  }

  eachLink(link, idx) {
    const isNew = link.timestamp && (link.timestamp > this.sessionStart);
    const newClass = isNew ? 'list-group-item-info' : 'list-group-item-warning';

    const editLinkBtns = (
      <span>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={(e) => { e.preventDefault(); this.props.deleteLink(idx); }}
        >
          <i className="fa fa-trash-o" aria-hidden="true" />
        </button>
        <button
          type="button"
          href="#portfolioModalB"
          data-toggle="modal"
          className="btn btn-outline-primary btn-sm"
          onClick={(e) => { e.preventDefault(); this.props.editLink(link, idx); }}
        >
          <i className="fa fa-pencil" aria-hidden="true" />
        </button>
      </span>);

    return (
      <li
        className={`folder-content-item list-group-item list-group-item-action ${newClass}`}
        key={idx}
      >
        <a href={link.url}>
          {iconByType(link)}
          {link.name}
        </a>
        {this.props.admin && editLinkBtns}
      </li>);
  }

  eachLevel(file, idx) {
    return (
      <li key={file.id} className="breadcrumb-item">
        <a
          href={`#${file.name}`}
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
      // files = this.props.folderMap[folderID];
      files = [].concat(this.props.folderMap[folderID]).sort(compareByTypeThenName);
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
  updateCurrentFolder: null,
  deleteLink: null,
  editLink: null,
};

FolderContents.propTypes = {
  folderMap: PropTypes.objectOf(PropTypes.array).isRequired,
  linkMap: PropTypes.objectOf(PropTypes.array).isRequired,
  deleteLink: PropTypes.func,
  editLink: PropTypes.func,
  admin: PropTypes.bool,
  updateCurrentFolder: PropTypes.func,
};

export default FolderContents;
