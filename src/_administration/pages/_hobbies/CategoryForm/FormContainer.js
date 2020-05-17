import React, { Component }  from 'react';
import { forEach } from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import update from 'immutability-helper';
import { appendToFormData } from '../../../../helpers/form';

import {
  fetchApiRequest,
  fetchAuthorizedApiRequest,
} from '../../../../fetch';

import {
  UnprocessableEntity,
  InternalServerError,
} from "../../../../exceptions/http";

import Form from './Form';

class FormContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isFetching: false,
      isLoaded: false,
      errors: null,
      name: '',
      defaultName: '',
      parent: {value: null, label: 'no parent'},
      parentOptions: null,
      image: null,
      categoryDetails: null,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: {
          categoryId,
        },
      },
    } = this.props;

    if(categoryId){
      this.getHobbydata(categoryId);
    } else {
      this.fetchEmptyCategories();
    }
  }

  componentWillUnmount() {
    const {
      match: {
        params: {
          categoryId,
        },
      },
    } = this.props;

    if(categoryId){
      if (this.fetchEventDetailsFetcher instanceof Promise) {
        this.fetchEventDetailsFetcher.cancel();
      }
    }
  }

  getParentsList() {
    const { parentOptions } = this.state;
    let options = [{value: null, label: 'no parent'}];

    forEach(parentOptions, ({id, name, for_children}) => {
      options.push({
        value: id,
        label: name,
        for_children,
      })
    });

    return options;
  }

  fetchEmptyCategories() {
    this.categoriesFetcher = fetchApiRequest(`/v1/hobbies/categories?onlyWithoutHobbies=true`);
    this.categoriesFetcher
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
      .then((categories) => {
        this.setState({parentOptions: categories.list})
        return Promise.resolve();
      });
  }

  getHobbydata(categoryId) {
    const {accessToken, dispatch} = this.props;

    this.fetchHobbyDetailsFetcher = dispatch(
      fetchAuthorizedApiRequest(`/v1/hobbies/categories/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    );

    this.fetchHobbyDetailsFetcher
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
      .then((categoryDetails) => {
        const {category: { image, allNames ,name }} = categoryDetails;
        this.setState({
          categoryDetails,
          name: name,
          defaultName: allNames.name_ro,
          image: {
            source: image.id,
            preview: image.src,
          },
        }, () => {
          this.setState({isLoaded: true})
        });
      });
  }

  getFormData() {
    const {
      name,
      image,
      parent,
      categoryDetails,
      defaultName,
    } = this.state;

    const childrenStatus = categoryDetails
    ? categoryDetails.category.for_children
    : parent.value
      ? parent.for_children
      : false;


    const data = {
        name: name,
        name_ro: defaultName,
        parent: parent.value,
        for_children: childrenStatus,
        image: image ? {
          source: image.source,
          crop: image.crop,
        } : null,
      };

    this.addLangShortToKeyName(data);

    return appendToFormData(
      new FormData(),
      data,
      'category',
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
      match: {
        params: {
          categoryId,
        },
      },
    } = this.props;

    this.setState({
      isFetching: true,
    }, () => {
      this.submitFormDataFetcher = dispatch(
        fetchAuthorizedApiRequest(`/v1/hobbies/categories${(categoryId ? `/${categoryId}` : '')}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: categoryId? this.getFormDataOnUpdate() : this.getFormData(),
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
                this.setState({
                  isFetching: false,
                  errors,
                });
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
          history.push(`/administration/hobbies`);
        }, () => {
          this.setState({
            isFetching: false,
          });
        });
    });
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

  render() {
    const {
      match: {
        params: {
          categoryId,
        },
      },
    } = this.props;

    const {
      categoryDetails,
      name,
      defaultName,
      image,
      parent,
      isFetching,
      isLoaded,
      errors,
    } = this.state;

    return (
      <Form
        name={name}
        defaultName={defaultName}
        image={image}
        parent={parent}
        parentOptions={this.getParentsList()}
        categoryDetails={categoryDetails}
        errors={errors}
        editMode={!!categoryId}
        isLoaded={isLoaded}
        isFetching={isFetching}

        onCategoryNameChange={(e) => {
          this.setState({name: e.target.value})
        }}

        onImageChange={([image]) => this.setState({image})}
        deleteImage={() => this.setState({image: null})}
        onParentChange={(parent) => this.setState({parent})}

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

        onSubmit={e => {
          e.preventDefault();

          if (isFetching) {
            return false;
          }

          this.submitForm('create');
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    hobbiesList: state.hobbies.list,
    accessToken: state.auth.accessToken,
    permissions: state.user.permissions,
    authedUser:  state.user,
    userLanguage: state.user.language,
  };
}

export default withRouter(connect(mapStateToProps)(FormContainer));
