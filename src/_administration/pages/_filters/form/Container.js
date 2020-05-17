import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { appendToFormData } from '../../../../helpers/form';
import View from './View';

import { fetchAuthorizedApiRequest } from '../../../../fetch';

import {
  UnprocessableEntity,
  InternalServerError
} from '../../../../exceptions/http';

class Container extends Component {
  constructor(props, context) {
    super(props, context);

    const { state } = this.props.location;

    this.state = {
      name: state ? state.filter.name : '',
      defaultName: state && state.filter.allNames.name_ro ? state.filter.allNames.name_ro : '',
      filter: state ? state.filter : null,
      errors: null,
      isFetching: false,
      isLoaded: false,
      editMode: false
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { filterId }
      }
    } = this.props;

    if (filterId) {
      this.setState({
        editMode: true
      });
    }
  }

  addLangShortToKeyName(data) {
    const {
      userLanguage,
    } = this.props;

    //change key name from object 'data' to name_userLang.short
    Object.defineProperty(data, `name_${userLanguage.short}`,
      Object.getOwnPropertyDescriptor(data, `name`));
    delete data[`name`];

    return data
  }

  getFormData() {
    const { name, filter, defaultName } = this.state;

    const  data = {
      name: name,
      name_ro: defaultName,
      public: filter ? +filter.public : false
    };

    this.addLangShortToKeyName(data);

    return appendToFormData(
      new FormData(),
      data,
      'filter'
    );
  }

  getFormDataOnUpdate() {
    let formData = this.getFormData();
    formData.append('_method', 'PUT');

    return formData;
  }

  submitForm() {
    const { dispatch, accessToken, history } = this.props;

    const { editMode } = this.state;

    this.setState(
      {
        isFetching: true
      },
      () => {
        this.submitFormDataFetcher = dispatch(
          fetchAuthorizedApiRequest(
            editMode ? 
            `/v1/events/calendar/filters/${this.props.match.params.filterId}`
            : `/v1/events/calendar/filters`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`
              },
              body: editMode ? this.getFormDataOnUpdate() : this.getFormData()
            }
          )
        );

        this.submitFormDataFetcher
          .then(response => {
            switch (response.status) {
              case 201:
                this.setState({ errors: null });
                return Promise.resolve();
              case 200:
                this.setState({ errors: null });
                return Promise.resolve();
              case 422:
                return response.json().then(({ errors }) => {
                  this.setState({ errors });
                  return Promise.reject(new UnprocessableEntity());
                });
              default:
                return Promise.reject(new InternalServerError());
            }
          })
          .then(
            () => {
              history.push(`/administration/filters`);
            },
            () => {
              this.setState({
                isFetching: false
              });
            }
          );
      }
    );
  }

  render() {
    const { name, errors, isFetching, isLoaded, editMode, defaultName } = this.state;

    return (
      <View
        name={name}
        defaultName={defaultName}
        errors={errors}
        isFetching={isFetching}
        isLoaded={isLoaded}
        editMode={editMode}
        onCancelForm={() => this.props.history.push(`/administration/filters`)}
        filterNameChange={e => this.setState({ name: e.target.value })}
        onSubmit={e => {
          e.preventDefault();
          this.submitForm();
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    userLanguage: state.user.language,
  };
}

export default withRouter(connect(mapStateToProps)(Container));
