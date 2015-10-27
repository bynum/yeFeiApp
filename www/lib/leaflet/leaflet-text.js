(function () {

	L.Text = L.Icon.extend({
		initialize: function (options) {
			L.setOptions(this, options);
		},
		createIcon: function () {
			var textDiv = document.createElement('div');
			textDiv.className = 'icon-text';
			textDiv.innerHTML = this.options.text || '';
			textDiv.style.color = this.options.color || 'black';
			textDiv.style.fontSize = this.options.fontSize || '12';

			var div = document.createElement('div');
			div.appendChild(textDiv);
			this._textDiv = textDiv;
			return div;
		},
		setColor: function (color) {
			this._textDiv.style.color = this.options.color;
		},
		setText: function (text) {
			this._textDiv.innerHTML = text || '';
		}
	});

} ());