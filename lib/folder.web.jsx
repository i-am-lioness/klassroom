/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import FolderContent from './components/folder-content';
import { preLoadFolderContent } from './klassroom-util';


preLoadFolderContent().then((maps) => {
  ReactDOM.render(
    <FolderContent
      folderMap={maps.folderMap}
      linkMap={maps.linkMap}
    />,
    document.getElementById('fileDisplay')
  );
});

