const invModel = require("../models/inventory-model");
const utils = require("../utilities/");

// Render the inventory view (grouped by classification)
async function renderByClassId(req, res) {
  const classId = req.params.classificationId;
  const path = req.originalUrl;
  const invData = await invModel.getInvByClassId(classId);

  // Pass in the current path to style active
  const nav = await utils.buildNav(path, classId);
  const grid = utils.buildClassGrid(invData);
  const classificationName =
    invData.length > 0 ? invData[0].classification_name : "Not Found";

  res.render("./inventory/classification", {
    title: `${classificationName} Vehicles`,
    nav,
    grid,
  });
}

//Render single inventory view
async function renderInvById(req, res) {
  const path = req.originalUrl;
  const inv_id = req.params.invId;
  const singleInvData = await invModel.getInvById(inv_id);

  // Pass in classification id to style active nav
  const classificationId = singleInvData[0]?.classification_id;
  const nav = await utils.buildNav(path, classificationId);

  const content = utils.buildSingleInv(singleInvData);

  let title = "";

  if (singleInvData.length > 0) {
    const { inv_make, inv_year, inv_model } = singleInvData[0];

    title = `${inv_year} ${inv_make} ${inv_model}`;
  } else {
    title = "Vehicle not found";
  }

  res.render("./inventory/detail", {
    title,
    nav,
    content,
  });
}

async function renderInvMgmt(_, res) {
  const nav = await utils.buildNav();

  const classificationList = await utils.buildClassSelectList();

  res.render("./inventory/manage-classifications", {
    title: "Manage Classifications",
    nav,
    classificationList,
  });
}

async function renderClassificationForm(_, res) {
  const nav = await utils.buildNav();

  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
}

async function renderAddInvForm(_, res) {
  const nav = await utils.buildNav();
  const classifications = await utils.getClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    errors: null,
    classifications,
  });
}

async function addNewClassification(req, res) {
  const { classification_id } = req.body;

  try {
    const result = await invModel.addClassification(classification_id);
    const nav = await utils.buildNav();
    if (result === 1) {
      req.flash("success", "Added new classification");
      res.redirect("/inv");
    } else {
      req.flash("error", "Sorry, something went wrong, please try again");
      res.status(501).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        classification_name,
      });
    }
  } catch (err) {
    console.error("Error adding classification:", err.message);
    req.flash("error", "Sorry, something went wrong, please try again");
    const nav = await utils.buildNav();
    res.status(500).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  }
}

async function addNewInv(req, res) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  try {
    const result = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    );

    const classifications = await utils.getClassificationList();
    const nav = await utils.buildNav();
    if (result === 1) {
      req.flash(
        "success",
        `Added ${inv_make} ${inv_model} to the inventory <a href="/inv/type/${classification_id}" class="redirect-link"> View here</a/`
      );
      res.redirect("/inv");
    } else {
      req.flash("error", "Sorry, something went wrong, please try again");
      res.status(501).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        errors: null,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classifications,
      });
    }
  } catch (err) {
    console.error("Error adding inventory:", err.message);
    req.flash("error", "Sorry, something went wrong, please try again");
    const classifications = await utils.getClassificationList();
    const nav = await utils.buildNav();
    res.status(500).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: null,
      classifications,
    });
  }
}

async function getInventoryJSON(req, res, next) {
  const classification_id = parseInt(req.params.classificationId);
  const invData = await invModel.getInvByClassId(classification_id);
  if (invData[0]) {
    return res.json(invData);
  } else {
    next(new Error("No data available"));
  }
}

async function editInv(req, res) {
  const inventory_id = parseInt(req.params.invId);

  const invData = await invModel.getInvById(inventory_id);

  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    inv_id,
  } = invData[0];

  const title = `Edit ${inv_make} ${inv_model}`;

  const classifications = await utils.getClassificationList();
  const nav = await utils.buildNav();

  res.render("inventory/update-inventory", {
    title,
    nav,
    errors: null,
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classifications,
    inv_id,
  });
}

async function updateInv(req, res) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    inv_id,
  } = req.body;

  try {
    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    );

    const classifications = await utils.getClassificationList();
    const nav = await utils.buildNav();
    const title = `Edit ${inv_make} ${inv_model}`;
    if (updateResult === 1) {
      req.flash(
        "success",
        `Successfully updated ${inv_make} ${inv_model}<a href="/inv/type/${classification_id}" class="redirect-link"> View here</a/`
      );
      res.redirect("/inv");
    } else {
      req.flash("error", "Sorry, something went wrong, please try again");
      res.status(501).render("inventory/update-inventory", {
        title,
        nav,
        errors: null,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classifications,
      });
    }
  } catch (err) {
    console.error("Error updating inventory:", err.message);
    req.flash("error", "Sorry, something went wrong, please try again");
    const classifications = await utils.getClassificationList();
    const nav = await utils.buildNav();
    const title = `Edit ${inv_make} ${inv_model}`;
    res.status(500).render("inventory/update-inventory", {
      title,
      nav,
      errors: null,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classifications,
    });
  }
}

module.exports = {
  renderByClassId,
  renderInvById,
  renderInvMgmt,
  addNewClassification,
  renderClassificationForm,
  renderAddInvForm,
  addNewInv,
  getInventoryJSON,
  editInv,
  updateInv,
};
