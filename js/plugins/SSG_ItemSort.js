/*:
 * @plugindesc [SSG] Item Sort: Sort your item by weighted value
 * <SSG_ItemSort>
 * version 1.0.1
 * @author Heartbreak61
 * 
 * @help
 * =============================================================================
 *                      [Simple Stupid Gaming] Item Sort
 *
 *                                 ver 1.0.1
 *                              by Heartbreak61
 * ----------------------------------------------------------------------------
 * 
 * The way RPG Maker MV sort things is by their id. Usually we create our skill
 * from weaker ones to stronger ones. It means that our weaker skills will
 * always be displayed before our stronger ones. And for some occasion, this is
 * counter intuitive.
 * 
 * This simple-stupid plugin will sort your skills, items, and equipments by
 * user's defined value. It will try to sort based by first Sort Value, then
 * objects with the same first value will be sorted by second Sort Value.
 * Finally, if there are object with same first and second value, they will
 * be sorted by ID.
 * 
 * ============================================================================
 *                          SPECIFIC ITEM/SKILL SETTING
 * ----------------------------------------------------------------------------
 * Specify global sort value using this plugin parameter, then you can manually
 * attach values to your skills, items, or equipments.
 *
 * To set individual values, please write
 *
 *     <sort_value: Number, Number>
 *
 * on items/skills/equipments note.
 * 
 * Example
 *     Item 1 not set (the value will be replaced by global value 100, 100)
 *     Item 2 <sort_value: 101, 103>
 *     Item 3 <sort_value: 100, 100>
 *     Item 4 <sort_value: 100, 103>
 *     Item 5 <sort_value: 900, 1>
 *     Item 6 <sort_value: 900, 1>
 *
 * Using descending mode, the order on the Item Screen will be something like
 * this:
 *
 *     Item 5			Item 6
 *     Item 2			Item 4
 *     Item 1			Item 3
 *
 * ============================================================================
 *                                 TERM OF USE
 * ----------------------------------------------------------------------------
 * Free to use on both commercial or non-commercial project as long as you
 * give credits to me. ;)
 *
 * ============================================================================
 *                                 CHANGELOG
 * ----------------------------------------------------------------------------
 * 2015.11.15 ver 1.0.0
 *   - Finished the script
 *
 * 2015.11.28 ver 1.0.1
 *   - Added: documentation on each function
 *   - Changed: Moved some function to SSG_Heartbreak variables
 *
 *
 * ============================================================================
 *                                 END OF HELP
 * ============================================================================
 * @param Default Sort Value 1
 * @desc Default sort value 1 for items, skills, and equipments
 * @default 100
 *
 * @param Default Sort Value 2
 * @desc Default sort value 2 for items, skills, and equipments
 * @default 100
 *
 * @param Sort Mode
 * @desc Ascending or descending for item that 'sort value'.  Sort by ID will always be ascending.
 * @default descending
 * 
 */

/**
 * "Register" this plugin on a variable called Imported, which is the way
 * many scripter check for other's script existence.
 */
var Imported = Imported || {};
Imported['SSG Item Sort'] = '1.0.1';

/**
 * Create new object SSG_Heartbreak which I intend to use on most of my future script
 */
var SSG_Heartbreak = SSG_Heartbreak || {};
(function() {
	'use strict';

	/**
	 * Retrieve all plugin parameters and declaring parameters
	 */
	var parameters = $plugins.filter(function(plugin) {
		return plugin.description.indexOf('<SSG_ItemSort>') != -1;
	})[0].parameters;
	var sV = Number(parameters['Default Sort Value 1'] || 100);
	var sVV = Number(parameters['Default Sort Value 2'] || 100);
	var sM = String(parameters['Sort Mode'] || 'descending');
	var regexp = /(\d+)\s*[,;]?\s*(\d*)/;

	/**
	 * Item sort formula.
	 * Formula is calculated first by comparing first value. If the comparation
	 * return 0 (both item a and b have same value), then we compare second value.
	 * If it's still return 0, we use default RM way to sort it by ID (which
	 * normally won't return 0)
	*/
	SSG_Heartbreak.itemSort = function(list) {
		list.sort(function(a, b) {
			var result;
			if (sM.toLowerCase() === 'ascending') {
				result = a.sortValue[0] - b.sortValue[0];
				if (result === 0) {
					result = a.sortValue[1] - b.sortValue[1];
				}
			} else {
				result = b.sortValue[0] - a.sortValue[0];
				if (result === 0) {
					result = b.sortValue[1] - a.sortValue[1];
				}
			}
			if (result === 0) {	
				result = a.id - b.id;
			}
			return result;
		})
	};

	/**
	 * Load meta and store it on each object's properties called sortValue
	 * It will be on our sort formula everytime window containing item list
	 * or skill list is created
	 */
	SSG_Heartbreak.loadSortValue = function(object) {
		for (var i = 0 in object) {
			if (!object[i]) {continue;}
			if (!object[i].meta){continue;}
			if (!!object[i].meta.sort_value) {
				var str = object[i].meta.sort_value;
				var found = str.match(regexp);
				var one = Number(found[1]);
				var two = Number(found[2] || sVV);
				object[i].sortValue = [one, two];
			} else {
				object[i].sortValue = [sV, sVV];
			}
		}
	}
	
	/**
	 * Start loading Item's meta.
	 * This step is executed after "original" DataManager.onLoad executed. That
	 * way, we will have our $dataSkills, $dataItems, $dataWeapons, and $dataArmors
	 * already set by our "original" function.
	 */
	var _DataManager_onLoad = DataManager.onLoad;
	DataManager.onLoad = function(object) {
		_DataManager_onLoad.call(this, object);
		var ary = [$dataSkills, $dataItems, $dataWeapons, $dataArmors];
		if (ary.contains(object)) {
			SSG_Heartbreak.loadSortValue(object);
		}
	};

	/**
	 * Run item sort on window skill list.
	 */
	var _Window_SkillList_makeItemList = Window_SkillList.prototype.makeItemList;
	Window_SkillList.prototype.makeItemList = function() {
		_Window_SkillList_makeItemList.call(this);
		if (this._data.length > 0) {SSG_Heartbreak.itemSort(this._data);}
	};

	/**
	 * Run item sort on window item list. Weapon and armor have null value at the end
	 * of array. It serve as a way for player to unequip things. Since it's always
	 * on the end of array, then we can safely pop the list.
	 */
	var _Window_ItemList_makeItemList = Window_ItemList.prototype.makeItemList;
	Window_ItemList.prototype.makeItemList = function() {
		_Window_ItemList_makeItemList.call(this);
		if (this._data.length > 0) {
			var arr = this._data.slice(0);
			if (arr.contains(null)) {arr.pop();}
			SSG_Heartbreak.itemSort(arr);
			if (this._data.contains(null)) {arr.push(null);}
			this._data = arr.slice(0);
		}
	};
	
})();