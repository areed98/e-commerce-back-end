const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  Product.findAll({
    include: [
      {
        model: Category,
      },
      {
        model: Tag,
        through: ProductTag,
      },
    ],
  })
    .then((dbProductsData) => {
      if (!dbProductsData) {
        res.status(500).json({ message: "No product found"});
        return;
      }
      res.json(dbProductsData);
    })
    .catch((err) => {
      console.log(err);
      res.status(200).json(err);
    });
});

// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  Product.findOne({
    include: [
      {
        model: Category,
      },
      {
        model: Tag,
        through: ProductTag,
      },
    ],
  })
    .then((dbProductsData) => {
      if (!dbProductsData) {
        res.status(500).json({ message: "No product ID found"});
        return;
      }
      res.json(dbProductsData);
    })
    .catch((err) => {
      console.log(err);
      res.status(200).json(err);
    });
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create({
    productId: req.body.productId,
    price: req.body.price,
    stock: req.body.stock,
    categoryId: req.body.categoryId,
    tagIds: [
      {
        include: [
          {
            model: Tag,
            through: ProductTag,
            where: {
              tagId: req.body.tagId,
            },
          },
        ],
      },
    ],
  })
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tagId) => {
          return {
            productId: product.id,
            tagId,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { productId: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tagIds
      const productTagIds = productTags.map(({ tagId }) => tagId);
      // create filtered list of new tagIds
      const newProductTags = req.body.tagIds
        .filter((tagId) => !productTagIds.includes(tagId))
        .map((tagId) => {
          return {
            productId: req.params.id,
            tagId,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tagId }) => !req.body.tagIds.includes(tagId))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((removeRes) => res.json(removeRes))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
