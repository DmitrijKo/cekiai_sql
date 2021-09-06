import express from "express";
import { deleteOne, getAll, getOne, insert, update } from "./dbMySql/pardavejai.js";

export const router = express.Router();

router.get("/", async (req, res) => {
  res.set("Content-Type", "text/html; charset=utf8");
  try {
    const records = await getAll();
    res.render("pardavejai", {
      title: "Pardavėjai",
      sarasas: records,
    });
  } catch (err) {
    res.status(500).end(`Įvyko klaida: ${err.message}`);
  }
});

router.get("/edit/:id?", async (req, res) => {
  res.set("Content-Type", "text/html; charset=utf8");
  if (req.params.id) {
    try {
      const pardavejas = await getOne(req.params.id);
      if (pardavejas) {
        res.render("pardavejas", {
          title: "Redaguojam parduotuvę",
          pardavejas,
        });
      } else {
        res.redirect("/pardavejai");
      }
    } catch (err) {
      res.status(500).end(`Įvyko klaida: ${err.message}`);
    }
  } else {
    res.render("pardavejas", {
      title: "Kuriam pardavėją",
    });
  }
});

router.post("/save", async (req, res) => {
  res.set("Content-Type", "text/html; charset=utf8");
  if (req.body.pavadinimas && req.body.pavadinimas.trim() !== "") {
    try {
      let record;
      if (req.body.id) {
        record = await update(req.body.id, req.body.pavadinimas);
      } else {
        record = await insert(req.body.pavadinimas);
      }
      res.redirect("/pardavejai");
    } catch (err) {
      res.status(500).end(`Įvyko klaida: ${err.message}`);
    }
  } else {
    res.redirect("/pardavejai");
  }
});

router.get("/delete/:id", async (req, res) => {
  res.set("Content-Type", "text/html; charset=utf8");
  try {
    const record = await deleteOne(req.params.id);
    res.redirect("/pardavejai");
  } catch (err) {
    res.status(500).end(`Įvyko klaida: ${err.message}`);
  }
});
