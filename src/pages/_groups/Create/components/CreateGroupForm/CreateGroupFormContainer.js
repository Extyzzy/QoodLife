import React, {Component} from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import { forEach, cloneDeep } from 'lodash';
import draftToHtml from "draftjs-to-html";
import { convertToRaw, EditorState } from "draft-js";
import { MOBILE_VERSION } from '../../../../../actions/app';
import { fetchAuthorizedApiRequest} from "../../../../../fetch";
import { fetchGenders } from '../../../../../actions/genders';
import { receiveAddNewGroup } from "../../../../../actions/groups";
import {
  appendToFormData,
  didFormDataHasChanged
} from "../../../../../helpers/form";
import {
  InternalServerError,
  UnprocessableEntity
} from "../../../../../exceptions/http";
import PropTypes from "prop-types";
import update from 'immutability-helper';
import MobileVersion from './CreateGroupFormMobile';
import CreateGroupForm from "./CreateGroupForm";

class CreateGroupFormContainer extends Component {
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

    const { history: {location: { state }} } = this.props;
    const hasDefaultEvent = state? !!state.event : false;

    this.setInitialFormData({
      __name: '',
      __details: draftToHtml(
        convertToRaw(
          EditorState
            .createEmpty()
            .getCurrentContent()
        )
      ),
      __amount: '',
      __images: [],
      __defaultImageIndex: 0,
      __startDate: null,
      __endDate: null,
      __formattedAddress: '',
      __latitude: null,
      __longitude: null,
      __gender: null,
      __hobbies: [],
      __userRoles: null,
      __event: hasDefaultEvent
      ? {value: state.event.id, label: state.event.title}
      : null,
    });

    this.state = Object.assign(
      {},
      {
        isFetching: props.isFetching,
        ...cloneDeep(
          this.getInitialFormData()
        ),
        __details: EditorState.createEmpty(),
        errors: null,
      },
      (this.defaultState instanceof Function && this.defaultState()) || {},
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
  }

  componentWillUpdate(nextProps, nextState) {
    const { onFormDataChange } = this.props;

    if(onFormDataChange instanceof Function) {
      onFormDataChange(
        didFormDataHasChanged(
          this.getInitialFormData(),
          {
            ...nextState,
            __details: draftToHtml(
              convertToRaw(
                nextState.__details
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
    const { user } = this.props;

    return user.roles.map(({
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
    const {onFetchingStateChange} = this.props;
    const isFetching = state === undefined? !this.state.isFetching : state;

    this.setState({isFetching}, () => {
      if (onFetchingStateChange instanceof Function) {
        onFetchingStateChange(isFetching);
      }
    });
  }

  getFormData() {
    const {
      __name: name,
      __details,
      __amount: size,
      __formattedAddress,
      __gender,
      __latitude: latitude,
      __longitude: longitude,
      __addressComponents,
      __images,
      __startDate: startDate,
      __endDate: endDate,
      __defaultImageIndex: defaultImageIndex,
      __hobbies,
      __event,
      __userRoles,
    } = this.state;

    const role = this.props.location.state;

    // check if in url browser has string 'edit' for send form. Create form need send with role, Edit form without role.
    const edit = window.location.href.indexOf('edit') !== -1;

    const formData = {
      name,
      details: draftToHtml(
        convertToRaw(
          __details.getCurrentContent()
        )
      ),
      size,
      ...(__images.length? {
        gallery: {
          images: __images.map(({source, crop}) => ({source, crop})),
          default: defaultImageIndex,
        }} : {}),
      ...(__event ? {
        event: __event.value,
        role: 'member',
      } : {
        hobbies: __hobbies.map(({
          hobby,
          audience,
          ageGroups
         }) => ({
          hobby: hobby.value,
          audience,
          ageGroups: ageGroups? ageGroups.map(({value}) => value) : null,
        })),
        location: __formattedAddress ? {
          label: __formattedAddress,
          latitude,
          longitude,
          components: __addressComponents,
        } : null,
        since: startDate ? startDate.unix() : null,
        until: endDate ? endDate.unix() : null,
        nullData: startDate && endDate? null : true,
        role: role ? role : edit ? null : __userRoles.codeUser,
        gender: __gender? __gender.value : null,
      })
    };

    return appendToFormData(
      new FormData(),
      formData,
      'group'
    );
  }

  submitFormData() {
    const {
      dispatch,
      accessToken,
      beforeSubmit,
      onError,
      goBackTogGroups,
    } = this.props;

    this.toggleIsFetchingState(true);

    if (beforeSubmit instanceof Function) {
        beforeSubmit();
    }

    this.submitFormDataFetcher = dispatch(
      fetchAuthorizedApiRequest('/v1/groups', {
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
            receiveAddNewGroup(data)
          )
        });

        return Promise.resolve();
      })
      .then(() => {
        this.toggleIsFetchingState(false);
        goBackTogGroups();
      }, e => {
        this.toggleIsFetchingState(false);
        if (onError instanceof Function) {
          onError(e);
        }
      });
  }

  onSubmit(e) {
    e.preventDefault();

    const {isFetching} = this.state;
    if(isFetching) {
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
      return CreateGroupForm;
    }
  }

  render() {
    const {
      isFetching,
      focusedInput,
      __name,
      __details,
      __amount,
      __images,
      __startDate,
      __endDate,
      __defaultImageIndex,
      __hobbies,
      __formattedAddress,
      __latitude,
      __longitude,
      __event,
      __gender,
      __userRoles,
      errors,
    } = this.state;

    const {
      location,
      goBackTogGroups,
      user,
    } = this.props;

    const CreateGroupForm = this.getListItem();

    return (
      <CreateGroupForm
        isFetching={isFetching}
        onSubmit={this.onSubmit}
        basedOnEventGroup={!!__event}
        hobbiesOptions={this.getHobbiesOptions()}
        gendersOptions={this.getGendersOptions()}
        role={location.state}
        __userRoles={__userRoles}
        onRolesChange={(__userRoles) => this.setState({__userRoles})}
        getRolesOptions={this.getRolesOptions()}
        __gender={__gender}
        __name={__name}
        __event={__event}
        __details={__details}
        __amount={__amount}
        __images={__images}
        __startDate={__startDate? __startDate.unix() : null}
        __endDate={__endDate? __endDate.unix() : null}
        __hobbies={__hobbies}
        __formattedAddress={__formattedAddress}
        __latitude={__latitude}
        __longitude={__longitude}
        onGenderChange={(__gender) => this.setState({__gender})}

        onNameChange={({target: {value: __name}}) => {
            this.setState({__name});
        }}
        onDetailsChange={__details => {
            this.setState({__details});
        }}
        onAmountChange={({target: {value: __amount}}) => {
            this.setState({__amount});
        }}
        onImageChange={this.onImageChange}
        deleteImage={this.deleteImage}
        cropImage={this.cropImage}
        setDefaultImage={(__defaultImageIndex) => {
            this.setState({__defaultImageIndex});
        }}
        defaultImageIndex={__defaultImageIndex}
        onDatesChange={(__startDate, __endDate) => {
            this.setState({__startDate, __endDate});
        }}
        focusedInput={focusedInput}
        onFocusChange={focusedInput => {
            this.setState({focusedInput});
        }}
        setCoordinates={(
          __latitude,
          __longitude,
          __formattedAddress,
          __addressComponents,
        ) => {
          this.setState({
            __latitude,
            __longitude,
            __formattedAddress,
            __addressComponents,
          });
        }}
        onHobbiesChange={__hobbies => {
          this.setState({__hobbies});
        }}
        errors={errors}
        goBackTogGroups={goBackTogGroups}
        confirmed={user.confirmed}
      />
    );
  }
}

function mapStateToProps(store) {
  return {
    accessToken: store.auth.accessToken,
    gendersList: store.genders.list,
    hobbiesList: store.hobbies.list,
    childrenHobbiesList: store.hobbies.forChildren,
    userHaveChildrens: !!store.user.children.length,
    UIVersion: store.app.UIVersion,
    user: store.user,
  };
}

export {CreateGroupFormContainer as CreateGroupFormContainerWithoutDecorators};
export default connect(mapStateToProps)(withRouter(CreateGroupFormContainer));
