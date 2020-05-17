import React  from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Home.scss";
import Layout from "../../components/_layout/Layout";
import Carousel from './components/Carousel';
import FeaturedItems from './components/FeaturedItems';

const Home = () => (
  <Layout
    contentHasBackground
  >
    <div className={s.root}>
      <Carousel />
      <FeaturedItems />
    </div>
  </Layout>
);

export default withStyles(s)(Home);
