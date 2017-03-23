/**
 * AboutController
 *
 * @description :: Server-side logic for managing abouts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function (req, res, next) {
    About.find(function foundAbout(err, about) {
      if (err) return next(err);

      res.view({
        about: about
      });
    });
  }

};

