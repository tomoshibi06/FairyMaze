


/*:
 * @plugindesc ピクチャ上限を突破します。ツクールのEditからは101以上のidを指定できないので、helpを参照してください
 * @author dummy
 *
 * @param max_pic_num
 * @desc ピクチャの最大数を指定します
 * @default 10000

 * @help
 * ============================================================================
 * 101以上のピクチャはAdvancedのPlugin Commandから利用できます
 * ============================================================================
 *
 * コマンド一覧
 * 
 * ピクチャの表示
 * dShowPicture ピクチャのID 表示するピクチャの名前 基準位置 x座標 y座標 拡大率幅 拡大率高さ 透明度 ブレンドモード
 * 基準位置		:UpperLeft，Center
 * 透明度		:0～255
 * ブレンドモード	:Normal，Additive
 * 
 * ピクチャの削除
 * dErasePicture ピクチャのID
 * 
 * ピクチャの移動
 * dMovePicture ピクチャのID 基準位置 x座標 y座標 拡大率幅 拡大率高さ 透明度 ブレンドモード 掛ける時間
 * 
 * ブレンドモードの変更
 * dBlendMode ピクチャのID ブレンドモード
 * 
 * 画像の回転
 * dRotatePicture ピクチャのID 回転速度 
 * 
 * 画像を染める
 * dTintPicture ピクチャのID red green blue gray 掛ける時間 
 * red,green,blue,gray	:0～255
 */

  (function() {
	var parameters = PluginManager.parameters('ChangePictureMAX');
  
	Game_Screen.prototype.maxPictures = function() {
		return MAX;
	};
	var MAX = parameters['max_pic_num'];


	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
        	_Game_Interpreter_pluginCommand.call(this, command, args);

		if(command === 'dShowPicture'){
			var pic_id = eval(args[0]);
			var pic_name = args[1];
			var origin = 0; //upperleft
			if(args[2] === 'Center') origin = 1;
			var pic_x = eval(args[3]);
			var pic_y = eval(args[4]);
			var width = eval(args[5]);
			var height = eval(args[6]);
			var opacity = eval(args[7]);
			var blend_mode = 0; //normal
			if(args[8] === 'dCenter') blend_mode = 1;
			$gameScreen.showPicture(pic_id, pic_name, origin, pic_x, pic_y, width, height, opacity, blend_mode);
		}else if(command === 'dErasePicture'){
			var pic_id = eval(args[0]);
			$gameScreen.erasePicture( pic_id );
		}else if(command === 'dMovePicture'){
			var pic_id = eval(args[0]);
			var origin = 0; //upperleft
			if(args[1] === 'Center') origin = 1;
			var pic_x = eval(args[2]);
			var pic_y = eval(args[3]);
			var width = eval(args[4]);
			var height = eval(args[5]);
			var opacity = eval(args[6]);
			var blend_mode = 0; //normal
			if(args[7] === 'dCenter') blend_mode = 1;
			var duration = eval(args[8]);
			$gameScreen.movePicture(pic_id, origin, pic_x, pic_y, width, height, opacity, blend_mode, duration);
		}else if(command === 'dBlendMode'){
			var pic_id = eval(args[0]);
			var blend_mode = 0; //normal
			if(args[1] === 'dCenter') blend_mode = 1;
			$gameScreen._pictures[pic_id]._blendMode = blend_mode;
		}else if(command === 'dRotatePicture'){
			var pic_id = eval(args[0]);
			var speed = eval(args[1]);
			$gameScreen.rotatePicture(pic_id, speed);
		}else if(command === 'dTintPicture'){
			var pic_id = eval(args[0]);
//			var tone = eval(args[1]); //[0,0,0,0]とかがくる[r,g,b,gray]
			var tone = [eval(args[1]), eval(args[2]), eval(args[3]), eval(args[4])];
			var duration = eval(args[5]);
			$gameScreen.tintPicture(pic_id, tone, duration);
		}
	}

  })();
  
  