import React  from 'react';
import {Alert} from "react-bootstrap";
import {Link} from 'react-router-dom';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Create.scss';

import ErrorsList from '../../../../components/ErrorsList/ErrorsList';
import Widget from '../../../../components/Widget';

import {I18n} from 'react-redux-i18n';
const Create = ({
  activeBreadcrumbItem,
  widgetTitle,
  submitButtonLabel,
  submitButtonLoadingLabel,
  eventDetails: {
    id: eventId,
    title,
  },
  onSinceChange,
  onUntilChange,
  untilIsValidDate,
  __since,
  __until,
  isFetching,
  errors,
  onSubmit,
}) => (
  <div className={s.root}>
    <ul className="breadcrumb">
      <li>
        <span className="text-muted">
          {I18n.t('administration.administration')}
        </span>
      </li>
      <li>
        <Link to="/administration/events">
          {I18n.t('administration.menuDropDown.events')}
        </Link>
      </li>
      <li>
        <Link to={`/administration/events/${eventId}/promotions`}>
          {I18n.t('administration.promotions')}
        </Link>
      </li>
      <li className="active">{activeBreadcrumbItem}</li>
    </ul>

    <h2>
      {I18n.t('administration.promote')}
      {I18n.t('administration.menuDropDown.fevent')}
    </h2>
    <h4>{title}</h4>

    <div className="row">
      <div className="col-sm-8">
        <Widget
          title={
            <div>
              <h5 className="mt-0 mb-0">
                {widgetTitle}
              </h5>
            </div>
          }
        >
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="control-label">
                {I18n.t('administration.form.since')}
              </label>

              <Datetime
                value={__since}
                dateFormat={I18n.t('formats.date')}
                timeFormat={I18n.t('formats.time')}
                onChange={onSinceChange}
                readOnly={true}
              />
            </div>

            <div className="form-group">
              <label className="control-label">
                {I18n.t('administration.form.until')}
              </label>

              <Datetime
                value={__until}
                dateFormat={I18n.t('formats.date')}
                timeFormat={I18n.t('formats.time')}
                onChange={onUntilChange}
                readOnly={true}
                isValidDate={untilIsValidDate}
              />
            </div>

            {
              errors && (
                <Alert className="alert-sm" bsStyle="danger">
                  <ErrorsList messages={errors} />
                </Alert>
              )
            }

            <div className="form-group footer">
              <button
                className="btn btn-inverse"
                type="submit"
                disabled={isFetching}
              >
                {isFetching ? submitButtonLoadingLabel : submitButtonLabel}
              </button>
            </div>
          </form>
        </Widget>
      </div>
    </div>
  </div>
);

export default withStyles(s)(Create);
