//License: MIT
Sprite.prototype._onBitmapLoad = function() {
    if (!!this._bitmap && this._frame.width === 0 && this._frame.height === 0) {
        this._frame.width = this._bitmap.width;
        this._frame.height = this._bitmap.height;
    }
    this._refresh();
};