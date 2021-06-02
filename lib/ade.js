import { isWithinInterval, isAfter, parseISO } from 'date-fns';
import fetch from 'isomorphic-unfetch';
import ICAL from 'ical.js';

/**
 * Les types d'adresses e-mail universitaires acceptées pendant l'inscription
 * @type {Array}
 */
export const emails = ['@etu.univ-amu.fr', '@univ-amu.fr'];

/**
 * Implémentation de la fonction String#hashCode de Java
 * @param  {[type]} s [description]
 * @return {[type]}   [description]
 */
function hashCode(s) {
    for(var i = 0, h = 0; i < s.length; i++)
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    return h;
}

/**
 * Génère une URL d'aggrégation pour ADE selon les paramètres
 * @param  {Object} user   [L'utilisateur]
 * @return {String}        [L'URL]
 */
export function getURL(user) {
  if (!user.schedule.resourceId) throw Error('[ADE] Resource ID manquant');
  return user.schedule.url + '&resources=' + user.schedule.resourceId;
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
      adeId: x[6][3],
      id: hashCode(`${x[1][3]};${x[3][3]};${x[4][3]};${bake(x[5][3])}`),
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
export function parseCalendar({ calendar, user, degree }) {
  if (typeof window === `undefined`) return [];

  if (calendar && typeof calendar === 'string')
    calendar = JSON.parse(calendar);

  if (calendar) return calendar.map(deserialize);
  if (!user && !degree) return [];

  return JSON.parse(sessionStorage.getItem(`${user.school}/${user.degree}/${user.group?.id || user.schedule.resourceId}`) || '[]').map(deserialize);
}

export async function getNextCourse({ user, degree, calendar }) {
  calendar = parseCalendar({ calendar, user, degree });

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

export async function getCurrentCourse({ user, degree, calendar }) {
  calendar = parseCalendar({ calendar, user, degree });

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

/**
 * Récupère les données depuis ADE et les enregistre côté navigateur
 * @param  {[type]} user                    [L'objet utilisateur]
 * @param  {Object} options
 */
export async function useADE(user, options = {}) {
  if (!user?.isLoggedIn) return;

  let calendar = sessionStorage.getItem(`${user.school}/${user.degree}/${user.group?.id || user.schedule.resourceId}`);

  if (!calendar) {
    const url = `${process.env.NEXT_PUBLIC_URL_PREFIX}/api/schedule/fetch`;
    console.log(`[ADE] Fetching for ->`, user.group?.id || user.schedule.resourceId);

    try {
      const r = await fetch(url);
      if (!r.ok) throw 'Response not OK';

      calendar = bakeClasses(await r.text());

      sessionStorage.setItem(`${user.school}/${user.degree}/${user.group?.id || user.schedule.resourceId}`, JSON.stringify(calendar));
      window.dispatchEvent(new Event('storage'));

      return parseCalendar({ calendar });
    } catch (error) {
        console.error(error);
        sessionStorage.removeItem(`${user.school}/${user.degree}/${options.degree || user.degree}`);
        console.log('[ADE] Les données récupérées sont incompatibles. Annulation.');
    }
  }

  console.log(`[ADE] Fetching ->`, 'local');
  return parseCalendar({ calendar });
}
