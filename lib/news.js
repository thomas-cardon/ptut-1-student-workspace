import fetch from 'isomorphic-unfetch';

export const feeds = [
  {
    url: 'https://iut.univ-amu.fr/rss.xml',
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
    url: 'https://rss.app/feeds/akby6hByU9fLfIJS.xml',
    name: 'Aix Marseille Université (fr)',
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
