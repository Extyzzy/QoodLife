import React  from 'react';
import classes from 'classnames';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './List.scss';
import Widget from '../../../../components/Widget';
import FilterGenerator from '../../../components/_filters/FilterGenerator';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';

const List = ({
  isFetching,
  groupsList,
  prevDisabledStatus,
  nextDisabledStatus,
  onPrevClick,
  onNextClick,
  filters,
  filterData,
  nofRecordsPerPage,
  nofRecordsPerPageDisabledStatus,
  changeNOFRecordsPerPage,
}) => (
  <div className={s.root}>
    <ul className="breadcrumb">
      <li>
        <span className="text-muted">
          {I18n.t('administration.administration')}
        </span>
      </li>
      <li className="active">
        {I18n.t('administration.menuDropDown.groups')}
      </li>
    </ul>

    <h2>{I18n.t('administration.menuDropDown.groups')}</h2>

    <Widget
      title={
        <div>
          <h5 className="mt-0 mb-0">
              {I18n.t('administration.menuDropDown.groups')}
            <span className="fw-semi-bold">
              {I18n.t('administration.list')}
            </span>
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
                'table-striped': !!groupsList && !!groupsList.length,
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
            <col />
            <col style={{width: '1px'}} />
          </colgroup>

          <thead>
            <tr>
              <th>Nº</th>
              <th>{I18n.t('administration.table.name')}</th>
              <th>{I18n.t('administration.table.location')}</th>
              <th>{I18n.t('administration.table.since')}</th>
              <th>{I18n.t('administration.table.until')}</th>
              <th>{I18n.t('administration.table.createdAt')}</th>
              <th/>
            </tr>
          </thead>

          <tbody>
          {
            groupsList && groupsList.map(data => {
              const {
                id,
                no,
                name,
                location,
                event,
                since,
                until,
                createdAt,
              } = data;

              return (
                <tr key={id}>
                  <td>{no}</td>
                  <td>{name}</td>
                  <td>
                    {
                      (location !== null && (
                        location.label
                      )) || (
                        event.location.label
                      )
                    }
                  </td>
                  <td>
                    {
                      (event == null && (
                        moment(since, 'X').format(I18n.t('formats.date'))
                      )) || (
                        moment(event.since, 'X').format(I18n.t('formats.date'))
                      )
                    }
                  </td>
                  <td>
                    {
                      (event == null && (
                        moment(until, 'X').format(I18n.t('formats.date'))
                      )) || (
                        moment(event.until, 'X').format(I18n.t('formats.date'))
                      )
                    }
                  </td>
                  <td>{moment(createdAt, 'X').format(I18n.t('formats.date'))}</td>
                  <td>
                    <Link
                      className={
                        classes(
                          'btn btn-default',
                          s.actionBtn
                        )
                      }
                      title="Group Page"
                      to={{
                        pathname: `/groups/edit/${id}`,
                        state: {data: data}
                      }}
                    >
                      <i className="glyphicon glyphicon glyphicon-chevron-right"/>
                    </Link>
                  </td>
                </tr>
              )
            })
          }

          {
            groupsList && ! groupsList.length && (
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
