// --------------------------------------------------------------------------
// 
// PickupSkill
//
// Copyright (c) kotonoha*
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//
// 2016/09/23 ver1.0 プラグイン公開
// 
// --------------------------------------------------------------------------
/*:
 * @plugindesc 任意のスキルを直接コマンドから選択出来る様にするプラグイン
 * @author kotonoha*
 *
 * @help 任意のスキルを直接コマンドから選択出来る様にするプラグイン
 *
 * @param PickupSkillName
 * @desc コマンドに配置するスキル名
 * @default スキル
 * 
 * @param PickupSkillId
 * @desc コマンドで発動するスキルID
 * @default 0
 * 
 * @param PickupTarget
 * @desc コマンドのターゲット指定 (0:しない / 1:敵単体 / 2:味方単体)
 * ※全体化・ランダム・使用者対象のスキルは0を指定
 * @default 0
 * 
 * 
@help アクターのメモ欄に
 * <PickupSkill>
 * と入力したキャラクターのコマンド欄に設定したスキルが表示されます。
 *
 */

(function() {

	var parameters = PluginManager.parameters('PickupSkill');
	var PickupSkillName = String(parameters['PickupSkillName']);
	var PickupSkillId = Number(parameters['PickupSkillId'] || 0);
	var PickupTarget = Number(parameters['PickupTarget'] || 0);

	Window_ActorCommand.prototype.makeCommandList = function() {
	    if (this._actor) {
	        this.addAttackCommand();
	        
			this.addSkillCommands();
	        this.addGuardCommand();
	        this.addItemCommand();
	  if ($dataActors[this._actor._actorId].note.match(/<PickupSkill>/i)) {
	        	this.addPickupCommand();
	        }  }
	};

	var _Scene_Battle_prototype_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
	Scene_Battle.prototype.createActorCommandWindow = function() {
		_Scene_Battle_prototype_createActorCommandWindow.call(this);
	    this._actorCommandWindow.setHandler('Pickup',		this.commandPickup.bind(this));
	};

	Window_ActorCommand.prototype.addPickupCommand = function() {
	    this.addCommand(PickupSkillName, 'Pickup', this._actor.canPickup());
	};

	Game_BattlerBase.prototype.canPickup = function() {
	    return this.canUse($dataSkills[PickupSkillId]);
	};

	Scene_Battle.prototype.commandPickup = function() {
	    BattleManager.inputtingAction().setPickup();
	    if (PickupTarget === 0) {
		    this.selectNextCommand();
		}else if (PickupTarget === 1) {
			this.selectEnemySelection();
		}else {
			this.selectActorSelection();
		}
	};

	Game_Action.prototype.setPickup = function() {
	    this.setSkill(PickupSkillId);
	};

})();