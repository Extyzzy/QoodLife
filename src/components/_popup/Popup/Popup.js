import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Popup.scss';

class Popup extends Component {
  static propTypes = {
    className: PropTypes.string,
    show: PropTypes.bool,
    omitOverflow: PropTypes.bool,
    onClose: PropTypes.func,
    beforeRender: PropTypes.func,
    // Do something before closing the popup.
    // The provided prop must be a function
    // to be provided for a new Promise.
    beforeClose: PropTypes.func,
  };

  static defaultProps = {
    show: true,
    omitOverflow: false,
    notShowCloser: false,
    beforeClose: resolve => {resolve();},
  };

  constructor(props){
    super(props);
    this.escFunction = this.escFunction.bind(this);
  }

  componentWillMount() {
    const {
      omitOverflow,
      beforeRender,
    } = this.props;

    if ( ! omitOverflow) {
      this.setBodyOverflowY();
    }

    if (beforeRender instanceof Function) {
      beforeRender();
    }
  }

  componentDidMount(){
    document.addEventListener("keydown", this.escFunction, false);
  }

  componentWillReceiveProps(nextProps) {
    const {
      show,
      omitOverflow,
    } = this.props;

    if ( ! omitOverflow && ! show === nextProps.show) {
      this.setBodyOverflowY(nextProps);
    }
  }

  componentWillUnmount() {
    const { omitOverflow } = this.props;
    document.removeEventListener("keydown", this.escFunction, false);
    if ( ! omitOverflow) {
      document.body.style.overflowY = '';
    }
  }

  setBodyOverflowY(props) {
    const { show } = props || this.props;

    document.body.style.overflowY = show ? 'hidden' : '';
  }

  escFunction(event){
    const {
      onClose,
      beforeClose,
    } = this.props;

    if (event.keyCode === 27) {  // Esc is pressed
        new Promise(beforeClose)
          .then(() => {
            if (onClose instanceof Function) {
              onClose();
            }
          });
    }
  }

  render() {
    const {
      className,
      show,
      onClose,
      beforeClose,
      notShowCloser,
      children,
      confirmPopup,
    } = this.props;

    if ( ! show) {
      return null;
    }

    return (
      <div
        className={classes(s.root,className)}
        onMouseDown={(e) => {
          const closerWithoutScroll = window.innerWidth - e.clientX;

          if (e.target.classList.contains(s.root) && closerWithoutScroll > 15) {
            new Promise(beforeClose)
              .then(() => {
                if (onClose instanceof Function) {
                  onClose();
                }
              });
          }
        }}
      >
        <div className={classes(s.content, {[s.confirm]: confirmPopup})}>
          {
            !notShowCloser && (
              <button
                className={classes(s.closeButton, "remove round-button")}
                onClick={() => {
                  new Promise(beforeClose)
                    .then(() => {
                      if (onClose instanceof Function) {
                        onClose();
                      }
                    });
                }}
              />
            )
          }
          {children}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Popup);
