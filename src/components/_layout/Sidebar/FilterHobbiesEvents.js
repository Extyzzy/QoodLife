import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { Scrollbars } from 'react-custom-scrollbars';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classes from 'classnames';
import s from './Sidebar.scss';
import {
  clearSelectedSidebarHobby,
  setSelectedSidebarHobby,
} from "../../../actions/navigation";

class FilterHobbiesEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hobbyList: null,
      open: true
    };
  }

  render() {
    const { open } = this.state;
    const {
      dispatch,
      eventsHobbies,
      selectedHobby,
      location,
    } = this.props;

    return (
      <div
        className={classes(s.calendarFilterContainer, s.group, {
          [s.open]: open,
          [s.profile]: location.pathname.indexOf('profile') > 0,
        })}
      >
        <a
          onClick={() => {
            this.setState({ open: !open }, () => {
                dispatch(clearSelectedSidebarHobby());
            });
          }}
        >
          {I18n.t('general.sidebar.tabFilters')}
        </a>

        {
          open && (
          <Scrollbars
            autoHeight={true}
            autoHeightMin={100}
            autoHeightMax={250}
            autoHide={true}
            autoHideTimeout={1000}
            autoHideDuration={200}
          >
            <ul>
              {
                eventsHobbies.map(data => {
                const active = data.id === selectedHobby;

                return (
                  <li className={classes(
                        s.filterList,
                        {[s.active]: active}
                      )}
                      key={data.id}
                      onClick={() =>  dispatch(
                        active
                          ? clearSelectedSidebarHobby()
                          : setSelectedSidebarHobby(data.id)
                      )}
                  >
                    {data.name}
                  </li>
                )})
              }
            </ul>
          </Scrollbars>
        )}
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    eventsHobbies: store.events.listHobbiesEvents,
    selectedHobby: store.navigation.selectedHobby,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(FilterHobbiesEvents)));
