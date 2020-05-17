import React  from 'react';
import Comments from '../../../components/Comments';
import Shares from '../../../components/Shares';
import Layout from '../../../components/_layout/Layout/Layout';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import slugify from 'slugify';
import s from './Post.scss';
import {Link} from "react-router-dom";
import {I18n} from "react-redux-i18n";

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
  postHasTags
}) => (
  <Layout
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
            </div>
          )
        }

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
        <Shares
          title={title}
          shareUrl={`/blog/post/${slugify(title)}-${postId}`}
        />
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
      identifier={`posts-${postId}`}
      identifierType='posts'
    />
  </Layout>
);

export { Post as PostWithoutStyles };
export default withStyles(s)(Post);
