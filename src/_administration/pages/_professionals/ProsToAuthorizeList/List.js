import React  from 'react';
import classes from 'classnames';
import { Link } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './List.scss';
import Widget from '../../../../components/Widget';

const List = ({
  isFetching,
  professionalsList,
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
  canModerateAllProfessionals,
}) => (
  <div className={s.root}>
    <ul className="breadcrumb">
      <li>
        <span className="text-muted">
          {I18n.t('administration.administration')}
        </span>
      </li>
      <li>
        <Link to="/administration/professionals">
          {I18n.t('administration.menuDropDown.professionals')}
        </Link>
      </li>
      <li className="active">
        received authorization
      </li>
    </ul>

    <h2>Professionals That received authorization</h2>

    <Widget
      title={
        <div>
          <h4 className="mt-0 mb-0">
            <span className="fw-semi-bold">
              {I18n.t('administration.list')}
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
            <col />
            <col style={{width: '1px'}} />
          </colgroup>

          <thead>
            <tr>
              <th>Nº</th>
              <th>{I18n.t('administration.table.name')}</th>
              <th>{I18n.t('administration.table.position')}</th>
              <th>{I18n.t('administration.table.email')}</th>
              <th>{I18n.t('administration.table.phone')}</th>
              <th>Invited By</th>
              <th/>
            </tr>
          </thead>

          <tbody>
          {
            professionalsList && professionalsList.map(({
              category,
            }) => (
              <tr key={category.id}>
                <td>
                  <Link to={`/administration/hobbies/${category.id}`}>
                    {category.name}
                  </Link>
                </td>
                <td className="text-center">
                  {
                    (category.for_children && (
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
