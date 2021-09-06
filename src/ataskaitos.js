import express from "express";
import moment from "moment";
import { pagalIslaiduTipa } from "./dbMySql/ataskaitos.js";
import {pagalPardaveja} from "./dbMySql/ataskaitos.js";
import {pagalVisas} from "./dbMySql/ataskaitos.js";
import {pagalMokejimoTipa} from "./dbMySql/ataskaitos.js";

export const router = express.Router();

// Pagal islaidu tipa
router.get("/pagalIslaiduTipa", (req, res) => {
   res.set("Content-Type", "text/html; charset=utf8");
   res.render("filtras", {
      ataskaitosPavadinimas: "Ataskaita: pagal išlaidų tipą",
      ataskaitosGeneravimas: "/ataskaitos/pagalIslaiduTipa",
   });
});
router.post("/pagalIslaiduTipa", async (req, res) => {
   res.set("Content-Type", "text/html; charset=utf8");
   let nuo = moment(req.body.nuo, "YYYY-MM-DD", true);
   let iki = moment(req.body.iki, "YYYY-MM-DD", true);
   if (!nuo.isValid()) {
      nuo = moment("0001-01-01", "YYYY-MM-DD", true);
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


// Pagal pardaveja
router.get("/pagalPardaveja", (req, res) => {
   res.render("filtras", {
      ataskaitosPavadinimas: "Ataskaita: pagal pardavėją",
      ataskaitosGeneravimas: "/ataskaitos/pagalPardaveja",
   });
});
router.post("/pagalPardaveja", async (req, res) => {
   let nuo = moment(req.body.nuo, "YYYY-MM-DD", true);
   let iki = moment(req.body.iki, "YYYY-MM-DD", true);
   if (!nuo.isValid()) {
      nuo = moment("0001-01-01", "YYYY-MM-DD", true);
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
      const irasai = await pagalPardaveja(nuo.format("YYYY-MM-DD"), iki.format("YYYY-MM-DD"), req.query);
      res.render("ataskaitos/pagalPardaveja", {
         ataskaitosGeneravimas: "/ataskaitos/pagalPardaveja",
         nuo: nuo.format("YYYY-MM-DD"),
         iki: iki.format("YYYY-MM-DD"),
         irasai,
      });
   } catch (err) {
      res.status(500).end(`Įvyko klaida: ${err.message}`);
   }
});


// Pagal visas
 router.get("/pagalVisas", (req, res) => {
   res.render("filtras", {
     ataskaitosPavadinimas: "Ataskaita: visos išlaidos",
     ataskaitosGeneravimas: "/ataskaitos/pagalVisas",
   });
 });
 router.post("/pagalVisas", async (req, res) => {
   let nuo = moment(req.body.nuo, "YYYY-MM-DD", true);
   let iki = moment(req.body.iki, "YYYY-MM-DD", true);
   if (!nuo.isValid()) {
     nuo = moment("0001-01-01", "YYYY-MM-DD", true);
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
      const irasai = await pagalVisas(nuo.format("YYYY-MM-DD"), iki.format("YYYY-MM-DD"), req.query);
      res.render("ataskaitos/pagalVisas", {
         ataskaitosGeneravimas: "/ataskaitos/pagalVisas",
         nuo: nuo.format("YYYY-MM-DD"),
         iki: iki.format("YYYY-MM-DD"),
         suma: irasai[0].suma
      });
   } catch (err) {
      res.status(500).end(`Įvyko klaida: ${err.message}`);
   }
 });


 // Pagal mokejimo tipa
 router.get("/pagalMokejimoTipa", (req, res) => {
   res.render("filtras", {
     ataskaitosPavadinimas: "Ataskaita: pagal mokėjimo tipą",
     ataskaitosGeneravimas: "/ataskaitos/pagalMokejimoTipa",
   });
 });
 router.post("/pagalMokejimoTipa", async (req, res) => {
   let nuo = moment(req.body.nuo, "YYYY-MM-DD", true);
   let iki = moment(req.body.iki, "YYYY-MM-DD", true);
   if (!nuo.isValid()) {
     nuo = moment("0001-01-01", "YYYY-MM-DD", true);
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
      const irasai = await pagalMokejimoTipa(nuo.format("YYYY-MM-DD"), iki.format("YYYY-MM-DD"), req.query);
      res.render("ataskaitos/pagalMokejimoTipa", {
         ataskaitosGeneravimas: "/ataskaitos/pagalMokejimoTipa",
         nuo: nuo.format("YYYY-MM-DD"),
         iki: iki.format("YYYY-MM-DD"),
         irasai,
      });
   } catch (err) {
      res.status(500).end(`Įvyko klaida: ${err.message}`);
   }
 });
