(function () {

	L.IconRotation = L.Icon.extend({
		options: L.extend({
			className: 'leaflet-div-icon',
			getIconUrl: function(color) {
				//if (L.Browser.retina) - use 2x version
				//return 'lib/leaflet/images/marker-icon-hole-blue.png' 
				return 'lib/leaflet/images/18.png' 
			}
		}, new L.Icon.Default().options),

	 	initialize: function(options) {
	 		L.setOptions(this, options);
	 		var iconUrl = this.options.getIconUrl(this.options.color);
	 		this._iconImg = this._createImg(iconUrl);
			this._iconImg.style.webkitTransformOrigin="center bottom";
			this._iconImg.style.webkitTransform="rotate(45deg)";
	 	},
		createIcon: function() {
			var div = document.createElement('div');
			div.appendChild(this._iconImg);
			this._setIconStyles(div, 'icon');
			return div;
		},
		setColor: function(color) {
			this._iconImg.src = this.options.getIconUrl(color);
		}
	});

}());
