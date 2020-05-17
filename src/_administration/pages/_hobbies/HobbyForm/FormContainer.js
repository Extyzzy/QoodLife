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
      hobbyIsPublic: false,
      availableForFav: false,
      errors: null,
      options: null,
      age_groups_list: null,
      age_interval: null,
      audience: null,
      name: '',
      defaultName: '',
      image: null,
      place_titles: null,
      professional_titles: null,
      hobby_filters: null,
      parent_category: null,
      hobbyDetails: null,
      categoryDetails: null,
      filter_titles: null,
      eighteenPlus: false,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: {
          hobbyId,
          categoryId,
        },
      },
    } = this.props;

    if(hobbyId){
      this.getHobbydata(hobbyId);
    }

    if(categoryId){
      this.getCategoryData(categoryId)
    }

    this.getAgeGroupsList()
  }

  componentWillUnmount() {
    const {
      match: {
        params: {
          hobbyId,
          categoryId,
        },
      },
    } = this.props;

    if (hobbyId && this.fetchHobbyDetailsFetcher instanceof Promise) {
      this.fetchHobbyDetailsFetcher.cancel();
    }

    if (categoryId && this.fetchCategoryDetailsFetcher instanceof Promise) {
      this.fetchCategoryDetailsFetcher.cancel();
    }

    if(this.ageGroupsFetcher instanceof Promise) {
      this.ageGroupsFetcher.cancel();
    }
  }

  getHobbydata(hobbyId) {
    const {accessToken, dispatch} = this.props;

    this.fetchHobbyDetailsFetcher = dispatch(
      fetchAuthorizedApiRequest(`/v1/hobbies/${hobbyId}`, {
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
      .then((hobbyDetails) => {
        const {
          image,
          titles,
          audience,
          ageGroups,
          can_be_favorite,
          is_for_18,
          filters,
        } = hobbyDetails;

        this.setState({
          hobbyDetails,
          filtersHobby: hobbyDetails.filters,
          name: hobbyDetails.name,
          defaultName: hobbyDetails.allNames.name_ro,
          hobbyIsPublic: hobbyDetails.public,
          audience: this.getHobbyAudience(audience),
          age_interval: ageGroups
            ? ageGroups.map(({name, ...rest}) => ({
              value: rest,
              label: name,
            }))
            : null,
          image: {
            source: image.id,
            preview: image.src,
          },
          availableForFav: can_be_favorite,
          eighteenPlus: is_for_18,
          place_titles: titles.place,
          professional_titles: titles.professional,
          hobby_filters: filters,
        }, () => {
          this.setState({isLoaded: true})
        });
      });
  }

  getCategoryData(categoryId) {
    this.fetchCategoryDetailsFetcher = fetchApiRequest(`/v1/hobbies/categories/${categoryId}`);
    this.fetchCategoryDetailsFetcher
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
        this.setState({
          categoryDetails,
          parent_category: {
            value: categoryDetails.category.id,
            label: categoryDetails.category.name
          },
        }, () => this.getCategoriesList());
      });
  }

  getCategoriesList() {
    const { categoryDetails } = this.state;
    let options = [];

    this.categoriesFetcher = fetchApiRequest(`/v1/hobbies/categories`);
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
        forEach(categories.list, ({
          id,
          name,
          for_children,
          children
        }) => {
          if (!!children.length) {
            children.forEach(({
              id: subId,
              name: subName,
              children: subChildren,
              for_children: sub_for_children
            }) => {
              if(
                !subChildren.length
                  && categoryDetails.category.for_children === sub_for_children
              ){
                options.push({
                  value: subId,
                  label: subName,
                })
              }
            })
          } else {
            if(categoryDetails.category.for_children === for_children){
              options.push({
                value: id,
                label: name,
              })
            }
          }
        });
      })
      .then(() => {
        this.setState({options})
      })
  }

  getHobbyAudience(slug){
    const audienceoptions = [
      {value: 'all', label: 'all'},
      {value: 'children', label: 'copii'},
      {value: 'adults', label: 'adulti'}
    ];

    return audienceoptions.find(option => option.value === slug) || null;
  }

  getAgeGroupsList(){
    let options = [];

    this.ageGroupsFetcher = fetchApiRequest(`/v1/hobbies/age-groups`);
    this.ageGroupsFetcher
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
      .then((groups) => {
        forEach(groups.list, ({name, ...rest}) => {
          options.push({
            value: rest,
            label: name,
          })
        });
      })
      .then(() => {
        this.setState({age_groups_list: options})
        return Promise.resolve();
      })
  }

  async updateHobbyTitles(){
    const { place_titles, professional_titles, hobby_filters } = this.state;
    this.promisesList = [];

      if(place_titles && !!place_titles.length){
        for (let title of place_titles) {
          if(title.id){
            this.promisesList.push(this.updateTitle('places', title.id, title.name));
          } else {
            this.promisesList.push(this.addTitle('places', title.name));
          }
        }
      }

      if(professional_titles && !!professional_titles.length){
        for (let title of professional_titles) {
          if(title.id){
            this.promisesList.push(this.updateTitle('professionals', title.id, title.name));
          } else {
            this.promisesList.push(this.addTitle('professionals', title.name));
          }
        }
      }

      if(hobby_filters && !!hobby_filters.length){
        for (let filter of hobby_filters) {
          if(filter.id){
            this.promisesList.push(this.updateFilter(filter.id, filter.name));
          } else {
            this.promisesList.push(this.addFilter(filter.name));
          }
        }
      }
  }

  getFormDataFromTitles(name) {
    const {
      match: {
        params: {
          hobbyId,
        },
      },
    } = this.props;

    const data = {
      name: name,
      hobby: hobbyId,
      name_ro: this.state.defaultName,
    };


    this.addLangShortToKeyName(data);

    return appendToFormData(
        new FormData(),
        data,
        'title',
      );
  }

  getFormDataFromFilters(name) {
    const data = {
      name: name,
      name_ro: name,
    };

    this.addLangShortToKeyName(data);

    return appendToFormData(
        new FormData(),
        data,
        'filter',
      );
  }

  getFormDataFromTitlesOnUpdate(content, group, titleId) {
    const {hobbyDetails} = this.state;

    let thisNames;

    if (group === 'places') {
      thisNames = hobbyDetails.titles.place.find(data => data.id === titleId);
    }

    if  (group === 'professionals') {
      thisNames = hobbyDetails.titles.professional.find(data => data.id === titleId);
    }

    const data = {
      name: content,
      name_ro: thisNames.allNames.name_ro,
    };

    this.addLangShortToKeyName(data);

    return appendToFormData(
        new FormData(),
        data,
        'title',
      );
  }

  getFormDataFromFiltersOnUpdate(content, filterId) {
   const {filtersHobby} = this.state;

    const thisFilter = filtersHobby.find(data => data.id === filterId);

    const data = {
      name: content,
      name_ro: thisFilter.allNames.name_ro,
    };

    this.addLangShortToKeyName(data);

    return  appendToFormData(
        new FormData(),
        data,
        'filter',
      );
  }

  getFormDataOnUpdateFromFilters(content, filterId) {
    let formData = this.getFormDataFromFiltersOnUpdate(content, filterId);
    formData.append('_method', 'PUT');

    return formData;
  }

  getFormDataOnUpdateFromTitles(content, group, titleId) {
    let formData = this.getFormDataFromTitlesOnUpdate(content, group, titleId);
    formData.append('_method', 'PUT');

    return formData;
  }

  addFilter(content) {
    const {
      match: { params: { hobbyId } },
      accessToken,
      dispatch,
    } = this.props;

    return (
      this.submitFilterFormDataFetcher = dispatch(
        fetchAuthorizedApiRequest(`/v1/hobbies/${hobbyId}/filters`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: this.getFormDataFromFilters(content),
        })
      )
    )
  }

  addTitle(group, content) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    return (
      this.submitTitleFormDataFetcher = dispatch(
        fetchAuthorizedApiRequest(`/v1/hobbies/titles/${group}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: this.getFormDataFromTitles(content),
        })
      )
    )
  }

  updateTitle(group, titleId, content){
    const {
      dispatch,
      accessToken,
    } = this.props;

    return(
      this.submitTitleFormDataFetcher = dispatch(
        fetchAuthorizedApiRequest(`/v1/hobbies/titles/${group}/${titleId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: this.getFormDataOnUpdateFromTitles(content, group, titleId),
        })
      )
    )
  }

  updateFilter(filterId, name) {
    const {
      match: { params: { hobbyId } },
      dispatch,
      accessToken,
    } = this.props;

    return(
      this.submitTitleFormDataFetcher = dispatch(
        fetchAuthorizedApiRequest(`/v1/hobbies/${hobbyId}/filters/${filterId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: this.getFormDataOnUpdateFromFilters(name, filterId),
        })
      )
    )
  }

  async executePromises() {
    for (let promise of this.promisesList) {
      await promise.then(response => {
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
    }
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

   getFormData() {
    const {
      match: {
        params: {
          categoryId,
        },
      },
    } = this.props;

    const {
      name,
      image,
      audience,
      age_interval,
      parent_category,
      availableForFav,
      categoryDetails,
      eighteenPlus,
      hobbyIsPublic,
      defaultName
    } = this.state;

    const data = {
      name: name,
      name_ro: defaultName,
      public: hobbyIsPublic,
      audience: categoryDetails.category.for_children
        ? 'children'
        : audience.value,
      ageGroups: age_interval
        ? age_interval.map(interval => interval.value.id)
        : null,
      category: parent_category? parent_category.value : categoryId,
      can_be_favorite: availableForFav,
      is_for_18: eighteenPlus,
      image: image ? {
        source: image.source,
        crop: image.crop,
      } : null,
    };

     const formData = this.addLangShortToKeyName(data);

     return appendToFormData(new FormData(), formData, 'hobby')
  }

  getFormDataOnUpdate() {
    let formData = this.getFormData();
    formData.append('_method', 'PUT');

    return formData;
  }

  submitForm() {
    const {
      dispatch,
      history,
      accessToken,
      match: {
        params: {
          categoryId,
          hobbyId,
        },
      },
    } = this.props;

    this.setState({
      isFetching: true,
    }, () => {
      this.submitFormDataFetcher = dispatch(
        fetchAuthorizedApiRequest(`/v1/hobbies${(hobbyId ? `/${hobbyId}` : '')}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: hobbyId? this.getFormDataOnUpdate() : this.getFormData(),
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
                  errors,
                  isFetching: false
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
            history.push(`/administration/hobbies/${categoryId}`);
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
      image,
      place_titles,
      professional_titles,
      hobby_filters,
      parent_category,
      hobbyDetails,
      categoryDetails,
      availableForFav,
      isFetching,
      isLoaded,
      options,
      errors,
      filter_titles,
      audience,
      age_groups_list,
      age_interval,
      eighteenPlus,
      hobbyIsPublic,
    } = this.state;

    const {
      userLanguage,
      match: {
        params: {
          hobbyId
        },
      },
    } = this.props;

    const audienceOptionsForAdults = [
      {value: 'adults', label: 'adulti'},
      {value: 'children', label: 'copii'},
      {value: 'all', label: 'all'},
    ];

    return (
      <Form
        name={name}
        image={image}
        audience={audience}
        hobbyIsPublic={hobbyIsPublic}
        age_groups_list={age_groups_list}
        age_interval={age_interval}
        place_titles={place_titles}
        professional_titles={professional_titles}
        filter_titles={filter_titles}
        hobby_filters={hobby_filters}
        parent_category={parent_category}
        hobbyDetails={hobbyDetails}
        availableForFav={availableForFav}
        categoryDetails={categoryDetails}
        avalaibleCategoriesList={options}
        audienceOptionsForAdults={audienceOptionsForAdults}
        errors={errors}
        editMode={!!hobbyId}
        isFetching={isFetching}
        isLoaded={isLoaded}
        userLanguage={userLanguage}
        eighteenPlus={eighteenPlus}

        onEighteenPlusStatusChange={() => {
          this.setState({eighteenPlus: !eighteenPlus})
        }}

        publicStatusChange={() => {
          this.setState({hobbyIsPublic: !hobbyIsPublic})
        }}

        onFavAvailabilityStatusChange={() => {
          this.setState({availableForFav: !availableForFav})
        }}

        onCancelForm={() => {
          if(categoryDetails){
            this.props.history.push(
              `/administration/hobbies/${categoryDetails.category.id}`
            )
          }
        }}

        onFilterTitlesChange={filter_titles => this.setState({filter_titles})}
        onAudienceAgeIntervalChange={age_interval => this.setState({age_interval})}

        onPlaceTitlesChance={place_titles => {
          this.setState({place_titles});
        }}

        onProfessionalTitlesChange={professional_titles => {
          this.setState({professional_titles});
        }}

        onHobbyFiltersChange={hobby_filters => {
          this.setState({hobby_filters});
        }}

        onAudienceChange={audience => this.setState({
          audience,
          age_interval: null
        })}

        onParentChange={parent_category => this.setState({parent_category})}

        onHobbyNameChange={(e) => {
          this.setState({name: e.target.value});
        }}

        onImageChange={([image]) => {
          this.setState({
            image,
          });
        }}

        deleteImage={() => {
          this.setState({
            image: null,
          });
        }}

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

          this.updateHobbyTitles()
          .then(() => {
            this.setState({isFetching: true}, () => {
              this.executePromises()
              .then(() => {
                this.submitForm()
              })
            })
          });
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    permissions: state.user.permissions,
    userLanguage: state.user.language,
  };
}

export default withRouter(connect(mapStateToProps)(FormContainer));
