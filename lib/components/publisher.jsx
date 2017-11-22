/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import push from 'git-push';


const remote = require('electron').remote;
const app = remote.app;

const electronFs = remote.require('fs');
const path = remote.require('path');
const ncp = remote.require('ncp').ncp;

const stages = {
  DEFAULT: 0,
  DISPLAYED: 1,
  PUBLISHING: 2,
  COMPLETE: 3,
}

class Publisher extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      stage: stages.DEFAULT,
    };

    this.saveFolderMap = this.saveFolderMap.bind(this);
    this.eachMessage = this.eachMessage.bind(this);
    this.outputMessage = this.outputMessage.bind(this);
  }

  eachMessage(m, i){
    return <span key={i}>{m}</span>
  }

  outputMessage(msg) {
    console.log(msg);
    const messages = update(this.state.messages, { $push: [msg] });
    this.setState({messages});
  }

  saveFolderMap(e) {
    e.preventDefault();

    this.setState({
      stage: stages.PUBLISHING,
      messages: [],
    });
    const content = JSON.stringify(this.props.folderMap);
  
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
      this.outputMessage(`copied html to '${tempWebsite}'`);
      
      source = path.resolve(appPath, 'out/folder.web.bundle.js');
      const destination = path.resolve(tempWebsite, 'js/folder.web.bundle.js');
      ncp(source, destination, function (err) {
        if (err) {
          return console.error(err);
        }
        this.outputMessage(`copied ${source} to '${destination}'`);
      
        const fileName = path.resolve(tempWebsite, 'folderMap2.json');
      
        electronFs.writeFile(fileName, content, 'utf8', function (err) {
          if (err) {
            return console.log(err);
          }
      
          this.outputMessage(`The file was saved at '${fileName}'`);
          push(tempWebsite, 'https://github.com/nnennaude/chem_class1.git', function() {
            this.outputMessage('pushed to github');
            this.setState({
              stage: stages.COMPLETE,
            });
          }.bind(this));
        }.bind(this));
      }.bind(this));
     }.bind(this));
  
  }
  

  render() {
    const log = this.state.messages.join("\n");    
    const output = (this.state.stage >= stages.PUBLISHING) && (<pre className="pre-scrollable"><code>{log}</code></pre>);
    const btn = (this.state.stage == stages.DEFAULT) && (<button
    className="btn btn-primary btn-lg btn-block"
    href="#portfolioModal1"
    data-toggle="modal"
    onClick={this.saveFolderMap}
  >
    Start
  </button>);

    const progressBar = (this.state.stage == stages.PUBLISHING) && (<div className="progress">
      <div
        className="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        aria-valuenow="75"
        aria-valuemin="0" aria-valuemax="100"
        style={{width: "100%"}}>
      </div>
    </div>);

    return (
    <div className="portfolio-modal modal fade" id="portfolioModalA" tabIndex="-1" role="dialog" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="close-modal" data-dismiss="modal">
            <div className="lr">
              <div className="rl"></div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <div className="modal-body">
                  <h2>Publish</h2>
                  <hr className="star-primary"/>
                  {btn}
                  {progressBar}
                  {output}
                  
                  <button className="btn btn-success" type="button" data-dismiss="modal">
                    <i className="fa fa-times"></i>
                    Close
                  </button>
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
  folderMap: PropTypes.object.isRequired,
};

export default Publisher;
