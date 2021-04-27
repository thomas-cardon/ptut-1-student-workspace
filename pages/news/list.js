import React, { useState, useEffect } from 'react';

import Link from '../../components/Link';

import UserLayout from '../../components/UserLayout';
import Highlight from "../../components/Highlight";
import Title from "../../components/Title";
import Post from "../../components/Post";

import { HiPlusCircle } from "react-icons/hi";

import Loader from 'react-loader-spinner';

import { fetchNews } from '../../lib/news';

import withSession from "../../lib/session";

export default function LatestNews({ user, module }) {
  const [news, setNews] = useState([<Post>
    <Loader type="Oval" color="var(--color-accent)" height="2em" width="100%" />
  </Post>]);

  useEffect(() => fetchNews()
  .then(data => {
    console.dir(data);
    setNews(data.map((post, i) => <Post
                        id={'news-' + i}
                        key={'news-' + i}
                        href={post.href}
                        authorName={post.author}
                        creationTime={new Date(post.created)}
                        email={post.email}
                        title={post.title}
                        description={post.description}></Post>))
    }
  ), []);

  return (
    <UserLayout user={user} flex={true} header={<>
      <Title>Newsfeed</Title>
      <Highlight title="Le saviez-vous?">
        Ces titres sont aggrégés de diverses sources, comme votre université.
      </Highlight>
    </>}>
      {news.length > 0 && news}
      {news.length === 0 && <h2 className={'title'}>Aucun post disponible</h2>}
    </UserLayout>
  );
};

export const getServerSideProps = withSession(async function ({ req, res, query }) {
  const user = req.session.get('user');

  if (!user) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { user: req.session.get('user'), ...query },
  };
});
