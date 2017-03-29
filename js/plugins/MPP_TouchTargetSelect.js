//=============================================================================
// MPP_TouchTargetSelect.js
//=============================================================================
// Copyright (c) 2015 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【ver.1.3】戦闘時のターゲット選択で、キャラクターをタッチして選択できるようにします。
 * @author 木星ペンギン
 *
 * @help ●タッチ操作によるキャラクター選択
 *  クリックorタッチした際、選んだ対象にカーソルが移動します。
 *  クリックorタッチを離した際、選んだ対象と離した位置が重なっていれば決定します。
 * 
 * ●カーソル表示
 *  ▽画像ファイルは system フォルダから読み込まれます。
 * 
 *  ▽カーソルの位置について
 *   0:画面左側にいる場合は右、画面右側にいる場合は左、
 *     左に表示される場合は左右反転されます。
 *   1～9:それぞれテンキーの位置
 * 
 *  ▽幅とレートについて
 *   画像を幅で分割し、レートの速度で左から順に表示します。
 *   幅を 0 にした場合はアニメーションを行いません。
 * 
 *  ▽画像の回転について
 *   0:回転なし, 1:通常の回転, 2:横回転, 3:縦回転
 * 
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 * 
 * @param === Actor ===
 * 
 * @param Actor Window View?
 * @desc アクターの選択ウィンドウを表示するかどうか
 * @default true
 *
 * @param Actor Arrow Name
 * @desc アクター選択カーソルの画像ファイル名
 * @default 
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param Actor Arrow Pos
 * @desc アクター選択カーソルの表示位置
 * @default 0
 *
 * @param Actor Arrow Width
 * @desc アクター選択カーソルの幅
 * @default 0
 *
 * @param Actor Arrow Rate
 * @desc アクター選択カーソルのアニメーションのレート
 * @default 4
 *
 * @param Actor Arrow Rotation
 * @desc アクター選択カーソルの回転方向
 * (0:回転なし, 1:通常の回転, 2:横回転, 3:縦回転)
 * @default 0
 *
 * @param Actor Arrow Speed
 * @desc アクター選択カーソルの回転速度
 * @default 0
 *
 * @param === Enemy ===
 * 
 * @param Enemy Window View?
 * @desc アクターの選択ウィンドウを表示するかどうか
 * @default true
 *
 * @param Enemy Arrow Name
 * @desc エネミー選択カーソルの画像ファイル名
 * @default 
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param Enemy Arrow Pos
 * @desc エネミー選択カーソルの表示位置
 * @default 0
 *
 * @param Enemy Arrow Width
 * @desc エネミー選択カーソルの幅
 * @default 0
 *
 * @param Enemy Arrow Rate
 * @desc エネミー選択カーソルのアニメーションのレート
 * @default 4
 *
 * @param Enemy Arrow Rotation
 * @desc エネミー選択カーソルの回転方向
 * (0:回転なし, 1:通常の回転, 2:横回転, 3:縦回転)
 * @default 0
 *
 * @param Enemy Arrow Speed
 * @desc エネミー選択カーソルの回転速度
 * @default 0
 *
 */

(function() {
    
var parameters = PluginManager.parameters('MPP_TouchTargetSelect');
var MPPlugin = {
    SimpleTouch_Plugin:$plugins.some(function(plugin) {
        return ((plugin.name === 'MPP_SimpleTouch' ||
                 plugin.name === 'MPP_SimpleTouch2') && plugin.status);
    }),
    
    // === Actor ===
    actorWindowView:parameters['Actor Window View?'] === 'true',
    actorArrowName:parameters['Actor Arrow Name'],
    actorArrowPos:Number(parameters['Actor Arrow Pos'] || 0),
    actorArrowWidth:Number(parameters['Actor Arrow Width'] || 0),
    actorArrowRate:Number(parameters['Actor Arrow Rate'] || 4),
    actorArrowRotation:Number(parameters['Actor Arrow Rotation'] || 0),
    actorArrowSpeed:Number(parameters['Actor Arrow Speed'] || 0),
    
    // === Enemy Arrow ===
    enemyWindowView:parameters['Enemy Window View?'] === 'true',
    enemyArrowName:parameters['Enemy Arrow Name'],
    enemyArrowPos:Number(parameters['Enemy Arrow Pos'] || 0),
    enemyArrowWidth:Number(parameters['Enemy Arrow Width'] || 0),
    enemyArrowRate:Number(parameters['Enemy Arrow Rate'] || 4),
    enemyArrowRotation:Number(parameters['Enemy Arrow Rotation'] || 0),
    enemyArrowSpeed:Number(parameters['Enemy Arrow Speed'] || 0)

};

var Alias = {};

//-----------------------------------------------------------------------------
// Window_BattleActor

//21
Alias.WiBaAc_show = Window_BattleActor.prototype.show;
Window_BattleActor.prototype.show = function() {
    if (MPPlugin.actorWindowView) {
        Alias.WiBaAc_show.call(this);
    } else {
        this.select(0);
    }
};

Window_BattleActor.prototype.selectActor = function(actor) {
    if (actor && this.isCursorMovable()) {
        if (MPPlugin.SimpleTouch_Plugin) this._selecting = false;
        var lastIndex = this.index();
        this.select(actor.index());
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    }
};

Alias.WiBaAc_onTouch = Window_BattleActor.prototype.onTouch;
Window_BattleActor.prototype.onTouch = function(triggered) {
    if (this.visible) Alias.WiBaAc_onTouch.call(this, triggered);
};

//-----------------------------------------------------------------------------
// Window_BattleEnemy

//58
Alias.WiBaEn_show = Window_BattleEnemy.prototype.show;
Window_BattleEnemy.prototype.show = function() {
    if (MPPlugin.enemyWindowView) {
        Alias.WiBaEn_show.call(this);
    } else {
        this.select(0);
    }
};

Window_BattleEnemy.prototype.selectEnemy = function(enemy) {
    if (enemy && this.isCursorMovable()) {
        if (MPPlugin.SimpleTouch_Plugin) this._selecting = false;
        var lastIndex = this.index();
        var index = this._enemies.indexOf(enemy);
        if (index >= 0) this.select(index);
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    }
};

Alias.WiBaEn_onTouch = Window_BattleEnemy.prototype.onTouch;
Window_BattleEnemy.prototype.onTouch = function(triggered) {
    if (this.visible) Alias.WiBaEn_onTouch.call(this, triggered);
};

//-----------------------------------------------------------------------------
// Sprite_Battler

Sprite_Battler.prototype.createArrowSprite = function() {
    var name = this.arrowName()
    if (name) {
        this._arrowSprite = new Sprite();
        this._arrowSprite.bitmap = ImageManager.loadSystem(name);
        this._arrowSprite.anchor.x = 0.5;
        this._arrowSprite.anchor.y = 0.5;
        this.parent.addChild(this._arrowSprite);
        this._arrowAnimeCount = 0;
        this._arrowAngle = 0;
    }
};

//112
Alias.SpBa_updateSelectionEffect = Sprite_Battler.prototype.updateSelectionEffect;
Sprite_Battler.prototype.updateSelectionEffect = function() {
    Alias.SpBa_updateSelectionEffect.call(this);
    if (this._battler.isSelected()) {
        if (!this._arrowSprite) {
            this.createArrowSprite();
        }
        if (this._arrowSprite) {
            this._arrowSprite.visible = true;
            this.updateArrowAnime();
            this.updateArrowRotation();
            this.updateArrowPos();
        }
    } else if (this._arrowSprite) {
        this._arrowSprite.visible = false;
    }
};

Sprite_Battler.prototype.updateArrowAnime = function() {
    this._arrowAnimeCount++;
    var aw = this.arrowWidth();
    if (aw > 0) {
        var ah = this._arrowSprite.height;
        var ax = Math.floor(this._arrowAnimeCount / this.arrowRate()) * aw;
        var ay = 0;
        if (ax >= this._arrowSprite.width) {
            this._arrowAnimeCount = 0;
            ax = 0;
        }
        this._arrowSprite.setFrame(ax, ay, aw, ah);
    }
};

Sprite_Battler.prototype.updateArrowRotation = function() {
    this._arrowAngle += this.arrowSpeed();
    this._arrowAngle = this._arrowAngle.mod(360);
    var radian = this._arrowAngle * Math.PI / 180;
    switch (this.arrowRotation()) {
    case 1:
        this._arrowSprite.rotation = radian;
        break;
    case 2:
        this._arrowSprite.scale.x = Math.cos(radian);
        break;
    case 3:
        this._arrowSprite.scale.y = Math.cos(radian);
        break;
    }
};

Sprite_Battler.prototype.updateArrowPos = function() {
    var target = this._effectTarget;
    var pos = this.arrowPos() - 1;
    var hw = target.width / 2;
    var hh = target.height / 2;
    var ax, ay;
    if (pos === -1) {
        if (this.x < Graphics.width / 2) {
            ax = hw;
            this._arrowSprite.scale.x = 1;
        } else {
            ax = -hw;
            this._arrowSprite.scale.x = -1;
        }
        ay = -hh;
    } else {
        ax = (pos % 3 === 0 ? -hw : pos % 3 === 2 ? hw : 0);
        ay = (pos / 3 === 0 ? 0 : pos / 3 === 2 ? -hh * 2 : -hh);
    }
    this._arrowSprite.x = this.x + ax;
    this._arrowSprite.y = this.y + ay;
};

Sprite_Battler.prototype.isOverlap = function(x, y) {
    if (!this.visible) return false;
    var target = this._effectTarget;
    var tw = Math.abs(target.width * target.scale.x);
    var th = Math.abs(target.height * target.scale.y);
    var sx = this.x - tw * target.anchor.x;
    var sy = this.y - th * target.anchor.y;
    return (x >= sx && y >= sy && x < sx + tw && y < sy + th);
};

//-----------------------------------------------------------------------------
// Sprite_Actor

Sprite_Actor.prototype.arrowName = function() {
    return MPPlugin.actorArrowName;
};

Sprite_Actor.prototype.arrowPos = function() {
    return MPPlugin.actorArrowPos;
};

Sprite_Actor.prototype.arrowWidth = function() {
    return MPPlugin.actorArrowWidth;
};

Sprite_Actor.prototype.arrowRate = function() {
    return MPPlugin.actorArrowRate;
};

Sprite_Actor.prototype.arrowSpeed = function() {
    return MPPlugin.actorArrowSpeed;
};

Sprite_Actor.prototype.arrowRotation = function() {
    return MPPlugin.actorArrowRotation;
};

//-----------------------------------------------------------------------------
// Sprite_Enemy

Sprite_Enemy.prototype.arrowName = function() {
    return MPPlugin.enemyArrowName;
};

Sprite_Enemy.prototype.arrowPos = function() {
    return MPPlugin.enemyArrowPos;
};

Sprite_Enemy.prototype.arrowWidth = function() {
    return MPPlugin.enemyArrowWidth;
};

Sprite_Enemy.prototype.arrowRate = function() {
    return MPPlugin.enemyArrowRate;
};

Sprite_Enemy.prototype.arrowSpeed = function() {
    return MPPlugin.enemyArrowSpeed;
};

Sprite_Enemy.prototype.arrowRotation = function() {
    return MPPlugin.enemyArrowRotation;
};

Sprite_Enemy.prototype.isOverlap = function(x, y) {
    if (!this._enemy.isAlive()) return false;
    return Sprite_Battler.prototype.isOverlap.call(this, x, y);
};

//-----------------------------------------------------------------------------
// Spriteset_Battle

Spriteset_Battle.prototype.hitActor = function(x, y) {
    var sprites = this._actorSprites;
    for (var i = 0; i < sprites.length; i++) {
        if (sprites[i].isOverlap(x, y)) return sprites[i]._battler;
    }
    return null;
};

Spriteset_Battle.prototype.hitEnemy = function(x, y) {
    var sprites = this._enemySprites;
    for (var i = 0; i < sprites.length; i++) {
        if (sprites[i].isOverlap(x, y)) return sprites[i]._battler;
    }
    return null;
};

//-----------------------------------------------------------------------------
// Scene_Battle

//29
Alias.ScBa_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
    Alias.ScBa_update.call(this);
    this.updateTouchSelect();
};

Scene_Battle.prototype.updateTouchSelect = function() {
    var window = this._actorWindow;
    if (window.isOpenAndActive()) {
        var actor = this._spriteset.hitActor(TouchInput.x, TouchInput.y);
        if (actor) {
            if (TouchInput.isTriggered()) {
                window.selectActor(actor);
            } else if (TouchInput.isReleased() && window.isTouchOkEnabled() &&
                    actor.isSelected()) {
                window.processOk();
            }
        }
    }
    window = this._enemyWindow;
    if (window.isOpenAndActive()) {
        var enemy = this._spriteset.hitEnemy(TouchInput.x, TouchInput.y);
        if (enemy) {
            if (TouchInput.isTriggered()) {
                window.selectEnemy(enemy);
            } else if (TouchInput.isReleased() && window.isTouchOkEnabled() &&
                    enemy.isSelected()) {
                window.processOk();
            }
        }
    }
};

})();
