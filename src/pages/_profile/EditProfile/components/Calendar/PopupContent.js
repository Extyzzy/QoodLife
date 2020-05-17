import React, { Component } from "react";
import {connect} from "react-redux";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./PopupContent.scss";
import { withRouter } from 'react-router';
import {I18n} from 'react-redux-i18n';
import Select from "react-select";
import {fetchAuthorizedApiRequest} from "../../../../../fetch";
import {InternalServerError} from "../../../../../exceptions/http";
import {appendToFormData} from "../../../../../helpers/form";
import WarningPopover from "../../../../../components/WarningPopover";
import classes from "classnames";
import {
  updateCalendarFilterUser,
} from "../../../../../actions/user";

class PopupContent extends Component {
  constructor(props, context) {
    super(props, context);

    const {filters} = this.props.calendar;

    this.state = {
      __filters: filters.length ? filters.map(({id,name}) => ({
          value: id,
          label: name,
        }))
        : null,
      isFetching: true,
      __filterOptions: null,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {

    const {dispatch, accessToken} = this.props;

    dispatch(
      fetchAuthorizedApiRequest(`/v1/events/calendar/filters`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    )
      .then(response => {
        switch(response.status) {
          case 200:
            return response.json();
          default:
            return Promise.reject(
              new InternalServerError()
            );
        }
      })
      .then(data =>
        this.setState({
          isFetching: false,
          __filterOptions: data.list.map(({
             id: value,
             name: label,
           }) => ({value, label}))
        })
      )
    }

  submitFormData() {
    const {
      dispatch,
      accessToken,
      onSuccess
    } = this.props;

    const {
      __filters,
    } = this.state;

    this.setState({isFetching: true});
    dispatch(
      fetchAuthorizedApiRequest(`/v1/places/calendar/filters`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: appendToFormData(
          new FormData(),
          {
            filters: __filters.map(data => data.value)
          }
        )
      }))
      .then(response => {
        switch(response.status) {
          case 200:

            return onSuccess();

          default:

            return Promise.reject(
              new InternalServerError()
            );
        }
      })
      .then(() => {
        const filtres = __filters.map(({value,label}) => ({
          id: value,
          name: label,
        }));

          dispatch(
            updateCalendarFilterUser(filtres)
          )
        }
      )
  }

  onSubmit(e) {
    e.preventDefault();
    const { isFetching } = this.state;

    if (isFetching) {
      return false;
    }

    this.submitFormData();
  }

  render() {
    const {
      __filters,
      __filterOptions,
      isFetching,
    } = this.state;

    return (
      <form
        className={s.root}
        onSubmit={this.onSubmit}
      >
          <div className="form-group">
            <label>
              {I18n.t('general.components.multipleAdd.filtresCalendar')}  <span className={s.required}>*</span>
            </label>

            <div className="form-block">
              <Select
                value={__filters}
                options={__filterOptions}
                onChange={ __filters => this.setState({__filters})}
                multi
              />
            </div>
          </div>

          {
            ( __filters &&__filters.length &&(
              <button
                className={classes('btn btn-success', {
                  [s.disabled]: isFetching
                })}
                onClick={(e) => {
                  this.onSubmit(e);
                }}
                disabled={isFetching}
              >
                {I18n.t('general.elements.submit')}
              </button>
            )) || (
              <WarningPopover fullName= {I18n.t('general.components.multipleAdd.warning')}>
                <span className='btn btn-red'>
                  {I18n.t('general.elements.submit')}
                </span>
              </WarningPopover>
            )
          }
        </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    calendar: state.user.placeDetails.calendar,
    accessToken: state.auth.accessToken,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(PopupContent)));
