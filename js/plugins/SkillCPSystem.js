//
//  スキルCP制 ver1.08
//
// author yana
//

var Imported = Imported || {};
Imported['ySkillCPSystem'] = 1.08;

/*:
 * @plugindesc ver1.08/スキルを装備して使用するシステムを追加します。
 * @author Yana
 * 
 * @param Default Skill CP
 * @desc スキルに設定するCPの初期値です。
 * 0を指定するとセットしていなくても使用できます。
 * @default 0
 * 
 * @param Default Skill Set
 * @desc アクターのスキルセット数の初期値です。
 * @default 3
 * 
 * @param Default CP
 * @desc アクターのCPの初期値です。
 * @default 5
 * 
 * @param CP Name
 * @desc スキル装備画面で使用するCP部分の表示名です。
 * @default CP
 * 
 * @param Set Name
 * @desc スキル装備画面で使用するセット数部分の表示名です。
 * @default セット数
 * 
 * @param LvUp CP Rate
 * @desc レベルアップで上昇するCPの値です。
 * @default 0.3
 * 
 * @param LvUp Set Rate
 * @desc レベルアップで上昇するセット数の値です。
 * @default 0.05
 * 
 * @param No Equip Slot Name
 * @desc スキルをセットしていないスロットの表示名です。
 * @default ---------------------------
 * 
 * @param Set Point Gauge Color1
 * @desc セット数のゲージ色1です。
 * Window.pngの右下のインデックスで指定します。
 * @default 22
 * 
 * @param Set Point Gauge Color2
 * @desc セット数のゲージ色2です。
 * Window.pngの右下のインデックスで指定します。
 * @default 23
 * 
 * @param CP Gauge Color1
 * @desc CPのゲージ色1です。
 * Window.pngの右下のインデックスで指定します。
 * @default 28
 * 
 * @param CP Gauge Color2
 * @desc CPのゲージ色2です。
 * Window.pngの右下のインデックスで指定します。
 * @default 29
 * 
 * @param Add Menu Skill Setting
 * @desc メニュー画面にスキル設定の項目を追加するかの設定です。
 * true/falseで設定します。
 * @default true
 * 
 * @param Menu Skill Setting Title
 * @desc メニュー画面に表示するスキル設定の項目名です。
 * @default SkillEquip
 * 
 * @param Show Unsettable Skill
 * @desc セットしてないスキルをスキル画面に表示するかの設定です。
 * true/falseで設定します。
 * @default true
 * 
 * @param Unsetting Skill Color
 * @desc セットしてないスキルの表示色です。
 * Window.pngの右下のインデックスで指定します。
 * @default 4
 * 
 * @param No Cost Class Learn Skills
 * @desc 現在のクラスで習得するスキルをノーコスト化するかの設定です。
 * @default true
 * 
 * @help------------------------------------------------------
 *  注意
 * ------------------------------------------------------
 * 
 * このプラグインはPassiveSkillと同時に導入する場合、こちらを下に配置してください。
 *
 * ------------------------------------------------------
 *  プラグインコマンド
 * ------------------------------------------------------
 * ※スペースは必ず半角で入力してください。
 * 
 * ・ID番のアクターのスキル設定シーンを呼び出します。
 *  IDを省略すると、最後に呼び出されたアクターのスキル設定シーンが呼び出されます。
 * スキル設定シーン 呼び出し ID
 * SceneSkillEquip call ID
 * 
 * ------------------------------------------------------
 * 設定方法
 * ------------------------------------------------------
 * アクターのメモ欄に
 * <初期CP:x>
 * <DefaultCP:x>
 * のいずれかを記述すると、そのアクターの初期CPをxに設定可能です。
 * 
 * アクターのメモ欄に
 * <初期スキルセット数:x>
 * <DefaultSkillSet:x>
 * のいずれかを記述すると、そのアクターの初期スキルセット数をxに設定可能です。
 * 
 * スキルのメモ欄に
 * <CP:x>
 * と記述すると、そのスキルのセットに必要なCPをxに設定します。
 * また、
 * <同時セット不可:x,x,x,x,x>
 * <DisableSame:x,x,x,x,x>
 * のいずれかを記述すると、そのスキルはxで指定したIDのスキルと同時にセットすることができなくなります。
 * 
 * 武器や防具、クラスやステート、パッシブスキルなどの特徴オブジェクトのメモ欄に、
 * <最大CP:x>
 * <MaxCP:x>
 * のいずれかを記述すると、最大CPをx増加(減少)させる特徴に、
 * <スキルセット数:x>
 * <AddSetPoint:x>
 * のいずれかを記述すると、スキルセット数をx増加(減少)させる特徴にすることが可能です。
 * 
 * ------------------------------------------------------
 * 利用規約：特になし。素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 * 更新履歴:
 * ver1.08:
 * 最大CPを超えたスキルにカーソルを合わせるとエラーが発生していたバグを修正しました。
 * console.logを削除しました。
 * ver1.07:
 * 装備画面改造の名称変更に伴い、こちらも修正。
 * ver1.06:
 * 装備画面改造との併用化処理を追加。
 * ver1.05:
 * セットしていないと使用できないという仕様が攻撃、防御、アイテムにまで及んでいたバグを修正。
 * ver1.04:
 * 何も設定をせずに、入れて起動したときエラーが出るバグを修正。
 * 最大セット数が現在のセット数より少なくなったとき、Game_Actorのrefreshでエラーが発生するバグを修正。
 * ver1.03:
 * No Cost Class Learn Skillsがtrueのとき、エラーが発生するバグを修正。
 * ver1.02:
 * 特定の状況下でスタックエラーを起こすバグを修正。
 * CP0のスキルを自動でセットしていたバグを修正。
 * スキル設定シーンで装備中スキルのCPを表示するように変更。
 * 同時セット不可のスキルがスキル習得時に自動でセットされていたバグを修正。
 * ver1.01:
 * プラグインコマンドがエラーを出していたバグを修正。
 * プラグインコマンドにアクターIDを指定してシーンを呼び出す機能を追加。
 * ver1.00:
 * 公開。
 */

function Scene_SkillEquip() {
    this.initialize.apply(this, arguments);
}

(function(){
	var parameters = PluginManager.parameters('SkillCPSystem');
	var defaultSkillCP = Number(parameters['Default Skill CP'] || 0);
	var defaultSkillSet = Number(parameters['Default Skill Set'] || 3);
	var defaultCP = Number(parameters['Default CP'] || 5);
	var cpName = String(parameters['CP Name'] || 'CP');
	var setName = String(parameters['Set Name'] || 'セット数');
	var lvupCPRate = Number(parameters['LvUp CP Rate'] || 0.3);
	var lvupSetRate = Number(parameters['LvUp Set Rate'] || 0.05);
	var noEquipSlotName = String(parameters['No Equip Slot Name'] || '---------------------------');
	var setPointGaugeColor1 = Number(parameters['Set Point Gauge Color1'] || 22);
	var setPointGaugeColor2 = Number(parameters['Set Point Gauge Color2'] || 23);
	var cpGaugeColor1 = Number(parameters['CP Gauge Color1'] || 28);
	var cpGaugeColor2 = Number(parameters['CP Gauge Color2'] || 29);
	var addMenuSkillSetting = String(parameters['Add Menu Skill Setting'] || 'true') === 'true';
	var menuSkillSettingTitle = String(parameters['Menu Skill Setting Title'] || 'SkillEquip');
	var showUnsettableSkill = String(parameters['Show Unsettable Skill'] || 'true') === 'true';
	var unsettingSkillColor = Number(parameters['Unsetting Skill Color'] || 4);
	
	var noCostClassLearnSkills = String(parameters['No Cost Class Learn Skills']) === 'true';

	var _sCP_GInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_sCP_GInterpreter_pluginCommand.call(this, command, args);
		if (command === 'スキル設定シーン' || command === 'SceneSkillEquip') {
			switch (args[0]) {
			case '呼び出し':
			case 'call':
				this.callSceneSkillEquip(Math.floor(Number(args[1])));
				break;
			}
		}
	};
	
	Game_Interpreter.prototype.callSceneSkillEquip = function(actorId) {
		if(actorId > 0){ $gameParty._menuActorId = actorId };
		SceneManager.push(Scene_SkillEquip);
	};

	////////////////////////////////////////////////////////////////////////////////////	

	var _sCP_WMCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
	Window_MenuCommand.prototype.addOriginalCommands = function() {
		_sCP_WMCommand_addOriginalCommands.call(this);
		if (addMenuSkillSetting){
        	this.addCommand(menuSkillSettingTitle, 'skillSetting', true);
        }
	};

	var _sCP_SMenu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
	Scene_Menu.prototype.createCommandWindow = function() {
		_sCP_SMenu_createCommandWindow.call(this);
    	this._commandWindow.setHandler('skillSetting',   this.commandPersonal.bind(this));
	}
	var _sCP_SMenu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
	Scene_Menu.prototype.onPersonalOk = function() {
		_sCP_SMenu_onPersonalOk.call(this);
		if (this._commandWindow.currentSymbol() === 'skillSetting'){
        	SceneManager.push(Scene_SkillEquip);
		}
	};
	
	////////////////////////////////////////////////////////////////////////////////////
	
	Game_Actor.prototype.cp = function() {
		return this.capPoint();
	};
	
	Game_Actor.prototype.maxSkillSetPoint = function(){
		return Math.floor(this.defaultSkillSet() + ((this._level - 1) * lvupSetRate) + this.supSetPoint());
	};
	Game_Actor.prototype.maxCP = function(){
		return Math.floor(this.defaultCP() + ((this._level - 1) * lvupCPRate) + this.supCP());
	};
	Game_Actor.prototype.defaultSkillSet = function(){
		if (this._defaultSkillSet){ return this._defaultSkillSet }
		if ( !this.actor() ){ return 0 }
		if( this.actor().meta['初期スキルセット数'] ){ this._defaultSkillSet = Number(this.actor().meta['初期スキルセット数']) } 
		if( this.actor().meta['DefaultSkillSet'] ){ this._defaultSkillSet = Number(this.actor().meta['DefaultSkillSet']) }
		if( !this._defaultSkillSet ){ this._defaultSkillSet = defaultSkillSet }
		return this._defaultSkillSet;
	};
	Game_Actor.prototype.defaultCP = function(){
		if ( this._defaultCP ){ return this._defaultCP }
		if ( !this.actor() ){ return 0 }
		if ( this.actor().meta['初期CP'] ){ this._defaultCP = Number(this.actor().meta['初期CP']) } 
		if ( this.actor().meta['DefaultCP'] ){ this._defaultCP = Number(this.actor().meta['DefaultCP']) }
		if ( !this._defaultCP ){ this._defaultCP = defaultCP }
		return this._defaultCP;
		
	};
	Game_Actor.prototype.setPoint = function(){
		return Math.floor(this.skills().reduce(function(r,skill){
			if (!skill.setPoint){ DataManager.initSetPoint(skill) }
			if (this.isIncludeLearningSkills(skill.id)){ return r }
			return r + skill.setPoint;
		}.bind(this),0));
	};
	
	Game_Actor.prototype.capPoint = function(){
		return Math.floor(this.skills().reduce(function(r,skill){
			if (!skill.capPoint){ DataManager.initCapPoint(skill) }
			if (this.isIncludeLearningSkills(skill.id)){ return r }
			return r + skill.capPoint;
		}.bind(this),0));
	};
	
	Game_Actor.prototype.isIncludeLearningSkills = function(skillId) {
		if (!noCostClassLearnSkills){ return false } 
		return this.learningSkills().contains(skillId);
	};
	
	Game_Actor.prototype.learningSkills = function(){
		if (this._beforeClassId === this._classId) { return this._classLearnings }
		this._classLearnings = this.currentClass().learnings.reduce(function(r,learn){
			r.push(learn.skillId);
			return r;
		}.bind(this),[]);
		this._beforeClassId = this._classId;
		return this._classLearnings;
	};
	
	Game_Actor.prototype.supSetPoint = function(){
		return this.traitObjects().reduce(function(r,obj){
			if (!this._supSetPoint){ DataManager.initCPTrait(obj) };
			r += obj._supSetPoint;
			return r
		}.bind(this),0);
	};
	Game_Actor.prototype.supCP = function(){
		return this.traitObjects().reduce(function(r,obj){
			if (!this._supCapPoint){ DataManager.initCPTrait(obj) };
			r += obj._supCapPoint;
			return r
		}.bind(this),0);
	};
	Game_Actor.prototype.initSettingSkills = function(){
		this._settingSkills = new Array;
	};
	
	var _sCP_GActor_skills = Game_Actor.prototype.skills;
	Game_Actor.prototype.skills = function(){
		var skills = _sCP_GActor_skills.call(this);
		if (this._callMaster){ return skills }
		return skills.reduce(function(r,skill){
			if(!r.contains(skill) && this.isSettingSkill(skill)){
				r.push(skill);
			}
			return r
		}.bind(this),[]);
	};
	
	Game_Actor.prototype.settingSkills = function(){
		if (!this._settingSkills){ this.initSettingSkills() }
		var result = []
		for(var i=0;i<this._settingSkills.length;i++){
			var skillId = this._settingSkills[i]
			var skill = skillId ? $dataSkills[skillId] : null;
			result[i] = skill;
		}
		return result;
	};
	
	Game_Actor.prototype.isSettingSkill = function(skill){
		if (DataManager.isItem(skill)) { return true }
		if (skill.id === this.attackSkillId()) { return true }
		if (skill.id === this.guardSkillId()) { return true }
		if (!skill.capPoint){ DataManager.initCapPoint(skill) }
		if(!this._settingSkills){ this.initSettingSkills() };
		return (this.isNoCost(skill) || this._settingSkills.contains(skill.id));
	};
	
	Game_Actor.prototype.isNoCost = function(skill) {
		if (skill.capPoint < 1){ return true }
		if (!noCostClassLearnSkills){ return false }
		var learnings = this.currentClass().learnings;
		for (var i=0;i<learnings.length;i++) {
			if (learnings[i].skillId === skill.id){ return true }
		}
		return false;
	};
	
	Game_Actor.prototype.forceSetSkill = function(index, skill){
		if (skill){
			this._settingSkills[index] = skill.id;
		}else{
			this._settingSkills[index] = null;
		}
		this.refresh();
	};
		
	Game_Actor.prototype.setSkill = function(index, skill){
		this.forceSetSkill(index,skill);
	};
	
	if (Imported['yPassiveSkill']){
		var _sCP_GActor_isUsableSkill = Game_Actor.prototype.isUsableSkill;
		Game_Actor.prototype.isUsableSkill = function(skill) {
			return _sCP_GActor_isUsableSkill.call(this,skill) && this.isSettingSkill(skill);
		};
	}
	
	Game_Actor.prototype.unsettingSkills = function(){
		var result = []
		for (var i=0;i<this._skills.length;i++){
			if (!this._settingSkills.contains(this._skills[i])){
				var skill = $dataSkills[this._skills[i]];
				if (skill.capPoint > 0 && !this.isIncludeLearningSkills(skill.id)){
					result.push(this._skills[i])
				}
			}
		}
		return result;
	};
	
	Game_Actor.prototype.canUse = function(skill){
		return Game_Battler.prototype.canUse.call(this,skill) && this.isSettingSkill(skill);
	};
	
	var _sCP_GActor_learnSkill = Game_Actor.prototype.learnSkill;
	Game_Actor.prototype.learnSkill = function(skillId) {
		var flag = !this.isLearnedSkill(skillId);
    	_sCP_GActor_learnSkill.call(this,skillId);
    	if (flag){ this.autoSetSkill(skillId) }
	};
	
	Game_Actor.prototype.autoSetSkill = function(skillId) {
		var skill = $dataSkills[skillId];
		if (skill.capPoint === undefined){ DataManager.initCapPoint(skill) }
    	if (skill.capPoint === 0){ return }
    	if (!this.isSettable(skill)){ return }
		if (!skill.capPoint){ DataManager.initCapPoint(skill) }
		if (this.isSettingSkill(skill)){ return }
   		if ((skill.capPoint + this.capPoint()) <= this.maxCP()){
			if (!this._settingSkills){ this.initSettingSkills() };
    		if ((this._settingSkills.length < this.maxSkillSetPoint()) ||
    			(this._settingSkills.contains(null) || this._settingSkills.contains(undefined))){
    			var i = 0;
    			for(;i<this.maxSkillSetPoint();i++){
    				if ( i === this._settingSkills.length) { break }
    				if (this._settingSkills[i] === null) { break }
    				if (this._settingSkills[i] === undefined) { break }
    			}
    			this.setSkill(i,skill);
    		}
    	}
	};
	
	var _sCP_GActor_forgetSkill = Game_Actor.prototype.forgetSkill;
	Game_Actor.prototype.forgetSkill = function(skillId) {
		_sCP_GActor_forgetSkill.call(this,skillId);
		var index = this._settingSkills.indexOf(skillId);
		if (index >= 0){ this.setSkill(index,null) }
	};
	
	var _sCP_GActor_refresh = Game_Actor.prototype.refresh;
	Game_Actor.prototype.refresh = function(){
		_sCP_GActor_refresh.call(this);
		if (!this._settingSkills){ this.initSettingSkills() }
		if (this.capPoint() > this.maxCP()){
			for(var i=0;i<this._settingSkills.length;i++){
				if (this.capPoint() <= this.maxCP()){ break }
				this.setSkill(this._settingSkills.length-1-i,null);
			}
		}
		if (this.maxSkillSetPoint() < this._settingSkills.length) {
			var num = this._settingSkills.length - this.maxSkillSetPoint();
			this._settingSkills.splice(this.maxSkillSetPoint(),num);
		}
	};
	
	Game_Actor.prototype.isSettable = function(item,settingSkills) {
		if (!item){ return true }
		if (!item.capPoint){ DataManager.initSetPoint(item) }
		if (!item._disableSame){ DataManager.initDisableSame(item) }
		var sss = settingSkills ? settingSkills : this.settingSkills();
  		for (var i=0;i<sss.length;i++){
  			if (sss[i]){
  				var dItem = sss[i];
				if (!dItem._disableSame){ DataManager.initDisableSame(dItem) }
  				if (item._disableSame.contains(dItem.id)){ return false }
  				if (dItem._disableSame.contains(item.id)){ return false }
  			}
  		}
  		return true;
	};
	
	Game_Actor.prototype.isMaxCPOver = function(item){
		if (!item){ return false }
		if (item.capPoint > this.maxCP()){ return true }
		return false;
	};
	
	////////////////////////////////////////////////////////////////////////////////////
	
	DataManager.initSetPoint = function(skill){
		if (!skill.capPoint){ DataManager.initCapPoint(skill) }
		var defPoint = skill.capPoint > 0 ? 1 : 0;
		skill.setPoint = defPoint;
		if (skill.meta['セットポイント']){
			skill.setPoint = Number(skill.meta['セットポイント']);
		}else if ( skill.meta['setpoint'] ){
			skill.setPoint = Number(skill.meta['setpoint']);
		}
	};
	DataManager.initCapPoint = function(skill){
		skill.capPoint = skill.meta['CP'] ? Number(skill.meta['CP']) : defaultSkillCP;
	};
	
	DataManager.initCPTrait = function(obj){
		obj._supSetPoint = 0;
		obj._supCapPoint = 0;
		if (obj.meta['スキルセット数']){ obj._supSetPoint = Number(obj.meta['スキルセット数']) }
		if (obj.meta['AddSetPoint']){ obj._supSetPoint = Number(obj.meta['AddSetPoint']) }
		if (obj.meta['最大CP']){ obj._supCapPoint = Number(obj.meta['最大CP']) }
		if (obj.meta['MaxCP']){ obj._supCapPoint = Number(obj.meta['MaxCP']) }
	};
	
	DataManager.initDisableSame = function(obj){
		obj._disableSame = [];
		if (obj.meta['同時セット不可'] || obj.meta['DisableSame']){
			var ds = obj.meta['同時セット不可'] || obj.meta['DisableSame'];
			ds = ds.split(',');
			ds.forEach(function(d){ obj._disableSame.push(Number(d)) });
		}
	};
	
	////////////////////////////////////////////////////////////////////////////////////
	
	var _sPC_WSkillList_makeItemList = Window_SkillList.prototype.makeItemList;
	Window_SkillList.prototype.makeItemList = function() {
		_sPC_WSkillList_makeItemList.call(this);
		if ($gameParty.inBattle()){ return }
		if (!showUnsettableSkill) { return }
		if (this._actor){
			var unsettingSkills = this._actor.unsettingSkills();
			for(var i=0;i<unsettingSkills.length;i++){
				var skill = $dataSkills[unsettingSkills[i]];
				if (this.includes(skill)){ this._data.push(skill) }
			}
		}
	};
	
	Window_SkillList.prototype.drawItemName = function(item, x, y, width) {
    	width = width || 312;
    	if (item) {
        	var iconBoxWidth = Window_Base._iconWidth + 4;
        	this.resetTextColor();
        	if(!this._actor.isSettingSkill(item)){ this.changeTextColor(this.textColor(unsettingSkillColor)) }
        	this.drawIcon(item.iconIndex, x + 2, y + 2);
        	this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
    	}
	};
	
	//////////////////////////////////////////////////////////////////////////////////
	
	Scene_SkillEquip.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_SkillEquip.prototype.constructor = Scene_SkillEquip;

	Scene_SkillEquip.prototype.initialize = function() {
    	Scene_MenuBase.prototype.initialize.call(this);
	};

	Scene_SkillEquip.prototype.create = function() {
    	Scene_MenuBase.prototype.create.call(this);
    	this.createHelpWindow();
    	this.createStatusWindow();
    	this.createCPWindow();
   		this.createSlotWindow();
    	this.createItemWindow();
    	this.refreshActor();
	};

	Scene_SkillEquip.prototype.createStatusWindow = function() {
    	this._statusWindow = new Window_EquipStatus(0, this._helpWindow.height);
    	this.addWindow(this._statusWindow);
	};
	
	Scene_SkillEquip.prototype.createCPWindow = function() {
    	var wx = this._statusWindow.width;
    	var wy = this._helpWindow.height;
    	var ww = Graphics.boxWidth - this._statusWindow.width;
		this._cpWindow = new Window_CP(wx, wy, ww)
		this.addWindow(this._cpWindow);
	};

	Scene_SkillEquip.prototype.createSlotWindow = function() {
    	var wx = this._statusWindow.width;
    	var wy = this._helpWindow.height + this._cpWindow.height;
    	var ww = Graphics.boxWidth - this._statusWindow.width;
    	var wh = this._statusWindow.height - this._cpWindow.height;
    	this._slotWindow = new Window_SlotCP(wx, wy, ww, wh);
   		this._slotWindow.setHelpWindow(this._helpWindow);
    	this._slotWindow.setStatusWindow(this._statusWindow);
    	this._slotWindow.setHandler('ok',       this.onSlotOk.bind(this));
    	this._slotWindow.setHandler('cancel',   this.popScene.bind(this));
    	this._slotWindow.setHandler('pagedown', this.nextActor.bind(this));
    	this._slotWindow.setHandler('pageup',   this.previousActor.bind(this));
    	this.addWindow(this._slotWindow);
    	this._slotWindow.activate();
    	this._slotWindow.select(0);
	};

	Scene_SkillEquip.prototype.createItemWindow = function() {
    	var wx = 0;
    	var wy = this._statusWindow.y + this._statusWindow.height;
    	var ww = Graphics.boxWidth;
    	var wh = Graphics.boxHeight - wy;
    	this._itemWindow = new Window_SkillCP(wx, wy, ww, wh);
    	this._itemWindow.setHelpWindow(this._helpWindow);
    	this._itemWindow.setStatusWindow(this._statusWindow);
    	this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    	this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    	this._slotWindow.setItemWindow(this._itemWindow);
    	this._itemWindow.setSlotWindow(this._slotWindow);
    	this.addWindow(this._itemWindow);
	};

	Scene_SkillEquip.prototype.refreshActor = function() {
    	var actor = this.actor();
    	this._statusWindow.setActor(actor);
    	this._slotWindow.setActor(actor);
    	this._itemWindow.setActor(actor);
    	this._cpWindow.setActor(actor);
	};

	Scene_SkillEquip.prototype.onSlotOk = function() {
    	this._itemWindow.activate();
    	this._itemWindow.select(0);
	};
	
	Scene_SkillEquip.prototype.onItemOk = function() {
    	SoundManager.playEquip();
    	this.actor().setSkill(this._slotWindow.index(), this._itemWindow.item());
    	this._slotWindow.activate();
    	this._slotWindow.refresh();
    	this._itemWindow.deselect();
    	this._itemWindow.refresh();
    	this._statusWindow.refresh();
    	this._cpWindow.refresh();
	};

	Scene_SkillEquip.prototype.onItemCancel = function() {
    	this._slotWindow.activate();
    	this._itemWindow.deselect();
	};

	Scene_SkillEquip.prototype.onActorChange = function() {
    	this.refreshActor();
    	this._slotWindow.activate();
	};
	
	function Window_CP() {
    	this.initialize.apply(this, arguments);
	}

	//////////////////////////////////////////////////////////////////////////////////

	Window_CP.prototype = Object.create(Window_Base.prototype);
	Window_CP.prototype.constructor = Window_CP;

	Window_CP.prototype.initialize = function(x, y, width) {
		var height = this.lineHeight() + this.standardPadding() * 2;
    	Window_Base.prototype.initialize.call(this, x, y, width, height);
	};
	
	Window_CP.prototype.setActor = function(actor) {
		this._actor = actor;
		this.refresh();
	};
	
	Window_CP.prototype.refresh = function() {
		if ( !this._actor ){ return }
		this.createContents();
		var width = this.contentsWidth()/2;
		var color1 = this.textColor(setPointGaugeColor1);
		var color2 = this.textColor(setPointGaugeColor2);
		var color3 = this.textColor(cpGaugeColor1);
		var color4 = this.textColor(cpGaugeColor2);
		var text1 = setName;
		var text2 = cpName;
		var text3 = this._actor.setPoint() + '/' + this._actor.maxSkillSetPoint();
		var text4 = (this._actor.maxCP() - this._actor.capPoint()) + '/' + this._actor.maxCP();
		var rate1 = 1.0 - ((this._actor.maxSkillSetPoint() - this._actor.setPoint()) / this._actor.maxSkillSetPoint());
		var rate2 = 1.0 - (this._actor.capPoint() / this._actor.maxCP());
		this.drawGauge(0,0,width-16,rate1,color1,color2)
		this.drawGauge(width,0,width-16,rate2,color3,color4)
		this.drawText(text1,0,0,width);
		this.drawText(text3,0,0,width-16,'right');
		this.drawText(text2,width,0,width);
		this.drawText(text4,width,0,width-16,'right');
	};
	
	///////////////////////////////////////////////////////////////////////////////////////////////
	
	function Window_SlotCP() {
    	this.initialize.apply(this, arguments);
	}

	Window_SlotCP.prototype = Object.create(Window_EquipSlot.prototype);
	Window_SlotCP.prototype.constructor = Window_SlotCP;

	Window_SlotCP.prototype.initialize = function(x, y, width, height) {
    	Window_EquipSlot.prototype.initialize.call(this, x, y, width, height);
	};
	
	Window_SlotCP.prototype.maxItems = function() {
    	return this._actor ? this._actor.maxSkillSetPoint() : 0;
	};

	Window_SlotCP.prototype.item = function() {
    	return this._actor ? this._actor.settingSkills()[this.index()] : null;
	};

	Window_SlotCP.prototype.drawItem = function(index) {
    	if (this._actor) {
        	var rect = this.itemRectForText(index);
        	this.drawItemName(this._actor.settingSkills()[index], rect.x, rect.y,this.contentsWidth()-16);
    	}
	};
	Window_SlotCP.prototype.drawItemName = function(item, x, y, width) {
   		width = width || 312;
    	if (item) {
        	var iconBoxWidth = Window_Base._iconWidth + 4;
        	this.resetTextColor();
        	this.drawIcon(item.iconIndex, x + 2, y + 2);
        	this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
        	this.drawText(item.capPoint, width - 64, y, 64, 'right');
    	}else{
        	this.drawText(noEquipSlotName, x, y, width,'center');
    	}
	};
	
	///////////////////////////////////////////////////////////////////////////////////////////////
	
	function Window_SkillCP() {
    	this.initialize.apply(this, arguments);
	}

	Window_SkillCP.prototype = Object.create(Window_EquipItem.prototype);
	Window_SkillCP.prototype.constructor = Window_SkillCP;

	Window_SkillCP.prototype.initialize = function(x, y, width,height) {
    	Window_EquipItem.prototype.initialize.call(this, x, y, width, height);
	};
	
	Window_SkillCP.prototype.setSlotWindow = function(window) {
		this._slotWindow = window;
	};
	
	Window_SkillCP.prototype.makeItemList = function() {
    	if (this._actor) {
        	this._data = this._actor._skills.reduce(function(r,skillId) {
        		var skill = $dataSkills[skillId];
            	if (this.includes(skill)){ r.push(skill) }
            	return r;
        	}.bind(this),[]);
        	this._data.push(null);
    	} else {
        	this._data = [null];
    	}
	};
	
	Window_SkillCP.prototype.isEnabled = function(item) {
		if (!item){ return true }
		if (!this._actor){ return true }
		if (!item._disableSame){ DataManager.initDisableSame(item) }
		var sItem = this._slotWindow.item();
		var cp = sItem ? sItem.capPoint : 0;
		var settingSkills = this._actor.settingSkills();
		settingSkills.splice(this._slotWindow.index(),1,null);
		var f1 = (this._actor.maxCP() - (this._actor.capPoint() + item.capPoint - cp)) >= 0;
  		var f2 = this._actor.isSettable(item,settingSkills);
  		return f1 && f2;
	};
	
	Window_SkillCP.prototype.includes = function(item) {
    	return !this._actor.isSettingSkill(item);
	};
	
	Window_SkillCP.prototype.drawItemNumber = function(item, x, y, width) {
        this.drawText(item.capPoint, x, y, width, 'right');
    };
    
    Window_SkillCP.prototype.updateHelp = function() {
    	Window_ItemList.prototype.updateHelp.call(this);
    	if (this._actor && this._statusWindow) {
    		var actor = JsonEx.makeDeepCopy(this._actor);
        	if (!this._actor.isMaxCPOver(this.item())){ 
        		actor.forceSetSkill(this._slotId, this.item());
        	}
        	this._statusWindow.setTempActor(actor);
    	}
	};
	
	////////////////////////////////////////////////////////////////////////////////////
	
	if (Imported['EquipAndShopStatusR']){
	Scene_SkillEquip.prototype.createSlotWindow = function() {
    	var wx = this._statusWindow.width;
    	var wy = this._helpWindow.height + this._cpWindow.height;
    	var ww = Graphics.boxWidth - this._statusWindow.width;
    	var wh = 288 - this._cpWindow.height;
    	this._slotWindow = new Window_SlotCP(wx, wy, ww, wh);
   		this._slotWindow.setHelpWindow(this._helpWindow);
    	this._slotWindow.setStatusWindow(this._statusWindow);
    	this._slotWindow.setHandler('ok',       this.onSlotOk.bind(this));
    	this._slotWindow.setHandler('cancel',   this.popScene.bind(this));
    	this._slotWindow.setHandler('pagedown', this.nextActor.bind(this));
    	this._slotWindow.setHandler('pageup',   this.previousActor.bind(this));
    	this._slotWindow.setHandler('right',	this.nextPage.bind(this));
    	this._slotWindow.setHandler('left',	   	this.prevPage.bind(this));
    	this.addWindow(this._slotWindow);
    	this._slotWindow.activate();
    	this._slotWindow.select(0);
	};

	Scene_SkillEquip.prototype.createItemWindow = function() {
    	var wx = this._statusWindow.width;
    	var wy = this._slotWindow.y + this._slotWindow.height;
    	var ww = this._slotWindow.width;
    	var wh = Graphics.boxHeight - wy;
    	this._itemWindow = new Window_SkillCP(wx, wy, ww, wh);
    	this._itemWindow.setHelpWindow(this._helpWindow);
    	this._itemWindow.setStatusWindow(this._statusWindow);
    	this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    	this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    	this._itemWindow.setHandler('right',	this.nextPage.bind(this));
    	this._itemWindow.setHandler('left',	   	this.prevPage.bind(this));
    	this._slotWindow.setItemWindow(this._itemWindow);
    	this._itemWindow.setSlotWindow(this._slotWindow);
    	this.addWindow(this._itemWindow);
	};
		
	var _SSEquip_nextActor = Scene_SkillEquip.prototype.nextActor;
	Scene_SkillEquip.prototype.nextActor = function() {
    	_SSEquip_nextActor.call(this);
    	this._statusWindow._pageIndex = 0;
	};

	var _SSEquip_previousActor = Scene_SkillEquip.prototype.previousActor;
	Scene_SkillEquip.prototype.previousActor = function() {
		_SSEquip_previousActor.call(this);
    	this._statusWindow._pageIndex = 0;
	};

	
	var _SSEquip_onSlotOk = Scene_SkillEquip.prototype.onSlotOk;
	Scene_SkillEquip.prototype.onSlotOk = function() {
		_SSEquip_onSlotOk.call(this);
		this._statusWindow._pageIndex = 0;
		this._statusWindow.refresh();
	};
	
	var _SSEquip_onSlotCancel = Scene_SkillEquip.prototype.onSlotCancel;
	Scene_SkillEquip.prototype.onSlotCancel = function() {
		_SSEquip_onSlotCancel.call(this);
		this._statusWindow._pageIndex = 0;
		this._statusWindow.refresh();
	};
	
	Scene_SkillEquip.prototype.nextPage = function() {
		this._statusWindow.nextPage();
	};
	
	Scene_SkillEquip.prototype.prevPage = function() {
		this._statusWindow.prevPage();
	};
	}
}());
