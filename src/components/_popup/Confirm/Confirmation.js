import React from 'react';
import PropTypes from 'prop-types';
import { confirmable } from 'react-confirm';
import Popup from "../Popup/Popup";
import ConfirmPopup from "./components/ConfirmPopup";
import { SilencedError } from "../../../exceptions/errors";

class Confirmation extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    show: PropTypes.bool,
    proceed: PropTypes.func,     // called when ok button is clicked.
    cancel: PropTypes.func,      // called when cancel button is clicked.
    dismiss: PropTypes.func,     // called when backdrop is clicked.
    omitOverflow: PropTypes.bool,
  };

  static defaultProps = {
    omitOverflow: false,
  };

  static childContextTypes = {
    // Enables critical path CSS rendering
    // https://github.com/kriasoft/isomorphic-style-loader
    insertCss: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      show : this.props.show
    };
  }

  getChildContext() {
    return {
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        const removeCss = styles.map(x => x._insertCss());
        return () => { removeCss.forEach(f => f()); };
      }
    };
  }

  render() {
    const {
      title,
      show,
      proceed,
      cancel,
      dismiss,
      omitOverflow,
    } = this.props;

    return (
      <Popup
        confirmPopup
        notShowCloser
        show={show}
        omitOverflow={omitOverflow}
        beforeClose={(resolve, reject) => {
          if (dismiss instanceof Function) {
            dismiss(reject);
          }

          resolve();
        }}
        onClose={() => {
          cancel(
            new SilencedError('Close')
          );
        }}
      >
        <ConfirmPopup
          title={title}
          cancel={() => {
            cancel(
              new SilencedError('Cancel')
            );
          }}
          proceed={proceed}
        />
      </Popup>
    )
  }
}

export default confirmable(Confirmation);
