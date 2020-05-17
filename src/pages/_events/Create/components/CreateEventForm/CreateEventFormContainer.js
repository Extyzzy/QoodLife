import React, { Component } from "react";
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import draftToHtml from "draftjs-to-html";
import {ContentState, convertToRaw, EditorState} from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { connect } from "react-redux";
import { forEach, cloneDeep } from "lodash";
import { MOBILE_VERSION } from '../../../../../actions/app';
import { fetchAuthorizedApiRequest } from '../../../../../fetch';
import { fetchGenders } from '../../../../../actions/genders';
import { receiveAddNewEvent } from '../../../../../actions/events';
import {
  appendToFormData,
  didFormDataHasChanged,
} from "../../../../../helpers/form";
import {
  UnprocessableEntity,
  InternalServerError,
} from '../../../../../exceptions/http';

import CreateEventForm from './CreateEventForm';
import MobileVersion from './CreateEventFormMobile';
import {withRouter} from "react-router";
import moment from "moment";

class CreateEventFormContainer extends Component {
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

    const {
      state: {data, role}
    } = this.props.location;

    this.setInitialFormData({
      __title: data ? data.title : '',
      __ticketURL: data ? data.__ticketURL : ' ',
      __description: data ? data.description : draftToHtml(
        convertToRaw(
          EditorState
            .createEmpty()
            .getCurrentContent()
        )
      ),
      __weekDays: data  ? data.days.map(({day, dayName}) =>
          ({
            value: day,
            label: dayName,
          })
      ) : null,
      __images: data ? data.gallery.images.map(({id, src}) => ({
        source: id,
        preview: src,
      })) : [],
      __defaultImageIndex: data ? data.gallery.images.findIndex(image => image.default) : 0,
      __startDate: data ? moment.unix(data.since) : null,
      __endDate: data ? moment.unix(data.until) : null,
      __typeofRange: data && data.days ?
        {
          value: 'periodic',
          label: 'Periodic'
        } : {
          value: 'daily',
          label: 'Zilnic'
      },
      __timeStart: data ? moment.unix(data.since).format('HH:mm') : '00:00',
      __timeEnd: data ? moment.unix(data.until).format('HH:mm'):  '23:00',
      __formattedAddress: data  ? data.location.label : '',
      __latitude: data ? data.location.latitude : null,
      __longitude: data ? data.location.latitude : null,
      __gender: data ?  {
        value: data.gender.id,
        label: data.gender.name
      } : null,
      __filterCalendar: data &&  data.calendar.filters.length ?  {
        value: data.calendar.filters[0].id,
        label: data.calendar.filters[0].name
      } : null,
      __hobbies: data ? data.hobbies.map(({
        id,
        name,
        audience,
        ageGroups,
        dataFromPivotTable,
      }) => (this.regenerateHobby(
        id,
        name,
        audience,
        ageGroups,
        dataFromPivotTable
      ))) : [],
      __userRoles: role ? role : null,
    });

    this.state = Object.assign(
      {},
      {
        isFetching: props.isFetching,
        ...cloneDeep(
          this.getInitialFormData()
        ),
        __description: data ? this.getEditorStateFromHTML(data.description) : EditorState.createEmpty(),
        focusedInput: null,
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
    const { onFetchingStateChange } = this.props;

    const isFetching = state === undefined
      ?  ! this.state.isFetching : state;

    this.setState({isFetching}, () => {
      if (onFetchingStateChange instanceof Function) {
        onFetchingStateChange(isFetching);
      }
    });
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  getFormData() {
    const {
      __title: title,
      __ticketURL: ticketURL,
      __description,
      __formattedAddress,
      __latitude,
      __longitude,
      __addressComponents,
      __images,
      __gender,
      __startDate: startDate,
      __endDate: endDate,
      __defaultImageIndex,
      __hobbies,
      __userRoles,
      __filterCalendar,
      __weekDays,
      __timeStart,
      __timeEnd,
    } = this.state;

    const { role } = this.props.location.state;

    const randomNum = this.getRandomInt(100, 999);
    const latitude = __latitude ? __latitude.toFixed(4) + '' + randomNum : null;
    const longitude = __longitude ? __longitude.toFixed(4) + '' + randomNum  : null;
    // check if in url browser has string 'edit' for send form. Create form need send with role, Edit form without role.
    const edit = window.location.href.indexOf('edit') !== -1;

    const [hours, minutes] = __timeEnd.split(':');
    const endDayWithTime = moment(endDate).set({ hours, minutes }).unix();

    const [hour, minute] = __timeStart.split(':');
    const startDayWithTime = moment(startDate).set({ hour, minute }).unix();

    return appendToFormData(
      new FormData(),
      {
        title,
        ticketURL,
        description: draftToHtml(
          convertToRaw(
            __description.getCurrentContent()
          )
        ),
        days: __weekDays ?
          __weekDays.map(({
          value,
          }) => ({
          day: value,
          since: startDayWithTime,
          until: endDayWithTime,
        })) : null,
        gender: __gender ? __gender.value : null,
        filters: __filterCalendar ? [__filterCalendar.value] : null,
        location: __formattedAddress ? {
          label: __formattedAddress,
          latitude,
          longitude,
          components: __addressComponents,
        } : null,
        gallery:{
          images: __images.map(({source, crop}) => ({source, crop})),
          default: __defaultImageIndex,
        },
        since: startDayWithTime ? startDayWithTime : null,
        until: endDayWithTime ? endDayWithTime : null,
        hobbies: __hobbies.map(({
          hobby,
          audience,
          ageGroups
        }) => ({
          hobby: hobby.value,
          audience,
          ageGroups: ageGroups? ageGroups.map(({value}) => value) : null,
        })),
        role: edit ? null : role ? role : __userRoles.codeUser,
      },
      'event'
    );
  }

  submitFormData() {
    const {
      dispatch,
      accessToken,
      beforeSubmit,
      onError,
      goBackToEvents,
    } = this.props;

    this.toggleIsFetchingState(true);

    if (beforeSubmit instanceof Function) {
      beforeSubmit();
    }

    this.submitFormDataFetcher = dispatch(
      fetchAuthorizedApiRequest('/v1/events', {
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
            receiveAddNewEvent(data)
          )
        });

        return Promise.resolve();
      })
      .then(
        () => {
          this.toggleIsFetchingState(false);
          goBackToEvents()
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
          ? null : __defaultImageIndex - 1,
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
        return CreateEventForm;
    }
  }

  getGendersOptions() {
    const { gendersList } = this.props;

    return gendersList.map(({
      id: value,
      name: label,
    }) => ({value, label}));
  }

  getFilterCalendarOptions() {
    const { placeCalendar } = this.props;

    if (placeCalendar) {
      return placeCalendar.filters.map(({
        id: value,
        name: label,
      }) => ({value, label}));
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

  getEditorStateFromHTML(html) {
    const draft = htmlToDraft(html);

    if (draft) {
      const { contentBlocks } = draft;
      const contentState = ContentState
        .createFromBlockArray(
          contentBlocks
        );

      return EditorState.createWithContent(contentState);
    }
  }

  regenerateHobby(hobbyId, hobbyLabel, audience, ageGroups, dataFromPivotTable) {

    let currentHobbyAgeGroups = [];

    forEach(dataFromPivotTable.ageGroups, groupId => {
      const reqiredAgeGroup = ageGroups.find(gr => gr.id === groupId);

      if(reqiredAgeGroup){
        currentHobbyAgeGroups.push({
          value: reqiredAgeGroup.id,
          label: reqiredAgeGroup.name
        });
      }
    });


    return {
      hobby: {
        value: hobbyId,
        label: hobbyLabel,
        ageGroups,
        audience,
      },
      audience,
      ageGroups: currentHobbyAgeGroups,
      title: null,
    }
  }

  render() {
    const {
      isFetching,
      __title,
      __description,
      __gender,
      __images,
      __startDate,
      __endDate,
      focusedInput,
      __defaultImageIndex,
      __hobbies,
      __formattedAddress,
      __latitude,
      __longitude,
      __userRoles,
      errors,
      __filterCalendar,
      __weekDays,
      __timeStart,
      __timeEnd,
      __typeofRange,
      __ticketURL
    } = this.state;

    const {
      confirmed,
      placeCalendar,
      userRoles
    } = this.props;

    const { location,goBackToEvents } = this.props;
    const CreateEventForm = this.getListItem();

    const isAdmin = userRoles.find(data => data.code === 'admin');

     return (
      <CreateEventForm
        __filterCalendar={__filterCalendar}
        filterCalendarOptions={this.getFilterCalendarOptions()}
        onFilterCalendar={(__filterCalendar) => this.setState({__filterCalendar})}
        placeCalendar={placeCalendar}
        role={location.state}
        isFetching={isFetching}
        onSubmit={this.onSubmit}
        hobbiesOptions={this.getHobbiesOptions()}
        gendersOptions={this.getGendersOptions()}
        getRolesOptions={this.getRolesOptions()}
        onRolesChange={(__userRoles) => this.setState({__userRoles})}
        __userRoles={__userRoles}
        isAdmin={isAdmin}
        defaultImageIndex={__defaultImageIndex}
        focusedInput={focusedInput}
        __gender={__gender}
        __title={__title}
        __description={__description}
        __images={__images}
        __startDate={__startDate? __startDate.unix() : null}
        __endDate={__endDate? __endDate.unix() : null}
        __hobbies={__hobbies}
        __formattedAddress={__formattedAddress}
        __latitude={__latitude}
        __longitude={__longitude}
        __weekDays={__weekDays}
        __timeStart={__timeStart}
        __timeEnd={__timeEnd}
        __typeofRange={__typeofRange}
        __ticketURL={__ticketURL}
        onTypeofRangeChange={__typeofRange => this.setState({__typeofRange})}

        onTimeChangeEnd={__timeEnd => this.setState({__timeEnd})}
        onTimeChangeStart={__timeStart => this.setState({__timeStart})}

        onTicketURLChange={({target: {value: __ticketURL}}) => {
          this.setState({__ticketURL});
        }}

        onTitleChange={({target: {value: __title}}) => {
          this.setState({__title});
        }}

        onDescriptionChange={__description => {
          this.setState({__description});
        }}
        onImageChange={this.onImageChange}
        deleteImage={this.deleteImage}
        cropImage={this.cropImage}
        onGenderChange={(__gender) => this.setState({__gender})}
        onFocusChange={focusedInput => this.setState({focusedInput})}
        setDefaultImage={(__defaultImageIndex) => {
          this.setState({__defaultImageIndex});
        }}

        onDatesChange={(__startDate, __endDate) => {
          this.setState({__startDate, __endDate}, () => this.StartInput.focus());
        }}

        handleFocusStart = {(input) =>  this.StartInput = input }
        handleFocusEnd = {(input) =>  this.EndInput = input }

        onDayAdd={data => {
          this.setState({__weekDays: [...__weekDays ? __weekDays : {}, data]});
        }}

        onDayRemove={data => {
          let days = __weekDays.filter(item => item.value !== data.value);
          this.setState({__weekDays: days});
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
        goBackToEvents={goBackToEvents}
        confirmed={confirmed}

        daysOfWeekOptions={[
          {
            value: 0,
            label: 'MON'
          },
          {
            value: 1,
            label: 'TUE'
          },
          {
            value: 2,
            label: 'WED'
          },
          {
            value: 3,
            label: 'THU'
          },
          {
            value: 4,
            label: 'FRI'
          },
          {
            value: 5,
            label: 'SAT'
          },
          {
            value: 6,
            label: 'SUN'
          },
        ]}
      />
    );
  }
}

function mapStateToProps(store) {
  return {
    accessToken: store.auth.accessToken,
    placeHobbies: store.user.placeDetails ? store.user.placeDetails.hobbies : null,
    placeCalendar: store.user.placeDetails ? store.user.placeDetails.calendar : null,
    profHobbies: store.user.profDetails ? store.user.profDetails.hobbies : null,
    childrenHobbiesList: store.hobbies.forChildren,
    userHaveChildrens: !!store.user.children.length,
    userRoles: store.user.roles.filter(e => e.code !== 'member'),
    gendersList: store.genders.list,
    hobbiesList: store.hobbies.list,
    UIVersion: store.app.UIVersion,
    confirmed: store.user.confirmed,
  };
}

export {CreateEventFormContainer as CreateEventFormContainerWithoutDecorators};
export default connect(mapStateToProps)(withRouter(CreateEventFormContainer));
