import express from "express";
import { getAll as getIslaiduTipaiPG } from "./dbPG/islaiduTipai.js";
import { getAll as getMokejimuTipaiPG } from "./dbPG/mokejimuTipai.js";
import { getAll as getPardavejaiPG } from "./dbPG/pardavejai.js";
import {
  deleteOne as deleteOnePG,
  getAll as getAllPG,
  getOne as getOnePG,
  insert as insertPG,
  update as updatePG,
} from "./dbPG/cekiai.js";
import { getAll as getIslaiduTipaiMySql } from "./dbMySql/islaiduTipai.js";
import { getAll as getMokejimuTipaiMySql } from "./dbMySql/mokejimuTipai.js";
import { getAll as getPardavejaiMySql } from "./dbMySql/pardavejai.js";
import {
  deleteOne as deleteOneMySql,
  getAll as getAllMySql,
  getOne as getOneMySql,
  insert as insertMySql,
  update as updateMySql,
} from "./dbMySql/cekiai.js";

function dbSelect(type) {
  if (type === "pg") {
    return {
      getIslaiduTipai: getIslaiduTipaiPG,
      getMokejimuTipai: getMokejimuTipaiPG,
      getPardavejai: getPardavejaiPG,
      deleteOne: deleteOnePG,
      getAll: getAllPG,
      getOne: getOnePG,
      insert: insertPG,
      update: updatePG
    }
  } else {
    return {
      getIslaiduTipai: getIslaiduTipaiMySql,
      getMokejimuTipai: getMokejimuTipaiMySql,
      getPardavejai: getPardavejaiMySql,
      deleteOne: deleteOneMySql,
      getAll: getAllMySql,
      getOne: getOneMySql,
      insert: insertMySql,
      update: updateMySql
    }
  }
}

export const router = express.Router();

router.get("/", async (req, res) => {
  const f = dbSelect(req.query.dbType);
  res.set("Content-Type", "text/html; charset=utf8");
  try {
    const cekiai = await f.getAll();
    res.render("cekiai", {
      title: "Čekiai",
      list: cekiai,
    });
  } catch (err) {
    res.status(500).end(`Įvyko klaida: ${err.message}`);
  }
});

router.get("/edit/:id?", async (req, res) => {
  const f = dbSelect(req.query.dbType);
  res.set("Content-Type", "text/html; charset=utf8");
  try {
    const islaiduTipai = await f.getIslaiduTipai(req.session?.userId);
    const mokejimuTipai = await f.getMokejimuTipai(req.session?.userId);
    const pardavejai = await f.getPardavejai(req.session?.userId);
    if (req.params.id) {
      const cekis = await f.getOne(req.params.id);
      res.render("cekis", {
        title: "Redaguojam čekį",
        islaiduTipai,
        mokejimuTipai,
        pardavejai,
        cekis,
      });
    } else {
      res.render("cekis", {
        title: "Kuriam čekį",
        islaiduTipai,
        mokejimuTipai,
        pardavejai,
      });
    }
  } catch (err) {
    res.status(500).end(`Įvyko klaida: ${err.message}`);
  }
});

router.post("/save", async (req, res) => {
  const f = dbSelect(req.query.dbType);
  res.set("Content-Type", "text/html; charset=utf8");
  try {
    let cekis;
    if (req.body.id) {
      cekis = await f.update(req.session?.userId, {
        id: req.body.id,
        data: req.body.data,
        pardavejaiId: parseInt(req.body.pardavejaiId),
        mokejimuTipaiId: parseInt(req.body.mokejimuTipaiId),
        prekes: JSON.parse(req.body.prekes)
      });
    } else {
      cekis = await f.insert(req.session?.userId, {
        data: req.body.data,
        pardavejaiId: parseInt(req.body.pardavejaiId),
        mokejimuTipaiId: parseInt(req.body.mokejimuTipaiId),
        prekes: JSON.parse(req.body.prekes)
      });
    }
    res.redirect("/cekiai");
  } catch (err) {
    console.log(err);
    res.status(500).end(`Įvyko klaida: ${err.message}`);
  }
});

router.get("/delete/:id", async (req, res) => {
  const f = dbSelect(req.query.dbType);
  res.set("Content-Type", "text/html; charset=utf8");
  try {
    const record = await f.deleteOne(req.params.id);
    res.redirect("/cekiai");
  } catch (err) {
    res.status(500).end(`Įvyko klaida: ${err.message}`);
  }
});
