//=============================================================================
// dsBattlerSelect.js
// Copyright (c) 2015 Douraku
// Released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 戦闘中のバトラー選択を変更するプラグイン ver1.00β
 * @author 道楽
 *
 * @param cursorEnable
 * @desc 選択中にカーソルを表示するか (1:する 0:しない)
 * @default 1
 */

(function() {

	var parameters = PluginManager.parameters('dsBattlerSelect');
	var cursorEnable = (Number(parameters['cursorEnable']) != 0) ? 1 : 0;

	//-------------------------------------------------------------------------
	/** Game_Enemy */
	Game_Enemy.prototype.screenW = function()
	{
		var bitmap;
		if ( $gameSystem.isSideView() )
		{
			bitmap = ImageManager.loadSvEnemy(this.battlerName(), this.battlerHue());
		}
		else
		{
			bitmap = ImageManager.loadEnemy(this.battlerName(), this.battlerHue());
		}
		return bitmap._image.width;
	};

	Game_Enemy.prototype.screenH = function()
	{
		var bitmap;
		if ( $gameSystem.isSideView() )
		{
			bitmap = ImageManager.loadSvEnemy(this.battlerName(), this.battlerHue());
		}
		else
		{
			bitmap = ImageManager.loadEnemy(this.battlerName(), this.battlerHue());
		}
		return bitmap._image.height;
	};

	//-------------------------------------------------------------------------
	/** Game_Actor */
	Game_Actor.prototype.screenX = function()
	{
		var offset = this.isInputting() ? -48 : 0;
		return 600 + this.index() * 32 + offset;
	};

	Game_Actor.prototype.screenY = function()
	{
		return 280 + this.index() * 48;
	};

	Game_Actor.prototype.screenW = function()
	{
		var bitmap = ImageManager.loadSvActor(this.battlerName());
		return bitmap._image.width / 9;
	};

	Game_Actor.prototype.screenH = function()
	{
		var bitmap = ImageManager.loadSvActor(this.battlerName());
		return bitmap._image.height / 6;
	};

	//-------------------------------------------------------------------------
	/** Window_BattleEnemy */
	var _Window_BattleEnemy_initialize = Window_BattleEnemy.prototype.initialize;
	Window_BattleEnemy.prototype.initialize = function(x, y, statusHeight)
	{
		this._cursorSprite = null;
		this._cursorBitmap = null;
		this._statusHeight = statusHeight;
		_Window_BattleEnemy_initialize.call(this, x, y);
		this.opacity = 0;

		//---
		if ( cursorEnable != 0 )
		{
			this._cursorSprite = new Sprite();
			this._cursorSprite.bitmap = new Bitmap(1, 1);
			this._cursorBitmap = ImageManager.loadSystem('BattleCursor');
			this.addChild(this._cursorSprite);
		}
	};

	Window_BattleEnemy.prototype.windowWidth = function()
	{
		return Graphics.boxWidth;
	};

	Window_BattleEnemy.prototype.windowHeight = function()
	{
		return Graphics.boxHeight - this._statusHeight;
	};

	Window_BattleEnemy.prototype.standardPadding = function()
	{
		return 0;
	};

	Window_BattleEnemy.prototype.standardFontSize = function()
	{
		return 24;
	};

	Window_BattleEnemy.prototype.itemRect = function(index)
	{
		var enemy = this._enemies[index];
		var rect = new Rectangle();
		rect.width = enemy.screenW();
		rect.height = enemy.screenH();
		rect.x = enemy.screenX() - rect.width / 2;
		rect.y = enemy.screenY() - rect.height;
		return rect;
	};

	Window_BattleEnemy.prototype.updateCursor = function()
	{
		if ( this._cursorAll )
		{
			var allRowsHeight = this.maxRows() * this.itemHeight();
			this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
			this.setTopRow(0);
		}
		else if ( this.isCursorVisible() )
		{
			var rect = this.itemRect(this.index());
			this.setCursorRect(rect.x, rect.y - this.lineHeight(), rect.width, this.lineHeight());
		}
		else
		{
			this.setCursorRect(0, 0, 0, 0);
		}
	};

	Window_BattleEnemy.prototype.drawItem = function(index)
	{
		if ( index === this._index )
		{
			// 名前
			this.resetTextColor();
			var name = this._enemies[index].name();
			var rect = this.itemRect(index);
			this.drawText(name, rect.x, rect.y - this.lineHeight(), rect.width, 'center');

			// カーソル
			if ( cursorEnable != 0 )
			{
				var p = 8;
				var w = 32;
				var bitmap = new Bitmap(rect.width+p*2, rect.height+p*2);
				this._cursorSprite.bitmap = bitmap;
				this._cursorSprite.move(rect.x-p, rect.y-p);
				bitmap.blt(this._cursorBitmap, 0, 0, w, w, 0,              0,               w, w);
				bitmap.blt(this._cursorBitmap, w, 0, w, w, bitmap.width-w, 0,               w, w);
				bitmap.blt(this._cursorBitmap, 0, w, w, w, 0,              bitmap.height-w, w, w);
				bitmap.blt(this._cursorBitmap, w, w, w, w, bitmap.width-w, bitmap.height-w, w, w);
			}
		}
	};

	var _Window_BattleEnemy_select = Window_BattleEnemy.prototype.select;
	Window_BattleEnemy.prototype.select = function(index)
	{
		_Window_BattleEnemy_select.call(this, index);
		this.refresh();
	};

	//-------------------------------------------------------------------------
	/** Window_BattleActor */
	var _Window_BattleActor_initialize = Window_BattleActor.prototype.initialize;
	Window_BattleActor.prototype.initialize = function(x, y, statusHeight)
	{
		this._cursorSprite = null;
		this._cursorBitmap = null;
		if ( $gameSystem.isSideView() )
		{
			this._statusHeight = statusHeight;
			_Window_BattleActor_initialize.call(this, x, y)
			this.opacity = 0;

			//---
			if ( cursorEnable != 0 )
			{
				this._cursorSprite = new Sprite();
				this._cursorSprite.bitmap = new Bitmap(1, 1);
				this._cursorBitmap = ImageManager.loadSystem('BattleCursor');
				this.addChild(this._cursorSprite);
			}
		}
		else
		{
			_Window_BattleActor_initialize.call(this, x, y);
		}
	};

	var _Window_BattleActor_windowWidth = Window_BattleActor.prototype.windowWidth;
	Window_BattleActor.prototype.windowWidth = function()
	{
		if ( $gameSystem.isSideView() )
		{
			return Graphics.boxWidth;
		}
		else
		{
			return _Window_BattleActor_windowWidth.call(this);
		}
	};

	var _Window_BattleActor_windowHeight = Window_BattleActor.prototype.windowHeight;
	Window_BattleActor.prototype.windowHeight = function()
	{
		if ( $gameSystem.isSideView() )
		{
			return Graphics.boxHeight - this._statusHeight;
		}
		else
		{
			return _Window_BattleActor_windowHeight.call(this);
		}
	};

	var _Window_BattleActor_standardPadding = Window_BattleActor.prototype.standardPadding;
	Window_BattleActor.prototype.standardPadding = function()
	{
		if ( $gameSystem.isSideView() )
		{
			return 0;
		}
		else
		{
			return _Window_BattleActor_standardPadding.call(this);
		}
	};

	var _Window_BattleActor_standardFontSize = Window_BattleActor.prototype.standardFontSize;
	Window_BattleActor.prototype.standardFontSize = function()
	{
		if ( $gameSystem.isSideView() )
		{
			return 24;
		}
		else
		{
			return _Window_BattleActor_standardFontSize.call(this);
		}
	};

	var _Window_BattleActor_itemRect = Window_BattleActor.prototype.itemRect;
	Window_BattleActor.prototype.itemRect = function(index)
	{
		if ( $gameSystem.isSideView() )
		{
			var actor = $gameParty.members()[index];
			var rect = new Rectangle();
			rect.width = actor.screenW();
			rect.height = actor.screenH();
			rect.x = actor.screenX() - rect.width / 2;
			rect.y = actor.screenY() - rect.height;
			return rect;
		}
		else
		{
			return _Window_BattleActor_itemRect.call(this, index);
		}
	};

	var _Window_BattleActor_updateCursor = Window_BattleActor.prototype.updateCursor;
	Window_BattleActor.prototype.updateCursor = function()
	{
		if ( $gameSystem.isSideView() )
		{
			if ( this._cursorAll )
			{
				var allRowsHeight = this.maxRows() * this.itemHeight();
				this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
				this.setTopRow(0);
			}
			else if ( this.isCursorVisible() )
			{
				var rect = this.itemRect(this.index());
				this.setCursorRect(rect.x, rect.y - this.lineHeight(), rect.width, this.lineHeight());
			}
			else
			{
				this.setCursorRect(0, 0, 0, 0);
			}
		}
		else
		{
			_Window_BattleActor_updateCursor.call(this);
		}
	};

	var _Window_BattleActor_drawItem = Window_BattleActor.prototype.drawItem;
	Window_BattleActor.prototype.drawItem = function(index)
	{
		if ( $gameSystem.isSideView() )
		{
			if ( index === this._index )
			{
				// 名前
				this.resetTextColor();
				var name = this.actor().name();
				var rect = this.itemRect(index);
				this.drawText(name, rect.x, rect.y - this.lineHeight(), rect.width, 'center');

				// カーソル
				if ( cursorEnable != 0 )
				{
					var p = 8;
					var w = 32;
					var bitmap = new Bitmap(rect.width+p*2, rect.height+p*2);
					this._cursorSprite.bitmap = bitmap;
					this._cursorSprite.move(rect.x-p, rect.y-p);
					bitmap.blt(this._cursorBitmap, 0, 0, w, w, 0,              0,               w, w);
					bitmap.blt(this._cursorBitmap, w, 0, w, w, bitmap.width-w, 0,               w, w);
					bitmap.blt(this._cursorBitmap, 0, w, w, w, 0,              bitmap.height-w, w, w);
					bitmap.blt(this._cursorBitmap, w, w, w, w, bitmap.width-w, bitmap.height-w, w, w);
				}
			}
		}
		else
		{
			_Window_BattleActor_drawItem.call(this, index);
		}
	};

	var _Window_BattleActor_select = Window_BattleActor.prototype.select;
	Window_BattleActor.prototype.select = function(index)
	{
		_Window_BattleActor_select.call(this, index);
		if ( $gameSystem.isSideView() )
		{
			this.refresh();
		}
	};

	//-------------------------------------------------------------------------
	/** Window_SelectedAction */
	function Window_SelectedAction()
	{
		this.initialize.apply(this, arguments);
	}

	Window_SelectedAction.prototype = Object.create(Window_Base.prototype);
	Window_SelectedAction.prototype.constructor = Window_SelectedAction;

	Window_SelectedAction.prototype.initialize = function()
	{
		var w = this.windowWidth();
		var h = this.windowHeight();
		Window_Base.prototype.initialize.call(this, 0, 0, w, h);
		this.createBackSprite();
		this.opacity = 0;
		this._item = null;
		this.hide();
	}

	Window_SelectedAction.prototype.windowWidth = function()
	{
		return Graphics.boxWidth;
	};

	Window_SelectedAction.prototype.windowHeight = function()
	{
		return this.fittingHeight(1);
	};

	Window_SelectedAction.prototype.createBackSprite = function()
	{
		this._backSprite = new Sprite();
		this._backSprite.bitmap = new Bitmap(this.width, this.height);
		this._backSprite.y = this.y;
		this.addChildToBack(this._backSprite);
	};

	Window_SelectedAction.prototype.showAction = function(action)
	{
		this.contents.clear();
		this._backSprite.bitmap.clear();
		var item = action.item();
		if ( item != null )
		{
			this.drawBackground();
			var iconBoxWidth = Window_Base._iconWidth + 4;
			var textWidth = this.textWidth(item.name);
			var x = (this.contentsWidth() - (iconBoxWidth + textWidth)) / 2;
			this.drawItemName(item, x, 0);
			this.show();
		}
	};

	Window_SelectedAction.prototype.drawBackground = function()
	{
		var rect = { x: 0, y: this.padding, width: this.width, height: this.lineHeight() };
		this._backSprite.bitmap.clear();
		this._backSprite.bitmap.paintOpacity = 64;
		this._backSprite.bitmap.fillRect(rect.x, rect.y, rect.width, rect.height, '#000000');
		this._backSprite.bitmap.paintOpacity = 255;
	};

	//-------------------------------------------------------------------------
	/** Scene_Battle */
	var _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
	Scene_Battle.prototype.createAllWindows = function()
	{
		_Scene_Battle_createAllWindows.call(this);
		this.createSelectedActionWindow();
	};

	Scene_Battle.prototype.createActorWindow = function()
	{
		if ( $gameSystem.isSideView() )
		{
			this._actorWindow = new Window_BattleActor(0, 0, this._statusWindow.height);
		}
		else
		{
			this._actorWindow = new Window_BattleActor(0, this._statusWindow.y, 0);
		}
		this._actorWindow.setHandler('ok',     this.onActorOk.bind(this));
		this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
		this.addWindow(this._actorWindow);
	};

	Scene_Battle.prototype.createEnemyWindow = function()
	{
		this._enemyWindow = new Window_BattleEnemy(0, 0, this._statusWindow.height);
		this._enemyWindow.setHandler('ok',     this.onEnemyOk.bind(this));
		this._enemyWindow.setHandler('cancel', this.onEnemyCancel.bind(this));
		this.addWindow(this._enemyWindow);
	};

	Scene_Battle.prototype.createSelectedActionWindow = function()
	{
		this._selectedActionWindow = new Window_SelectedAction();
		this.addWindow(this._selectedActionWindow);
	};

	var _Scene_Battle_selectActorSelection = Scene_Battle.prototype.selectActorSelection;
	Scene_Battle.prototype.selectActorSelection = function()
	{
		_Scene_Battle_selectActorSelection.call(this);
		var action = BattleManager.inputtingAction();
		this._selectedActionWindow.showAction(action);
	};

	var _Scene_Battle_onActorOk = Scene_Battle.prototype.onActorOk;
	Scene_Battle.prototype.onActorOk = function()
	{
		_Scene_Battle_onActorOk.call(this);
		this._selectedActionWindow.hide();
	};

	var _Scene_Battle_onActorCancel = Scene_Battle.prototype.onActorCancel;
	Scene_Battle.prototype.onActorCancel = function()
	{
		_Scene_Battle_onActorCancel.call(this);
		this._selectedActionWindow.hide();
	};

	var _Scene_Battle_selectEnemySelection = Scene_Battle.prototype.selectEnemySelection;
	Scene_Battle.prototype.selectEnemySelection = function()
	{
		_Scene_Battle_selectEnemySelection.call(this);
		var action = BattleManager.inputtingAction();
		this._selectedActionWindow.showAction(action);
	};

	var _Scene_Battle_onEnemyOk = Scene_Battle.prototype.onEnemyOk;
	Scene_Battle.prototype.onEnemyOk = function()
	{
		_Scene_Battle_onEnemyOk.call(this);
		this._selectedActionWindow.hide();
	};

	var _Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
	Scene_Battle.prototype.onEnemyCancel = function()
	{
		_Scene_Battle_onEnemyCancel.call(this);
		this._selectedActionWindow.hide();
	};

})();

