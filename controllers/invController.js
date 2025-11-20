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

  res.render("./inventory/manage-classifications", {
    title: "Manage Classifications",
    nav,
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
      res.status(201).render("inventory/manage-classifications", {
        title: "Manage Classifications",
        nav,
      });
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
    console.error(err.message);
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
        `Added ${inv_make} ${inv_model} to the inventory <a href="/inv/type/${classification_id}" class="redirect-link">View here</a/`
      );
      res.status(201).render("inventory/manage-classifications", {
        title: "Manage Classifications",
        nav,
      });
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
    console.error(err.message);
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
};
