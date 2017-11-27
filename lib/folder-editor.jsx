/* eslint-env browser */
/* global ADMIN */
import React from 'react';
import update from 'immutability-helper';
import { CSSTransitionGroup } from 'react-transition-group';
import FolderContent from './components/folder-content';
import Publisher from './components/publisher';
import LinkEditor from './components/link-editor';
import { preLoadFolderContent } from './klassroom-util';

class FolderEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      folderMap: null,
      linkMap: null,
      currentFolder: null,
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
    let display = (
      <p key="spinner" className="text-center">
        <i className="fa fa-spinner fa-pulse fa-3x fa-fw fa-5x" />
      </p>);

    if (this.state.folderMap) {
      display = (
        <span key="main">
          <FolderContent
            currentFolder={this.state.currentFolder}
            folderMap={this.state.folderMap}
            linkMap={this.state.linkMap}
            navigateTo={this.setCurrentFolder}
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
        </span>);
    }

    return (
      <div>
        <CSSTransitionGroup
          transitionName="example"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {display}
        </CSSTransitionGroup>
      </div>);
  }
}

export default FolderEditor;
