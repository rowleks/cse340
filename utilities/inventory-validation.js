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
      title: "Add inventory",
      nav,
      classification_name,
    });
    return;
  }
  next();
}

module.exports = { addClassificationRules, checkClassificationData };
