//=============================================================================
// Vitsuno_AbilityNetwork.js
//-----------------------------------------------------------------------------
// Copyright (c) 2016 Tsuno Ozumi
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//--(更新情報)------------------------------------------------------------------
// ver1.04 : 職業間共有に対応。
// ver1.03 : アビリティの説明が '' の場合に表示が残るバグを修正。
// ver1.02 : イベントから呼び出しに対応。メニュー非表示にできるように対応。
//         : プラグイン内部の調整。（エラー位置とパラメータ処理。）
// ver1.01 : 職業変更時に、職業間のレベル差分ポイントを取得してしまうバグを修正。
//         : プラグインコマンドからアビリティクリア時にリフレッシュしないバグを修正。
//=============================================================================

if (Vitsuno.Perch === undefined) {
    throw new Error('not found or different order: Vitsuno_SpritePerch.js');
}

var Vitsuno = Vitsuno || {};
Vitsuno.AbilityNet = {};
Vitsuno.AbilityNet.version = 1.04;

/*:
 * @plugindesc 防具システムを利用してアビリティ習得システムを構築します。
 * @author 尾角 つの (Tsuno Ozumi)
 *
 * @param Menu Switch ID
 * @desc メニューに表示するか判定するスイッチIDです。
 * (0:常に表示 -1:常に非表示)
 * @default 0
 * 
 * @param Level UP Point
 * @desc レベルアップ時に獲得するポイント数。(a:アクター)
 * @default a.level / 5 + 10
 *
 * @param Point Name
 * @desc アビリティポイントのシステム文字です。
 * @default ＡＰ
 
 * @param Point Name A
 * @desc アビリティポイントのシステム文字（略）です。
 * @default AP
 *
 * @param Obtain Text
 * @desc アビリティポイント入手時の文章です。
 * %1:入手ポイント %2:ポイント表示名
 * @default %1 の%2を獲得！
 *
 * @param Command Name
 * @desc メニューコマンド用の表示名です。
 * @default アビリティ
 *
 * @param Point UP SE
 * @desc ポイント上昇時のSEの設定です。
 * SE名,音量,ピッチ,位相
 * @default Equip1,90,100,0
 *
 * @param Learning SE
 * @desc アビリティ習得時のSEの設定です。
 * SE名,音量,ピッチ,位相
 * @default Item3,90,100,0
 *
 * @param Perch Padding
 * @desc アビリティ画面でのアビリティウィンドウの余白です。
 * @default 48
 *
 * @param Perch Stage Height
 * @desc アビリティ画面でのアビリティツリーの段の高さです。
 * @default 64
 * 
 * @help
 * 
 * 必要なプラグイン:
 *    このプラグインを使用する場合は、Vitsuno_SpritePerch.js が必要です。
 *    プラグイン管理画面で、こちらが下になるように配置して下さい。
 *
 * 必要画像: 以下のファイルを img/system に入れてください。
 *    PerchCursor.png  # 画像コマンド用カーソル画像 (正方形パターンを横に並べる)
 *    AbilityNetworkLearningMark.png  # 習得済みマーク画像 (16px x 16px)
 *
 * このプラグインについて:
 *    このプラグインは、アビリティの代わりに、アビリティを防具で表現します。
 *    例えば、ID:1のアビリティはID:1の防具を指し、
 *    ID:1を習得した場合、ID:1の防具を装備した時と同じ効果が得られます。
 *
 *    まずは、アクターのメモに、起点となるアビリティ（防具）IDを設定します。
 *    そのアビリティに習得に必要なポイント数・次のアビリティIDを設定します。
 *    その次のアビリティにも同じように設定していきます。
 *
 * アクターや職業のメモ:
 *    <abilityNetBases:ID1,ID2,ID3>  # 追加する起点アビリティID
 *
 * 防具のメモ:
 *    <abilityNetPoint:num>          # 習得に必要なポイント数
 *    <abilityNetNexts:ID1,ID2,ID3>  # 次のアビリティID
 *    <abilityNetBaseName:name>      # 起点アビリティ時のリスト表示名
 *
 *    <abilityNetPosition:x,y>       # アビリティの座標を設定 (任意)
 *
 * 敵キャラのメモ:
 *    <dropAbilityNetPoint:num>      # 倒した時に取得するポイント数
 * 
 * 職業のメモ:
 *    <abilityNetworkId:ID>          # アビリティを共有する職業ID
 *
 * プラグインコマンド:
 *    AbilityNetwork GainActorPoint アクターID 上昇値  # アクターのポイントを増加
 *    AbilityNetwork ClearActorAbility アクターID     # アクターのアビリティをクリア
 *
 *    AbilityNetwork GoToScene アクターのパーティ順番 # アビリティ画面に移動 (順番は0から)
 *
 * その他の仕様と注意事項:
 *    職業ごとに、アビリティの習得状況や所持ポイント数が保存されます。
 *    アビリティポイント残量がマイナスになった場合、習得したアビリティはリセットされます。
 *    レベルダウン時にはアビリティポイントは減少しません。
 *    プラグインコマンドの画面移動は、順番のキャラがいない場合は移動しません。
 *
 *    アビリティ選択時、アビリティ間の距離によって上下左右押下時のカーソル移動先が決まるため、
 *    位置によっては、選択できないアビリティがあるかもしれないため、十分にテストして下さい。
 *    選択できない場合は、アビリティの数を増減したり、派生を変えたりして調整してください。
 *    
 */

// ● プラグインの設定値を取得
(function($) {
    $.parameters = PluginManager.parameters('Vitsuno_AbilityNetwork');
    $.levelUpPoint = $.parameters['Level UP Point'];
    $.pointName = $.parameters['Point Name'];
    $.pointNameA = $.parameters['Point Name A'];
    $.obtainText = $.parameters['Obtain Text'];
    $.commandName = $.parameters['Command Name'];
    $.perchPadding = Number($.parameters['Perch Padding']);
    $.stageHeight = Number($.parameters['Perch Stage Height']);
    
    $.pointUpSe = (function(text) {
        return text ? text.split(",") : [];
    })($.parameters['Point UP SE']);
    
    $.learningSe = (function(text) {
        return text ? text.split(",") : [];
    })($.parameters['Learning SE']);
    
    // Ver1.02
    $.menuSwitchId = Number($.parameters['Menu Switch ID']) || 0;
    
})(Vitsuno.AbilityNet);

//-----------------------------------------------------------------------------
// DataManager
//-----------------------------------------------------------------------------

// ● メタデータを抽出する
Vitsuno.AbilityNet.DataMgr_extractMetadata = DataManager.extractMetadata;
DataManager.extractMetadata = function(data) {
    Vitsuno.AbilityNet.DataMgr_extractMetadata.call(this, data);
    // メタデータをマッピングする
    // (特徴を持つオブジェクト)
    if (data.traits !== undefined) {
        // 起点となるアビリティ
        if (typeof data.meta.abilityNetBases === 'string') {
            data.abilityNetBases = data.meta.abilityNetBases.split(",").map(Number);
        }
    }
    // (職業)
    if (data.expParams !== undefined) {
        data.abilityNetworkId = data.id;
        if (typeof data.meta.abilityNetworkId === 'string') {
            data.abilityNetworkId = Number(data.meta.abilityNetworkId);
        }
    }
    // (防具)
    if (data.atypeId !== undefined) {
        // 習得に必要なアビリティポイント
        if (typeof data.meta.abilityNetPoint === 'string') {
            data.abilityNetPoint = Number(data.meta.abilityNetPoint);
        }
        // 次のアビリティID
        if (typeof data.meta.abilityNetNexts === 'string') {
            data.abilityNetNexts = data.meta.abilityNetNexts.split(",").map(Number);
        }
        // アビリティ座標
        if (typeof data.meta.abilityNetPosition === 'string') {
            var position = data.meta.abilityNetPosition.split(",").map(Number);
            data.abilityNetX = position[0] || 0;
            data.abilityNetY = position[1] || 0;
            data.abilityNetZ = position[2] || 0;
        }
        // アビリティ防具判定
        data.isAbilityNetwork = false;
        if (data.abilityNetPoint) {
            data.isAbilityNetwork = true;
        }
    }
};

// ● アビリティ判定
DataManager.isAbilityNetwork = function(item) {
    return this.isArmor(item) && item.isAbilityNetwork;
};

//-----------------------------------------------------------------------------
// SoundManager
//-----------------------------------------------------------------------------

// ● アビリティポイントアップSEオブジェクトの取得
SoundManager.AbilityNetPointUpSe = function() {
    var se = {};
    se.name = Vitsuno.AbilityNet.pointUpSe[0] || '';
    se.volume = Number(Vitsuno.AbilityNet.pointUpSe[1]) || 90;
    se.pitch = Number(Vitsuno.AbilityNet.pointUpSe[2]) || 100;
    se.pan = Number(Vitsuno.AbilityNet.pointUpSe[3]) || 0;
    return se;
};

// ● アビリティ習得SEオブジェクトの取得
SoundManager.AbilityNetLearningSe = function() {
    var se = {};
    se.name = Vitsuno.AbilityNet.learningSe[0] || '';
    se.volume = Number(Vitsuno.AbilityNet.learningSe[1]) || 90;
    se.pitch = Number(Vitsuno.AbilityNet.learningSe[2]) || 100;
    se.pan = Number(Vitsuno.AbilityNet.learningSe[3]) || 0;
    return se;
};

// ● アビリティポイントアップSEを再生
SoundManager.playAbilityNetPointUp = function() {
    AudioManager.playStaticSe(this.AbilityNetPointUpSe());
};

// ● アビリティ習得SEを再生
SoundManager.playAbilityNetLearning = function() {
    AudioManager.playStaticSe(this.AbilityNetLearningSe());
};

//-----------------------------------------------------------------------------
// TextManager
//-----------------------------------------------------------------------------

// ● アビリティポイント名を取得
Object.defineProperty(TextManager, 'abilityNetPoint', {
    get: function() { return Vitsuno.AbilityNet.pointName; },
    configurable: true
});

// ● アビリティポイント名（略）を取得
Object.defineProperty(TextManager, 'abilityNetPointA', {
    get: function() { return Vitsuno.AbilityNet.pointNameA; },
    configurable: true
});

// ● アビリティポイントの入手文章を取得
Object.defineProperty(TextManager, 'obtainAbilityNetPoint', {
    get: function() { return Vitsuno.AbilityNet.obtainText; },
    configurable: true
});

// ● アビリティネットワークのコマンド名を取得
Object.defineProperty(TextManager, 'abilityNetwork', {
    get: function() { return Vitsuno.AbilityNet.commandName; },
    configurable: true
});

//-----------------------------------------------------------------------------
// BattleManager
//-----------------------------------------------------------------------------

// ● 報酬の作成
Vitsuno.AbilityNet.BattleMgr_makeRewards = BattleManager.makeRewards;
BattleManager.makeRewards = function() {
    Vitsuno.AbilityNet.BattleMgr_makeRewards.call(this);
    this._rewards.abilityNetPoint = $gameTroop.abilityNetPointTotal();
};

// ● 報酬の表示
Vitsuno.AbilityNet.BattleMgr_displayRewards = BattleManager.displayRewards;
BattleManager.displayRewards = function() {
    Vitsuno.AbilityNet.BattleMgr_displayRewards.call(this);
    this.displayAbilityNetPoint();
};

// ● アビリティポイントの表示
BattleManager.displayAbilityNetPoint = function() {
    var point = this._rewards.abilityNetPoint;
    if (point > 0) {
        var text = TextManager.obtainAbilityNetPoint.format(point, TextManager.abilityNetPoint);
        $gameMessage.add('\\.' + text);
    }
};

// ● 報酬の獲得
Vitsuno.AbilityNet.BattleMgr_gainRewards = BattleManager.gainRewards;
BattleManager.gainRewards = function() {
    Vitsuno.AbilityNet.BattleMgr_gainRewards.call(this);
    this.gainAbilityNetPoint();
};

// ● アビリティポイントの獲得
BattleManager.gainAbilityNetPoint = function() {
    var point = this._rewards.abilityNetPoint;
    $gameParty.allMembers().forEach(function(actor) {
        actor.gainAbilityNetPoint(point);
    });
};

//-----------------------------------------------------------------------------
// Game_Actor
//-----------------------------------------------------------------------------

// ● 変数の初期化
Vitsuno.AbilityNet.GActor_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function() {
    Vitsuno.AbilityNet.GActor_initMembers.call(this);
    this._abilityNetPoints = {};
    this._abilityNetwork = {};
    this._changeClassOfAbilityNetwork = false;
};

// ● アクターのセットアップ
Vitsuno.AbilityNet.GActor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
    Vitsuno.AbilityNet.GActor_setup.call(this, actorId);
    this.initAbilityNetwork();
    this.recoverAll();
};

// ● アビリティネットワークの初期化
Game_Actor.prototype.initAbilityNetwork = function() {
    var actor = this.actor();
    this._abilityNetPoints = {};
    this._abilityNetwork = {};
    this._changeClassOfAbilityNetwork = false;
};

// ● アビリティネットワークIDの取得
Game_Actor.prototype.abilityNetworkId = function() {
    return this.currentClass().abilityNetworkId;
};

// ● アビリティポイントの取得
Game_Actor.prototype.abilityNetPoint = function() {
    return this._abilityNetPoints[this.abilityNetworkId()] || 0;
};

// ● アビリティポイントの設定
Game_Actor.prototype.setAbilityNetPoint = function(value) {
    var id = this.abilityNetworkId();
    this._abilityNetPoints[id] = Math.floor(Math.max(value, 0));
    this.refresh();
};

// ● アビリティポイントの増加
Game_Actor.prototype.gainAbilityNetPoint = function(value) {
    var id = this.abilityNetworkId();
    var point = this._abilityNetPoints[id] || 0;
    this.setAbilityNetPoint(point + value);
};

// ● アビリティネットワークの取得
Game_Actor.prototype.abilityNetwork = function() {
    var id = this.abilityNetworkId();
    if (!this._abilityNetwork[id]) {
        this._abilityNetwork[id] = {};
    }
    return this._abilityNetwork[id];
};

// ● アビリティネットワークの設定
Game_Actor.prototype.setAbilityNetwork = function(id, value) {
    this.abilityNetwork()[id] = Math.floor(Math.max(value, 0));
    this.refresh();
};

// ● アビリティネットワークのクリア
Game_Actor.prototype.clearAbilityNetwork = function() {
    this._abilityNetwork[this.abilityNetworkId()] = {};
    this.refresh();
};

// ● アビリティネットワークの補正
Game_Actor.prototype.correctAbilityNetwork = function() {
    // アビリティポイントが無駄に使用されている箇所を補正
    var ids = Object.keys(this.abilityNetwork());
    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        var item = $dataArmors[id];
        if (DataManager.isAbilityNetwork(item)) {
            // アビリティの値がオーバーしてる場合は補正する。
            if (this.acquiredAbilityNetPoint(id) > item.abilityNetPoint) {
                this.abilityNetwork()[id] = item.abilityNetPoint;
            }
        } else {
            // 防具がアビリティじゃない場合は削除する。
            delete this.abilityNetwork()[id];
        }
    }
    // 残りポイント数がマイナスの場合はクリアする。
    if (this.remainingAbilityNetPoint() < 0) {
        this._abilityNetwork[this.abilityNetworkId()] = {};
    }
};

// ● リフレッシュ
Vitsuno.AbilityNet.GActor_refresh = Game_Actor.prototype.refresh;
Game_Actor.prototype.refresh = function() {
    this.correctAbilityNetwork();
    Vitsuno.AbilityNet.GActor_refresh.call(this);
};

// ● 起点となるアビリティ配列の取得
Game_Actor.prototype.abilityNetBases = function() {
    return this.traitObjects().reduce(function(r, obj) {
        var bases = obj.abilityNetBases || [];
        for (var i = 0; i < bases.length; i++) {
            var id = bases[i];
            if (!r.contains(id) &&
                DataManager.isAbilityNetwork($dataArmors[id])) {
                r.push(id);
            }
        }
        return r;
    }, []);
};

// ● 習得したアビリティポイントの取得
Game_Actor.prototype.acquiredAbilityNetPoint = function(itemId) {
    return this.abilityNetwork()[itemId] || 0;
};

// ● 残りアビリティポイントの取得
Game_Actor.prototype.remainingAbilityNetPoint = function() {
    var point = this.abilityNetPoint();
    for (var id in this.abilityNetwork()) {
        point -= this.acquiredAbilityNetPoint(id);
    }
    return point;
};

// ● アビリティの習得判定
Game_Actor.prototype.isLearnedAbilityNetwork = function(item) {
    return (DataManager.isAbilityNetwork(item) &&
        this.acquiredAbilityNetPoint(item.id) >= item.abilityNetPoint);
};

// ● アビリティアイテム配列の取得
Game_Actor.prototype.abilityNetItems = function() {
    var items = [];
    for (var id in this.abilityNetwork()) {
        var item = $dataArmors[id];
        if (this.isLearnedAbilityNetwork(item)) {
            items.push(item);
        }
    }
    return items;
};

// ● 特徴オブジェクト配列の取得
Vitsuno.AbilityNet.GActor_traitObjects = Game_Actor.prototype.traitObjects;
Game_Actor.prototype.traitObjects = function() {
    var objects = Vitsuno.AbilityNet.GActor_traitObjects.call(this);
    var items = this.abilityNetItems();
    for (var i = 0; i < items.length; i++) {
        objects.push(items[i]);
    }
    return objects;
};

// ● 能力追加値の取得
Vitsuno.AbilityNet.GActor_paramPlus = Game_Actor.prototype.paramPlus;
Game_Actor.prototype.paramPlus = function(paramId) {
    var value = Vitsuno.AbilityNet.GActor_paramPlus.call(this, paramId);
    var items = this.abilityNetItems();
    for (var i = 0; i < items.length; i++) {
        value += items[i].params[paramId];
    }
    return value;
};

// ● レベルアップ時の入手アビリティポイントの取得
Game_Actor.prototype.levelUpAbilityNetPoint = function() {
    try {
        var a = this;
        return Math.max(eval(Vitsuno.AbilityNet.levelUpPoint), 0);
    } catch (e) {
        return 0;
    }
};

// ● レベルアップ時にポイントを取得できるか判定
Game_Actor.prototype.isAbilityNetPointAcquirableForLevelUp = function() {
    return !this._changeClassOfAbilityNetwork;
};

// ● レベルアップの処理
Vitsuno.AbilityNet.GActor_levelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
    Vitsuno.AbilityNet.GActor_levelUp.call(this);
    if (this.isAbilityNetPointAcquirableForLevelUp()) {
        this.gainAbilityNetPoint(this.levelUpAbilityNetPoint());
    }
};

// ● 経験値の変更
Vitsuno.AbilityNet.GActor_changeExp = Game_Actor.prototype.changeExp;
Game_Actor.prototype.changeExp = function(exp, show) {
    var lastLevel = this._level;
    var lastPoint = this.abilityNetPoint();
    Vitsuno.AbilityNet.GActor_changeExp.call(this, exp, show);
    if (show && this._level > lastLevel) {
        this.displayLevelUpAbilityNetPoint(lastPoint);
    }
};

// ● レベルアップによる入手APの表示
Game_Actor.prototype.displayLevelUpAbilityNetPoint = function(lastPoint) {
    var point = this.abilityNetPoint() - lastPoint;
    if (point > 0) {
        var text = TextManager.obtainAbilityNetPoint.format(point, TextManager.abilityNetPoint);
        $gameMessage.add(text);
    }
};

// ● 職業の変更
Vitsuno.AbilityNet.GActor_changeClass = Game_Actor.prototype.changeClass;
Game_Actor.prototype.changeClass = function(classId, keepExp) {
    this._changeClassOfAbilityNetwork = true;
    Vitsuno.AbilityNet.GActor_changeClass.call(this, classId, keepExp);
    this._changeClassOfAbilityNetwork = false;
};

//-----------------------------------------------------------------------------
// Game_Enemy
//-----------------------------------------------------------------------------

// ● 報酬アビリティポイントの取得
Game_Enemy.prototype.dropAbilityNetPoint = function() {
    return Number(this.enemy().meta.dropAbilityNetPoint) || 0;
};

//-----------------------------------------------------------------------------
// Game_Troop
//-----------------------------------------------------------------------------

// ● 報酬アビリティポイントの取得
Game_Troop.prototype.abilityNetPointTotal = function() {
    return this.deadMembers().reduce(function(r, enemy) {
        return r + enemy.dropAbilityNetPoint();
    }, 0);
};

//-----------------------------------------------------------------------------
// Game_Interpreter
//-----------------------------------------------------------------------------

// ● プラグインコマンドの実行
Vitsuno.AbilityNet.GInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Vitsuno.AbilityNet.GInterpreter_pluginCommand.call(this, command, args);
    if (command === 'AbilityNetwork') {
        switch (args[0]) {
            case 'GainActorPoint':
                var actor = $gameActors.actor(Number(args[1]));
                if (actor) {
                    actor.gainAbilityNetPoint(Number(args[2]));
                }
                break;
            case 'ClearActorAbility':
                var actor = $gameActors.actor(Number(args[1]));
                if (actor) {
                    actor.clearAbilityNetwork();
                }
                break;
            case 'GoToScene':
                if ($gameParty.exists()) {
                    var actor = $gameParty.members()[Number(args[1])];
                    if (actor) {
                        $gameParty.setMenuActor(actor);
                        SceneManager.push(Scene_AbilityNetwork);
                    }
                }
                break;
        }
    }
};

//-----------------------------------------------------------------------------
// Scene_Boot
//-----------------------------------------------------------------------------

// ● システム画像のロード
Vitsuno.AbilityNet.SBoot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
Scene_Boot.prototype.loadSystemImages = function() {
    Vitsuno.AbilityNet.SBoot_loadSystemImages.call(this);
    ImageManager.loadSystem('AbilityNetworkLearningMark');
};

//-----------------------------------------------------------------------------
// Window_MenuCommand
//-----------------------------------------------------------------------------

// ● アビリティを表示するかどうか
Window_MenuCommand.prototype.isAbilityNetDisplayed = function() {
    var id = Vitsuno.AbilityNet.menuSwitchId;
    if (id > 0) {
        return $gameSwitches.value(id);
    } else {
        return id === 0 ? true : false;
    }
};

// ● アビリティコマンドが有効かどうか
Window_MenuCommand.prototype.isAbilityNetEnabled = function() {
    return this.areMainCommandsEnabled();
};

// ● オリジナルコマンドの追加
Vitsuno.AbilityNet.WMenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
    Vitsuno.AbilityNet.WMenuCommand_addOriginalCommands.call(this);
    if (this.isAbilityNetDisplayed()) {
        var enabled = this.isAbilityNetEnabled();
        this.addCommand(TextManager.abilityNetwork, 'abilityNetwork', enabled);
    }
};

//-----------------------------------------------------------------------------
// Scene_Menu
//-----------------------------------------------------------------------------

// ● コマンドウィンドウの作成
Vitsuno.AbilityNet.SMenu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    Vitsuno.AbilityNet.SMenu_createCommandWindow.call(this);
    this._commandWindow.setHandler('abilityNetwork',     this.commandPersonal.bind(this));
};

// ● アクター選択時の処理
Vitsuno.AbilityNet.SMenu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
Scene_Menu.prototype.onPersonalOk = function() {
    if (this._commandWindow.currentSymbol() === 'abilityNetwork') {
        SceneManager.push(Scene_AbilityNetwork);
    }
    Vitsuno.AbilityNet.SMenu_onPersonalOk.call(this);
};

//-----------------------------------------------------------------------------
// Perch_AbilityNetwork
//-----------------------------------------------------------------------------

// ● クラスの作成
function Perch_AbilityNetwork() {
    this.initialize.apply(this, arguments);
}

// ● クラスの継承
Perch_AbilityNetwork.prototype = Object.create(Perch_Selectable.prototype);
Perch_AbilityNetwork.prototype.constructor = Perch_AbilityNetwork;

// ● 初期化
Perch_AbilityNetwork.prototype.initialize = function(x, y, width, height) {
    Perch_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this._baseItem = 0;
    this._data = [];
    this._learnings = [];
    this._stages = [];
    this._roads = [];
    this.createRoadSprite();
};

// ● アビリティロードスプライトの作成
Perch_AbilityNetwork.prototype.createRoadSprite = function() {
    this._roadSprite = new Sprite();
    this._roadSprite.bitmap = new Bitmap(this.width, this.height);
    this.addChildToBack(this._roadSprite);
};

// ● アクターの設定
Perch_AbilityNetwork.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

// ● ベースアイテムの設定
Perch_AbilityNetwork.prototype.setBaseItem = function(item) {
    if (this._baseItem !== item) {
        this._baseItem = item;
        this.refresh();
    }
};

// ● 要素数の取得
Perch_AbilityNetwork.prototype.maxItems = function() {
    return this._data ? this._data.length : 0;
};

// ● 余白の標準値の取得
Perch_Base.prototype.standardPadding = function() {
    return Vitsuno.AbilityNet.perchPadding;
};

// ● アイテムの取得
Perch_AbilityNetwork.prototype.item = function() {
    return this._data && this.index() >= 0 ? this._data[this.index()] : null;
};

// ● ステージ高さ
Perch_AbilityNetwork.prototype.stageHeight = function() {
    return Vitsuno.AbilityNet.stageHeight;
};

// ● ステージオブジェクトの取得
Perch_AbilityNetwork.prototype.stageObject = function(item) {
    for (var i = 0; i < this._stages.length; i++) {
        for (var j = 0; j < this._stages[i].length; j++) {
            if (this._stages[i][j] === item) {
                return { x: j, y: i, size: this._stages[i].length };
            }
        }
    }
    return null;
};

// ● 現在の項目の選択可能判定
Perch_AbilityNetwork.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this._data[this.index()]);
};

// ● 項目の選択可能判定
Perch_AbilityNetwork.prototype.isEnabled = function(item) {
    return (this._actor && !this._actor.isLearnedAbilityNetwork(item) &&
            this._learnings.contains(item));
};

// ● アイテムリストの作成
Perch_AbilityNetwork.prototype.makeItemList = function() {
    this._data = [];
    this._learnings = [];
    this._stages = [];
    this._roads = [];
    this.makeNextItemList(this._baseItem, true, 0);
};

// ● 次のアイテムリストを作成
Perch_AbilityNetwork.prototype.makeNextItemList = function(item, islearning, stageId) {
    if (this._actor && DataManager.isAbilityNetwork(item)) {
        if (islearning && !this._learnings.contains(item)) {
            this._learnings.push(item);
        }
        if (!this._data.contains(item)) {
            this._data.push(item);
            this.makeStageList(item, stageId);
            var nextLearning = this._actor.isLearnedAbilityNetwork(item);
            var nexts = item.abilityNetNexts || [];
            for (var i = 0; i < nexts.length; i++) {
                var nextItem = $dataArmors[nexts[i]];
                this.makeNextItemList(nextItem, nextLearning, stageId + 1);
                this.makeRoadList(item, nextItem);
            }
        }
    }
};

// ● ステージリストを作成
Perch_AbilityNetwork.prototype.makeStageList = function(item, stageId) {
    if (!this._stages[stageId]) {
        this._stages[stageId] = [];
    }
    this._stages[stageId].push(item);
};

// ● アビリティロードリストを作成
Perch_AbilityNetwork.prototype.makeRoadList = function(item1, item2) {
    var index1 = this._data.indexOf(item1);
    var index2 = this._data.indexOf(item2);
    if (index1 >= 0 && index2 >= 0 && index1 !== index2) {
        if (index1 > index2) {
            var index = index1;
            index1 = index2;
            index2 = index;
        }
        var key = index1 + 'to' + index2;
        if (!this._roads.contains(key)) {
            this._roads.push(key);
        }
    }
};

// ● 最後に選択した項目を選択する
Perch_AbilityNetwork.prototype.selectLast = function() {
    // 必要ではあれば、選択した項目を覚え、それを選択する。
    this.select(0);
};

// ● 項目の描画
Perch_AbilityNetwork.prototype.drawItem = function(index) {
    var item = this._data[index];
    var sprite = this.selectableSprite(index);
    if (item && sprite) {
        // ビットマップの作成・クリア
        if (!sprite.bitmap) {
            var bw = Window_Base._iconWidth + 8;
            var bh = Window_Base._iconHeight + 8;
            sprite.bitmap = new Bitmap(bw, bh);
        } else {
            sprite.bitmap.clear();
        }
        // 描画処理
        this.contents = sprite.bitmap;
        this.drawIcon(item.iconIndex, 4, 4);
        if (this._actor && this._actor.isLearnedAbilityNetwork(item)) {
            this.drawLearningMark(0, 0);
        }
        this.releaseContents();
        // 座標の設定
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        var stage = this.stageObject(item);
        if (item.abilityNetX !== undefined && item.abilityNetY !== undefined) {
            var mx = item.abilityNetX + this.padding;
            var my = item.abilityNetY + this.padding;
            sprite.move(mx, my);
        } else if (stage) {
            var mw = this.width - this.padding;
            var mx = mw * (stage.x + 1) / (stage.size + 1) + this.padding / 2;
            var my = stage.y * this.stageHeight() + this.padding;
            sprite.move(mx, my);
        }
        // 有効表示の設定
        if (this._learnings.contains(item)) {
            sprite.setBlendColor([0, 0, 0, 0]);
        } else {
            sprite.setBlendColor([0, 0, 0, 128]);
        }
    }
};

// ● 学習マークの描画
Perch_AbilityNetwork.prototype.drawLearningMark = function(x, y) {
    var bitmap = ImageManager.loadSystem('AbilityNetworkLearningMark');
    this.contents.blt(bitmap, 0, 0, 16, 16, x, y);
};

// ● アビリティロードの描画
Perch_AbilityNetwork.prototype.drawAbilityNetRoad = function() {
    this.contents = this._roadSprite.bitmap;
    for (var i = 0; i < this._roads.length; i++) {
        var match = /(\d+)to(\d+)/.exec(this._roads[i]);
        if (match) {
            var sprite1 = this.selectableSprite(Number(match[1]));
            var sprite2 = this.selectableSprite(Number(match[2]));
            if (sprite1 && sprite2) {
                this.contents.strokeLine(sprite1.x, sprite1.y,
                    sprite2.x, sprite2.y, 'rgb(255,255,255)', 2);
            }
        }
    }
    this.releaseContents();
};

// ● アビリティロードのクリア
Perch_AbilityNetwork.prototype.clearAbilityNetRoad = function() {
    this._roadSprite.bitmap.clear();
};

// ● ヘルプの更新
Perch_AbilityNetwork.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
};

// ● リフレッシュ
Perch_AbilityNetwork.prototype.refresh = function() {
    this.makeItemList();
    Perch_Selectable.prototype.refresh.call(this);
    this.clearAbilityNetRoad();
    this.drawAbilityNetRoad();
};

//-----------------------------------------------------------------------------
// Window_AbilityNetHelp
//-----------------------------------------------------------------------------

// ● クラスの作成
function Window_AbilityNetHelp() {
    this.initialize.apply(this, arguments);
}

// ● クラスの継承
Window_AbilityNetHelp.prototype = Object.create(Window_Base.prototype);
Window_AbilityNetHelp.prototype.constructor = Window_AbilityNetHelp;

// ● 初期化
Window_AbilityNetHelp.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth;
    var height = this.fittingHeight(numLines || 3);
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this._actor = null;
    this._item = null;
    this._text = '';
};

// ● アクターの設定
Window_AbilityNetHelp.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

// ● テキストの設定
Window_AbilityNetHelp.prototype.setText = function(text) {
    if (this._text !== text) {
        this._item = null;
        this._text = text;
        this.refresh();
    }
};

// ● テキストのクリア
Window_AbilityNetHelp.prototype.clear = function() {
    this.setItem(null);
};

// ● アイテムの設定
Window_AbilityNetHelp.prototype.setItem = function(item) {
    if (this._item !== item) {
        this._item = item;
        this._text = item ? item.description : '';
        this.refresh();
    };
};

// ● リフレッシュ
Window_AbilityNetHelp.prototype.refresh = function() {
    this.contents.clear();
    if (this._item) {
        this.drawItemName(this._item, this.textPadding(), 0, 312);
        this.drawTextEx(this._text, this.textPadding(), this.lineHeight());
        if (this._actor) {
            var pw = this.width - this.padding * 2 - 312;
            this.drawAbilityNetPoint(this._actor, this._item, 312, 0, pw)
        }
    } else {
        this.drawTextEx(this._text, this.textPadding(), 0);
    }
};

// ● アビリティポイントの描画
Window_AbilityNetHelp.prototype.drawAbilityNetPoint = function(actor, item, x, y, width) {
    var point = actor.acquiredAbilityNetPoint(item.id);
    var max = item.abilityNetPoint;
    var maxWidth = this.textWidth(String(max));
    var slashWidth = this.textWidth('/');
    var pointWidth = width - maxWidth - slashWidth;
    var mx = x + width - maxWidth;
    var sx = mx - slashWidth;
    this.resetTextColor();
    this.drawText(point, x, y, pointWidth, 'right');
    this.drawText('/', sx, y, slashWidth, 'right');
    this.drawText(max, mx, y, maxWidth, 'right');
};

//-----------------------------------------------------------------------------
// Window_AbilityNetStatus
//-----------------------------------------------------------------------------

// ● クラスの作成
function Window_AbilityNetStatus() {
    this.initialize.apply(this, arguments);
}

// ● クラスの継承
Window_AbilityNetStatus.prototype = Object.create(Window_Base.prototype);
Window_AbilityNetStatus.prototype.constructor = Window_AbilityNetStatus;

// ● 初期化
Window_AbilityNetStatus.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
};

// ● ウィンドウ幅の取得
Window_AbilityNetStatus.prototype.windowWidth = function() {
    return 240;
};

// ● ウィンドウ高さの取得
Window_AbilityNetStatus.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};

// ● 表示する行数の取得
Window_AbilityNetStatus.prototype.numVisibleRows = function() {
    return 2;
};

// ● アクターの設定
Window_AbilityNetStatus.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

// ● リフレッシュ
Window_AbilityNetStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        var w = this.width - this.padding * 2;
        this.drawActorName(this._actor, 0, 0, w);
        this.drawActorRANP(this._actor, 0, this.lineHeight(), w);
    }
};

// ● アクターの残りアビリティポイントの描画
Window_AbilityNetStatus.prototype.drawActorRANP = function(actor, x, y, width) {
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.abilityNetPointA, x, y, 48);
    this.resetTextColor();
    this.drawText(actor.remainingAbilityNetPoint(), x + 48, y, width - 48, 'right');
};

//-----------------------------------------------------------------------------
// Window_AbilityNetBase
//-----------------------------------------------------------------------------

// ● クラスの作成
function Window_AbilityNetBase() {
    this.initialize.apply(this, arguments);
}

// ● クラスの継承
Window_AbilityNetBase.prototype = Object.create(Window_Command.prototype);
Window_AbilityNetBase.prototype.constructor = Window_AbilityNetBase;

// ● 初期化
Window_AbilityNetBase.prototype.initialize = function(x, y, width, height) {
    Window_Command.prototype.initialize.call(this, x, y);
    this._actor = null;
    this.width = width;
    this.height = height;
    this.refresh();
};

// ● アクターの設定
Window_AbilityNetBase.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        this.selectLast();
    }
};

// ● コマンドリストの作成
Window_AbilityNetBase.prototype.makeCommandList = function() {
    if (this._actor) {
        var bases = this._actor.abilityNetBases();
        bases.sort(function(a, b) {
            return a - b;
        });
        bases.forEach(function(itemId) {
            var item = $dataArmors[itemId];
            var name = item.meta.abilityNetBaseName || item.name;
            this.addCommand(name, 'abilityNetBase', true, itemId);
        }, this);
    }
};

// ● フレーム更新
Window_AbilityNetBase.prototype.update = function() {
    Window_Command.prototype.update.call(this);
    if (this._abilityPerch) {
        this._abilityPerch.setBaseItem($dataArmors[this.currentExt()]);
    }
};

// ● アビリティパーチの設定
Window_AbilityNetBase.prototype.setAbilityPerch = function(abilityPerch) {
    this._abilityPerch = abilityPerch;
    this.update();
};

// ● 最後に選択していたコマンドを選択
Window_AbilityNetBase.prototype.selectLast = function() {
    // 必要ではあれば、選択した項目を覚え、それを選択する。
    this.select(0);
};

//-----------------------------------------------------------------------------
// Window_AbilityNetNumber
//-----------------------------------------------------------------------------

// ● クラスの作成
function Window_AbilityNetNumber() {
    this.initialize.apply(this, arguments);
}

// ● クラスの継承
Window_AbilityNetNumber.prototype = Object.create(Window_Selectable.prototype);
Window_AbilityNetNumber.prototype.constructor = Window_AbilityNetNumber;

// ● 初期化
Window_AbilityNetNumber.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this._item = null;
    this._itemMax = 0;
    this._min = 0;
    this._max = 0;
    this._number = 0;
    this.createButtons();
};

// ● 数値の取得
Window_AbilityNetNumber.prototype.number = function() {
    return this._number;
};

// ● セットアップ
Window_AbilityNetNumber.prototype.setup = function(actor, item) {
    this._actor = actor;
    this._item = item;
    if (this._actor && this._item) {
        var now = this._actor.acquiredAbilityNetPoint(this._item.id);
        var rem = this._actor.remainingAbilityNetPoint();
        this._itemMax = this._item.abilityNetPoint;
        this._min = now;
        this._max = Math.min(now + rem, this._itemMax);
    } else {
        this._itemMax = 0;
        this._min = 0;
        this._max = 0;
    }
    this._number = this._min;
    this.placeButtons();
    this.refresh();
};

// ● ボタンの作成
Window_AbilityNetNumber.prototype.createButtons = function() {
    var bitmap = ImageManager.loadSystem('ButtonSet');
    var buttonWidth = 48;
    var buttonHeight = 48;
    this._buttons = [];
    for (var i = 0; i < 5; i++) {
        var button = new Sprite_Button();
        var x = buttonWidth * i;
        var w = buttonWidth * (i === 4 ? 2 : 1);
        button.bitmap = bitmap;
        button.setColdFrame(x, 0, w, buttonHeight);
        button.setHotFrame(x, buttonHeight, w, buttonHeight);
        this._buttons.push(button);
        this.addChild(button);
    }
    this._buttons[0].setClickHandler(this.onButtonDown2.bind(this));
    this._buttons[1].setClickHandler(this.onButtonDown.bind(this));
    this._buttons[2].setClickHandler(this.onButtonUp.bind(this));
    this._buttons[3].setClickHandler(this.onButtonUp2.bind(this));
    this._buttons[4].setClickHandler(this.onButtonOk.bind(this));
};

// ● ボタンの配置
Window_AbilityNetNumber.prototype.placeButtons = function() {
    var numButtons = this._buttons.length;
    var spacing = 16;
    var totalWidth = -spacing;
    for (var i = 0; i < numButtons; i++) {
        totalWidth += this._buttons[i].width + spacing;
    }
    var x = (this.width - totalWidth) / 2;
    for (var j = 0; j < numButtons; j++) {
        var button = this._buttons[j];
        button.x = x;
        button.y = this.buttonY();
        x += button.width + spacing;
    }
};

// ● ボタンの表示
Window_AbilityNetNumber.prototype.showButtons = function() {
    for (var i = 0; i < this._buttons.length; i++) {
        this._buttons[i].visible = true;
    }
};

// ● ボタンを隠す
Window_AbilityNetNumber.prototype.hideButtons = function() {
    for (var i = 0; i < this._buttons.length; i++) {
        this._buttons[i].visible = false;
    }
};

// ● リフレッシュ
Window_AbilityNetNumber.prototype.refresh = function() {
    this.contents.clear();
    this.drawItemName(this._item, 0, 0);
    this.drawMaxNumber();
    this.drawSlash();
    this.drawNumber();
};

// ● 最大値の描画
Window_AbilityNetNumber.prototype.drawMaxNumber = function() {
    var x = this.contentsWidth() - this.maxWidth();
    var width = this.maxWidth();
    this.resetTextColor();
    this.drawText(this._itemMax, x, 0, width);
};

// ● スラッシュ文字の描画
Window_AbilityNetNumber.prototype.drawSlash = function() {
    var x = this.contentsWidth() - this.slashWidth() - this.maxWidth();
    var width = this.slashWidth();
    this.resetTextColor();
    this.drawText('/', x, 0, width);
};

// ● 現在値の描画
Window_AbilityNetNumber.prototype.drawNumber = function() {
    var x = this.cursorX();
    var width = this.numberWidth() - this.textPadding();
    this.resetTextColor();
    this.drawText(this._number, x, 0, width, 'right');
};

// ● 数値の文字幅
Window_AbilityNetNumber.prototype.numberWidth = function() {
    return this.textWidth(String(this._itemMax)) + this.textPadding() * 2;
};

// ● 斜線の文字幅
Window_AbilityNetNumber.prototype.slashWidth = function() {
    return this.textWidth('/');
};

// ● 最大値の文字幅
Window_AbilityNetNumber.prototype.maxWidth = function() {
    return this.textWidth(String(this._itemMax));
};

// ● カーソルのX座標
Window_AbilityNetNumber.prototype.cursorX = function() {
    return (this.contentsWidth() - this.numberWidth() -
            this.slashWidth() - this.maxWidth());
};

// ● ボタンのY座標
Window_AbilityNetNumber.prototype.buttonY = function() {
    return this.height - this.standardPadding() - 48;
};

// ● フレーム更新
Window_AbilityNetNumber.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    this.processNumberChange();
};

// ● 決定が選択されたかどうか
Window_AbilityNetNumber.prototype.isOkTriggered = function() {
    return Input.isTriggered('ok');
};

// ● 決定音の再生
Window_AbilityNetNumber.prototype.playOkSound = function() {
    // 効果音の再生を行わない。（シーン内で行う。）
};

// ● 数値の変更処理
Window_AbilityNetNumber.prototype.processNumberChange = function() {
    if (this.isOpenAndActive()) {
        if (Input.isRepeated('right')) {
            this.changeNumber(1);
        }
        if (Input.isRepeated('left')) {
            this.changeNumber(-1);
        }
        if (Input.isRepeated('up')) {
            this.changeNumber(10);
        }
        if (Input.isRepeated('down')) {
            this.changeNumber(-10);
        }
    }
};

// ● 数値の変更
Window_AbilityNetNumber.prototype.changeNumber = function(amount) {
    var lastNumber = this._number;
    this._number = (this._number + amount).clamp(this._min, this._max);
    if (this._number !== lastNumber) {
        SoundManager.playCursor();
        this.refresh();
    }
};

// ● カーソルの更新
Window_AbilityNetNumber.prototype.updateCursor = function() {
    this.setCursorRect(this.cursorX(), 0, this.numberWidth(), this.lineHeight());
};

// ● 増加ボタン押下処理
Window_AbilityNetNumber.prototype.onButtonUp = function() {
    this.changeNumber(1);
};

// ● 多めの増加ボタン押下処理
Window_AbilityNetNumber.prototype.onButtonUp2 = function() {
    this.changeNumber(10);
};

// ● 減少ボタン押下処理
Window_AbilityNetNumber.prototype.onButtonDown = function() {
    this.changeNumber(-1);
};

// ● 多めの減少ボタン押下処理
Window_AbilityNetNumber.prototype.onButtonDown2 = function() {
    this.changeNumber(-10);
};

// ● 決定ボタンの押下処理
Window_AbilityNetNumber.prototype.onButtonOk = function() {
    this.processOk();
};

//-----------------------------------------------------------------------------
// Scene_AbilityNetwork
//-----------------------------------------------------------------------------

// ● クラスの作成
function Scene_AbilityNetwork() {
    this.initialize.apply(this, arguments);
}

// ● クラスの継承
Scene_AbilityNetwork.prototype = Object.create(Scene_MenuBase.prototype);
Scene_AbilityNetwork.prototype.constructor = Scene_AbilityNetwork;

// ● 初期化
Scene_AbilityNetwork.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

// ● シーンの作成
Scene_AbilityNetwork.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createAbilityHelpWindow();
    this.createAbilityStatusWindow();
    this.createAbilityBaseWindow();
    this.createDummyWindow();
    this.createAbilityPerch();
    this.createAbilityNumberWindow();
    this.refreshActor();
};

// ● シーンの開始
Scene_AbilityNetwork.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
};

// ● ヘルプウィンドウを作成
Scene_AbilityNetwork.prototype.createAbilityHelpWindow = function() {
    this._helpWindow = new Window_AbilityNetHelp();
    this.addWindow(this._helpWindow);
};

// ● ステータスウィンドウを作成
Scene_AbilityNetwork.prototype.createAbilityStatusWindow = function() {
    var wy = this._helpWindow.height;
    this._statusWindow = new Window_AbilityNetStatus(0, wy);
    this.addWindow(this._statusWindow);
};

// ● アビリティベースウィンドウを作成
Scene_AbilityNetwork.prototype.createAbilityBaseWindow = function() {
    var wy = this._statusWindow.y + this._statusWindow.height;
    var ww = this._statusWindow.width;
    var wh = Graphics.height - wy;
    this._abilityBaseWindow = new Window_AbilityNetBase(0, wy, ww, wh);
    this._abilityBaseWindow.setHelpWindow(this._helpWindow);
    this._abilityBaseWindow.setHandler('abilityNetBase', this.commandAbilityBase.bind(this));
    this._abilityBaseWindow.setHandler('cancel',   this.popScene.bind(this));
    this._abilityBaseWindow.setHandler('pagedown', this.nextActor.bind(this));
    this._abilityBaseWindow.setHandler('pageup',   this.previousActor.bind(this));
    this.addWindow(this._abilityBaseWindow);
};

// ● ダミーウィンドウを作成
Scene_AbilityNetwork.prototype.createDummyWindow = function() {
    var px = this._statusWindow.width;
    var py = this._helpWindow.height;
    var pw = Graphics.width - px;
    var ph = Graphics.height - py;
    this._dummyWindow = new Window_Base(px, py, pw, ph);
    this.addPerch(this._dummyWindow);
};

// ● アビリティパーチを作成
Scene_AbilityNetwork.prototype.createAbilityPerch = function() {
    var px = this._statusWindow.width;
    var py = this._helpWindow.height;
    var pw = Graphics.width - px;
    var ph = Graphics.height - py;
    this._abilityPerch = new Perch_AbilityNetwork(px, py, pw, ph);
    this._abilityPerch.setHelpWindow(this._helpWindow);
    this._abilityPerch.setHandler('ok',     this.onAbilityOk.bind(this));
    this._abilityPerch.setHandler('cancel', this.onAbilityCancel.bind(this));
    this._abilityBaseWindow.setAbilityPerch(this._abilityPerch);
    this.addPerch(this._abilityPerch);
};

// ● 数値入力ウィンドウを作成
Scene_AbilityNetwork.prototype.createAbilityNumberWindow = function() {
    var ww = 440;
    var wh = 138;
    var wx = this._abilityPerch.x + (this._abilityPerch.width - ww) / 2;
    var wy = this._abilityPerch.y + (this._abilityPerch.height - wh) / 2;
    this._numberWindow = new Window_AbilityNetNumber(wx, wy, ww, wh);
    this._numberWindow.hide();
    this._numberWindow.setHandler('ok',     this.onNumberOk.bind(this));
    this._numberWindow.setHandler('cancel', this.onNumberCancel.bind(this));
    this.addWindow(this._numberWindow);
};

// ● アクターのリフレッシュ
Scene_AbilityNetwork.prototype.refreshActor = function() {
    var actor = this.actor();
    this._helpWindow.setActor(actor);
    this._statusWindow.setActor(actor);
    this._abilityBaseWindow.setActor(actor);
    this._abilityPerch.setActor(actor);
};

// ● ベースコマンド処理
Scene_AbilityNetwork.prototype.commandAbilityBase = function() {
    this._abilityPerch.activate();
    this._abilityPerch.selectLast();
};

// ● アビリティ選択時の処理
Scene_AbilityNetwork.prototype.onAbilityOk = function() {
    var item = this._abilityPerch.item();
    this._numberWindow.setup(this.actor(), item);
    this._numberWindow.show();
    this._numberWindow.activate();
};

// ● アビリティキャンセル時の処理
Scene_AbilityNetwork.prototype.onAbilityCancel = function() {
    this._abilityPerch.deselect();
    this._abilityBaseWindow.activate();
};

// ● 数値入力決定時の処理
Scene_AbilityNetwork.prototype.onNumberOk = function() {
    var item = this._abilityPerch.item();
    var number = this._numberWindow.number();
    if (this.doPointUp(item, number)) {
        SoundManager.playAbilityNetLearning();
    } else {
        SoundManager.playAbilityNetPointUp();
    }
    this.endNumberInput();
    this._helpWindow.refresh();
    this._statusWindow.refresh();
    this._abilityBaseWindow.refresh();
    this._abilityPerch.refresh();
};

// ● 数値入力キャンセル時の処理
Scene_AbilityNetwork.prototype.onNumberCancel = function() {
    SoundManager.playCancel();
    this.endNumberInput();
};

// ● ポイント上昇処理
Scene_AbilityNetwork.prototype.doPointUp = function(item, number) {
    if (item) {
        this.actor().setAbilityNetwork(item.id, number);
        return this.actor().isLearnedAbilityNetwork(item);
    }
    return false;
};

// ● 数値入力終了時の処理
Scene_AbilityNetwork.prototype.endNumberInput = function() {
    this._numberWindow.hide();
    this._abilityPerch.activate();
};

// ● アクターを変更
Scene_AbilityNetwork.prototype.onActorChange = function() {
    this.refreshActor();
    this._abilityBaseWindow.activate();
};
