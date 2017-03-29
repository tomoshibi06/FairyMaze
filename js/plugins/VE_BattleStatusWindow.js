/*
 * ==============================================================================
 * ** Victor Engine MV - Battle Status Window
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2016.04.05 > First release.
 *  v 1.01 - 2016.04.10 > Fixed crash at battle end.
 *                      > Fixed issue with background image not disappearing.
 *                      > Adde back opacity and frame opacity plugin parameters.
 *  v 1.02 - 2016.04.30 > Compatibility with Basic Module 1.19.
 *  v 1.03 - 2016.05.12 > Fixed issue with target window position.
 *                      > Added more custom code Plugin Parameters.
 *  v 1.04 - 2016.05.15 > Fixed issue with 'unexpected token'.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Battle Status Window'] = '1.04';

var VictorEngine = VictorEngine || {};
VictorEngine.BattleStatusWindow = VictorEngine.BattleStatusWindow || {};

(function() {

	VictorEngine.BattleStatusWindow.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function() {
		VictorEngine.BattleStatusWindow.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Battle Status Window', 'VE - Basic Module', '1.20');
	};

	VictorEngine.BattleStatusWindow.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function(name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.BattleStatusWindow.requiredPlugin.call(this, name, required, version)
		};
	};
	
})();

/*:
 * ------------------------------------------------------------------------------
 * @plugindesc v1.04 - Customize the Battle Status Window.
 * @author Victor Sant
 *
 * @param == Window Layout ==
 * @default ================================================
 *
 * @param Window Lines
 * @desc Number of lines the status window have.
 * Default: 4 (allows script code)
 * @default 4
 *
 * @param Window Columns
 * @desc Number of columns the status window have.
 * Default: 1 (allows script code)
 * @default 1
 *
 * @param == Window Display ==
 * @default ================================================
 *
 * @param Window X
 * @desc Status window X position.
 * Default: boxWidth - width (allows script code)
 * @default boxWidth - width
 *
 * @param Window Y
 * @desc Status window Y position.
 * Default: boxHeight - height (allows script code)
 * @default boxHeight - height
 *
 * @param Window Width
 * @desc Status window width.
 * Default: width (allows script code)
 * @default width
 *
 * @param Window Height
 * @desc Status window height.
 * Default: height (allows script code)
 * @default height
 *
 * @param Window Back Opacity
 * @desc Status window back opacity.
 * Default: this.standardBackOpacity() (allows script code)
 * @default this.standardBackOpacity()
 *
 * @param Window Frame Opacity
 * @desc Status window frame opacity.
 * Default: 255 (allows script code)
 * @default 255
 *
 * @param Window Movement
 * @desc Slide the status window during command input.
 * Default: 96 (Numeric, can be negative)
 * @default 96
 *
 * @param Window Background
 * @desc Background image shown behind the window.
 * Filename (leave blank for no background)
 * @default @@
 *
 * @param Window Background X
 * @desc Background image offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Window Background Y
 * @desc Background image offset Y.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param == Content Setup ==
 * @default ================================================
 *
 * @param Horizontal Centralize
 * @desc Centralize content horizontally.
 * true - ON     false - OFF
 * @default false
 *
 * @param Vertical Centralize
 * @desc Centralize content vertically.
 * true - ON     false - OFF
 * @default false
 *
 * @param Content Offset X
 * @desc Content position offset X.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Content Offset Y
 * @desc Content position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Content Background
 * @desc Background image for the window content.
 * Filename (leave blank for no background)
 * @default @@
 *
 * @param Content Back X
 * @desc Descriptigin
 * @desc Content image position offset X.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Content Back Y
 * @desc Content image position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param == Active Setup ==
 * @default ================================================
 *
 * @param Active Select
 * @desc Show default cursor on active battler.
 * true - ON     false - OFF
 * @default true
 *
 * @param Active Offset X
 * @desc Active battler content offset X.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Active Offset Y
 * @desc Active battler content offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Active Background
 * @desc Background image for the content when the actor is active.
 * Filename (leave blank for no background)
 * @default @@
 *
 * @param Active Back X
 * @desc Background image position offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Active Back Y
 * @desc Background image position offset Y.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param == Faces Setup ==
 * @default ================================================
 *
 * @param Show Faces
 * @desc Show faces for each actor on the status window.
 * true - ON     false - OFF
 * @default false
 *
 * @param Face Sufix
 * @desc Add a sufix for face graphics shown in battle,
 * Sufix (leave blank for no sufix)
 * @default @@
 *
 * @param Face Width
 * @desc Face display width
 * Default: 144 (allows script code)
 * @default 144
 *
 * @param Face Height
 * @desc Face display height
 * Default: 144 (allows script code)
 * @default 144
 *
 * @param Face Offset X
 * @desc Face image position offset X.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Face Offset Y
 * @desc Face image position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param == Name Display ==
 * @default ================================================
 *
 * @param Show Name
 * @desc Show actor name on the status window.
 * true - ON     false - OFF
 * @default true
 *
 * @param Name Offset X
 * @desc Name display position offset X.
 * Default: 6 (allows script code)
 * @default 6
 *
 * @param Name Offset Y
 * @desc Name display position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Name Fontface
 * @desc Name display font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Name Fontsize
 * @desc Name display font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Name Color
 * @desc Name display font color.
 * Default: this.hpColor(actor) (allows script code)
 * @default this.hpColor(actor)
 *
 * @param == States Display ==
 * @default ================================================
 *
 * @param Show States
 * @desc Show actor states icons on the status window.
 * true - ON     false - OFF
 * @default true
 *
 * @param States Max Icons
 * @desc Max number of icons displayed on the window.
 * Default: 2 (allows script code)
 * @default 2
 *
 * @param States Offset X
 * @desc States display position offset X.
 * Default: 156 (allows script code)
 * @default 156
 *
 * @param States Offset Y
 * @desc States display position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param == Action Icon ==
 * @default ================================================
 *
 * @param Show Action Icon
 * @desc Show icon for the action selected on the status window.
 * true - ON     false - OFF
 * @default false
 *
 * @param No Action Icon
 * @desc Icon id for when the actor have no action selected.
 * Default: 16 (Numeric, use 0 for no icon)
 * @default 16
 *
 * @param Action Offset X
 * @desc Action icon display position offset X.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Action Offset Y
 * @desc Action icon display position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param == HP display ==
 * @default ================================================
 *
 * @param Show HP Gauge
 * @desc Show HP gauge on the status window.
 * true - ON     false - OFF
 * @default true
 *
 * @param HP Gauge Width
 * @desc Width of the HP Gauge
 * Default: 108 (allows script code)
 * @default 108
 *
 * @param HP Offset X
 * @desc HP display position offset X.
 * Default: 252 (allows script code)
 * @default 252
 *
 * @param HP Offset Y
 * @desc HP display position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param HP Text Fontface
 * @desc HP text display font name. (leave blank for no text)
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param HP Text Fontsize
 * @desc HP text display font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param HP Text Color
 * @desc HP text display font coloe.
 * Default: this.systemColor() (allows script code)
 * @default this.systemColor()
 *
 * @param Current HP Fontface
 * @desc Current HP digits display font name. (leave blank for no
 * text)   Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Current HP Fontsize
 * @desc Current HP digits display font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Current HP Color
 * @desc Current HP digits display font color.
 * Default: this.hpColor(actor)
 * @default this.hpColor(actor)
 *
 * @param Max HP Fontface
 * @desc Max HP digits display font name. (leave blank for no text)
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Max HP Fontsize
 * @desc Max HP digits display font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Max HP Color
 * @desc Max HP digits display font color.
 * Default: this.normalColor() (allows script code)
 * @default this.normalColor()
 *
 * @param == MP display ==
 * @default ================================================
 *
 * @param Show MP
 * @desc Show MP value and gauge on the status window.
 * true - ON     false - OFF
 * @default true
 *
 * @param Show MP Gauge
 * @desc Show MP gauge on the status window.
 * true - ON     false - OFF
 * @default true
 *
 * @param MP Gauge Width
 * @desc Width of the MP Gauge
 * Default: 96 (allows script code)
 * @default 96
 *
 * @param MP Offset X
 * @desc MP display position offset X.
 * Default: 375 (allows script code)
 * @default 375
 *
 * @param MP Offset Y
 * @desc MP display position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param MP Text Fontface
 * @desc MP text display font name. (leave blank for no text)
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param MP Text Fontsize
 * @desc MP text display font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param MP Text Color
 * @desc MP text display font color.
 * Default: this.systemColor() (allows script code)
 * @default this.systemColor()
 *
 * @param Current MP Fontface
 * @desc Current MP digits display font name. (leave blank for no
 * text)   Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Current MP Fontsize
 * @desc Current MP digits display font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Current MP Color
 * @desc Current MP digits display font color.
 * Default: this.mpColor(actor) (allows script code)
 * @default this.mpColor(actor)
 *
 * @param Max MP Fontface
 * @desc Max MP digits display font name. (leave blank for no text)
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Max MP Fontsize
 * @desc Max MP digits display font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Max MP Color
 * @desc Max MP digits display font color.
 * Default: this.normalColor() (allows script code)
 * @default this.normalColor()
 *
 * @param == TP display ==
 * @default ================================================
 *
 * @param Max TP
 * @desc Max TP value for the actors.
 * Default: 100 (allows script code)
 * @default 100
 *
 * @param Show TP
 * @desc Show TP value and gauge on the status window.
 * true - ON     false - OFF
 * @default true
 *
 * @param Show TP Gauge
 * @desc Show TP gauge on the status window.
 * true - ON     false - OFF
 * @default true
 *
 * @param TP Gauge Width
 * @desc Width of the TP Gauge
 * Default: 96 (allows script code)
 * @default 96
 *
 * @param TP Offset X
 * @desc TP display position offset X.
 * Default: 485 (allows script code)
 * @default 485
 *
 * @param TP Offset Y
 * @desc TP display position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param TP Text Fontface
 * @desc TP text display font name. (leave blank for no text)
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param TP Text Fontsize
 * @desc TP text display font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param TP Text Color
 * @desc TP text display font color.
 * Default: this.systemColor() (allows script code)
 * @default this.systemColor()
 *
 * @param Current TP Fontface
 * @desc Current TP digits display font name. (leave blank for no
 * text)  Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Current TP Fontsize
 * @desc Current TP digits display font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Current TP Color
 * @desc Current TP digits display font color.
 * Default: this.tpColor(actor) (allows script code)
 * @default this.tpColor(actor)
 *
 * @param Max TP Fontface
 * @desc Max TP digits display font name. (leave blank for no text)
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Max TP Fontsize
 * @desc Max TP digits display font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Max TP Color
 * @desc Max TP digits display font color.
 * Default: this.normalColor() (allows script code)
 * @default this.normalColor()
 *
 * @param == Custom Code ==
 * @default ================================================
 *
 * @param Custom Code 1
 * @desc Custom code processed when the status window refresh.
 * Use to display values provided by other plugins.
 * @default @@
 *
 * @param Custom Code 2
 * @desc Custom code processed when the status window refresh.
 * Use to display values provided by other plugins.
 * @default @@
 *
 * @param Custom Code 3
 * @desc Custom code processed when the status window refresh.
 * Use to display values provided by other plugins.
 * @default @@
 *
 * @param Custom Code 4
 * @desc Custom code processed when the status window refresh.
 * Use to display values provided by other plugins.
 * @default @@
 *
 * @param Custom Code 5
 * @desc Custom code processed when the status window refresh.
 * Use to display values provided by other plugins.
 * @default @@
 *
 * @param Custom Code 6
 * @desc Custom code processed when the status window refresh.
 * Use to display values provided by other plugins.
 * @default @@
 *
 * @param Custom Code 7
 * @desc Custom code processed when the status window refresh.
 * Use to display values provided by other plugins.
 * @default @@
 *
 * @param Custom Code 8
 * @desc Custom code processed when the status window refresh.
 * Use to display values provided by other plugins.
 * @default @@
 *
 * @param Custom Code 9
 * @desc Custom code processed when the status window refresh.
 * Use to display values provided by other plugins.
 * @default @@
 *
 * @param Custom Code 10
 * @desc Custom code processed when the status window refresh.
 * Use to display values provided by other plugins.
 * @default @@
 *
 * ------------------------------------------------------------------------------
 * @help 
 * ------------------------------------------------------------------------------
 *
 *  Before going ahead with the plugin instructions I must warn something about
 *  this plugin. While this plugin offers a lot of options, almost no setup will
 *  be automated. So if you make any change to the layout, you will need to setup
 *  the offset of each information **manually**. This plugin requires a lot of
 *  trial-and-error to get everything in position. There is no shortcut.
 *
 *  If you expect just to copy and paste, and change a couple of values to have
 *  this plugin to make heavy changes to the layout, I suggest looking for
 *  another, because this one will require a LOT of effort.
 *
 *  This plugin also have a heavy processing during the window refresh, plugins
 *  poorly designed that calls the battle status window refresh more than needed
 *  might cause lag. If you experience too much lag while using this plugin, it's
 *  probably because another plugin is refreshing the window more than needed.
 *
 * ------------------------------------------------------------------------------
 * Actors and Classes Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <hide mp display>
 *   Hides the MP display for the actor on the battle status window.
 *
 * ---------------
 *
 *  <hide tp display>
 *   Hides the TP display for the actor on the battle status window.
 *
 * ---------------
 *
 *  <mp display>
 *   x = code
 *   y = code
 *   width = code
 *  <mp display>
 *   Changes the MP display for the actor.
 *    x : offset X.
 *    y : offset Y.
 *    width : gauge width.
 *
 * ---------------
 *
 *  <tp display>
 *   x = code
 *   y = code
 *   width = code
 *  <tp display>
 *   Changes the TP display for the actor.
 *    x : offset X.
 *    y : offset Y.
 *    width : gauge width.
 *
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  - MP and TP display notetags
 *  On the codes for the notetags, you can use "actor" to refer for the actor,
 *  "rect" to get the rectange data that contains the actor's info and 'index' to
 *  get the actor index on the party. Any other valid code for basic windows are
 *  also valid.
 *  You must add a code for each value and all must return a numeric values.
 *
 * ---------------
 *
 *  - Plugin Parameters Setup
 *  Most of the setup for this plugin is made through plugin parameters.
 *  Several of those plugin parameters allows the use of script codes. If this is
 *  the case, you can use any valid code for basic windows.
 *
 * ---------------
 *
 *  - Window Layout
 *  The 'Window Layout' plugin parameters changes how the actor's parameters
 *  display will be organized on the status window. By default it's show as 4
 *  lines. You can change the number of lines and columns for the display.
 *
 *  - Window Lines and Columns
 *  You can use script codes that returns numeric values as the value for the
 *  'Window Lines' and 'Window Columns' values
 *
 * ---------------
 *
 *  - Window Display
 *  The 'Window Display' plugin parameters setups the window postion, size,
 *  opacity and allows you to set a background image for the window.
 * 
 *  - Window Position and Size
 *  The parameters 'Window X' and 'Window Y' defines the window position and
 *  the parameters 'Window Width' and 'Window Height' defines the size.
 *  You can use script codes that returns numeric values as the value for them.
 *
 *  You can use 'boxWidth' to get the screen width, You can use 'boxHeight' to
 *  get the screen height, 'width' to get the default RMMV window width and
 *  'height' for the default window height as the code.
 * 
 *  - Window Movement
 *  The 'Window Movement' makes the window slide while inputing commands, leave
 *  the value 0 for no movement, negative values will make the window slide 
 *  left when the command window is open.
 * 
 *  - Window Background
 *  The 'Window Background' is placed behind the window itself. It's advised to
 *  lower the opacity, otherwise the window will cover the image. You can adjust
 *  it's position with the parameters 'Window Background X' and 
 *  'Window Background Y'.
 *  The image graphic should be placed on the folder 'img/system/'
 *
 * ---------------
 *
 *  - Content Setup
 *  The 'Content Setup' plugin parameters controls the global position of each
 *  actor data display.
 *
 *  - Content Offset
 *  The parameters 'Content Offset X' and 'Content Offset Y' can be used to 
 *  adjust the position of the content. You can use script codes that returns
 *  numeric values as the value for the 'Content Offset X' and 
 *  'Content Offset Y' values.
 *
 *  - Content Background
 *  The 'Content Background' is placed behind the actor data, but above the 
 *  windowskin. The image is shown for each actor in the party. You can adjust
 *  the images offset with the parameters 'Content Back X' and 'Content Back Y'.
 *  The image graphic should be placed on the folder 'img/system/'
 *
 * ---------------
 *
 *  - Active Setup
 *  The 'Active Setup' plugin parameters changes some behavior of the display 
 *  while selecting actions for an actor.
 *
 *  - Active Select
 *  The parameter 'Active Select' defines if the current actor content in the
 *  window will be highligthed by the default cursor while he is active.
 *
 *  - Active Offset
 *  The parameters 'Active Offset X' and 'Active Offset Y' changes the offset of 
 *  the actor content while he is active.
 *
 *  - Active Background
 *  The 'Active Background' is placed behind the actor data, but above the 
 *  windowskin. If you're using the 'Content Background', it will replace the
 *  content image while the actor is active.  You can adjust the images offset
 *  with the parameters 'Active Back X' and 'Active Back Y'.
 *
 * ---------------
 *
 *  - Face Setup
 *  The 'Face Setup' plugin parameters allows you to display faces for the
 *  actors on the battle status window. The face is displayed bellow all the
 *  actor information, but above the background images, if using them.
 *
 *  - Face Sufix
 *  The parameter 'Face Sufix' set a sufix for the actor battle face, this
 *  can be used if you want the faces displayed on battle to be different 
 *  from the faces used everywhere else. The face must have the same filename
 *  as the original face + the sufix. For example, if you set the sufix [battle]
 *  and have a face named 'Actor1' the battle face should be 'Actor1[battle]'
 *  The index for the face is not changed, keep that in mind while formating the
 *  battle faces.
 *
 *  - Face Offset and Size
 *  The parameters 'Face Offset X' and 'Face Offset Y' defines the face offset
 *  position and the parameters 'Face Width' and 'Face Height' defines the size.
 *  You can use script codes that returns numeric values as the value for them.
 *  
 * ---------------
 *
 *  - Name Display
 *  The 'Name Display' plugin parameters controls actor's name display.
 *
 *  - Name Offset
 *  The parameters 'Name Offset X' and 'Name Offset Y' defines the name offset
 *  position.
 *  You can use script codes that returns numeric values as the value for them.
 *
 *  - Name Fontface
 *  The parameter 'Name Fontface' defines the font name for the name display.
 *  You can use script codes that returns a string with the fontname se the
 *  value for it. 
 *
 *  - Name Fontsize
 *  The parameter 'Name Fontsize' defines the font size for the name display.
 *  You can use script codes that returns numeric values as the value for it. 
 *
 *  - Name Color
 *  The parameter 'Name Color' defines the font color for the name display.
 *  The color must be either a hex color code (#000000) or a script code
 *  that returns a color value. If using the plugin 'SFonts' only the codes
 *  will work (hex codes will not work).
 * 
 * ---------------
 *
 *  - States Display
 *  The 'States Display' plugin parameters controls actor's states icons display.
 *
 *  - States Icons
 *  The parameter 'States Max Icons' defines the max number of icons displayed.
 *  You can use script codes that returns numeric values as the value for it. 
 *
 *  - States Offset
 *  The parameters 'States Offset X' and 'States Offset Y' defines the states
 *  icons offset position.
 *  You can use script codes that returns numeric values as the value for them.
 * 
 * ---------------
 *
 *  - Action Icon
 *  The 'Action Icon' plugin parameters allows you to display the icon for the
 *  action currently selected by the actor.
 *
 *  - No Action Icon
 *  The parameter 'No Action Icon' defines the Id for the icon used when no
 *  action is selected.
 *
 *  - Action Offset
 *  The parameters 'Action Offset X' and 'Action Offset Y' defines the action 
 *  icon offset position.
 *  You can use script codes that returns numeric values as the value for them.
 * 
 * ---------------
 *
 *  - HP display
 *  The 'HP Display' plugin parameters controls the actor's hp display.
 *
 *  - Show HP Gauge
 *  The parameter 'Show HP Gauge' defines if the HP gauge will be shown, this
 *  only affect the gauge, the HP text and digits are shown regardless of this.
 *
 *  - HP Gauge Width
 *  The parameter 'HP Gauge Width' defines the hp gauge width and also the space
 *  used to draw the hp text and digits. So, even if the Hp gauge is hidden, you
 *  should keep the gauge width value set.
 *  You can use script codes that returns numeric values as the value for it.
 *
 *  - HP Offset
 *  The parameters 'HP Offset X' and 'HP Offset Y' defines the hp display offset
 *  position.
 *  You can use script codes that returns numeric values as the value for them.
 * 
 * ---------------
 *
 *  - HP Text Fontface
 *  The parameter 'HP Text Fontface' defines the font name for the hp text
 *  display.
 *  You can use script codes that returns a string with the fontname se the
 *  value for it. 
 *
 *  - HP Text Fontsize
 *  The parameter 'HP Text Fontsize' defines the font size for the hp text
 *  display.
 *  You can use script codes that returns numeric values as the value for it. 
 *
 *  - HP Text Color
 *  The parameter 'HP Text Color' defines the font color for the hp text display.
 *  The color must be either a hex color code (#000000) or a script code
 *  that returns a color value. If using the plugin 'SFonts' only the codes
 *  will work (hex codes will not work).
 * 
 * ---------------
 *
 *  - Current HP Fontface
 *  The parameter 'Current HP Fontface' defines the font name for the current hp
 *  digits display.
 *  You can use script codes that returns a string with the fontname se the
 *  value for it. 
 *
 *  - Current HP Fontsize
 *  The parameter 'Current HP Fontsize' defines the font size for the current hp
 *  digits display.
 *  You can use script codes that returns numeric values as the value for it. 
 *
 *  - Current HP Color
 *  The parameter 'Current HP Color' defines the font color for the current hp
 *  digits display.
 *  The color must be either a hex color code (#000000) or a script code
 *  that returns a color value. If using the plugin 'SFonts' only the codes
 *  will work (hex codes will not work).
 * 
 * ---------------
 *
 *  - Max HP Fontface
 *  The parameter 'Max HP Fontface' defines the font name for the max hp
 *  digits display***.
 *  You can use script codes that returns a string with the fontname se the
 *  value for it. 
 *
 *  - Max HP Fontsize
 *  The parameter 'Max HP Fontsize' defines the font size for the max hp
 *  digits display***.
 *  You can use script codes that returns numeric values as the value for it. 
 *
 *  - Max HP Color
 *  The parameter 'Max HP Color' defines the font color for the max hp
 *  digits display***.
 *  The color must be either a hex color code (#000000) or a script code
 *  that returns a color value. If using the plugin 'SFonts' only the codes
 *  will work (hex codes will not work).
 *
 *  *** Notice that the Max HP display depends on the gauge width and fontsize.
 *    If there is not enough room for it to be drawn, it will be not show at all.
 *
 * ---------------
 *
 *  - MP display
 *  The 'MP Display' plugin parameters controls the actor's MP display. It's
 *  setup is the same as the 'HP Display' parameters setup.
 *
 * ---------------
 *
 *  - TP display
 *  The 'TP Display' plugin parameters controls the actor's TP display. It's
 *  setup is the same as the 'HP Display' parameters setup.
 *
 * ---------------
 *
 *  - Custom Codes
 *  The 'Custom Code' plugin parameter allows you to process script codes when
 *  the status window refresh. This can be used to add information from custom
 *  plugins into the status window. you can use "actor" to refer for the actor,
 *  "rect" to get the rectange data that contains the actor's info, 'index' to
 *  get the actor index on the party, 'x' to get the rect x position, 'y' to get
 *  the rect y position, 'width' to get the rect width and 'height' to get the
 *  rect height. Any other valid code for basic windows are also valid.
 *  This requires scripting knwoledge, use at your own risk.
 *
 * ------------------------------------------------------------------------------
 * Example Notetags:
 * ------------------------------------------------------------------------------
 *
 * <mp display>
 *  x = 4;
 *  y = 72;
 *  width = 108;
 * </mp display>
 *
 * ---------------
 *
 * <tp display>
 *  x = 4;
 *  y = this.lineHeight() * 3;
 *  width = rect.width - 8;
 * </tp display>
 *
 * ------------------------------------------------------------------------------
 */

(function() {
	
	//=============================================================================
	// Parameters
	//=============================================================================
	
	if (Imported['VE - Basic Module']) {
		var parameters = VictorEngine.getPluginParameters();
		VictorEngine.Parameters = VictorEngine.Parameters || {};
		VictorEngine.Parameters.BattleStatusWindow = {};
		VictorEngine.Parameters.BattleStatusWindow.WindowLines    = String(parameters["Window Lines"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.WindowColumns  = String(parameters["Window Columns"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.WindowX        = String(parameters["Window X"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.WindowY        = String(parameters["Window Y"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.WindowWidth    = String(parameters["Window Width"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.WindowHeight   = String(parameters["Window Height"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.BackOpacity    = String(parameters["Window Back Opacity"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.FrameOpacity   = String(parameters["Window Frame Opacity"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.WindowBack     = String(parameters["Window Background"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.ContentOffsetX = String(parameters["Content Offset X"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.ContentOffsetY = String(parameters["Content Offset Y"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.ContentBack    = String(parameters["Content Background"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.ContentBackX   = String(parameters["Content Back X"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.ContentBackY   = String(parameters["Content Back Y"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.ActiveOffsetX  = String(parameters["Active Offset X"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.ActiveOffsetY  = String(parameters["Active Offset Y"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.ActiveBack     = String(parameters["Active Background"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.ActiveBackX    = String(parameters["Active Back X"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.ActiveBackY    = String(parameters["Active Back Y"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.FaceSufix      = String(parameters["Face Sufix"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.FaceWidth      = String(parameters["Face Width"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.FaceHeight     = String(parameters["Face Height"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.FaceOffsetX    = String(parameters["Face Offset X"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.FaceOffsetY    = String(parameters["Face Offset Y"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.NameOffsetX    = String(parameters["Name Offset X"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.NameOffsetY    = String(parameters["Name Offset Y"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.NameFontface   = String(parameters["Name Fontface"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.NameFontsize   = String(parameters["Name Fontsize"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.NameColor      = String(parameters["Name Color"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.StatesMaxIcons = String(parameters["States Max Icons"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.StatesOffsetX  = String(parameters["States Offset X"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.StatesOffsetY  = String(parameters["States Offset Y"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.NoActionIcon   = String(parameters["No Action Icon"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.ActionOffsetX  = String(parameters["Action Offset X"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.ActionOffsetY  = String(parameters["Action Offset Y"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.HPGaugeWidth   = String(parameters["HP Gauge Width"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.HPOffsetX      = String(parameters["HP Offset X"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.HPOffsetY      = String(parameters["HP Offset Y"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.HPTextFontface = String(parameters["HP Text Fontface"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.HPTextFontsize = String(parameters["HP Text Fontsize"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.HPTextColor    = String(parameters["HP Text Color"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.CurrentHPName  = String(parameters["Current HP Fontface"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.CurrentHPSize  = String(parameters["Current HP Fontsize"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.CurrentHPColor = String(parameters["Current HP Color"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.MaxHPName      = String(parameters["Max HP Fontface"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.MaxHPSize      = String(parameters["Max HP Fontsize"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.MaxHPColor     = String(parameters["Max HP Color"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.MPGaugeWidth   = String(parameters["MP Gauge Width"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.MPOffsetX      = String(parameters["MP Offset X"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.MPOffsetY      = String(parameters["MP Offset Y"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.MPTextFontface = String(parameters["MP Text Fontface"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.MPTextFontsize = String(parameters["MP Text Fontsize"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.MPTextColor    = String(parameters["MP Text Color"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.CurrentMPName  = String(parameters["Current MP Fontface"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.CurrentMPSize  = String(parameters["Current MP Fontsize"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.CurrentMPColor = String(parameters["Current MP Color"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.MaxMPName      = String(parameters["Max MP Fontface"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.MaxMPSize      = String(parameters["Max MP Fontsize"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.MaxMPColor     = String(parameters["Max MP Color"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.MaxTP          = String(parameters["Max TP"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.TPGaugeWidth   = String(parameters["TP Gauge Width"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.TPOffsetX      = String(parameters["TP Offset X"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.TPOffsetY      = String(parameters["TP Offset Y"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.TPTextFontface = String(parameters["TP Text Fontface"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.TPTextFontsize = String(parameters["TP Text Fontsize"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.TPTextColor    = String(parameters["TP Text Color"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.CurrentTPName  = String(parameters["Current TP Fontface"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.CurrentTPSize  = String(parameters["Current TP Fontsize"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.CurrentTPColor = String(parameters["Current TP Color"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.MaxTPName      = String(parameters["Max TP Fontface"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.MaxTPSize      = String(parameters["Max TP Fontsize"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.MaxTPColor     = String(parameters["Max TP Color"]).trim();
		VictorEngine.Parameters.BattleStatusWindow.HorzCentralize = eval(parameters["Horizontal Centralize"]);
		VictorEngine.Parameters.BattleStatusWindow.VertCentralize = eval(parameters["Vertical Centralize"]);
		VictorEngine.Parameters.BattleStatusWindow.ActiveSelect   = eval(parameters["Active Select"]);
		VictorEngine.Parameters.BattleStatusWindow.ShowFaces      = eval(parameters["Show Faces"]);
		VictorEngine.Parameters.BattleStatusWindow.ShowName       = eval(parameters["Show Name"]);
		VictorEngine.Parameters.BattleStatusWindow.ShowStates     = eval(parameters["Show States"]);
		VictorEngine.Parameters.BattleStatusWindow.ShowActionIcon = eval(parameters["Show Action Icon"]);
		VictorEngine.Parameters.BattleStatusWindow.ShowHPGauge    = eval(parameters["Show HP Gauge"]);
		VictorEngine.Parameters.BattleStatusWindow.ShowMP         = eval(parameters["Show MP"]);
		VictorEngine.Parameters.BattleStatusWindow.ShowMPGauge    = eval(parameters["Show MP Gauge"]);
		VictorEngine.Parameters.BattleStatusWindow.ShowTP         = eval(parameters["Show TP"]);
		VictorEngine.Parameters.BattleStatusWindow.ShowTPGauge    = eval(parameters["Show TP Gauge"]);
		VictorEngine.Parameters.BattleStatusWindow.WindowMove     = Number(parameters["Window Movement"]) || 0;
		VictorEngine.Parameters.BattleStatusWindow.BackgroundX    = Number(parameters["Window Background X"]) || 0;
		VictorEngine.Parameters.BattleStatusWindow.BackgroundY    = Number(parameters["Window Background Y"]) || 0;
		for (var i = 1; i <= 10; i++) {
			var value = String(i);
			VictorEngine.Parameters.BattleStatusWindow['CustomCode' + value] = String(parameters["Custom Code " + value]).trim();
		}
	}
 
	//=============================================================================
	// VictorEngine
	//=============================================================================
	
	VictorEngine.BattleStatusWindow.loadParameters = VictorEngine.loadParameters;
	VictorEngine.loadParameters = function() {
		VictorEngine.BattleStatusWindow.loadParameters.call(this);
		VictorEngine.BattleStatusWindow.processParameters();
	};
	
	VictorEngine.BattleStatusWindow.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function(data, index) {
		VictorEngine.BattleStatusWindow.loadNotetagsValues.call(this, data, index);
		if (this.objectSelection(index, ['actor', 'class'])) {
			VictorEngine.BattleStatusWindow.loadNotes(data);
		}
	};
	
	VictorEngine.BattleStatusWindow.loadNotes = function(data) {
		data.battleStatusWindow = data.battleStatusWindow || {};
		this.processNotes(data);
	};
		
	VictorEngine.BattleStatusWindow.processNotes = function(data) {
		var match;
		var part1  = "[ ]*('[^\']+'|\"[^\"]+\")[ ]*"
		var regex1 = new RegExp('<hide tp display>', 'gi');
		var regex2 = new RegExp('<hide mp display>', 'gi');
		var regex3 = VictorEngine.getNotesValues('(mp|tp) display')
		data.battleStatusWindow.hideTp = !!data.note.match(regex1);
		data.battleStatusWindow.hideMp = !!data.note.match(regex2);
		while (match = regex3.exec(data.note)) {
			this.processValues(data, match);
		};
	};
	
	VictorEngine.BattleStatusWindow.processValues = function(data, match) {
		data.battleStatusWindow[match[1].toLowerCase()] = match[2].trim();
	};
	
	VictorEngine.BattleStatusWindow.processParameters = function() {
		if (!this.loaded) {
			this.loaded = true;
			this.setupLayout();
			this.setupDisplay();
			this.setupContent();
			this.setupActive();
			this.setupFace();
			this.setupName();
			this.setupState();
			this.setupAction();
			this.setupHP();
			this.setupMP();
			this.setupTP();
			this.setupCustom();
			this.setupOffset();
		}
	};
	
	VictorEngine.BattleStatusWindow.setupLayout = function() {
		var parameters = VictorEngine.Parameters.BattleStatusWindow;
		this.layout = {};
		this.layout.lines   = parameters.WindowLines;
		this.layout.columns = parameters.WindowColumns;
	};
	
	VictorEngine.BattleStatusWindow.setupDisplay = function() {
		var parameters = VictorEngine.Parameters.BattleStatusWindow;
		this.display = {};
		this.display.x = parameters.WindowX;
		this.display.y = parameters.WindowY;
		this.display.width  = parameters.WindowWidth;
		this.display.height = parameters.WindowHeight;
		this.display.movement = parameters.WindowMove;
		this.display.background  = parameters.WindowBack;
		this.display.backgroundX = parameters.BackgroundX;
		this.display.backgroundY = parameters.BackgroundY;
		this.display.backOpacity  = parameters.BackOpacity;
		this.display.frameOpacity = parameters.FrameOpacity;
	};
	
	VictorEngine.BattleStatusWindow.setupContent = function() {
		var parameters = VictorEngine.Parameters.BattleStatusWindow;
		this.content = {};
		this.content.horizontal = parameters.HorzCentralize;
		this.content.vertical   = parameters.VertCentralize;
		this.content.background = parameters.ContentBack;
		this.content.x = parameters.ContentBackX;
		this.content.y = parameters.ContentBackY;
	};
	
	VictorEngine.BattleStatusWindow.setupActive = function() {
		var parameters = VictorEngine.Parameters.BattleStatusWindow;
		this.active = {};
		this.active.select     = parameters.ActiveSelect;
		this.active.background = parameters.ActiveBack;
		this.active.x = parameters.ActiveBackX;
		this.active.y = parameters.ActiveBackY;
	};
	
	VictorEngine.BattleStatusWindow.setupFace = function() {
		var parameters = VictorEngine.Parameters.BattleStatusWindow;
		this.face = {};
		this.face.show   = parameters.ShowFaces;
		this.face.sufix  = parameters.FaceSufix;
		this.face.width  = parameters.FaceWidth;
		this.face.height = parameters.FaceHeight;
	};
	
	VictorEngine.BattleStatusWindow.setupName = function() {
		var parameters = VictorEngine.Parameters.BattleStatusWindow;
		this.name = {};
		this.name.show  = parameters.ShowName;
		this.name.face  = parameters.NameFontface;
		this.name.size  = parameters.NameFontsize;
		this.name.color = parameters.NameColor;
	};
	
	VictorEngine.BattleStatusWindow.setupState = function() {
		var parameters = VictorEngine.Parameters.BattleStatusWindow;
		this.state = {};
		this.state.show = parameters.ShowStates;
		this.state.max  = parameters.StatesMaxIcons;
	};
	
	VictorEngine.BattleStatusWindow.setupAction = function() {
		var parameters = VictorEngine.Parameters.BattleStatusWindow;
		this.action = {};
		this.action.show = parameters.ShowActionIcon;
		this.action.icon = parameters.NoActionIcon;
	};
	
	VictorEngine.BattleStatusWindow.setupHP = function() {
		var parameters = VictorEngine.Parameters.BattleStatusWindow;
		this.hp = {};
		this.hp.gauge  = parameters.ShowHPGauge;
		this.hp.width  = parameters.HPGaugeWidth;
		this.hp.textFace  = parameters.HPTextFontface;
		this.hp.textSize  = parameters.HPTextFontsize;
		this.hp.textColor = parameters.HPTextColor;
		this.hp.currentFace  = parameters.CurrentHPName;
		this.hp.currentSize  = parameters.CurrentHPSize;
		this.hp.currentColor = parameters.CurrentHPColor;
		this.hp.maxFace  = parameters.MaxHPName;
		this.hp.maxSize  = parameters.MaxHPSize;
		this.hp.maxColor = parameters.MaxHPColor;
	};
	
	VictorEngine.BattleStatusWindow.setupMP = function() {
		var parameters = VictorEngine.Parameters.BattleStatusWindow;
		this.mp = {};
		this.mp.show  = parameters.ShowMP;
		this.mp.gauge = parameters.ShowMPGauge;
		this.mp.width = parameters.MPGaugeWidth;
		this.mp.textFace  = parameters.MPTextFontface;
		this.mp.textSize  = parameters.MPTextFontsize;
		this.mp.textColor = parameters.MPTextColor;
		this.mp.currentFace  = parameters.CurrentMPName;
		this.mp.currentSize  = parameters.CurrentMPSize;
		this.mp.currentColor = parameters.CurrentMPColor;
		this.mp.maxFace  = parameters.MaxMPName;
		this.mp.maxSize  = parameters.MaxMPSize;
		this.mp.maxColor = parameters.MaxMPColor;
	};
	
	VictorEngine.BattleStatusWindow.setupTP = function() {
		var parameters = VictorEngine.Parameters.BattleStatusWindow;
		this.tp = {};
		this.tp.max   = parameters.MaxTP
		this.tp.show  = parameters.ShowTP;
		this.tp.gauge = parameters.ShowTPGauge;
		this.tp.width = parameters.TPGaugeWidth;
		this.tp.textFace  = parameters.TPTextFontface;
		this.tp.textSize  = parameters.TPTextFontsize;
		this.tp.textColor = parameters.TPTextColor;
		this.tp.currentFace  = parameters.CurrentTPName;
		this.tp.currentSize  = parameters.CurrentTPSize;
		this.tp.currentColor = parameters.CurrentTPColor;
		this.tp.maxFace  = parameters.MaxTPName;
		this.tp.maxSize  = parameters.MaxTPSize;
		this.tp.maxColor = parameters.MaxTPColor;
	};
	
	VictorEngine.BattleStatusWindow.setupCustom = function() {
		this.custom = [];
		for (var i = 1; i <= 10; i++) {
			var value = String(i);
			this.custom.push(VictorEngine.Parameters.BattleStatusWindow['CustomCode' + value]);
		};
	};
	
	VictorEngine.BattleStatusWindow.setupOffset = function() {
		var parameters = VictorEngine.Parameters.BattleStatusWindow;
		this.offset = {};
		this.offset.content = {x: parameters.ContentOffsetX, y: parameters.ContentOffsetY};
		this.offset.active  = {x: parameters.ActiveOffsetX,  y: parameters.ActiveOffsetY};
		this.offset.action  = {x: parameters.ActionOffsetX,  y: parameters.ActionOffsetY};
		this.offset.state   = {x: parameters.StatesOffsetX,  y: parameters.StatesOffsetY};
		this.offset.face    = {x: parameters.FaceOffsetX,    y: parameters.FaceOffsetY};
		this.offset.name    = {x: parameters.NameOffsetX,    y: parameters.NameOffsetY};
		this.offset.hp      = {x: parameters.HPOffsetX,      y: parameters.HPOffsetY};
		this.offset.mp      = {x: parameters.MPOffsetX,      y: parameters.MPOffsetY};
		this.offset.tp      = {x: parameters.TPOffsetX,      y: parameters.TPOffsetY};
	};

	//=============================================================================
	// Game_Actor
	//=============================================================================
	
	VictorEngine.BattleStatusWindow.startTurn = BattleManager.startTurn;
	BattleManager.startTurn = function() {
		VictorEngine.BattleStatusWindow.startTurn.call(this);
		$gameParty.aliveMembers().forEach(function(member) {
			if (member.isConfused() && !member.actionIcon()) {
				action = member.currentAction();
				if (action) {
					member.setActionIcon(action.item().iconIndex);
				}
			}
		})
	};

	//=============================================================================
	// Game_Actor
	//=============================================================================
	
	VictorEngine.BattleStatusWindow.performActionEnd = Game_Actor.prototype.performActionEnd;
	Game_Actor.prototype.performActionEnd = function() {
		VictorEngine.BattleStatusWindow.performActionEnd.call(this);
		this.clearActionIcon();
	};
	
	VictorEngine.BattleStatusWindow.onRestrict = Game_Actor.prototype.onRestrict;
	Game_Actor.prototype.onRestrict = function() {
		VictorEngine.BattleStatusWindow.onRestrict.call(this);
		this.clearActionIcon();
	};
	
	VictorEngine.BattleStatusWindow.onBattleEnd = Game_Actor.prototype.onBattleEnd;
	Game_Actor.prototype.onBattleEnd = function() {
		VictorEngine.BattleStatusWindow.onBattleEnd.call(this);
		this.clearActionIcon();
	};

	Game_Actor.prototype.actionIcon = function() {
		return this._actionIcon;
	};
	
	Game_Actor.prototype.clearActionIcon = function() {
		this._actionIcon = 0;
	};
	
	Game_Actor.prototype.setActionIcon = function(icon) {
		this._actionIcon = icon;
	};
	
	Game_Actor.prototype.hideMpDisplay = function() {
		var objects = [this.actor(), this.currentClass()];
		return objects.some(function(object) { return object.battleStatusWindow.hideMp });
	};
	
	Game_Actor.prototype.hideTpDisplay = function() {
		var objects = [this.actor(), this.currentClass()];
		return objects.some(function(object) { return object.battleStatusWindow.hideTp });
	};

	Game_Actor.prototype.mpStatusDisplay = function() {
		if (this.actor().battleStatusWindow.mp) {
			return this.actor().battleStatusWindow.mp;
		} else if (this.currentClass().battleStatusWindow.mp) {
			return this.currentClass().battleStatusWindow.mp;
		} else {
			return null;
		}
	};
	
	Game_Actor.prototype.tpStatusDisplay = function() {
		if (this.actor().battleStatusWindow.tp) {
			return this.actor().battleStatusWindow.tp
		} else if (this.currentClass().battleStatusWindow.tp) {
			return this.currentClass().battleStatusWindow.tp;
		} else {
			return null;
		}
	};
	
	//=============================================================================
	// Window_Base
	//=============================================================================
	
	Window_Base.prototype.drawHpGauge = function(actor, x, y, width) {
		var gauge1 = this.hpGaugeColor1();
		var gauge2 = this.hpGaugeColor2();
		this.drawGauge(x, y, width, actor.hpRate(), gauge1, gauge2);
	};
	
	Window_Base.prototype.drawMpGauge = function(actor, x, y, width) {
		var gauge1 = this.mpGaugeColor1();
		var gauge2 = this.mpGaugeColor2();
		this.drawGauge(x, y, width, actor.mpRate(), gauge1, gauge2);
	};
	
	Window_Base.prototype.drawTpGauge = function(actor, x, y, width) {
		var gauge1 = this.tpGaugeColor1();
		var gauge2 = this.tpGaugeColor2();
		this.drawGauge(x, y, width, actor.tpRate(), gauge1, gauge2);
	};
	
	//=============================================================================
	// Scene_Battle
	//=============================================================================
	
	/* Overwritten function */
	Scene_Battle.prototype.createStatusWindow = function() {
		this._statusWindow = new Window_CustomBattleStatus();
		this.addWindow(this._statusWindow);
	};
	
	/* Overwritten function */
	Scene_Battle.prototype.updateWindowPositions = function() {
		if (this._statusWindow.moveX()) {
			var statusX = 0;
			if (BattleManager.isInputting()) {
				statusX = this._statusWindow.defaultX();
			} else {
				statusX = this._statusWindow.defaultX() - this._statusWindow.moveX();
			}
			if (this._statusWindow.x < statusX) {
				this._statusWindow.x += 16;
				if (this._statusWindow.x > statusX) {
					this._statusWindow.x = statusX;
				}
			}
			if (this._statusWindow.x > statusX) {
				this._statusWindow.x -= 16;
				if (this._statusWindow.x < statusX) {
					this._statusWindow.x = statusX;
				}
			}
		}
	};

	VictorEngine.BattleStatusWindow.startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
	Scene_Battle.prototype.startActorCommandSelection = function() {
		VictorEngine.BattleStatusWindow.startActorCommandSelection.call(this);
		this.clearActionIcon();
	};
	
	VictorEngine.BattleStatusWindow.onSelectAction = Scene_Battle.prototype.onSelectAction;
	Scene_Battle.prototype.onSelectAction = function() {
		VictorEngine.BattleStatusWindow.onSelectAction.call(this);
		this.setActionIcon();
	};
	
	VictorEngine.BattleStatusWindow.commandAttack = Scene_Battle.prototype.commandAttack;
	Scene_Battle.prototype.commandAttack = function() {
		VictorEngine.BattleStatusWindow.commandAttack.call(this);
		this.setActionIcon();
	};
	
	VictorEngine.BattleStatusWindow.commandGuard = Scene_Battle.prototype.commandGuard;
	Scene_Battle.prototype.commandGuard = function() {
		this.setGuardIcon();
		VictorEngine.BattleStatusWindow.commandGuard.call(this);
	};
	
	VictorEngine.BattleStatusWindow.onActorCancel = Scene_Battle.prototype.onActorCancel;
	Scene_Battle.prototype.onActorCancel = function() {
		VictorEngine.BattleStatusWindow.onActorCancel.call(this);
		this.clearActionIcon();
	};

	VictorEngine.BattleStatusWindow.onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
	Scene_Battle.prototype.onEnemyCancel = function() {
		VictorEngine.BattleStatusWindow.onEnemyCancel.call(this);
		this.clearActionIcon();
	};
	
	Scene_Battle.prototype.setActionIcon = function() {
		var item = BattleManager.inputtingAction().item();
		BattleManager.actor().setActionIcon(item.iconIndex);
		this._statusWindow.refresh();
	};
	
	Scene_Battle.prototype.setGuardIcon = function() {
		var item = $dataSkills[BattleManager.actor().guardSkillId()]
		BattleManager.actor().setActionIcon(item.iconIndex);
		this._statusWindow.refresh();
	};
	
	Scene_Battle.prototype.clearActionIcon = function() {
		BattleManager.actor().clearActionIcon();
		this._statusWindow.refresh();
	};
	
})();

//=============================================================================
// Window_CustomBattleStatus
//=============================================================================
	
function Window_CustomBattleStatus() {
    this.initialize.apply(this, arguments);
}

Window_CustomBattleStatus.prototype = Object.create(Window_BattleStatus.prototype);
Window_CustomBattleStatus.prototype.constructor = Window_CustomBattleStatus;

(function() {
	
	Object.defineProperties(Window_CustomBattleStatus.prototype, {
        frameOpacity: {
			get: function() {
				return this._windowFrameSprite.alpha * 255;
			},
			set: function(value) {
				this._windowFrameSprite.alpha = value.clamp(0, 255) / 255;
			},
			configurable: true
        }
    });

	Window_CustomBattleStatus.prototype.initialize = function() {
		var width  = this.windowWidth();
		var height = this.windowHeight();
		var boxWidth  = Graphics.boxWidth;
		var boxHeight = Graphics.boxHeight;
		var wx = Math.floor(Number(eval(this.display().x))) || 0;
		var wy = Math.floor(Number(eval(this.display().y))) || 0;
		var ww = Math.floor(Number(eval(this.display().width))) || 0;
		var wh = Math.floor(Number(eval(this.display().height))) || 0;
		Window_Selectable.prototype.initialize.call(this, wx, wy, ww, wh);
		this.createBackground();
		this.refresh();
		this.openness  = 0;
		this._defaultX = this.x;
		this._activeIndex  = -1;
	};
	
	Window_CustomBattleStatus.prototype.updateBackOpacity = function() {
		this.backOpacity  = Number(eval(this.display().backOpacity)) || 0;
		this.frameOpacity = Number(eval(this.display().frameOpacity)) || 0;
	};

	Window_CustomBattleStatus.prototype.refresh = function() {
		this._refreshRequest = true;
	};
	
	Window_CustomBattleStatus.prototype.update = function() {
		Window_BattleStatus.prototype.update.call(this);
		this.updateRefresh();
		this.updateBackground();
	};
	
	Window_CustomBattleStatus.prototype.updateRefresh = function() {
		if (this._refreshRequest) {
			Window_BattleStatus.prototype.refresh.call(this);
			this._refreshRequest = false;
		}
	};
	
	Window_CustomBattleStatus.prototype.updateBackground = function() {
		if (this.display().background && this._background) {
			if (!this._background.bitmap) {
				this._background.bitmap = ImageManager.loadSystem(this.display().background);
				this._background.bitmap.addLoadListener(this.updateBackgroundFrame.bind(this));
			}
			this._background.x = Math.floor(this.display().backgroundX);
			this._background.y = Math.floor(this.display().backgroundY);
			this._background.visible = this.visible && this.isOpen();
			this._background.opacity = this.opacity;
		}
	};
	
	Window_CustomBattleStatus.prototype.updateBackgroundFrame = function() {
		var width  = this._background.bitmap.width;
		var height = this._background.bitmap.height;
		this._background.setFrame(0, 0, width, height);
	};
	
	Window_CustomBattleStatus.prototype.select = function(index) {
		if (this.selected().select) {
			Window_Selectable.prototype.select.call(this, index);
		}
		if (this._activeIndex !== index) {
			this._activeIndex = index;
			this.refresh();
		}
	};
	
	Window_CustomBattleStatus.prototype.createBackground = function() {
		this._background = new Sprite();
		this._windowSpriteContainer.addChildAt(this._background, 0);
	};
	
	Window_CustomBattleStatus.prototype.defaultX = function() {
		return this._defaultX;
	};
	
	Window_CustomBattleStatus.prototype.moveX = function() {
		return this.display().movement || 0;
	};
	
	Window_CustomBattleStatus.prototype.numVisibleRows = function() {
		return Math.floor(Number(eval(this.layout().lines))) || 1;
	};
	
	Window_CustomBattleStatus.prototype.maxCols = function() {
		return Math.floor(Number(eval(this.layout().columns))) || 1;
	};

	Window_CustomBattleStatus.prototype.itemWidth = function() {
		return Math.floor((this.width - this.padding * 2) / this.maxCols());
	};

	Window_CustomBattleStatus.prototype.itemHeight = function() {
		return Math.floor((this.height - this.padding * 2) / this.numVisibleRows());
	};
	
	Window_CustomBattleStatus.prototype.itemRect = function(index) {
		var horz = 0;
		var vert = 0;
		var rect = new Rectangle();
		var rows = this.numVisibleRows();
		var cols = this.maxCols();
		var cw = this.contents.width;
		var ch = this.contents.height;
		rect.width  = this.itemWidth();
		rect.height = this.itemHeight();
		if (this.content().horizontal) {
			var max = this.maxItems() - cols * Math.floor(index / cols);
			if (max < cols) {
				horz = Math.floor(cw / 2 - rect.width * max / 2);
			}
		}
		if (this.content().vertical) {	
			var max = this.maxItems() - rows * Math.floor(index / rows);
			if (max < rows) {
				vert = Math.floor(ch / 2 - rect.height * max / 2);
			}
		}
		var row = cols === 1 ? Math.floor(index / cols) : Math.floor(index / cols) % rows;
		rect.x = index % cols * rect.width + horz - this._scrollX;
		rect.y = row * rect.height + vert - this._scrollY;
		return rect;
	};
	
	Window_CustomBattleStatus.prototype.layout = function() {
		return VictorEngine.BattleStatusWindow.layout;
	};
	
	Window_CustomBattleStatus.prototype.display = function() {
		return VictorEngine.BattleStatusWindow.display;
	};
	
	Window_CustomBattleStatus.prototype.content = function() {
		return VictorEngine.BattleStatusWindow.content;
	};
	
	Window_CustomBattleStatus.prototype.selected = function() {
		return VictorEngine.BattleStatusWindow.active;
	};
	
	Window_CustomBattleStatus.prototype.action = function() {
		return VictorEngine.BattleStatusWindow.action;
	};
	
	Window_CustomBattleStatus.prototype.face = function() {
		return VictorEngine.BattleStatusWindow.face;
	};
	
	Window_CustomBattleStatus.prototype.name = function() {
		return VictorEngine.BattleStatusWindow.name;
	};
	
	Window_CustomBattleStatus.prototype.face = function() {
		return VictorEngine.BattleStatusWindow.face;
	};
	
	Window_CustomBattleStatus.prototype.state = function() {
		return VictorEngine.BattleStatusWindow.state;
	};
	
	Window_CustomBattleStatus.prototype.hp = function() {
		return VictorEngine.BattleStatusWindow.hp;
	};
	
	Window_CustomBattleStatus.prototype.mp = function() {
		return VictorEngine.BattleStatusWindow.mp;
	};
	
	Window_CustomBattleStatus.prototype.tp = function() {
		return VictorEngine.BattleStatusWindow.tp;
	};
	
	Window_CustomBattleStatus.prototype.custom = function() {
		return VictorEngine.BattleStatusWindow.custom;
	};
	
	Window_CustomBattleStatus.prototype.offset = function() {
		return VictorEngine.BattleStatusWindow.offset;
	};
	
	Window_CustomBattleStatus.prototype.isActive = function(index) {
		return this._activeIndex === index;
	};
	
	Window_CustomBattleStatus.prototype.drawItem = function(index) {
		var actor = $gameParty.battleMembers()[index];
		var rect  = this.setupItemRect(index, actor);
		this.drawBackArea(rect, index, actor);
		this.drawFaceArea(rect, index, actor);
		this.drawNameArea(rect, index, actor);
		this.drawIconArea(rect, index, actor);
		this.drawHpArea(rect, index, actor);
		this.drawMpArea(rect, index, actor);
		this.drawTpArea(rect, index, actor);
		this.drawCustomArea(rect, index, actor);
	};
	
	Window_CustomBattleStatus.prototype.setupItemRect = function(index, actor) {
		var rect = this.itemRect(index);
		var offsetX = Number(eval(this.offset().content.x));
		var offsetY = Number(eval(this.offset().content.y));
		var actionX = this.isActive(index) ? Number(eval(this.offset().active.x)) : 0;
		var actionY = this.isActive(index) ? Number(eval(this.offset().active.y)) : 0;
		rect.x += Math.floor(offsetX + actionX);
		rect.y += Math.floor(offsetY + actionY);
		return rect;
	};
	
	Window_CustomBattleStatus.prototype.drawBackArea = function(rect, index, actor) {
		var name;
		if (this.selected().background && this.isActive(index)) {
			var ox = Math.floor(Number(eval(this.selected().x)));
			var oy = Math.floor(Number(eval(this.selected().y)));
			var name = this.selected().background;
		} else if (this.content().background) {
			var ox = Math.floor(Number(eval(this.content().x)));
			var oy = Math.floor(Number(eval(this.content().y)));
			var name = this.content().background;
		}
		if (name) {
			var bitmap = ImageManager.loadSystem(name);
			this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, rect.x + ox, rect.y + oy);
			if (!bitmap.isReady()) {
				bitmap.addLoadListener(this.refresh.bind(this));
			}
		}
	};
	
	Window_CustomBattleStatus.prototype.drawFaceArea = function(rect, index, actor) {
		if (this.face().show) {
			var ox = Math.floor(Number(eval(this.offset().face.x)));
			var oy = Math.floor(Number(eval(this.offset().face.y)));
			var fw = Math.floor(Number(eval(this.face().width)));
			var fh = Math.floor(Number(eval(this.face().height)));
			var faceName  = actor.faceName() + this.face().sufix;
			var faceIndex = actor.faceIndex();
			this.drawFace(faceName, faceIndex, rect.x + ox, rect.y + oy, fw, fh);
			var bitmap = ImageManager.loadFace(faceName);
			if (!bitmap.isReady()) {
				bitmap.addLoadListener(this.refresh.bind(this));
			}
		}
	};
	
	Window_CustomBattleStatus.prototype.drawNameArea = function(rect, index, actor) {
		if (this.name().show) {
			var ox = Math.floor(Number(eval(this.offset().name.x)));
			var oy = Math.floor(Number(eval(this.offset().name.y)));
			var color = eval(this.getFontColor(this.name().color));
			var font  = eval(this.name().face);
			var size  = eval(this.name().size);
			this.changeTextColor(color);
			this.contents.fontFace = font;
			this.contents.fontSize = Math.floor(size);
			this.drawText(actor.name(), rect.x + ox, rect.y + oy, rect.width - ox);
			this.resetFontSettings();
		}
	};
	
	Window_CustomBattleStatus.prototype.drawIconArea = function(rect, index, actor) {
		if (this.state().show) {
			var ox = Math.floor(Number(eval(this.offset().state.x)));
			var oy = Math.floor(Number(eval(this.offset().state.y)));
			var width = Math.floor(Number(eval(this.state().max)) * Window_Base._iconWidth);
			this.drawActorIcons(actor, rect.x + ox, rect.y + oy, width);
		}
		if (this.action().show) {
			var ox = Math.floor(Number(eval(this.offset().action.x)));
			var oy = Math.floor(Number(eval(this.offset().action.y)));
			var icon = actor.actionIcon() || this.action().icon;
			this.drawIcon(icon, rect.x + ox, rect.y + oy);
		}
	};
	
	Window_CustomBattleStatus.prototype.drawHpArea = function(rect, index, actor) {
		var ox = Math.floor(Number(eval(this.offset().hp.x)));
		var oy = Math.floor(Number(eval(this.offset().hp.y)));
		var gw = Math.floor(Math.min(Number(eval(this.hp().width)), rect.width - ox));
		this.drawActorHp(actor, rect.x + ox, rect.y + oy, gw);
	};
	
	Window_CustomBattleStatus.prototype.drawMpArea = function(rect, index, actor) {
		if (this.showMP(actor)) {
			var display = actor.mpStatusDisplay();
			var x = this.offset().mp.x;
			var y = this.offset().mp.y;
			var width = this.mp().width;
			if (display) {
				eval(display);
			}
			var ox = Math.floor(Number(eval(x)));
			var oy = Math.floor(Number(eval(y)));
			var gw = Math.floor(Math.min(Number(eval(width)), rect.width - ox));
			this.drawActorMp(actor, rect.x + ox, rect.y + oy, gw);
		}
	};
	
	Window_CustomBattleStatus.prototype.drawTpArea = function(rect, index, actor) {
		if (this.showTP(actor)) {
			var display = actor.tpStatusDisplay();
			var x = this.offset().tp.x;
			var y = this.offset().tp.y;
			var width = this.tp().width;
			if (display) {
				eval(display);
			}
			var ox = Math.floor(Number(eval(x)));
			var oy = Math.floor(Number(eval(y)));
			var gw = Math.floor(Math.min(Number(eval(width)), rect.width - ox));
			this.drawActorTp(actor, rect.x + ox, rect.y + oy, gw);
		}
	};

	Window_CustomBattleStatus.prototype.drawCustomArea = function(rect, index, actor) {
		var x = rect.x;
		var y = rect.y;
		var width  = rect.width;
		var height = rect.height;
		var custom = this.custom();
		for (var i = 0; i < custom.length; i++) {
			if (custom[i]) {
				eval(custom[i]);
			}
		}
	};
	
	Window_CustomBattleStatus.prototype.showMP = function(actor) {
		return this.mp().show && !actor.hideMpDisplay();
	};
	
	Window_CustomBattleStatus.prototype.showTP = function(actor) {
		return this.tp().show && !actor.hideTpDisplay();
	};
	
	Window_CustomBattleStatus.prototype.drawActorHp = function(actor, x, y, width) {
		var color1 = eval(this.getFontColor(this.hp().textColor));
		var color2 = eval(this.getFontColor(this.hp().currentColor));
		var color3 = eval(this.getFontColor(this.hp().maxColor));
		var font1  = eval(this.hp().textFace);
		var font2  = eval(this.hp().currentFace);
		var font3  = eval(this.hp().maxFace);
		var size1  = eval(this.hp().textSize);
		var size2  = eval(this.hp().currentSize);
		var size3  = eval(this.hp().maxSize);
		if (this.hp().gauge) {
			this.drawHpGauge(actor, x, y, width);
		}
		this.changeTextColor(color1);
		this.contents.fontFace = font1;
		this.contents.fontSize = size1;
		if (font1) {
			this.drawText(TextManager.hpA, x, y, width);
		}
		this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width, color2, color3, font2, font3, size2, size3);
	};
	
	Window_CustomBattleStatus.prototype.drawActorMp = function(actor, x, y, width) {
		var color1 = eval(this.getFontColor(this.mp().textColor));
		var color2 = eval(this.getFontColor(this.mp().currentColor));
		var color3 = eval(this.getFontColor(this.mp().maxColor));
		var font1  = eval(this.mp().textFace);
		var font2  = eval(this.mp().currentFace);
		var font3  = eval(this.mp().maxFace);
		var size1  = eval(this.mp().textSize);
		var size2  = eval(this.mp().currentSize);
		var size3  = eval(this.mp().maxSize);
		if (this.mp().gauge) {
			this.drawMpGauge(actor, x, y, width);
		}
		this.changeTextColor(color1);
		this.contents.fontFace = font1;
		this.contents.fontSize = size1;
		if (font1) {
			this.drawText(TextManager.mpA, x, y, width);
		}
		this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width, color2, color3, font2, font3, size2, size3);
	};
	
	Window_CustomBattleStatus.prototype.drawActorTp = function(actor, x, y, width) {
		var color1 = eval(this.getFontColor(this.tp().textColor));
		var color2 = eval(this.getFontColor(this.tp().currentColor));
		var color3 = eval(this.getFontColor(this.tp().maxColor));
		var font1  = eval(this.tp().textFace);
		var font2  = eval(this.tp().currentFace);
		var font3  = eval(this.tp().maxFace);
		var size1  = eval(this.tp().textSize);
		var size2  = eval(this.tp().currentSize);
		var size3  = eval(this.tp().maxSize);
		var maxTp  = eval(this.tp().maxTp) || 100;
		if (this.tp().gauge) {
			this.drawTpGauge(actor, x, y, width);
		}
		this.changeTextColor(color1);
		this.contents.fontFace = font1;
		this.contents.fontSize = Math.floor(size1);
		if (font1) {
			this.drawText(TextManager.tpA, x, y, width);
		}
		this.drawCurrentAndMax(actor.tp, maxTp, x, y, width, color2, color3, font2, font3, size2, size3);
	};
	
	Window_CustomBattleStatus.prototype.drawCurrentAndMax = function(current, max, x, y, width, c1, c2, f1, f2, s1, s2) {
		this.changeTextColor(c1);
		this.contents.fontFace = f1;
		this.contents.fontSize = Math.floor(s1);
		var labelWidth = this.textWidth('HP');
		var valueWidth = this.textWidth('0000');
		var slashWidth = this.textWidth('/');
		var x1 = x + width - valueWidth;
		var x2 = x1 - slashWidth;
		var x3 = x2 - valueWidth;
		if (x3 >= x + labelWidth) {
			this.drawText(current, x3, y, valueWidth, 'right');
			this.changeTextColor(c2);
			this.contents.fontFace = f2;
			this.contents.fontSize = Math.floor(s2);
			this.drawText('/', x2, y, slashWidth, 'right');
			this.drawText(max, x1, y, valueWidth, 'right');
		} else {
			this.drawText(current, x1, y, valueWidth, 'right');
		}
		this.resetFontSettings();
	};
	
})();