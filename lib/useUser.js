import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";

export default function useUser({
  redirectTo = false,
  redirectIfFound = false,
  perms = [],
  permsRedirection = "/dashboard?alert=Vous n'avez pas les permissions requises pour accéder à cette page."
} = {}) {
  const { data: user, mutate: mutateUser } = useSWR('/api/me');

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
    ) {
      Router.push(redirectTo);
    }

    if (perms.length > 0 && !perms.some(x => {
      if (x.userType && x.userType <= user.userType) return true;
      else if (x.delegate === true && user.delegate === true) return true;
    })) {
      console.log('>> Permissions not matching. Redirecting.');
      Router.push(permsRedirection);
    }
  }, [user, redirectIfFound, perms, permsRedirection]);

  return { user, mutateUser };
}
