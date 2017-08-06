//=============================================================================
// TN_LightSaveData_Map.js
//=============================================================================
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
/*:ja
 * @plugindesc マップ上のイベントの情報をセーブ対象から外して、セーブファイルを軽量化します。
 * @author terunon（エイリアスエイク）
 * @version 1.02
 *
 * @help
 * イベントの情報をセーブ対象から外してセーブ容量を減らします。
 * サーバーセーブ容量に限界があるRPGアツマール環境で有効です。
 *
 * ツクールではセーブ時、マップ内の全イベントの情報をセーブするため
 * イベント数の多いマップでセーブするとセーブ容量が大きく増えますが、
 * 本プラグインを入れるとイベント数がどれだけ増えてもセーブ容量が増えなくなります。
 *
 * 性質上、ゲームをロードするとイベント位置が初期位置に戻ります。
 *（プロジェクトを更新後に更新前のセーブを読み込んだときと同じ動作）
 *
 * 例えば、岩を押す等のパズルギミックの最中にセーブ＆ロードが挟まると
 * 勝手に岩の位置が初期化するのでご注意ください。
 * （なお、この仕様はプロジェクトとセーブデータの版が違うと
 * 　本プラグインとは無関係に発生するので、こういった場面では
 * 　本来セーブを禁止する等の対策を取るべきです。）
 *
 * ※本プラグインの導入や廃止によって既存セーブファイルが読み込めなくなることはありません。
 *
 * -------------------------------------------------------------
 * 商用非商用・年齢制限問わず利用できます。
 * クレジットに「terunon（エイリアスエイク）」の記載をお願いします。
 * ※ 制作スタッフっぽく見える記載方法はご遠慮くださいね！
 *
 */

//グローバル変数
var TN_gameMap = []; 

(function() {
'use strict';

//イベントをセーブから除外
var TN_Game_System_onBeforeSave      = Game_System.prototype.onBeforeSave;
Game_System.prototype.onBeforeSave = function() {
    TN_Game_System_onBeforeSave.apply(this, arguments);
    TN_gameMap = $gameMap._events;
    $gameMap._events = [];
};

//除外したイベントデータを復帰
var TN_Scene_Save_onSavefileOk = Scene_Save.prototype.onSavefileOk;
Scene_Save.prototype.onSavefileOk = function() {
    TN_Scene_Save_onSavefileOk.call(this);
    $gameMap._events = TN_gameMap;
};

//常にリロード時読み込み直す
Scene_Load.prototype.reloadMapIfUpdated = function() {
    $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
    $gamePlayer.requestMapReload();
};

//読み込みなおしでイベントが重なるの防止
var TN_Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    TN_Game_Map_setup.apply(this, arguments);
    this.moveReloadEvents();
};

//再生成でイベントが重なったとき移動可能な上下左右マスにずらす
Game_Map.prototype.moveReloadEvents = function() {
    var events = $gameMap.eventsXy($gamePlayer._newX, $gamePlayer._newY);
    var l = events.length;
    var ev;
    for (var i = 0; i < l; i++){
        ev = events[i];
        if (ev._priorityType === 1 && !ev._through){
            if (this.isAirshipLandOk(ev.x, ev.y + 1)){
                ev.locate(ev.x, ev.y + 1);
                continue;
            }
            if (this.isAirshipLandOk(ev.x - 1, ev.y)){
                ev.locate(ev.x - 1, ev.y);
                continue;
            }
            if (this.isAirshipLandOk(ev.x + 1, ev.y)){
                ev.locate(ev.x + 1, ev.y);
                continue;
            }
            if (this.isAirshipLandOk(ev.x, ev.y - 1)){
                ev.locate(ev.x, ev.y - 1);
                continue;
            }
        }
    };
};


})();

