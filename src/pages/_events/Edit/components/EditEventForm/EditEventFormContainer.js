import PropTypes from 'prop-types';
import { connect } from "react-redux";
import moment from "moment";
import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { toString, cloneDeep, forEach } from 'lodash';
import { fetchAuthorizedApiRequest } from '../../../../../fetch';
import { receiveEditEvent } from '../../../../../actions/events';
import { UnprocessableEntity, InternalServerError } from '../../../../../exceptions/http';
import { CreateEventFormContainerWithoutDecorators } from '../../../Create/components/CreateEventForm/CreateEventFormContainer';
import {withRouter} from "react-router";

class EditEventFormContainer extends CreateEventFormContainerWithoutDecorators {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      gallery: PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        images: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
            default: PropTypes.bool.isRequired,
          })).isRequired,
      }).isRequired,
      createdAt: PropTypes.number.isRequired,
      updatedAt: PropTypes.number.isRequired,
      location: PropTypes.shape({
        label: PropTypes.string,
        longitude: PropTypes.number.isRequired,
        latitude: PropTypes.number.isRequired,
      }).isRequired,
      hobbies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          image: PropTypes.shape({
            id: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
          }),
        })
      ).isRequired,
      owner: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
        shortName: PropTypes.string,
        avatar: PropTypes.shape({
          id: PropTypes.string.isRequired,
          src: PropTypes.string.isRequired,
        }),
      }),
      since: PropTypes.number.isRequired,
      until: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      going: PropTypes.bool.isRequired,
    }).isRequired,
    isFetching: PropTypes.bool,
    onFetchingStateChange: PropTypes.func,
    beforeSubmit: PropTypes.func,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    onFormDataChange: PropTypes.func,
  };

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

  defaultState() {
    const {
      data: {
        title: __title,
        ticketURL: __ticketURL,
        description: __description,
        gallery,
        location,
        hobbies,
        since,
        until,
        gender,
        calendar,
        days,
      },
    } = this.props;

    this.setInitialFormData({
      __weekDays: days.map(({day, dayName}) => ({
      value: day,
      label: dayName,
    })),
      __images: gallery.images.map(({id, src}) => ({
        source: id,
        preview: src,
      })),
      __defaultImageIndex: gallery.images.findIndex(image => image.default),
      __title,
      __ticketURL,
      __description,
      __startDate: moment.unix(since),
      __endDate: moment.unix(until),
      __typeofRange: days.length ?
        {
          value: 'periodic',
          label: 'Periodic'
        } : {
          value: 'daily',
          label: 'Zilnic'
        },
      __timeStart: moment.unix(since).format('HH:mm'),
      __timeEnd: moment.unix(until).format('HH:mm'),
      __formattedAddress: toString(location.label),
      __latitude: location.latitude,
      __longitude: location.longitude,
      __gender: {
         value: gender.id,
         label: gender.name
      },
      __filterCalendar: calendar.filters.length ?  {
        value: calendar.filters[0].id,
        label: calendar.filters[0].name
      } : null,
      __hobbies: hobbies.map(({
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
      ))),
    });

    return {
      ...cloneDeep(
        this.getInitialFormData()
      ),
      __description: this.getEditorStateFromHTML(__description)
    };
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

  getFormData() {
    let formData = super.getFormData();

    formData.append('_method', 'PUT');

    return formData;
  }

  submitFormData() {
    const {
      dispatch,
      accessToken,
      data,
      beforeSubmit,
      goBackToEvents,
      onError,
    } = this.props;

    const {
      id: eventId,
    } = data;

    this.toggleIsFetchingState(true);

    if (beforeSubmit instanceof Function) {
      beforeSubmit();
    }

    this.submitFormDataFetcher = dispatch(
      fetchAuthorizedApiRequest(`/v1/events/${eventId}`, {
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
          case 200:

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
            receiveEditEvent(data)
          )
        });

        return Promise.resolve();
      })
      .then(
        () => {
          this.toggleIsFetchingState(false);

          goBackToEvents();
        },
        e => {
          this.toggleIsFetchingState(false);

          if (onError instanceof Function) {
            onError(e);
          }
        }
      );
  }
}

function mapStateToProps(store) {
  return {
    accessToken: store.auth.accessToken,
    userHobbies: store.user.hobbies || [],
    gendersList: store.genders.list,
    hobbiesList: store.hobbies.list,
    placeHobbies: store.user.placeDetails ? store.user.placeDetails.hobbies : null,
    profHobbies: store.user.profDetails ? store.user.profDetails.hobbies : null,
    childrenHobbiesList: store.hobbies.forChildren,
    userHaveChildrens: !!store.user.children.length,
    UIVersion: store.app.UIVersion,
    userRoles: store.user.roles,
    confirmed: store.user.confirmed,
    placeCalendar: store.user.placeDetails ? store.user.placeDetails.calendar : null,
  };
}


export default connect(mapStateToProps)(withRouter(EditEventFormContainer));
