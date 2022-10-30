import express from "express";
const router = express.Router();
import * as db from "../database";
import { ensureAuthenticated } from "../utils";

router.get(
  "/",
  ensureAuthenticated,
  function (req: any, res: any, next: any) {
    db.User.findAll({
      order: [["createdAt", "DESC"]],
      limit: 500,
    })
      .then((users) => {
        res.status(200).send(JSON.stringify(users));
      })
      .catch((err) => {
        res.status(500).send(JSON.stringify(err));
      });
  }
);

export { router };
