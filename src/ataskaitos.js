import express from "express";
import moment from "moment";
import { pagalIslaiduTipa } from "./db/ataskaitos.js";

export const router = express.Router();

router.get("/pagalIslaiduTipa", (req, res) => {
  res.set("Content-Type", "text/html; charset=utf8");
  res.render("filtras", {
    ataskaitosPavadinimas: "Ataskaita: išlaidos pagal tipą",
    ataskaitosGeneravimas: "/ataskaitos/pagalIslaiduTipa",
  });
});
router.post("/pagalIslaiduTipa", async (req, res) => {
  res.set("Content-Type", "text/html; charset=utf8");
  let nuo = moment(req.body.nuo, "YYYY-MM-DD", true);
  let iki = moment(req.body.iki, "YYYY-MM-DD", true);
  if (!nuo.isValid()) {
    nuo = moment("0000-01-01", "YYYY-MM-DD", true);
  }
  if (!iki.isValid()) {
    iki = moment("9999-12-31", "YYYY-MM-DD", true);
  }
  if (nuo.isAfter(iki)) {
    const tmp = nuo;
    nuo = iki;
    iki = tmp;
  }
  try {
    const irasai = await pagalIslaiduTipa(nuo.format("YYYY-MM-DD"), iki.format("YYYY-MM-DD"), req.query);
    res.render("ataskaitos/pagalIslaiduTipa", {
      ataskaitosGeneravimas: "/ataskaitos/pagalIslaiduTipa",
      nuo: nuo.format("YYYY-MM-DD"),
      iki: iki.format("YYYY-MM-DD"),
      irasai,
    });
  } catch (err) {
    res.status(500).end(`Įvyko klaida: ${err.message}`);
  }
});

// router.get("/pagalPardaveja", (req, res) => {
//   res.render("filtras", {
//     ataskaitosPavadinimas: "Ataskaita: išlaidos pagal pardaveją",
//     ataskaitosGeneravimas: "/ataskaitos/pagalPardaveja",
//   });
// });
// router.post("/pagalPardaveja", async (req, res) => {
//   let nuo = moment(req.body.nuo, "YYYY-MM-DD", true);
//   let iki = moment(req.body.iki, "YYYY-MM-DD", true);
//   if (!nuo.isValid()) {
//     nuo = moment("0000-01-01", "YYYY-MM-DD", true);
//   }
//   if (!iki.isValid()) {
//     iki = moment("9999-12-31", "YYYY-MM-DD", true);
//   }
//   if (nuo.isAfter(iki)) {
//     const tmp = nuo;
//     nuo = iki;
//     iki = tmp;
//   }
//   try {
//     const cekiai = JSON.parse(
//       await readFile("data/cekiai.json", {
//         encoding: "utf-8",
//       }),
//     );
//     const irasai = [];
//     for (const cekis of cekiai.cekiai) {
//       const cekioData = moment(cekis.data);
//       if (cekioData.isBetween(nuo, iki, "day", "[]")) {
//         let irasas = irasai.find((i) => i.id === cekis.parduotuveId);
//         if (!irasas) {
//           irasas = {
//             id: cekis.parduotuveId,
//             suma: 0,
//           };
//           irasai.push(irasas);
//         }
//         for (const preke of cekis.prekes) {
//           irasas.suma += parseFloat(preke.kaina);
//         }
//       }
//     }
//     const parduotuves = JSON.parse(
//       await readFile("data/parduotuves.json", {
//         encoding: "utf-8",
//       }),
//     );
//     for (const irasas of irasai) {
//       const parduotuve = parduotuves.sarasas.find((p) => p.id === irasas.id);
//       if (parduotuve) {
//         irasas.pavadinimas = parduotuve.pavadinimas;
//       }
//     }
//     sortIrasai(irasai, req);
//     res.render("ataskaitos/pagalPardaveja", {
//       ataskaitosGeneravimas: "/ataskaitos/pagalPardaveja",
//       nuo: nuo.format("YYYY-MM-DD"),
//       iki: iki.format("YYYY-MM-DD"),
//       irasai,
//     });
//   } catch (err) {
//     res.status(500).end(`Įvyko klaida: ${err.message}`);
//   }
// });

// router.get("/pagalVisas", (req, res) => {
//   res.render("filtras", {
//     ataskaitosPavadinimas: "Ataskaita: visos išlaidos",
//     ataskaitosGeneravimas: "/ataskaitos/pagalVisas",
//   });
// });
// router.post("/pagalVisas", async (req, res) => {
//   let nuo = moment(req.body.nuo, "YYYY-MM-DD", true);
//   let iki = moment(req.body.iki, "YYYY-MM-DD", true);
//   if (!nuo.isValid()) {
//     nuo = moment("0000-01-01", "YYYY-MM-DD", true);
//   }
//   if (!iki.isValid()) {
//     iki = moment("9999-12-31", "YYYY-MM-DD", true);
//   }
//   if (nuo.isAfter(iki)) {
//     const tmp = nuo;
//     nuo = iki;
//     iki = tmp;
//   }
//   try {
//     const cekiai = JSON.parse(
//       await readFile("data/cekiai.json", {
//         encoding: "utf-8",
//       }),
//     );
//     let suma = 0;
//     for (const cekis of cekiai.cekiai) {
//       const cekioData = moment(cekis.data);
//       if (cekioData.isBetween(nuo, iki, "day", "[]")) {
//         for (const preke of cekis.prekes) {
//           suma += parseFloat(preke.kaina);
//         }
//       }
//     }
//     res.render("ataskaitos/pagalVisas", {
//       ataskaitosGeneravimas: "/ataskaitos/pagalVisas",
//       nuo: nuo.format("YYYY-MM-DD"),
//       iki: iki.format("YYYY-MM-DD"),
//       suma,
//     });
//   } catch (err) {
//     res.status(500).end(`Įvyko klaida: ${err.message}`);
//   }
// });

// router.get("/pagalMokejimoTipa", (req, res) => {
//   res.render("filtras", {
//     ataskaitosPavadinimas: "Ataskaita: išlaidos pagal mokėjimo tipą",
//     ataskaitosGeneravimas: "/ataskaitos/pagalMokejimoTipa",
//   });
// });
// router.post("/pagalMokejimoTipa", async (req, res) => {
//   let nuo = moment(req.body.nuo, "YYYY-MM-DD", true);
//   let iki = moment(req.body.iki, "YYYY-MM-DD", true);
//   if (!nuo.isValid()) {
//     nuo = moment("0000-01-01", "YYYY-MM-DD", true);
//   }
//   if (!iki.isValid()) {
//     iki = moment("9999-12-31", "YYYY-MM-DD", true);
//   }
//   if (nuo.isAfter(iki)) {
//     const tmp = nuo;
//     nuo = iki;
//     iki = tmp;
//   }
//   try {
//     const cekiai = JSON.parse(
//       await readFile("data/cekiai.json", {
//         encoding: "utf-8",
//       }),
//     );
//     const mokejimuTipai = JSON.parse(
//       await readFile("data/mokejimuTipai.json", {
//         encoding: "utf-8",
//       }),
//     );
//     const irasai = [];
//     for (const mt of mokejimuTipai.tipai) {
//       irasai.push({
//         ...mt,
//         suma: 0,
//       });
//     }
//     for (const cekis of cekiai.cekiai) {
//       const cekioData = moment(cekis.data);
//       if (cekioData.isBetween(nuo, iki, "day", "[]")) {
//         const irasas = irasai.find((i) => i.id === cekis.mokejimuTipasId);
//         if (irasas) {
//           for (const preke of cekis.prekes) {
//             irasas.suma += parseFloat(preke.kaina);
//           }
//         }
//       }
//     }
//     sortIrasai(irasai, req);
//     res.render("ataskaitos/pagalMokejimoTipa", {
//       ataskaitosGeneravimas: "/ataskaitos/pagalMokejimoTipa",
//       nuo: nuo.format("YYYY-MM-DD"),
//       iki: iki.format("YYYY-MM-DD"),
//       irasai,
//     });
//   } catch (err) {
//     res.status(500).end(`Įvyko klaida: ${err.message}`);
//   }
// });

// function sortIrasai(irasai, req) {
//   if (req.query.pavadinimas || req.query.suma) {
//     let prop;
//     let dir;
//     if (req.query.pavadinimas) {
//       dir = req.query.pavadinimas;
//       prop = "pavadinimas";
//     } else {
//       dir = req.query.suma;
//       prop = "suma";
//     }
//     irasai.sort((i1, i2) => {
//       let ret = 0;
//       if (i1[prop] > i2[prop]) {
//         ret = 1;
//       } else if (i1[prop] < i2[prop]) {
//         ret = -1;
//       }
//       return (dir === "up") ? ret : ret * -1;
//     });
//   }
// }
