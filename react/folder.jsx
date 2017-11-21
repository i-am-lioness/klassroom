/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import push from 'git-push';
import FolderContent from './components/folder-content';
import { preLoadFolderContent } from './klassroom-util';

const remote = require('electron').remote;
const app = remote.app;

const electronFs = remote.require('fs');
const path = remote.require('path');
const ncp = remote.require('ncp').ncp;

let folderMap;

function saveFolderMap(e) {
  e.preventDefault();

  const content = JSON.stringify(folderMap);

  const appPath = app.getAppPath();
  const tempPath = app.getPath('temp');
  console.log(appPath);
  console.log(tempPath);

  let source = path.resolve(appPath, 'app');
  const tempWebsite = path.resolve(tempPath, 'website');

  ncp(source, tempWebsite, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log(`copied html to '${tempWebsite}'`);
    
    source = path.resolve(appPath, 'out/folder.web.bundle.js');
    const destination = path.resolve(tempWebsite, 'js/folder.web.bundle.js');
    ncp(source, destination, function (err) {
      if (err) {
        return console.error(err);
      }
      console.log(`copied ${source} to '${destination}'`);
    
      const fileName = path.resolve(tempWebsite, 'folderMap2.json');
    
      electronFs.writeFile(fileName, content, 'utf8', function (err) {
        if (err) {
          return console.log(err);
        }
    
        console.log(`The file was saved at '${fileName}'`);
        push(tempWebsite, 'https://github.com/nnennaude/chem_class1.git', function() {
          console.log('pushed to github');
        });
      });
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

