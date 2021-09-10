import {
  endConnection,
  getConnection,
  query,
} from "./db.js";

async function pagalIslaiduTipa(nuo, iki, sort) {
  let sql = `
select
  islaidu_tipai.id,
  islaidu_tipai.pavadinimas,
  sum(prekes.kaina) as suma
from islaidu_tipai
  join prekes on islaidu_tipai.id = prekes.islaidu_tipai_id
  join cekiai on cekiai.id = prekes.cekiai_id
where
  cekiai.data >= $1 and
  cekiai.data <= $2
group by
  islaidu_tipai.id,
  islaidu_tipai.pavadinimas
`;
  if (sort) {
    if (sort.pavadinimas) {
      sql += "order by 2";
      if (sort.pavadinimas === "up") {
        sql += " asc";
      } else {
        sql += " desc";
      }
    } else if (sort.suma) {
      sql += "order by 3";
      if (sort.suma === "up") {
        sql += " asc";
      } else {
        sql += " desc";
      }
    }
  }
  let conn;
  try {
    conn = await getConnection();
    const { rows } = await query(
      conn,
      sql,
      [nuo, iki]
    );
    return rows;
  } finally {
    if (conn) {
      await endConnection(conn);
    }
  }
}

export { pagalIslaiduTipa };
