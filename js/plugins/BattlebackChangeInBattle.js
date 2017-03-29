//=============================================================================
// BattlebackChangeInBattle.js
//=============================================================================

/*:
 * @plugindesc Change battleback by battle event.
 * @author USK
 *
 * @help Use command "Change Battle Back" in battle event.
 */

/*:ja
 * @plugindesc バトルイベントでの戦闘背景変更が可能になります。
 * @author USK
 *
 * @help バトルコマンドで"戦闘背景の変更"を使用してください。
 */
 
var usk_temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
	usk_temp_initialize.call(this);
	this._changeBattlebackFlag = false;
};

Game_Temp.prototype.setChangeBattlebackFlag = function(bool) {
	this._changeBattlebackFlag = bool;
};

Game_Temp.prototype.changeBattlebackFlag = function() {
	return this._changeBattlebackFlag;
};

var usk_changeBattleback = Game_Map.prototype.changeBattleback;
Game_Map.prototype.changeBattleback = function(battleback1Name, battleback2Name) {
    usk_changeBattleback.call(this, battleback1Name, battleback2Name);
    $gameTemp.setChangeBattlebackFlag(true);
};

var usk_updateBattleback = Spriteset_Battle.prototype.updateBattleback;
Spriteset_Battle.prototype.updateBattleback = function() {	
	if ($gameTemp.changeBattlebackFlag()) {
       this.recreateBattleback();
       $gameTemp.setChangeBattlebackFlag(false);
    }
    usk_updateBattleback.call(this);
}

Spriteset_Battle.prototype.recreateBattleback = function() {
    this._back1Sprite.bitmap = this.battleback1Bitmap();
    this._back2Sprite.bitmap = this.battleback2Bitmap();
}

var usk_battleback1Name = Spriteset_Battle.prototype.battleback1Name;
Spriteset_Battle.prototype.battleback1Name = function() {
	if ($gameTemp.changeBattlebackFlag()) {
		return $gameMap.battleback1Name();
    } else {
        return usk_battleback1Name.call(this);
    }
};

var usk_battleback2Name = Spriteset_Battle.prototype.battleback2Name;
Spriteset_Battle.prototype.battleback2Name = function() {
	if ($gameTemp.changeBattlebackFlag()) {
		return $gameMap.battleback2Name();
    } else {
        return usk_battleback2Name.call(this);
    }
};
