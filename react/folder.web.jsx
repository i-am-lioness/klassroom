/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import FolderContent from './components/folder-content';
import { preLoadFolderContent } from './klassroom-util';

let folderMap;

preLoadFolderContent().then((fm) => {
  folderMap = fm;
  ReactDOM.render(
    <FolderContent
      folderMap={folderMap}
    />,
    document.getElementById('root')
  );
});

