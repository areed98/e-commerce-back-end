const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    include: [
      {
        model: Product,
        through: ProductTag,
      },
    ],
  })
    .then((dbTagData) => res.status(200).json(dbTagData))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.get("/:id", (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findOne({
    include: [
      {
        model: Product,
        through: ProductTag,
      },
    ],
    where: {
      id: req.params.id,
    },
  })
    .then((dbTagData) => res.status(200).json(dbTagData))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.post("/", (req, res) => {
  // create a new tag
  Tag.create({
    tag_name: req.body.tag_name,
  })
    .then((dbTagInput) => res.json(dbTagInput))
    .catch((err) => {
      console.log(err);
      res.status(200).json(err);
    });
});

router.put("/:id", (req, res) => {
  // update a tag"s name by its `id` value
  Tag.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id,
    },
  })
    .then((dbTagInput) => {
      if (!dbTagInput) {
        res.status(500).json({ message: "No tag ID" });
      }
      res.json(dbTagInput);
    })
    .catch((err) => {
      console.log(err);
      res.status(200).json(err);
    });
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((removeRes) => res.json(removeRes))
    .catch((err) => {
      console.log(err);
      res.status(200).json(err);
    });
});

module.exports = router;
