//=============================================================================
// MessageWindowPlugin.js
//=============================================================================

/*:ja
 * @plugindesc 変数により動的にメッセージウィンドウの高さを変更するプラグインです。
 * @author 村人A
 *
 * @param 変数番号
 * @desc 変更したい行数を代入する変数番号
 * @default 1
 *
 * @help
 *
 * プラグインコマンド:
 *   mwc 5         # メッセージウィンドウのサイズを変数５の値に変更
 */
villaA_mwcParam = 1;
		
(function() {
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'mwc') {
			villaA_mwcParam = args[0];
		}
	}
	
	var Window_Message_newPage = Window_Message.prototype.newPage;
	Window_Message.prototype.newPage = function(textState) {
		Window_Message_newPage.call(this, textState)
		this.height = (this.numVisibleRows())*45;
	}
	
	Window_Message.prototype.numVisibleRows = function() {
		var rows = 4;
		if($gameVariables.value(villaA_mwcParam) == 0){
			rows = 4
		} else {
			rows = $gameVariables.value(villaA_mwcParam);
		}
		return rows
	};
})();