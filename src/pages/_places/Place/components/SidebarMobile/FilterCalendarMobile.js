import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { Scrollbars } from 'react-custom-scrollbars';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classes from 'classnames';
import s from './SidebarMobile.scss';
import {
  setFilterCalendar,
  clearFilterCalendar
} from '../../../../../actions/navigation';

class FilterCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
  }

  setFilterCalendar = id => {
    const { dispatch, sideBar } = this.props;
    
    sideBar();
    dispatch(setFilterCalendar(id));
  };

  render() {
    const { calendarPlace, dispatch, activeFilter, location } = this.props;
    const { open } = this.state;

    return (
      <div
        className={classes(s.calendarFilterContainer, s.group, {
          [s.open]: open,
          [s.profile]: location.pathname.indexOf('profile') > 0
        })}
      >
        <a
          onClick={() => {
            this.setState({ open: !open }, () =>
              dispatch(clearFilterCalendar())
            );
          }}
        >
          {I18n.t('general.sidebar.calendarFilters')}
        </a>

        {open && (
          <Scrollbars
            autoHeight={true}
            autoHeightMin={100}
            autoHeightMax={250}
            autoHide={true}
            autoHideTimeout={1000}
            autoHideDuration={200}
          >
            <ul>
              {calendarPlace.filters.map(data => (
                <li
                  className={classes(s.filterList, {
                    [s.active]: activeFilter === data.id
                  })}
                  key={data.id}
                  onClick={() => this.setFilterCalendar(data.id)}
                >
                  {data.name}
                </li>
              ))}
            </ul>
          </Scrollbars>
        )}
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    activeFilter: store.navigation.selectedFilterCalendar
  };
}

export default withRouter(
  connect(mapStateToProps)(withStyles(s)(FilterCalendar))
);
