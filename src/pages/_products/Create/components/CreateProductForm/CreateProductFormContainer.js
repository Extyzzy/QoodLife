import React, { Component } from "react";
import PropTypes from "prop-types";
import update from 'immutability-helper';
import draftToHtml from "draftjs-to-html";
import { convertToRaw, EditorState } from "draft-js";
import { connect } from "react-redux";
import { forEach, cloneDeep } from "lodash";
import { MOBILE_VERSION } from '../../../../../actions/app';
import { fetchAuthorizedApiRequest } from "../../../../../fetch";
import { fetchGenders } from '../../../../../actions/genders';
import { fetchBrands } from "../../../../../actions/brands";
import { receiveAddNewProduct } from "../../../../../actions/products";
import {
  appendToFormData,
  didFormDataHasChanged,
} from "../../../../../helpers/form";

import {
  InternalServerError,
  UnprocessableEntity,
} from "../../../../../exceptions/http";

import MobileVersion from './CreateProductFormMobile';
import CreateProductForm from "./CreateProductForm";
import {withRouter} from "react-router";

class CreateProductFormContainer extends Component {
    static propTypes = {
      isFetching: PropTypes.bool,
      onFetchingStateChange: PropTypes.func,
      beforeSubmit: PropTypes.func,
      onSuccess: PropTypes.func,
      onError: PropTypes.func,
    };

    static defaultProps = {
      isFetching: false,
    };

    constructor(props, context) {
      super(props, context);

      this.setInitialFormData({
        brandsList: [],
        __title: '',
        __description: draftToHtml(
          convertToRaw(
            EditorState
              .createEmpty()
              .getCurrentContent()
          )
        ),
        __images: [],
        __defaultImageIndex: 0,
        __brand: null,
        __suggestedBrand: '',
        __gender: null,
        __hobbies: [],
        __userRoles: null,
      });

      this.state = Object.assign(
        {},
        {
          isFetching: props.isFetching,
          brandsList: [],
          ...cloneDeep(
            this.getInitialFormData()
          ),
          __description: EditorState.createEmpty(),
          errors: null,
        },
        (this.defaultState instanceof Function
            && this.defaultState()) || {},
      );

      this.onSubmit = this.onSubmit.bind(this);
      this.onImageChange = this.onImageChange.bind(this);
      this.deleteImage = this.deleteImage.bind(this);
      this.cropImage = this.cropImage.bind(this);
    }

    componentDidMount() {
      const {
        dispatch,
        gendersList,
      } = this.props;

      if ( ! gendersList || ! gendersList.length) {
        dispatch(
          fetchGenders()
        );
      }

      fetchBrands({
          onSuccess: ({list}) => {
            this.setState({
                brandsList: list,
            });
          },
          onError: () => {
            this.setState({
                brandsList: [],
            });
          },
      });
    }

    componentWillUpdate(nextProps, nextState) {
      const { onFormDataChange } = this.props;

      if (onFormDataChange instanceof Function) {
        onFormDataChange(
          didFormDataHasChanged(
            this.getInitialFormData(),
            {
              ...nextState,
              __description: draftToHtml(
                convertToRaw(
                  nextState.__description
                    .getCurrentContent()
                )
              ),
            }
          )
        );
      }
    }

    componentWillUnmount() {
      if (this.submitFormDataFetcher instanceof Promise) {
          this.submitFormDataFetcher.cancel();
      }
    }

    setInitialFormData(formData) {
      this._initialFormData = formData;
    }

    getInitialFormData() {
      return this._initialFormData || {};
    }

    toggleIsFetchingState(state) {
      const {onFetchingStateChange} = this.props;
      const isFetching = state === undefined
        ? !this.state.isFetching
        : state;

      this.setState({isFetching}, () => {
        if (onFetchingStateChange instanceof Function) {
            onFetchingStateChange(isFetching);
        }
      });
    }

    getFormData() {
      const {
        __title: title,
        __description,
        __images,
        __gender,
        __defaultImageIndex: defaultImageIndex,
        __hobbies,
        __brand,
        __userRoles,
      } = this.state;

      const role = this.props.location.state;

      // check if in url browser has string 'edit' for send form. Create form need send with role, Edit form without role.
      const edit = window.location.href.indexOf('edit') !== -1;

      return appendToFormData(
        new FormData(),
        {
          title,
          description: draftToHtml(
            convertToRaw(
              __description.getCurrentContent()
            )
          ),
          gender: __gender ? __gender.value : null,
          gallery: {
            images: __images.map(({source, crop}) => ({source, crop})),
            default: defaultImageIndex,
          },
          hobbies: __hobbies.map(({
            hobby,
            audience,
            ageGroups,
            titles,
          }) => ({
            hobby: hobby.value,
            audience,
            ageGroups: ageGroups? ageGroups.map(({value}) => value) : null,
            filters: titles? titles.map(t => t.value) : null,
          })),

          brand: __brand? __brand.label :  null,
          role: !edit? role || __userRoles.codeUser : null,
        },
        'product'
      );
    }

    submitFormData() {
        const {
            dispatch,
            accessToken,
            beforeSubmit,
            onError,
            goBackToProducts,
        } = this.props;

        this.toggleIsFetchingState(true);

        if (beforeSubmit instanceof Function) {
            beforeSubmit();
        }

        this.submitFormDataFetcher = dispatch(
            fetchAuthorizedApiRequest('/v1/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: this.getFormData(),
            })
        );

        this.submitFormDataFetcher
            .then(response => {
                switch (response.status) {
                    case 201:

                        return response.json();

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
            .then(data => {
                this.setState({errors: null}, () => {
                    dispatch(
                        receiveAddNewProduct(data)
                    )
                });

                return Promise.resolve();
            })
            .then(
                () => {
                  this.toggleIsFetchingState(false);
                  goBackToProducts();
                },
                e => {
                    this.toggleIsFetchingState(false);

                    if (onError instanceof Function) {
                        onError(e);
                    }
                }
            );
    }

    onSubmit(e) {
      e.preventDefault();
      const {isFetching} = this.state;

      if (isFetching) {
        return false;
      }

      this.submitFormData();
    }

    getHobbiesOptions() {
      const { hobbiesList, childrenHobbiesList, userHaveChildrens } = this.props;
      let options = [];

      if(!userHaveChildrens){
        options.push(...childrenHobbiesList.map(({
          id: value,
          name: label,
          audience,
          ageGroups,
          filters,
        }) => ({
          value,
          label,
          audience,
          ageGroups,
          filters,
        })));
      }

      forEach(hobbiesList, ({children, hobbies}) => {
        if (children) {
          children.forEach(({hobbies}) => {
            options.push(...hobbies.map(({
              id: value,
              name: label,
              audience,
              ageGroups,
              filters,
            }) => ({
              value,
              label,
              audience,
              ageGroups: !!ageGroups.length? ageGroups : null,
              filters,
            })));
          });
        } else {
          options.push(...hobbies.map(({
            id: value,
            name: label,
            audience,
            ageGroups,
            filters,
          }) => ({
            value,
            label,
            audience,
            ageGroups: !!ageGroups.length? ageGroups : null,
            filters,
          })));
        }
      });

      return options;
    }

    getGendersOptions() {
      const { gendersList } = this.props;

      return gendersList.map(({
        id: value,
        name: label,
      }) => ({value, label}));
    }

    getBrandOptions() {
      const {brandsList} = this.state;
      let options = [];

      options.push(...brandsList.map(({
        id: value,
        name: label,
      }) => ({
        value,
        label,
      })));

      return options;
    }

    onImageChange(attachments) {
      const {
        __images,
      } = this.state;

      this.setState({
        __images: [
            ...__images,
            ...attachments,
        ],
      });
    }

    deleteImage(i) {
      const {
        __defaultImageIndex,
        __images,
      } = this.state;

      if (__defaultImageIndex >= i) {
          this.setState({
            __defaultImageIndex: __defaultImageIndex === i
              ? null
              : __defaultImageIndex - 1,
          });
      }

      this.setState({
        __images: update(__images, {
            $splice: [[i, 1]],
        }),
      });
    }

    cropImage(i, crop, size) {
      const { __images } = this.state;

      this.setState({
        __images: update(__images, {
          [i]: {
            $apply: (image) => update(image, {
              crop: {
                  $set: crop,
              },
              size: {
                  $set: size,
              },
            }),
          },
        }),
      });
    }

    getListItem() {
      const { UIVersion } = this.props;

      switch (UIVersion) {
        case MOBILE_VERSION:
          return MobileVersion;

        default:
          return CreateProductForm;
      }
    }

  getRolesOptions() {
    const { userRoles } = this.props;

    return userRoles.map(({
      id: value,
      name: label,
      code: codeUser,
    }) => ({value, label, codeUser}));
  }

    render() {
      const {
        isFetching,
        errors,
        __title,
        __description,
        __images,
        __defaultImageIndex,
        __hobbies,
        __brand,
        __suggestedBrand,
        __gender,
        __userRoles,
      } = this.state;

      const {
        confirmed
      } = this.props;

      const {  location, goBackToProducts } = this.props;
      const CreateProductForm = this.getListItem();

      return (
        <CreateProductForm
          isFetching={isFetching}
          onSubmit={this.onSubmit}
          role={location.state}
          hobbiesOptions={this.getHobbiesOptions()}
          brandOptions={this.getBrandOptions()}
          gendersOptions={this.getGendersOptions()}
          getRolesOptions={this.getRolesOptions()}
          onRolesChange={__userRoles => this.setState({__userRoles})}
          onBrandChange={__brand => this.setState({__brand})}
          onSuggestedbrandChange={({target: {value: __suggestedBrand}}) => this.setState({__suggestedBrand})}
          onGenderChange={__gender => this.setState({__gender})}
          onHobbiesChange={__hobbies => this.setState({__hobbies})}
          __userRoles={__userRoles}
          __gender={__gender}
          __title={__title}
          __description={__description}
          __images={__images}
          __hobbies={__hobbies}
          __suggestedBrand={__suggestedBrand}
          __brand={__brand}
          onTitleChange={({target: {value: __title}}) => {
              this.setState({__title});
          }}
          onDescriptionChange={__description => {
              this.setState({__description});
          }}
          onImageChange={this.onImageChange}
          deleteImage={this.deleteImage}
          cropImage={this.cropImage}
          setDefaultImage={(__defaultImageIndex) => {
              this.setState({__defaultImageIndex});
          }}
          defaultImageIndex={__defaultImageIndex}
          errors={errors}
          goBackToProducts={goBackToProducts}
          confirmed={confirmed}
        />
      );
    }
}

function mapStateToProps(store) {
  return {
    accessToken: store.auth.accessToken,
    gendersList: store.genders.list,
    hobbiesList: store.hobbies.list,
    UIVersion: store.app.UIVersion,
    childrenHobbiesList: store.hobbies.forChildren,
    userHaveChildrens: !!store.user.children.length,
    userRoles: store.user.roles.filter(e => e.code !== 'member'),
    confirmed: store.user.confirmed,
  };
}

export {CreateProductFormContainer as CreateProductFormContainerWithoutDecorators};
export default connect(mapStateToProps)(withRouter(CreateProductFormContainer));
