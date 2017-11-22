/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import FolderContent from './components/folder-content';
import Publisher from './components/publisher';
import { preLoadFolderContent } from './klassroom-util';



class FolderEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      folderMap: {},
    };
  }

  componentDidMount() {
    preLoadFolderContent().then((folderMap) => {
      this.setState({folderMap})
    });
  }

  render() {

    return (<div>
      <FolderContent
        folderMap={this.state.folderMap}
      />
      <a className="btn btn-primary btn-lg btn-block" href="#portfolioModalA" data-toggle="modal">
        Publish
      </a>

      <Publisher
        folderMap={this.state.folderMap}
      />
    </div>);
  }
}

export default FolderEditor;


