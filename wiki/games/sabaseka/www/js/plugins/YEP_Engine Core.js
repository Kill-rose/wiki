/*:ja
 * @plugindesc v1.50 戦闘システムをカスタムし、様々な要素を変更することができます
 * @author Yanfly Engine Plugins
 *
 * @param ---一般---
 * @default
 *
 * @param Action Speed
 * @parent ---一般---
 * @desc アクションの基本となるスピードを変更する式
 * Default: agi + Math.randomInt(Math.floor(5 + agi / 4))
 * @default agi
 *
 * @param Default System
 * @parent ---一般---
 * @type select
 * @option デフォルト・ターン戦闘
 * @value dtb
 * @option アクティブ・ターン戦闘（要別プラグイン）
 * @value atb
 * @option チャージ・ターン戦闘（要別プラグイン）
 * @value ctb
 * @option スタンダード・ターン戦闘（要別プラグイン）
 * @value stb
 * @desc ゲームで使われるデフォルトの戦闘システム
 * Default: dtb
 * @default dtb
 *
 * @param ---逃走---
 * @default
 *
 * @param Escape Ratio
 * @parent ---逃走---
 * @desc 逃走の成功率を変更する式
 * Default: 0.5 * $gameParty.agility() / $gameTroop.agility()
 * @default 0.5 * $gameParty.agility() / $gameTroop.agility()
 *
 * @param Fail Escape Boost
 * @parent ---逃走---
 * @type number
 * @decimals 2
 * @desc 逃走を失敗する度に、この確率だけ成功率を上げます。
 * @default 0.10
 *
 * @param ---アニメーション---
 * @default
 *
 * @param Animation Base Delay
 * @parent ---アニメーション---
 * @type number
 * @min 0
 * @desc アニメーション間のベース遅延量設定
 * Default: 8
 * @default 0
 *
 * @param Animation Next Delay
 * @parent ---アニメーション---
 * @type number
 * @min 0
 * @desc アニメーション間の連続的な遅延量設定
 * Default: 12
 * @default 0
 *
 * @param Certain Hit Animation
 * @parent ---アニメーション---
 * @type number
 * @min 0
 * @desc 必ず命中するスキルに対するデフォルトアニメーションを設定。不要な場合は0
 * @default 0
 *
 * @param Physical Animation
 * @parent ---アニメーション---
 * @type number
 * @min 0
 * @desc 物理スキルに対するデフォルトアニメーションを設定。不要な場合は0
 * @default 52
 *
 * @param Magical Animation
 * @parent ---アニメーション---
 * @type number
 * @min 0
 * @desc 魔法スキルに対するデフォルトアニメーションを設定。不要な場合は0
 * @default 51
 *
 * @param Enemy Attack Animation
 * @parent ---アニメーション---
 * @type number
 * @min 0
 * @desc 敵のデフォルト攻撃アニメーション設定
 * Default: 0
 * @default 39
 *
 * @param Reflect Animation
 * @parent ---アニメーション---
 * @type number
 * @min 0
 * @desc 魔法攻撃が反射した時のアニメーション設定
 * @default 42
 *
 * @param Motion Waiting
 * @parent ---アニメーション---
 * @type boolean
 * @on 行動後
 * @off 行動中
 * @desc アニメーション再生タイミングを設定。行動中 - false   行動後 - true   デフォルト: false
 * @default false
 *
 * @param ---フロントビュー---
 * @default
 *
 * @param Front Position X
 * @parent ---フロントビュー---
 * @desc アクターのホームポジション X 軸の式
 * Default: 0
 * @default Graphics.boxWidth / 8 + Graphics.boxWidth / 4 * index
 *
 * @param Front Position Y
 * @parent ---フロントビュー---
 * @desc アクターのホームポジション Y 軸の式
 * Default: 0
 * @default Graphics.boxHeight - 180
 *
 * @param Front Actor Sprite
 * @parent ---フロントビュー---
 * @type boolean
 * @on 表示
 * @off 非表示
 * @desc フロントビューでのアクターのスプライト表示
 * 非表示 - false   表示 - true   デフォルト - false
 * @default false
 *
 * @param Front Sprite Priority
 * @parent ---フロントビュー---
 * @type select
 * @option 通常
 * @value 0
 * @option アクターがトップ
 * @value 1
 * @option 敵がトップ
 * @value 2
 * @desc アクターのスプライトを常に手前に表示するかどうか設定
 * 0 - 通常   1 - アクターが手前   2 - 敵が手前
 * @default 1
 *
 * @param ---サイドビュー---
 * @default
 *
 * @param Home Position X
 * @parent ---サイドビュー---
 * @desc アクターのホームポジション X 軸の式
 * Default: 600 + index * 32
 * @default screenWidth - 16 - (maxSize + 2) * 32 + index * 32
 *
 * @param Home Position Y
 * @parent ---サイドビュー---
 * @desc アクターのホームポジション Y 軸の式
 * Default: 280 + index * 48
 * @default screenHeight - statusHeight - maxSize * 48 + (index+1) * 48 - 32
 *
 * @param Side Sprite Priority
 * @parent ---サイドビュー---
 * @type select
 * @option 通常
 * @value 0
 * @option アクターがトップ
 * @value 1
 * @option 敵がトップ
 * @value 2
 * @desc 常に手前に表示するスプライトを設定
 * 0 - 通常   1 - アクターが手前   2 - 敵が手前
 * @default 1
 *
 * @param ---スプライト---
 * @default
 *
 * @param Default X Anchor
 * @parent ---スプライト---
 * @type number
 * @decimals 2
 * @desc スプライトを固定する際のX軸の値設定
 * Default: 0.50
 * @default 0.50
 *
 * @param Default Y Anchor
 * @parent ---スプライト---
 * @type number
 * @decimals 2
 * @desc スプライトを固定する際のY軸の値設定
 * Default: 1.00
 * @default 1.00
 *
 * @param Step Distance
 * @parent ---スプライト---
 * @type number
 * @desc アクション時、ユニットが前に踏み出す距離を設定
 * Default: 48
 * @default 48
 *
 * @param Flinch Distance
 * @parent ---スプライト---
 * @type number
 * @desc ダメージを受けた際、ユニットがひるむ(後退する)距離を設定
 * @default 12
 *
 * @param Show Shadows
 * @parent ---スプライト---
 * @type boolean
 * @on 表示
 * @off 非表示
 * @desc アクター下に影を表示
 * 非表示 - false     表示 - true
 * @default true
 *
 * @param ---ダメージポップアップ---
 * @default
 *
 * @param Popup Duration
 * @parent ---ダメージポップアップ---
 * @type number
 * @min 1
 * @desc ポップアップが何フレーム分表示されるか設定
 * Default: 90
 * @default 128
 *
 * @param Newest Popup Bottom
 * @parent ---ダメージポップアップ---
 * @type boolean
 * @on 下
 * @off 上
 * @desc 最新のポップアップの表示場所
 * 下 - false   上 - true
 * @default true
 *
 * @param Popup Overlap Rate
 * @parent ---ダメージポップアップ---
 * @type number
 * @decimals 1
 * @desc 複数のダメージ表示が重なった際の、それぞれのスプライトのバッファを設定
 * @default 0.9
 *
 * @param Critical Popup
 * @parent ---ダメージポップアップ---
 * @desc クリティカルヒットした際の、ポップアップの点滅色を設定
 * Default: 255, 0, 0, 160
 * @default 255, 0, 0, 160
 *
 * @param Critical Duration
 * @parent ---ダメージポップアップ---
 * @type number
 * @min 1
 * @desc クリティカルヒットした際の、点滅が何フレーム続くか設定
 * Default: 60
 * @default 60
 *
 * @param ---ティック設定---
 * @default
 *
 * @param Timed States
 * @parent ---ティック設定---
 * @type boolean
 * @on 時間式
 * @off ターン式
 * @desc バトルシステムがティック制になっている時、ステートをどちらにしますか？時間式 - false   ターン式 - true
 * @default false
 *
 * @param Timed Buffs
 * @parent ---ティック設定---
 * @type boolean
 * @on 時間式
 * @off ターン式
 * @desc バトルシステムがティック制になってる時、バフをどちらにしますか？ ターン式 - false   時間式 - true
 * @default false
 *
 * @param Turn Time
 * @parent ---ティック設定---
 * @type number
 * @min 1
 * @desc ティックの何回分で1ターンにしますか？
 * @default 100
 * 
 * @param AI Self Turns
 * @parent ---ティック設定---
 * @type boolean
 * @on YES
 * @off NO
 * @desc AIを、AI独自のターンに基づいて行動させますか？
 * NO - false   YES - true	
 * @default true
 *
 * @param ---ウィンドウ設定---
 * @default
 *
 * @param Lower Windows
 * @parent ---ウィンドウ設定---
 * @type boolean
 * @on 下部
 * @off デフォルト
 * @desc スキルとアイテムウィンドウの表示位置
 * デフォルト - false   下部 - true
 * @default true
 *
 * @param Window Rows
 * @parent ---ウィンドウ設定---
 * @number
 * @min 1
 * @desc 下部ウィンドウを使用する際、表示列数を設定
 * @default 4
 *
 * @param Command Window Rows
 * @parent ---ウィンドウ設定---
 * @type number
 * @min 1
 * @desc コマンドウィンドウの表示列数を設定
 * Default: 4
 * @default 4
 *
 * @param Command Alignment
 * @parent ---ウィンドウ設定---
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc パーティ/アクターコマンドのテキスト位置を設定
 * Default: left
 * @default center
 *
 * @param Start Actor Command
 * @parent ---ウィンドウ設定---
 * @type boolean
 * @on アクター
 * @off パーティ
 * @desc ターン開始時のコマンド
 * パーティ - false     アクター - true
 * @default true
 *
 * @param Current Max
 * @parent ---ウィンドウ設定---
 * @type boolean
 * @on 現在値 / 最大値
 * @off 現在値のみ
 * @desc 現在のHP/MPの表示形式。現在値のみ - false   現在値 / 最大値 - true   デフォルト: true
 * @default false
 *
 * @param ---選択ヘルプ---
 * @default
 *
 * @param Mouse Over
 * @parent ---選択ヘルプ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc マウスを敵に乗せた時に自動的に選択しますか？
 * NO - false     YES - true
 * @default true
 *
 * @param Select Help Window
 * @parent ---選択ヘルプ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc アクター、敵を選択した際にヘルプウィンドウの表示設定。NO - false   YES - true
 * @default true
 *
 * @param User Help Text
 * @parent ---選択ヘルプ---
 * @desc ヘルプウィンドウ内で”使用者”の表示テキスト
 * @default 使用者
 *
 * @param Ally Help Text
 * @parent ---選択ヘルプ---
 * @desc ヘルプウィンドウ内で”味方”(単数)の表示テキスト
 * @default 味方
 *
 * @param Allies Help Text
 * @parent ---選択ヘルプ---
 * @desc ヘルプウィンドウ内で”味方”(複数)の表示テキスト
 * @default 味方
 *
 * @param Enemy Help Text
 * @parent ---選択ヘルプ---
 * @desc ヘルプウィンドウ内で”敵”(単数)の表示テキスト
 * @default 敵
 *
 * @param Enemies Help Text
 * @parent ---選択ヘルプ---
 * @desc ヘルプウィンドウ内で”敵”(複数)の表示テキスト
 * @default 敵
 *
 * @param All Help Text
 * @parent ---選択ヘルプ---
 * @desc 対象のグループ全体を選択した際の表示テキスト設定
 * %1 - 対象となるグループ (味方/敵)
 * @default 全ての %1
 *
 * @param Random Help Text
 * @parent ---選択ヘルプ---
 * @desc ランダム対象を選択した際の表示テキスト設定
 * %1 - 対象となるグループ (味方/敵)     %2 - 数
 * @default ランダムな %1 %2 回
 *
 * @param ---エネミーセレクト---
 * @default
 *
 * @param Visual Enemy Select
 * @parent ---エネミーセレクト---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 敵の選択画面をより視覚的なものに変更しますか？
 * OFF - NO     YES - true
 * @default true
 *
 * @param Show Enemy Name
 * @parent ---エネミーセレクト---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Visual Enemy Selectで敵の名前の表示設定
 * NO - false     YES - true
 * @default true
 *
 * @param Show Select Box
 * @parent ---エネミーセレクト---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 敵を選択してる枠の表示設定
 * NO - false     YES - true
 * @default false
 *
 * @param Enemy Font Size
 * @parent ---エネミーセレクト---
 * @type number
 * @min 1
 * @desc 敵の名前のフォントサイズを変更します
 * Default: 28
 * @default 20
 *
 * @param Enemy Auto Select
 * @parent ---エネミーセレクト---
 * @desc 最初に自動的に選択される敵を変更します
 * 左 - 0     右 - this.furthestRight()
 * @default this.furthestRight()
 *
 * @param ---アクターセレクト---
 * @default
 *
 * @param Visual Actor Select
 * @parent ---アクターセレクト---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 画面をクリックしてアクターを選択しますか？
 * NO - false   YES - true
 * @default true
 *
 * @param ---戦闘ログ---
 * @default
 *
 * @param Show Emerge Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 敵の出現時に、戦闘開始のテキストの表示設定
 * NO - false     YES - true
 * @default false
 *
 * @param Show Pre-Emptive Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 先制攻撃を受けた時に、テキストの表示設定
 * NO - false     YES - true
 * @default true
 *
 * @param Show Surprise Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 不意打ち攻撃を受けた時に、テキストの表示設定
 * NO - false     YES - true
 * @default true
 *
 * @param Optimize Speed
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc ベースラインログをカットして戦闘スピードの早くしますか？
 * NO - false     YES - true
 * @default true
 *
 * @param Show Action Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on フル
 * @off シンプル
 * @desc アクションテキストのフル表示/シンプル表示の切り替えを行います
 * シンプル - false     フル - true
 * @default false
 *
 * @param Show State Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc ステートに関する全てのテキストの表示設定
 * NO - false     YES - true
 * @default false
 *
 * @param Show Buff Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc バフの表示テキスト設定
 * NO - false     YES- true
 * @default false
 *
 * @param Show Counter Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc カウンター攻撃の表示テキスト設定
 * NO - false     YES- true
 * @default true
 *
 * @param Show Reflect Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 反射スペルの表示テキスト設定
 * NO - false     YES- true
 * @default true
 *
 * @param Show Substitute Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 置換ダメージの表示テキスト設定
 * NO - false     YES- true
 * @default true
 *
 * @param Show Fail Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 攻撃の失敗の表示テキスト設定
 * NO - false     YES- true
 * @default false
 *
 * @param Show Critical Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc クリティカルヒットの表示テキスト設定
 * NO - false     YES- true
 * @default false
 *
 * @param Show Miss Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc ミスアタックの表示テキスト設定
 * NO - false     YES- true
 * @default false
 *
 * @param Show Evasion Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 攻撃回避の表示テキスト設定
 * NO - false     YES- true
 * @default false
 *
 * @param Show HP Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc HPダメージまたは回復の表示テキスト設定
 * NO - false     YES- true
 * @default false
 *
 * @param Show MP Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc MP減少または回復の表示テキスト設定
 * NO - false     YES- true
 * @default false
 *
 * @param Show TP Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc TP減少または回復の表示テキスト設定
 * NO - false     YES- true
 * @default false
 *
 * @help
 * 翻訳:ムノクラ
 * https://munokura.tk/
 * https://twitter.com/munokura/
 *
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * このプラグインは、デフォルトの戦闘システムに様々な変更を行うことで、
 * これまでのRPGとは一線を画した戦闘を可能にします。
 * 戦闘のログウィンドウ上部に表示されるテキストを選んだり、
 * またそれがどのように表示されるかを選ぶことができます。
 *
 * ============================================================================
 * Battle Messages
 * ============================================================================
 *
 * 戦闘時に表示される”用語”と”メッセージ”を変更する際は、
 * 下記のタグをメッセージのどこかに挿入することで
 * メッセージを戦闘ログの中央に表示させることができます。
 *
 *   <CENTER>
 *   このタグは頭に置くようにし、戦闘ログウィンドウに、
 *   メッセージを中央に配置する命令であると認識させるようにしてください。
 *
 * スキルとアイテムの表示を変えるためのメモタグが存在します。
 * 『ハロルドの攻撃』などの表示を変更することが出来ます。
 *
 * スキルとアイテムのメモタグ
 *
 *   <Display Text: x>
 *   表示されてるテキストを x に変更。
 *
 *   <Display Icon: x>
 *   表示されてるアイコンを x に変更。
 *
 * ============================================================================
 * Battle Windows
 * ============================================================================
 *
 * 戦闘システムをより直感的にするため、ウィンドウ設定を行います。
 * たとえば、パーティコマンドウィンドウ(戦う/逃げるウィンドウ)の代わりに
 * アクターコマンドウィンドウでターンを開始するといった方式が可能になります。
 * その際アクターウィンドウでキャンセルを押せば、
 * パーティコマンドウィンドウを表示させることもできます。
 *
 * ============================================================================
 * Battle Order
 * ============================================================================
 *
 * バトルのターンシステムについても修正が成されています。
 * 戦闘中に変化するAGI値を持ったバトラーには、
 * その変更を現在のターンから即反映させることができます。
 * アクションスピードの計算についても調整が成されており、
 * ランダム要因の微調整を行い、AGIを戦略的な能力値として
 * 有効なものにすることができます。
 *
 * スキルとアイテムのメモタグ
 *   <speed: +x>
 *   <speed: -x>
 *   エディタで制限されてる最大（2000）・最低（-2000)の数値
 *   以外でも設定する事が出来るようになり、よりアクションを自由にコントロール
 *   出来るようになります。
 *
 * ============================================================================
 * Multiple Hits
 * ============================================================================
 *
 * マルチヒットアクションの途中で対象が死亡した場合でも、
 * アクションが途中で終わってしまうことはありません。
 * この機能は不死身ステートを用いることで使用可能になるため、
 * データベース内のどこか不死身状態のIDを持っておく必要があります。
 * この機能が不要である場合、そのIDのパラメータを0に設定してください。
 *
 * ============================================================================
 * Popup Revamp
 * ============================================================================
 *
 * ダメージのポップアップについても変更が成されています。
 * デフォルトのものと見た目の変化はありませんが、
 * ポップアップ生成のプロセスが変更されています。
 * これまで、ポップアップは各フレーム毎に1つずつの表示となっていましたが、
 * 本変更では、同時に起こったアクションに対して、
 * 同フレーム内に全てのポップアップを表示することが可能になっています。
 * これにより、ダメージポップアップをスムーズに表示できるようになります。
 *
 * ============================================================================
 * Common Events
 * ============================================================================
 *
 * 敵のパーティが生存しているか否かに関わらず、
 * 各アクションの終わりにコモンイベントを起こすことができます。
 * アクションシークエンスのタグを用いれば、
 * スキルのコモンイベントをアクションの途中で呼び出すこともできます。
 * ただし、アクションの途中で別のアクションを強制的に実行した場合、
 * 前に実行していたアクションのシークエンスリストは
 * 無効になってしまうことに気を付けてください。 
 *
 * ============================================================================
 * Casting Animations
 * ============================================================================
 *
 * この機能を用いると、戦闘時にどのバトラーが次に行動をするか、
 * どのタイプのスキルを使うかという視覚的なヒントを
 * プレイヤーに与えることができます。
 * スキルに”振り”のアニメーションを付与することができ、
 * スキル毎に設定することも、全体に一括設定することも可能です。
 *
 * スキルメモタグ:
 *   <Cast Animation: x>
 *   アニメーションID x に、振りのアニメーションを付与します。
 *   xの値を0にすれば、アニメーションは設定されません。
 *
 * ============================================================================
 * Changing Battle Systems
 * ============================================================================
 *
 * プレイヤーが戦闘中でない際でも、プラグインコマンドを使えば
 * 戦闘システムを変更することができます。
 * 現在このプラグインには、デフォルトの戦闘システムのみが含まれています。
 *
 * プラグインコマンド:
 *   setBattleSys DTB      戦闘システムをデフォルトのターン制に設定します
 *
 * Battle Engine Coreを利用するその他の戦闘システムは、
 * 今後リリースされるプラグインに収録される予定です。
 *
 * ============================================================================
 * Sideview Actions
 * ============================================================================
 *
 * RPGツクールMVのサイドビュー/フロントビュー設定では
 * 反撃、魔法反射、メンバー交代の表示をすることができませんでした。
 * Battle Engine Coreを利用すれば、
 * サイドビュー設定のゲームにアニメーションを付与し、
 * より多くの視覚的な情報をプレイヤーに与えることができます。
 * 
 * Magic Reflectionを使えば、そのバトラーに魔法反射能力があることを
 * アニメーションで表すことができます。
 * このアニメーションはパラメータによって変更することが可能です。
 * また特定のアクター、職業、敵、武器、防具、ステートにも、
 * アニメーションを付与することができます。
 *
 * アクター、職業、敵、武器、防具、ステートのメモタグ：
 *   <Reflect Animation ID: x>
 *   xに対して反射のアニメーションの変更を行うことができます。
 *   下記の優先順位で適用されます
 *   アクター＞職業＞敵＞武器＞防具＞ステート＞デフォルト
 *
 * 敵、もしくは特定のアクターの動作を封じたい時は、
 * 下記のメモタグを用いてください。
 * 
 * アクター、職業、敵、武器、防具、ステートのメモタグ：
 *   <Sprite Cannot Move>
 *   バトラーの動きを封じます。
 *   下記の優先順位で適用されます
 *   アクター＞職業＞敵＞武器＞防具＞ステート
 * この状態で敵がアクションを取ると、フロントビュー表示時と同様、白く光ります。
 *
 * ============================================================================
 * Custom Sideview Battler Anchor
 * ============================================================================
 *
 * サイドビュー時バトラーは通常、水平方向に集約され、直立して配置されますが、
 * このカスタマイズで、通常とは異なる向きにバトラーを固定することができます。
 *
 * アクター、職業、武器、防具、ステートのメモタグ:
 *   <Anchor X: y.z>
 *   <Anchor Y: y.z>
 *   アクターのサイドビューバトラーのアンカー固定位置を、
 *    y.zで設定することができます。
 *    デフォルトでは、Xアンカーは0.5、Yアンカーは1.0で設定されています。
 *    Xアンカーを左に動かすには、数値を0.5以下に、
 *    Yアンカーを上に動かすには、数値を1.0以下にしてください。
 *
 * もしアンカーが複数特性を持っていて、他のアンカーと関わってるのであれば
 * 下記の優先順位で適用されます。
 *
 *   ステート
 *   武器
 *   防具
 *   職業
 *   アクター
 *   デフォルト
 *
 * 優先順位は上から下となります。高ければ高いほど優先的になります。
 *
 * ============================================================================
 * Enemy Attack Animation
 * ============================================================================
 *
 * 以下のメモタグを使えば、敵にオリジナル攻撃アニメーションを付与できます。
 *
 * 敵のメモタグ:
 *   <Attack Animation: x>
 *   xに対して敵のデフォルト攻撃アニメーションの変更が出来ます。
 *
 * ============================================================================
 * Automatic State Removal Conditions
 * ============================================================================
 *
 * RPG Maker MVのデフォルトバトルシステムでは下記の3つの条件でステートの自動
 * 解除を実行することが出来ます。：「なし」、「行動終了時」、「戦闘終了時」。
 *
 * 「なし」と「戦闘終了時」は想定通りに動いてますが、「行動終了時」は、終了時
 * ではなく、行動開始時のステート解除となっていました。この仕様を変更し、
 * きちんと終了時に働くように直します。
 *
 * 更に2つの自動解除条件も足されています。
 * 「行動開始時」と「戦闘開始時」です。
 * 下記のメモタグを使うと実行できます。
 *
 * ステートのメモタグ:
 *   <Action Start: x>
 *   <Action Start: x to y>
 *   このステートについては、行動開始時に残っているターン数でアップデート
 *   されます。x はそのターン数を表します。「x to y」を使った場合は
 *   xからyの間、ランダムに自動解除されます。
 *
 *   <Turn Start: x>
 *   <Turn Start: x to y>
 *   このステートについては、バトルターン開始時に残っているターン数で
 *   アップデートされます。x はそのターン数を表します。'x to y'を使った場合、
 *   xからyの間、ランダムに自動解除します。
 *
 * 「行動終了時」を選んだ場合は独特な仕様があり、もしステートのキャスターが
 * 現在のアクティブアクターであった場合、そして使用者にそのステートが適用
 * された場合は、「フリーターン」を得ることになります。この「フリーターン」は
 * 使用者が無駄に1ターンを使ってしまうことを防ぎます。
 * そうしなければ行動終了時にターン数が減るという仕様になっていて、
 * そのターンだけ効果が無駄になってしまいます。
 *
 * ============================================================================
 * Action Sequences
 * ============================================================================
 *
 * アクションシークエンスは、視覚的・機能的に
 * カスタマイズスキルを作成できる、基本的な命令です。
 * Battle Engine Coreには基礎的もののみが含まれていますが、
 * 将来的には、拡張プラグインのヘルプファイル内に、
 * カスタムアクションシークエンスの作成方法が収録される予定です。
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.50:
 * - Action sequences allow for unlimited arguments now.
 *
 * Version 1.49:
 * - Added failsafe for 'furthestRight()' errors.
 *
 * Version 1.48:
 * - Optimization update.
 *
 * Version 1.47:
 * - Bypass the isDevToolsOpen() error when bad code is inserted into a script
 * call or custom Lunatic Mode code segment due to updating to MV 1.6.1.
 *
 * Version 1.46:
 * - Updated for RPG Maker MV version 1.6.1.
 *
 * Version 1.45:
 * - Updated for RPG Maker MV version 1.5.0.
 *
 * Version 1.44:
 * - Fixed a bug where the enemy name windows disappear if you change scenes
 * mid-way through battle and return to it.
 *
 * Version 1.43b:
 * - Bug fixed to prevent crash if non-existent actions are used.
 * - Optimization update.
 *
 * Version 1.42:
 * - Optimization update.
 *
 * Version 1.41:
 * - Fixed a bug that allowed certain sprites to remain in the active pool
 * while party members were removed midway through battle.
 *
 * Version 1.40:
 * - Updated for RPG Maker MV version 1.3.2.
 *
 * Version 1.39c:
 * - Fixed a bug that caused dead actors to not be a part of action sequence
 * targeting for ”Not Focus”.
 * - Optimization update.
 * - Updated ”queueForceAction” to utilize both numbers and actual targets.
 *
 * Version 1.38a:
 * - Optimization update.
 * - Compatibility update for Selection Control v1.08.
 * - Bug fixed for mirrored animations on enemies.
 *
 * Version 1.37:
 * - Fixed a bug where if the enemy's size is too small, the enemy's name
 * during selection will be cut off.
 *
 * Version 1.36d:
 * - Made an update for the battle background image snaps when there is no
 * battleback being used. This will prevent the player party and enemy troop
 * from appearing in the background snapshot when entering menus mid-battle.
 * - 'Death Break' action sequence now only triggers upon dead status and not
 * an 'or 0 HP' condition.
 * - Updated Forced Action sequencing for more efficiency.
 * - 'Action Times+' traits now work properly for DTB again.
 * - Optimized message displaying for battle log.
 * - Optimized z sorting algorithm for sprites.
 *
 * Verison 1.35d:
 * - Scopes that target a dead ally will automatically target the first dead
 * ally now. Scopes that target all dead allies will lock onto the first dead
 * ally. This will hopefully provide less confusion amongst playing.
 * - Added anti-crash measure for sprite bitmaps.
 * - Added anti-crash measure for faux actions.
 * - Added anti-crash measure to prevent non-existant animations from playing.
 * - Added a check that prevents hidden battlers from appearing when using
 * certain action sequences.
 *
 * Version 1.34a:
 * - Fixed a bug where 'NOT FOCUS' targets were not including dead members.
 * - Fixed a bug where using NOT FOCUS would cause dead targets to be visible.
 *
 * Version 1.33:
 * - Updated for RPG Maker MV version 1.1.0.
 *
 * Version 1.32d:
 * - Fixed a bug that caused a crash when an actor died.
 * - Added a motion engine to be used for future plugins.
 * - Preparation for a future plugin.
 * - <Anchor X: y.z> and <Anchor Y: y.z> notetags for actors are now extended
 * to actors, classes, weapons, armors, and states.
 * - Added <Display Text: x> and <Display Icon: x> notetags for skills and
 * items. These notetags will alter the display name shown and icon shown
 * respectively while performing a skill.
 * - Switched Magic Reflect checking order with Counterattack checking order.
 * This is to give priority to reflected actions over countered actions.
 *
 * Version 1.31b:
 * - States with Action End now have a unique trait to them where if the caster
 * of the state is the current active battler (subject) and if the state is
 * then applied on the user itself, they will gain a 'free turn'. The 'free
 * turn' is to mitigate the user from losing 1 duration of the turn since with
 * an Action End timing, they would lose the benefit of being under the state
 * for that turn's timing.
 * - Added failsafes for Free Turns in case other plugins have overwritten the
 * on battle start functions.
 * - Added a compatibility update to Animated SV Enemies for dead motion.
 *
 * Version 1.30:
 * - Optimization update.
 * - Fixed a bug that prevented added state effects be unable to apply if they
 * are an added Death state.
 * - Battlelog lines are now able to display text codes.
 *
 * Version 1.29:
 * - Fixed a bug with the 'else if' action sequences not working in the right
 * order of sequence conditions.
 *
 * Version 1.28d:
 * - Fixed a bug if instant casting a skill that would make an opponent battler
 * to force an action to end incorrectly. Thanks to DoubleX for the fix.
 * - Fixed a bug with mouse over not working properly.
 * - Fixed a bug regarding forced actions that will cause the battle to freeze
 * if the forced action causes the main active subject to leave the battle.
 * - Fixed a bug with timed states not updating their turns properly.
 * - Changed priority of IF action sequences to higher to no longer interfere
 * other action sequences.
 *
 * Version 1.27:
 * - Mechanic change. This will only affect those using turn-based state timing
 * mechanics. Turn End state updates are now shifted from Turn End to occur at
 * Regeneration timing to have a more synchronized aspect. The timings are very
 * close so there's next to no notice in difference. Buff turn updates are also
 * moved to the regeneration timing, too.
 *
 * Version 1.26:
 * - Added 'Mouse Over' parameter to Selection Help. This parameter enables
 * mouse users to simply hover over the enemy to select them rather than having
 * to click an enemy twice to select them.
 *
 * Version 1.25f:
 * - Added failsafes for Forced Action queues.
 * - Added 'Show Select Box' parameter when selecting enemies.
 * - Fixed a bug that caused End Turn events to not function properly.
 * - Battle animations, by default, are positioned relative to the base bitmap
 * for its target sprite. However, actor sprites do not have a base bitmap and
 * therefore, battle animations, regardless of position, will always target the
 * actor sprite's feet. This update now gives actor sprites a base bitmap.
 * - Readjusted sprite width and sprite height calculations.
 * - Added a failsafe for when no sideview actor graphics are used.
 *
 * Version 1.24:
 * - Implemented a Forced Action queue list. This means if a Forced Action
 * takes place in the middle of an action, the action will resume after the
 * forced action finishes rather than cancels it out like MV does.
 * 
 * Version 1.23:
 * - Fixed a bug that didn't regenerate HP/MP/TP properly for tick-based.
 *
 * Version 1.22:
 * - Fixed a bug within MV that caused Forced Actions at Turn End to prompt and
 * trigger all turn-end related activities (such as regeneration and state turn
 * updating).
 * - Made a mechanic change so that Action Start and Action End state turns do
 * not update their turns through forced actions.
 *
 * Version 1.21:
 * - Fixed a bug where states Action End weren't going down properly with DTB.
 *
 * Version 1.20:
 * - Fixed a bug where revived actors using instant cast aren't properly set to
 * use actions immediately.
 *
 * Version 1.19:
 * - Added <Attack Animation: x> notetag for enemies.
 * - Added 'AI Self Turns' for Tick-Based Battles. Enemies can now have their
 * A.I. revolve around their own individual turns rather than the battle's.
 * - Mechanic change for states. Following suit with the change to Action End
 * removal, there are now two more conditions added: Action Start, Turn Start.
 * - Added <Action Start: x>, <Action Start: x to y>, <Turn Start: x>, and
 * <Turn Start: x to y> notetags for automatic state removal.
 *
 * Version 1.18:
 * - Fixed a bug with irregular targeting scopes.
 * - Fixed an MV-related bug with Recover All event not refreshing battlers.
 * 
 * Version 1.17b:
 * - Fixed a bug with action end states to remove multiple at once.
 * - Fixed a visual error with flinching sprites.
 * - Added 'Current Max' parameter to change HP current/max display in battle.
 * - Mechanic change for states that update on Action End to end at the end of
 * a battler's turn instead of at the start.
 * - Began preparations for another battle system.
 *
 * Version 1.16:
 * - Fixed an issue with mirrored enemies having mirrored state icons.
 *
 * Version 1.15a:
 * - Fixed a bug revolving the status window not updating.
 * - Updated default home position formula to better fit other party sizes.
 * New Home Position X:
 *   screenWidth - 16 - (maxSize + 2) * 32 + index * 32
 * New Home Position Y:
 *   screenHeight - statusHeight - maxSize * 48 + (index+1) * 48 - 16
 *
 * Version 1.14:
 * - Fixed a bug with Forced Actions locking out the battle.
 * - New mechanic: For tick-based battle systems, states with action-end will
 * go down in turns based on how many actions took place for the actor instead.
 * Previously, they were indistinguishable from states with Turn End removal.
 * - New mechanic: Using Instant Skills/Items from YEP_InstantCast.js will also
 * cause states with action-end to go down in turns upon using actions.
 *
 * Version 1.13a:
 * - Fixed a bug that made battlebacks disappear.
 * - Reworked visual enemy selection.
 * - Victory phase doesn't immediately display level up changes in battle
 * status window.
 * - Fixed a bug with the visual enemy select showing dead enemy names.
 *
 * Version 1.12b:
 * - If the Battle HUD has been hidden for whatever reason during the victory
 * sequence, it will be returned.
 * - Added <speed: +x> and <speed: -x> notetags to break past editor limits.
 * - Added new conditions where the battle won't end until all action sequences
 * have been fulfilled.
 *
 * Version 1.11:
 * - Fixed a bug that didn't show HP/MP Regeneration.
 *
 * Version 1.10:
 * - Removed immortal state dependancy. Immortality is now its own setting.
 * - Added more abbreviated variables for action speed calculation.
 * - Fixed a bug where all-scope attacks would reveal Appear-Halfway enemies.
 * - Fixed a bug where the battle wouldn't end if the final enemy was killed
 * by state damage.
 *
 * Version 1.09:
 * - Fixed a undefined actor bug for refreshing the status window.
 * - Added 'Show Shadows' parameter to the plugin settings.
 * - Reworked the default action sequences so that forced actions do not appear
 * on top of each other and party-heal animations occur simultaneously.
 *
 * Version 1.08:
 * - Fixed a bug where battlers gaining HP/MP in the damage formula for
 * themselves wouldn't trigger popups.
 * - Fixed a bug where if the party failed to escape from battle, states that
 * would be removed by battle still get removed. *Fixed by Emjenoeg*
 * - Fixed a bug where instant death skills didn't work.
 * - Changed Sprite Priority settings to decide whether actors, enemies, or
 * neither would always be on top.
 *
 * Version 1.07:
 * - Optimized status window to refresh at a minimum.
 * - Set up frame work for future plugins:
 * - Added 'Escape Ratio' and 'Fail Escape Boost' to parameters to allow users
 * to set the escape ratio they want.
 * - Added 'Front Sprite Priority' and 'Side Sprite Priority' to parameters to
 * dictate if actor sprites are always on top.
 * - Added 'Tick-Settings' category for tick-based battle systems.
 *
 * Version 1.06:
 * - Fixed a bug that causes dead actors at the start of battle to not spawn.
 * - Fixed a bug where the help window on an empty slot would show the
 * previous skill's message.
 *
 * Version 1.05:
 * - Added new target typing: Character X, which allows you to select
 * specifically the actor with an actor ID of X if he/she/it is in the party.
 * - Fixed a bug that prevented Miss and Evade popups from showing.
 *
 * Version 1.04:
 * - Fixed a bug where popups didn't show under certain animation types.
 * - Fixed certain battler motions from not refreshing correctly.
 * - Actions with no scope will not trigger the confirmation selection window.
 *
 * Version 1.03:
 * - Added 'Wait for Effect' action sequence.
 * - Actions now wait for effects (such as collapsing) to be done before
 * continuing on with battle or to end battle.
 *
 * Version 1.02:
 * - Fixed a bug where the help window would retain descriptions on no skills.
 * - Synched up weapons with actor sprites so they would occur simultaneously.
 * - Fixed an issue where requesting certain motions from enemies that don't
 * exist would cause them to crash.
 *
 * Version 1.01:
 * - Skills and items that affect both HP and MP will now show popups for both.
 *
 * Version 1.00:
 * - Finished plugin!
 *//*:ja
 * @plugindesc v1.50 戦闘システムをカスタムし、様々な要素を変更することができます
 * @author Yanfly Engine Plugins
 *
 * @param ---一般---
 * @default
 *
 * @param Action Speed
 * @parent ---一般---
 * @desc アクションの基本となるスピードを変更する式
 * Default: agi + Math.randomInt(Math.floor(5 + agi / 4))
 * @default agi
 *
 * @param Default System
 * @parent ---一般---
 * @type select
 * @option デフォルト・ターン戦闘
 * @value dtb
 * @option アクティブ・ターン戦闘（要別プラグイン）
 * @value atb
 * @option チャージ・ターン戦闘（要別プラグイン）
 * @value ctb
 * @option スタンダード・ターン戦闘（要別プラグイン）
 * @value stb
 * @desc ゲームで使われるデフォルトの戦闘システム
 * Default: dtb
 * @default dtb
 *
 * @param ---逃走---
 * @default
 *
 * @param Escape Ratio
 * @parent ---逃走---
 * @desc 逃走の成功率を変更する式
 * Default: 0.5 * $gameParty.agility() / $gameTroop.agility()
 * @default 0.5 * $gameParty.agility() / $gameTroop.agility()
 *
 * @param Fail Escape Boost
 * @parent ---逃走---
 * @type number
 * @decimals 2
 * @desc 逃走を失敗する度に、この確率だけ成功率を上げます。
 * @default 0.10
 *
 * @param ---アニメーション---
 * @default
 *
 * @param Animation Base Delay
 * @parent ---アニメーション---
 * @type number
 * @min 0
 * @desc アニメーション間のベース遅延量設定
 * Default: 8
 * @default 0
 *
 * @param Animation Next Delay
 * @parent ---アニメーション---
 * @type number
 * @min 0
 * @desc アニメーション間の連続的な遅延量設定
 * Default: 12
 * @default 0
 *
 * @param Certain Hit Animation
 * @parent ---アニメーション---
 * @type number
 * @min 0
 * @desc 必ず命中するスキルに対するデフォルトアニメーションを設定。不要な場合は0
 * @default 0
 *
 * @param Physical Animation
 * @parent ---アニメーション---
 * @type number
 * @min 0
 * @desc 物理スキルに対するデフォルトアニメーションを設定。不要な場合は0
 * @default 52
 *
 * @param Magical Animation
 * @parent ---アニメーション---
 * @type number
 * @min 0
 * @desc 魔法スキルに対するデフォルトアニメーションを設定。不要な場合は0
 * @default 51
 *
 * @param Enemy Attack Animation
 * @parent ---アニメーション---
 * @type number
 * @min 0
 * @desc 敵のデフォルト攻撃アニメーション設定
 * Default: 0
 * @default 39
 *
 * @param Reflect Animation
 * @parent ---アニメーション---
 * @type number
 * @min 0
 * @desc 魔法攻撃が反射した時のアニメーション設定
 * @default 42
 *
 * @param Motion Waiting
 * @parent ---アニメーション---
 * @type boolean
 * @on 行動後
 * @off 行動中
 * @desc アニメーション再生タイミングを設定。行動中 - false   行動後 - true   デフォルト: false
 * @default false
 *
 * @param ---フロントビュー---
 * @default
 *
 * @param Front Position X
 * @parent ---フロントビュー---
 * @desc アクターのホームポジション X 軸の式
 * Default: 0
 * @default Graphics.boxWidth / 8 + Graphics.boxWidth / 4 * index
 *
 * @param Front Position Y
 * @parent ---フロントビュー---
 * @desc アクターのホームポジション Y 軸の式
 * Default: 0
 * @default Graphics.boxHeight - 180
 *
 * @param Front Actor Sprite
 * @parent ---フロントビュー---
 * @type boolean
 * @on 表示
 * @off 非表示
 * @desc フロントビューでのアクターのスプライト表示
 * 非表示 - false   表示 - true   デフォルト - false
 * @default false
 *
 * @param Front Sprite Priority
 * @parent ---フロントビュー---
 * @type select
 * @option 通常
 * @value 0
 * @option アクターがトップ
 * @value 1
 * @option 敵がトップ
 * @value 2
 * @desc アクターのスプライトを常に手前に表示するかどうか設定
 * 0 - 通常   1 - アクターが手前   2 - 敵が手前
 * @default 1
 *
 * @param ---サイドビュー---
 * @default
 *
 * @param Home Position X
 * @parent ---サイドビュー---
 * @desc アクターのホームポジション X 軸の式
 * Default: 600 + index * 32
 * @default screenWidth - 16 - (maxSize + 2) * 32 + index * 32
 *
 * @param Home Position Y
 * @parent ---サイドビュー---
 * @desc アクターのホームポジション Y 軸の式
 * Default: 280 + index * 48
 * @default screenHeight - statusHeight - maxSize * 48 + (index+1) * 48 - 32
 *
 * @param Side Sprite Priority
 * @parent ---サイドビュー---
 * @type select
 * @option 通常
 * @value 0
 * @option アクターがトップ
 * @value 1
 * @option 敵がトップ
 * @value 2
 * @desc 常に手前に表示するスプライトを設定
 * 0 - 通常   1 - アクターが手前   2 - 敵が手前
 * @default 1
 *
 * @param ---スプライト---
 * @default
 *
 * @param Default X Anchor
 * @parent ---スプライト---
 * @type number
 * @decimals 2
 * @desc スプライトを固定する際のX軸の値設定
 * Default: 0.50
 * @default 0.50
 *
 * @param Default Y Anchor
 * @parent ---スプライト---
 * @type number
 * @decimals 2
 * @desc スプライトを固定する際のY軸の値設定
 * Default: 1.00
 * @default 1.00
 *
 * @param Step Distance
 * @parent ---スプライト---
 * @type number
 * @desc アクション時、ユニットが前に踏み出す距離を設定
 * Default: 48
 * @default 48
 *
 * @param Flinch Distance
 * @parent ---スプライト---
 * @type number
 * @desc ダメージを受けた際、ユニットがひるむ(後退する)距離を設定
 * @default 12
 *
 * @param Show Shadows
 * @parent ---スプライト---
 * @type boolean
 * @on 表示
 * @off 非表示
 * @desc アクター下に影を表示
 * 非表示 - false     表示 - true
 * @default true
 *
 * @param ---ダメージポップアップ---
 * @default
 *
 * @param Popup Duration
 * @parent ---ダメージポップアップ---
 * @type number
 * @min 1
 * @desc ポップアップが何フレーム分表示されるか設定
 * Default: 90
 * @default 128
 *
 * @param Newest Popup Bottom
 * @parent ---ダメージポップアップ---
 * @type boolean
 * @on 下
 * @off 上
 * @desc 最新のポップアップの表示場所
 * 下 - false   上 - true
 * @default true
 *
 * @param Popup Overlap Rate
 * @parent ---ダメージポップアップ---
 * @type number
 * @decimals 1
 * @desc 複数のダメージ表示が重なった際の、それぞれのスプライトのバッファを設定
 * @default 0.9
 *
 * @param Critical Popup
 * @parent ---ダメージポップアップ---
 * @desc クリティカルヒットした際の、ポップアップの点滅色を設定
 * Default: 255, 0, 0, 160
 * @default 255, 0, 0, 160
 *
 * @param Critical Duration
 * @parent ---ダメージポップアップ---
 * @type number
 * @min 1
 * @desc クリティカルヒットした際の、点滅が何フレーム続くか設定
 * Default: 60
 * @default 60
 *
 * @param ---ティック設定---
 * @default
 *
 * @param Timed States
 * @parent ---ティック設定---
 * @type boolean
 * @on 時間式
 * @off ターン式
 * @desc バトルシステムがティック制になっている時、ステートをどちらにしますか？時間式 - false   ターン式 - true
 * @default false
 *
 * @param Timed Buffs
 * @parent ---ティック設定---
 * @type boolean
 * @on 時間式
 * @off ターン式
 * @desc バトルシステムがティック制になってる時、バフをどちらにしますか？ ターン式 - false   時間式 - true
 * @default false
 *
 * @param Turn Time
 * @parent ---ティック設定---
 * @type number
 * @min 1
 * @desc ティックの何回分で1ターンにしますか？
 * @default 100
 * 
 * @param AI Self Turns
 * @parent ---ティック設定---
 * @type boolean
 * @on YES
 * @off NO
 * @desc AIを、AI独自のターンに基づいて行動させますか？
 * NO - false   YES - true	
 * @default true
 *
 * @param ---ウィンドウ設定---
 * @default
 *
 * @param Lower Windows
 * @parent ---ウィンドウ設定---
 * @type boolean
 * @on 下部
 * @off デフォルト
 * @desc スキルとアイテムウィンドウの表示位置
 * デフォルト - false   下部 - true
 * @default true
 *
 * @param Window Rows
 * @parent ---ウィンドウ設定---
 * @number
 * @min 1
 * @desc 下部ウィンドウを使用する際、表示列数を設定
 * @default 4
 *
 * @param Command Window Rows
 * @parent ---ウィンドウ設定---
 * @type number
 * @min 1
 * @desc コマンドウィンドウの表示列数を設定
 * Default: 4
 * @default 4
 *
 * @param Command Alignment
 * @parent ---ウィンドウ設定---
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc パーティ/アクターコマンドのテキスト位置を設定
 * Default: left
 * @default center
 *
 * @param Start Actor Command
 * @parent ---ウィンドウ設定---
 * @type boolean
 * @on アクター
 * @off パーティ
 * @desc ターン開始時のコマンド
 * パーティ - false     アクター - true
 * @default true
 *
 * @param Current Max
 * @parent ---ウィンドウ設定---
 * @type boolean
 * @on 現在値 / 最大値
 * @off 現在値のみ
 * @desc 現在のHP/MPの表示形式。現在値のみ - false   現在値 / 最大値 - true   デフォルト: true
 * @default false
 *
 * @param ---選択ヘルプ---
 * @default
 *
 * @param Mouse Over
 * @parent ---選択ヘルプ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc マウスを敵に乗せた時に自動的に選択しますか？
 * NO - false     YES - true
 * @default true
 *
 * @param Select Help Window
 * @parent ---選択ヘルプ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc アクター、敵を選択した際にヘルプウィンドウの表示設定。NO - false   YES - true
 * @default true
 *
 * @param User Help Text
 * @parent ---選択ヘルプ---
 * @desc ヘルプウィンドウ内で”使用者”の表示テキスト
 * @default 使用者
 *
 * @param Ally Help Text
 * @parent ---選択ヘルプ---
 * @desc ヘルプウィンドウ内で”味方”(単数)の表示テキスト
 * @default 味方
 *
 * @param Allies Help Text
 * @parent ---選択ヘルプ---
 * @desc ヘルプウィンドウ内で”味方”(複数)の表示テキスト
 * @default 味方
 *
 * @param Enemy Help Text
 * @parent ---選択ヘルプ---
 * @desc ヘルプウィンドウ内で”敵”(単数)の表示テキスト
 * @default 敵
 *
 * @param Enemies Help Text
 * @parent ---選択ヘルプ---
 * @desc ヘルプウィンドウ内で”敵”(複数)の表示テキスト
 * @default 敵
 *
 * @param All Help Text
 * @parent ---選択ヘルプ---
 * @desc 対象のグループ全体を選択した際の表示テキスト設定
 * %1 - 対象となるグループ (味方/敵)
 * @default 全ての %1
 *
 * @param Random Help Text
 * @parent ---選択ヘルプ---
 * @desc ランダム対象を選択した際の表示テキスト設定
 * %1 - 対象となるグループ (味方/敵)     %2 - 数
 * @default ランダムな %1 %2 回
 *
 * @param ---エネミーセレクト---
 * @default
 *
 * @param Visual Enemy Select
 * @parent ---エネミーセレクト---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 敵の選択画面をより視覚的なものに変更しますか？
 * OFF - NO     YES - true
 * @default true
 *
 * @param Show Enemy Name
 * @parent ---エネミーセレクト---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Visual Enemy Selectで敵の名前の表示設定
 * NO - false     YES - true
 * @default true
 *
 * @param Show Select Box
 * @parent ---エネミーセレクト---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 敵を選択してる枠の表示設定
 * NO - false     YES - true
 * @default false
 *
 * @param Enemy Font Size
 * @parent ---エネミーセレクト---
 * @type number
 * @min 1
 * @desc 敵の名前のフォントサイズを変更します
 * Default: 28
 * @default 20
 *
 * @param Enemy Auto Select
 * @parent ---エネミーセレクト---
 * @desc 最初に自動的に選択される敵を変更します
 * 左 - 0     右 - this.furthestRight()
 * @default this.furthestRight()
 *
 * @param ---アクターセレクト---
 * @default
 *
 * @param Visual Actor Select
 * @parent ---アクターセレクト---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 画面をクリックしてアクターを選択しますか？
 * NO - false   YES - true
 * @default true
 *
 * @param ---戦闘ログ---
 * @default
 *
 * @param Show Emerge Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 敵の出現時に、戦闘開始のテキストの表示設定
 * NO - false     YES - true
 * @default false
 *
 * @param Show Pre-Emptive Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 先制攻撃を受けた時に、テキストの表示設定
 * NO - false     YES - true
 * @default true
 *
 * @param Show Surprise Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 不意打ち攻撃を受けた時に、テキストの表示設定
 * NO - false     YES - true
 * @default true
 *
 * @param Optimize Speed
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc ベースラインログをカットして戦闘スピードの早くしますか？
 * NO - false     YES - true
 * @default true
 *
 * @param Show Action Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on フル
 * @off シンプル
 * @desc アクションテキストのフル表示/シンプル表示の切り替えを行います
 * シンプル - false     フル - true
 * @default false
 *
 * @param Show State Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc ステートに関する全てのテキストの表示設定
 * NO - false     YES - true
 * @default false
 *
 * @param Show Buff Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc バフの表示テキスト設定
 * NO - false     YES- true
 * @default false
 *
 * @param Show Counter Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc カウンター攻撃の表示テキスト設定
 * NO - false     YES- true
 * @default true
 *
 * @param Show Reflect Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 反射スペルの表示テキスト設定
 * NO - false     YES- true
 * @default true
 *
 * @param Show Substitute Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 置換ダメージの表示テキスト設定
 * NO - false     YES- true
 * @default true
 *
 * @param Show Fail Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 攻撃の失敗の表示テキスト設定
 * NO - false     YES- true
 * @default false
 *
 * @param Show Critical Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc クリティカルヒットの表示テキスト設定
 * NO - false     YES- true
 * @default false
 *
 * @param Show Miss Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc ミスアタックの表示テキスト設定
 * NO - false     YES- true
 * @default false
 *
 * @param Show Evasion Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 攻撃回避の表示テキスト設定
 * NO - false     YES- true
 * @default false
 *
 * @param Show HP Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc HPダメージまたは回復の表示テキスト設定
 * NO - false     YES- true
 * @default false
 *
 * @param Show MP Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc MP減少または回復の表示テキスト設定
 * NO - false     YES- true
 * @default false
 *
 * @param Show TP Text
 * @parent ---戦闘ログ---
 * @type boolean
 * @on YES
 * @off NO
 * @desc TP減少または回復の表示テキスト設定
 * NO - false     YES- true
 * @default false
 *
 * @help
 * 翻訳:ムノクラ
 * https://munokura.tk/
 * https://twitter.com/munokura/
 *
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * このプラグインは、デフォルトの戦闘システムに様々な変更を行うことで、
 * これまでのRPGとは一線を画した戦闘を可能にします。
 * 戦闘のログウィンドウ上部に表示されるテキストを選んだり、
 * またそれがどのように表示されるかを選ぶことができます。
 *
 * ============================================================================
 * Battle Messages
 * ============================================================================
 *
 * 戦闘時に表示される”用語”と”メッセージ”を変更する際は、
 * 下記のタグをメッセージのどこかに挿入することで
 * メッセージを戦闘ログの中央に表示させることができます。
 *
 *   <CENTER>
 *   このタグは頭に置くようにし、戦闘ログウィンドウに、
 *   メッセージを中央に配置する命令であると認識させるようにしてください。
 *
 * スキルとアイテムの表示を変えるためのメモタグが存在します。
 * 『ハロルドの攻撃』などの表示を変更することが出来ます。
 *
 * スキルとアイテムのメモタグ
 *
 *   <Display Text: x>
 *   表示されてるテキストを x に変更。
 *
 *   <Display Icon: x>
 *   表示されてるアイコンを x に変更。
 *
 * ============================================================================
 * Battle Windows
 * ============================================================================
 *
 * 戦闘システムをより直感的にするため、ウィンドウ設定を行います。
 * たとえば、パーティコマンドウィンドウ(戦う/逃げるウィンドウ)の代わりに
 * アクターコマンドウィンドウでターンを開始するといった方式が可能になります。
 * その際アクターウィンドウでキャンセルを押せば、
 * パーティコマンドウィンドウを表示させることもできます。
 *
 * ============================================================================
 * Battle Order
 * ============================================================================
 *
 * バトルのターンシステムについても修正が成されています。
 * 戦闘中に変化するAGI値を持ったバトラーには、
 * その変更を現在のターンから即反映させることができます。
 * アクションスピードの計算についても調整が成されており、
 * ランダム要因の微調整を行い、AGIを戦略的な能力値として
 * 有効なものにすることができます。
 *
 * スキルとアイテムのメモタグ
 *   <speed: +x>
 *   <speed: -x>
 *   エディタで制限されてる最大（2000）・最低（-2000)の数値
 *   以外でも設定する事が出来るようになり、よりアクションを自由にコントロール
 *   出来るようになります。
 *
 * ============================================================================
 * Multiple Hits
 * ============================================================================
 *
 * マルチヒットアクションの途中で対象が死亡した場合でも、
 * アクションが途中で終わってしまうことはありません。
 * この機能は不死身ステートを用いることで使用可能になるため、
 * データベース内のどこか不死身状態のIDを持っておく必要があります。
 * この機能が不要である場合、そのIDのパラメータを0に設定してください。
 *
 * ============================================================================
 * Popup Revamp
 * ============================================================================
 *
 * ダメージのポップアップについても変更が成されています。
 * デフォルトのものと見た目の変化はありませんが、
 * ポップアップ生成のプロセスが変更されています。
 * これまで、ポップアップは各フレーム毎に1つずつの表示となっていましたが、
 * 本変更では、同時に起こったアクションに対して、
 * 同フレーム内に全てのポップアップを表示することが可能になっています。
 * これにより、ダメージポップアップをスムーズに表示できるようになります。
 *
 * ============================================================================
 * Common Events
 * ============================================================================
 *
 * 敵のパーティが生存しているか否かに関わらず、
 * 各アクションの終わりにコモンイベントを起こすことができます。
 * アクションシークエンスのタグを用いれば、
 * スキルのコモンイベントをアクションの途中で呼び出すこともできます。
 * ただし、アクションの途中で別のアクションを強制的に実行した場合、
 * 前に実行していたアクションのシークエンスリストは
 * 無効になってしまうことに気を付けてください。 
 *
 * ============================================================================
 * Casting Animations
 * ============================================================================
 *
 * この機能を用いると、戦闘時にどのバトラーが次に行動をするか、
 * どのタイプのスキルを使うかという視覚的なヒントを
 * プレイヤーに与えることができます。
 * スキルに”振り”のアニメーションを付与することができ、
 * スキル毎に設定することも、全体に一括設定することも可能です。
 *
 * スキルメモタグ:
 *   <Cast Animation: x>
 *   アニメーションID x に、振りのアニメーションを付与します。
 *   xの値を0にすれば、アニメーションは設定されません。
 *
 * ============================================================================
 * Changing Battle Systems
 * ============================================================================
 *
 * プレイヤーが戦闘中でない際でも、プラグインコマンドを使えば
 * 戦闘システムを変更することができます。
 * 現在このプラグインには、デフォルトの戦闘システムのみが含まれています。
 *
 * プラグインコマンド:
 *   setBattleSys DTB      戦闘システムをデフォルトのターン制に設定します
 *
 * Battle Engine Coreを利用するその他の戦闘システムは、
 * 今後リリースされるプラグインに収録される予定です。
 *
 * ============================================================================
 * Sideview Actions
 * ============================================================================
 *
 * RPGツクールMVのサイドビュー/フロントビュー設定では
 * 反撃、魔法反射、メンバー交代の表示をすることができませんでした。
 * Battle Engine Coreを利用すれば、
 * サイドビュー設定のゲームにアニメーションを付与し、
 * より多くの視覚的な情報をプレイヤーに与えることができます。
 * 
 * Magic Reflectionを使えば、そのバトラーに魔法反射能力があることを
 * アニメーションで表すことができます。
 * このアニメーションはパラメータによって変更することが可能です。
 * また特定のアクター、職業、敵、武器、防具、ステートにも、
 * アニメーションを付与することができます。
 *
 * アクター、職業、敵、武器、防具、ステートのメモタグ：
 *   <Reflect Animation ID: x>
 *   xに対して反射のアニメーションの変更を行うことができます。
 *   下記の優先順位で適用されます
 *   アクター＞職業＞敵＞武器＞防具＞ステート＞デフォルト
 *
 * 敵、もしくは特定のアクターの動作を封じたい時は、
 * 下記のメモタグを用いてください。
 * 
 * アクター、職業、敵、武器、防具、ステートのメモタグ：
 *   <Sprite Cannot Move>
 *   バトラーの動きを封じます。
 *   下記の優先順位で適用されます
 *   アクター＞職業＞敵＞武器＞防具＞ステート
 * この状態で敵がアクションを取ると、フロントビュー表示時と同様、白く光ります。
 *
 * ============================================================================
 * Custom Sideview Battler Anchor
 * ============================================================================
 *
 * サイドビュー時バトラーは通常、水平方向に集約され、直立して配置されますが、
 * このカスタマイズで、通常とは異なる向きにバトラーを固定することができます。
 *
 * アクター、職業、武器、防具、ステートのメモタグ:
 *   <Anchor X: y.z>
 *   <Anchor Y: y.z>
 *   アクターのサイドビューバトラーのアンカー固定位置を、
 *    y.zで設定することができます。
 *    デフォルトでは、Xアンカーは0.5、Yアンカーは1.0で設定されています。
 *    Xアンカーを左に動かすには、数値を0.5以下に、
 *    Yアンカーを上に動かすには、数値を1.0以下にしてください。
 *
 * もしアンカーが複数特性を持っていて、他のアンカーと関わってるのであれば
 * 下記の優先順位で適用されます。
 *
 *   ステート
 *   武器
 *   防具
 *   職業
 *   アクター
 *   デフォルト
 *
 * 優先順位は上から下となります。高ければ高いほど優先的になります。
 *
 * ============================================================================
 * Enemy Attack Animation
 * ============================================================================
 *
 * 以下のメモタグを使えば、敵にオリジナル攻撃アニメーションを付与できます。
 *
 * 敵のメモタグ:
 *   <Attack Animation: x>
 *   xに対して敵のデフォルト攻撃アニメーションの変更が出来ます。
 *
 * ============================================================================
 * Automatic State Removal Conditions
 * ============================================================================
 *
 * RPG Maker MVのデフォルトバトルシステムでは下記の3つの条件でステートの自動
 * 解除を実行することが出来ます。：「なし」、「行動終了時」、「戦闘終了時」。
 *
 * 「なし」と「戦闘終了時」は想定通りに動いてますが、「行動終了時」は、終了時
 * ではなく、行動開始時のステート解除となっていました。この仕様を変更し、
 * きちんと終了時に働くように直します。
 *
 * 更に2つの自動解除条件も足されています。
 * 「行動開始時」と「戦闘開始時」です。
 * 下記のメモタグを使うと実行できます。
 *
 * ステートのメモタグ:
 *   <Action Start: x>
 *   <Action Start: x to y>
 *   このステートについては、行動開始時に残っているターン数でアップデート
 *   されます。x はそのターン数を表します。「x to y」を使った場合は
 *   xからyの間、ランダムに自動解除されます。
 *
 *   <Turn Start: x>
 *   <Turn Start: x to y>
 *   このステートについては、バトルターン開始時に残っているターン数で
 *   アップデートされます。x はそのターン数を表します。'x to y'を使った場合、
 *   xからyの間、ランダムに自動解除します。
 *
 * 「行動終了時」を選んだ場合は独特な仕様があり、もしステートのキャスターが
 * 現在のアクティブアクターであった場合、そして使用者にそのステートが適用
 * された場合は、「フリーターン」を得ることになります。この「フリーターン」は
 * 使用者が無駄に1ターンを使ってしまうことを防ぎます。
 * そうしなければ行動終了時にターン数が減るという仕様になっていて、
 * そのターンだけ効果が無駄になってしまいます。
 *
 * ============================================================================
 * Action Sequences
 * ============================================================================
 *
 * アクションシークエンスは、視覚的・機能的に
 * カスタマイズスキルを作成できる、基本的な命令です。
 * Battle Engine Coreには基礎的もののみが含まれていますが、
 * 将来的には、拡張プラグインのヘルプファイル内に、
 * カスタムアクションシークエンスの作成方法が収録される予定です。
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.50:
 * - Action sequences allow for unlimited arguments now.
 *
 * Version 1.49:
 * - Added failsafe for 'furthestRight()' errors.
 *
 * Version 1.48:
 * - Optimization update.
 *
 * Version 1.47:
 * - Bypass the isDevToolsOpen() error when bad code is inserted into a script
 * call or custom Lunatic Mode code segment due to updating to MV 1.6.1.
 *
 * Version 1.46:
 * - Updated for RPG Maker MV version 1.6.1.
 *
 * Version 1.45:
 * - Updated for RPG Maker MV version 1.5.0.
 *
 * Version 1.44:
 * - Fixed a bug where the enemy name windows disappear if you change scenes
 * mid-way through battle and return to it.
 *
 * Version 1.43b:
 * - Bug fixed to prevent crash if non-existent actions are used.
 * - Optimization update.
 *
 * Version 1.42:
 * - Optimization update.
 *
 * Version 1.41:
 * - Fixed a bug that allowed certain sprites to remain in the active pool
 * while party members were removed midway through battle.
 *
 * Version 1.40:
 * - Updated for RPG Maker MV version 1.3.2.
 *
 * Version 1.39c:
 * - Fixed a bug that caused dead actors to not be a part of action sequence
 * targeting for ”Not Focus”.
 * - Optimization update.
 * - Updated ”queueForceAction” to utilize both numbers and actual targets.
 *
 * Version 1.38a:
 * - Optimization update.
 * - Compatibility update for Selection Control v1.08.
 * - Bug fixed for mirrored animations on enemies.
 *
 * Version 1.37:
 * - Fixed a bug where if the enemy's size is too small, the enemy's name
 * during selection will be cut off.
 *
 * Version 1.36d:
 * - Made an update for the battle background image snaps when there is no
 * battleback being used. This will prevent the player party and enemy troop
 * from appearing in the background snapshot when entering menus mid-battle.
 * - 'Death Break' action sequence now only triggers upon dead status and not
 * an 'or 0 HP' condition.
 * - Updated Forced Action sequencing for more efficiency.
 * - 'Action Times+' traits now work properly for DTB again.
 * - Optimized message displaying for battle log.
 * - Optimized z sorting algorithm for sprites.
 *
 * Verison 1.35d:
 * - Scopes that target a dead ally will automatically target the first dead
 * ally now. Scopes that target all dead allies will lock onto the first dead
 * ally. This will hopefully provide less confusion amongst playing.
 * - Added anti-crash measure for sprite bitmaps.
 * - Added anti-crash measure for faux actions.
 * - Added anti-crash measure to prevent non-existant animations from playing.
 * - Added a check that prevents hidden battlers from appearing when using
 * certain action sequences.
 *
 * Version 1.34a:
 * - Fixed a bug where 'NOT FOCUS' targets were not including dead members.
 * - Fixed a bug where using NOT FOCUS would cause dead targets to be visible.
 *
 * Version 1.33:
 * - Updated for RPG Maker MV version 1.1.0.
 *
 * Version 1.32d:
 * - Fixed a bug that caused a crash when an actor died.
 * - Added a motion engine to be used for future plugins.
 * - Preparation for a future plugin.
 * - <Anchor X: y.z> and <Anchor Y: y.z> notetags for actors are now extended
 * to actors, classes, weapons, armors, and states.
 * - Added <Display Text: x> and <Display Icon: x> notetags for skills and
 * items. These notetags will alter the display name shown and icon shown
 * respectively while performing a skill.
 * - Switched Magic Reflect checking order with Counterattack checking order.
 * This is to give priority to reflected actions over countered actions.
 *
 * Version 1.31b:
 * - States with Action End now have a unique trait to them where if the caster
 * of the state is the current active battler (subject) and if the state is
 * then applied on the user itself, they will gain a 'free turn'. The 'free
 * turn' is to mitigate the user from losing 1 duration of the turn since with
 * an Action End timing, they would lose the benefit of being under the state
 * for that turn's timing.
 * - Added failsafes for Free Turns in case other plugins have overwritten the
 * on battle start functions.
 * - Added a compatibility update to Animated SV Enemies for dead motion.
 *
 * Version 1.30:
 * - Optimization update.
 * - Fixed a bug that prevented added state effects be unable to apply if they
 * are an added Death state.
 * - Battlelog lines are now able to display text codes.
 *
 * Version 1.29:
 * - Fixed a bug with the 'else if' action sequences not working in the right
 * order of sequence conditions.
 *
 * Version 1.28d:
 * - Fixed a bug if instant casting a skill that would make an opponent battler
 * to force an action to end incorrectly. Thanks to DoubleX for the fix.
 * - Fixed a bug with mouse over not working properly.
 * - Fixed a bug regarding forced actions that will cause the battle to freeze
 * if the forced action causes the main active subject to leave the battle.
 * - Fixed a bug with timed states not updating their turns properly.
 * - Changed priority of IF action sequences to higher to no longer interfere
 * other action sequences.
 *
 * Version 1.27:
 * - Mechanic change. This will only affect those using turn-based state timing
 * mechanics. Turn End state updates are now shifted from Turn End to occur at
 * Regeneration timing to have a more synchronized aspect. The timings are very
 * close so there's next to no notice in difference. Buff turn updates are also
 * moved to the regeneration timing, too.
 *
 * Version 1.26:
 * - Added 'Mouse Over' parameter to Selection Help. This parameter enables
 * mouse users to simply hover over the enemy to select them rather than having
 * to click an enemy twice to select them.
 *
 * Version 1.25f:
 * - Added failsafes for Forced Action queues.
 * - Added 'Show Select Box' parameter when selecting enemies.
 * - Fixed a bug that caused End Turn events to not function properly.
 * - Battle animations, by default, are positioned relative to the base bitmap
 * for its target sprite. However, actor sprites do not have a base bitmap and
 * therefore, battle animations, regardless of position, will always target the
 * actor sprite's feet. This update now gives actor sprites a base bitmap.
 * - Readjusted sprite width and sprite height calculations.
 * - Added a failsafe for when no sideview actor graphics are used.
 *
 * Version 1.24:
 * - Implemented a Forced Action queue list. This means if a Forced Action
 * takes place in the middle of an action, the action will resume after the
 * forced action finishes rather than cancels it out like MV does.
 * 
 * Version 1.23:
 * - Fixed a bug that didn't regenerate HP/MP/TP properly for tick-based.
 *
 * Version 1.22:
 * - Fixed a bug within MV that caused Forced Actions at Turn End to prompt and
 * trigger all turn-end related activities (such as regeneration and state turn
 * updating).
 * - Made a mechanic change so that Action Start and Action End state turns do
 * not update their turns through forced actions.
 *
 * Version 1.21:
 * - Fixed a bug where states Action End weren't going down properly with DTB.
 *
 * Version 1.20:
 * - Fixed a bug where revived actors using instant cast aren't properly set to
 * use actions immediately.
 *
 * Version 1.19:
 * - Added <Attack Animation: x> notetag for enemies.
 * - Added 'AI Self Turns' for Tick-Based Battles. Enemies can now have their
 * A.I. revolve around their own individual turns rather than the battle's.
 * - Mechanic change for states. Following suit with the change to Action End
 * removal, there are now two more conditions added: Action Start, Turn Start.
 * - Added <Action Start: x>, <Action Start: x to y>, <Turn Start: x>, and
 * <Turn Start: x to y> notetags for automatic state removal.
 *
 * Version 1.18:
 * - Fixed a bug with irregular targeting scopes.
 * - Fixed an MV-related bug with Recover All event not refreshing battlers.
 * 
 * Version 1.17b:
 * - Fixed a bug with action end states to remove multiple at once.
 * - Fixed a visual error with flinching sprites.
 * - Added 'Current Max' parameter to change HP current/max display in battle.
 * - Mechanic change for states that update on Action End to end at the end of
 * a battler's turn instead of at the start.
 * - Began preparations for another battle system.
 *
 * Version 1.16:
 * - Fixed an issue with mirrored enemies having mirrored state icons.
 *
 * Version 1.15a:
 * - Fixed a bug revolving the status window not updating.
 * - Updated default home position formula to better fit other party sizes.
 * New Home Position X:
 *   screenWidth - 16 - (maxSize + 2) * 32 + index * 32
 * New Home Position Y:
 *   screenHeight - statusHeight - maxSize * 48 + (index+1) * 48 - 16
 *
 * Version 1.14:
 * - Fixed a bug with Forced Actions locking out the battle.
 * - New mechanic: For tick-based battle systems, states with action-end will
 * go down in turns based on how many actions took place for the actor instead.
 * Previously, they were indistinguishable from states with Turn End removal.
 * - New mechanic: Using Instant Skills/Items from YEP_InstantCast.js will also
 * cause states with action-end to go down in turns upon using actions.
 *
 * Version 1.13a:
 * - Fixed a bug that made battlebacks disappear.
 * - Reworked visual enemy selection.
 * - Victory phase doesn't immediately display level up changes in battle
 * status window.
 * - Fixed a bug with the visual enemy select showing dead enemy names.
 *
 * Version 1.12b:
 * - If the Battle HUD has been hidden for whatever reason during the victory
 * sequence, it will be returned.
 * - Added <speed: +x> and <speed: -x> notetags to break past editor limits.
 * - Added new conditions where the battle won't end until all action sequences
 * have been fulfilled.
 *
 * Version 1.11:
 * - Fixed a bug that didn't show HP/MP Regeneration.
 *
 * Version 1.10:
 * - Removed immortal state dependancy. Immortality is now its own setting.
 * - Added more abbreviated variables for action speed calculation.
 * - Fixed a bug where all-scope attacks would reveal Appear-Halfway enemies.
 * - Fixed a bug where the battle wouldn't end if the final enemy was killed
 * by state damage.
 *
 * Version 1.09:
 * - Fixed a undefined actor bug for refreshing the status window.
 * - Added 'Show Shadows' parameter to the plugin settings.
 * - Reworked the default action sequences so that forced actions do not appear
 * on top of each other and party-heal animations occur simultaneously.
 *
 * Version 1.08:
 * - Fixed a bug where battlers gaining HP/MP in the damage formula for
 * themselves wouldn't trigger popups.
 * - Fixed a bug where if the party failed to escape from battle, states that
 * would be removed by battle still get removed. *Fixed by Emjenoeg*
 * - Fixed a bug where instant death skills didn't work.
 * - Changed Sprite Priority settings to decide whether actors, enemies, or
 * neither would always be on top.
 *
 * Version 1.07:
 * - Optimized status window to refresh at a minimum.
 * - Set up frame work for future plugins:
 * - Added 'Escape Ratio' and 'Fail Escape Boost' to parameters to allow users
 * to set the escape ratio they want.
 * - Added 'Front Sprite Priority' and 'Side Sprite Priority' to parameters to
 * dictate if actor sprites are always on top.
 * - Added 'Tick-Settings' category for tick-based battle systems.
 *
 * Version 1.06:
 * - Fixed a bug that causes dead actors at the start of battle to not spawn.
 * - Fixed a bug where the help window on an empty slot would show the
 * previous skill's message.
 *
 * Version 1.05:
 * - Added new target typing: Character X, which allows you to select
 * specifically the actor with an actor ID of X if he/she/it is in the party.
 * - Fixed a bug that prevented Miss and Evade popups from showing.
 *
 * Version 1.04:
 * - Fixed a bug where popups didn't show under certain animation types.
 * - Fixed certain battler motions from not refreshing correctly.
 * - Actions with no scope will not trigger the confirmation selection window.
 *
 * Version 1.03:
 * - Added 'Wait for Effect' action sequence.
 * - Actions now wait for effects (such as collapsing) to be done before
 * continuing on with battle or to end battle.
 *
 * Version 1.02:
 * - Fixed a bug where the help window would retain descriptions on no skills.
 * - Synched up weapons with actor sprites so they would occur simultaneously.
 * - Fixed an issue where requesting certain motions from enemies that don't
 * exist would cause them to crash.
 *
 * Version 1.01:
 * - Skills and items that affect both HP and MP will now show popups for both.
 *
 * Version 1.00:
 * - Finished plugin!
 */