const {
  httpGetReviews,
  httpGetReview,
  httpCreateReview,
  httpUpdateReview,
} = require("../controllers/review.controller");

const { authenticate, authorize } = require("../middleware/auth");

const advancedResults = require("../middleware/advancedResults");
const ReviewSchema = require("../models/Review.schema");

const router = require("express").Router({
  mergeParams: true,
});

router
  .route("/")
  .get(
    advancedResults(ReviewSchema, {
      path: "bootcamp user",
      select: "name description",
    }),
    httpGetReviews
  )
  .post(authenticate, authorize("admin", "user"), httpCreateReview);

router
  .route("/:reviewId")
  .get(httpGetReview)
  .put(authenticate, authorize("admin", "user"), httpUpdateReview);

module.exports = router;
