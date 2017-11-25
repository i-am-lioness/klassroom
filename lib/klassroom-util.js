/* global $, window */

const API_KEY = 'AIzaSyAZoi72Rr-ft3ffrgJ9gDZ-O5_fyVNDe_k';
const ROOT_FOLDER_ID = '1jhCLoVcxO0wD7MKZ4jtEtF6qCxixGo5c';

const constants = {
  FOLDER_MAP_FILE_NAME: 'folderMap2.json',
  LINK_MAP_FILE_NAME: 'linkMap.json',
  REMOTE_URL: 'https://nnennaude.github.io/chem_class1',
};

const DESKTOP_MODE = window && window.process && window.process.type;

let folderMap;

function loadFreshJSON(url) {
  return $.ajax({
    cache: false,
    url,
    dataType: 'json',
  });
}

function getFileTreeFromGAPI(id, cb) {
  const query = {
    q: `'${id}' in parents`,
    key: API_KEY,
  };

  $.get('https://www.googleapis.com/drive/v3/files', query)
    .then((response) => {
      if (response) {
        const { files } = response;
        folderMap[id] = files;

        let returns = -1;

        const onTraversalComplete = () => {
          returns += 1;

          if (returns >= files.length) {
            cb();
            return;
          }

          const f = files[returns];
          if (f.mimeType === 'application/vnd.google-apps.folder') {
            getFileTreeFromGAPI(f.id, onTraversalComplete);
          } else {
            onTraversalComplete();
          }
        };

        onTraversalComplete();
      } else {
        throw (new Error('folder data not found.'));
      }
    });
}

function loadDirectoryListing() {
  folderMap = {};
  return new Promise((resolve, reject) => {
    getFileTreeFromGAPI(ROOT_FOLDER_ID, () => { resolve(folderMap); });
  });
}


function chooseSource() {
  if (DESKTOP_MODE) {
    return loadDirectoryListing();
  } else {
    return loadFreshJSON(constants.FOLDER_MAP_FILE_NAME);
  }
}

function loadLinkMap() {
  const linkMap = {};
  Object.keys(folderMap).forEach((prop) => {
    linkMap[prop] = [];
  });
  let url = constants.LINK_MAP_FILE_NAME;
  url = (DESKTOP_MODE) ? (`${constants.REMOTE_URL}/${url}`) : url;
  return loadFreshJSON(url).then((data) => {
    Object.assign(linkMap, data);
    return linkMap;
  });
}

function preLoadFolderContent() {
  return chooseSource().then((data) => {
    folderMap = data;
    return loadLinkMap();
  }).then(linkMap => ({ linkMap, folderMap }));
}


const ki = {
  preLoadFolderContent,
  constants,
};

module.exports = ki;

