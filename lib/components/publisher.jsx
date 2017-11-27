/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import push from 'git-push';
import { constants } from '../klassroom-util';

const { remote } = require('electron');

const { app } = remote;

const fs = remote.require('fs-extra');
const path = remote.require('path');

const stages = {
  DEFAULT: 0,
  DISPLAYED: 1,
  PUBLISHING: 2,
  COMPLETE: 3,
};

const REMOTE_HOST = 'https://github.com/nnennaude/chem_class1.git';
const JS_BUNDLE = 'folder.web.bundle.js';

function goToSite(e) {
  e.preventDefault();
  remote.shell.openExternal(constants.REMOTE_URL);
}

class Publisher extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      stage: stages.DEFAULT,
      progress: 0,
    };

    this.saveFolderMap = this.saveFolderMap.bind(this);
    this.outputMessage = this.outputMessage.bind(this);
  }

  outputMessage(msg) {
    const messages = update(this.state.messages, { $push: [msg] });
    this.setState({ messages });
  }

  saveFolderMap(e) {
    e.preventDefault();

    this.setState({
      stage: stages.PUBLISHING,
      messages: [],
    });

    const appPath = app.getAppPath();
    const tempPath = app.getPath('temp');

    const origin = path.resolve(appPath, 'app');
    const tempWebsite = path.resolve(tempPath, 'website');

    const bundleOrigin = path.resolve(appPath, `out/${JS_BUNDLE}`);
    const bundleCopy = path.resolve(tempWebsite, `js/${JS_BUNDLE}`);

    const folderMapFileName = path.resolve(tempWebsite, constants.FOLDER_MAP_FILE_NAME);
    const linkMapFileName = path.resolve(tempWebsite, constants.LINK_MAP_FILE_NAME);

    fs.copy(origin, tempWebsite)
      .then(() => {
        this.outputMessage(`copied html to '${tempWebsite}'`);
        this.setState({ progress: 25 });

        return fs.copy(bundleOrigin, bundleCopy);
      }).then(() => {
        this.outputMessage(`copied ${bundleOrigin} to '${bundleCopy}'`);
        this.setState({ progress: 35 });

        return fs.writeJson(folderMapFileName, this.props.folderMap);
      }).then(() => {
        this.outputMessage(`The folders tree was saved at '${folderMapFileName}'`);
        this.setState({ progress: 65 });

        return fs.writeJson(linkMapFileName, this.props.linkMap);
      })
      .then(() => {
        this.outputMessage(`The links were saved at '${linkMapFileName}'`);
        this.setState({ progress: 75 });

        return new Promise((resolve, reject) => {
          push(tempWebsite, REMOTE_HOST, resolve);
        });
      })
      .then(() => {
        this.outputMessage(`published at ${REMOTE_HOST}`);
        this.setState({
          stage: stages.COMPLETE,
          progress: 100,
        });
      });
    // .catch(err => console.error(err));
  }

  render() {
    const log = this.state.messages.join('\n');
    const output = (this.state.stage >= stages.PUBLISHING) && (
      <pre className="pre-scrollable"><code>{log}</code></pre>);
    const startBtn = (this.state.stage === stages.DEFAULT) && (
      <button
        className="btn btn-primary btn-lg btn-block"
        href="#portfolioModal1"
        data-toggle="modal"
        onClick={this.saveFolderMap}
      >
        Start
      </button>);
    const externalLink = (this.state.stage === stages.COMPLETE) && (
      <button className="btn btn-success" type="button" onClick={goToSite}>
        <i className="fa fa-times" />
        View Site
      </button>);

    const progressBar = (this.state.stage >= stages.PUBLISHING) && (
      <div className="progress">
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          aria-valuenow="75"
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: `${this.state.progress}%` }}
        />
      </div>);

    return (
      <div
        className="portfolio-modal modal fade"
        id="portfolioModalA"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="close-modal" data-dismiss="modal">
              <div className="lr">
                <div className="rl" />
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="modal-body">
                    <h2>Publish</h2>
                    <hr className="star-primary" />
                    {startBtn}
                    {progressBar}
                    {output}
                    {externalLink}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>);
  }
}

Publisher.propTypes = {
  folderMap: PropTypes.objectOf(PropTypes.array).isRequired,
  linkMap: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default Publisher;
