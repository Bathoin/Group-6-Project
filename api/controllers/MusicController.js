/**
 * MusicController
 *
 * @description :: Server-side logic for managing music
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create: function (req, res, next) {
    Music.create(req.params.all(), function musicCreated(err, music) {
      if (err) return next(err);

      res.redirect('/music/index');
    });
  },

  index: function (searchQuery, req, res, next) {
    Music.find({
      or: [
        {title: {'like': searchQuery}},
        {artist: {'like': searchQuery}}
      ]
    }).exec(function foundMusic(err, music) {
      if (err) return next(err);

      res.view({
        music: music
      });
    });
  },

  getJson: function (req, res, next) {
    Music.find().populateAll().exec(function (err, music) {
      if (err) return next(err);
      if (!music) return next();

      res.json({
        music: music
      });
    });
  }
}
