/* eslint-env browser */
/* global ADMIN */
import React from 'react';
import update from 'immutability-helper';
import FolderContent from './components/folder-content';
import Publisher from './components/publisher';
import LinkEditor from './components/link-editor';
import { preLoadFolderContent } from './klassroom-util';

class FolderEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      folderMap: {},
      linkMap: {},
      currentFolder: '',
      editIndex: -1,
      linkToModify: null,
    };

    this.addLink = this.addLink.bind(this);
    this.setCurrentFolder = this.setCurrentFolder.bind(this);
    this.deleteLink = this.deleteLink.bind(this);
    this.editLink = this.editLink.bind(this);
    this.saveLink = this.saveLink.bind(this);
  }

  componentDidMount() {
    preLoadFolderContent().then((data) => {
      this.setState(data);
    });
  }

  setCurrentFolder(currentFolder) {
    this.setState({ currentFolder });
  }

  editLink(linkToModify, editIndex) {
    this.setState({ editIndex, linkToModify });
  }

  addLink(linkData) {
    const folderID = this.state.currentFolder;
    const linkMap = update(this.state.linkMap, { [folderID]: { $push: [linkData] } });
    this.setState({ linkMap });
  }

  saveLink(linkData) {
    const folderID = this.state.currentFolder;
    const linkIdx = this.state.editIndex;
    const linkMap = update(this.state.linkMap, { [folderID]: { [linkIdx]: { $set: linkData } } });
    this.setState({ linkMap, editIndex: -1, linkToModify: null });
  }

  deleteLink(linkIdx) {
    const folderID = this.state.currentFolder;
    const linkMap = update(this.state.linkMap, { [folderID]: { $splice: [[linkIdx, 1]] } });
    this.setState({ linkMap });
  }

  render() {
    return (
      <div>
        <FolderContent
          folderMap={this.state.folderMap}
          linkMap={this.state.linkMap}
          updateCurrentFolder={this.setCurrentFolder}
          deleteLink={this.deleteLink}
          editLink={this.editLink}
          admin={ADMIN}
        />
        {ADMIN && (
        <span>
          <a
            className="btn btn-primary btn-lg btn-block"
            href="#portfolioModalA"
            data-toggle="modal"
          >
            Publish
          </a>

          <Publisher
            folderMap={this.state.folderMap}
            linkMap={this.state.linkMap}
          />
          <LinkEditor
            onAdd={this.addLink}
            onSave={this.saveLink}
            linkToModify={this.state.linkToModify}
          />
        </span>)}
      </div>);
  }
}

export default FolderEditor;
