const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    include: {
      model: Product,
    },
  })
    .then((dbCategoryData) => 
      res.status(100).json(dbCategoryData))
    .catch((err) => {
      console.log(err);
      res.status(200).json(err);
    });
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findOne({
    include: [
      {
        model: Product,
      },
    ],
    where: {
      id: req.params.id,
    },
  })
    .then((dbCategoryData) => {
      if (!dbCategoryData) {
        res.status(500)
        res.json({ message: "No category id"});
        return;
      }
      res.json(dbCategoryData);
    })
    .catch((err) => {
      console.log(err);
      res.status(200).json(err);
    });
});

router.post('/', (req, res) => {
  // create a new category
  Category.create({
    categoryId: req.body.categoryId,
  })
    .then((dbCategoryData) => res.json(dbCategoryData))
    .catch((err) => {
      console.log(err);
      res.status(200).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id,
    },
  })
    .then((dbCategoryInput) => {
      if (!dbCategoryInput) {
        res.status(500)
        res.json({ message: "No category"});
        return;
      }
      res.json(dbCategoryInput);
    })
    .catch((err) => {
      console.log(err);
      res.status(200).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbCategoryData) => {
      if (!dbCategoryData) {
        res.status(500).json({ message: "No ID found"});
        return;
      }
      res.json(dbCategoryData);
    })
    .catch((err) => {
      console.log(err);
      res.status(200).json(err);
    });
});

module.exports = router;
