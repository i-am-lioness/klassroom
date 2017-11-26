/* eslint-env browser */
/* global $ */

const API_KEY = 'AIzaSyAZoi72Rr-ft3ffrgJ9gDZ-O5_fyVNDe_k';

function getIDFromURL(url) {
  const res = url.match(/[?&]v=([^&]+)/);
  if (res) {
    return res[1];
  }
  return false;
}

function getYTdata(url) {
  const q = getIDFromURL(url);

  const query = {
    id: q,
    part: 'snippet',
    key: API_KEY,
  };

  return new Promise((resolve, reject) => {
    if (!q) {
      reject(new Error('No Video ID found.'));
    }

    $.get('https://www.googleapis.com/youtube/v3/videos', query)
      .then((response) => {
        if (response.items && (response.items.length > 0)) {
          resolve(response.items[0]);
        } else {
          reject(new Error('Video data not found.'));
        }
      });
  });
}

function convertToTime(sec) {
  let seconds = parseInt(sec, 10);

  if (isNaN(seconds)) seconds = 0;
  const minutes = seconds / 60;
  seconds %= 60;
  if (seconds < 10) seconds = `0${seconds}`;

  const formatted = `${Math.floor(minutes)}:${seconds}`;
  return formatted;
}

const ki = {
  getYTdata,
  convertToTime,
};

module.exports = ki;

