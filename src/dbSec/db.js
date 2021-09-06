import pg from "pg";
const types = pg.types;
types.setTypeParser(types.builtins.INT8, val => parseInt(val));
types.setTypeParser(types.builtins.NUMERIC, val => parseFloat(val));

const options = {
  host: "localhost",
  port: 5432,
  database: "security",
  user: "node_cekiai",
  password: "node_cekiai",
  types
};

function getConnection() {
  return new Promise((resolve, reject) => {
    const conn = new pg.Client(options);
    conn.connect().then(
      () => resolve(conn),
      (err) => reject(err),
    );
  });
}

function endConnection(conn) {
  return conn.end();
}

function query(conn, sql, args) {
  return conn.query(sql, args);
}

function startTx(conn) {
  return query(conn, "begin;").then(() => "txOk");
}

function commit(conn) {
  return query(conn, "commit;");
}

function rollback(conn) {
  return query(conn, "rollback;");
}

export { commit, endConnection, getConnection, query, rollback, startTx };
