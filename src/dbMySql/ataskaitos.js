import { endConnection, getConnection, query } from "./db.js";

// Pagal islaidu tipa
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
   cekiai.data >= ? and
   cekiai.data <= ?
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
      const {
         results
      } = await query(
         conn,
         sql,
         [nuo, iki]
      );
      return results;
   } finally {
      if (conn) {
         await endConnection(conn);
      }
   }
}

// Pagal pardaveja
async function pagalPardaveja(nuo, iki, sort) {
   let sql = `
 select 
    pardavejai.pavadinimas, 
    pardavejai.id, 
     sum(prekes.kaina) as suma
 from prekes
    join cekiai on prekes.cekiai_id = cekiai.id
    join pardavejai on pardavejai.id = cekiai.pardavejai_id
 where 
    cekiai.data >= ? and 
     cekiai.data <= ?
 group by 
    pardavejai.pavadinimas, 
     pardavejai.id
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
      const {
         results
      } = await query(
         conn,
         sql,
         [nuo, iki]
      );
      return results;
   } finally {
      if (conn) {
         await endConnection(conn);
      }
   }
}

// Pagal visas
async function pagalVisas(nuo, iki, sort) {
   let sql = `
 select 
    sum(prekes.kaina) as suma
 from prekes
   join cekiai on prekes.cekiai_id = cekiai.id
 where 
   cekiai.data >= ? and 
    cekiai.data <= ?
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
      const {
         results
      } = await query(
         conn,
         sql,
         [nuo, iki]
      );
      return results;
   } finally {
      if (conn) {
         await endConnection(conn);
      }
   }
}

// Pagal mokejimo tipa
async function pagalMokejimoTipa(nuo, iki, sort) {
   let sql = `
 select
    mokejimu_tipai.id,
    mokejimu_tipai.pavadinimas,
    sum(prekes.kaina) as suma
  from mokejimu_tipai
    join cekiai on mokejimu_tipai.id = cekiai.mokejimu_tipai_id
    join prekes on cekiai.id = prekes.cekiai_id
  where
    cekiai.data >= ? and
    cekiai.data <= ?
  group by
    mokejimu_tipai.id,
    mokejimu_tipai.pavadinimas
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
      const {
         results
      } = await query(
         conn,
         sql,
         [nuo, iki]
      );
      return results;
   } finally {
      if (conn) {
         await endConnection(conn);
      }
   }
}

export {
   pagalIslaiduTipa,
   pagalPardaveja,
   pagalVisas,
   pagalMokejimoTipa
};