import React, { useState, useEffect } from 'react';

import Link from '../../components/Link';

import UserLayout from '../../components/UserLayout';
import Highlight from "../../components/Highlight";
import Title from "../../components/Title";
import Post from "../../components/Post";

import { HiPlusCircle } from "react-icons/hi";

import Loader from 'react-loader-spinner';

import useUser from '../../lib/useUser';
import { fetchNews } from '../../lib/news';

export default function LatestNews() {
  const { user } = useUser({ redirectTo: '/login' });
  const [error, setError] = useState(null);

  const [news, setNews] = useState([<Post>
    <Loader type="Oval" color="var(--color-accent)" height="2em" width="100%" />
  </Post>]);

  useEffect(async () => {
    try {
      const data = await fetchNews();
      setNews(data.map((post, i) => <Post
                          id={'news-' + i}
                          key={'news-' + i}
                          href={post.href}
                          authorName={post.author}
                          creationTime={new Date(post.created)}
                          email={post.email}
                          title={post.title}
                          description={post.description}></Post>));
    }
    catch(error) {
      setError(typeof error === 'object' ? JSON.stringify(error) : error);
    }
  }, []);

  return (
    <UserLayout user={user} flex={true} title="Newsfeed" header={<>
      <Title>Newsfeed</Title>
      {error ? (
        <Highlight title="Erreur">
          {error}
        </Highlight>
      ) : (
        <Highlight title="Le saviez-vous?">
          Ces titres sont aggrégés de diverses sources, comme votre université.
        </Highlight>
      )}
    </>}>
      {news.length > 0 ? news : <h2 className={'title'}>Aucun post disponible</h2>}
    </UserLayout>
  );
};
