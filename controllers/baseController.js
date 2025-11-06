const utils = require("../utilities/");

const baseController = {
  buildHome: async function (_, res) {
    const nav = await utils.getNav();
    res.render("index", { title: "Home", nav });
  },
};

module.exports = baseController;
