import express from "express";
const router = express.Router();

import * as db from "../database";
import { ensureAuthenticated } from "../utils";

router.get("/", ensureAuthenticated, (req, res, next) => {
  db.BlockedAddress.findAll({
    order: [["createdAt", "DESC"]],
    limit: 500,
  })
    .then((blockedAddresses) => {
      res.status(200).send(JSON.stringify(blockedAddresses));
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err));
    });
});

router.post(
  "/",
  ensureAuthenticated,
  async (req, res, next) => {
    const { address } = req.body;
    try {
      let blocked = await db.BlockedAddress.create({ address: address.trim() });
      res.status(201).send();
    } catch (error) {
      res.status(422).send(JSON.stringify({ error: error.message }));
    }
  }
);

router.delete(
  "/:id",
  ensureAuthenticated,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      await db.BlockedAddress.destroy({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(422).send(JSON.stringify({ error: error.message }));
    }
  }
);

export { router };
