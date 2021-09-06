import {
  commit,
  endConnection,
  getConnection,
  query,
  rollback,
  startTx,
} from "./db.js";

async function getAll() {
  let conn;
  try {
    conn = await getConnection();
    const { rows } = await query(
      conn,
      "select id, pavadinimas from pardavejai order by pavadinimas",
    );
    return rows;
  } finally {
    if (conn) {
      await endConnection(conn);
    }
  }
}

async function getOne(id) {
  id = parseInt(id);
  if (!isFinite(id)) {
    return null;
  }
  let conn;
  try {
    conn = await getConnection();
    const { rows } = await query(
      conn,
      "select id, pavadinimas from pardavejai where id = $1",
      [id],
    );
    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } finally {
    if (conn) {
      await endConnection(conn);
    }
  }
}

async function insert(pavadinimas) {
  if (typeof pavadinimas !== "string" || pavadinimas.trim() === "") {
    return null;
  }
  let conn;
  let tx;
  try {
    conn = await getConnection();
    tx = await startTx(conn);
    const { rowCount } = await query(
      conn,
      "insert into pardavejai (pavadinimas) values ($1)",
      [pavadinimas],
    );
    if (rowCount > 0) {
      const { rows } = await query(
        conn,
        `select currval('pardavejai_id_seq') as "insertId";`
      )
      tx = await commit(conn);
      return getOne(rows[0].insertId);
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

async function update(id, pavadinimas) {
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
    const { rowCount } = await query(
      conn,
      "update pardavejai set pavadinimas = $1 where id = $2",
      [pavadinimas, id],
    );
    if (rowCount > 0) {
      tx = await commit(conn);
      return getOne(id);
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

async function deleteOne(id) {
  id = parseInt(id);
  if (!isFinite(id)) {
    return null;
  }
  let conn;
  let tx;
  try {
    const one = await getOne(id);
    conn = await getConnection();
    tx = await startTx(conn);
    const { rowCount } = await query(
      conn,
      "delete from pardavejai where id = $1",
      [id],
    );
    if (rowCount > 0) {
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
