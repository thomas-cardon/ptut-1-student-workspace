import { isWithinInterval, isAfter, parseISO } from 'date-fns';
import fetch from 'isomorphic-unfetch';
import ICAL from 'ical.js';

/**
 * Un dictionnaire afin de générer des URL pour ADE
 * @type {Object}
 */
export const uni = {
  'IUT Aix-en-Provence': {
    'Informatique': {
      _url: 'https://ade-web-consult.univ-amu.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?projectId=8&calType=ical&firstDate=2020-09-01&lastDate=2021-09-01',
      '1ère année': { resources: [8379] },
      '1ère année Groupe 1A': { resources: [8385], groupId: 43 },
      '1ère année Groupe 1B': { resources: [8386], groupId: 44 },
      '1ère année Groupe 2A': { resources: [8387], groupId: 45 },
      '1ère année Groupe 2B': { resources: [8388], groupId: 46 },
      '1ère année Groupe 3A': { resources: [8389], groupId: 47 },
      '1ère année Groupe 3B': { resources: [8390], groupId: 48 },
      '1ère année Groupe 4A': { resources: [8391], groupId: 49 },
      '1ère année Groupe 4B': { resources: [8392], groupId: 50 },
      '2ème année': { resources: [8395] },
      'Prof': { resources: [1308] }
    }
  }
};

/**
 * Les types d'adresses e-mail universitaires acceptées pendant l'inscription
 * @type {Array}
 */
export const emails = ['@etu.univ-amu.fr', '@univ-amu.fr'];

/**
 * Génère une URL d'aggrégation pour ADE selon les paramètres
 * @param  {String} school [L'école]
 * @param  {String} degree [Le type de formation]
 * @param  {String} year   [L'année]
 * @return {String}        [L'URL]
 */
export function getURL(school, degree, year) {
  return uni[school][degree]._url + '&resources=' + uni[school][degree][year].resources.join(',');
}

/**
 * Permet de transformer une description iCalendar en données utilisables
 * @param  {string} description [Description iCalendar]
 * @return {string} La description changée
 */
function bake(description) {
  let match = description.match(/^[^\(]+/);
  if (!match) return description;

  return match[0]
            .replace(/(\r\n|\n|\r)/gm, " ")
            .trim().split(' ')
            .filter(word => word.length > 3 && !word.includes('Groupe')).join(' ');
}

/**
 * [Transforme les blocs iCalendar en données lisibles]
 * @param  {String} ade [Les données iCalendar]
 * @return {[Object]}     [Les blocs de cours]
 */
function bakeClasses(ade) {
  let jcalData = ICAL.parse(ade);
  let vcalendar = new ICAL.Component(jcalData);

  return vcalendar.getAllSubcomponents()
  .map(x => x.toJSON()[1])
  .map(x => {
    const matches = x[3][3].match(/^(M[0-9]{4}) (.*?) (TD|TP|CM)/);

    return {
      id: x[6][3],
      start: new Date(x[1][3]),
      end: new Date(x[2][3]),
      summary: x[3][3],
      location: x[4][3],
      description: bake(x[5][3]),
      module: matches ? matches[1] : undefined,
      subject: matches ? matches[2] : undefined,
      type: matches ? matches[3] : undefined,
      created: new Date(x[7][3])
    };
  })
  .sort((a, b) => a.start - b.start);
}

function deserialize(x) {
  return {
    ...x,
    created: new Date(x.created),
    start: new Date(x.start),
    end: new Date(x.end),
    description: bake(x.description)
  }
}

/**
 * [Récupère les données enregistrées dans le navigateur, et de-sérialise les strings en dates]
 * @return {[Object]} [Les blocs de cours]
 */
export function parseCalendar({ calendar, user, year }) {
  if (typeof window === `undefined`) return [];

  if (calendar && typeof calendar === 'string')
    calendar = JSON.parse(calendar);

  if (calendar) return calendar.map(deserialize);
  if (!user && !year) return [];

  return JSON.parse(sessionStorage.getItem(`${user.school}/${user.degree}/${year || user.year}`) || '[]').map(deserialize);
}

export async function getNextCourse({ user, year, calendar }) {
  calendar = parseCalendar({ calendar, user, year });

  if (!Array.isArray(calendar))
    return null;

  console.log(`[ADE] Retrieving next class`);

  const course = calendar.find(x => isAfter(x.start, new Date()));
  if (!course) return null;

  const url = `${process.env.NEXT_PUBLIC_URL_PREFIX}/api/schedule/ade/events/${course.id}`;
  console.log(`[ADE] Fetching events for course #${course.id}`);
  console.log(url);

  try {
    const r = await fetch(url);

    if (r.status === 404) return course;
    else if (!r.ok) throw 'Response not OK';

    let events = await r.json();
    events =  events.map(x => ({
      [x.key] : x.value
    })).reduce((obj, item) => ({ ...obj, ...item }) , {});

    return { ...course, ...events };
  } catch (error) {
      console.error(error);
      console.log('[ADE] Les données récupérées sont incompatibles. Annulation.');

      return null;
  }
}

export async function getCurrentCourse({ user, year, calendar }) {
  calendar = parseCalendar({ calendar, user, year });

  if (!Array.isArray(calendar))
    return null;

  console.log(`[ADE] Retrieving current class`);

  const course = calendar.find(x => isWithinInterval(new Date(), { start: x.start, end: x.end }));
  if (!course) return null;

  const url = `${process.env.NEXT_PUBLIC_URL_PREFIX}/api/schedule/ade/events/${course.id}`;
  console.log(`[ADE] Fetching events for course #${course.id}`);
  console.log(url);

  try {
    const r = await fetch(url);

    if (r.status === 404) return course;
    else if (!r.ok) throw 'Response not OK';

    let events = await r.json();
    events =  events.map(x => ({
      [x.key] : x.value
    })).reduce((obj, item) => ({ ...obj, ...item }) , {});

    return { ...course, ...events };
  } catch (error) {
      console.error(error);
      console.log('[ADE] Les données récupérées sont incompatibles. Annulation.');

      return null;
  }
}

export function getSchoolYears(user) {
  return Object.keys(uni[user.school][user.degree]).filter(x => !x.startsWith('_'));
}

/**
 * Récupère les données depuis ADE et les enregistre côté navigateur
 * @param  {[type]} user                    [L'objet utilisateur]
 * @param  {Object} options
 */
export async function useADE(user, options = {}) {
  if (!user?.isLoggedIn) return;

  if (!options.school)
    options.school = user.school;

  if (!options.degree)
    options.degree = user.degree;

  if (!options.year)
    options.year = user.year;

  const { school, degree, year } = options;

  if (!school || !degree || !year)
    throw Error('[ADE] Paramètres manquants');

  let calendar = sessionStorage.getItem(`${school}/${degree}/${year}`);

  if (!calendar) {
    const url = `${process.env.NEXT_PUBLIC_URL_PREFIX}/api/schedule/get-ade-data?school=${encodeURIComponent(school)}&degree=${encodeURIComponent(degree)}&year=${encodeURIComponent(year)}`;
    console.log(`[ADE] Fetching for ${school}, ${degree}, ${year} ->`, url);

    try {
      const r = await fetch(url);
      if (!r.ok) throw 'Response not OK';

      calendar = bakeClasses(await r.text());

      sessionStorage.setItem(`${school}/${degree}/${year}`, JSON.stringify(calendar));
      window.dispatchEvent(new Event('storage'));

      return parseCalendar({ calendar });
    } catch (error) {
        console.error(error);
        sessionStorage.removeItem(`${school}/${degree}/${year}`);
        console.log('[ADE] Les données récupérées sont incompatibles. Annulation.');
    }
  }

  console.log(`[ADE] Fetching for ${school}, ${degree}, ${year} ->`, 'local');
  return parseCalendar({ calendar });
}
