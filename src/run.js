import express from "express";
import exphbs from "express-handlebars";

import { router as islaiduTipaiRouter } from "./islaiduTipai.js";
import { router as pardavejaiRouter } from "./pardavejai.js";
import { router as mokejimuTipaiRouter } from "./mokejimuTipai.js";
import { router as cekiaiRouter } from "./cekiai.js";
import { router as ataskaitosRouter } from "./ataskaitos.js";

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
      }
    },
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
  }),
);
app.set("view engine", "handlebars");
app.use(express.static(WEB));
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use("/islaiduTipai", islaiduTipaiRouter);
app.use("/pardavejai", pardavejaiRouter);
app.use("/mokejimuTipai", mokejimuTipaiRouter);
app.use("/cekiai", cekiaiRouter);
app.use("/ataskaitos", ataskaitosRouter);

app.listen(PORT);
console.log(`Server started on port ${PORT}`);
