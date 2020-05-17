import React  from 'react';
import classes from 'classnames';
import { Link } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './List.scss';
import Widget from '../../../../components/Widget';

const List = ({
  isFetching,
  hobbiesList,
  prevDisabledStatus,
  nextDisabledStatus,
  onPrevClick,
  onNextClick,
  filters,
  filterData,
  openCategoryPage,
  nofRecordsPerPage,
  nofRecordsPerPageDisabledStatus,
  changeNOFRecordsPerPage,
  canModerateAllHobbiesList,
}) => (
  <div className={s.root}>
    <ul className="breadcrumb">
      <li>
        <span className="text-muted">
          {I18n.t('administration.administration')}
        </span>
      </li>
      <li className="active">
        {I18n.t('administration.hobbies.hobbies')}
      </li>
    </ul>

    <h2>{I18n.t('administration.hobbies.categoriesOfHobbies')}</h2>

    <Widget
      title={
        <div>
          <div className="pull-right mt-n-xs">
            <Link
              className="btn btn-sm btn-inverse"
              to={`/administration/hobbies/new`}
            >
              {I18n.t('administration.hobbies.addCategory')}
            </Link>
          </div>

          <h4 className="mt-0 mb-0">
            <span className="fw-semi-bold">
              {I18n.t('administration.hobbies.categories')}
            </span>
          </h4>
        </div>
      }
    >
      <div className="table-responsive">
        <table
          className={
            classes(
              'table', {
                'table-striped': !!hobbiesList && !!hobbiesList.length,
              }
            )
          }
        >
          <colgroup>
            <col />
            <col />
          </colgroup>

          <thead>
            <tr>
              <th>{I18n.t('administration.hobbies.title')}</th>
              <th className="text-center">{I18n.t('administration.hobbies.forChildrens')}</th>
            </tr>
          </thead>

          <tbody>
          {
            hobbiesList && hobbiesList.map(({id, for_children, name}) => (
              <tr key={id}>
                <td>
                  <Link to={`/administration/hobbies/${id}`}>
                    {name}
                  </Link>
                </td>
                <td className="text-center">
                  {
                    (for_children && (
                      <i className="glyphicon glyphicon-ok-circle text-success" />
                    )) || (
                      <i className="glyphicon glyphicon-ban-circle text-danger" />
                    )
                  }
                </td>
              </tr>
            ))
          }

          {
            hobbiesList && ! hobbiesList.length && (
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
