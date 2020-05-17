import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ConfirmPopup.scss';
import {FaCheck} from "react-icons/lib/fa/index";
import {FaClose} from "react-icons/lib/fa/index";

class DeletePopup extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    cancel: PropTypes.func.isRequired,
    proceed: PropTypes.func.isRequired,
  };

  render() {
    const {
      title,
      cancel,
      proceed,
    } = this.props;

    return (
      <div className={s.root}>
        <div className={s.title}>
          {title}
        </div>

        <div className={s.buttons}>
          <button
            className={s.cardButton}
            onClick={proceed}
          >
          <FaCheck size={20}/>
          </button>

          <button
            className={s.removeButton}
            onClick={cancel}
          >
           <FaClose size={20}/>
          </button>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(DeletePopup);
