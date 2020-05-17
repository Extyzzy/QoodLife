import React  from 'react';
import classes from 'classnames';
import {Link} from 'react-router-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './List.scss';
import Widget from '../../../../components/Widget';
import FilterGenerator from '../../../components/_filters/FilterGenerator';
import DateTimeCell from '../../../components/_tables/DateTimeCell';
import {I18n} from 'react-redux-i18n';
import {confirm} from "../../../../components/_popup/Confirm";

const List = ({
  isFetching,
  usersList,
  prevDisabledStatus,
  nextDisabledStatus,
  onPrevClick,
  onNextClick,
  filters,
  filterData,
  nofRecordsPerPage,
  nofRecordsPerPageDisabledStatus,
  changeNOFRecordsPerPage,
  canManageAllSuspensions,
  confirmPending,
  resPending,
  confirmPendingAgent,
  resPendingAgent,
  activateSpecialOffer,
  activateOffer,
}) => (
  <div className={s.root}>
    <ul className="breadcrumb">
      <li>
        <span className="text-muted">
          {I18n.t('administration.administration')}
        </span>
      </li>
      <li className="active">
        {I18n.t('administration.menuDropDown.users')}
      </li>
    </ul>

    <h2>{I18n.t('administration.menuDropDown.users')}</h2>

    <Widget
      title={
        <div>
          <h5 className="mt-0 mb-0">
            {I18n.t('administration.menuDropDown.users')}
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

      <div className="row">
        <div className="col-sm-8">
          {
            activateOffer ?
            I18n.t('administration.specialOfferActivated') :
            I18n.t('administration.specialOfferActivate')
          }
          {
            (
              !activateOffer &&(
                <button
                  onClick={() => {
                    confirm(
                      `${I18n.t('administration.specialOffer')}`)
                      .then(() => {
                        activateSpecialOffer()
                      })
                  }}
                  className={
                    classes(
                      'btn btn-default',
                      s.actionBtnActivate,
                    )
                  }
                >
                  <i className="glyphicon glyphicon-ok-circle text-success"/>
                </button>
              )
            )
          }

        </div>
      </div>

      <div className="table-responsive">
        <table
          className={
            classes(
              'table', {
                'table-striped': !!usersList && !!usersList.length,
              }
            )
          }
        >
          <colgroup>
            <col style={{width: '1px'}} />
            <col />
            <col />
            <col />
            <col style={{width: '1px'}} />
            <col style={{width: '1px'}} />
            <col style={{width: '1px'}} />
            <col style={{width: '1px'}} />
            <col style={{width: '1px'}} />
            <col />

            {
              canManageAllSuspensions && (
                <col style={{width: '1px'}} />
              )
            }
          </colgroup>

          <thead>
            <tr>
              <th>Nº</th>
              <th>{I18n.t('administration.table.name')}</th>
              <th>{I18n.t('administration.table.email')}</th>
              <th>{I18n.t('administration.table.role')}</th>
              <th>{I18n.t('administration.table.pendingProf')}</th>
              <th className={s.agent}>{I18n.t('administration.table.pendingAgent')}</th>
              <th>{I18n.t('administration.table.promoted')}</th>
              <th />
              <th />
              <th />
              {
                canManageAllSuspensions && (
                  <th/>
                )
              }
            </tr>
          </thead>
          <tbody>
          {
            usersList && usersList.map(data => {
              const {
                id,
                no,
                email,
                fullName,
                roles,
                suspended,
                createdAt,
                profPending,
                placePending,
              } = data;

              return (
                <tr key={id}>
                  <td>{no}</td>
                  <td>{fullName}</td>
                  <td>{email}</td>
                  <td>{roles.map(role => role.name).join(', ')}</td>
                  {
                    (profPending === 'pending' && (
                      <td className={s.inlineCell}>
                        <button
                          onClick={() => {
                            confirm(
                              `${I18n.t('professionals.confirmAddProfessional')} ${fullName || ''} ?`)
                              .then(() => {
                                confirmPending(id)
                              })
                          }}
                          className={
                            classes(
                              'btn btn-default',
                              s.actionBtn,
                              {[s.userReq]: profPending === 'pending'}
                            )
                          }
                        >
                          <i className="glyphicon glyphicon-ok-circle text-success"/>
                        </button>
                        <button
                          onClick={() => {
                            confirm(
                              `${I18n.t('professionals.confirmRespinsProfessional')} ${fullName || ''} ?`)
                              .then(() => {
                                resPending(id)
                              })
                          }}
                          className={classes(
                            'btn btn-default',
                            s.actionBtn,
                          )}
                        >
                          <i className="glyphicon glyphicon-ban-circle"/>
                        </button>
                        <Link
                          className={
                            classes(
                              'btn btn-default',
                              s.actionBtn
                            )
                          }
                          title="Professional Page"
                          to={{
                            pathname: `/administration/users/professional/${id}`,
                            state: {data: data.profDetails}
                          }}
                        >
                          <i className="glyphicon glyphicon glyphicon-chevron-right"/>
                        </Link>
                      </td>
                    )) || (profPending === 'ok' &&(
                      <td>
                        <Link
                          className={
                            classes(
                              'btn btn-default',
                              s.actionBtn
                            )
                          }
                          title="Professional Page"
                          to={{
                            pathname: `/administration/users/professional/${id}`,
                            state: {data: data.profDetails}
                          }}
                        >
                          <i className="glyphicon glyphicon glyphicon-chevron-right"/>
                        </Link>
                      </td>
                    )) || (
                      <td/>
                    )
                  }

                  {
                    (placePending === 'pending' && (
                      <td className={s.inlineCell}>
                        <button
                          onClick={() => {
                            confirm(
                              `${I18n.t('agent.confirmAddAgent')} ${fullName || ''} ?`)
                              .then(() => {
                                confirmPendingAgent(id)
                              })
                          }}
                          className={
                            classes(
                              'btn btn-default',
                              s.actionBtn,
                              {[s.userReq]: placePending === 'pending'}
                            )
                          }
                        >
                          <i className="glyphicon glyphicon-ok-circle text-success"/>
                        </button>
                        <button
                          onClick={() => {
                            confirm(
                              `${I18n.t('agent.confirmRespinsAgent')} ${fullName || ''} ?`)
                              .then(() => {
                                resPendingAgent(id)
                              })
                          }}
                          className={classes(
                            'btn btn-default',
                            s.actionBtn,
                          )}
                        >
                          <i className="glyphicon glyphicon-ban-circle"/>
                        </button>
                        <Link
                          className={
                            classes(
                              'btn btn-default',
                              s.actionBtn
                            )
                          }
                          title="Place Page"
                          to={{
                            pathname: `/administration/users/place/${id}`,
                            state: {data: data.placeDetails}
                          }}
                        >
                          <i className="glyphicon glyphicon glyphicon-chevron-right"/>
                        </Link>
                      </td>
                    )) || (placePending === 'ok' &&(
                      <td>
                        <Link
                          className={
                            classes(
                              'btn btn-default',
                              s.actionBtn
                            )
                          }
                          title="Professional Page"
                          to={{
                            pathname: `/administration/users/place/${id}`,
                            state: {data: data.placeDetails}
                          }}
                        >
                          <i className="glyphicon glyphicon glyphicon-chevron-right"/>
                        </Link>
                      </td>
                    )) || (
                      <td/>
                    )
                  }

                  <td className="text-center">
                    {
                      (suspended && (
                        <i className="glyphicon glyphicon-ban-circle text-danger"/>
                      )) || (
                        <i className="glyphicon glyphicon-ok-circle text-success"/>
                      )
                    }
                  </td>
                  <DateTimeCell timestamp={createdAt}/>
                  {
                    canManageAllSuspensions && (
                      <td>
                        <Link
                          to={`/administration/users/${id}/suspensions`}
                          className={
                            classes(
                              'btn btn-default',
                              s.actionBtn
                            )
                          }
                          title="Suspensions List"
                        >
                          <i className="glyphicon glyphicon-ban-circle"/>
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
                      title="User Page"
                      to={`/member/${id}`}
                    >
                      <i className="glyphicon glyphicon glyphicon-chevron-right"/>
                    </Link>
                  </td>
                </tr>
              )
            })
          }

          {
            usersList && ! usersList.length && (
              <tr>
                <td colSpan="100">
                  {I18n.t('administration.table.createdAt')}
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
