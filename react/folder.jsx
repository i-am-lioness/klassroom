/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import push from 'git-push';
import FolderContent from './components/folder-content';
import { preLoadFolderContent } from './klassroom-util';

const remote = require('electron').remote;
// const app = require('electron').remote.app;

const electronFs = remote.require('fs');
// const path = require('path');

let folderMap;

function saveFolderMap(e) {
  e.preventDefault();

  const content = JSON.stringify(folderMap);

  // const fileName = path.resolve(app.getPath(), 'folderMap2.json');
  const fileName = './web/folderMap2.json';

  electronFs.writeFile(fileName, content, 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }

    console.log(`The file was saved at '${fileName}'`);
    push('./web', 'https://github.com/nnennaude/chem_class0.git', function() {
      console.log('pushed to github');
    });
  });
}

preLoadFolderContent().then((fm) => {
  folderMap = fm;
  ReactDOM.render(
    <FolderContent
      folderMap={folderMap}
    />,
    document.getElementById('fileDisplay')
  );

  const element = <button onClick={saveFolderMap} >Publish</button>;
  ReactDOM.render(
    element,
    document.getElementById('publisher')
  );
});

