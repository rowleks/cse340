const utils = require("./index");
const invModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");

function addClassificationRules() {
  return [
    body("classification_name")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .isAlpha()
      .withMessage("Please provide a valid classification name.")
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(
          classification_name
        );
        if (classificationExists) {
          throw new Error(
            "Classification already exists. Please use a different name"
          );
        }
      }),
  ];
}

async function checkClassificationData(req, res, next) {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    const nav = await utils.buildNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
}

function addInventoryRules() {
  return [
    body("inv_make")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please provide a make."),

    body("inv_model")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please provide a model."),

    body("inv_year")
      .trim()
      .escape()
      .isLength({ min: 4, max: 4 })
      .withMessage("Please provide a valid 4-digit year."),

    body("inv_description")
      .trim()
      .escape()
      .isLength({ min: 10 })
      .withMessage("Please provide a description."),

    body("inv_image")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Please provide an image path."),

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Please provide a thumbnail path."),

    body("inv_price")
      .trim()
      .escape()
      .isNumeric()
      .withMessage("Please provide a valid price."),

    body("inv_miles")
      .trim()
      .escape()
      .isNumeric()
      .withMessage("Please provide valid mileage."),

    body("inv_color")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please provide a color."),

    body("classification_id")
      .trim()
      .escape()
      .isNumeric()
      .withMessage("Please select a classification."),
  ];
}

async function checkInventoryData(req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utils.buildNav();
    const classifications = await utils.getClassificationList();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classifications,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
    return;
  }
  next();
}

module.exports = {
  addClassificationRules,
  checkClassificationData,
  addInventoryRules,
  checkInventoryData,
};
