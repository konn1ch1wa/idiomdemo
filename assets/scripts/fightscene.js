// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       sprCharBg:{
           default: null,
           type: cc.Sprite
       },
       sprChar: {
           default: [],
           type: cc.Sprite
       },
       layChar: {
           default: [],
           type: cc.Sprite
       },
       txtMyChar: {
           default: [],
           type: cc.Label
       },
       txtChar: {
           default: [],
           type: cc.Label
       },
       txtMyIdiom: {
           default: [],
           type: cc.Label
       },
       txtDisIdiom: {
           default: [],
           type: cc.Label
       },
       sprDisIdiomBg: cc.Sprite,

       sprOverBg: cc.Sprite,
       txtOverTxt: cc.RichText,

       doubleTimeEclipse: 0,  // 双击判定
       doubleLastClick: '',  // 配合双击 是否点在同一控件上

       iIdiomNum: 0,
       lstAllIdiom: [],

       lstChar: [],
       lstMyChar: [],

       txtRound: cc.Label,
       iRoundNum: 1,
       txtLastTime: cc.Label,
       iLastTime: 0,
       iRoundTime: 0,
       lstAllChar: [],
       lstCurChar: [],
       mapChar: [],
       mapIdiom: [],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.initLayer();
        this.lstAllChar = ['犬', '犬', '牙', '牙', '交', '交', '错', '错', '日', '日', '薄', '薄', '西', '西', '山', '山', '如', '如', '坐', '坐', '春', '春', '风', '风', '入', '入', '木', '木', '三', '三', '分', '分', '上', '上', '行', '行', '下', '下', '效', '效', '舍', '舍', '身', '身', '求', '求', '法', '法', '生', '生', '灵', '灵', '涂', '涂', '炭', '炭', '不', '不', '可', '可', '理', '理', '喻', '喻', '朝', '朝', '秦', '秦', '暮', '暮', '楚', '楚', '无', '无', '人', '人', '问', '问', '津', '津'];
        this.lstCurChar = this.lstAllChar.slice(0);
        this.lstAllIdiom = ["犬牙交错", "日薄西山", "如坐春风", "入木三分", "上行下效", "舍身求法", "生灵涂炭", "不可理喻", "朝秦暮楚", "无人问津"];
        this.mapIdiom = new Map([['1,2,3,4', '犬牙交错'], ['6,7,8,9', '日薄西山'], ['11,12,13,14', '如坐春风'], ['16,17,18,19', '入木三分'], ['21,22,23,24', '上行下效'], ['26,27,28,29', '舍身求法'], ['31,32,33,34', '生灵涂炭'], ['36,37,38,39', '不可理喻'], ['41,42,43,44', '朝秦暮楚'], ['46,47,48,49', '无人问津']]);
        this.mapChar = new Map([['犬', 1], ['牙', 2], ['交', 3], ['错', 4], ['日', 6], ['薄', 7], ['西', 8], ['山', 9], ['如', 11], ['坐', 12], ['春', 13], ['风', 14], ['入', 16], ['木', 17], ['三', 18], ['分', 19], ['上', 21], ['行', 22], ['下', 23], ['效', 24], ['舍', 26], ['身', 27], ['求', 28], ['法', 29], ['生', 31], ['灵', 32], ['涂', 33], ['炭', 34], ['不', 36], ['可', 37], ['理', 38], ['喻', 39], ['朝', 41], ['秦', 42], ['暮', 43], ['楚', 44], ['无', 46], ['人', 47], ['问', 48], ['津', 49]]);
        console.log(this.getRandomArrayElements(this.lstAllChar, 5));
        this.setRound(this.iRoundNum);
        for (var i in this.txtDisIdiom){
            this.txtDisIdiom[i].string = this.lstAllIdiom[i];
        }
    },

    setRound: function(iRound) {
        // 设置回合信息
        this.txtRound.string = iRound.toString();
        this.iLastTime = this.iRoundTime;
        this.txtLastTime.string = this.iLastTime.toString();
        this.schedule(this.roundTimerCb, 1);
        this.dealLostChar();
        this.dealChar();
    },

    dealChar: function() {
        // 获取5个随机元素
        var lstChar = this.getRandomArrayElements(this.lstCurChar, 5);
        for (var i = 0; i < 5; i++){
            this.txtChar[i].string = lstChar[i];
            this.lstChar[i] = lstChar[i];
        }
        this.sprCharBg.node.active = true;
    },

    dealLostChar: function() {
        var lstCurChar = [];
        for (var i = 0; i < 8; i ++){
            if (Boolean(this.lstMyChar[i])){
                lstCurChar.push(this.lstMyChar[i]);
            }
        }
        var result = this.lstCurChar.filter(function(item1){
            return lstCurChar.every(function(item2){
                return item2 !== item1;
            });
        });
        this.lstCurChar = result;
    },

    roundTimerCb: function(){
        this.iLastTime -= 1;
        this.txtLastTime.string = this.iLastTime.toString();
        if (this.iLastTime <= 0){
            this.unschedule(this.roundTimerCb);
            this.iRoundNum += 1;
            this.setRound(this.iRoundNum);
        }
    },

    getRandomArrayElements: function(lst, count) {
        var shuffled = lst.slice(0), i = lst.length, min = i - count, temp, index;
        while ( i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    },

    initLayer: function(){
        this.sprCharBg.node.active = false;
        for (var i = 0; i < 5; ++i){
            this.sprChar[i].node.on(cc.Node.EventType.TOUCH_END, this.onChar, this);
        }
        for (var i = 0; i < 8; ++i){
            this.txtMyChar[i].string = '';
        }
        for (var i = 0; i < 3; i++){
            this.txtMyIdiom[i].string = '';
        }
        this.initMyCharDoubleClick();
    },

    initMyCharDoubleClick: function() {
        // 绑定双击事件
        for (var i = 0; i < 8; i++){
            this.layChar[i].node.on(cc.Node.EventType.TOUCH_END, function(event){
                // console.log('Time:' + this.doubleTimeEclipse);
                var sChar = event.target._name;
                var idx = Number(sChar[sChar.length - 1]) - 1;
                if (this.doubleTimeEclipse <= 36 && this.doubleLastClick === sChar){
                    this.deleteMyChar(idx)
                }
                this.doubleTimeEclipse = 0;
                this.doubleLastClick = sChar;
            }, this);
        }
    },

    deleteMyChar: function(idx) {
        // 删除文字栏中的文字
        var sChar = this.lstMyChar[idx];
        this.lstMyChar[idx] = '';
        this.txtMyChar[idx].string = '';
        console.log('double click:' + sChar);
    },

    onChar: function(event){
        // 绑定单击事件
        var sChar = event.target._name;
        this.selectChar(sChar);
    },

    selectChar: function(sName){
        // 选择文字
        var idx = sName[sName.length - 1];
        if (this.txtChar[idx - 1].string === ''){
            return;
        }
        // 删除选中文字
        this.txtChar[idx - 1].string = '';
        // 移动到自己的文字栏
        var sTxt = this.lstChar[idx - 1];
        this.insertChar(sTxt);
        // 每次选择后检查是否满足合成
        console.log('select char:' + sName);
        var result = this.checkIdiom(sTxt);
        if (result){
            if (this.iIdiomNum === 3){
                console.log("Win");
                this.gameOver('Win');
            }
        }
    },

    gameOver: function(sStatus) {
        this.sprOverBg.node.active = true;
        this.unschedule(this.roundTimerCb);
        var sTxt = this.txtOverTxt.string;
        sTxt = sTxt.replace('{status}', sStatus);
        this.txtOverTxt.string = sTxt;
    },

    checkIdiom: function(sTxt) {
        console.log(this.mapChar.get(sTxt));
        var lstTemp = [];
        for (var i = 0; i < 8; i++){
            if (!this.lstMyChar[i]){
                continue;
            }
            var idx = this.mapChar.get(this.lstMyChar[i]);
            lstTemp.push(idx);
        }
        if (lstTemp.length < 4){
            return;
        }
        lstTemp.sort();
        var lstSub = this.checkContinueous(lstTemp);
        for (var idx in lstSub){
            var lst = lstSub[idx];
            if (lst.length === 4){
                // 删除4个文字，组成成语
                this.enterIdiom(lst);
                return true;
            }
        }
        return false;
    },

    enterIdiom: function(lstIdiom) {
        for (var i = 0; i < 8; i++){
            var sChar = this.lstMyChar[i];
            if (!sChar){
                continue;
            }
            var iIdx = this.mapChar.get(sChar);
            if (lstIdiom.indexOf(iIdx) >= 0){
                this.deleteMyChar(i);
            }
        }
        var sIdiom = this.mapIdiom.get(lstIdiom.toString());
        this.txtMyIdiom[this.iIdiomNum].string = sIdiom;
        this.iIdiomNum += 1;
    },

    checkContinueous: function(arr) {
        // 检查连续子串
        var result = [], i = 0;
        result[i] = [arr[0]];
        arr.reduce(function(prev, cur){
            cur-prev === 1 ? result[i].push(cur) : result[++i] = [cur];
            return cur;
        });
        return result;
    },

    insertChar: function(sChar) {
        // 插入文字
        for (var i = 0; i < 8; i++){
            if (Boolean(this.lstMyChar[i])){
                continue;
            }
            console.log('insert:' + i + ":" + sChar);
            this.lstMyChar[i] = sChar;
            this.txtMyChar[i].string = sChar;
            break;
        }
    },

    onCharBtn: function(){
        // 控制选择UI显隐
        var bgActive = this.sprDisIdiomBg.node.active;
        this.sprDisIdiomBg.node.active = !bgActive;
    },

    onRestart: function(){
        cc.director.loadScene('StartScene');
    },

    setCharList: function(lstData) {
        this.lstChar = lstData.slice(0);
        for (var i = 0; i < 5; i++){
            this.txtChar[i].string = lstData[i];
        }
    },

    update (dt) {
        this.doubleTimeEclipse ++;
        if (this.doubleTimeEclipse > 60){
            this.doubleTimeEclipse = 60;
        }
    },
});
