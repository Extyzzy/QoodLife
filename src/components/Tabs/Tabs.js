import classes from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Tabs.scss';
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {I18n} from "react-redux-i18n";
import WarningPopover from "../WarningPopover";

class ViewModeSwitcher extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        content: PropTypes.any.isRequired,
        tabSupliments: PropTypes.any,
      })
    ),
    activeItemIndex: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    activeItemIndex: 0,
    isMobile: false,
    add: false,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      fromHistory: this.props.historyRole,
    }
  }

  content() {
    const {
      items,
      activeItemIndex,
      add,
      user,
      historyRole,
    } = this.props;

    const {
      fromHistory
    }= this.state;

    const admin = add && user.roles.filter(data => data.code === 'admin');

    if (fromHistory && !admin.length) {
      return  items.find(data => data.code === historyRole).content;
    }

    return items[activeItemIndex] ? items[activeItemIndex].content : null;
  }

  render() {
    const {
      items,
      activeItemIndex,
      onChange,
      className,
      isMobile,
      history,
      add,
      user,
      historyRole,
    } = this.props;

    const {
      fromHistory
    }= this.state;

    const admin = add && user.roles.filter(data => data.code === 'admin');

    return (
      <div className={classes(s.root, className)}>
        <div className={s.tabsList}>
          {
            items.map((tab, i) => {

              let active = i === activeItemIndex;

              if (fromHistory && !admin.length) {
                active = tab.code === historyRole;
              }

              return (
                <a
                  key={i}
                  className={classes(
                    s.tab,
                    {[s.active]: active},
                    {[s.mobile]: isMobile},
                  )}
                  onClick={() => {
                    if (user.placePending === 'pending' && tab.code === 'place') {
                      return history.push(`/profile/settings/place`, {data: 'agent'})
                    }

                    if (user.profPending === 'pending' && tab.code === 'professional') {
                      return history.push(`/profile/settings/professional`, {data: 'professional'})
                    }

                    this.setState({fromHistory: false}, () => onChange(i));
                  }}
                >
                  {tab.title}
                  {tab.tabSupliments && (
                    <p className={s.notificationPoint}>{tab.tabSupliments}</p>
                  )}
                </a>
              );
            })
          }

          {
            add
            && !admin.length
            && ( !user.profDetails || !user.placeDetails )
            && (
              <div className={s.add}>
                {
                  (!user.confirmed && (
                    <WarningPopover fullName={I18n.t('general.components.accountConfirmPopover')}>
                      <span className="icon-plus" />
                    </WarningPopover>
                  )) || (
                    <div>
                      <span className="icon-plus" />
                      <div className={s.redirect}>
                        {
                          !user.placeDetails &&(
                            <div onClick={() => history.push(`/profile/settings/place`, {data: 'agent'})}>
                              {I18n.t('general.header.place')}
                            </div>
                          )
                        }

                        {
                          !user.profDetails && (
                            <div onClick={() => history.push(`/profile/settings/professional`, {data: 'professional'})}>
                              {I18n.t('general.header.professional')}
                            </div>
                          )
                        }
                      </div>
                    </div>
                  )
                }

              </div>
            )
          }

        </div>
        <div className={s.content}>
          {this.content()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(ViewModeSwitcher)));
