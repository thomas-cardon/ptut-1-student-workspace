import fetch from 'isomorphic-unfetch';
import ICAL from 'ical.js';

export const uni = {
  'IUT Aix-en-Provence': {
    'Informatique': {
      _url: 'https://ade-web-consult.univ-amu.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?projectId=8&calType=ical&firstDate=2020-09-01&lastDate=2021-09-01',
      '1ère année': { resources: [8379] },
      '1ère année Groupe 3A': { resources: [8389], groupId: 47 },
      '1ère année Groupe 3B': { resources: [8390], groupId: 48 },
      '2ème année': { resources: [8395] },
      'Prof': { resources: [1308] }
    }
  }
};

export const emails = ['@etu.univ-amu.fr', '@univ-amu.fr'];

export function getURL(school, degree, year) {
  return uni[school][degree]._url + '&resources=' + uni[school][degree][year].resources.join(',');
}

/**
 * [bakeClasses description]
 * @param  {[type]} ade [description]
 * @return {[type]}     [description]
 */
function bakeClasses(ade) {
  let jcalData = ICAL.parse(ade);
  let vcalendar = new ICAL.Component(jcalData);

  return vcalendar.getAllSubcomponents()
  .map(x => x.toJSON()[1])
  .map(x => {
    const matches = x[3][3].match(/^(M[0-9]{4}) (.*?) (TD|TP)/);

    return {
      id: x[6][3],
      start: new Date(x[1][3]),
      end: new Date(x[2][3]),
      summary: x[3][3],
      location: x[4][3],
      description: x[5][3],
      module: matches ? matches[1] : undefined,
      subject: matches ? matches[2] : undefined,
      type: matches ? matches[3] : undefined,
      created: new Date(x[7][3])
    };
  })
  .sort((a, b) => a.start - b.start);
}

/**
 * [parseCalendar description]
 * @return {[type]} [description]
 */
export function parseCalendar() {
  if (typeof window === `undefined`) return [];
  return sessionStorage.getItem('ade_data') ? JSON.parse(sessionStorage.getItem('ade_data')).map(x => ({
    ...x,
    created: new Date(x.created),
    start: new Date(x.start),
    end: new Date(x.end)
  })) : [];
}

export async function useADE(user, school = 'IUT Aix-en-Provence', degree = 'Informatique', year = '1ère année Groupe 3A') {
  school = user?.school || school;
  degree = user?.degree || degree;
  year = user?.year || year;

  if (!sessionStorage.getItem('ade_data')) {
    const url = `${process.env.NEXT_PUBLIC_URL_PREFIX}/api/schedule/get-ade-data?school=${encodeURIComponent(school)}&degree=${encodeURIComponent(degree)}&year=${encodeURIComponent(year)}`;
    console.log('[ADE] Fetching', url);

    try {
      const r = await fetch(url);
      if (!r.ok) throw 'Response not OK';

      const data = await r.text();

      sessionStorage.setItem('ade_data', JSON.stringify(bakeClasses(data)));
    } catch (error) {
        console.error(error);
        sessionStorage.removeItem('ade_data');
        console.log('[ADE] Les données récupérées sont incompatibles. Annulation.');
    }
  }
}
