/* eslint-env browser */
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
    };

    this.addLink = this.addLink.bind(this);
    this.setCurrentFolder = this.setCurrentFolder.bind(this);
  }

  componentDidMount() {
    preLoadFolderContent().then((data) => {
      this.setState(data);
    });
  }

  setCurrentFolder(currentFolder) {
    this.setState({ currentFolder });
  }

  addLink(linkData) {
    const folderID = this.state.currentFolder;
    const linkMap = update(this.state.linkMap, { [folderID]: { $push: [linkData] } });
    this.setState({ linkMap });
  }

  render() {
    return (
      <div>
        <FolderContent
          folderMap={this.state.folderMap}
          linkMap={this.state.linkMap}
          onAddLink={this.setCurrentFolder}
          admin
        />
        <a className="btn btn-primary btn-lg btn-block" href="#portfolioModalA" data-toggle="modal">
          Publish
        </a>

        <Publisher
          folderMap={this.state.folderMap}
          linkMap={this.state.linkMap}
        />
        <LinkEditor
          onSubmit={this.addLink}
        />
      </div>);
  }
}

export default FolderEditor;
