(function () {
	Window_ScrollText.prototype.refresh = function() {
		var textState = { index: 0 };
		textState.text = this.convertEscapeCharacters(this._text);
		this.resetFontSettings();
		this._allTextHeight = this.calcTextHeight(textState, true);
		this.createContents();
		this.move(0,0,this.width,this._allTextHeight + this.standardPadding() * 2)
		this._windowContentsSprite.y = Graphics.boxHeight;
		this.drawTextEx(this._text, this.textPadding(), 1);
	};
	
	Window_ScrollText.prototype.updateMessage = function() {
		this._windowContentsSprite.y -= this.scrollSpeed();
		if (this._windowContentsSprite.y <= -this.contents.height) {
			this.terminateMessage();
		}
	};
})();