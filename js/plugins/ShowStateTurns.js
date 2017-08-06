//
//  ステートターン表示 ver1.00
//
// author yana
//

var Imported = Imported || {};
Imported['ShowStateTurns'] = 1.00;


/*:
 * @plugindesc ver1.00/アクターのステートやバフの残りターン数をアイコンに表示します。
 * @author Yana
 * 
 * @help ------------------------------------------------------
 * 注意
 * ------------------------------------------------------
 * 
 * drawActorIconsを再定義しているため、上の方に配置してください。
 * 
 * ------------------------------------------------------
 * 利用規約：特になし。素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 * 更新履歴:
 * ver1.00:
 * 公開
 */

(function(){
	
	Window_Base.prototype.drawActorIcons = function(actor, x, y, width) {
    	width = width || 144;
    	var icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
    	var stateIds = actor.stateIds();
    	var buffIds = actor.buffIds();
    	var w = Window_Base._iconWidth;
        for (var i = 0; i < icons.length; i++) {
        	var xx = x + w * i
        	var turns = 0;
    		this.drawIcon(icons[i], xx, y + 2);
    		if ($gameParty.inBattle()){
        		if (stateIds.length > i){
        			var state = $dataStates[stateIds[i]];
        			turns = state.autoRemovalTiming === 0 ? 0 : actor._stateTurns[stateIds[i]];
        		}else{
        			turns = actor._buffTurns[buffIds[i-stateIds.length]];
        		}
        		if (turns > 0){ this.drawText( turns, xx, y + 2, w, 'right') }
        	}
    	}
	};
	
	Game_BattlerBase.prototype.stateIds = function() {
    	return this.states().reduce(function(r,state) {
    		if (state.iconIndex > 0){ r.push(state.id) }
        	return r;
    	},[]);
	};

	Game_BattlerBase.prototype.buffIds = function() {
    	var icons = [];
    	for (var i = 0; i < this._buffs.length; i++) {
        	if (this._buffs[i] !== 0) {
            	icons.push(i);
        	}
    	}
    	return icons;
	};
	
}());