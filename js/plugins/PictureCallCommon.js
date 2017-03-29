//=============================================================================
// PictureCallCommon.js
//=============================================================================

/*:
 * @plugindesc ピクチャのボタン化プラグイン
 * @author トリアコンタン
 * @version 1.00 2015/11/14 初版
 * 
 * @help ピクチャをクリックすると、指定したコモンイベントが
 * 呼び出されるようになるプラグインコマンドを提供します。
 * このプラグインを利用すれば、javascriptの知識がなくても
 * 誰でも簡単にクリックやタッチを主体にしたゲームを作れます。
 *
 * 注意！
 * 一度関連づけたピクチャとコモンイベントはピクチャを消去しても有効です。
 * ピクチャが存在しなければどこをクリックしても反応しませんが、
 * 同じ番号で再度、ピクチャの表示を行うと反応するようになります。
 *
 * プラグインコマンド詳細
 * （イベントコマンド「プラグインコマンド」（Plugin Command）から実行）
 *
 *  P_CALL_CE [ピクチャ番号] [コモンイベントID] :
 *      ピクチャがクリックされたときに呼び出されるコモンイベントを関連づけます。
 *
 *  P_CALL_CE_REMOVE [ピクチャ番号] :
 *      ピクチャとコモンイベントの関連づけを解除します。
 *
 * 利用規約：このプラグインはもうあなたのものです。
 *
 * 作者連絡先：https://twitter.com/triacontane
 */
(function () {

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンド[P_CALL_CE]などを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        var pictureId;
        var commonId;
        switch (command.toUpperCase()) {
            case 'P_CALL_CE' :
                pictureId = parseInt(args[0], 10).clamp(1, 100) || 1;
                commonId  = parseInt(args[1], 10).clamp(1, 100) || 1;
                $gameScreen.setPictureCallCommon(pictureId, commonId);
                break;
            case 'P_CALL_CE_REMOVE' :
                pictureId = parseInt(args[0], 10).clamp(1, 100) || 1;
                $gameScreen.setPictureRemoveCommon(pictureId);
                break;
        }
    };

    //=============================================================================
    // Game_Temp
    //  呼び出し予定のコモンイベントIDのフィールドを追加定義します。
    //=============================================================================
    var _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._nextPictureCid = 0;
    };

    //=============================================================================
    // Game_Map
    //  ピクチャがタッチされたときのコモンイベント呼び出し処理を追加定義します。
    //=============================================================================
    var _Game_Map_setupStartingEvent = Game_Map.prototype.setupStartingEvent;
    Game_Map.prototype.setupStartingEvent = function() {
        var result = _Game_Map_setupStartingEvent.call(this);
        return result || this.setupPictureCommonEvent();
    };

    Game_Map.prototype.setupPictureCommonEvent = function() {
        var commonId = $gameTemp._nextPictureCid;
        var event = $dataCommonEvents[commonId];
        if (commonId > 0 && !this.isEventRunning() && event) {
            $gameTemp._nextPictureCid = 0;
            this._interpreter.setup(event.list);
            return true;
        }
        return false;
    };

    //=============================================================================
    // Game_Troop
    //  ピクチャがタッチされたときのコモンイベント呼び出し処理を追加定義します。
    //=============================================================================
    Game_Troop.prototype.setupPictureCommonEvent = function() {
        var commonId = $gameTemp._nextPictureCid;
        var event = $dataCommonEvents[commonId];
        if (commonId > 0 && !this.isEventRunning() && event) {
            this._interpreter.setup(event.list);
            $gameTemp._nextPictureCid = 0;
            return true;
        }
        return false;
    };

    //=============================================================================
    // Game_Screen
    //  ピクチャに対応するコモンイベント呼び出し用のID配列を追加定義します。
    //=============================================================================
    var _Game_Screen_initialize = Game_Screen.prototype.initialize;
    Game_Screen.prototype.initialize = function() {
        _Game_Screen_initialize.call(this);
        this._pictureCidArray = [];
    };

    Game_Screen.prototype.setPictureCallCommon = function(pictureId, commonId) {
        var realPictureId                    = this.realPictureId(pictureId);
        this._pictureCidArray[realPictureId] = commonId;
    };

    Game_Screen.prototype.setPictureRemoveCommon = function(pictureId) {
        var realPictureId                    = this.realPictureId(pictureId);
        this._pictureCidArray[realPictureId] = 0;
    };

    //=============================================================================
    // Scene_Map
    //  ピクチャのタッチ状態からのコモンイベント呼び出し予約を追加定義します。
    //=============================================================================
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        if (!$gameMap.isEventRunning()) this.updateTouchPictures();
        _Scene_Map_update.call(this);
    };

    Scene_Map.prototype.updateTouchPictures = function() {
        this._spriteset.callTouchPictures();
    };

    var _Scene_Map_isMapTouchOk = Scene_Map.prototype.isMapTouchOk;
    Scene_Map.prototype.isMapTouchOk = function() {
        return _Scene_Map_isMapTouchOk.call(this) && $gameTemp._nextPictureCid === 0;
    };

    //=============================================================================
    // Scene_Battle
    //  ピクチャのタッチ状態からのコモンイベント呼び出し予約を追加定義します。
    //=============================================================================
    var _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        this.updateTouchPictures();
        $gameTroop.setupPictureCommonEvent();
        _Scene_Battle_update.call(this);
    };

    Scene_Battle.prototype.updateTouchPictures = function() {
        this._spriteset.callTouchPictures();
    };

    //=============================================================================
    // Spriteset_Base
    //  ピクチャのタッチ状態からのコモンイベント呼び出し予約を追加定義します。
    //=============================================================================
    Spriteset_Base.prototype.callTouchPictures = function() {
        this._pictureContainer.children.forEach(function(picture) {
            picture.callTouch();
        }, this);
    };

    //=============================================================================
    // Sprite_Picture
    //  ピクチャのタッチ状態からのコモンイベント呼び出し予約を追加定義します。
    //=============================================================================
    Sprite_Picture.prototype.callTouch = function() {
        var commonId = $gameScreen._pictureCidArray[$gameScreen.realPictureId(this._pictureId)];
        if (commonId && this.isTriggered()) $gameTemp._nextPictureCid = commonId;
    };

    //=============================================================================
    // Sprite
    //  タッチ操作を可能にする機能を追加定義します。
    //=============================================================================
    Sprite.prototype.screenWidth = function () {
        return (this.width || 0) * this.scale.x;
    };

    Sprite.prototype.screenHeight = function () {
        return (this.height || 0) * this.scale.y;
    };

    Sprite.prototype.screenX = function () {
        return (this.x || 0) - this.anchor.x * this.screenWidth();
    };

    Sprite.prototype.screenY = function () {
        return (this.y || 0) - this.anchor.y * this.screenHeight();
    };

    Sprite.prototype.minX = function () {
        var width = this.screenWidth();
        return Math.min(this.screenX(), this.screenX() + width);
    };

    Sprite.prototype.minY = function () {
        var height = this.screenHeight();
        return Math.min(this.screenY(), this.screenY() + height);
    };

    Sprite.prototype.maxX = function () {
        var width = this.screenWidth();
        return Math.max(this.screenX(), this.screenX() + width);
    };

    Sprite.prototype.maxY = function () {
        var height = this.screenHeight();
        return Math.max(this.screenY(), this.screenY() + height);
    };

    Sprite.prototype.isTouchPosInRect = function () {
        var tx = TouchInput.x;
        var ty = TouchInput.y;
        return (tx >= this.minX() && tx <= this.maxX() &&
                ty >= this.minY() && ty <= this.maxY());
    };

    Sprite.prototype.isTriggered = function () {
        return this.visible && TouchInput.isTriggered() && this.isTouchPosInRect();
    };
})();