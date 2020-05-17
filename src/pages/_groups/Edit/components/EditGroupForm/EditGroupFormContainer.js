import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { cloneDeep, forEach } from 'lodash';
import { fetchAuthorizedApiRequest } from '../../../../../fetch';
import { receiveEditGroup } from '../../../../../actions/groups';
import { UnprocessableEntity, InternalServerError } from '../../../../../exceptions/http';
import { CreateGroupFormContainerWithoutDecorators } from '../../../Create/components/CreateGroupForm/CreateGroupFormContainer';
import moment from "moment";
import {withRouter} from "react-router";

class EditGroupFormContainer extends CreateGroupFormContainerWithoutDecorators {
    static propTypes = {
        data: PropTypes.shape({
            id: PropTypes.string.isRequired,
            size: PropTypes.number.isRequired,
            gallery: PropTypes.shape({
                images: PropTypes.arrayOf(
                    PropTypes.shape({
                        src: PropTypes.string.isRequired,
                        default: PropTypes.bool.isRequired,
                    })).isRequired,
            }).isRequired,
            event: PropTypes.shape({
                location: PropTypes.shape({
                    label: PropTypes.string,
                    longitude: PropTypes.number.isRequired,
                    latitude: PropTypes.number.isRequired,
                }).isRequired,
                since: PropTypes.number.isRequired,
                until: PropTypes.number.isRequired,
            }),
            hobbies: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    name: PropTypes.string.isRequired,
                })).isRequired,
            members: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    fullName: PropTypes.string.isRequired,
                    shortName: PropTypes.string.isRequired,
                    owner: PropTypes.bool.isRequired,
                    avatar: PropTypes.shape({
                      id: PropTypes.string.isRequired,
                      src: PropTypes.string.isRequired,
                    }),
                })).isRequired,
            location: PropTypes.shape({
                label: PropTypes.string,
                longitude: PropTypes.number.isRequired,
                latitude: PropTypes.number.isRequired,
            }),
            since: PropTypes.number,
            until: PropTypes.number,
            details: PropTypes.string.isRequired,
            isFull: PropTypes.bool,
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
      const { data } = this.props;

      const {
          name: __name,
          details: __details,
          size: __amount,
          gallery,
          since,
          until,
          location,
          hobbies,
          event,
          gender,
          postedLike,
      } = data;

      this.setInitialFormData({
        __images: gallery.images.map(({id, src})=> ({
          source: id,
          preview: src,
        })),
        __gender: {
          value: gender.id,
          label: gender.name
        },
        __defaultImageIndex: gallery.images.findIndex(i => i.default),
        __name,
        __details,
        __amount,
        __startDate: event ? moment.unix(event.since) : since ? moment.unix(since) : null,
        __endDate: event ? moment.unix(event.until) : until ? moment.unix(until) : null,
        __formattedAddress: event ? event.location.label : location.label,
        __latitude: event ? event.location.latitude : location.latitude,
        __longitude: event ? event.location.longitude : location.longitude,
        __hobbies: !event ? hobbies.map(({
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
        ))) : null,
        __event: event ? {value: event.id, label: event.title} : null,
        __userRoles: {
          value: postedLike.id,
          label: postedLike.name
        },
      });

      return {
        ...cloneDeep(
          this.getInitialFormData()
        ),
        __details: this.getEditorStateFromHTML(__details)
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
        ageGroups: currentHobbyAgeGroups,
        audience,
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
        goBackTogGroups,
        onError,
      } = this.props;

      const {
        id: groupId,
      } = data;

      this.toggleIsFetchingState(true);

      if (beforeSubmit instanceof Function) {
        beforeSubmit();
      }

      this.submitFormDataFetcher = dispatch(
        fetchAuthorizedApiRequest(`/v1/groups/${groupId}`, {
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
                  receiveEditGroup(data)
              )
          });

          return Promise.resolve();
        })
        .then(
          () => {
            this.toggleIsFetchingState(false);

            goBackTogGroups();
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
    gendersList: store.genders.list,
    hobbiesList: store.hobbies.list,
    childrenHobbiesList: store.hobbies.forChildren,
    userHaveChildrens: !!store.user.children.length,
    UIVersion: store.app.UIVersion,
    user: store.user,
    userRoles: store.user.roles,
  };
}

export default connect(mapStateToProps)(withRouter((EditGroupFormContainer)));
