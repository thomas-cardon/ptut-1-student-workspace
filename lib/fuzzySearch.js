export default function fuzzySearch (arr, query) {
  console.dir(arr);

  if (!query) return arr;

  let search = query.split(' ');

  let matches = [];
  for (let q of search) {
    matches = matches.concat(arr.filter(x => {
      let d = Object.values(x)[0][0];
      return d.userFirstName.toLowerCase().includes(q.toLowerCase())
      || d.userLastName.toLowerCase().includes(q.toLowerCase())
      || (d.userGroupName || "").toLowerCase().includes(q.toLowerCase())
    }));
  }

  return matches;
}
