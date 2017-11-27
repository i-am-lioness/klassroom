/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div
        className="portfolio-modal modal fade"
        id="portfolioModalC"
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
                    <h2>{this.props.videoData.name}</h2>
                    <hr className="star-primary" />
                    <div className="embed-responsive embed-responsive-16by9">
                      <iframe
                        title={this.props.videoData.name}
                        className="embed-responsive-item"
                        src={`https://www.youtube.com/embed/${this.props.videoData.videoID}?rel=0`}
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>);
  }
}

Player.defaultProps = {
  videoData: { name: '', videoID: '' },
};

Player.propTypes = {
  videoData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    videoID: PropTypes.string.isRequired,
  }),
};

export default Player;
