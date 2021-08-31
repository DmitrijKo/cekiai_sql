import mysql from "mysql";

const options = {
  host: "localhost",
  database: "cekiai",
  user: "node_adr",
  password: "nodeadr_12345",
};

function getConnection() {
  return new Promise((resolve, reject) => {
    const conn = mysql.createConnection(options);
    conn.connect((err) => {
      if (err) {
        return reject(err);
      }
      // 0 - autcommit is off; 1 - autocommit is on
      query(conn, "set autocommit = 0")
        .then(
          () => {
            // READ UNCOMMITTED - matysiu visus padarytus pakeitimus,
            //      nepriklausomai nuo to ar jie yra committed ar ne
            // READ COMMITTED - matysiu padarytus pakeitimus, tik po to, kai jie committed
            // REPEATABLE READ - man pamacius rezultata, kiti negales pakeisti irasu
            // SERIALIZABLE - man pamacius rezultata, kiti negales pakeisti irasu
            //      ir ideti nauju i ta rezi, kuri as pamaciau
            query(conn, "SET TRANSACTION ISOLATION LEVEL REPEATABLE READ")
            .then(
              () => {
                resolve(conn);
              },
              (e) => {
                reject(e);
              },
            );
          },
          (e) => {
            reject(e);
          },
        );
    });
  });
}

function endConnection(conn) {
  return new Promise((resolve, reject) => {
    conn.end((err) => {
      resolve(err);
    });
  });
}

function query(conn, ...args) {
  return new Promise((resolve, reject) => {
    conn.query(...args, (err, results, fields) => {
      if (err) {
        return reject(err);
      }
      return resolve({
        results,
        fields,
      });
    });
  });
}

function startTx(conn) {
  return new Promise((resolve, reject) => {
    conn.beginTransaction((err) => {
      if (err) {
        return reject(err);
      }
      resolve("txOk");
    });
  });
}

function commit(conn) {
  return new Promise((resolve, reject) => {
    conn.commit((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function rollback(conn) {
  return new Promise((resolve, reject) => {
    conn.rollback((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

export { commit, endConnection, getConnection, query, rollback, startTx };
