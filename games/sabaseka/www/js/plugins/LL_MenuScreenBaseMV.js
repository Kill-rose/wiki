//=============================================================================
// RPGツクールMV - LL_MenuScreenBaseMV.js v1.1.0
//-----------------------------------------------------------------------------
// ルルの教会 (Lulu's Church)
// https://nine-yusha.com/
//
// URL below for license details.
// https://nine-yusha.com/plugin/
//=============================================================================

/*:
 * @target MV
 * @plugindesc Common base plugin for menu screen standing picture settings.
 * @author Lulu's Church
 * @url https://nine-yusha.com/plugin-menuscreen/
 *
 * @help LL_MenuScreenBaseMV.js
 *
 * Common base plugin for menu screen standing picture settings.
 * Define standing picture lists for each actor in this plugin.
 *
 * You can define multiple standing pictures with state, switch,
 * and variable conditions, such as:
 *   - Standing picture when Switch 1 is ON and poisoned
 *   - Standing picture when Variable 1 ≥ 10 and poisoned
 *   - Standing picture when Switch 1 is ON
 *   - Standing picture when poisoned
 *   - Normal standing picture with no conditions (required minimum)
 *
 * Switching by remaining HP%:
 *   First create a standing picture list with "Remaining HP%" set to 100.
 *   Copy it and change "Remaining HP%" to 50 to duplicate the list.
 *   When HP drops to 50% or below, the picture set to 50 will be used.
 *   Multiple pictures can be defined per HP% as well.
 *
 * Display priority of image files:
 *   1. Matches State ID, Switch ID, and Variable conditions
 *   2. Matches both State ID and Switch ID
 *   3. Matches both State ID and Variable conditions
 *   4. Matches State ID only
 *   5. Matches both Switch ID and Variable conditions
 *   6. Matches Switch ID only
 *   7. Matches Variable conditions only
 *   8. No conditions (State ID, Switch ID, Variable not set)
 *   (Among the above, the one with the lowest HP% is prioritized)
 *
 * Battle plugin integration:
 *   If LL_StandingPictureBattleMV is installed,
 *   you can link directly with battle standing picture lists.
 *
 * There are no plugin commands.
 *
 * Terms of use:
 *   ・No copyright notice required.
 *   ・No report needed for use.
 *   ・Free for commercial and non-commercial.
 *   ・No restriction for adult works.
 *   ・You may modify freely for your game.
 *   ・Redistribution as plugin material (incl. modified) prohibited.
 *
 * Author: Lulu's Church
 * Date: 2022/3/7
 *
 * @param menuPictures
 * @text Standing Picture List
 * @desc Define standing pictures for menu screen.
 * You can define multiple pictures for states or switches.
 * @default []
 * @type struct<menuPictures>[]
 *
 * @param onSpbPlugin
 * @text Battle Plugin Link
 * @desc * This item is not used
 *
 * @param onSpbPluginEnable
 * @text Link Picture List
 * @desc Link with LL_StandingPictureBattle picture list.
 * If ON, this plugin's picture list is ignored.
 * @default false
 * @type boolean
 * @parent onSpbPlugin
 */

/*~struct~menuPictures:
 *
 * @param actorId
 * @text Actor ID
 * @desc Actor ID. Select the actor to define standing pictures for.
 * @type actor
 *
 * @param stateId
 * @text State ID
 * @desc Use if you want to change picture for a specific state.
 * Set to blank for normal state picture.
 * @type state
 *
 * @param switchId
 * @text Switch ID
 * @desc Use if you want to change picture when switch is ON.
 * Set to blank for normal state picture.
 * @type switch
 *
 * @param variableCase
 * @text Variable Condition
 * @desc Use if you want to change picture by variable conditions.
 * @default
 * @type struct<variableCase>
 *
 * @param hpPercentage
 * @text Remaining HP%
 * @desc Use if you want to change picture by remaining HP%.
 * Normal picture should be set at 100%.
 * @default 100
 * @min 0
 * @max 100
 * @type number
 *
 * @param imageName
 * @text Image File
 * @desc Select image file to display as standing picture.
 * @dir img/pictures
 * @type file
 * @require 1
 *
 * @param x
 * @text X Position
 * @desc Adjust X position of picture.
 * Positive = right, Negative = left. (Default: 0)
 * @default 0
 * @min -9999
 * @max 9999
 * @type number
 *
 * @param y
 * @text Y Position
 * @desc Adjust Y position of picture.
 * Positive = down, Negative = up. (Default: 0)
 * @default 0
 * @min -9999
 * @max 9999
 * @type number
 *
 * @param scaleX
 * @text Scale X
 * @desc Scale rate of picture (X).
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param scaleY
 * @text Scale Y
 * @desc Scale rate of picture (Y).
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 */

/*~struct~variableCase:
 *
 * @param id
 * @text Variable ID
 * @desc Variable ID used for condition.
 * @type variable
 *
 * @param type
 * @text Variable Condition
 * @desc Comparison condition with variable ID.
 * @default equal
 * @type select
 * @option Equal
 * @value equal
 * @option Greater or Equal
 * @value higher
 * @option Less or Equal
 * @value lower
 *
 * @param value
 * @text Variable Value
 * @desc Value to compare with variable ID.
 * @default 0
 * @min -99999999
 * @max 99999999
 * @type number
 */

/*:ja
 * @target MV
 * @plugindesc メニュー画面立ち絵設定の共通ベースプラグインです。
 * @author ルルの教会
 * @url https://nine-yusha.com/plugin-menuscreen/
 *
 * @help LL_MenuScreenBaseMV.js
 *
 * メニュー画面立ち絵設定の共通ベースプラグインです。
 * このプラグインでアクター毎の立ち絵リストを定義します。
 *
 * 下記のようにステート、スイッチ、変数条件で表示する立ち絵を複数定義できます。
 *   ・スイッチ1がONかつ毒状態の立ち絵
 *   ・変数1が10以上かつ毒状態の立ち絵
 *   ・スイッチ1がONの時の立ち絵
 *   ・毒状態の立ち絵
 *   ・スイッチ・ステート・変数条件なしの通常立ち絵 (最低限必要)
 *
 * 残りHP％で立ち絵を切り替える:
 *   まず「残りHP％」を「100」に設定した立ち絵リストを作成します。
 *   上記をコピーして「残りHP％」を「50」に変更し、立ち絵リストを複製します。
 *   これでHPが半分以下になった場合、「50」に設定した立ち絵が呼ばれます。
 *   残りHP％毎に、複数立ち絵を定義することも可能です。
 *
 * 画像ファイルの表示優先順:
 *   1. ステートID、スイッチID、変数条件全てに一致するもの
 *   2. ステートID、スイッチID両方に一致するもの
 *   3. ステートID、変数条件両方に一致するもの
 *   4. ステートIDのみ一致するもの
 *   5. スイッチID、変数条件両方に一致するもの
 *   6. スイッチIDのみ一致するもの
 *   7. 変数条件のみ一致するもの
 *   8. 条件なし (ステートID、スイッチID、変数条件全て設定なし)
 *   (上記の中で、残りHP％が最も低いものが優先して表示されます)
 *
 * 戦闘中立ち絵プラグイン連携:
 *   LL_StandingPictureBattleMV が導入されている場合は、
 *   戦闘中の立ち絵リストとそのまま連携させることも可能です。
 *
 * プラグインコマンドはありません。
 *
 * 利用規約:
 *   ・著作権表記は必要ございません。
 *   ・利用するにあたり報告の必要は特にございません。
 *   ・商用・非商用問いません。
 *   ・R18作品にも使用制限はありません。
 *   ・ゲームに合わせて自由に改変していただいて問題ございません。
 *   ・プラグイン素材としての再配布（改変後含む）は禁止させていただきます。
 *
 * 作者: ルルの教会
 * 作成日: 2022/3/7
 *
 * @param menuPictures
 * @text 立ち絵リスト
 * @desc メニュー画面に表示する立ち絵を定義します。
 * 特定ステート時、スイッチON時の立ち絵を複数定義できます。
 * @default []
 * @type struct<menuPictures>[]
 *
 * @param onSpbPlugin
 * @text 戦闘中立ち絵プラグイン連携
 * @desc ※この項目は使用しません
 *
 * @param onSpbPluginEnable
 * @text 立ち絵リストを連携
 * @desc LL_StandingPictureBattle の立ち絵リストと連携させます。
 * ONにするとこのプラグインの立ち絵リスト設定は無視されます。
 * @default false
 * @type boolean
 * @parent onSpbPlugin
 */

/*~struct~menuPictures:ja
 *
 * @param actorId
 * @text アクターID
 * @desc アクターIDです。立ち絵を定義するアクターを選択してください。
 * @type actor
 *
 * @param stateId
 * @text ステートID
 * @desc 特定ステートで立ち絵を変更したい場合に使用します。
 * 通常時の立ち絵は空白(なし)で設定ください。
 * @type state
 *
 * @param switchId
 * @text スイッチID
 * @desc スイッチONで立ち絵を変更したい場合に使用します。
 * 通常時の立ち絵は空白(なし)で設定ください。
 * @type switch
 *
 * @param variableCase
 * @text 変数条件
 * @desc 変数条件で立ち絵を変更したい場合に使用します。
 * @default
 * @type struct<variableCase>
 *
 * @param hpPercentage
 * @text 残りHP％
 * @desc 残りHP％で立ち絵を変更したい場合に使用します。
 * 通常時の立ち絵は100％で設定してください。
 * @default 100
 * @min 0
 * @max 100
 * @type number
 *
 * @param imageName
 * @text 画像ファイル名
 * @desc 立ち絵として表示する画像ファイルを選択してください。
 * @dir img/pictures
 * @type file
 * @require 1
 *
 * @param x
 * @text X座標
 * @desc 立ち絵の表示位置(X)の調整値です。
 * ＋で右へ、－で左へ調整します。 (初期値: 0)
 * @default 0
 * @min -9999
 * @max 9999
 * @type number
 *
 * @param y
 * @text Y座標
 * @desc 立ち絵の表示位置(Y)の調整値です。
 * ＋で下へ、－で上へ調整します。 (初期値: 0)
 * @default 0
 * @min -9999
 * @max 9999
 * @type number
 *
 * @param scaleX
 * @text X拡大率
 * @desc 立ち絵の拡大率(X)です。
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param scaleY
 * @text Y拡大率
 * @desc 立ち絵の拡大率(Y)です。
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 */

/*~struct~variableCase:ja
 *
 * @param id
 * @text 変数ID
 * @desc 条件に使用する変数IDです。
 * @type variable
 *
 * @param type
 * @text 変数条件
 * @desc 変数IDとの比較条件です。
 * @default equal
 * @type select
 * @option 一致する
 * @value equal
 * @option 以上
 * @value higher
 * @option 以下
 * @value lower
 *
 * @param value
 * @text 変数比較数値
 * @desc 変数IDと比較する数値です。
 * @default 0
 * @min -99999999
 * @max 99999999
 * @type number
 */

(function() {
	"use strict";
	var pluginName = "LL_MenuScreenBaseMV";

	var parameters = PluginManager.parameters(pluginName);
	var paramJsonParse = function(key, value) {
		try {
			return JSON.parse(value);
		} catch(e) {
			return value;
		}
	};

	var menuPictures = String(parameters["menuPictures"] || "[]");
	var onSpbPluginEnable = eval(parameters["onSpbPluginEnable"] || "true");
	var menuPictureLists = JSON.parse(JSON.stringify(menuPictures, paramJsonParse));

	//-----------------------------------------------------------------------------
	// 戦闘中立ち絵プラグインの立ち絵リストを取得
	// On LL_StandingPictureBattle Plugin
	//-----------------------------------------------------------------------------
	var spbPluginName = "LL_StandingPictureBattleMV";
	var spbParameters = PluginManager.parameters(spbPluginName);
	var spbCommandPictures = String(spbParameters["sbCommandPictures"] || "[]");
	var spbCommandPictureLists = JSON.parse(JSON.stringify(spbCommandPictures, paramJsonParse));

	//-----------------------------------------------------------------------------
	// Ex Menu Screen Base Class
	//
	// メニュー画面立ち絵設定の独自クラスを追加定義します。

	class ExMenuScreenBase {

		//-----------------------------------------------------------------------------
		// 画像ファイル名を取得
		//-----------------------------------------------------------------------------
		static getImageName (actorId) {
			// 立ち絵リストを取得
			var pictureLists = this.getPictureLists();
			if (!pictureLists) return;

			// アクターのステート情報を取得
			var actorStates = [];
			if (actorId) actorStates = $gameActors.actor(actorId)._states;
			var specificPicture = null;

			// アクターIDが一致する立ち絵を検索
			pictureLists = pictureLists.filter(function(item) {
				if (Number(item.actorId) == actorId) {
					return true;
				}
			});

			// ステートにかかっているか？
			if (actorStates.length) {
				// ステートID・スイッチID・変数IDが有効な立ち絵リストを検索
				specificPicture = pictureLists.filter(function(item) {
					if (item.variableCase) {
						if (
							actorStates.indexOf(Number(item.stateId)) !== -1 &&
							$gameSwitches.value(Number(item.switchId)) &&
							(
								String(item.variableCase.type) == "equal" && $gameVariables.value(Number(item.variableCase.id)) == Number(item.variableCase.value) ||
								String(item.variableCase.type) == "higher" && $gameVariables.value(Number(item.variableCase.id)) >= Number(item.variableCase.value) ||
								String(item.variableCase.type) == "lower" && $gameVariables.value(Number(item.variableCase.id)) <= Number(item.variableCase.value)
							)
						) {
							return true;
						}
					}
				});
				if (specificPicture.length) return this.checkHpPercentage(actorId, specificPicture);
				// ステートID・スイッチIDが有効な立ち絵リストを検索
				specificPicture = pictureLists.filter(function(item) {
					if (actorStates.indexOf(Number(item.stateId)) !== -1 && $gameSwitches.value(Number(item.switchId)) && !item.variableCase) {
						return true;
					}
				});
				if (specificPicture.length) return this.checkHpPercentage(actorId, specificPicture);
				// ステートID・変数IDが有効な立ち絵リストを検索
				specificPicture = pictureLists.filter(function(item) {
					if (item.variableCase) {
						if (
							actorStates.indexOf(Number(item.stateId)) !== -1 &&
							(Number(item.switchId) === 0 || !item.switchId) &&
							(
								String(item.variableCase.type) == "equal" && $gameVariables.value(Number(item.variableCase.id)) == Number(item.variableCase.value) ||
								String(item.variableCase.type) == "higher" && $gameVariables.value(Number(item.variableCase.id)) >= Number(item.variableCase.value) ||
								String(item.variableCase.type) == "lower" && $gameVariables.value(Number(item.variableCase.id)) <= Number(item.variableCase.value)
							)
						) {
							return true;
						}
					}
				});
				if (specificPicture.length) return this.checkHpPercentage(actorId, specificPicture);
				// ステートIDが有効な立ち絵リストを検索
				specificPicture = pictureLists.filter(function(item) {
					if (actorStates.indexOf(Number(item.stateId)) !== -1 && (Number(item.switchId) === 0 || !item.switchId) && !item.variableCase) {
						return true;
					}
				});
				if (specificPicture.length) return this.checkHpPercentage(actorId, specificPicture);
			}

			// スイッチID・変数IDが有効な立ち絵リストを検索
			specificPicture = pictureLists.filter(function(item) {
				if (item.variableCase) {
					if (
						(Number(item.stateId) === 0 || !item.stateId) &&
						$gameSwitches.value(Number(item.switchId)) &&
						(
							String(item.variableCase.type) == "equal" && $gameVariables.value(Number(item.variableCase.id)) == Number(item.variableCase.value) ||
							String(item.variableCase.type) == "higher" && $gameVariables.value(Number(item.variableCase.id)) >= Number(item.variableCase.value) ||
							String(item.variableCase.type) == "lower" && $gameVariables.value(Number(item.variableCase.id)) <= Number(item.variableCase.value)
						)
					) {
						return true;
					}
				}
			});
			if (specificPicture.length) return this.checkHpPercentage(actorId, specificPicture);
			// スイッチIDが有効な立ち絵リストを検索
			specificPicture = pictureLists.filter(function(item) {
				if ((Number(item.stateId) === 0 || !item.stateId) && $gameSwitches.value(Number(item.switchId)) && !item.variableCase) {
					return true;
				}
			});
			if (specificPicture.length) return this.checkHpPercentage(actorId, specificPicture);
			// 変数IDが有効な立ち絵リストを検索
			specificPicture = pictureLists.filter(function(item) {
				if (item.variableCase) {
					if (
						(Number(item.stateId) === 0 || !item.stateId) &&
						(Number(item.switchId) === 0 || !item.switchId) &&
						(
							String(item.variableCase.type) == "equal" && $gameVariables.value(Number(item.variableCase.id)) == Number(item.variableCase.value) ||
							String(item.variableCase.type) == "higher" && $gameVariables.value(Number(item.variableCase.id)) >= Number(item.variableCase.value) ||
							String(item.variableCase.type) == "lower" && $gameVariables.value(Number(item.variableCase.id)) <= Number(item.variableCase.value)
						)
					) {
						return true;
					}
				}
			});
			if (specificPicture.length) return this.checkHpPercentage(actorId, specificPicture);

			// 上記で見つからなかった場合、通常の立ち絵を検索
			var normalPicture = pictureLists.filter(function(item) {
				if ((Number(item.stateId) === 0 || !item.stateId) && (Number(item.switchId) === 0 || !item.switchId) && !item.variableCase) return true;
			});
			if (normalPicture.length) return this.checkHpPercentage(actorId, normalPicture);
		}

		static checkHpPercentage (actorId, pictureLists) {
			// アクターの残HP％を取得
			var hpRate = this.getHpRate(actorId);
			// 最もHP%が低い立ち絵を適用する
			var minHpRate = 100;
			var result = null;
			pictureLists.forEach(function(item) {
				if (hpRate <= Number(item.hpPercentage) && minHpRate >= Number(item.hpPercentage)) {
					result = item;
					minHpRate = Number(item.hpPercentage);
				} else if (!item.hpPercentage && minHpRate >= 100) {
					// プラグインパラメータが更新されていない場合、便宜的に100として扱う
					result = item;
					minHpRate = Number(item.hpPercentage);
				}
			});
			return result;
		}

		static getPictureLists () {
			return onSpbPluginEnable ? spbCommandPictureLists : menuPictureLists;
		}

		static onSpbPluginEnable () {
			return onSpbPluginEnable;
		}

		// アクターのHPレートを取得
		static getHpRate (actorId) {
			if (!$gameActors.actor(actorId)) return 0;
			return $gameActors.actor(actorId).mhp > 0 ? $gameActors.actor(actorId).hp / $gameActors.actor(actorId).mhp * 100 : 0;
		}
	}

	window.ExMenuScreenBase = ExMenuScreenBase;
})();
