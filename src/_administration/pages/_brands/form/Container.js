import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { appendToFormData } from '../../../../helpers/form';
import View from './View';

import {
  fetchApiRequest,
  fetchAuthorizedApiRequest,
} from '../../../../fetch';

import {
  UnprocessableEntity,
  InternalServerError,
} from "../../../../exceptions/http";

class Container extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      name: '',
      brand: null,
      errors: null,
      isFetching: false,
      isLoaded: false,
      editMode: false,
    }
  }

  componentDidMount() {
    const {
      match: {
        params: {
          brandId,
        },
      },
    } = this.props;

    if(brandId){
      this.setState({
        editMode: true,
      }, () => this.getBrandData(brandId))
    }
  }

  getBrandData(brandId) {
    this.fetchBrandDetailsFetcher = fetchApiRequest(`/v1/brands/${brandId}`);
    this.fetchBrandDetailsFetcher
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
      .then(brand => {
        this.setState({
          brand,
          name: brand.name,
          isLoaded: true,
        });
      });
  }

  getFormData() {
    const { name, brand } = this.state;

    return appendToFormData(
      new FormData(),
      {
        name: name,
        public: brand? +brand.public : null,
        suggested: brand? +brand.suggested : null,
      },
      'brand',
    );
  }

  getFormDataOnUpdate() {
    let formData = this.getFormData();
    formData.append('_method', 'PUT');

    return formData;
  }

  submitForm() {
    const {
      dispatch,
      accessToken,
      history,
    } = this.props;

    const { editMode, brand } = this.state;

    this.setState({
      isFetching: true,
    }, () => {
      this.submitFormDataFetcher = dispatch(
        fetchAuthorizedApiRequest(`/v1/brands${editMode? '/' + brand.id : ''}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: editMode? this.getFormDataOnUpdate() : this.getFormData(),
        })
      );

      this.submitFormDataFetcher
        .then(response => {
          switch(response.status) {
            case 201:
              this.setState({errors: null});
              return Promise.resolve();
            case 200:
              this.setState({errors: null});
              return Promise.resolve();
            case 422:
              return response.json().then(({errors}) => {
                this.setState({errors});
                return Promise.reject(
                  new UnprocessableEntity()
                );
              });
            default:
              return Promise.reject(
                new InternalServerError()
              );
          }
        })
        .then(() => {
          history.push(`/administration/brands`);
        }, () => {
          this.setState({
            isFetching: false,
          });
        });
    });
  }

  render() {
    const {
      name,
      errors,
      isFetching,
      isLoaded,
      editMode,
    } = this.state;

    return (
      <View
        name={name}
        errors={errors}
        isFetching={isFetching}
        isLoaded={isLoaded}
        editMode={editMode}
        onCancelForm={() => this.props.history.push(`/administration/brands`)}
        brandNameChange={(e) => this.setState({name: e.target.value})}
        onSubmit={(e) => {
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
  };
}

export default withRouter(connect(mapStateToProps)(Container));
