import withSession from '../../../../lib/session';
import { query } from '../../../../lib/db';

async function handler(req, res) {
  try {
    const groups = await query(`
      SELECT groups.id as groupId, groups.name as groupName, degree as degreeId, degrees.name as degreeName,
      schools.id as schoolId, schools.name as schoolName, projectId, resourceId from groups

      LEFT JOIN degrees ON degrees.id = degree
      LEFT JOIN schools ON schools.id = school`);

    res.json(groups);
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
