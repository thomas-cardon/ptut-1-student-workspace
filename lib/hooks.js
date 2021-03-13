import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';

export function fetcher(url, settings = {}) {
  return fetch(url, settings).then(r => r.json());
};

export function useNextCourse() {
  return useSWR('/api/schedule/next', fetcher);
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

export function usePosts(user, type, module) {
  return useSWR(`/api/posts${type ? ('?type=' + type + '&') : '?'}${module ? 'module=' + module : ''}` + (user?.userType === 0 && user?.group?.id ? '&filterByGroup=' + user?.group?.id : ''), fetcher);
}

export function useSchedule(user) {
  return useSWR('/api/schedule' + (user.userType == 0 && user?.group?.id ? '?filterByGroup=' + user?.group?.id : ''), fetcher);
}

export function usePost(id) {
  return useSWR('/api/posts/' + id, fetcher);
}

export function getAvatar(user) {
  return user?.avatar || 'https://avatar.tobi.sh/';
}
