const express = require('express');
const db = require("../db/models");

const router = express.Router();

const incrementCounter = async (counter) => {
  const { count } = counter;
  await db.Counter.update({ count: count + 1 }, {
    where: { count: count }
  });
  return count + 1;
}

const createCounter = async () => {
  const counter = await db.Counter.create({
      count: 1,
      createdAt: new Date(),
      updatedAt: new Date()
  });
  return counter.count;
}

/* GET home page. */
router.get('/api/v1/', async function(req, res, next) {
  const counters = await db.Counter.findAll();
  const counter = counters.length
    ? await incrementCounter(counters[0])
    : await createCounter();

  const response = `Hi! I'm an Express server.\n
I'm running on port 8080.
I've been pinged ${counter} times.
Last pinged on ${new Date()}`;

  res.json({response: response});
});

module.exports = router;
