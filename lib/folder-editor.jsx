/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import FolderContent from './components/folder-content';
import Publisher from './components/publisher';
import LinkEditor from './components/link-editor';
import update from 'immutability-helper';
import { preLoadFolderContent, loadLinkMap } from './klassroom-util';



class FolderEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      folderMap: {},
      linkMap: {},
      currentFolder: '',
    };

    this.addLink = this.addLink.bind(this);
    this.setCurrentFolder = this.setCurrentFolder.bind(this)
  }

  componentDidMount() {
    preLoadFolderContent().then((folderMap) => {
      this.setState({folderMap})
      return loadLinkMap();
    }).then((linkMap) => {
      this.setState({linkMap});
    });
    
  }

  setCurrentFolder(currentFolder) {
    this.setState({currentFolder});
  }

  addLink(linkData) {
    let folderID = this.state.currentFolder;
    let linkMap = update(this.state.linkMap, {[folderID]: { $push: [linkData] }});
    this.setState({linkMap});
  }

  render() {

    return (<div>
      <FolderContent
        folderMap={this.state.folderMap}
        linkMap={this.state.linkMap}
        onAddLink={this.setCurrentFolder}
        admin={true}
      />
      <a className="btn btn-primary btn-lg btn-block" href="#portfolioModalA" data-toggle="modal">
        Publish
      </a>

      <Publisher
        folderMap={this.state.folderMap}
      />
      <LinkEditor
        onSubmit={this.addLink}
      />
    </div>);
  }
}

export default FolderEditor;


