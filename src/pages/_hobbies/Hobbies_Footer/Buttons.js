import React, { Component } from "react";
import {FaMinus} from "react-icons/lib/fa/index";
import {FaPlus} from "react-icons/lib/fa/index";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import WarningPopover from "../../../components/WarningPopover";

import {
  attachHobby,
  receiveattachHobby,
  receivedetachHobby,
  detachHobby,
} from "../../../actions/hobbies";
import {I18n} from "react-redux-i18n";

class Buttons extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      removeHobbyToUser: false,
      addHobbyToUser: false,
    };
  }

  componentWillUnmount() {
    if (this.addHobbyStatusFetcher instanceof Promise) {
      this.addHobbyStatusFetcher.cancel();
    }
  }

  redirectUser(){
    const { history } = this.props;

    return (
      <button onClick={() => {
          history.push('/login', {from: `hobbies/`});
      }}>
        <FaPlus />
      </button>
    )
  }

  render() {
    const {
      removeHobbyToUser,
      addHobbyToUser,
    } = this.state;

    const {
      isAuthenticated,
      isConfirmed,
      accessToken,
      dispatch,
      hobby,
      isActive,
      children,
    } = this.props;

    const childAudience = hobby.audience === 'children';

    const PlusButton = (
      <button onClick={() => {
        if ( ! addHobbyToUser) {
          this.setState({
            addHobbyToUser: true,
          }, () => {
            this.addHobbyStatusFetcher =
              dispatch(
                attachHobby(
                  accessToken,
                  hobby,
                  childAudience
                )
              );

            this.addHobbyStatusFetcher
              .then(() => {
                this.setState({
                  addHobbyToUser: false,
                }, () => {
                  dispatch(
                    receiveattachHobby(
                      hobby,
                      childAudience
                    )
                  );
                });
              });
          });
        }
      }}>
        {
          (addHobbyToUser && (
            <i className="icon-reload icon-spin" />
          )) || (
            <FaPlus />
          )
        }
      </button>
    );

    const MinusButton = (
      <button onClick={() => {
        if ( !removeHobbyToUser) {
          this.setState({
            removeHobbyToUser: true,
          }, () => {
            this.addHobbyStatusFetcher =
              dispatch(
                detachHobby(
                  accessToken,
                  hobby,
                  childAudience
                )
              );

            this.addHobbyStatusFetcher
              .then(() => {
                this.setState({
                  removeHobbyToUser: false,
                }, () => {
                  dispatch(
                    receivedetachHobby(
                      hobby,
                      childAudience,
                    )
                  );
                });
              });
          })
        }
      }}>
        {
          (removeHobbyToUser && (
            <i className="icon-reload icon-spin" />
          )) || (
            <FaMinus />
          )
        }
      </button>
    );

    const confirmAccountButton = (
      <WarningPopover>
        <button>
          {(isActive && (
            <FaMinus />
          )) || (
            <FaPlus />
          )}
        </button>
      </WarningPopover>
    );

    const notChildrenButton = (
      <WarningPopover fullName={I18n.t('general.footer.hobbiesPage.notChildren')}>
        <button>
          <FaPlus />
        </button>
      </WarningPopover>
    );

    if ( ! isAuthenticated) {
      return (
        this.redirectUser()
      )
    }

    if ( ! isConfirmed) {
      return (
        confirmAccountButton
      )
    }

    if ( hobby.audience === 'children' && ! children) {
      return (
        notChildrenButton
      )
    }

    return (
      !isActive && (
        PlusButton
      )) || (
        MinusButton
      )
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    user: state.user,
    isConfirmed: state.auth.isAuthenticated? state.user.confirmed : false,
    isAuthenticated: state.auth.isAuthenticated,
  };
}

export default withRouter(connect(mapStateToProps)(Buttons));
