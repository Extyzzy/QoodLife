import React  from 'react';
import classes from 'classnames';
import {Link} from 'react-router-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './List.scss';

import Widget from '../../../../components/Widget';
import FilterGenerator from '../../../components/_filters/FilterGenerator';
import DateTimeCell from '../../../components/_tables/DateTimeCell';

import {I18n} from 'react-redux-i18n';
const List = ({
  isFetching,
  professionalsList,
  prevDisabledStatus,
  nextDisabledStatus,
  onPrevClick,
  onNextClick,
  filters,
  filterData,
  nofRecordsPerPage,
  nofRecordsPerPageDisabledStatus,
  changeNOFRecordsPerPage,
  canManageAllPromotions,
}) => (
  <div className={s.root}>
    <ul className="breadcrumb">
      <li>
        <span className="text-muted">
          {I18n.t('administration.administration')}
        </span>
      </li>
      <li className="active">
        {I18n.t('administration.menuDropDown.professionals')}
      </li>
    </ul>

    <h2>{I18n.t('administration.menuDropDown.professionals')}</h2>

    <Widget
      title={
        <div>
          <h5 className="mt-0 mb-0">
            {I18n.t('administration.menuDropDown.professionals')}
            <span className="fw-semi-bold">
              {I18n.t('administration.list')}
            </span>
            <Link
              className="btn btn-sm btn-inverse pull-right"
              to={`/administration/professionals/authorize-pros`}
            >
              Imputerniciri
            </Link>
          </h5>
        </div>
      }
    >
      <div className="row">
        <div className="col-sm-8">
          <FilterGenerator
            filters={filters}
            filterData={filterData}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table
          className={
            classes(
              'table', {
                'table-striped': !!professionalsList && !!professionalsList.length,
              }
            )
          }
        >
          <colgroup>
            <col style={{width: '1px'}} />
            <col />
            <col />
            <col />
            <col />
            <col style={{width: '1px'}} />
            <col />

            {
              canManageAllPromotions && (
                <col style={{width: '1px'}} />
              )
            }
            <col style={{width: '1px'}} />
          </colgroup>

          <thead>
          <tr>
            <th>Nº</th>
            <th>{I18n.t('administration.table.name')}</th>
            <th>{I18n.t('administration.table.position')}</th>
            <th>{I18n.t('administration.table.email')}</th>
            <th>{I18n.t('administration.table.phone')}</th>
            <th>{I18n.t('administration.table.promoted')}</th>
            <th>{I18n.t('administration.table.createdAt')}</th>
            <th></th>

            {
              canManageAllPromotions && (
                <th />
              )
            }
          </tr>
          </thead>
          <tbody>
          {
            professionalsList && professionalsList.map(({
              id,
              no,
              firstName,
              lastName,
              workingPlaces,
              email,
              phoneNumber,
              promoted,
              createdAt,
            }) => (
              <tr key={id}>
                <td>{no}</td>
                <td>{firstName} {lastName}</td>
                <td>
                  {
                    (!!workingPlaces.length && (
                      `${workingPlaces[0].position}, ${workingPlaces[0].institution}`
                    )) || (
                      '--'
                    )
                  }
                </td>
                <td>
                  {email}
                </td>
                <td className="text-center">
                  {
                    (phoneNumber !== null && (
                      phoneNumber
                    )) || (
                      '-'
                    )
                  }
                </td>
                <td className="text-center">
                  {
                    (promoted && (
                      <i className="glyphicon glyphicon-ok-circle text-success" />
                    )) || (
                      <i className="glyphicon glyphicon-ban-circle text-danger" />
                    )
                  }
                </td>
                <DateTimeCell timestamp={createdAt} />
                {
                  canManageAllPromotions && (
                    <td>
                      <Link
                        to={`/administration/professionals/${id}/promotions`}
                        className={
                          classes(
                            'btn btn-default',
                            s.actionBtn
                          )
                        }
                        title="Promotion Intervals"
                      >
                        <i className="glyphicon glyphicon-ban-circle" />
                      </Link>
                    </td>
                  )
                }
                <td>
                  <Link
                    className={
                      classes(
                        'btn btn-default',
                        s.actionBtn
                      )
                    }
                    title="Professional Page"
                    to={`/professionals/${id}`}
                  >
                  <i className="glyphicon glyphicon glyphicon-chevron-right"  />
                  </Link>
                </td>
              </tr>
            ))
          }

          {
            professionalsList && ! professionalsList.length && (
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
