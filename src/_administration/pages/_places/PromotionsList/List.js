import React  from 'react';
import classes from 'classnames';
import { Link } from 'react-router-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './List.scss';

import Widget from '../../../../components/Widget';
import DateTimeCell from '../../../components/_tables/DateTimeCell';

import {I18n} from 'react-redux-i18n';
const List = ({
  isFetching,
  placeDetails: {
    id: placeId,
    name,
  },
  promotionsList,
  prevDisabledStatus,
  nextDisabledStatus,
  onPrevClick,
  onNextClick,
  nofRecordsPerPage,
  nofRecordsPerPageDisabledStatus,
  changeNOFRecordsPerPage,
  canManagePromotions,
  deleteInterval,
}) => (
  <div className={s.root}>
    <ul className="breadcrumb">
      <li>
        <span className="text-muted">
          {I18n.t('administration.administration')}
        </span>
      </li>
      <li>
        <Link to="/administration/places">
          {I18n.t('administration.menuDropDown.places')}
        </Link>
      </li>
      <li className="active">{I18n.t('administration.promotions')}</li>
    </ul>

    <h2>
      {I18n.t('administration.menuDropDown.place')}
      {I18n.t('administration.promotions')}
    </h2>
    <h4>{name}</h4>

    <Widget
      title={
        <div>
          {
            canManagePromotions && (
              <div className="pull-right mt-n-xs">
                <Link
                  to={`/administration/places/${placeId}/promotions/create`}
                  className="btn btn-sm btn-inverse"
                >
                  {I18n.t('administration.intervals')}
                </Link>
              </div>
            )
          }

          <h5 className="mt-0 mb-0">
              {I18n.t('administration.promotion')}
            <span className="fw-semi-bold">
              {I18n.t('administration.form.create')}
            </span>
          </h5>
        </div>
      }
    >
      <div className="table-responsive">
        <table
          className={
            classes(
              'table', {
                'table-striped': !!promotionsList && !!promotionsList.length,
              }
            )
          }
        >
          <colgroup>
            <col style={{width: '1px'}} />
            <col />
            <col />
            <col />

            {
              canManagePromotions && (
                <col style={{width: '1px'}} />
              )
            }
          </colgroup>

          <thead>
            <tr>
              <th>Nº</th>
              <th>{I18n.t('administration.table.since')}</th>
              <th>{I18n.t('administration.table.until')}</th>
              <th>{I18n.t('administration.table.createdAt')}</th>

              {
                canManagePromotions && (
                  <th/>
                )
              }
            </tr>
          </thead>

          <tbody>
          {
            promotionsList && promotionsList.map(({
              id,
              no,
              since,
              until,
              createdAt,
              updatedAt,
            }) => (
              <tr key={id}>
                <td>{ no }</td>
                <DateTimeCell timestamp={since} />
                <DateTimeCell timestamp={until} />
                <DateTimeCell timestamp={createdAt} />
                {
                  canManagePromotions && (
                    <td style={{whiteSpace: 'nowrap'}}>
                      <Link
                        to={`/administration/places/${placeId}/promotions/${id}/edit`}
                        className={
                          classes(
                            'btn btn-warning',
                            s.actionBtn
                          )
                        }
                        title="Edit Interval"
                      >
                        <i className="glyphicon glyphicon-edit" />
                      </Link>

                      <button
                        className={
                          classes(
                            'btn btn-danger',
                            s.actionBtn
                          )
                        }
                        title="Remove Interval"
                        onClick={e => {
                          e.preventDefault();

                          deleteInterval(id);
                        }}
                      >
                        <i className="glyphicon glyphicon-remove" />
                      </button>
                    </td>
                  )
                }
              </tr>
            ))
          }

          {
            promotionsList && ! promotionsList.length && (
              <tr>
                <td colSpan="100">
                  {I18n.t('administration.table.emptyList')}
                </td>
              </tr>
            )
          }

          {
            isFetching && (
              <tr>
                <td colSpan="100">
                    {I18n.t('general.elements.loading')}
                </td>
              </tr>
            )
          }
          </tbody>
        </table>
      </div>

      <div>
        <button
          className="btn btn-default"
          disabled={prevDisabledStatus}
          onClick={onPrevClick}
        >
          <i className="glyphicon glyphicon-chevron-left" />
        </button>

        <button
          className="btn btn-default"
          disabled={nextDisabledStatus}
          onClick={onNextClick}
        >
          <i className="glyphicon glyphicon-chevron-right" />
        </button>

        <select
          className={s.nofRecordsPPSelector}
          value={nofRecordsPerPage}
          disabled={nofRecordsPerPageDisabledStatus}
          onChange={({target: {value}}) => {
            changeNOFRecordsPerPage(parseInt(value, 10));
          }}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </Widget>
  </div>
);

export default withStyles(s)(List);
