import {
  endConnection,
  getConnection,
  query,
} from "./db.js";

async function login(name, pass) {
  let conn;
  try {
    conn = await getConnection();
    const { rows } = await query(
      conn,
      "select id from users where name = $1 and pass = $2",
      [name, pass],
    );
    if (rows.length > 0) {
      return rows[0].id;
    }
    return null;
  } catch (err) {
    console.log("Failed to login", err);
    return null;
  } finally {
    if (conn) {
      await endConnection(conn);
    }
  }
}

async function checkPermission(userId, permissionName) {
  let conn;
  try {
    conn = await getConnection();
    const { rows } = await query(
      conn,
      `
      select count(*) as allowed
      from permissions p
        join groups_permissions gp on p.id = gp.permissions_id
        join users_groups ug on gp.groups_id = ug.groups_id
      where ug.users_id = $1 and p.name = $2;
      `,
      [userId, permissionName],
    );
    if (rows[0].allowed > 0) {
      return true;
    }
    return false;
  } catch (err) {
    console.log("Failed to check permission", err);
    return false;
  } finally {
    if (conn) {
      await endConnection(conn);
    }
  }
}

export { checkPermission, login };
