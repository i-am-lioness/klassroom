
const API_KEY = 'AIzaSyAZoi72Rr-ft3ffrgJ9gDZ-O5_fyVNDe_k';
const ROOT_FOLDER_ID = '1jhCLoVcxO0wD7MKZ4jtEtF6qCxixGo5c';  

let folderMap;

function getFileTreeFromGAPI(id, cb) {
  const query = {
    q: `'${id}' in parents`,
    key: API_KEY,
  };

  $.get('https://www.googleapis.com/drive/v3/files', query)
    .then((response) => {
      if (response) {
        const files = response.files;
        folderMap[id] = files;

        let returns = -1;
      
        function onTraversalComplete() {
          returns +=1;

          if(returns >= files.length) return cb();

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
    getFileTreeFromGAPI(ROOT_FOLDER_ID, () => { resolve(folderMap); })
  });
}


function chooseSource() {
  if (window && window.process && window.process.type) {
    return loadDirectoryListing();
  } else {
    return $.getJSON('folderMap2.json'); // TODO: update version with each build
  }
}

function preLoadFolderContent() {
  return chooseSource().then((data) => {
    folderMap = data;
    return folderMap;
  });
}

const ki = {
  preLoadFolderContent,
};

module.exports = ki;

