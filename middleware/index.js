function loggedOut(req, res, next) {
  if(req.session.userId && req.session) {
    return res.redirect('profile');
  }
  return next();
}

function loggedIn(req, res, next){
  if(!req.session.userId) {
    return res.render('notLoggedIn');
  }
  next();
}

module.exports.loggedOut = loggedOut;
module.exports.loggedIn = loggedIn;
