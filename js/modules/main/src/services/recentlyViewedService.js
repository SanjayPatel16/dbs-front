angular.module('main').
	factory('recentlyViewed', ['$window', 'item', function($window, item) {
		var recent;
		var max_items = 50;

		if( $window.sessionStorage !== undefined ) {
			recent = $window.sessionStorage;
		}
		else {
			recent = {
				setItem: function(key, item) {
					this[key] = item;
				},

				getItem: function(key) {
					return this[key] || null;
				},

				clear: function() {
					for (key in this) {
						delete this[key];
					}
				}
			};
		}

		var recently_viewed = {
			items: JSON.parse(recent.getItem('recentlyViewed')) || [],

			put: function(item_data) {
				item_data._id = JSON.stringify(item_data.params);
				var recent_item = this.items.filter(function(recent_item) {
					return item_data._id == recent_item._id;
				})[0];
				if (!recent_item) {
					item_data.url = item.get_url(item_data);
					this.items.push(item_data);

					if (this.items.length > max_items) {
						this.items.splice(0, 1);
					}
					recent.setItem('recentlyViewed', JSON.stringify(this.items));
				}

			},

			clear: function() {
				this.items = [];
			}
		};

		return recently_viewed;
	}]);
