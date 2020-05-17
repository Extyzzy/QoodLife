import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { confirm } from '../../../_popup/Confirm/confirm';
import classes from 'classnames';
import Popup from "../../../_popup/Popup/Popup";
import update from 'immutability-helper';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";

import View from './View';
import Form from './Form';
import draftToHtml from "draftjs-to-html";
import {convertToRaw} from "draft-js";

class Loctions extends Component {
  constructor(props, context) {
    super(props, context);

    const { branches } = this.props;

    this.state = {
      branchesList: branches || [],
      displayForm: false,
      isDefault: branches.length === 0,
      __schedule: '',
      __description: '',
      __images: [],
      __defaultImageIndex: 0,
      __location: null,
      __default: branches.default,
    };
  };

  componentWillReceiveProps(nextProps) {
    const { branches } = nextProps;

    if (branches.length === 1 ) {
      this.setState({isDefault: false})
    }
  }

  render() {
    const {
      onChange,
      isMobile,
    } = this.props;

    const {
      branchesList,
      displayForm,
      isDefault,
      __schedule,
      __images,
      __location,
      __defaultImageIndex,
      __default,
      __description,
    } = this.state;

    return (
      <div className={s.root}>
        <View
          branchesList={branchesList}
          isMobile={isMobile}
          onUpdate={(place, index) => {
            if(place.default){
              const defaultBranch = branchesList.findIndex(b => b.default);

              if (defaultBranch !== -1) {
                branchesList[defaultBranch].default = false;
              }
            }

            branchesList[index] = place;
            this.setState({branchesList}, () =>
              onChange(branchesList)
            );
          }}

          onPlaceRemove={(i) => {
            confirm(I18n.t('general.components.multipleAdd.confirmDeleteBranch')).then(() => {
              this.setState({
                branchesList: [
                  ...branchesList.slice(0, i),
                  ...branchesList.slice(i + 1)
                ],
                displayForm: false
              }, () => {
                onChange([
                  ...branchesList.slice(0, i),
                  ...branchesList.slice(i + 1)
                ])
              });
            });
          }}
        />
        {
          displayForm && (
            <Popup
              className={s.popUpModifier}
              notShowCloser
              onClose={() => {
                this.setState({displayForm: false})
              }}
            >
              <Form
                __description={__description}
                __schedule={__schedule}
                __images={__images}
                __location={__location}
                __isDefault={isDefault}
                branchesList={branchesList}
                __defaultImageIndex={__defaultImageIndex}
                isMobile={isMobile}
                __default={__default}
                onDescriptionChange={__description => this.setState({__description})}
                onClose={() => {
                  this.setState({displayForm: false})
                }}
                onSubmit={() => {
                  if(!!__images.length && __location  && __description !== '' ) {
                    const newBranch = {
                      schedule: __schedule,
                      description: draftToHtml(
                        convertToRaw(
                          __description.getCurrentContent()
                        )
                      ),
                      gallery: {
                        images: __images.map((img, i) => ({...img, default: i === __defaultImageIndex}))
                      },
                      location: __location,
                      region: __location.country_init,
                      default: isDefault,
                    };

                    if(isDefault){
                      const defaultBranchIndex = branchesList.findIndex(branch => branch.default);

                      if (defaultBranchIndex !== -1) {
                        branchesList[defaultBranchIndex].default = false;
                        this.setState({branchesList})
                      }
                    }

                    this.setState({
                      branchesList: branchesList.concat(newBranch),
                      displayForm: false,
                      __schedule: '',
                      __description: '',
                      __images: [],
                      __defaultImageIndex: 0,
                      __location: null,
                      default: __default,
                    }, () => {
                      onChange(branchesList.concat(newBranch))
                    })
                  }
                }}

                onSetAsDefault={() =>
                  this.setState({isDefault: !isDefault})
                }

                onLocationChange={__location => {
                  this.setState({__location})
                }}

                setDefault={(__default) => {
                  this.setState({__default});
                }}

                onImageChange={(attachments) => {
                  this.setState({
                    __images: [
                      ...__images,
                      ...attachments,
                    ],
                  });
                }}

                setDefaultImage={(__defaultImageIndex) => {
                  this.setState({__defaultImageIndex});
                }}

                onDeleteImage={(i) => {
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
                }}

                onCropImage={(i, crop, size) => {
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
                }}

                onScheduleChange={({target: {value: __schedule}}) => {
                  this.setState({__schedule})
                }}
              />
            </Popup>
          )
        }
        <div className={s.listItem}
          onClick={() => this.setState({displayForm: !displayForm})}
        >
          <span>
            {(!branchesList.length && I18n.t('general.components.multipleAdd.branchesNotFound')) || ` `}
          </span>
          <div className={classes(s.options, {
            [s.mobile]: isMobile
          })}>
            <i
              className={`${s.optionsItem} icon-plus-o`}
              onClick={() => {
                this.setState({
                  displayForm: true,
                })
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Loctions);
