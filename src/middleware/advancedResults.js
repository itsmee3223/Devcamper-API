advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  const requestQuery = { ...req.query };

  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((removeField) => delete requestQuery[removeField]);

  let queryString = JSON.stringify(requestQuery);
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = model.find(JSON.parse(queryString));

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  const pagination = {};

  query = query.skip(startIndex).limit(limit);

  if (populate) query = query.populate(populate);

  const results = await query;

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    succsess: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
