import express from "express";
import { getAll as getIslaiduTipai } from "./db/islaiduTipai.js";
import { getAll as getMokejimuTipai } from "./db/mokejimuTipai.js";
import { getAll as getPardavejai } from "./db/pardavejai.js";
import {
  deleteOne,
  getAll,
  getOne,
  insert,
  update,
} from "./db/cekiai.js";

export const router = express.Router();

router.get("/", async (req, res) => {
  res.set("Content-Type", "text/html; charset=utf8");
  try {
    const cekiai = await getAll();
    res.render("cekiai", {
      title: "Čekiai",
      list: cekiai,
    });
  } catch (err) {
    res.status(500).end(`Įvyko klaida: ${err.message}`);
  }
});

router.get("/edit/:id?", async (req, res) => {
  res.set("Content-Type", "text/html; charset=utf8");
  try {
    const islaiduTipai = await getIslaiduTipai();
    const mokejimuTipai = await getMokejimuTipai();
    const pardavejai = await getPardavejai();
    if (req.params.id) {
      const cekis = await getOne(req.params.id);
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
  res.set("Content-Type", "text/html; charset=utf8");
  try {
    let cekis;
    if (req.body.id) {
      cekis = await update({
        id: req.body.id,
        data: req.body.data,
        pardavejaiId: parseInt(req.body.pardavejaiId),
        mokejimuTipaiId: parseInt(req.body.mokejimuTipaiId),
        prekes: JSON.parse(req.body.prekes)
      });
    } else {
      cekis = await insert({
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
  res.set("Content-Type", "text/html; charset=utf8");
  try {
    const record = await deleteOne(req.params.id);
    res.redirect("/cekiai");
  } catch (err) {
    res.status(500).end(`Įvyko klaida: ${err.message}`);
  }
});
