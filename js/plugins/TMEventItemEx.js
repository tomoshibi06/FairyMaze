//=============================================================================
// TMVplugin - アイテム選択拡張
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 1.0
// 最終更新日: 2015/12/24
//=============================================================================

/*:
 * @plugindesc アイテム選択の処理にヘルプウィンドウを追加し、
 * 個数表示の有無と表示行数をアイテムタイプごとに設定できます。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param helpWindowEnabledItem
 * @desc アイテム選択でヘルプウィンドウを表示するかどうか
 * 初期値: 1（ 0 で表示しない）
 * @default 1
 *
 * @param helpWindowEnabledKey
 * @desc 大事なもの選択でヘルプウィンドウを表示するかどうか
 * 初期値: 1（ 0 で表示しない）
 * @default 1
 *
 * @param helpWindowEnabledA
 * @desc 隠しアイテムＡ選択でヘルプウィンドウを表示するかどうか
 * 初期値: 1（ 0 で表示しない）
 * @default 1
 *
 * @param helpWindowEnabledB
 * @desc 隠しアイテムＢ選択でヘルプウィンドウを表示するかどうか
 * 初期値: 1（ 0 で表示しない）
 * @default 1
 *
 * @param showItemNumberItem
 * @desc アイテムの個数を表示するかどうか
 * 初期値: 1（ 0 で表示しない）
 * @default 1
 *
 * @param showItemNumberKey
 * @desc 大事なものの個数を表示するかどうか
 * 初期値: 1（ 0 で表示しない）
 * @default 1
 *
 * @param showItemNumberA
 * @desc 隠しアイテムＡの個数を表示するかどうか
 * 初期値: 1（ 0 で表示しない）
 * @default 1
 *
 * @param showItemNumberB
 * @desc 隠しアイテムＡの個数を表示するかどうか
 * 初期値: 1（ 0 で表示しない）
 * @default 1
 *
 * @param numVisibleRowsItem
 * @desc アイテム選択の表示行数
 * 初期値: 4
 * @default 4
 *
 * @param numVisibleRowsKey
 * @desc 大事なもの選択の表示行数
 * 初期値: 4
 * @default 4
 *
 * @param numVisibleRowsA
 * @desc 隠しアイテムＡ選択の表示行数
 * 初期値: 4
 * @default 4
 *
 * @param numVisibleRowsB
 * @desc 隠しアイテムＢ選択の表示行数
 * 初期値: 4
 * @default 4
 *
 * @help
 * アイテムタイプごとに以下の設定を変更できます。
 * ・ヘルプウィンドウを表示するかどうか
 * ・個数を表示するかどうか
 * ・アイテム選択ウィンドウの表示行数
 *
 * プラグインコマンドはありません。
 * 
 */

var Imported = Imported || {};
Imported.TMEventItemEx = true;

(function() {

  var parameters = PluginManager.parameters('TMEventItemEx');
  var showItemNumberItem = parameters['showItemNumberItem'] === '1' ? true : false;
  var showItemNumberKey  = parameters['showItemNumberKey'] === '1' ? true : false;
  var showItemNumberA    = parameters['showItemNumberA'] === '1' ? true : false;
  var showItemNumberB    = parameters['showItemNumberB'] === '1' ? true : false;
  var numVisibleRowsItem = Number(parameters['numVisibleRowsItem']);
  var numVisibleRowsKey  = Number(parameters['numVisibleRowsKey']);
  var numVisibleRowsA    = Number(parameters['numVisibleRowsA']);
  var numVisibleRowsB    = Number(parameters['numVisibleRowsB']);
  var helpWindowEnabledItem = parameters['helpWindowEnabledItem'] === '1' ? true : false;
  var helpWindowEnabledKey  = parameters['helpWindowEnabledKey'] === '1' ? true : false;
  var helpWindowEnabledA    = parameters['helpWindowEnabledA'] === '1' ? true : false;
  var helpWindowEnabledB    = parameters['helpWindowEnabledB'] === '1' ? true : false;
  
  //-----------------------------------------------------------------------------
  // Window_EventItem
  //

  Window_EventItem.prototype.isHelpWindowEnabled = function() {
    var itypeId = $gameMessage.itemChoiceItypeId();
    if (itypeId === 1) {
      return helpWindowEnabledItem;
    } else if (itypeId === 2) {
      return helpWindowEnabledKey;
    } else if (itypeId === 3) {
      return helpWindowEnabledA;
    } else if (itypeId === 4) {
      return helpWindowEnabledB;
    }
    return false;
  };

  var _Window_EventItem_start = Window_EventItem.prototype.start;
  Window_EventItem.prototype.start = function() {
    this.height = this.fittingHeight(this.numVisibleRows());
    _Window_EventItem_start.call(this);
    if (this.isHelpWindowEnabled()) {
      this._helpWindow.open();
    }
  };

  var _Window_EventItem_numVisibleRows = Window_EventItem.prototype.numVisibleRows;
  Window_EventItem.prototype.numVisibleRows = function() {
    var itypeId = $gameMessage.itemChoiceItypeId();
    if (itypeId === 1) {
      return numVisibleRowsItem;
    } else if (itypeId === 2) {
      return numVisibleRowsKey;
    } else if (itypeId === 3) {
      return numVisibleRowsA;
    } else if (itypeId === 4) {
      return numVisibleRowsB;
    }
    return _Window_EventItem_numVisibleRows.call(this);
  };

  var _Window_EventItem_updatePlacement = Window_EventItem.prototype.updatePlacement;
  Window_EventItem.prototype.updatePlacement = function() {
    if (this.isHelpWindowEnabled()) {
      if (this._messageWindow.y >= Graphics.boxHeight / 2) {
          this.y = this._helpWindow.height;
          this._helpWindow.y = 0;
      } else {
          this.y = Graphics.boxHeight - this.height;
          this._helpWindow.y = this.y - this._helpWindow.height;
      }
    } else {
      _Window_EventItem_updatePlacement.call(this);
    }
  };

  var _Window_EventItem_onOk = Window_EventItem.prototype.onOk;
  Window_EventItem.prototype.onOk = function() {
    _Window_EventItem_onOk.call(this);
    this._helpWindow.close();
  };

  var _Window_EventItem_onCancel = Window_EventItem.prototype.onCancel;
  Window_EventItem.prototype.onCancel = function() {
    _Window_EventItem_onCancel.call(this);
    this._helpWindow.close();
  };

  Window_EventItem.prototype.needsNumber = function() {
    var itypeId = $gameMessage.itemChoiceItypeId();
    return (itypeId === 1 && showItemNumberItem) ||
           (itypeId === 2 && showItemNumberKey) ||
           (itypeId === 3 && showItemNumberA) ||
           (itypeId === 4 && showItemNumberB);
  };

  //-----------------------------------------------------------------------------
  // Window_Message
  //

  var _Window_Message_subWindows = Window_Message.prototype.subWindows;
  Window_Message.prototype.subWindows = function() {
    var subWindows = _Window_Message_subWindows.call(this);
    subWindows.push(this._helpWindow);
    return subWindows;
  };

  var _Window_Message_createSubWindows = Window_Message.prototype.createSubWindows;
  Window_Message.prototype.createSubWindows = function() {
    _Window_Message_createSubWindows.call(this);
    this._helpWindow = new Window_Help();
    this._helpWindow.openness = 0;
    this._itemWindow.setHelpWindow(this._helpWindow);
  };

})();
