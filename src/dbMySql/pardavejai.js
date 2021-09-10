import { checkPermission } from "../dbSec/users.js";

import {
  commit,
  endConnection,
  getConnection,
  query,
  rollback,
  startTx,
} from "./db.js";

async function getAll(userId) {
   if (!await checkPermission(userId, "pardavejai_select")) {
      throw new Error("Permission denied");
   }
  let conn;
  try {
    conn = await getConnection();
    const { results } = await query(
      conn,
      "select id, pavadinimas from pardavejai order by pavadinimas",
    );
    return results;
  } finally {
    if (conn) {
      await endConnection(conn);
    }
  }
}

async function getOne(userId, id) {
   if (!await checkPermission(userId, "pardavejai_select")) {
      throw new Error("Permission denied");
   }
  id = parseInt(id);
  if (!isFinite(id)) {
    return null;
  }
  let conn;
  try {
    conn = await getConnection();
    const { results } = await query(
      conn,
      "select id, pavadinimas from pardavejai where id = ?",
      [id],
    );
    if (results.length > 0) {
      return results[0];
    } else {
      return null;
    }
  } finally {
    if (conn) {
      await endConnection(conn);
    }
  }
}

async function insert(userId, pavadinimas) {
   if (!await checkPermission(userId, "pardavejai_insert")) {
      throw new Error("Permission denied");
   }
  if (typeof pavadinimas !== "string" || pavadinimas.trim() === "") {
    return null;
  }
  let conn;
  let tx;
  try {
    conn = await getConnection();
    tx = await startTx(conn);
    const { results } = await query(
      conn,
      "insert into pardavejai (pavadinimas) values (?)",
      [pavadinimas],
    );
    if (results.affectedRows > 0) {
      tx = await commit(conn);
      return getOne(userId, results.insertId);
    } else {
      return null;
    }
  } finally {
    if (tx) {
      await rollback(conn);
    }
    if (conn) {
      await endConnection(conn);
    }
  }
}

async function update(userId, id, pavadinimas) {
   if (!await checkPermission(userId, "pardavejai_update")) {
      throw new Error("Permission denied");
   }
  id = parseInt(id);
  if (!isFinite(id)) {
    return null;
  }
  if (typeof pavadinimas !== "string" || pavadinimas.trim() === "") {
    return null;
  }
  let conn;
  let tx;
  try {
    conn = await getConnection();
    tx = await startTx(conn);
    const { results } = await query(
      conn,
      "update pardavejai set pavadinimas = ? where id = ?",
      [pavadinimas, id],
    );
    if (results.affectedRows > 0) {
      tx = await commit(conn);
      return getOne(userId, id);
    } else {
      return null;
    }
  } finally {
    if (tx) {
      await rollback(conn);
    }
    if (conn) {
      await endConnection(conn);
    }
  }
}

async function deleteOne(userId, id) {
   if (!await checkPermission(userId, "pardavejai_delete")) {
      throw new Error("Permission denied");
   }
  id = parseInt(id);
  if (!isFinite(id)) {
    return null;
  }
  let conn;
  let tx;
  try {
    const one = await getOne(userId, id);
    conn = await getConnection();
    tx = await startTx(conn);
    const { results } = await query(
      conn,
      "delete from pardavejai where id = ?",
      [id],
    );
    if (results.affectedRows > 0) {
      tx = await commit(conn);
      return one;
    } else {
      return null;
    }
  } finally {
    if (tx) {
      await rollback(conn);
    }
    if (conn) {
      await endConnection(conn);
    }
  }
}

export { deleteOne, getAll, getOne, insert, update };
