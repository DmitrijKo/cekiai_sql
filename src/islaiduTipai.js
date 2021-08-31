import express from "express";
import {
  deleteOne,
  getAll,
  getOne,
  insert,
  update,
} from "./db/islaiduTipai.js";

export const router = express.Router();

router.get("/", async (req, res) => {
  res.set("Content-Type", "text/html; charset=utf8");
  try {
    const records = await getAll();
    res.render("islaiduTipai", {
      title: "Išlaidų tipai",
      tipai: records,
    });
  } catch (err) {
    res.status(500).end(`Įvyko klaida: ${err.message}`);
  }
});

router.get("/edit/:id?", async (req, res) => {
  res.set("Content-Type", "text/html; charset=utf8");
  if (req.params.id) {
    try {
      const tipas = await getOne(req.params.id);
      if (tipas) {
        res.render("islaiduTipas", {
          title: "Redaguojam išlaidų tipą",
          tipas,
        });
      } else {
        res.redirect("/islaiduTipai");
      }
    } catch (err) {
      res.status(500).end(`Įvyko klaida: ${err.message}`);
    }
  } else {
    res.render("islaiduTipas", {
      title: "Kuriam išlaidų tipą",
    });
  }
});

router.post("/save", async (req, res) => {
  res.set("Content-Type", "text/html; charset=utf8");
  try {
    let record;
    if (req.body.id) {
      record = await update(req.body.id, req.body.pavadinimas);
    } else {
      record = await insert(req.body.pavadinimas);
    }
    res.redirect("/islaiduTipai");
  } catch (err) {
    res.status(500).end(`Įvyko klaida: ${err.message}`);
  }
});

router.get("/delete/:id", async (req, res) => {
  res.set("Content-Type", "text/html; charset=utf8");
  try {
    const record = await deleteOne(req.params.id);
    res.redirect("/islaiduTipai");
  } catch (err) {
    res.status(500).end(`Įvyko klaida: ${err.message}`);
  }
});
