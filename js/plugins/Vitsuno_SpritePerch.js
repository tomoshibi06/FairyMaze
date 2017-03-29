//=============================================================================
// Vitsuno_SpritePerch.js
//-----------------------------------------------------------------------------
// Copyright (c) 2015 Tsuno Ozumi
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

var Vitsuno = Vitsuno || {};
Vitsuno.Perch = {};
Vitsuno.Perch.version = 0.75;

/* <mymemo>
 *   Perch_Base, Perch_Selectable, Perch_Command を Window_xxx に継承する。
 *     Perch_Base       : this.addChild(sprite) で画像を追加するだけのクラス
 *     Perch_Selectable : 選択用に drawItem を再定義して画像コマンドを作るクラス
 *     Perch_Command    : 上記に Window_Command と同様の機能を追加したクラス
 *
 *   Window関連クラスの継承元の変更:
 *     Vitsuno.changeSuperClass(Window_xxx, Perch_xxxx);
 *
 *   継承先での drawItem 定義のヒント:
 *     <ロード方式>
 *     var sprite = this.selectableSprite(index); // スプライトを取得
 *     if (sprite) {
 *         sprite.bitmap = loadBitmap;            // ビットマップを設定
 *         sprite.setFrame(fx, fy, w, h);         // フレーム範囲を指定
 *         sprite.move(x, y);                     // 表示位置の座標を設定
 *     }
 *
 *     <描画方式>
 *     var sprite = this.selectableSprite(index); // スプライトを取得
 *     if (sprite) {
 *         if (!sprite.bitmap) {
 *             sprite.bitmap = new Bitmap(w, h);  // ビットマップを作成
 *         } else {
 *             sprite.bitmap.clear();             // ビットマップをクリア
 *         }
 *         this.contents = sprite.bitmap;         // コンテンツを設定
 *         this.draw~~~(~~~);                     // コンテンツに描画
 *         this.releaseContents();                // コンテンツを解放
 *         sprite.move(x, y);                     // 表示位置の座標を設定
 *     }
 *
 *   継承先での clearItem に必要に応じて再定義する。
 */

/*:
 * @plugindesc スプライト集合オブジェクト『パーチ』を定義するベースプラグインです。
 * @author 尾角 つの (Tsuno Ozumi)
 *
 * @param Cursor Position
 * @desc
 * カーソル基準位置を指定します。(top, bottom, left, right,
 * center, top-left, top-right, bottom-left, bottom-right)
 * @default top-right
 *
 * @param Cursor Offset X
 * @desc カーソル位置のX座標を値分ずらします。
 * @default 0
 *
 * @param Cursor Offset Y
 * @desc カーソル位置のY座標を値分ずらします。
 * @default 0
 *
 * @param Cursor Interval
 * @desc カーソルの更新間隔を設定します。
 * @default 10
 *
 * @help
 * 
 * 画像コマンドなど、スプライトを集合管理できるパーチを定義します。
 * 
 * 必要画像 : 以下のファイルを img/system に入れてください。
 *   PerchCursor.png  # 画像コマンド用カーソル画像 (正方形パターンを横に並べる)
 *
 * このプラグインには、プラグインコマンドはありません。
 */

// ● プラグインの設定値を取得
Vitsuno.Perch.parameters = PluginManager.parameters('Vitsuno_SpritePerch');
Vitsuno.Perch.cursorPosition = Vitsuno.Perch.parameters['Cursor Position'] || 'top';
Vitsuno.Perch.cursorOffsetX = Number(Vitsuno.Perch.parameters['Cursor Offset X'] || 0);
Vitsuno.Perch.cursorOffsetY = Number(Vitsuno.Perch.parameters['Cursor Offset Y'] || 0);
Vitsuno.Perch.cursorInterval = Number(Vitsuno.Perch.parameters['Cursor Interval'] || 10);

//-----------------------------------------------------------------------------
// Vitsuno
//-----------------------------------------------------------------------------

// ● 継承元を変更する
Vitsuno.changeSuperClass = function(target, superClass) {
    var oldPrototype = target.prototype;
    target.prototype = Object.create(superClass.prototype);
    target.prototype.constructor = target;
    for (var property in oldPrototype) {
        if (oldPrototype.hasOwnProperty(property)){
            target.prototype[property] = oldPrototype[property];
        }
    }
};

//-----------------------------------------------------------------------------
// Bitmap
//-----------------------------------------------------------------------------

// ● 線の描画
Bitmap.prototype.strokeLine = function(x1, y1, x2, y2, color, lineWidth) {
    if (lineWidth === undefined) {
        lineWidth = 1.0;
    }
    var context = this._context;
    context.save();                  // 描画状態(色や太さ等)を保存
    context.strokeStyle = color;     // 色を設定
    context.lineWidth = lineWidth;   // ラインの太さを設定
    context.beginPath();             // パスの描画を開始
    context.moveTo(x1, y1);          // パスを初期位置へ移動
    context.lineTo(x2, y2);          // パスのラインを描画
    context.stroke();                // パスに沿って実線を描画
    context.restore();               // 描画状態を保存
    this._setDirty();
};

//-----------------------------------------------------------------------------
// Perch
//-----------------------------------------------------------------------------

// ● クラスの生成
function Perch() {
    this.initialize.apply(this, arguments);
}

// ● クラスの継承
Perch.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
Perch.prototype.constructor = Perch;

// ● 初期化
Perch.prototype.initialize = function() {
    PIXI.DisplayObjectContainer.call(this);
    this._isWindow = false;
    this._width = 0;
    this._height = 0;
    this._cursorRect = new Rectangle();
    this._openness = 255;
    this._animationCount = 0;
    
    this._contentsBitmap = null;
    
    this._cursorBitmap = null;
    this._cursorPosition = Vitsuno.Perch.cursorPosition;
    this._cursorOffsetX = Vitsuno.Perch.cursorOffsetX;
    this._cursorOffsetY = Vitsuno.Perch.cursorOffsetY;
    this._cursorInterval = Vitsuno.Perch.cursorInterval;
    this._perchCursorSprite = null;
    
    this._createAllParts();
    
    this.active = true;
    
    this.cursorVisible = false;
};

// ● 内容のビットマップの取得
Object.defineProperty(Perch.prototype, 'contents', {
    get: function() {
        return this._contentsBitmap;
    },
    set: function(value) {
        this._contentsBitmap = value;
    },
    configurable: true
});

// ● 幅の取得
Object.defineProperty(Perch.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(value) {
        this._width = value;
        this._refreshAllParts();
    },
    configurable: true
});

// ● 高さの取得
Object.defineProperty(Perch.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(value) {
        this._height = value;
        this._refreshAllParts();
    },
    configurable: true
});

// ● オープン度のプロパティ設定
Object.defineProperty(Perch.prototype, 'openness', {
    get: function() {
        return this._openness;
    },
    set: function(value) {
        if (this._openness !== value) {
            this._openness = value.clamp(0, 255);
        }
    },
    configurable: true
});

// ● カーソルビットマップの設定
Object.defineProperty(Perch.prototype, 'cursorBitmap', {
    get: function() {
        return this._cursorBitmap;
    },
    set: function(value) {
        if (this._cursorBitmap !== value) {
            this._cursorBitmap = value;
            this._cursorBitmap.addLoadListener(this._onCursorBitmapLoad.bind(this));
        }
    },
    configurable: true
});

// ● カーソル位置の設定
Object.defineProperty(Perch.prototype, 'cursorPosition', {
    get: function() {
        return this._cursorPosition;
    },
    set: function(value) {
        if (this._cursorPosition !== value) {
            this._cursorPosition = value;
            this._refreshCursor();
        }
    },
    configurable: true
});

// ● カーソルオフセットX座標の設定
Object.defineProperty(Perch.prototype, 'cursorOffsetX', {
    get: function() {
        return this._cursorOffsetX;
    },
    set: function(value) {
        if (this._cursorOffsetX !== value) {
            this._cursorOffsetX = value;
            this._refreshCursor();
        }
    },
    configurable: true
});

// ● カーソルオフセットY座標の設定
Object.defineProperty(Perch.prototype, 'cursorOffsetY', {
    get: function() {
        return this._cursorOffsetY;
    },
    set: function(value) {
        if (this._cursorOffsetY !== value) {
            this._cursorOffsetY = value;
            this._refreshCursor();
        }
    },
    configurable: true
});

// ● カーソル更新間隔の設定
Object.defineProperty(Perch.prototype, 'cursorInterval', {
    get: function() {
        return this._cursorInterval;
    },
    set: function(value) {
        this._cursorInterval = value;
    },
    configurable: true
});

// ● カーソルの表示設定
Object.defineProperty(Perch.prototype, 'cursorVisible', {
    get: function() {
        return this._perchCursorSprite.visible;
    },
    set: function(value) {
        this._perchCursorSprite.visible = value;
    },
    configurable: true
});

// ● フレーム更新
Perch.prototype.update = function() {
    if (this.active) {
        this._animationCount++;
    }
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
};

// ● コンテンツ内容を解放する
Perch.prototype.releaseContents = function() {
    this.contents = null;
};

// ● 移動する
Perch.prototype.move = function(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    if (this._width !== width || this._height !== height) {
        this._width = width || 0;
        this._height = height || 0;
        this._refreshAllParts();
    }
};

// ● カーソルオフセット座標を設定する
Perch.prototype.setCursorOffset = function(ox, oy) {
    if (this._cursorOffsetX !== ox || this._cursorOffsetY !== oy) {
        this._cursorOffsetX = ox;
        this._cursorOffsetY = oy;
        this._refreshCursor();
    }
};

// ● オープン状態判定
Perch.prototype.isOpen = function() {
    return this._openness >= 255;
};

// ● クローズ状態判定
Perch.prototype.isClosed = function() {
    return this._openness <= 0;
};

// ● カーソル位置を設定
Perch.prototype.setCursorRect = function(x, y, width, height) {
    var cx = Math.floor(x || 0);
    var cy = Math.floor(y || 0);
    var cw = Math.floor(width || 0);
    var ch = Math.floor(height || 0);
    var rect = this._cursorRect;
    if (rect.x !== cx || rect.y !== cy || rect.width !== cw || rect.height !== ch) {
        this._cursorRect.x = cx;
        this._cursorRect.y = cy;
        this._cursorRect.width = cw;
        this._cursorRect.height = ch;
        this._refreshCursor();
    }
};

// ● 子オブジェクトを追加
Perch.prototype.addChild = function(child) {
    var cursorIndex = this.children.indexOf(this._perchCursorSprite);
    return this.addChildAt(child, cursorIndex);
};

// ● 前面に子オブジェクトを追加
Perch.prototype.addChildToFront = function(child) {
    return this.addChildAt(child, this.children.length);
};

// ● 背面に子オブジェクトを追加
Perch.prototype.addChildToBack = function(child) {
    return this.addChildAt(child, 0);
};

// ● 状態の更新
Perch.prototype.updateTransform = function() {
    this._updateCursor();
    PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);
};

// ● パーツの作成
Perch.prototype._createAllParts = function() {
    this._perchCursorSprite = new Sprite();
    this.addChildToFront(this._perchCursorSprite);
};

// ● カーソルビットマップのロード
Perch.prototype._onCursorBitmapLoad = function() {
    this._refreshAllParts();
};

// ● パーツのリフレッシュ
Perch.prototype._refreshAllParts = function() {
    this._refreshCursor();
};

// ● カーソルのリフレッシュ
Perch.prototype._refreshCursor = function() {
    this._perchCursorSprite.bitmap = this._cursorBitmap;
    this._updateCursor();
    this._moveCursor();
};

// ● カーソルの更新
Perch.prototype._updateCursor = function() {
    if (this._cursorBitmap) {
        var size = this._cursorBitmap.height;
        if (this.active) {
            var fs = this._cursorBitmap.width / size;
            var fi = this._cursorInterval;
            var px = size * Math.floor(this._animationCount / fi % fs);
            this._perchCursorSprite.setFrame(px, 0, size, size);
        } else {
            this._perchCursorSprite.setFrame(0, 0, size, size);
        }
    }
};

// ● カーソルの移動
Perch.prototype._moveCursor = function() {
    var rect = this._cursorRect;
    var sprite = this._perchCursorSprite;
    switch (this._cursorPosition) {
        case 'top':
            var cx = rect.x + rect.width / 2;
            var cy = rect.y;
            break;
        case 'bottom':
            var cx = rect.x + rect.width / 2;
            var cy = rect.y + rect.height;
            break;
        case 'left':
            var cx = rect.x;
            var cy = rect.y + rect.height / 2;
            break;
        case 'right':
            var cx = rect.x + rect.width;
            var cy = rect.y + rect.height / 2;
            break;
        case 'top-left':
            var cx = rect.x;
            var cy = rect.y;
            break;
        case 'top-right':
            var cx = rect.x + rect.width;
            var cy = rect.y;
            break;
        case 'bottom-left':
            var cx = rect.x;
            var cy = rect.y + rect.height;
            break;
        case 'bottom-right':
            var cx = rect.x + rect.width;
            var cy = rect.y + rect.height;
            break;
        default:
            var cx = rect.x + rect.width / 2;
            var cy = rect.y + rect.height / 2;
            break;
    }
    this._perchCursorSprite.x = cx - sprite.width / 2 + this._cursorOffsetX;
    this._perchCursorSprite.y = cy - sprite.height / 2 + this._cursorOffsetY;
};

//-----------------------------------------------------------------------------
// Perch_Base
//-----------------------------------------------------------------------------

// ● クラスの生成
function Perch_Base() {
    this.initialize.apply(this, arguments);
}

// ● クラスの継承
Perch_Base.prototype = Object.create(Perch.prototype);
Perch_Base.prototype.constructor = Perch_Base;

// ● 初期化
Perch_Base.prototype.initialize = function(x, y, width, height) {
    Perch.prototype.initialize.call(this);
    this.loadCursorBitmap();
    this.move(x, y, width, height);
    this.updatePadding();
    this._opening = false;
    this._closing = false;
};

// ● 余白の標準値の取得
Perch_Base.prototype.standardPadding = function() {
    return 18;
};

// ● カーソルビットマップのロード
Perch_Base.prototype.loadCursorBitmap = function() {
    this.cursorBitmap = ImageManager.loadSystem('PerchCursor');
};

// ● 余白の更新
Perch_Base.prototype.updatePadding = function() {
    this.padding = this.standardPadding();
};

// ● フレーム更新
Perch_Base.prototype.update = function() {
    Perch.prototype.update.call(this);
    this.updateOpen();
    this.updateClose();
};

// ● オープン更新
Perch_Base.prototype.updateOpen = function() {
    if (this._opening) {
        this.openness += 32;
        if (this.isOpen()) {
            this._opening = false;
        }
    }
};

// ● クローズ更新
Perch_Base.prototype.updateClose = function() {
    if (this._closing) {
        this.openness -= 32;
        if (this.isClosed()) {
            this._closing = false;
        }
    }
};

// ● 開く
Perch_Base.prototype.open = function() {
    if (!this.isOpen()) {
        this._opening = true;
    }
    this._closing = false;
};

// ● 閉じる
Perch_Base.prototype.close = function() {
    if (!this.isClosed()) {
        this._closing = true;
    }
    this._opening = false;
};

// ● オープン中判定
Perch_Base.prototype.isOpening = function() {
    return this._opening;
};

// ● クローズ中判定
Perch_Base.prototype.isClosing = function() {
    return this._closing;
};

// ● 表示する
Perch_Base.prototype.show = function() {
    this.visible = true;
};

// ● 隠す
Perch_Base.prototype.hide = function() {
    this.visible = false;
};

// ● アクティブ状態にする
Perch_Base.prototype.activate = function() {
    this.active = true;
};

// ● アクティブ状態を解除する
Perch_Base.prototype.deactivate = function() {
    this.active = false;
};

// ● ローカルなX座標の取得
Perch_Base.prototype.canvasToLocalX = function(x) {
    var node = this;
    while (node) {
        x -= node.x;
        node = node.parent;
    }
    return x;
};

// ● ローカルなY座標の取得
Perch_Base.prototype.canvasToLocalY = function(y) {
    var node = this;
    while (node) {
        y -= node.y;
        node = node.parent;
    }
    return y;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// 以下の機能を使用する場合、this.contents に描画したいビットマップを入れてから使用する。
// 描画が終わったら this.releaseContents() を呼び出す。

// ● ラインの高さ
Perch_Base.prototype.lineHeight = function() {
    return 36;
};

// ● テキストの描画
Perch_Base.prototype.drawText = function(text, x, y, maxWidth, align) {
    this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), align);
};

// ● アイコンの描画
Perch_Base.prototype.drawIcon = function(iconIndex, x, y) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
};

// ● 顔グラフィックの描画
Perch_Base.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
    width = width || Window_Base._faceWidth;
    height = height || Window_Base._faceHeight;
    var bitmap = ImageManager.loadFace(faceName);
    var pw = Window_Base._faceWidth;
    var ph = Window_Base._faceHeight;
    var sw = Math.min(width, pw);
    var sh = Math.min(height, ph);
    var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    var sx = faceIndex % 4 * pw + (pw - sw) / 2;
    var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
};

// ● 歩行キャラクターの描画
Perch_Base.prototype.drawCharacter = function(characterName, characterIndex, x, y) {
    var bitmap = ImageManager.loadCharacter(characterName);
    var big = ImageManager.isBigCharacter(characterName);
    var pw = bitmap.width / (big ? 3 : 12);
    var ph = bitmap.height / (big ? 4 : 8);
    var n = characterIndex;
    var sx = (n % 4 * 3 + 1) * pw;
    var sy = (Math.floor(n / 4) * 4) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
};

// (ここまで)
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

//-----------------------------------------------------------------------------
// Perch_Selectable
//-----------------------------------------------------------------------------

// ● クラスの生成
function Perch_Selectable() {
    this.initialize.apply(this, arguments);
}

// ● クラスの継承
Perch_Selectable.prototype = Object.create(Perch_Base.prototype);
Perch_Selectable.prototype.constructor = Perch_Selectable;

// ● 初期化
Perch_Selectable.prototype.initialize = function(x, y, width, height) {
    Perch_Base.prototype.initialize.call(this, x, y, width, height);
    this._selectableSprites = [];
    this._index = -1;
    this._cursorFixed = false;
    this._stayCount = 0;
    this._helpWindow = null;
    this._handlers = {};
    this._touching = false;
    this.cursorVisible = true;
    this.deactivate();
};

// ● 選択画像の取得
Perch_Selectable.prototype.selectableSprite = function(index) {
    return index >= 0 ? this._selectableSprites[index] : null;
};

// ● 選択中の画像の取得
Perch_Selectable.prototype.selectedSprite = function() {
    return this.selectableSprite(this.index());
};

// ● インデックスの取得
Perch_Selectable.prototype.index = function() {
    return this._index;
};

// ● カーソル固定状態の取得
Perch_Selectable.prototype.cursorFixed = function() {
    return this._cursorFixed;
};

// ● カーソル固定状態の設定
Perch_Selectable.prototype.setCursorFixed = function(cursorFixed) {
    this._cursorFixed = cursorFixed;
};

// ● 要素数の取得 (継承先で再定義する)
Perch_Selectable.prototype.maxItems = function() {
    return 0;
};

// ● 列数の取得
Perch_Selectable.prototype.maxCols = function() {
    return 1;
};

// ● 行数の取得
Perch_Selectable.prototype.maxRows = function() {
    return Math.max(Math.ceil(this.maxItems() / this.maxCols()), 1);
};

// ● アクティブ状態にする
Perch_Selectable.prototype.activate = function() {
    Perch_Base.prototype.activate.call(this);
    this.reselect();
};

// ● アクティブ状態を解除する
Perch_Selectable.prototype.deactivate = function() {
    Perch_Base.prototype.deactivate.call(this);
    this.reselect();
};

// ● 項目の選択
Perch_Selectable.prototype.select = function(index) {
    this._index = index;
    this._stayCount = 0;
    this.ensureCursorVisible();
    this.updateCursor();
    this.callUpdateHelp();
};

// ● 項目の選択解除
Perch_Selectable.prototype.deselect = function() {
    this.select(-1);
};

// ● 項目の再選択
Perch_Selectable.prototype.reselect = function() {
    this.select(this._index);
};

// ● 項目の表示範囲の取得
Perch_Selectable.prototype.itemRect = function(index) {
    var rect = new Rectangle();
    var sprite = this.selectableSprite(index);
    if (sprite) {
        rect.x = sprite.x - sprite.width * sprite.anchor.x;
        rect.y = sprite.y - sprite.height * sprite.anchor.y;
        rect.width = sprite.width;
        rect.height = sprite.height;
    }
    return rect;
};

// ● ヘルプウィンドウの関連付け
Perch_Selectable.prototype.setHelpWindow = function(helpWindow) {
    this._helpWindow = helpWindow;
    this.callUpdateHelp();
};

// ● ヘルプウィンドウを表示
Perch_Selectable.prototype.showHelpWindow = function() {
    if (this._helpWindow) {
        this._helpWindow.show();
    }
};

// ● ヘルプウィンドウを隠す
Perch_Selectable.prototype.hideHelpWindow = function() {
    if (this._helpWindow) {
        this._helpWindow.hide();
    }
};

// ● ハンドラの設定
Perch_Selectable.prototype.setHandler = function(symbol, method) {
    this._handlers[symbol] = method;
};

// ● ハンドラの存在確認
Perch_Selectable.prototype.isHandled = function(symbol) {
    return !!this._handlers[symbol];
};

// ● ハンドラを呼び出す
Perch_Selectable.prototype.callHandler = function(symbol) {
    if (this.isHandled(symbol)) {
        this._handlers[symbol]();
    }
};

// ● 動作可能判定
Perch_Selectable.prototype.isOpenAndActive = function() {
    return this.isOpen() && this.active;
};

// ● カーソル移動可能判定
Perch_Selectable.prototype.isCursorMovable = function() {
    return (this.isOpenAndActive() && !this._cursorFixed &&
            this.maxItems() > 0);
};

// ● カーソルの移動
Perch_Selectable.prototype.cursorMove = function(calcDistance) {
    var currentSprite = this.selectedSprite();
    if (currentSprite) {
        var selectIndex = this.index();
        var distance = Number.MAX_VALUE;
        for (var i = 0; i < this.maxItems(); i++) {
            var sprite = this.selectableSprite(i);
            if (sprite) {
                // 距離を計算して一番近い画像のインデックスを探す。
                var d = calcDistance(sprite, currentSprite);
                if (d < distance) {
                    selectIndex = i;
                    distance = d;
                }
            }
        }
        this.select(selectIndex);
    }
};

// ● カーソルを下に移動
Perch_Selectable.prototype.cursorDown = function(wrap) {
    this.cursorMove(function(sprite, currentSprite) {
        if (sprite.y > currentSprite.y) {
            // X 座標の間隔を補正して距離を計算する。
            var dx = (currentSprite.x - sprite.x) * 2;
            var dy = currentSprite.y - sprite.y;
            return Math.sqrt(dx * dx + dy * dy);
        } else {
            return Infinity;
        }
    });
};

// ● カーソルを上に移動
Perch_Selectable.prototype.cursorUp = function(wrap) {
    this.cursorMove(function(sprite, currentSprite) {
        if (sprite.y < currentSprite.y) {
            // X 座標の間隔を補正して距離を計算する。
            var dx = (currentSprite.x - sprite.x) * 2;
            var dy = currentSprite.y - sprite.y;
            return Math.sqrt(dx * dx + dy * dy);
        } else {
            return Infinity;
        }
    });
};

// ● カーソルを右に移動
Perch_Selectable.prototype.cursorRight = function(wrap) {
    this.cursorMove(function(sprite, currentSprite) {
        if (sprite.x > currentSprite.x) {
            // Y 座標の間隔を補正して距離を計算する。
            var dx = currentSprite.x - sprite.x;
            var dy = (currentSprite.y - sprite.y) * 2;
            return Math.sqrt(dx * dx + dy * dy);
        } else {
            return Infinity;
        }
    });
};

// ● カーソルを右に移動
Perch_Selectable.prototype.cursorLeft = function(wrap) {
    this.cursorMove(function(sprite, currentSprite) {
        if (sprite.x < currentSprite.x) {
            // Y 座標の間隔を補正して距離を計算する。
            var dx = currentSprite.x - sprite.x;
            var dy = (currentSprite.y - sprite.y) * 2;
            return Math.sqrt(dx * dx + dy * dy);
        } else {
            return Infinity;
        }
    });
};

// ● カーソルを下にページ移動
Perch_Selectable.prototype.cursorPagedown = function() {
    // メモ : スクロール機能を拡張した時に定義する。
};

// ● カーソルを上にページ移動
Perch_Selectable.prototype.cursorPageup = function() {
    // メモ : スクロール機能を拡張した時に定義する。
};

// ● フレーム更新
Perch_Selectable.prototype.update = function() {
    Perch_Base.prototype.update.call(this);
    this.processCursorMove();
    this.processHandling();
    this.processWheel();
    this.processTouch();
    this._stayCount++;
};

// ● カーソル移動処理
Perch_Selectable.prototype.processCursorMove = function() {
    if (this.isCursorMovable()) {
        var lastIndex = this.index();
        if (Input.isRepeated('down')) {
            this.cursorDown(Input.isTriggered('down'));
        }
        if (Input.isRepeated('up')) {
            this.cursorUp(Input.isTriggered('up'));
        }
        if (Input.isRepeated('right')) {
            this.cursorRight(Input.isTriggered('right'));
        }
        if (Input.isRepeated('left')) {
            this.cursorLeft(Input.isTriggered('left'));
        }
        if (!this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.cursorPagedown();
        }
        if (!this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.cursorPageup();
        }
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    }
};

// ● ハンドラ処理
Perch_Selectable.prototype.processHandling = function() {
    if (this.isOpenAndActive()) {
        if (this.isOkEnabled() && this.isOkTriggered()) {
            this.processOk();
        } else if (this.isCancelEnabled() && this.isCancelTriggered()) {
            this.processCancel();
        } else if (this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.processPagedown();
        } else if (this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.processPageup();
        }
    }
};

// ● ホイール処理
Perch_Selectable.prototype.processWheel = function() {
    // メモ : スクロール機能を拡張した時に定義する。
};

// ● タッチ処理
Perch_Selectable.prototype.processTouch = function() {
    if (this.isOpenAndActive()) {
        if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
            this._touching = true;
            this.onTouch(true);
        } else if (TouchInput.isCancelled()) {
            if (this.isCancelEnabled()) {
                this.processCancel();
            }
        }
        if (this._touching) {
            if (TouchInput.isPressed()) {
                this.onTouch(false);
            } else {
                this._touching = false;
            }
        }
    } else {
        this._touching = false;
    }
};

// ● タッチが範囲で行われたか判定
Perch_Selectable.prototype.isTouchedInsideFrame = function() {
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};

// ● タッチ操作
//     この項目は、継承先の選択タイプによって内容を再定義する事を推奨する。
Perch_Selectable.prototype.onTouch = function(triggered) {
    var lastIndex = this.index();
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    var hitIndex = this.hitTest(x, y);
    if (hitIndex >= 0) {
        if (hitIndex === this.index()) {
            if (triggered && this.isTouchOkEnabled()) {
                this.processOk();
            }
        } else if (this.isCursorMovable()) {
            this.select(hitIndex);
        }
    }
    if (this.index() !== lastIndex) {
        SoundManager.playCursor();
    }
    // メモ : 移動処理は省いているため必要になったら拡張する
};

// ● タッチテスト
Perch_Selectable.prototype.hitTest = function(x, y) {
    if (this.isContentsArea(x, y)) {
        for (var i = 0; i < this.maxItems(); i++) {
            if (this.selectableSprite(i)) {
                var rect = this.itemRect(i);
                var right = rect.x + rect.width;
                var bottom = rect.y + rect.height;
                if (x >= rect.x && y >= rect.y && x < right && y < bottom) {
                    return i;
                }
            }
        }
    }
    return -1;
};

// ● コンテンツ範囲判定
Perch_Selectable.prototype.isContentsArea = function(x, y) {
    var left = 0;
    var top = 0;
    var right = this.width;
    var bottom = this.height;
    return (x >= left && y >= top && x < right && y < bottom);
};

// ● タッチ決定可能判定
Perch_Selectable.prototype.isTouchOkEnabled = function() {
    return this.isOkEnabled();
};

// ● 決定可能判定
Perch_Selectable.prototype.isOkEnabled = function() {
    return this.isHandled('ok');
};

// ● キャンセル可能判定
Perch_Selectable.prototype.isCancelEnabled = function() {
    return this.isHandled('cancel');
};

// ● 決定キーの押下判定
Perch_Selectable.prototype.isOkTriggered = function() {
    return Input.isRepeated('ok');
};

// ● キャンセルキーの押下判定
Perch_Selectable.prototype.isCancelTriggered = function() {
    return Input.isRepeated('cancel');
};

// ● 決定処理
Perch_Selectable.prototype.processOk = function() {
    if (this.isCurrentItemEnabled()) {
        this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    } else {
        this.playBuzzerSound();
    }
};

// ● 決定音を鳴らす
Perch_Selectable.prototype.playOkSound = function() {
    SoundManager.playOk();
};

// ● ブザー音を鳴らす
Perch_Selectable.prototype.playBuzzerSound = function() {
    SoundManager.playBuzzer();
};

// ● 決定処理を呼び出す
Perch_Selectable.prototype.callOkHandler = function() {
    this.callHandler('ok');
};

// ● キャンセル処理
Perch_Selectable.prototype.processCancel = function() {
    SoundManager.playCancel();
    this.updateInputData();
    this.deactivate();
    this.callCancelHandler();
};

// ● キャンセル処理を呼び出す
Perch_Selectable.prototype.callCancelHandler = function() {
    this.callHandler('cancel');
};

// ● ページアップ処理
Perch_Selectable.prototype.processPageup = function() {
    SoundManager.playCursor();
    this.updateInputData();
    this.deactivate();
    this.callHandler('pageup');
};

// ● ページダウン処理
Perch_Selectable.prototype.processPagedown = function() {
    SoundManager.playCursor();
    this.updateInputData();
    this.deactivate();
    this.callHandler('pagedown');
};

// ● インプットデータの更新
Perch_Selectable.prototype.updateInputData = function() {
    Input.update();
    TouchInput.update();
};

// ● カーソルの更新
Perch_Selectable.prototype.updateCursor = function() {
    var sprite = this.selectedSprite();
    if (sprite) {
        var rect = this.itemRect(this.index());
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
        this.cursorVisible = true;
    } else {
        this.cursorVisible = false;
    }
};

// ● カーソルが見える位置に移動 
Perch_Selectable.prototype.ensureCursorVisible = function() {
    // メモ : スクロール機能を拡張した時に定義する。
};

// ● ヘルプウィンドウの更新を呼び出す
Perch_Selectable.prototype.callUpdateHelp = function() {
    if (this.active && this._helpWindow) {
        this.updateHelp();
    }
};

// ● ヘルプウィンドウを更新
Perch_Selectable.prototype.updateHelp = function() {
    this._helpWindow.clear();
};

// ● ヘルプウィンドウにアイテムを設定
Perch_Selectable.prototype.setHelpWindowItem = function(item) {
    if (this._helpWindow) {
        this._helpWindow.setItem(item);
    }
};

// ● 現在の項目の選択可能判定
Perch_Selectable.prototype.isCurrentItemEnabled = function() {
    return true;
};

// ● 全項目を描画
Perch_Selectable.prototype.drawAllItems = function() {
    for (var i = 0; i < this.maxItems(); i++) {
        this.drawItem(i);
    }
};

// ● 全項目をクリア
Perch_Selectable.prototype.clearAllItems = function() {
    for (var i = 0; i < this.maxItems(); i++) {
        this.clearItem(i);
    }
};

// ● 項目を描画 (継承先で再定義する)
Perch_Selectable.prototype.drawItem = function(index) {
    // ヒント : 選択画像のビットマップ、フレーム、表示位置を設定する。
};

// ● 項目をクリア (継承先で再定義する)
Perch_Selectable.prototype.clearItem = function(index) {
    // ヒント : ロード方式ならビットマップにnullを代入
    //         描画方式ならビットマップをclearする
};

// ● 項目を再描画
Perch_Selectable.prototype.redrawItem = function(index) {
    if (index >= 0) {
        this.clearItem(index);
        this.drawItem(index);
    }
};

// ● 現在の項目を再描画
Perch_Selectable.prototype.redrawCurrentItem = function() {
    this.redrawItem(this.index());
};

// ● リフレッシュ
Perch_Selectable.prototype.refresh = function() {
    this.refreshSelectableSprites();
    this.clearAllItems();
    this.drawAllItems();
    this.updateCursor();
};

// ● 選択画像のリフレッシュ
Perch_Selectable.prototype.refreshSelectableSprites = function() {
    while (this._selectableSprites.length > this.maxItems()) {
        this.removeChild(this._selectableSprites.pop());
    }
    while (this._selectableSprites.length < this.maxItems()) {
        this._selectableSprites.push(this.addChild(new Sprite()));
    }
};

//-----------------------------------------------------------------------------
// Perch_Command
//-----------------------------------------------------------------------------

// ● クラスの生成
function Perch_Command() {
    this.initialize.apply(this, arguments);
}

// ● クラスの継承
Perch_Command.prototype = Object.create(Perch_Selectable.prototype);
Perch_Command.prototype.constructor = Perch_Command;

// ● 初期化
Perch_Command.prototype.initialize = function(x, y) {
    this.clearCommandList();
    this.makeCommandList();
    var width = this.perchWidth();
    var height = this.perchHeight();
    Perch_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.select(0);
    this.activate();
    
};

// ● 幅の取得 (継承先で再定義する)
Perch_Command.prototype.perchWidth = function() {
    return 240;
};

// ● 高さの取得 (継承先で再定義する)
Perch_Command.prototype.perchHeight = function() {
    return 240;
};

// ● 要素数の取得
Perch_Command.prototype.maxItems = function() {
    return this._list.length;
};

// ● コマンドリストのクリア
Perch_Command.prototype.clearCommandList = function() {
    this._list = [];
};

// ● コマンドリストの作成 (継承先で再定義する)
Perch_Command.prototype.makeCommandList = function() {
};

// ● コマンドの追加
Perch_Command.prototype.addCommand = function(name, symbol, enabled, ext) {
    if (enabled === undefined) {
        enabled = true;
    }
    if (ext === undefined) {
        ext = null;
    }
    this._list.push({ name: name, symbol: symbol, enabled: enabled, ext: ext});
};

// ● コマンド名の取得
Perch_Command.prototype.commandName = function(index) {
    return this._list[index].name;
};

// ● コマンドシンボルの取得
Perch_Command.prototype.commandSymbol = function(index) {
    return this._list[index].symbol;
};

// ● コマンド選択可能状態の取得
Perch_Command.prototype.isCommandEnabled = function(index) {
    return this._list[index].enabled;
};

// ● 現在のコマンドの取得
Perch_Command.prototype.currentData = function() {
    return this.index() >= 0 ? this._list[this.index()] : null;
};

// ● 現在のコマンドの選択可能状態の取得
Perch_Command.prototype.isCurrentItemEnabled = function() {
    return this.currentData() ? this.currentData().enabled : false;
};

// ● 現在のコマンドのシンボルの取得
Perch_Command.prototype.currentSymbol = function() {
    return this.currentData() ? this.currentData().symbol : null;
};

// ● 現在のコマンドの拡張情報を取得
Perch_Command.prototype.currentExt = function() {
    return this.currentData() ? this.currentData().ext : null;
};

// ● シンボルからコマンドのインデックスを取得
Perch_Command.prototype.findSymbol = function(symbol) {
    for (var i = 0; i < this._list.length; i++) {
        if (this._list[i].symbol === symbol) {
            return i;
        }
    }
    return -1;
};

// ● シンボルからコマンドを選択
Perch_Command.prototype.selectSymbol = function(symbol) {
    var index = this.findSymbol(symbol);
    if (index >= 0) {
        this.select(index);
    } else {
        this.select(0);
    }
};

// ● 拡張情報からコマンドのインデックスを取得
Perch_Command.prototype.findExt = function(ext) {
    for (var i = 0; i < this._list.length; i++) {
        if (this._list[i].ext === ext) {
            return i;
        }
    }
    return -1;
};

// ● 拡張情報からコマンドを選択
Perch_Command.prototype.selectExt = function(ext) {
    var index = this.findExt(ext);
    if (index >= 0) {
        this.select(index);
    } else {
        this.select(0);
    }
};

// ● 決定可能判定
Perch_Command.prototype.isOkEnabled = function() {
    return true;
};

// ● 決定処理を呼び出す
Perch_Command.prototype.callOkHandler = function() {
    var symbol = this.currentSymbol();
    if (this.isHandled(symbol)) {
        this.callHandler(symbol);
    } else if (this.isHandled('ok')) {
        Perch_Selectable.prototype.callOkHandler.call(this);
    } else {
        this.activate();
    }
};

// ● リフレッシュ
Perch_Command.prototype.refresh = function() {
    this.clearCommandList();
    this.makeCommandList();
    Perch_Selectable.prototype.refresh.call(this);
};

//-----------------------------------------------------------------------------
// Scene_Base
//-----------------------------------------------------------------------------

// ● パーチを追加
Scene_Base.prototype.addPerch = function(child) {
    var cursorIndex = this.children.indexOf(this._windowLayer);
    return this.addChildAt(child, cursorIndex);
};

//-----------------------------------------------------------------------------
// Scene_Boot
//-----------------------------------------------------------------------------

// ● システム画像をロード
Vitsuno.Perch.SBoot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
Scene_Boot.prototype.loadSystemImages = function() {
    Vitsuno.Perch.SBoot_loadSystemImages.call(this);
    ImageManager.loadSystem('PerchCursor');
};