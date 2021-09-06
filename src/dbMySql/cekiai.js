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
    const { results } = await query(
      conn,
//       `
// select
//   cekiai.id,
//   data,
//   pardavejai_id as pardavejaiId,
//   pardavejai.pavadinimas as pardavejas,
//   mokejimu_tipai_id as mokejimuTipaiId,
//   mokejimu_tipai.pavadinimas as mokejimuTipas
// from cekiai
//   left join pardavejai on cekiai.pardavejai_id = pardavejai.id
//   left join mokejimu_tipai on cekiai.mokejimu_tipai_id = mokejimu_tipai.id
// order by data
//       `,
        `
select
  cekiai.id,
  data,
  pardavejai_id as pardavejaiId,
  pardavejai.pavadinimas as pardavejas,
  mokejimu_tipai_id as mokejimuTipaiId,
  mokejimu_tipai.pavadinimas as mokejimuTipas,
  prekes.id as prekesId,
  prekes.pavadinimas,
  kaina,
  islaidu_tipai_id as islaiduTipaiId,
  islaidu_tipai.pavadinimas as islaiduTipas
from cekiai
  left join pardavejai on cekiai.pardavejai_id = pardavejai.id
  left join mokejimu_tipai on cekiai.mokejimu_tipai_id = mokejimu_tipai.id
  left join prekes on prekes.cekiai_id = cekiai.id
  left join islaidu_tipai on prekes.islaidu_tipai_id = islaidu_tipai.id
order by data, id
        `,
    );
    // for (const record of results) {
    //   record.prekes = await getPrekes(record.id);
    // }
    const cekiai = [];
    for (const record of results) {
      let cekis = cekiai.find(c => c.id === record.id);
      if (!cekis) {
        cekis = {
          id: record.id,
          data: record.data,
          pardavejaiId: record.pardavejaiId,
          pardavejas: record.pardavejas,
          mokejimuTipaiId: record.mokejimuTipaiId,
          mokejimuTipas: record.mokejimuTipas,
          prekes: []
        };
        cekiai.push(cekis);
      }
      let preke = {
        id: record.prekesId,
        cekisId: record.id,
        pavadinimas: record.pavadinimas,
        kaina: record.kaina,
        islaiduTipaiId: record.islaiduTipaiId,
        islaiduTipas: record.islaiduTipas,
      };
      cekis.prekes.push(preke);
    }
    return cekiai;
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
    const { results } = await query(
      conn,
      `
select
  cekiai.id,
  data,
  pardavejai_id as pardavejaiId,
  pardavejai.pavadinimas as pardavejas,
  mokejimu_tipai_id as mokejimuTipaiId,
  mokejimu_tipai.pavadinimas as mokejimuTipas
from cekiai
  left join pardavejai on cekiai.pardavejai_id = pardavejai.id
  left join mokejimu_tipai on cekiai.mokejimu_tipai_id = mokejimu_tipai.id
where cekiai.id = ?
      `,
      [id],
    );
    if (results.length > 0) {
      results[0].prekes = await getPrekes(results[0].id);
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

async function getPrekes(cekisId) {
  cekisId = parseInt(cekisId);
  if (!isFinite(cekisId)) {
    return null;
  }
  let conn;
  try {
    conn = await getConnection();
    const { results } = await query(
      conn,
      `
select
  prekes.id,
  cekiai_id,
  prekes.pavadinimas,
  kaina,
  islaidu_tipai_id as islaiduTipaiId,
  islaidu_tipai.pavadinimas as islaiduTipas
from prekes
  left join islaidu_tipai on prekes.islaidu_tipai_id = islaidu_tipai.id
where cekiai_id = ?
      `,
      [cekisId],
    );
    return results;
  } finally {
    if (conn) {
      await endConnection(conn);
    }
  }
}

async function insert(cekis) {
  let conn;
  let tx;
  try {
    conn = await getConnection();
    tx = await startTx(conn);
    const { results } = await query(
      conn,
      "insert into cekiai (data, pardavejai_id, mokejimu_tipai_id) values (?, ?, ?)",
      [cekis.data, cekis.pardavejaiId, cekis.mokejimuTipaiId],
    );
    if (results.affectedRows > 0) {
      for (const preke of cekis.prekes) {
        await query(
          conn,
          "insert into prekes (cekiai_id, pavadinimas, kaina, islaidu_tipai_id) values(?, ?, ?, ?)",
          [
            results.insertId,
            preke.pavadinimas,
            preke.kaina,
            preke.islaiduTipaiId,
          ],
        );
      }
      tx = await commit(conn);
      return getOne(results.insertId);
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

async function update(cekis) {
  cekis.id = parseInt(cekis.id);
  if (!isFinite(cekis.id)) {
    return null;
  }
  let conn;
  let tx;
  try {
    conn = await getConnection();
    tx = await startTx(conn);
    const { results } = await query(
      conn,
      "update cekiai set data = ?, pardavejai_id = ?, mokejimu_tipai_id = ? where id = ?",
      [cekis.data, cekis.pardavejaiId, cekis.mokejimuTipaiId, cekis.id],
    );
    if (results.affectedRows > 0) {
      const prekes = await getPrekes(cekis.id);
      const forDelete = [];
      for (const preke of prekes) {
        if (!cekis.prekes.find((p) => p.id === preke.id)) {
          forDelete.push(preke.id);
        }
      }
      await query(
        conn,
        "delete from prekes where id in (?)",
        [forDelete],
      );
      for (const preke of cekis.prekes) {
        if (preke.id < 0) {
          await query(
            conn,
            "insert into prekes (cekiai_id, pavadinimas, kaina, islaidu_tipai_id) values(?, ?, ?, ?)",
            [
              cekis.id,
              preke.pavadinimas,
              preke.kaina,
              preke.islaiduTipaiId,
            ],
          );
        } else {
          await query(
            conn,
            "update prekes set pavadinimas = ?, kaina = ?, islaidu_tipai_id = ? where id = ? and cekiai_id = ?",
            [
              preke.pavadinimas,
              preke.kaina,
              preke.islaiduTipaiId,
              preke.id,
              cekis.id,
            ],
          );
        }
      }
      tx = await commit(conn);
      return getOne(cekis.id);
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
    const { results } = await query(
      conn,
      "delete from cekiai where id = ?",
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

export { deleteOne, getAll, getOne, getPrekes, insert, update };
