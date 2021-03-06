define(
  ["ember","ic-ajax","./config","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var request = __dependency2__.request;
    var config = __dependency3__["default"] || __dependency3__;

    __exports__["default"] = Ember.Object.extend({
      setPrefilter: function() {
        var token = this.get('data').token;
        var preFilter = function(options, originalOptions, jqXHR) {
          return jqXHR.setRequestHeader('X-CSRF-Token', token );
        };
        $.ajaxPrefilter(preFilter);
      },
      setData: function(data) {
        var param = Object.keys(data)[0];
        this.set('data', { param: param, token: data[param] });
        this.setPrefilter();

        return this.get('data');
      },
      fetchToken: function() {
        var promise;
        var setData = this.setData.bind(this);

        if (this.get('data')) {
          promise = Ember.RSVP.resolve(this.get('data'));
        } else {
          var token = Ember.$('meta[name="csrf-token"]').attr('content');

          if (!Ember.isEmpty(token)) {
            promise = Ember.RSVP.resolve({'authenticity_token': token });
          } else {
            promise = request(config.csrfURL);
          }

          promise = promise.then(setData);
        }

        return promise;
      }
    });
  });