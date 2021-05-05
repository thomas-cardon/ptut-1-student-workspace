import fetch from 'isomorphic-unfetch';

export const feed = [
  {
    _url: 'https://iut.univ-amu.fr/rss.xml',
    _endpoint: `${process.env.NEXT_PUBLIC_URL_PREFIX}/api/news/xml?url=`,
    _method: 'json',
    name: 'IUT Aix-en-Provence (fr)',
    parse: function(data) {
      return data.rss.channel.item.map(x => ({
        title: x.title._text,
        description: x.description._text,
        href: x.link._text,
        created: new Date(x.pubDate._text),
        author: x['dc:creator']._text.split(' - ')[0]
      }));
    }
  },
  {
    _url: 'https://rss.app/feeds/akby6hByU9fLfIJS.xml',
    _endpoint: `${process.env.NEXT_PUBLIC_URL_PREFIX}/api/news/xml?url=`,
    _method: 'json',
    name: 'IUT Aix-en-Provence (fr)',
    parse: function(data) {
      return data.rss.channel.item.map(x => ({
        title: x.title._cdata,
        description: 'Pas de description',
        href: x.link._text,
        created: new Date(data.rss.channel.lastBuildDate._text),
        author: 'Aix-Marseille Université'
      }));
    }
  }
];

export async function fetchNews() {
  if (!sessionStorage.getItem('news')) {

    try {
      let news = [];
      for (const provider of feed) {
        console.log('[News] Fetching', provider._endpoint + encodeURIComponent(provider._url));

        const r = await fetch(provider._endpoint + encodeURIComponent(provider._url));
        if (!r.ok) throw 'Response not OK';

        const data = await r[provider._method]();
        console.dir(data);
        console.dir(provider.parse(data));
        news = news.concat(provider.parse(data));
      }

      news = news.sort((a, b) => b.created - a.created);
      console.dir(news);
      sessionStorage.setItem('news', JSON.stringify(news));

      return news;
    } catch (error) {
      console.log(error);

      throw error;
      sessionStorage.removeItem('news');
    }
  }

  return JSON.parse(sessionStorage.getItem('news'));
}
