import { useEffect } from 'react';

import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';

export function fetcher(url, settings = {}) {
  return fetch(url, settings).then(r => r.json());
};

export function useNextCourse() {
  return useSWR('/api/schedule/next', fetcher);
}

export function useAvatar(id) {
  if (!id) return { data: 'https://avatar.tobi.sh/' };
  const { data: avatar, mutate } = useSWR('/api/users/' + id + '/avatar', fetcher);

  useEffect(() => {
    console.log(avatar);
    mutate(oldData => oldData || { data: 'https://avatar.tobi.sh/' });
    console.log(avatar);
  }, [avatar]);

  return avatar?.data || 'https://avatar.tobi.sh/';
}

export function useUser(id) {
  if (!id) return { data: undefined };
  return useSWR('/api/users/' + id, fetcher);
}

export function useUsers(type) {
  return useSWR('/api/users' + (type ? '?queryUserType=' + type : ''), fetcher);
}

export function useGroups() {
  return useSWR('/api/groups', fetcher);
}

export function useGrades(id) {
  return useSWR('/api/grades' + (id ? '?id=' + id : ''), fetcher);
}

export function useSubjects() {
  return useSWR('/api/subjects', fetcher);
}

export function useSubject(id) {
  return useSWR('/api/subjects/' + id, fetcher);
}

export function useCurrentClass() {
  return useSWR('/api/schedule/current', fetcher);
}

export function useUpcomingClass() {
  return useSWR('/api/schedule/current', fetcher);
}

export function useSchedule(user, entries = 0, teacher = 0) {
  return useSWR(`/api/schedule?omitPassedEntries=${entries}&filterByTeacher=${teacher}` + (user.userType == 0 && user?.group?.id ? '&filterByGroup=' + user?.group?.id : ''), fetcher);
}

export function usePosts(user, type, module) {
  let group = user?.userType === 0 && user?.group?.id ? user?.group?.id : '';
  return useSWR(`/api/posts?type=${type === 0 ? '0' : (type || '')}&module=${module || ''}&filterByGroup=${group}`, fetcher);
}


export function usePost(id) {
  return useSWR('/api/posts/' + id, fetcher);
}
