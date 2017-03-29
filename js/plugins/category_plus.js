//=============================================================================
// アイテムカテゴリー追加.js
//=============================================================================
/*:
 * @plugindesc アイテムのカテゴリーを追加する
 * @author Trb
 * 
 * @help アイテムのカテゴリーを追加するプラグインの土台です。
 * 編集が必要な部分は中に書いてあるので、ファイルを直接編集してください。 
 * 
 */
(function () {

//rpg_windows.js 1872行目より
//アイテムカテゴリーの表示数を変更
//(オリジナルのメニューにしている場合はそれに合わせて上手く調整してください)
    Window_ItemCategory.prototype.maxCols = function() {
        return 5;
    };


//rpg_windows.js 1883行目より
//カテゴリーの追加
    Window_ItemCategory.prototype.makeCommandList = function() {
        this.addCommand(TextManager.item,    'item');
        this.addCommand(TextManager.weapon,  'weapon');
        this.addCommand(TextManager.armor,   'armor');
        this.addCommand(TextManager.keyItem, 'keyItem');
        this.addCommand('追加カテゴリ1', 'tsuika1');//引数1がメニューでの表示名、引数2がデータ上の分類名
    };
//(もし追加カテゴリーを一番後ろ以外に持ってきたい場合は↑の並び順を入れ替えるとそれがそのまま反映されます)


//rpg_windows.js 1942行目より
//アイテムのカテゴリ分類の判定式
    Window_ItemList.prototype.includes = function(item) {
        //console.log(item);
        switch (this._category) {
        case 'item':
            return DataManager.isItem(item) && item.itypeId === 1;
        case 'weapon':
            return DataManager.isWeapon(item);
        case 'armor':
            return DataManager.isArmor(item);
        case 'keyItem':
            return DataManager.isItem(item) && item.itypeId === 2;
        case 'tsuika1'://← 上の引数2で指定した名前
            return DataManager.isItem(item) && item.itypeId === 3;//この条件を満たしたアイテムが新しいカテゴリに入る
        default:
            return false;
        }
    };

/*↑の説明
とりあえず DataManager.isItem(item) && item.itypeId === 3 としましたが、
この式ではデータベースでアイテムの分類を隠しアイテムAに設定したものが入ります。
アイコンIDで分けたい場合は
DataManager.isItem(item) && item.iconIndex > 50;
にすればアイコンID50より大きいアイテムが入ります。
ただしこれだと通常のアイテムと追加カテゴリの両方に重複して表示されてしまうので
通常のアイテムには含めたくない場合はそちらに
&& item.iconIndex <= 50;という条件を追加するといいです。

console.logをコメントアウトしてありますが、あれでitemの中身を見れば
どういう値が入っているのか分かるので
変わった分け方をしたい場合はそれを見ると参考になると思います。

6つ目、7つ目の項目を追加したい場合も同じ要領で増やしていけます。
コマンドの並び順を決めるのはaddCommandの順番だけなので、
こちらの並び順はそれに合わせる必要ありません。

*/

})();