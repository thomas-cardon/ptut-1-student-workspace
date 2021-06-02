import withSession from '../../../lib/session';
import { query } from '../../../lib/db';

async function handler(req, res) {
  try {
    const schools = await query(`SELECT * from schools`);
    const degrees = await query(`SELECT * from degrees`);
    const groups = await query(`SELECT * from groups`);

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
    res.json(schools.map(o => ({
      ...o,
      degrees: degrees.filter(d => d.school === o.id).map(d => ({ ...d, groups: groups.filter(g => g.degree === d.id) }))
    })));
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
