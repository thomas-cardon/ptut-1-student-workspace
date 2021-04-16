import fetch from 'isomorphic-unfetch';

export const uni = {
  'IUT Aix-en-Provence': {
    'Informatique': {
      _url: 'https://ade-web-consult.univ-amu.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?projectId=8&calType=ical&firstDate=2020-09-01&lastDate=2021-09-01',
      '1ère année': [8379],
      '1ère année Groupe 3A': [8389],
      '1ère année Groupe 3B': [8390],
      '2ème année': [8395],
      'Prof': [1308]
    }
  }
};

export function getURL(school, degree, year) {
  return uni[school][degree]._url + '&resources=' + uni[school][degree][year].join(',');
}

export async function useADE(user, school = 'IUT Aix-en-Provence', degree = 'Informatique', year = '1ère année Groupe 3A') {
  if (sessionStorage.getItem('ade_data')) console.log('[ADE] Données récoltées le', sessionStorage.getItem('ade_timestamp'));
  else {
    const url = `${process.env.NEXT_PUBLIC_URL_PREFIX}/api/schedule/get-ade-data?school=${encodeURIComponent(school)}&degree=${encodeURIComponent(degree)}&year=${encodeURIComponent(year)}`;
    console.log('[ADE] Fetching', url);

    try {
      const r = await fetch(url);
      if (!r.ok) throw 'Response not OK';

      const data = await r.text();

      sessionStorage.setItem('ade_data', data);
      sessionStorage.setItem('ade_timestamp', new Date().toString());
    } catch (error) {
        console.error(error);
        console.log('[ADE] Les données récupérées sont pas au format JSON. Annulation.');
    }
  }
}
