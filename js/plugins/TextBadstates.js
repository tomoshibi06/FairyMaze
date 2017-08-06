//=============================================================================
// TextBadstates.js
//=============================================================================

/*:ja
 * @plugindesc ver1.00 バトル中のステート表示をテキストに変更します。
 * @author まっつＵＰ
 * 
 * @param normaltext
 * @desc ステートにかかっていない時のテキスト
 * @default 正常
 * 
 * @param guardid
 * @desc 防御のステートID
 * @default 2
 *
 * @help
 * 
 * RPGで笑顔を・・・
 * 
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 * 
 * バトルステータスウインドウにおいて
 * そのアクターに付加されている一番優先度の高いステートの名前を表示します。
 * また、ステートにかかっているときはフォントカラーを変更して表示します。
 * 
 * このプラグインを利用する場合は
 * readmeなどに「まっつＵＰ」の名を入れてください。
 * また、素材のみの販売はダメです。
 * 上記以外の規約等はございません。
 * もちろんツクールMVで使用する前提です。
 * 何か不具合ありましたら気軽にどうぞ。
 *  
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 * 
 */

(function() {
    
var parameters = PluginManager.parameters('TextBadstates');
var TBnormaltext = String(parameters['normaltext'] || '正常');
var TBguardid = Number(parameters['guardid'] || 2);

//オーバーライド
//メソッド中、隠れている時を想定してisDeadでは判定していない。
Window_BattleStatus.prototype.drawActorIcons = function(actor, x, y, width) {
    x -= Window_Base._iconWidth / 4;
    width = Window_Base._iconWidth * 3;
    var state = actor.states()[0];
    var text = TBnormaltext;
    if(actor.isDeathStateAffected()){
        text = $dataStates[actor.deathStateId()].name;
        this.changeTextColor(this.deathColor());
    }else if(state){
        text = state.name;
        if(state !== $dataStates[TBguardid]){
            this.changeTextColor(this.crisisColor());
        }else{
            this.changeTextColor(this.tpCostColor());
        }
    }else{
        this.changeTextColor(this.normalColor());
    }
    this.drawText(text, x, y, width, 'left');
};
 
})();
