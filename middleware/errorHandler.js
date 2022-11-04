module.exports = {
  errorHandler: (err, req, res, next) => {
    res.locals.layout = 'space.hbs'
    res.status(500).render('error500', { error: `${err.name}: ${err.message}` })
  }
}
