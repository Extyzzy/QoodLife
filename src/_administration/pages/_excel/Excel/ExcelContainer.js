import React  from 'react';
import { connect } from 'react-redux';
import {I18n} from 'react-redux-i18n';
import Forbidden from '../../../../pages/_errors/Forbidden/Forbidden';

import {
  fetchAuthorizedApiRequest,
} from '../../../../fetch';

import {
  getQueryData,
} from '../../../../helpers/filter';

import  {
  actionIsAllowed,
} from '../../../../helpers/permissions';

import {appendToFormData} from '../../../../helpers/form';

import PaginatedTable from '../../../components/_tables/PaginatedTable/PaginatedTable';
import List from './Excel';
import update from 'immutability-helper';
import { withRouter } from 'react-router';

class ListContainer extends PaginatedTable {
  constructor(props, context) {
    super(props, context);

    this.hasFilter = true;
  }

  getLoadDataFetcher(filter) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const {
      activeTab,
    } = this.state;

    const queryData = getQueryData(filter);

    let url = `/v1/places/stored${(queryData ? `?${queryData}` : '')}&status=not-confirmed&excelUploaded=1`;

    if (activeTab === 'Visible') {
      url = `/v1/places/stored${(queryData ? `?${queryData}` : '')}&status=confirmed&excelUploaded=1`
    }

    if (activeTab === 'Requests') {
      url = `/v1/places/stored${(queryData ? `?${queryData}` : '')}&status=confirmed&excelUploaded=1&has-user=1`
    }

    return dispatch(
      fetchAuthorizedApiRequest(url,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        })
    );
  }

  confirmPendingAgent(userId){
    const {
      dispatch,
      accessToken,
      history
    } = this.props;

    dispatch(
      fetchAuthorizedApiRequest(`/v1/users/${userId}/accept-place-pending`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    )
      .then(response => {
        switch (response.status) {
          case 204:
            history.push('/administration/places');
            break;
          default:
            console.info('Error to switch moderated Status.')
        }
      })
  }

  resPendingAgent(userId) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    dispatch(
      fetchAuthorizedApiRequest(`/v1/users/${userId}/reject-place-pending`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    )
      .then(response => {
        switch (response.status) {
          case 204:

            this.setState({activeTab: 'Visible'}, () => this.loadInitialData({
              WITH_FILTER_DATA: + this.hasFilter,
            }));

            break;
          default:
            console.info('Error to switch moderated Status.')
        }
      })
  }

  onFileChange = e => {
    e.preventDefault();

    const {
      accessToken,
      dispatch,
    } = this.props;

    const {
      image,
    } = this.state;

    this.setState({uploading: true});
        dispatch(
          fetchAuthorizedApiRequest(`/v1/places/excel/import`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`
            },
            body: appendToFormData(
              new FormData(),
              {
                file: e.target.files[0],
                image: image ? {
                  source: image.source,
                  crop: image.crop,
                } : null,
              }
            )
          })
        )
          .then(response => {
            switch (response.status) {
              case 200:
                this.setState({
                  __file : true,
                  uploading: false
                });

                return response.json();

              default:
                return console.info("Error");
            }
          })
  };

  render() {
    const {
      permissions,
    } = this.props;

    if ( ! actionIsAllowed(permissions, {
      module: 'places',
      action: 'view-all-stored',
    })) {
      return (
        <Forbidden />
      );
    }

    const {
      nofRecordsPerPage,
      isFetching,
      __file,
      image,
      uploading,
      activeTab,
    } = this.state;

    return (
      <List
        filters={[
          {
            name: 'name',
            label: I18n.t('administration.table.name'),
            type: 'input',
          },
          {
            name: 'email',
            label: I18n.t('administration.table.email'),
            type: 'input',
          },
          {
            name: 'phoneNumber',
            label: I18n.t('administration.table.phone'),
            type: 'input',
          },
          {
            name: 'promoted',
            label: I18n.t('administration.table.promoted'),
            type: 'check',
            params: {
              checkboxLabel: 'Has active promotion',
            },
          },
          {
            name: 'createdAt',
            label: I18n.t('administration.table.createdAt'),
            type: 'date',
            params: {
              dateFormat: I18n.t('formats.date'),
              timeFormat: I18n.t('formats.time'),
            },
          },
        ]}
        onActiveTabChangeExcel={() => this.setState({activeTab: 'Excel'}, () => this.loadInitialData({
          WITH_FILTER_DATA: + this.hasFilter,
        }))}
        onActiveTabChangeVisible={() => this.setState({activeTab: 'Visible'}, () => this.loadInitialData({
          WITH_FILTER_DATA: + this.hasFilter,
        }))}
        onActiveTabChangeRequests={() => this.setState({activeTab: 'Requests'}, () => this.loadInitialData({
          WITH_FILTER_DATA: + this.hasFilter,
        }))}
        image={image}
        deleteImage={() => {
          this.setState({
            image: null,
          });
        }}
        cropImage={(i, crop, size) => {
          this.setState({
            image: update(image, {
              $apply: (img) => update(img, {
                crop: {
                  $set: crop,
                },
                size: {
                  $set: size,
                },
              }),
            }),
          });
        }}
        onImageChange={([image]) => {
          this.setState({
            image,
          });
        }}
        activeTab={activeTab}
        uploading={uploading}
        filterData={this.filterData}
        isFetching={isFetching}
        confirmPendingAgent={this.confirmPendingAgent.bind(this)}
        resPendingAgent={this.resPendingAgent.bind(this)}
        placesList={this.getActiveRecords()}
        prevDisabledStatus={this.canGetPrevRecords()}
        nextDisabledStatus={this.canGetNextRecords()}
        onPrevClick={this.getPrevRecords}
        onNextClick={this.getNextRecords}
        nofRecordsPerPage={nofRecordsPerPage}
        onFileChange={e => this.onFileChange(e)}
        __file={__file}
        nofRecordsPerPageDisabledStatus={
          this.canChangeNOFRecordsPerPage()
        }
        changeNOFRecordsPerPage={this.changeNOFRecordsPerPage}
        canManageAllPromotions={
          actionIsAllowed(permissions, {
            module: 'places',
            action: 'manage-all-promotions',
          })
        }
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    permissions: state.user.permissions,
  };
}

export default withRouter(connect(mapStateToProps)(ListContainer));
