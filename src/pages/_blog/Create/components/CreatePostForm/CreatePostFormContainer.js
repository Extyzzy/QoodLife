import React, { Component } from "react";
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { connect } from "react-redux";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { forEach, cloneDeep } from 'lodash';
import { MOBILE_VERSION } from '../../../../../actions/app';
import ID from '../../../../../helpers/ID';
import { appendToFormData, didFormDataHasChanged } from '../../../../../helpers/form';
import { fetchAuthorizedApiRequest } from '../../../../../fetch';
import { receiveAddNewPost } from '../../../../../actions/posts';
import { fetchGenders } from '../../../../../actions/genders';
import { UnprocessableEntity, InternalServerError } from '../../../../../exceptions/http';
import CreatePostForm from './CreatePostForm';
import MobileVersion from './CreatePostFormMobile';
import { fetchBlogLanguages } from '../../../../../actions/blogLanguages';
import Loader from '../../../../../components/Loader/Loader';
import {withRouter} from "react-router";

class CreatePostFormContainer extends Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    onFetchingStateChange: PropTypes.func,
    beforeSubmit: PropTypes.func,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    onFormDataChange: PropTypes.func,
  };

  static defaultProps = {
    isFetching: false,
  };

  constructor(props, context) {
    super(props, context);

    /**
     * Store initial form data to have a point with
     * who to check if the data has been changed.
     */
    this.setInitialFormData({
      __title: '',
      __intro: '',
      __languages: '',
      __content: draftToHtml(
        convertToRaw(
          EditorState
            .createEmpty()
            .getCurrentContent()
        )
      ),
      __image: null,
      __gender: null,
      __tags: [],
      __hobbies: [],
      __userRoles: null,
      postedLike: null,
      uploadedImages: []
    });

    this.state = Object.assign(
      {},
      {
        isFetching: props.isFetching,
        ...cloneDeep(
          this.getInitialFormData()
        ),
        __content: EditorState.createEmpty(),
        errors: null,
      },
      (this.defaultState instanceof Function
        && this.defaultState()) || {},
    );

    this.onSubmit = this.onSubmit.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.cropImage = this.cropImage.bind(this);
    this.onTagDelete = this.onTagDelete.bind(this);
    this.onTagAddition = this.onTagAddition.bind(this);
    this._uploadImageCallBack = this._uploadImageCallBack.bind(this);
  }

  componentDidMount() {
    const {
      dispatch,
      blogLanguagesList,
      gendersList
    } = this.props;

    if ( ! blogLanguagesList || ! blogLanguagesList.length) {
      dispatch(
        fetchBlogLanguages()
      );
    }

    if ( ! gendersList || ! gendersList.length) {
      dispatch(
        fetchGenders()
      );
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { onFormDataChange } = this.props;

    if (onFormDataChange instanceof Function) {
      onFormDataChange(
        didFormDataHasChanged(
          this.getInitialFormData(),
          {
            ...nextState,
            __content: draftToHtml(
              convertToRaw(
                nextState.__content
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

  getRolesOptions() {
    const { userRoles } = this.props;

    return userRoles.map(({
                            id: value,
                            name: label,
                            code: codeUser,
                          }) => ({value, label, codeUser}));
  }

  setInitialFormData(formData) {
    this._initialFormData = formData;
  }

  getInitialFormData() {
    return this._initialFormData || {};
  }

  toggleIsFetchingState(state) {
    const { onFetchingStateChange } = this.props;
    const isFetching = state === undefined
      ? ! this.state.isFetching : state;

    this.setState({isFetching}, () => {
      if (onFetchingStateChange instanceof Function) {
        onFetchingStateChange(isFetching);
      }
    });
  }

  getFormData() {
    const {
      __title: title,
      __intro: intro,
      __gender,
      __content,
      __image,
      __hobbies,
      __languages,
      __tags,
    } = this.state;

    const role = this.props.location.state;

    // check if in url browser has string 'edit' for send form. Create form need send with role, Edit form without role.
    const edit = window.location.href.indexOf('edit') !== -1;

    return appendToFormData(
      new FormData(),
      {
        title,
        intro,
        gender: __gender? __gender.value : null,
        content: draftToHtml(
          convertToRaw(
            __content.getCurrentContent()
          )
        ),
        image: __image ? {
          source: __image.source,
          crop: __image.crop,
        } : null,
        hobbies: __hobbies.map(({
                                  hobby,
                                  audience,
                                  ageGroups
                                }) => ({
          hobby: hobby.value,
          audience,
          ageGroups: ageGroups? ageGroups.map(({value}) => value) : null,
        })),
        language: __languages.value,
        tags: __tags.map(({text}) => text),
        role: edit ? null : role,
      },
      'post'
    );
  }

  submitFormData() {
    const {
      dispatch,
      accessToken,
      beforeSubmit,
      onError,
      goBackToPosts,
    } = this.props;

    this.toggleIsFetchingState(true);

    if (beforeSubmit instanceof Function) {
      beforeSubmit();
    }

    this.submitFormDataFetcher = dispatch(
      fetchAuthorizedApiRequest('/v1/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: this.getFormData(),
      })
    );

    this.submitFormDataFetcher
      .then(response => {
        switch(response.status) {
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
            receiveAddNewPost(data)
          )
        });

        return Promise.resolve();
      })
      .then(
        () => {
          this.toggleIsFetchingState(false);

          goBackToPosts()
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

    const { isFetching } = this.state;

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
                                               }) => ({
        value,
        label,
        audience,
        ageGroups,
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
                                       }) => ({
            value,
            label,
            audience,
            ageGroups: !!ageGroups.length? ageGroups : null,
          })));
        });
      } else {
        options.push(...hobbies.map(({
                                       id: value,
                                       name: label,
                                       audience,
                                       ageGroups,
                                     }) => ({
          value,
          label,
          audience,
          ageGroups: !!ageGroups.length? ageGroups : null,
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

  onImageChange([__image]) {
    this.setState({
      __image,
    });
  }

  cropImage(i, crop, size) {
    const { __image } = this.state;

    this.setState({
      __image: update(__image, {
        $apply: (image) => update(image, {
          crop: {
            $set: crop,
          },
          size: {
            $set: size,
          },
        }),
      }),
    });
  }

  onTagDelete(i) {
    const { __tags } = this.state;

    this.setState({
      __tags: update(__tags, {
        $splice: [[i, 1]],
      })
    });
  }

  onTagAddition(tag) {
    const { __tags } = this.state;

    if(__tags.length < 3) {
      this.setState({
        __tags: update(__tags, {
          $push: [{
            id: ID(),
            text: tag,
          }],
        }),
      });
    }
  }

  getListItem() {
    const { UIVersion } = this.props;

    switch (UIVersion) {
      case MOBILE_VERSION:
        return MobileVersion;

      default:
        return CreatePostForm;
    }
  }

  getLanguagesOptions() {
    const { blogLanguagesList }   = this.props;
    let options = [];

    options.push(...blogLanguagesList.map(({
                                             id: value,
                                             full: label,
                                           }) => ({value, label})));

    return options;
  }

  _uploadImageCallBack(file){ 
    const { uploadedImages } = this.state;
    // long story short, every time we upload an image, we
    // need to save it to the state so we can get it's data
    // later when we decide what to do with it.
    
   // Make sure you have a uploadImages: [] as your default state
    let upImage = uploadedImages;
    console.info(file);
    const imageObject = {
      file: file,
      localSrc: URL.createObjectURL(file),
    };
    
    upImage.push(imageObject);

    this.setState({uploadedImages: upImage});

    const getFileBase64 = (file, callback) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      // Since FileReader is asynchronous,
      // we need to pass data back.
      reader.onload = () => callback(reader.result);
      // TODO: catch an error
      reader.onerror = error => {};
    };

    // We need to return a promise with the image src
    // the img src we will use here will be what's needed
    // to preview it in the browser. This will be different than what
    // we will see in the index.md file we generate.
    return new Promise(
      (resolve, reject) => getFileBase64(
        file,
        data => resolve({ data: { link: data } })
      )
    );
  }

  render() {
    const {
      isFetching,
      __title,
      __intro,
      __content,
      __image,
      __tags,
      __hobbies,
      __gender,
      __languages,
      errors,
      postedLike,
      __userRoles,
    } = this.state;

    const {
      confirmed,
      blogLanguagesList,
      location,
      goBackToPosts
    } = this.props;

    if ( ! blogLanguagesList ) {
      return (
        <Loader />
      );
    }

    const CreatePostForm = this.getListItem();

    return (
      <CreatePostForm
        blogLanguagesList={blogLanguagesList}
        isFetching={isFetching}
        role={postedLike ? postedLike.code : location.state}
        onSubmit={this.onSubmit}
        hobbiesOptions={this.getHobbiesOptions()}
        languagesOptions={this.getLanguagesOptions()}
        gendersOptions={this.getGendersOptions()}
        __gender={__gender}
        __title={__title}
        __intro={__intro}
        __content={__content}
        __image={__image}
        __tags={__tags}
        __hobbies={__hobbies}
        __languages={__languages}
        getRolesOptions={this.getRolesOptions()}
        onRolesChange={(__userRoles) => this.setState({__userRoles})}
        __userRoles={__userRoles}
        onGenderChange={(__gender) => this.setState({__gender})}
        onTitleChange={({target: {value: __title}}) => {
          this.setState({__title});
        }}
        onIntroChange={({target: {value: __intro}}) => {
          this.setState({__intro});
        }}
        onContentChange={__content => this.setState({__content})}
        onLanguagesChange={__languages => this.setState({__languages})}
        onImageChange={this.onImageChange}
        cropImage={this.cropImage}
        onTagDelete={this.onTagDelete}
        onTagAddition={this.onTagAddition}
        onHobbiesChange={__hobbies => {
          this.setState({__hobbies});
        }}
        errors={errors}
        goBackToPosts={goBackToPosts}
        confirmed={confirmed}
        _uploadImageCallBack={this._uploadImageCallBack}
      />
    );
  }
}

function mapStateToProps(store) {
  return {
    blogLanguagesList: store.blogLanguages.list,
    accessToken: store.auth.accessToken,
    childrenHobbiesList: store.hobbies.forChildren,
    userHaveChildrens: !!store.user.children.length,
    gendersList: store.genders.list,
    hobbiesList: store.hobbies.list,
    UIVersion: store.app.UIVersion,
    userRoles: store.user.roles.filter(e => e.code !== 'member'),
    confirmed: store.user.confirmed,
  };
}

export {CreatePostFormContainer as CreatePostFormContainerWithoutDecorators};
export default connect(mapStateToProps)(withRouter(CreatePostFormContainer));
