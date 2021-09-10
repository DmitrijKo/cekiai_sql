import express from "express";
import session from "express-session";
import exphbs from "express-handlebars";

import { router as islaiduTipaiRouter } from "./islaiduTipai.js";
import { router as pardavejaiRouter } from "./pardavejai.js";
import { router as mokejimuTipaiRouter } from "./mokejimuTipai.js";
import { router as cekiaiRouter } from "./cekiai.js";
import { router as ataskaitosRouter } from "./ataskaitos.js";
import { login } from "./dbSec/users.js";

const PORT = 3000;
const WEB = "web";

const app = express();
app.engine(
  "handlebars",
  exphbs({
    helpers: {
      eq(p1, p2) {
        return p1 === p2;
      },
      dateFormat(d) {
        if (d instanceof Date) {
          const year = d.getFullYear();
          let month = d.getMonth() + 1;
          if (month < 10) {
            month = "0" + month;
          }
          let day = d.getDate();
          if (day < 10) {
            day = "0" + day;
          }
          return `${year}-${month}-${day}`;
        } else {
          return d;
        }
      },
    },
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
  }),
);
app.set("view engine", "handlebars");
app.use(session({
  saveUninitialized: true,
  resave: true,
  cookie: {
    maxAge: 1800000,
  },
  secret: "cia_mano_sessiju_pass",
}));
app.use(express.static(WEB));
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.post("/doLogin", async (req, res) => {
  const userId = await login(req.body.name, req.body.pass);
  if (userId) {
    req.session.userId = userId;
    if (req.body.nextUrl) {
      return res.redirect(req.body.nextUrl);
    } else {
      return res.redirect("/");
    }
  } else {
    res.render("login", {
      title: "Prisijungimas",
      error: "Failed to login",
      nextUrl: req.body.nextUrl,
    });
  }
});

app.get("/login", (req, res) => {
  res.render("login", {
    title: "Prisijungimas",
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Failed to destroy session", err);
    }
    res.redirect("/");
  });
});

// praleis tik prisiloginusius userius
app.use((req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.render("login", {
    title: "Prisijungimas",
    nextUrl: req.originalUrl,
  });
});

app.use("/islaiduTipai", islaiduTipaiRouter);
app.use("/pardavejai", pardavejaiRouter);
app.use("/mokejimuTipai", mokejimuTipaiRouter);
app.use("/cekiai", cekiaiRouter);
app.use("/ataskaitos", ataskaitosRouter);

app.listen(PORT);
console.log(`Server started on port ${PORT}`);
