import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { cloneDeep, forEach } from 'lodash';
import { fetchAuthorizedApiRequest } from '../../../../../fetch';
import { receiveEditPost } from '../../../../../actions/posts';
import { UnprocessableEntity, InternalServerError } from '../../../../../exceptions/http';
import { CreatePostFormContainerWithoutDecorators } from '../../../Create/components/CreatePostForm/CreatePostFormContainer';
import {withRouter} from "react-router";

class EditPostFormContainer extends CreatePostFormContainerWithoutDecorators {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.shape({
        id: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired,
      }).isRequired,
      intro: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.number.isRequired,
      updatedAt: PropTypes.number.isRequired,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          tag: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        })
      ),
      hobbies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          image: PropTypes.shape({
            id: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
          }).isRequired,
        })
      ).isRequired,
      owner: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
        shortName: PropTypes.string,
      }),
      favorite: PropTypes.bool.isRequired,
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
      title: __title,
      intro: __intro,
      content,
      image,
      tags,
      hobbies,
      language,
      gender,
    } = data;

    this.setInitialFormData({
      __title,
      __intro,
      __content: content,
      __gender: {
        value: gender.id,
        label: gender.name
      },
      __image: {
        source: image.id,
        preview: image.src,
      },
      __languages: {
        value: language.id,
        label: language.full,
      },
      __tags: tags.map(({id, tag: text}) => ({id, text})),
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
      __content: this.getEditorStateFromHTML(content),
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
      goBackToPosts,
      onError,
    } = this.props;

    const {
      id: postId,
    } = data;

    this.toggleIsFetchingState(true);

    if (beforeSubmit instanceof Function) {
      beforeSubmit();
    }

    this.submitFormDataFetcher = dispatch(
      fetchAuthorizedApiRequest(`/v1/posts/${postId}`, {
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
            receiveEditPost(data)
          )
        });

        return Promise.resolve();
      })
      .then(
        () => {
          this.toggleIsFetchingState(false);

          goBackToPosts();
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
    blogLanguagesList: store.blogLanguages.list,
    accessToken: store.auth.accessToken,
    gendersList: store.genders.list,
    hobbiesList: store.hobbies.list,
    childrenHobbiesList: store.hobbies.forChildren,
    userHaveChildrens: !!store.user.children.length,
    UIVersion: store.app.UIVersion,
    userRoles: store.user.roles,
    confirmed: store.user.confirmed,
  };
}

export default connect(mapStateToProps)(withRouter(EditPostFormContainer));
