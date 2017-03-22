/**
 * Music.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    title: {
      type: 'string',
      required: true
    },

    artist: {
      type: 'string',
      required: true
    },

    length: {
      type: 'float'
    },

    url: {
      type: 'string',
      required: true
    },

    provider: {
      type: 'string',
      required: true
    }
  }
};

