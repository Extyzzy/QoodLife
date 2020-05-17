import React from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../BranchesList.scss";
import {Link} from "react-router-dom";

const ListItem = ({
  data,
  name,
  defaultImage,
  onPopupClose,
  openPopup,
}) => (
  <div className={s.list}>
    <Link to={{pathname: `/places/${data.id}/branch`, state: {data}}}>
      <div className={s.branch}>
        <div className={s.image}>
          <img
            src={defaultImage.src}
            onClick={openPopup}
            alt=""
          />
        </div>
        <div className={s.location}>
          {data.location.label}
        </div>
      </div>
     </Link>
    </div>
);

export default withStyles(s)(ListItem);
