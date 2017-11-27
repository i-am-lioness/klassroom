/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import Player from './player';
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
    switch (listing.type) {
      case linkTypes.DOCUMENT:
        icon = 'file-text-o';
        break;
      case linkTypes.VIDEO:
        icon = 'film';
        break;
      case linkTypes.YOUTUBE_VIDEO:
        icon = 'youtube-play';
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
      path: [{ id: ROOT_FOLDER, name: 'Resources' }],
    };

    this.navigate = this.navigate.bind(this);
    this.eachFile = this.eachFile.bind(this);
    this.eachLevel = this.eachLevel.bind(this);
    this.eachLink = this.eachLink.bind(this);
    this.playVideo = this.playVideo.bind(this);

    this.currentLine = null;
  }

  componentDidMount() {
    this.sessionStart = new Date();
  }

  navigate(data, e, level) {
    e.preventDefault();
    const folderID = data.id;

    let path;
    if (level > -1) {
      path = update(this.state.path, { $splice: [[level + 1]] });
    } else {
      path = update(this.state.path, { $push: [data] });
    }

    this.setState({
      path,
    });
    this.props.navigateTo(folderID);
  }

  playVideo(currentVideo) {
    this.setState({ currentVideo });
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

    let anchor;
    if (link.type === linkTypes.YOUTUBE_VIDEO) {
      anchor = (
        <a
          href="#portfolioModalC"
          data-toggle="modal"
          data-target="#portfolioModalC"
          onClick={(e) => { this.playVideo(link); }}
        >
          {link.name}
        </a>);
    } else {
      anchor = (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.name}
        </a>);
    }

    return (
      <li
        className={`folder-content-item list-group-item list-group-item-action ${newClass}`}
        key={idx}
      >
        {iconByType(link)}
        {anchor}
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
    const folderID = this.props.currentFolder || ROOT_FOLDER;

    if (this.props.folderMap &&
      Object.prototype.hasOwnProperty.call(this.props.folderMap, folderID)) {
      files = [].concat(this.props.folderMap[folderID]).sort(compareByTypeThenName);
    }

    if (this.props.linkMap && Object.prototype.hasOwnProperty.call(this.props.linkMap, folderID)) {
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
        <Player videoData={this.state.currentVideo} />
      </div>);
  }
}

FolderContents.defaultProps = {
  folderMap: {},
  linkMap: {},
  currentFolder: ROOT_FOLDER,
  admin: false,
  deleteLink: null,
  editLink: null,
};

FolderContents.propTypes = {
  folderMap: PropTypes.objectOf(PropTypes.array),
  linkMap: PropTypes.objectOf(PropTypes.array),
  currentFolder: PropTypes.string,
  deleteLink: PropTypes.func,
  editLink: PropTypes.func,
  admin: PropTypes.bool,
  navigateTo: PropTypes.func.isRequired,
};

export default FolderContents;
