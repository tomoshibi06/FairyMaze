// Generated by RPG Maker.
// Do not edit this file directly.
var $plugins =
[
{"name":"MadeWithMv","status":false,"description":"メイン画面へ進む前に、\"Made with MV\"のスプラッシュ画面もしくはカスタマイズされたスプラッシュ画面を表示します。","parameters":{"Show Made With MV":"true","Made with MV Image":"MadeWithMv","Show Custom Splash":"false","Custom Image":"","Fade Out Time":"120","Fade In Time":"120","Wait Time":"160"}},
{"name":"DTextPicture","status":true,"description":"動的文字列ピクチャ生成プラグイン","parameters":{}},
{"name":"PictureCallCommon","status":true,"description":"ピクチャのボタン化プラグイン","parameters":{}},
{"name":"AdjustPictureGraphical","status":true,"description":"ピクチャのグラフィカルな位置調整プラグイン。\nパラメータを変更したら「プロジェクトの保存」（Ctrl+S）","parameters":{"グリッドサイズ":"48","テストマップID":"-1"}},
{"name":"Torigoya_SameEquipType","status":true,"description":"装備タイプ名が同じならば、同じ種別のアイテムを装備できるようにします","parameters":{}},
{"name":"SAN_MapGenerator","status":true,"description":"自動マップ生成 ver1.15\r\n自動的にマップを生成しイベントを配置します。","parameters":{"WallHight":"1","MinRoomSize":"5","MaxRoomSize":"15","ShowOuterWall":"ON"}},
{"name":"scrollText","status":true,"description":"","parameters":{}},
{"name":"Vitsuno_SpritePerch","status":true,"description":"スプライト集合オブジェクト『パーチ』を定義するベースプラグインです。","parameters":{"Cursor Position":"top-right","Cursor Offset X":"0","Cursor Offset Y":"0","Cursor Interval":"10"}},
{"name":"Vitsuno_AbilityNetwork","status":true,"description":"防具システムを利用してアビリティ習得システムを構築します。","parameters":{"Menu Switch ID":"0","Level UP Point":"2","Point Name":"ＳＰ","Point Name A":"SP","Obtain Text":"%1 の%2を獲得！","Command Name":"スキルツリー","Point UP SE":"Equip1,90,100,0","Learning SE":"Item3,90,100,0","Perch Padding":"48","Perch Stage Height":"64"}},
{"name":"EnemyBook","status":false,"description":"モンスター図鑑です。敵キャラの詳細なステータスを表示します。","parameters":{"Unknown Data":"？？？？？？"}},
{"name":"DP_FixEscapeRatio","status":true,"description":"逃走の成功確率を設定できます。v1.00","parameters":{"Use Param":"false","Ratio":"100"}},
{"name":"dsBattlerSelect","status":false,"description":"戦闘中のバトラー選択を変更するプラグイン ver1.00β","parameters":{"cursorEnable":"1"}},
{"name":"PictureAnimation","status":true,"description":"ピクチャのアニメーションプラグイン","parameters":{}},
{"name":"TitleCommandPosition","status":true,"description":"タイトルコマンドウィンドウの位置を変更します。","parameters":{"Offset X":"-220","Offset Y":"70","Width":"240","Background":"0"}},
{"name":"SRD_TPUpgrade","status":true,"description":"(v3.02) This Plugin allows you to have more control over your TP system and have a dynamic Max TP stat.","parameters":{"Minimum Max TP":"1","Maximum Max TP":"99999","Preserve TP?":"false","Max TP in Status?":"false","Restrict Damage Gain?":"true","= Default Values =":"","Default Actor MTP":"100","Default Actor ITP":"Math.randomInt(25)","Default Enemy MTP":"100","Default Enemy ITP":"Math.randomInt(100)","= Battle TP Gains =":"","TP Bonus Crit Use":"0","TP Bonus Super Use":"0","TP Bonus Crit Take":"0","TP Bonus Super Take":"0"}},
{"name":"ItemBook","status":true,"description":"アイテム図鑑です。アイテムの詳細なステータスを表示します。","parameters":{"Unknown Data":"？？？？？？","Price Text":"価格","Equip Text":"装備","Type Text":"タイプ"}},
{"name":"SSG_ItemSort","status":true,"description":"[SSG] Item Sort: Sort your item by weighted value\r\n<SSG_ItemSort>\r\nversion 1.0.1","parameters":{"Default Sort Value 1":"100","Default Sort Value 2":"100","Sort Mode":"descending"}},
{"name":"BattleParallelEvent","status":true,"description":"戦闘中でも「並列処理」のコモンイベントを実行する為のプラグインです。","parameters":{}},
{"name":"YEP_BattleAICore","status":true,"description":"ver 1.05 バトルAIを、より管理されたものにすることができます。","parameters":{"Dynamic Actions":"true","Element Testing":"false","Default AI Level":"100"}},
{"name":"MessageWindowHidden","status":true,"description":"メッセージウィンドウ一時消去プラグイン","parameters":{"ボタン名称":"右クリック"}},
{"name":"SyncVariable","status":true,"description":"ユーザ間の変数同期プラグイン","parameters":{"ユーザID":"noircastle","同期開始変数番号":"141","同期終了変数番号":"189","同期開始スイッチ番号":"121","同期終了スイッチ番号":"123","認証ファイル形式":"OFF"}},
{"name":"BattlebackChangeInBattle","status":true,"description":"バトルイベントでの戦闘背景変更が可能になります。","parameters":{}},
{"name":"UTA_MessageSkip","status":true,"description":"特定キーを押す事でメッセージをスキップできるようにします。","parameters":{"Skip Key":"control","Show Trace":"false"}},
{"name":"BMSP","status":true,"description":"BMSPベースプラグインです。","parameters":{}},
{"name":"BMSP_EventBeforeAction","status":false,"description":"戦闘アクション実行前にコモンイベントを起動します。","parameters":{}},
{"name":"SideEffectSkill","status":false,"description":"スキルの副作用プラグイン","parameters":{}},
{"name":"BMSP_ContentsUpdator","status":true,"description":"ウインドウの指定領域の表示内容を切り替える機能を提供します。","parameters":{}},
{"name":"BMSP_StateDisplayExtension","status":true,"description":"ステート表示を拡張します。","parameters":{"AnimationType":"slideUp","WaitDuration":"120","AnimationDuration":"60","DrawSingle":"0"}},
{"name":"Torigoya_QuickSkill","status":true,"description":"選択するとターンを消費せずに即発動するスキルを追加します。","parameters":{}},
{"name":"TYA_EnemyHPGauge","status":true,"description":"敵ターゲットウィンドウにＨＰゲージを表示させます。\r\n特定の敵のゲージを非表示にすることもできます。","parameters":{}},
{"name":"MPP_TouchTargetSelect","status":true,"description":"【ver.1.3】戦闘時のターゲット選択で、キャラクターをタッチして選択できるようにします。","parameters":{"=== Actor ===":"","Actor Window View?":"true","Actor Arrow Name":"","Actor Arrow Pos":"0","Actor Arrow Width":"0","Actor Arrow Rate":"4","Actor Arrow Rotation":"0","Actor Arrow Speed":"0","=== Enemy ===":"","Enemy Window View?":"true","Enemy Arrow Name":"","Enemy Arrow Pos":"0","Enemy Arrow Width":"0","Enemy Arrow Rate":"4","Enemy Arrow Rotation":"0","Enemy Arrow Speed":"0"}},
{"name":"RTK1_Core","status":true,"description":"RPG ツクール MV 用に作成された RTK1 ライブラリの基本機能です","parameters":{"language":"0","debug":"0","json":"0","tagname for sort":"ja_sortname"}},
{"name":"RTK1_Composite","status":true,"description":"アイテム・武器・防具の合成","parameters":{"meta tag":"composite","plugin command":"RTK1_Composite","in menu":"0","list sort":"0","auto learn":"0","success adjust menu":"1","charge adjust menu":"1","success adjust workroom":"1","charge adjust workroom":"0","success adjust shop":"1","charge adjust shop":"1"}},
{"name":"AB_EnemyBook","status":true,"description":"戦闘中も確認できるモンスター図鑑です。属性、ステートの耐性の確認もできます。","parameters":{"ShowCommandInBattle":"1","ResisterTiming":"1","ShowCurrentStatus":"0","---用語、アイコン---":"","EnemyBookCommandName":"敵の情報","Achievement":"達成率","UnknownEnemy":"？？？？？？","UnknownData":"？？？","WeakElementName":"弱点属性","ResistElementName":"耐性属性","WeakStateName":"弱点ステート","ResistStateName":"耐性ステート","NoEffectStateName":"無効ステート","UnknownDropItemIcon":"16","AddEnemySkillMessage":"%1を図鑑に登録した！","FailToAddEnemySkillMessage":"%1は図鑑には載せられない！","FailToCheckEnemySkillMessage":"%1の情報はわからなかった！","---表示項目---":"","DispNo":"1","DispHP":"1","DispMP":"1","DispATK":"1","DispDEF":"1","DispMAT":"1","DispMDF":"1","DispAGI":"1","DispLUK":"1","DispDropItems":"1","DispWeakElement":"1","DispResistElement":"1","DispWeakState":"0","DispResistState":"1","DispNoEffectState":"1","DispDescribe":"1","---属性アイコン---":"","UseElementIconInPluginParameter":"1","ElementIcons":"76 64 65 66 67 68 69 70 71 90"}}
];
