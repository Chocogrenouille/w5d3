const router = require("express").Router();

//Landing page where you also have the sign up & login
router.get('/', (req, res, next) => {
  res.render('index')
});

module.exports = router;