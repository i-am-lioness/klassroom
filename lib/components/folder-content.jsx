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
      name: '',
      files: [],

      hoveredIdx: -1,
    };

    this.navigate = this.navigate.bind(this);
    this.hoverStart = this.hoverStart.bind(this);
    this.hoverEnd = this.hoverEnd.bind(this);
    this.eachFile = this.eachFile.bind(this);
    this.eachLevel = this.eachLevel.bind(this);
    this.navToFolder = this.navToFolder.bind(this);

    this.currentLine = null;
  }

  componentDidMount() {
    this.navToFolder({ id: ROOT_FOLDER, name: 'Resources' }, -1);
  }

  navigate(data, e, level) {
    e && e.preventDefault();
    this.navToFolder(data, level);
  }

  navToFolder(data, level) {
    const folderID = data.id;
    let files;

    if (Object.prototype.hasOwnProperty.call(this.props.folderMap, folderID)) {
      files = this.props.folderMap[folderID];
    } else {
      throw new Error(`Folder '${folderID}' not found.`);
    }


    let path;
    if (level > -1) {
      path = update(this.state.path, { $splice: [[level + 1]] });
    } else {
      path = update(this.state.path, { $push: [data] });
    }

    this.setState({
      hoveredIdx: -1,
      path,
      files,
    });
  }


  hoverStart(idx, e) {
    this.setState({ hoveredIdx: idx });
  }

  hoverEnd() {
    this.setState({ hoveredIdx: -1 });
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

    return (<button
      type="button" 
      className="folder-content-item list-group-item list-group-item-action"
      onClick={(e) => { this.navigate(file, e, -1); }}
      key={file.id}
      onMouseEnter={(e) => { this.hoverStart(idx, e); }}
    >
      {contentLink}
    </button>);
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
    const rowDisplay = this.state.files.map(this.eachFile);
    const path = this.state.path.map(this.eachLevel);

    return (<div
    >
      <nav aria-label="breadcrumb" role="navigation">
        <ol className="breadcrumb">
          {path}
        </ol>
      </nav>
      <div
        onMouseLeave={this.hoverEnd}
        className = "list-group"
      >

        {rowDisplay}
      </div>
    </div>);
  }
}

FolderContents.propTypes = {
  folderMap: PropTypes.object.isRequired,
};

export default FolderContents;
