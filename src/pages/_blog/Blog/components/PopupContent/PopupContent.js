import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import slugify from 'slugify';
import Comments from '../../../../../components/Comments';
import Shares from '../../../../../components/Shares';
import config from '../../../../../config';
import s from './PopupContent.scss';
import { I18n } from "react-redux-i18n";
import { Link } from 'react-router-dom';

const PopupContent = ({
  data: {
    id: postId,
    image,
    title,
    content,
    favorite,
    owner,
  },
  postedLike,
  tags,
  postHasTags,
  actionButtonsList,
}) => (
  <div className={s.root}>
    <div className={s.title}>
      {title}
    </div>

    <div className={s.poster}>
      <div className={s.image}>
        <img src={image.src} alt={title} />
      </div>
    </div>

    <div className={s.controls}>
      {
        !!actionButtonsList && !!actionButtonsList.length && (
          <div className={s.actionButtons}>
            { actionButtonsList }
            <span id="url_field_Post" className={s.hidden}>{config.uiUrl}/blog/post/{postId}</span>
          </div>
        )
      }
      <Shares
        isPopup
        title={title}
        shareUrl={`/blog/post/${slugify(title)}-${postId}`}
      />
    </div>

    <div className={s.ownerDetails}>
      <div>
        {
          (owner.avatar && (
            <img src={owner.avatar.src} alt={owner.fullName} />
          )) || (
            <i className="icon-man"/>
          )
        }
      </div>
      <div className={s.aside}>
        <h4>{owner.fullName}</h4>
        <Link
          target="_blank"
          to={`/${postedLike()}/${slugify(owner.fullName)}-${owner.id}`}
        >
          {I18n.t('general.elements.viewProfile')}
        </Link>
      </div>
    </div>

    <div
      id='links'
      className={s.content}
      dangerouslySetInnerHTML={{__html: content}}
    />
    {
      postHasTags && (
        <div className={s.tags}>
          {tags}
        </div>
      )
    }

    <Comments
      identifierId={postId}
      identifier={`blog-${postId}`}
      identifierName={title}
      identifierType='posts'
    />
  </div>
);

export {PopupContent as PopupContentWithoutDecorators};
export default withStyles(s)(PopupContent);
