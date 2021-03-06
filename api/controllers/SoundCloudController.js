/**
 * SoundCloudController
 *
 * @description :: Server-side logic for managing Soundclouds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    new: function (req, res) {
        res.view();
    },

    search: function (req, res, next) {
        SoundCloud.create(req.params.all(), function SCSoundCreated(err, SCSound) {
            if (err) return next(err);

            res.redirect('/soundcloud/result/' + SCSound.id);
        });
    },

    // Search for something
    // SoundCloud API reference:
    // https://developers.soundcloud.com/docs/api/reference#tracks
    result: function (req, res, next) {
        SoundCloud.findOne(req.param('id')).populateAll().exec(function (err, SCSound) {
            if (err) return next(err);
            if (!SCSound) return next();

            var http = require('http');
            // Our client_id, needed to use the API
            var client_id = 'O3UkayfZTJjNeahVhqTiHcZ5iowrMRpk';

            function process_response(webservice_response, SCSound, callback) {
                var webservice_data = "";
                webservice_response.on('error', function (e) {
                    console.log(e.message);
                    callback("Error: " + e.message);
                });

                webservice_response.on('data', function (chunk) {
                    webservice_data += chunk;
                });

                // Response from query
                webservice_response.on('end', function () {
                    // Parse everything from the response (JSON)
                    SCSound_data = JSON.parse(webservice_data);
                    // Find the title of the first match
                    SCSound.songtitle = SCSound_data.title;
                    // The duration provided by SoundCloud is in milliseconds
                    // convert to MM:SS format for readability
                    SCSound.duration = millis_to_min_sec(SCSound_data.duration);
                    // URL for track
                    SCSound.url = SCSound_data.permalink_url;
                    console.log(SCSound.title + ' ' + SCSound.duration);
                    callback();
                });
            };

            // Define host, path etc. for the search (JSON returned)
            function get_sound_data(SCSound, callback) {
                //http://api.soundcloud.com/tracks.json?client_id=O3UkayfZTJjNeahVhqTiHcZ5iowrMRpk&q=smile%20like%20you%20mean%20it
                console.log(SCSound.title);
                options = {
                    host: 'api.soundcloud.com',
                    port: 80,
                    path: '/tracks.json?client_id=' + client_id + '&q=' + encodeURIComponent(SCSound.title) + '&limit=2',   // client_id is given above, q='something to search for', limit to 2 results
                    method: 'GET'
                };

                var webservice_request = http.request(options, function (response) {
                    process_response(response, SCSound, callback)
                });
                webservice_request.end();
                console.log(SCSound.title + ' ' + SCSound.duration)

            };

            async.each([SCSound], get_sound_data, function (err) {
                if (err) console.log(err);
                console.log('done');

                res.view({
                    SCSound: SCSound
                });
            });

            // Convert milliseconds to MM:SS format (minutes:seconds)
            function millis_to_min_sec(millis) {
                var minutes = Math.floor(millis / 60000);
                var seconds = ((millis % 60000) / 1000).toFixed(0);
                return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
            };
        });
    },

    getJson: function (req, res, next) {
        SoundCloud.find().populateAll().exec(function (err, SCSound) {
            if (err) return next(err);
            if (!SCSound) return next();

            res.json({
                SCSound: SCSound
            });
        });
    }

};

