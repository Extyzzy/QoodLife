import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { cloneDeep, forEach, filter } from 'lodash';
import { fetchAuthorizedApiRequest } from '../../../../../fetch';
import { receiveEditProduct } from '../../../../../actions/products';
import { UnprocessableEntity, InternalServerError } from '../../../../../exceptions/http';
import { CreateProductFormContainerWithoutDecorators } from '../../../Create/components/CreateProductForm/CreateProductFormContainer';
import {withRouter} from "react-router";

class EditProductFormContainer extends CreateProductFormContainerWithoutDecorators {
    static propTypes = {
        data: PropTypes.shape({
            title: PropTypes.string.isRequired,
            gallery: PropTypes.shape({
                images: PropTypes.arrayOf(
                    PropTypes.shape({
                        src: PropTypes.string.isRequired,
                        default: PropTypes.bool.isRequired,
                    })).isRequired,
            }).isRequired,
            description: PropTypes.string.isRequired,
            favorite: PropTypes.bool.isRequired,
        }).isRequired,
        isFetching: PropTypes.bool,
        onFetchingStateChange: PropTypes.func,
        beforeSubmit: PropTypes.func,
        onSuccess: PropTypes.func,
        onError: PropTypes.func,
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
            title: __title,
            description: __description,
            gallery,
            hobbies,
            gender,
            brand,
        } = this.props.data;

        this.setInitialFormData({
            __images: gallery.images.map(({id, src})=> ({
              source: id,
              preview: src,
            })),
            __defaultImageIndex: gallery.images.findIndex(image => image.default),
            __title,
            __description,
            __hobbies: hobbies.map(({
              id: value,
              name: label,
              audience,
              ageGroups,
              dataFromPivotTable,
              filters,
            }) => (
              this.regenerateHobbyFilters(value, label, filters, audience, ageGroups, dataFromPivotTable))),
            __brand: {value: brand.id, label: brand.name},
            __suggestedBrand: brand.name,
            __gender: {
              value: gender.id,
              label: gender.name
            },
        });

        return {
          ...cloneDeep(
              this.getInitialFormData()
          ),
          __description: this.getEditorStateFromHTML(__description)
        };
    }

    regenerateHobbyFilters(hobbyId, hobbyLabel, hobbyFilters, audience, ageGroups, dataFromPivotTable) {
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
          filters: hobbyFilters,
          ageGroups,
          audience,
        },
        ageGroups: currentHobbyAgeGroups,
        titles: filter(hobbyFilters, t => dataFromPivotTable.filters.find(f => f === t.id)),
        audience
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
          goBackToProducts,
          onError,
        } = this.props;

        const {
            id: productId,
        } = data;

        this.toggleIsFetchingState(true);

        if (beforeSubmit instanceof Function) {
            beforeSubmit();
        }

        this.submitFormDataFetcher = dispatch(
            fetchAuthorizedApiRequest(`/v1/products/${productId}`, {
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
                        receiveEditProduct(data)
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
}

function mapStateToProps(store) {
  return {
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

export default connect(mapStateToProps)(withRouter(EditProductFormContainer));
