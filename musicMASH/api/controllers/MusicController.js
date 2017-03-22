/**
 * MusicController
 *
 * @description :: Server-side logic for managing musics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create: function (req, res, next) {
    Music.create(req.params.all(), function musicCreated(err, music) {
      if (err) return next(err);

      res.redirect('/music/index');
    })
  },

  index: function (req, res, next) {
    Music.find(function foundMusic(err, music) {
      if (err) return next(err);

      res.view({
        music: music
      });
    });
  }
};

