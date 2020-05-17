import React, { Component } from 'react';
import Popup from "../../../_popup/Popup/Popup";
import classes from 'classnames';
import update from 'immutability-helper';
import Form from './Form';

import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";
import {ContentState, convertToRaw, EditorState} from "draft-js";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";

class ListItem extends Component {
  constructor(props, context) {
    super(props, context);
    const { data } = this.props;

    this.state = {
      schedule: data.schedule || '',
      location: data.location,
      isDefault: data.default,
      __region: data.region,
      __schedule: data.schedule || '',
      __description: data.description ? this.getEditorStateFromHTML(data.description) : '',
      __location: data.location,
      __images: data.gallery ? data.gallery.images.map(({
        id,
        src,
        source,
        ...rest,
      }) => ({
        source: id || source,
        preview: src || source.preview,
        ...rest,
      })) : [],
      __defaultImageIndex:  data.gallery ? data.gallery.images.findIndex(image =>
        image.default
      ) : null,
      editMode: false,
    };
  };

  componentWillReceiveProps(nextprops){
    const { data } = nextprops;

    this.setState({
      schedule: data.schedule,
      location: data.location,
      isDefault: data.default,
      description: data.description,
    })
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

  render() {
    const {
      editMode,
      schedule,
      location,
      isDefault,
      __schedule,
      __images,
      __location,
      __region,
      __defaultImageIndex,
      __description,
    } = this.state;

    const {
      onPlaceRemove,
      onUpdate,
      isMobile,
    } = this.props;

    return(
      <div>
        {
          editMode && (
            <Popup
              notShowCloser
              onClose={() => {
                this.setState({editMode: !editMode,})
              }}
            >
              <Form
                __schedule={__schedule}
                __images={__images}
                __defaultImageIndex={__defaultImageIndex}
                __location={__location}
                __isDefault={isDefault}
                isMobile={isMobile}
                __description={__description}
                onDescriptionChange={__description => this.setState({__description})}
                onSubmit={() => {
                  if(!!__images.length && __location && __description !== '') {
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
                      region: __location.country_init || __region,
                      default: isDefault,
                    };
                    this.setState({
                      editMode: false,
                    }, () => {
                      onUpdate(newBranch)
                    })
                  }
                }}

                onLocationChange={__location => {
                  this.setState({__location})
                }}

                onSetAsDefault={() =>
                  this.setState({isDefault: !isDefault})
                }

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
        <div className={s.listItem}>
          <span>
            {
              schedule &&(
                `${schedule}, `
              )
            }

            {`${location.label}`}</span>
          <div className={classes(s.options, {
            [s.mobile]: isMobile
          })}>
            <i
              className={`${s.optionsItem} icon-edit-o`}
              onClick={() => {
                this.setState({
                  editMode: !editMode,
                })
              }}
            />
            <i
              className={`${s.optionsItem} icon-remove-o`}
              onClick={onPlaceRemove}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(s)(ListItem);
