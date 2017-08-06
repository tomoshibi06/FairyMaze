//=============================================================================
// 【常駐ウィンドウ】　Version: 1.22
//
// ※ 当ブログの常駐所持金ウィンドウ（ResidentGoldWindow.js）はこのスクリプトに統合されました。
// 　 既に使用されている方はそのプラグインを消去した上で本プラグインを導入して下さい。
//
// ここからリスポーン: http://respawnfromhere.blog.fc2.com/
// Twitter: https://twitter.com/ibakip
//
//=============================================================================

//=============================================================================
 /*:
 * @plugindesc マップに常駐するステータス＋所持金ウィンドウを生成します。
 * @author ResidentWindow
 *
 * //---↓全体管理-------------------------------------------
 *
 * @param StartWithHideWindow
 * @desc ニューゲーム時、常駐ウィンドウが非表示状態で開始されます。
 * true を入力すると有効になります。
 * @default false
 *
 * @param FaceWindow_ON
 * @desc 顔グラウィンドウを使用する場合は true を指定して下さい。
 * （※使用しない場合は false か空文字を指定）
 * @default true
 *
 * @param StatusWindow_ON
 * @desc ステータスウィンドウを使用する場合は true を指定して下さい。
 * （※使用しない場合は false か空文字を指定）
 * @default true
 *
 * @param GoldWindow_ON
 * @desc 所持金ウィンドウを使用する場合は true を指定して下さい。
 * （※使用しない場合は false か空文字を指定）
 * @default true
 *
 * //-----------------------------------------------------
 *
 * //---↓顔グラウィンドウ-------------------------------------
 *
 * @param FaceWindow_x
 * @desc 顔グラを表示するx座標です。
 * @default 10
 *
 * @param FaceWindow_y
 * @desc 顔グラを表示するy座標です。
 * @default 10
 *
 * @param FaceWindow_type
 * @desc 顔グラウィンドウのタイプを選択します。
 * 0：通常 1：黒背景 2:透明
 * @default 2
 *
 * @param FaceFrame_ON
 * @desc 顔グラをフレーム画像で装飾する場合はtrueを指定して下さい。
 * （※使用しない場合は false か空文字を指定）
 * @default true
 *
 * //--------------------------------------------------------
 *
 * //---↓ステータスウィンドウ-------------------------------------
 *
 * @param StatusWindow_x
 * @desc ステータスを表示するx座標です。
 * @default 196
 *
 * @param StatusWindow_y
 * @desc ステータスを表示するy座標です。
 * @default 20
 *
 * @param StatusWindow_type
 * @desc ステータスウィンドウのタイプを選択します。
 * 0：通常 1：黒背景 2:透明
 * @default 2
 *
 * @param GaugeFrame_ON
 * @desc HP等のゲージにフレーム画像を使う場合はtrueを指定して下さい。
 * （※使用しない場合は false か空文字を指定）
 * @default true
 *
 * @param StatusWindow_PaddingHeight
 * @desc 各ステータスゲージの間隔を指定します。
 * 値を大きくするほどゲージが離れます。
 * @default 10
 *
 * @param TP_Gauge_ON
 * @desc TPゲージを描画する場合は true を指定して下さい。
 * （※使用しない場合は false か空文字を指定）
 * @default true
 *
 * //--------------------------------------------------------
 *
 * //---↓所持金ウィンドウ-------------------------------------
 *
 * @param GoldWindow_x
 * @desc 所持金ウィンドウを表示するx座標です。
 * @default 576
 *
 * @param GoldWindow_y
 * @desc 所持金ウィンドウを表示するy座標です。
 * @default 550
 *
 * @param GoldWindow_type
 * @desc 所持金ウィンドウのタイプを選択します。
 * 0：通常 1：黒背景 2:透明 3:画像
 * @default 3
 *
 * @param GoldWindow_width
 * @desc 所持金ウィンドウの横幅です。
 * Gold_Window_typeで 3 を指定した場合は無視されます。
 * @default 240
 *
 * @param GoldWindow_height
 * @desc 所持金ウィンドウの縦幅です。
 * Gold_Window_typeで 3 を指定した場合は無視されます。
 * @default 60
 *
 * @param GoldWindow_IconNumber
 * @desc 所持金ウィンドウに描画するアイコンを選択します。
 * 0 を指定するとアイコンは使わず単位を描画します。
 * @default 314
 *
 * @param GoldWindow_PaddingWidth
 * @desc 所持金ウィンドウ内の横方向の余白を調整します。
 * 値を大きくするほど描画内容が内側に寄ります。
 * @default 10
 *
 * //--------------------------------------------------------
 *
 * @help
 *
 * //=============================================================================
 * // 【常駐ウィンドウ】　Version: 1.22
 * //
 * // ※ 当ブログの常駐所持金ウィンドウ（ResidentGoldWindow.js）は
 * //   このスクリプトに統合されました。
 * //   既に使用されている方はそのプラグインを消去した上で
 * //   本プラグインを導入して下さい。
 * //
 * // ここからリスポーン: http://respawnfromhere.blog.fc2.com/
 * // Twitter: https://twitter.com/ibakip
 * //
 * //=============================================================================
 *
 * このプラグインはマップに常駐する顔グラウィンドウ、ステータスウィンドウ、
 * 所持金ウィンドウの３つを生成します。
 *　
 * 【プラグインコマンド】
 *  ResidentWindow Show : 常駐ウィンドウを表示します。
 *  ResidentWindow Hide : 常駐ウィンドウを非表示にします。
 *
 * 【パラメータ】
 *
 * ニューゲーム時の常駐ウィンドウ表示／非表示の選択
 *  ・ StartWithHideWindow
 *     true を指定すると非表示状態でゲーム開始、
 *     false か空文字を指定すると表示状態でゲーム開始。
 *
 * 各ウィンドウの使用
 *  ・ FaceWindow_ON
 *  ・ StatusWindow_ON
 *  ・ GoldWindow_ON
 *     それぞれ true を指定すると使用、 false か空文字を指定すると未使用。
 *
 * 各ウィンドウのウィンドウタイプ変更
 *  ・ FaceWindow_type
 *  ・ StatusWindow_type
 *  ・ GoldWindow_type
 *     0：通常  1：黒背景  2:透明  3:画像(所持金ウィンドウのみ)
 *     3 を選択する場合、使用する画像をimg/picturesフォルダに入れて下さい。
 *
 * 顔グラウィンドウ表示位置の変更
 *  ・ FaceWindow_x
 *  ・ FaceWindow_y
 *
 * ステータスウィンドウ表示位置の変更
 *  ・ StatusWindow_x
 *  ・ StatusWindow_y
 *
 * 所持金ウィンドウ表示位置の変更
 *  ・ GoldWindow_x
 *  ・ GoldWindow_y
 *
 * 顔グラをフレーム画像で装飾するかを指定
 *  ・ FaceFrame_ON
 *     true を指定すると使用、 false か空文字を指定すると未使用。
 *     規格は同梱されている物に従って下さい。
 *     ※ trueにすると、FaceWindow_type の指定は無視されます。
 *
 * ステータスウィンドウのゲージ間隔の変更
 *  ・ StatusWindow_PaddingHeight
 *
 * HPゲージ等にフレーム画像を適用するかを指定
 *  ・ GaugeFrame_ON
 *     true を指定すると使用、 false か空文字を指定すると未使用。
 *     規格は同梱されている物に従って下さい。
 *
 * ステータスウィンドウにTPゲージを描画するかを指定
 *  ・ TP_Gauge_ON
 *     true を指定すると使用、 false か空文字を指定すると未使用。
 *
 * 所持金ウィンドウの幅の変更
 *  ・ GoldWindow_width
 *  ・ GoldWindow_height
 *     GoldWindow_typeで 3 を指定した場合、この値は無視されます。
 *     （画像サイズに合わせて自動でウィンドウ幅が決定されます。）
 *
 * 所持金ウィンドウに描画するアイコン画像の変更
 *  ・ GoldWindow_IconNumber
 *     0 を指定するとアイコンは使わずお金の単位を描画します。
 *
 * 所持金ウィンドウ内の横方向の余白調整
 *  ・ GoldWindw_PaddingWidth
 *     値が大きいほど描画内容が内側に寄ります。
 *
 *
 */
 //=============================================================================


var Imported = Imported || {};
Imported.ResidentWindow = {};

(function(){

var inVal = Imported.ResidentWindow;
inVal.WinON = true;
inVal.last_WinState = true;

// ---プラグインパラメータの取得-----------------------------------------------------
 var Parameters = PluginManager.parameters('ResidentWindow');
 var RW_HideStart = !Parameters['StartWithHideWindow'].match(/^\s*(false)?\s*$/i);
 var RFW_ON = !Parameters['FaceWindow_ON'].match(/^\s*(false)?\s*$/i);
 var RSW_ON = !Parameters['StatusWindow_ON'].match(/^\s*(false)?\s*$/i);
 var RGW_ON = !Parameters['GoldWindow_ON'].match(/^\s*(false)\s*$/i);
 var RFW_x  = Math.floor(Number(Parameters['FaceWindow_x'])) || 0;
 var RFW_y  = Math.floor(Number(Parameters['FaceWindow_y'])) || 0;
 var RSW_x  = Math.floor(Number(Parameters['StatusWindow_x'])) || 0;
 var RSW_y  = Math.floor(Number(Parameters['StatusWindow_y'])) || 0;
 var RSW_paddingHeight = Math.floor(Number(Parameters['StatusWindow_PaddingHeight'])) || 0;
 var RSW_TPGaugeON = !Parameters['TP_Gauge_ON'].match(/^\s*(false)\s*$/i);
 var RSW_GaugeFrameON = !Parameters['GaugeFrame_ON'].match(/^\s*(false)\s*$/i);
 var RFW_FrameON = !Parameters['FaceFrame_ON'].match(/^\s*(false)\s*$/i);
 var RGW_x  = Math.floor(Number(Parameters['GoldWindow_x'])) || 0;
 var RGW_y  = Math.floor(Number(Parameters['GoldWindow_y'])) || 0;
 var RFW_type   = Math.floor(Number(Parameters['FaceWindow_type'])) || 0;
 var RSW_type   = Math.floor(Number(Parameters['StatusWindow_type'])) || 0;
 var RGW_type   = Math.floor(Number(Parameters['GoldWindow_type'])) || 0;
 var RGW_width  = Math.floor(Number(Parameters['GoldWindow_width'])) || 0;
 var RGW_height = Math.floor(Number(Parameters['GoldWindow_height'])) || 0;
 var RGW_icon   = Math.floor(Number(Parameters['GoldWindow_IconNumber'])) || 0;
 var RGW_paddingWidth = Math.floor(Number(Parameters['GoldWindow_PaddingWidth'])) || 0;
//----------------------------------------------------------------------------


// ---プラグインコマンド-------------------------------------------------------------
var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'ResidentWindow') {
        switch (args[0]) {
            case 'Show':
                inVal.WinON = true;
                break;
            case 'Hide':
                inVal.WinON = false;
                break;
            default: // トラブル調査用にスペルミスの場合はログに書き出し
                console.log('Unknown ResidentWindow argument: "' + args[0] + '"');
                break;
        }
    }
};
//----------------------------------------------------------------------------

/* ローカルスコープ変数の準備 */
if(RGW_type == 3){
    var RGW_bitmap = ImageManager.loadPicture('GoldWindowPictue', 0);
}


//-----------------------------------------------------------------------------
// DataManager
//-----------------------------------------------------------------------------
/* フェイスチャットの情報をセーブ＆ロードできるように上書き */
var RW_DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    var contents = RW_DataManager_makeSaveContents();
    contents.WinON = inVal.WinON;
    return contents;
};
var RW_DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    RW_DataManager_extractSaveContents(contents);
    inVal.WinON = contents.WinON;
};


//-----------------------------------------------------------------------------
// Scene_Title
//-----------------------------------------------------------------------------
/* ニューゲーム時のウィンドウ可視状態の初期化 */
var SFC_scene_title_commandNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function() {
    if(RW_HideStart){
        inVal.WinON = false;
    }
    SFC_scene_title_commandNewGame.call(this);
};


//-----------------------------------------------------------------------------
// Window_ResidentFace
//-----------------------------------------------------------------------------
/* マップ画面に常駐する顔グラウィンドウを扱うクラスです */

function Window_ResidentFace() {
    this.initialize.apply(this, arguments);
}

Window_ResidentFace.prototype = Object.create(Window_Base.prototype);
Window_ResidentFace.prototype.constructor = Window_ResidentFace;

Window_ResidentFace.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, 0, 0, 176, 176);
    this.refresh();
};

/* 描画内容の更新 */
Window_ResidentFace.prototype.refresh = function(){
    this.party_leader = $gameParty.leader();
this.leader_faceName = this.party_leader._faceName;
this.leader_faceIndex = this.party_leader._faceIndex;
    this.last_WinON = inVal.WinON;
    this.contents.clear();
    var leader_name = this.party_leader.faceName();
    var leader_id = this.party_leader.faceIndex();
    var face_width = Window_Base._faceWidth;
    var face_height = Window_Base._faceHeight;
    if(RFW_FrameON === true ){
        this.drawPicture('FaceLayer1', 0, 0);
    }
    this.drawFace(leader_name, leader_id, 16, 16, face_width, face_height);
    if(RFW_FrameON === true){
        this.drawPicture('FaceLayer2', 0, 0);
    }
};

/* フレーム毎の更新処理 （更新条件も記述）*/
Window_ResidentFace.prototype.update = function(){
    Window_Base.prototype.update.call(this);
    if(this.party_leader != $gameParty.leader() ){
        this.refresh();
    }
    if(this.last_WinON != inVal.WinON){
        this.refresh();
    }
    if(this.leader_faceName != this.party_leader._faceName){
        this.refresh();
    }
    if(this.leader_faceIndex != this.party_leader._faceIndex){
        this.refresh();
    }
};

/* ウィンドウを開く処理 */
Window_ResidentFace.prototype.open = function() {
    this.refresh();
    Window_Base.prototype.open.call(this);
};

/* ウィンドウを閉じる時に一瞬で消えるように仕様を変更 */
Window_ResidentFace.prototype.updateClose = function() {
    if (this._closing) {
        this.openness -= 255;
        if (this.isClosed()) {
            this._closing = false;
        }
    }
};

/* コンテンツの横幅取得 */
Window_ResidentFace.prototype.contentsWidth = function() {
    return 176;
};

/* コンテンツの縦幅取得 */
Window_ResidentFace.prototype.contentsHeight = function() {
    return 176;
};

/* フレーム描画用 */
Window_ResidentFace.prototype.drawPicture = function(filename, x, y) {
    var bitmap = ImageManager.loadPicture(filename, 0);
    var pw = bitmap.width;
    var ph = bitmap.height;
    this.contents.blt(bitmap, 0, 0, pw, ph, x, y);
};

/* 他のプラグインからもアクセスできるようにエクスポート */
window.Window_ResidentFace = Window_ResidentFace;



//-----------------------------------------------------------------------------
// Window_ResidentStatus
//-----------------------------------------------------------------------------
/* マップ画面に常駐するステータスウィンドウを扱うクラスです */

function Window_ResidentStatus() {
    this.initialize.apply(this, arguments);
}

Window_ResidentStatus.prototype = Object.create(Window_Base.prototype);
Window_ResidentStatus.prototype.constructor = Window_ResidentStatus;

Window_ResidentStatus.prototype.initialize = function(x, y, width, height) {
    var yy = this.contentsHeight();
    Window_Base.prototype.initialize.call(this, 0, 0, 410, yy);
    this.refresh();
};

/* 描画内容の更新 */
Window_ResidentStatus.prototype.refresh = function(){
    this.last_hp = $gameParty.members()[0].hp;
    this.last_mp = $gameParty.members()[0].mp;
    this.last_tp = $gameParty.members()[0].tp;
    this.party_leader = $gameParty.leader();
    this.leaderLevel = this.party_leader.level;
    this.last_WinON = inVal.WinON;
    this.contents.clear();
    var leader_name = this.party_leader.faceName();
    var leader_id = this.party_leader.faceIndex();
    var plusPos = 16;
    if(RSW_type == 2){
        plusPos = 0;
    }
    if(RSW_GaugeFrameON === true){
        this.drawActorHp(this.party_leader, 5+plusPos, 5+plusPos, 400);
        this.drawPicture('GaugeFrame', plusPos, plusPos);
        this.drawActorMp(this.party_leader, 5+plusPos, 28+RSW_paddingHeight+5+plusPos, 400);
        this.drawPicture('GaugeFrame', plusPos, 28+RSW_paddingHeight+plusPos);
        if(RSW_TPGaugeON){
            this.drawActorTp(this.party_leader, 5+plusPos, (28+RSW_paddingHeight)*2+5+plusPos, 400);
            this.drawPicture('GaugeFrame', plusPos, (28+RSW_paddingHeight)*2+plusPos);
        }
    }
    else{
        this.drawActorHp(this.party_leader, plusPos, plusPos, 186);
        //this.drawActorMp(this.party_leader, plusPos, 28+RSW_paddingHeight+plusPos, 186);
        if(RSW_TPGaugeON){
            this.drawActorTp(this.party_leader, plusPos, (28+RSW_paddingHeight)*2+plusPos, 186);
        }
    }
};

/* フレーム毎の更新処理 （更新条件も記述）*/
Window_ResidentStatus.prototype.update = function(){
    Window_Base.prototype.update.call(this);
    if(this.last_hp != $gameParty.members()[0].hp ) {
        this.refresh();
    }
    if(this.last_mp != $gameParty.members()[0].mp ) {
        this.refresh();
    }
    if(this.last_tp != $gameParty.members()[0].tp ) {
        this.refresh();
    }
    if(this.party_leader != $gameParty.leader() ){
        this.refresh();
    }
    if(this.leaderLevel != $gameParty.leader().level ){
        this.refresh();
    }
    if(this.last_WinON != inVal.WinON){
        this.refresh();
    }
};

/* ウィンドウを開く処理 */
Window_ResidentStatus.prototype.open = function() {
    this.refresh();
    Window_Base.prototype.open.call(this);
};

/* ウィンドウを閉じる時に一瞬で消えるように仕様を変更 */
Window_ResidentStatus.prototype.updateClose = function() {
    if (this._closing) {
        this.openness -= 255;
        if (this.isClosed()) {
            this._closing = false;
        }
    }
};

/* コンテンツの横幅取得 */
Window_ResidentStatus.prototype.contentsWidth = function() {
    if(RSW_GaugeFrameON){
        return 410 + 32;
    }
    else{
        return 186 + 32;
    }
};

/* コンテンツの縦幅取得 */
Window_ResidentStatus.prototype.contentsHeight = function() {
    var plusPos = 32;
    if(RSW_type == 2){
        plusPos = 0;
    }
    if(RSW_GaugeFrameON){
        if(RSW_TPGaugeON){
            return (28*3 + RSW_paddingHeight*2 + plusPos);
        }
        else{
            return (28*2 + RSW_paddingHeight + plusPos);
        }
    }
    else{
        if(RSW_TPGaugeON){
            return (6*3 + 30*3 + RSW_paddingHeight*2 + plusPos);
        }
        else{
            return (6*2 + 30*2 + RSW_paddingHeight + plusPos);
        }
    }
};

/* フレームと背景描画用 */
Window_ResidentStatus.prototype.drawPicture = function(filename, x, y) {
    var bitmap = ImageManager.loadPicture(filename, 0);
    var pw = 0;
    var ph = 0;
    if(RSW_GaugeFrameON){
        pw = bitmap.width;
        ph = bitmap.height;
    }
    this.contents.blt(bitmap, 0, 0, pw, ph, x, y);
};

/*　HPゲージの描画 */
Window_ResidentStatus.prototype.drawActorHp = function(actor, x, y, width) {
    var padding = 0;
    if(RSW_GaugeFrameON !== true){
        width = 186;
        padding = 30;
    }
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    this.drawGauge(x, y+padding, width, actor.hpRate(), color1, color2);
    if(RSW_GaugeFrameON !== true){
        this.changeTextColor(this.systemColor());
        this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
                               this.hpColor(actor), this.normalColor());
    }
};

/* MPゲージの描画 */
Window_ResidentStatus.prototype.drawActorMp = function(actor, x, y, width) {
    var padding = 0;
    if(RSW_GaugeFrameON !== true){
        width = 186;
        padding = 30;
    }
    var color1 = this.mpGaugeColor1();
    var color2 = this.mpGaugeColor2();
    this.drawGauge(x, y+padding, width, actor.mpRate(), color1, color2);
    if(RSW_GaugeFrameON !== true){
        this.changeTextColor(this.systemColor());
        this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width,
                               this.mpColor(actor), this.normalColor());
    }
};

/* TPゲージの描画 */
Window_ResidentStatus.prototype.drawActorTp = function(actor, x, y, width) {
    var padding = 0;
    if(RSW_GaugeFrameON !== true){
        width = 186;
        padding = 30;
    }
    var color1 = this.tpGaugeColor1();
    var color2 = this.tpGaugeColor2();
    this.drawGauge(x, y+padding, width, actor.tpRate(), color1, color2);
    if(RSW_GaugeFrameON !== true){
        this.changeTextColor(this.tpColor(actor));
        this.drawText(actor.tp, x + width - 64, y, 64, 'right');
    }
};

/* ゲージの描画処理 */
Window_ResidentStatus.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    var fillW = Math.floor(width * rate);
    if(RSW_GaugeFrameON){
        gaugeHeight = 18;
    }
    else{
        gaugeHeight = 6;
    }
    this.contents.fillRect(x, y, width, gaugeHeight, this.gaugeBackColor());
    this.contents.gradientFillRect(x, y, fillW, gaugeHeight, color1, color2);
};

/* 他のプラグインからもアクセスできるようにエクスポート */
window.Window_ResidentStatus = Window_ResidentStatus;


//-----------------------------------------------------------------------------
// Window_ResidentGold
//-----------------------------------------------------------------------------
/* マップ画面に常駐する所持金ウィンドウを扱うクラスです */

function Window_ResidentGold() {
    this.initialize.apply(this, arguments);
}

Window_ResidentGold.prototype = Object.create(Window_Gold.prototype);
Window_ResidentGold.prototype.constructor = Window_ResidentGold;

Window_ResidentGold.prototype.initialize = function(x, y) {
    Window_Gold.prototype.initialize.call(this, x, y);
    this.refresh();
};

/* 描画内容の更新 */
Window_ResidentGold.prototype.refresh = function(){
    this.last_gold = $gameParty.gold();
    this.last_WinON = inVal.WinON;
    var x = this.textPadding() + RGW_paddingWidth;
    var y = (this.contentsHeight() - Window_Base.prototype.lineHeight() ) / 2;
    var icon_y = (this.contentsHeight() - Window_Base._iconWidth) / 2;
    var width = this.contentsWidth();
    this.contents.clear();
    if(RGW_type == 3){
        this.drawBackground.call(this);
    }
    if(RGW_icon === 0){
        this.drawCurrencyValue(this.value(), TextManager.currencyUnit, -x, y, width);
    }else{
        this.drawText(this.value(), -x, y, this.contentsWidth(), 'right');
        this.drawIcon(RGW_icon, x, icon_y);
    }
};

/* フレーム毎の更新処理 （更新条件も記述）*/
Window_ResidentGold.prototype.update = function(){
    Window_Base.prototype.update.call(this);
    if(this.last_gold != $gameParty.gold()) {
        this.refresh();
    }
    if(this.last_WinON != inVal.WinON){
        this.refresh();
    }
};

/* ウィンドウを開く処理 */
Window_ResidentGold.prototype.open = function(){
    this.refresh();
    Window_Gold.prototype.open.call(this);
};

/* ウィンドウを閉じる時に一瞬で消えるように仕様を変更 */
Window_ResidentGold.prototype.updateClose = function() {
    if (this._closing) {
        this.openness -= 255;
        if (this.isClosed()) {
            this._closing = false;
        }
    }
};

/* コンテンツの横幅取得 */
Window_ResidentGold.prototype.contentsWidth = function() {
    if(RGW_type == 3){
        return RGW_bitmap.width;
    }else{
        return RGW_width;
    }
};

/* コンテンツの縦幅取得 */
Window_ResidentGold.prototype.contentsHeight = function() {
    if(RGW_type == 3){
        return RGW_bitmap.height;
    }else{
        return RGW_height;
    }
};

/* ウィンドウの背景画像を描画 */
Window_ResidentGold.prototype.drawBackground = function() {
    this.contents.blt(RGW_bitmap, 0, 0, RGW_bitmap.width, RGW_bitmap.height, 0, 0);
};

/* 他のプラグインからもアクセスできるようにエクスポート */
window.Window_ResidentGold = Window_ResidentGold;


//-----------------------------------------------------------------------------
// Scene_Map
//-----------------------------------------------------------------------------
/* シーンを扱うクラス（rpg_scenes.jpに元々あるクラス） */

/* マップ画面開始時の処理（当スクリプトで追加したウィンドウを開く処理を追加） */
var scene_map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    scene_map_start.call(this);
    if(inVal.WinON){
        if(RFW_ON){
            this.face_window.open();
        }
        if(RSW_ON){
            this.status_window.open();
        }
        if(RGW_ON){
            this.gold_window.open();
        }
    }
};

/* 顔グラウィンドウを生成する処理 */
Scene_Map.prototype.createResidentFaceWindow = function(){
    this.face_window = new Window_ResidentFace(this);
    this.face_window.width = 176;
    this.face_window.height = 176;
    this.face_window.x = RFW_x;
    this.face_window.y = RFW_y;
    this.face_window.padding = 0;
    this.face_window.openness = 0;
    if(RFW_FrameON){
        this.face_window.setBackgroundType(2);
    }
    else{
        this.face_window.setBackgroundType(RFW_type);
    }
    this.addWindow(this.face_window);
};

/* ステータスウィンドウを生成する処理 */
Scene_Map.prototype.createResidentStatusWindow = function(){
    this.status_window = new Window_ResidentStatus(this);
    var plusPos = 32;
    if(RSW_type == 2){
        plusPos = 0;
    }
    if(RSW_GaugeFrameON){
        this.status_window.width = 410+plusPos;
        if(RSW_TPGaugeON){
            this.status_window.height = ( 28*3 + RSW_paddingHeight*2 )+plusPos;
        }
        else{
            this.status_window.height = ( 28*2 + RSW_paddingHeight )+plusPos;
        }
    }
    else{
        this.status_window.width = 186+plusPos;
        if(RSW_TPGaugeON){
            this.status_window.height = (6*3 + 30*3 + RSW_paddingHeight*2 + plusPos);
        }
        else{
            this.status_window.height = (6*2 + 30*2 + RSW_paddingHeight + plusPos);
        }
    }
    this.status_window.x = RSW_x;
    this.status_window.y = RSW_y;
    this.status_window.padding = 0;
    this.status_window.openness = 0;
    this.status_window.setBackgroundType(RSW_type);
    this.addWindow(this.status_window);
};

/* 所持金ウィンドウを生成する処理 */
Scene_Map.prototype.createResidentGoldWindow = function(){
    this.gold_window = new Window_ResidentGold(this);
    this.gold_window.x = RGW_x;
    this.gold_window.y = RGW_y;
    if(RGW_type == 3){
        this.gold_window.width = RGW_bitmap.width;
        this.gold_window.height = RGW_bitmap.height;
        this.gold_window.setBackgroundType(2);
    }
    else{
        this.gold_window.width = RGW_width;
        this.gold_window.height = RGW_height;
        this.gold_window.setBackgroundType(RGW_type);
    }
    this.gold_window.padding = 0;
    this.gold_window.openness = 0;
    this.addWindow(this.gold_window);
};

/* 全ウィンドウを生成する処理 */
var scene_map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    scene_map_createAllWindows.call(this);
    this.createResidentFaceWindow(this);
    this.createResidentStatusWindow(this);
    this.createResidentGoldWindow(this);
};

var scene_map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    scene_map_update.call(this);
    if(inVal.last_WinState != inVal.WinON){
        if(inVal.WinON === false){
            this.face_window.close();
            this.status_window.close();
            this.gold_window.close();
            inVal.last_WinState = false;
        }
        else if(inVal.WinON === true){
            if(RFW_ON){
                this.face_window.open();
            }
            if(RSW_ON){
                this.status_window.open();
            }
            if(RGW_ON){
                this.gold_window.open();
            }
            inVal.last_WinState = true;
        }
    }
};

/* シーンがマップ以外に遷移した時にウィンドウを見えなくする処理 */
var scene_map_stop = Scene_Map.prototype.stop;
Scene_Map.prototype.stop = function() {
    this.face_window.close();
    this.status_window.close();
    this.gold_window.close();
    scene_map_stop.call(this);
};

})();