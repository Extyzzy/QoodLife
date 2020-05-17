import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import slugify from 'slugify';
import s from './Post.scss';
import Comments from '../../../components/Comments';
import Shares from '../../../components/Shares';
import Layout from '../../../components/_layout/Layout/Layout';
import {I18n} from "react-redux-i18n";
import config from '../../../config';
import { Link } from 'react-router-dom';

const Post = ({
                data: {
                  id: postId,
                  title,
                  image,
                  content,
                  owner,
                },
                postedLike,
                actionButtonsList,
                tags,
                postHasTags,
              }) => (
  <Layout
    hasAds
    hasSidebar
    contentHasBackground
  >
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
              <span id="url_field_Posts" className={s.hidden}>{config.uiUrl}/blog/post/{postId}</span>
            </div>
          )
        }

        <Shares
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
    </div>
    <Comments
      identifierId={postId}
      identifierName={title}
      identifier={`blog-${postId}`}
      identifierType='posts'
    />
  </Layout>
);

export { Post as PostWithoutStyles };
export default withStyles(s)(Post);
