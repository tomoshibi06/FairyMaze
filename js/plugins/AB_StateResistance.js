// =============================================================================
// AB_StateResistance.js
// Version: 1.00
// -----------------------------------------------------------------------------
// Copyright (c) 2015 ヱビ
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
// -----------------------------------------------------------------------------
// [Homepage]: ヱビのノート
//             http://www.zf.em-net.ne.jp/~ebi-games/
// =============================================================================

/*:
 * @plugindesc 戦闘中にステートに耐性がついていくようになります。
 * 
 * @author ヱビ
 * 
 * @param DebugMode
 * @desc ONにするとステート有効度と、ステートにかかったときの
 * 耐性をコンソールに出力します。 0:OFF、1:ON
 * @default 0
 * 
 * @param StateRateFormula
 * @desc 最終的なステート有効度の式です。
 * デフォルト：stateRate - resistance
 * @default stateRate - resistance
 * 
 * @param GrowResistanceFormula
 * @desc ステートにかかったときの耐性の式です。
 * デフォルト：resistance + 0.75 - stateRate / 4
 * @default resistance + 0.75 - stateRate / 4
 * 
 * @param TurnEndFormula
 * @desc ターンが経過したときの耐性の式です。
 * デフォルト：resistance - 0.02
 * @default resistance - 0.02
 * 
 * @param BattleEndFormula
 * @desc バトルが終わったときの耐性の式です。
 * デフォルト：0
 * @default 0
 * 
 * 
 * @help
 * ============================================================================
 * どんなプラグイン？
 * ============================================================================
 * 
 * 戦闘中、ステートにかかるとそのステートに耐性ができ、かかりづらくなるようにな
 * ります。デフォルトでは、耐性はターン経過で減少し、バトル終了でリセットされま
 * す。
 * 
 * ============================================================================
 * プラグインパラメータ
 * ============================================================================
 * 
 * プラグインパラメータで、
 * ・最終的なステート有効度の式
 * ・ステートにかかったときの耐性の式
 * ・ターンが経過したときの耐性の式
 * ・バトルが終わったときの耐性の式
 * を設定できます。
 * 
 * 耐性の式はそのまま代入されるので、元の値から足したい場合、
 * resistance + 0.9
 * などと元の値も式に入れる必要があります。
 * 
 * 耐性は負の数にはなりません。
 * 
 * 計算式では、
 * ----------------------------------------------------------------------------
 * 元のステート有効度           ： stateRate
 * 耐性                         ： resistance
 * ステートにかかった人         ： a, user, b, target
 * 変数                         ： v
 * ----------------------------------------------------------------------------
 * を使えます。
 * 
 * ステートにかかった人、変数はスキルのダメージ計算式と同じように
 * 扱うことができます。
 * 例１：ステートにかかった人の最大HP
 *         user.mhp
 * 例２：12番目の変数
 *         v[12]
 * 
 * ============================================================================
 * 耐性がつくステートを設定
 * ============================================================================
 * 
 * ステートのメモ：
 *   <growResistance>
 *     このタグをつけたステートは、かかったときに耐性ができるようになります。
 * 
 * ============================================================================
 * 耐性の確認方法
 * ============================================================================
 * 
 * プラグインパラメータ DebugMode を ON にすると、耐性を含めたステート有効度と
 * 耐性が、F8 で起動する Developer Tools の Console に出力されるようになります。
 * 
 * また、DebugMode を ON にすると計算式にエラーがあったときもコンソールに出力
 * されます。
 * 
 * 現在の耐性は、アクターとエネミーの _stateResistances に入っています。
 * Developer Tools の Sources タブの中にある、Watch Expressions で
 * 見ることができます。
 * 
 * アクターの耐性を見る場合
 * ▼$gameActors: Game_Actors
 * 　▼_data: Array[5]                 （5はアクターの人数＋１）
 * 　　▼1: Game_Actor                 （1は見たいアクターのID）
 * 　　　▼_stateResistances: Array[14]（14はステートの個数＋１）
 * 　　　　　4: 0.9                    （4は見たいステートのIDで、0.9が耐性）
 * 
 * エネミーの耐性を見る場合
 * ▼$gameTroop: GameTroop
 * 　▼_enemies: Array[2]              （2はエネミーの数）
 * 　　▼0: Game_Enemy                 （0は見たいエネミーの番号）
 * 　　　▼_stateResistances: Array[14]（14はステートの個数＋１）
 * 　　　　　13: 0                     （13は見たいステートのIDで、0が耐性）
 * 
 * 
 * ============================================================================
 * 利用規約
 * ============================================================================
 * 
 * ・クレジット表記は不要
 * ・営利目的で使用可
 * ・改変可
 *     ただし、ソースコードのヘッダのライセンス表示は残してください。
 * ・素材だけの再配布も可
 * ・アダルトゲーム、残酷なゲームでの使用も可
 * 
 * 
 */

(function() {
	
	var parameters = PluginManager.parameters('AB_StateResistance');
	var ResistanceDebugMode = (parameters['DebugMode'] == 1) ? true : false;
	var StateRateFormula = (parameters['StateRateFormula'] || 0);
	var GrowResistanceFormula = (parameters['GrowResistanceFormula'] || 0);
	var TurnEndFormula = (parameters['TurnEndFormula'] || 0);
	var BattleEndFormula = (parameters['BattleEndFormula'] || 0);


//=============================================================================
// Game_BattlerBase
//=============================================================================

	var Game_BattlerBase_prototype_initMembers = Game_BattlerBase.prototype.initMembers;
	Game_BattlerBase.prototype.initMembers = function() {
		Game_BattlerBase_prototype_initMembers.call(this);
		this.clearStateResistance();
	};

	Game_BattlerBase.prototype.clearStateResistance = function() {
		this._stateResistances = [];
		for (var i = 1, l = $dataStates.length; i < l; i++) {
			this._stateResistances[i] = 0;
		}
	};


	var Game_BattlerBase_prototype_stateRate = Game_BattlerBase.prototype.stateRate;
	Game_BattlerBase.prototype.stateRate = function(stateId) {
		var stateRate = Game_BattlerBase_prototype_stateRate.call(this, stateId);
		var state = $dataStates[stateId];
		if (!state.meta.growResistance) return stateRate;
		var temp = stateRate;
		var resistance = this.stateResistance(stateId);
		var a = user = b = target = this;
		var v = $gameVariables._data;
		
		try {
			stateRate = eval(StateRateFormula);
		} catch (e) {
			if (ResistanceDebugMode) console.log(e);
			stateRate = temp;
		}

		if (stateRate < 0) stateRate = 0;
		if (ResistanceDebugMode) console.log(state.name + "のステート有効度は" + stateRate);
		return stateRate;
	};

	Game_BattlerBase.prototype.stateResistance = function(stateId) {
		var res = this._stateResistances[stateId];
		if (!res) {
			this._stateResistances[stateId] = 0;
			return 0;
		}
		return res;
	};

	Game_BattlerBase.prototype.setStateResistance = function(stateId, value) {
		if (value < 0) value = 0;
		this._stateResistances[stateId] = value;
	};

//=============================================================================
// Game_Battler
//=============================================================================
	var Game_Battler_prototype_addState = Game_Battler.prototype.addState;
	Game_Battler.prototype.addState = function(stateId) {
		Game_Battler_prototype_addState.call(this, stateId);
		this.growResistance(stateId);
	};

	Game_Battler.prototype.growResistance = function(stateId) {
		var state = $dataStates[stateId];
		if (!state.meta.growResistance) return;

		var stateRate = Game_BattlerBase_prototype_stateRate.call(this, stateId);
		var resistance = this.stateResistance(stateId);
		var a = user = b = target = this;
		var v = $gameVariables._data;
		
		try {
			resistance = eval(GrowResistanceFormula);
		} catch (e) {
			if (ResistanceDebugMode) console.log(e);
			resistance = 0;
		}

		this.setStateResistance(stateId, resistance);
		//
		if (ResistanceDebugMode) console.log(target.name() + "の" + state.name + "への" + "耐性が" + this.stateResistance(stateId) + "になった");
	};

	var Game_Battler_prototype_onTurnEnd = Game_Battler.prototype.onTurnEnd;
	Game_Battler.prototype.onTurnEnd = function() {
		Game_Battler_prototype_onTurnEnd.call(this);
		this.resistanceOnTurnEnd();
	};

	Game_Battler.prototype.resistanceOnTurnEnd = function() {
		for (var stateId = 1, l = $dataStates.length; stateId < l; stateId++) {
			this.execStateResistanceTurnEndFormula(stateId);
		}
	};

	Game_Battler.prototype.execStateResistanceTurnEndFormula = function(stateId) {
		var state = $dataStates[stateId];
		if (!state.meta.growResistance) return;
		var stateRate = Game_BattlerBase_prototype_stateRate.call(this, stateId);
		var resistance = this.stateResistance(stateId);
		var a = user = b = target = this;
		var v = $gameVariables._data;
		
		try {
			resistance = eval(TurnEndFormula);
		} catch (e) {
			if (ResistanceDebugMode) console.log(e);
			resistance = 0;
		}

		this.setStateResistance(stateId, resistance);
	};

	var Game_Battler_prototype_onBattleEnd = Game_Battler.prototype.onBattleEnd;
	Game_Battler.prototype.onBattleEnd = function() {
		Game_Battler_prototype_onBattleEnd.call(this);
		this.resistanceOnBattleEnd();
	};

	Game_Battler.prototype.resistanceOnBattleEnd = function() {
		for (var stateId = 1, l = $dataStates.length; stateId < l; stateId++) {
			this.execStateResistanceBattleEndFormula(stateId);
		}
	};

	Game_Battler.prototype.execStateResistanceBattleEndFormula = function(stateId) {
		var state = $dataStates[stateId];
		if (!state.meta.growResistance) return;

		var stateRate = Game_BattlerBase_prototype_stateRate.call(this, stateId);
		var resistance = this.stateResistance(stateId);
		var a = user = b = target = this;
		var v = $gameVariables._data;
		
		try {
			resistance = eval(BattleEndFormula);
		} catch (e) {
			if (ResistanceDebugMode) console.log(e);
			resistance = 0;
		}

		this.setStateResistance(stateId, resistance);
	};
})();