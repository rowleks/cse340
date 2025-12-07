const reviewModel = require("../models/review-model");

async function addReview(req, res) {
  const { inv_id, review_text } = req.body;
  const account_id = res.locals.accountData.account_id;

  try {
    const result = await reviewModel.addReview(inv_id, account_id, review_text);
    if (result) {
      req.flash("success", "Review added successfully.");
    } else {
      req.flash("error", "Failed to add review.");
    }
    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    console.error("addReview error " + error);
    req.flash("error", "Sorry, something went wrong.");
    res.redirect(`/inv/detail/${inv_id}`);
  }
}

module.exports = {
  addReview,
};
