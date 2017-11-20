/* eslint-env browser */
/* global $ */

/*
let getFolderContent;

if (window && window.process && window.process.type) {
  const API_KEY = 'AIzaSyAZoi72Rr-ft3ffrgJ9gDZ-O5_fyVNDe_k';
  getFolderContent = (id) => {
    const query = {
      q: `'${id}' in parents`,
      key: API_KEY,
    };

    return new Promise((resolve, reject) => {
      $.get('https://www.googleapis.com/drive/v3/files', query)
        .then((response) => {
          if (response) {
            resolve(response.files);
          } else {
            reject(new Error('Video data not found.'));
          }
        });
    });
  };
} else {
  */
const API_KEY = 'AIzaSyAZoi72Rr-ft3ffrgJ9gDZ-O5_fyVNDe_k';
const ROOT_FOLDER_ID = '1jhCLoVcxO0wD7MKZ4jtEtF6qCxixGo5c';  

function callGAPI(id) {
  const query = {
    q: `'${id}' in parents`,
    key: API_KEY,
  };

  return new Promise((resolve, reject) => {
    $.get('https://www.googleapis.com/drive/v3/files', query)
      .then((response) => {
        if (response) {
          resolve(response.files);
        } else {
          reject(new Error('folder data not found.'));
        }
      });
  });
}

let folderMap;

function getFullFolder(fileID) {
  return callGAPI(fileID).then((files) => {
    folderMap[fileID] = files;

    const p = [];
    files.forEach((f) => {
      if (f.mimeType === 'application/vnd.google-apps.folder') {
        p.push(getFullFolder(f.id));
      }
    });
    return Promise.all(p);
  });
}

function loadDirectoryListing() {
  folderMap = {};
  return getFullFolder(ROOT_FOLDER_ID).then(() => {
    // console.log(folderMap);
    return folderMap;
  });
}


function chooseSource() {
  if (window && window.process && window.process.type) {
    return loadDirectoryListing();
  } else {
    return $.getJSON('folderMap2.json'); // TODO: update version with each build
  }
}

function loadFoldersIfNeeded() {
  return chooseSource().then((data) => {
    folderMap = data;
    return folderMap;
  });
}
/*
function getFolderContent(id) {
  if (Object.prototype.hasOwnProperty.call(folderMap, id)) {
    const files = folderMap[id];
    return Promise.resolve(files);
  }
  return Promise.reject(new Error(`Folder '${id}' not found.`));
}
*/
const ki = {
  // getFolderContent,
  preLoadFolderContent: loadFoldersIfNeeded,
};

module.exports = ki;

