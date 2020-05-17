import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ConfirmPopup.scss';
import {FaCheck} from "react-icons/lib/fa/index";
import {FaPlus} from "react-icons/lib/fa/index";
import {setPolicyPrivateData} from "../../actions/app";
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { MOBILE_VERSION } from '../../actions/app';
import classes from 'classnames';

class Confirmation extends Component {
  render() {
    const {
      dispatch,
      history,
      policy,
      UIVersion
    } = this.props;

    if ( policy ) {
    return (
      <div  className={classes(s.root, {
        [s.rootMobile]: UIVersion === MOBILE_VERSION,
      })}>
        <div className={s.title}>
          This site uses cookies to improve your user experience. By using this site you agree to these cookies being set. To find out more see our
          <a onClick={() => {history.push('/policies/privacy-policy')}}> Privacy policy</a>.
        </div>
        <div className={s.buttons}>
        <div onClick={() => {
          localStorage.setItem('POLICY', 'true');
            dispatch(
              setPolicyPrivateData(false)
            )}
          } className={s.accept}>
          <FaCheck />
        </div>

        <div onClick={() => {
          localStorage.setItem('POLICY', 'false');
            dispatch(
              setPolicyPrivateData(false)
            )}
          } className={s.reject}>
          <FaPlus  />
        </div>
        </div>

      </div>
    );
    } else {
      return (
        <div />
        )
    }
  }
}

function mapStateToProps(state) {
  return {
    policy: state.app.policy,
    UIVersion: state.app.UIVersion,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(Confirmation)));
