const db = require("../database/");

async function getReviewsByInvId(inv_id) {
  try {
    const sql = `SELECT r.*, a.account_firstname, a.account_lastname 
                 FROM public.review AS r 
                 JOIN public.account AS a ON r.account_id = a.account_id 
                 WHERE r.inv_id = $1 
                 ORDER BY r.review_date DESC`;
    const data = await db.query(sql, [inv_id]);
    return data.rows;
  } catch (error) {
    console.error("getReviewsByInvId error " + error);
    return [];
  }
}

async function addReview(inv_id, account_id, review_text) {
  try {
    const sql = `INSERT INTO public.review (inv_id, account_id, review_text) 
                 VALUES ($1, $2, $3) RETURNING *`;
    const data = await db.query(sql, [inv_id, account_id, review_text]);
    return data.rows[0];
  } catch (error) {
    console.error("addReview error " + error);
    return error.message;
  }
}

module.exports = {
  getReviewsByInvId,
  addReview,
};
