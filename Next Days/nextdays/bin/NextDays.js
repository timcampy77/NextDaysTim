(function (console, $hx_exports, $global) { "use strict";
var $hxClasses = {},$estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw new js__$Boot_HaxeError("EReg::matched");
	}
	,__class__: EReg
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
Math.__name__ = ["Math"];
var Perf = $hx_exports.Perf = function(pos,offset) {
	if(offset == null) offset = 0;
	if(pos == null) pos = "TR";
	this._perfObj = window.performance;
	this._memoryObj = window.performance.memory;
	this._memCheck = this._perfObj != null && this._memoryObj != null && this._memoryObj.totalJSHeapSize > 0;
	this._raf = true;
	this.currentFps = 0;
	this.currentMs = 0;
	this.currentMem = "0";
	this._pos = pos;
	this._offset = offset;
	this._time = 0;
	this._ticks = 0;
	this._fpsMin = Infinity;
	this._fpsMax = 0;
	if(this._perfObj != null && ($_=this._perfObj,$bind($_,$_.now)) != null) this._startTime = this._perfObj.now(); else this._startTime = new Date().getTime();
	this._prevTime = -Perf.MEASUREMENT_INTERVAL;
	this._createFpsDom();
	this._createMsDom();
	if(this._memCheck) this._createMemoryDom();
	window.requestAnimationFrame($bind(this,this._tick));
};
$hxClasses["Perf"] = Perf;
Perf.__name__ = ["Perf"];
Perf.prototype = {
	_now: function() {
		if(this._perfObj != null && ($_=this._perfObj,$bind($_,$_.now)) != null) return this._perfObj.now(); else return new Date().getTime();
	}
	,_tick: function() {
		var time;
		if(this._perfObj != null && ($_=this._perfObj,$bind($_,$_.now)) != null) time = this._perfObj.now(); else time = new Date().getTime();
		this._ticks++;
		if(this._raf && time > this._prevTime + Perf.MEASUREMENT_INTERVAL) {
			this.currentMs = Math.round(time - this._startTime);
			this.ms.innerHTML = "MS: " + this.currentMs;
			this.currentFps = Math.round(this._ticks * 1000 / (time - this._prevTime));
			this._fpsMin = Math.min(this._fpsMin,this.currentFps);
			this._fpsMax = Math.max(this._fpsMax,this.currentFps);
			this.fps.innerHTML = "FPS: " + this.currentFps + " (" + this._fpsMin + "-" + this._fpsMax + ")";
			if(this.currentFps >= 30) this.fps.style.backgroundColor = Perf.FPS_BG_CLR; else if(this.currentFps >= 15) this.fps.style.backgroundColor = Perf.FPS_WARN_BG_CLR; else this.fps.style.backgroundColor = Perf.FPS_PROB_BG_CLR;
			this._prevTime = time;
			this._ticks = 0;
			if(this._memCheck) {
				this.currentMem = this._getFormattedSize(this._memoryObj.usedJSHeapSize,2);
				this.memory.innerHTML = "MEM: " + this.currentMem;
			}
		}
		this._startTime = time;
		if(this._raf) window.requestAnimationFrame(this._raf?$bind(this,this._tick):function() {
		});
	}
	,_createDiv: function(id,top) {
		if(top == null) top = 0;
		var div;
		var _this = window.document;
		div = _this.createElement("div");
		div.id = id;
		div.className = id;
		div.style.position = "absolute";
		var _g = this._pos;
		switch(_g) {
		case "TL":
			div.style.left = this._offset + "px";
			div.style.top = top + "px";
			break;
		case "TR":
			div.style.right = this._offset + "px";
			div.style.top = top + "px";
			break;
		case "BL":
			div.style.left = this._offset + "px";
			div.style.bottom = (this._memCheck?48:32) - top + "px";
			break;
		case "BR":
			div.style.right = this._offset + "px";
			div.style.bottom = (this._memCheck?48:32) - top + "px";
			break;
		}
		div.style.width = "80px";
		div.style.height = "12px";
		div.style.lineHeight = "12px";
		div.style.padding = "2px";
		div.style.fontFamily = Perf.FONT_FAMILY;
		div.style.fontSize = "9px";
		div.style.fontWeight = "bold";
		div.style.textAlign = "center";
		window.document.body.appendChild(div);
		return div;
	}
	,_createFpsDom: function() {
		this.fps = this._createDiv("fps");
		this.fps.style.backgroundColor = Perf.FPS_BG_CLR;
		this.fps.style.zIndex = "995";
		this.fps.style.color = Perf.FPS_TXT_CLR;
		this.fps.innerHTML = "FPS: 0";
	}
	,_createMsDom: function() {
		this.ms = this._createDiv("ms",16);
		this.ms.style.backgroundColor = Perf.MS_BG_CLR;
		this.ms.style.zIndex = "996";
		this.ms.style.color = Perf.MS_TXT_CLR;
		this.ms.innerHTML = "MS: 0";
	}
	,_createMemoryDom: function() {
		this.memory = this._createDiv("memory",32);
		this.memory.style.backgroundColor = Perf.MEM_BG_CLR;
		this.memory.style.color = Perf.MEM_TXT_CLR;
		this.memory.style.zIndex = "997";
		this.memory.innerHTML = "MEM: 0";
	}
	,_getFormattedSize: function(bytes,frac) {
		if(frac == null) frac = 0;
		var sizes = ["Bytes","KB","MB","GB","TB"];
		if(bytes == 0) return "0";
		var precision = Math.pow(10,frac);
		var i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round(bytes * precision / Math.pow(1024,i)) / precision + " " + sizes[i];
	}
	,addInfo: function(val) {
		this.info = this._createDiv("info",this._memCheck?48:32);
		this.info.style.backgroundColor = Perf.INFO_BG_CLR;
		this.info.style.color = Perf.INFO_TXT_CLR;
		this.info.style.zIndex = "998";
		this.info.innerHTML = val;
	}
	,clearInfo: function() {
		if(this.info != null) {
			window.document.body.removeChild(this.info);
			this.info = null;
		}
	}
	,destroy: function() {
		this._raf = false;
		this._perfObj = null;
		this._memoryObj = null;
		if(this.fps != null) {
			window.document.body.removeChild(this.fps);
			this.fps = null;
		}
		if(this.ms != null) {
			window.document.body.removeChild(this.ms);
			this.ms = null;
		}
		if(this.memory != null) {
			window.document.body.removeChild(this.memory);
			this.memory = null;
		}
		this.clearInfo();
	}
	,__class__: Perf
};
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js_Boot.__instanceof(v,t);
};
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw new js__$Boot_HaxeError("Too many arguments");
	}
	return null;
};
var _$UInt_UInt_$Impl_$ = {};
$hxClasses["_UInt.UInt_Impl_"] = _$UInt_UInt_$Impl_$;
_$UInt_UInt_$Impl_$.__name__ = ["_UInt","UInt_Impl_"];
_$UInt_UInt_$Impl_$.toFloat = function(this1) {
	var $int = this1;
	if($int < 0) return 4294967296.0 + $int; else return $int + 0.0;
};
var Xml = function(nodeType) {
	this.nodeType = nodeType;
	this.children = [];
	this.attributeMap = new haxe_ds_StringMap();
};
$hxClasses["Xml"] = Xml;
Xml.__name__ = ["Xml"];
Xml.parse = function(str) {
	return haxe_xml_Parser.parse(str);
};
Xml.createElement = function(name) {
	var xml = new Xml(Xml.Element);
	if(xml.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element but found " + xml.nodeType);
	xml.nodeName = name;
	return xml;
};
Xml.createPCData = function(data) {
	var xml = new Xml(Xml.PCData);
	if(xml.nodeType == Xml.Document || xml.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + xml.nodeType);
	xml.nodeValue = data;
	return xml;
};
Xml.createCData = function(data) {
	var xml = new Xml(Xml.CData);
	if(xml.nodeType == Xml.Document || xml.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + xml.nodeType);
	xml.nodeValue = data;
	return xml;
};
Xml.createComment = function(data) {
	var xml = new Xml(Xml.Comment);
	if(xml.nodeType == Xml.Document || xml.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + xml.nodeType);
	xml.nodeValue = data;
	return xml;
};
Xml.createDocType = function(data) {
	var xml = new Xml(Xml.DocType);
	if(xml.nodeType == Xml.Document || xml.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + xml.nodeType);
	xml.nodeValue = data;
	return xml;
};
Xml.createProcessingInstruction = function(data) {
	var xml = new Xml(Xml.ProcessingInstruction);
	if(xml.nodeType == Xml.Document || xml.nodeType == Xml.Element) throw new js__$Boot_HaxeError("Bad node type, unexpected " + xml.nodeType);
	xml.nodeValue = data;
	return xml;
};
Xml.createDocument = function() {
	return new Xml(Xml.Document);
};
Xml.prototype = {
	set: function(att,value) {
		if(this.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element but found " + this.nodeType);
		this.attributeMap.set(att,value);
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element but found " + this.nodeType);
		return this.attributeMap.exists(att);
	}
	,addChild: function(x) {
		if(this.nodeType != Xml.Document && this.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element or Document but found " + this.nodeType);
		if(x.parent != null) x.parent.removeChild(x);
		this.children.push(x);
		x.parent = this;
	}
	,removeChild: function(x) {
		if(this.nodeType != Xml.Document && this.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element or Document but found " + this.nodeType);
		if(HxOverrides.remove(this.children,x)) {
			x.parent = null;
			return true;
		}
		return false;
	}
	,__class__: Xml
};
var com_ragestudio_Main = function() {
	this.blackBarBot = new com_ragestudio_ui_screens_SpriteAmplified("black_bg");
	this.blackBarTop = new com_ragestudio_ui_screens_SpriteAmplified("black_bg");
	this.blackBarRight = new com_ragestudio_ui_screens_SpriteAmplified("black_bg");
	this.blackBarLeft = new com_ragestudio_ui_screens_SpriteAmplified("black_bg");
	this.frames = 0;
	EventEmitter.call(this);
	var lOptions = { };
	lOptions.backgroundColor = 10338426;
	com_ragestudio_utils_system_DeviceCapabilities.scaleViewport();
	this.renderer = PIXI.autoDetectRenderer(_$UInt_UInt_$Impl_$.toFloat(com_ragestudio_utils_system_DeviceCapabilities.get_width()),_$UInt_UInt_$Impl_$.toFloat(com_ragestudio_utils_system_DeviceCapabilities.get_height()),lOptions);
	this.renderer.roundPixels = true;
	window.document.body.appendChild(this.renderer.view);
	this.stage = new PIXI.Container();
	var lConfig = new PIXI.loaders.Loader();
	com_ragestudio_Main.configPath += "?" + new Date().getTime();
	lConfig.add(com_ragestudio_Main.configPath);
	lConfig.once("complete",$bind(this,this.preloadAssets));
	lConfig.load();
};
$hxClasses["com.ragestudio.Main"] = com_ragestudio_Main;
com_ragestudio_Main.__name__ = ["com","ragestudio","Main"];
com_ragestudio_Main.main = function() {
	com_ragestudio_Main.getInstance();
};
com_ragestudio_Main.getInstance = function() {
	if(com_ragestudio_Main.instance == null) com_ragestudio_Main.instance = new com_ragestudio_Main();
	return com_ragestudio_Main.instance;
};
com_ragestudio_Main.__super__ = EventEmitter;
com_ragestudio_Main.prototype = $extend(EventEmitter.prototype,{
	preloadAssets: function(pLoader) {
		com_ragestudio_utils_Config.init(Reflect.field(pLoader.resources,com_ragestudio_Main.configPath).data);
		if(com_ragestudio_utils_Config.get_debug()) com_ragestudio_utils_Debug.getInstance().init();
		if(com_ragestudio_utils_Config.get_debug() && com_ragestudio_utils_Config.get_data().boxAlpha != null) com_ragestudio_utils_game_StateGraphic.boxAlpha = com_ragestudio_utils_Config.get_data().boxAlpha;
		if(com_ragestudio_utils_Config.get_debug() && com_ragestudio_utils_Config.get_data().animAlpha != null) com_ragestudio_utils_game_StateGraphic.animAlpha = com_ragestudio_utils_Config.get_data().animAlpha;
		com_ragestudio_utils_system_DeviceCapabilities.init();
		com_ragestudio_utils_game_GameStage.getInstance().set_scaleMode(com_ragestudio_utils_game_GameStageScale.SHOW_ALL);
		com_ragestudio_utils_game_GameStage.getInstance().init($bind(this,this.render),2048,1366);
		com_ragestudio_utils_system_DeviceCapabilities.displayFullScreenButton();
		this.stage.addChild(com_ragestudio_utils_game_GameStage.getInstance());
		window.addEventListener("resize",$bind(this,this.resize));
		this.resize();
		com_ragestudio_ui_LoaderManager.getInstance().startLoadingProcess("preload",$bind(this,this.loadAssets));
	}
	,loadAssets: function(pLoader) {
		com_ragestudio_ui_LoaderManager.getInstance().startLoadingProcess("general",$bind(this,this.onLoadComplete));
		com_ragestudio_ui_UIManager.getInstance().openScreen(com_ragestudio_ui_screens_GraphicLoader.getInstance());
		this.gameLoop();
	}
	,onLoadComplete: function() {
		com_ragestudio_ui_UIManager.getInstance().openScreen(com_ragestudio_ui_screens_TitleCard.getInstance());
	}
	,gameLoop: function() {
		haxe_Timer.delay($bind(this,this.gameLoop),16);
		this.render();
		this.emit("gameLoop");
	}
	,resize: function(pEvent) {
		this.renderer.resize(_$UInt_UInt_$Impl_$.toFloat(com_ragestudio_utils_system_DeviceCapabilities.get_width()),_$UInt_UInt_$Impl_$.toFloat(com_ragestudio_utils_system_DeviceCapabilities.get_height()));
		com_ragestudio_utils_game_GameStage.getInstance().resize();
	}
	,render: function() {
		if(this.frames++ % 2 == 0) this.renderer.render(this.stage); else com_ragestudio_utils_game_GameStage.getInstance().updateTransform();
	}
	,destroy: function() {
		window.removeEventListener("resize",$bind(this,this.resize));
		com_ragestudio_Main.instance = null;
	}
	,__class__: com_ragestudio_Main
});
var com_ragestudio_game_GameManager = function() {
};
$hxClasses["com.ragestudio.game.GameManager"] = com_ragestudio_game_GameManager;
com_ragestudio_game_GameManager.__name__ = ["com","ragestudio","game","GameManager"];
com_ragestudio_game_GameManager.getInstance = function() {
	if(com_ragestudio_game_GameManager.instance == null) com_ragestudio_game_GameManager.instance = new com_ragestudio_game_GameManager();
	return com_ragestudio_game_GameManager.instance;
};
com_ragestudio_game_GameManager.prototype = {
	start: function() {
		com_ragestudio_ui_UIManager.getInstance().startGame();
		com_ragestudio_utils_game_GameStage.getInstance().getGameContainer().addChild(com_ragestudio_game_sprites_entities_Player.createPlayer());
		new com_ragestudio_game_sprites_GridManager();
		var _g = 0;
		var _g1 = com_ragestudio_game_sprites_entities_Player.getPlayers();
		while(_g < _g1.length) {
			var lPlayer = _g1[_g];
			++_g;
			lPlayer.x = 500;
			lPlayer.y = 500;
			lPlayer.start();
		}
		com_ragestudio_ui_CheatPanel.getInstance().ingame();
		com_ragestudio_Main.getInstance().on("gameLoop",$bind(this,this.gameLoop));
	}
	,gameLoop: function(pEvent) {
	}
	,destroy: function() {
		com_ragestudio_Main.getInstance().off("gameLoop",$bind(this,this.gameLoop));
		com_ragestudio_game_GameManager.instance = null;
	}
	,__class__: com_ragestudio_game_GameManager
};
var com_ragestudio_utils_game_GameObject = function() {
	PIXI.Container.call(this);
	this.on("added",$bind(this,this.updateTransform));
	this.setModeVoid();
};
$hxClasses["com.ragestudio.utils.game.GameObject"] = com_ragestudio_utils_game_GameObject;
com_ragestudio_utils_game_GameObject.__name__ = ["com","ragestudio","utils","game","GameObject"];
com_ragestudio_utils_game_GameObject.__super__ = PIXI.Container;
com_ragestudio_utils_game_GameObject.prototype = $extend(PIXI.Container.prototype,{
	forceUpdateTransform: function() {
		this.updateTransform();
	}
	,setModeVoid: function() {
		this.doAction = $bind(this,this.doActionVoid);
	}
	,doActionVoid: function() {
	}
	,setModeNormal: function() {
		this.doAction = $bind(this,this.doActionNormal);
	}
	,doActionNormal: function() {
	}
	,start: function() {
		this.setModeNormal();
	}
	,destroy: function() {
		this.setModeVoid();
		this.off("added",$bind(this,this.updateTransform));
		PIXI.Container.prototype.destroy.call(this,true);
	}
	,__class__: com_ragestudio_utils_game_GameObject
});
var com_ragestudio_utils_game_StateGraphic = function() {
	this.boxType = com_ragestudio_utils_game_BoxType.NONE;
	this.DEFAULT_STATE = "";
	this.BOX_SUFFIX = "box";
	this.ANIM_SUFFIX = "";
	com_ragestudio_utils_game_GameObject.call(this);
};
$hxClasses["com.ragestudio.utils.game.StateGraphic"] = com_ragestudio_utils_game_StateGraphic;
com_ragestudio_utils_game_StateGraphic.__name__ = ["com","ragestudio","utils","game","StateGraphic"];
com_ragestudio_utils_game_StateGraphic.set_textureDigits = function(pDigits) {
	com_ragestudio_utils_game_StateGraphic.digits = "";
	var _g = 0;
	while(_g < pDigits) {
		var i = _g++;
		com_ragestudio_utils_game_StateGraphic.digits += "0";
	}
	return com_ragestudio_utils_game_StateGraphic.textureDigits = pDigits;
};
com_ragestudio_utils_game_StateGraphic.addTextures = function(pJson) {
	var lFrames = Reflect.field(pJson,"frames");
	if(com_ragestudio_utils_game_StateGraphic.texturesDefinition == null) com_ragestudio_utils_game_StateGraphic.texturesDefinition = new haxe_ds_StringMap();
	if(com_ragestudio_utils_game_StateGraphic.texturesAnchor == null) com_ragestudio_utils_game_StateGraphic.texturesAnchor = new haxe_ds_StringMap();
	if(com_ragestudio_utils_game_StateGraphic.texturesCache == null) com_ragestudio_utils_game_StateGraphic.texturesCache = new haxe_ds_StringMap();
	if(com_ragestudio_utils_game_StateGraphic.digits == null) com_ragestudio_utils_game_StateGraphic.set_textureDigits(com_ragestudio_utils_game_StateGraphic.textureDigits);
	var lID;
	var lNum;
	var _g = 0;
	var _g1 = Reflect.fields(lFrames);
	while(_g < _g1.length) {
		var lName = _g1[_g];
		++_g;
		console.log(lName);
		lID = lName.split(".")[0];
		lNum = Std.parseInt(HxOverrides.substr(lID,-1 * com_ragestudio_utils_game_StateGraphic.textureDigits,null));
		if(lNum != null) lID = HxOverrides.substr(lID,0,lID.length - com_ragestudio_utils_game_StateGraphic.textureDigits);
		if(com_ragestudio_utils_game_StateGraphic.texturesDefinition.get(lID) == null) {
			var v;
			if(lNum == null) v = 1; else v = lNum;
			com_ragestudio_utils_game_StateGraphic.texturesDefinition.set(lID,v);
			v;
		} else if(lNum > com_ragestudio_utils_game_StateGraphic.texturesDefinition.get(lID)) {
			com_ragestudio_utils_game_StateGraphic.texturesDefinition.set(lID,lNum);
			lNum;
		}
		if(com_ragestudio_utils_game_StateGraphic.texturesAnchor.get(lID) == null) {
			var v1 = Reflect.field(lFrames,lName).pivot;
			com_ragestudio_utils_game_StateGraphic.texturesAnchor.set(lID,v1);
			v1;
		}
	}
};
com_ragestudio_utils_game_StateGraphic.clearTextures = function(pJson) {
	var lFrames = Reflect.field(pJson,"frames");
	if(com_ragestudio_utils_game_StateGraphic.texturesDefinition == null) return;
	var lID;
	var lNum;
	var _g = 0;
	var _g1 = Reflect.fields(lFrames);
	while(_g < _g1.length) {
		var lID1 = _g1[_g];
		++_g;
		lID1 = lID1.split(".")[0];
		lNum = Std.parseInt(HxOverrides.substr(lID1,-1 * com_ragestudio_utils_game_StateGraphic.textureDigits,null));
		if(lNum != null) lID1 = HxOverrides.substr(lID1,0,lID1.length - com_ragestudio_utils_game_StateGraphic.textureDigits);
		{
			com_ragestudio_utils_game_StateGraphic.texturesDefinition.set(lID1,null);
			null;
		}
		{
			com_ragestudio_utils_game_StateGraphic.texturesAnchor.set(lID1,null);
			null;
		}
		{
			com_ragestudio_utils_game_StateGraphic.texturesCache.set(lID1,null);
			null;
		}
	}
};
com_ragestudio_utils_game_StateGraphic.addBoxes = function(pJson) {
	if(com_ragestudio_utils_game_StateGraphic.boxesCache == null) com_ragestudio_utils_game_StateGraphic.boxesCache = new haxe_ds_StringMap();
	var lItem;
	var lObj;
	var _g = 0;
	var _g1 = Reflect.fields(pJson);
	while(_g < _g1.length) {
		var lName = _g1[_g];
		++_g;
		lItem = Reflect.field(pJson,lName);
		var v = new haxe_ds_StringMap();
		com_ragestudio_utils_game_StateGraphic.boxesCache.set(lName,v);
		v;
		var _g2 = 0;
		var _g3 = Reflect.fields(lItem);
		while(_g2 < _g3.length) {
			var lObjName = _g3[_g2];
			++_g2;
			lObj = Reflect.field(lItem,lObjName);
			if(lObj.type == "Rectangle") {
				var this1 = com_ragestudio_utils_game_StateGraphic.boxesCache.get(lName);
				var v1 = new PIXI.Rectangle(lObj.x,lObj.y,lObj.width,lObj.height);
				this1.set(lObjName,v1);
				v1;
			} else if(lObj.type == "Ellipse") {
				var this2 = com_ragestudio_utils_game_StateGraphic.boxesCache.get(lName);
				var v2 = new PIXI.Ellipse(lObj.x,lObj.y,lObj.width / 2,lObj.height / 2);
				this2.set(lObjName,v2);
				v2;
			} else if(lObj.type == "Circle") {
				var this3 = com_ragestudio_utils_game_StateGraphic.boxesCache.get(lName);
				var v3 = new PIXI.Circle(lObj.x,lObj.y,lObj.radius);
				this3.set(lObjName,v3);
				v3;
			} else if(lObj.type == "Point") {
				var this4 = com_ragestudio_utils_game_StateGraphic.boxesCache.get(lName);
				var v4 = new PIXI.Point(lObj.x,lObj.y);
				this4.set(lObjName,v4);
				v4;
			}
		}
	}
};
com_ragestudio_utils_game_StateGraphic.__super__ = com_ragestudio_utils_game_GameObject;
com_ragestudio_utils_game_StateGraphic.prototype = $extend(com_ragestudio_utils_game_GameObject.prototype,{
	setAnimEnd: function() {
		this.isAnimEnd = true;
	}
	,setState: function(pState,pLoop,pAutoPlay,pStart) {
		if(pStart == null) pStart = 0;
		if(pAutoPlay == null) pAutoPlay = true;
		if(pLoop == null) pLoop = false;
		if(this.state == pState) {
			if(this.anim != null) this.setBehavior(pLoop,pAutoPlay,pStart);
			return;
		}
		if(this.assetName == null) this.assetName = Type.getClassName(js_Boot.getClass(this)).split(".").pop();
		this.state = pState;
		if(this.anim == null) {
			this.anim = new PIXI.extras.MovieClip(this.getTextures(this.state));
			if(this.boxType == com_ragestudio_utils_game_BoxType.SELF) {
				if(this.box != null) this.removeChild(this.box);
				this.box = null;
			}
			this.anim.scale.set(1 / com_ragestudio_utils_system_DeviceCapabilities.textureRatio,1 / com_ragestudio_utils_system_DeviceCapabilities.textureRatio);
			if(com_ragestudio_utils_game_StateGraphic.animAlpha < 1) this.anim.alpha = com_ragestudio_utils_game_StateGraphic.animAlpha;
			this.addChild(this.anim);
		} else this.anim.textures = this.getTextures(this.state);
		this.isAnimEnd = false;
		this.anim.onComplete = $bind(this,this.setAnimEnd);
		this.anim.anchor = this.getAnchor(this.state);
		this.setBehavior(pLoop,pAutoPlay,pStart);
		if(this.box == null) {
			if(this.boxType == com_ragestudio_utils_game_BoxType.SELF) {
				this.box = this.anim;
				return;
			} else {
				this.box = new PIXI.Container();
				if(this.boxType != com_ragestudio_utils_game_BoxType.NONE) this.createBox();
			}
			this.addChild(this.box);
		} else if(this.boxType == com_ragestudio_utils_game_BoxType.MULTIPLE) {
			this.removeChild(this.box);
			this.box = new PIXI.Container();
			this.createBox();
			this.addChild(this.box);
		}
	}
	,setBehavior: function(pLoop,pAutoPlay,pStart) {
		if(pStart == null) pStart = 0;
		if(pAutoPlay == null) pAutoPlay = true;
		if(pLoop == null) pLoop = false;
		this.anim.loop = pLoop;
		if(this.anim.totalFrames > 1) this.anim.gotoAndStop(pStart); else this.anim.gotoAndStop(0);
		if(pAutoPlay) this.anim.play();
	}
	,createBox: function() {
		var lBoxes = this.getBox((this.boxType == com_ragestudio_utils_game_BoxType.MULTIPLE?this.state + "_":"") + this.BOX_SUFFIX);
		var lChild;
		var $it0 = lBoxes.keys();
		while( $it0.hasNext() ) {
			var lBox = $it0.next();
			lChild = new PIXI.Graphics();
			lChild.beginFill(16720418);
			if(Std["is"](__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox],PIXI.Rectangle)) lChild.drawRect((__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox]).x,(__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox]).y,(__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox]).width,(__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox]).height); else if(Std["is"](__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox],PIXI.Ellipse)) lChild.drawEllipse((__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox]).x,(__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox]).y,(__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox]).width,(__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox]).height); else if(Std["is"](__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox],PIXI.Circle)) lChild.drawCircle((__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox]).x,(__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox]).y,(__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox]).radius); else if(Std["is"](__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox],PIXI.Point)) lChild.drawCircle(0,0,10);
			lChild.endFill();
			lChild.name = lBox;
			if(Std["is"](__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox],PIXI.Point)) lChild.position.set((__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox]).x,(__map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox]).y); else lChild.hitArea = __map_reserved[lBox] != null?lBoxes.getReserved(lBox):lBoxes.h[lBox];
			this.box.addChild(lChild);
		}
		if(com_ragestudio_utils_game_StateGraphic.boxAlpha == 0) this.box.renderable = false; else this.box.alpha = com_ragestudio_utils_game_StateGraphic.boxAlpha;
	}
	,getTextures: function(pState) {
		var lID;
		if(pState == this.DEFAULT_STATE) lID = this.assetName + this.ANIM_SUFFIX; else lID = this.assetName + "_" + pState + this.ANIM_SUFFIX;
		if(com_ragestudio_utils_game_StateGraphic.texturesCache.get(lID) == null) {
			var lFrames = com_ragestudio_utils_game_StateGraphic.texturesDefinition.get(lID);
			if(lFrames == 1) {
				var v = [PIXI.Texture.fromFrame(lID + ".png")];
				com_ragestudio_utils_game_StateGraphic.texturesCache.set(lID,v);
				v;
			} else {
				var v1 = [];
				com_ragestudio_utils_game_StateGraphic.texturesCache.set(lID,v1);
				v1;
				var _g1 = 1;
				var _g = lFrames + 1;
				while(_g1 < _g) {
					var i = _g1++;
					com_ragestudio_utils_game_StateGraphic.texturesCache.get(lID).push(PIXI.Texture.fromFrame(lID + HxOverrides.substr(com_ragestudio_utils_game_StateGraphic.digits + i,-1 * com_ragestudio_utils_game_StateGraphic.textureDigits,null) + ".png"));
				}
			}
		}
		return com_ragestudio_utils_game_StateGraphic.texturesCache.get(lID);
	}
	,getAnchor: function(pState) {
		var lID;
		if(pState == this.DEFAULT_STATE) lID = this.assetName + this.ANIM_SUFFIX; else lID = this.assetName + "_" + pState + this.ANIM_SUFFIX;
		return com_ragestudio_utils_game_StateGraphic.texturesAnchor.get(lID);
	}
	,getBox: function(pState) {
		return com_ragestudio_utils_game_StateGraphic.boxesCache.get(this.assetName + "_" + pState);
	}
	,pause: function() {
		if(this.anim != null) this.anim.stop();
	}
	,resume: function() {
		if(this.anim != null) this.anim.play();
	}
	,get_hitBox: function() {
		return this.box;
	}
	,get_hitPoints: function() {
		return null;
	}
	,destroy: function() {
		this.anim.stop();
		this.removeChild(this.anim);
		this.anim.destroy();
		if(this.box != this.anim) {
			this.removeChild(this.box);
			this.box.destroy();
			this.box = null;
		}
		this.anim = null;
		com_ragestudio_utils_game_GameObject.prototype.destroy.call(this);
	}
	,__class__: com_ragestudio_utils_game_StateGraphic
});
var com_ragestudio_game_sprites_PoolObject = function(pAsset) {
	com_ragestudio_utils_game_StateGraphic.call(this);
	if(pAsset == null) pAsset = Type.getClassName(js_Boot.getClass(this)).split(".").pop();
	this.assetName = pAsset;
};
$hxClasses["com.ragestudio.game.sprites.PoolObject"] = com_ragestudio_game_sprites_PoolObject;
com_ragestudio_game_sprites_PoolObject.__name__ = ["com","ragestudio","game","sprites","PoolObject"];
com_ragestudio_game_sprites_PoolObject.__super__ = com_ragestudio_utils_game_StateGraphic;
com_ragestudio_game_sprites_PoolObject.prototype = $extend(com_ragestudio_utils_game_StateGraphic.prototype,{
	init: function() {
	}
	,dispose: function() {
		com_ragestudio_game_PoolManager.addToPool(this.assetName,this);
		this.removeAllListeners();
		this.setModeVoid();
	}
	,destroy: function() {
		this.dispose();
		com_ragestudio_game_PoolManager.available.get(this.assetName).splice((function($this) {
			var $r;
			var _this = com_ragestudio_game_PoolManager.available.get($this.assetName);
			$r = HxOverrides.indexOf(_this,$this,0);
			return $r;
		}(this)),1);
		com_ragestudio_utils_game_StateGraphic.prototype.destroy.call(this);
	}
	,getMidCoords: function() {
		return new PIXI.Point(this.x + (0.5 - this.getAnchor(this.state).x) * this.anim.width,this.y + (0.5 - this.getAnchor(this.state).y) * this.anim.height);
	}
	,__class__: com_ragestudio_game_sprites_PoolObject
});
var com_ragestudio_game_sprites_Mobile = function(pAsset) {
	com_ragestudio_game_sprites_PoolObject.call(this,pAsset);
	this.boxType = com_ragestudio_utils_game_BoxType.SIMPLE;
};
$hxClasses["com.ragestudio.game.sprites.Mobile"] = com_ragestudio_game_sprites_Mobile;
com_ragestudio_game_sprites_Mobile.__name__ = ["com","ragestudio","game","sprites","Mobile"];
com_ragestudio_game_sprites_Mobile.__super__ = com_ragestudio_game_sprites_PoolObject;
com_ragestudio_game_sprites_Mobile.prototype = $extend(com_ragestudio_game_sprites_PoolObject.prototype,{
	dispose: function() {
		if(this.parent != null) this.parent.removeChild(this);
		com_ragestudio_game_sprites_PoolObject.prototype.dispose.call(this);
	}
	,start: function() {
		com_ragestudio_game_sprites_PoolObject.prototype.start.call(this);
		this.setState("wait",true);
	}
	,getDistanceToObject: function(pObject) {
		var lMid1 = pObject.getMidCoords();
		var lMid2 = this.getMidCoords();
		return Math.sqrt(Math.pow(lMid1.x - lMid2.x,2) + Math.pow(lMid1.y - lMid2.y,2));
	}
	,__class__: com_ragestudio_game_sprites_Mobile
});
var com_ragestudio_game_sprites_Character = function(pAsset) {
	com_ragestudio_game_sprites_Mobile.call(this,pAsset);
};
$hxClasses["com.ragestudio.game.sprites.Character"] = com_ragestudio_game_sprites_Character;
com_ragestudio_game_sprites_Character.__name__ = ["com","ragestudio","game","sprites","Character"];
com_ragestudio_game_sprites_Character.__super__ = com_ragestudio_game_sprites_Mobile;
com_ragestudio_game_sprites_Character.prototype = $extend(com_ragestudio_game_sprites_Mobile.prototype,{
	__class__: com_ragestudio_game_sprites_Character
});
var com_ragestudio_game_sprites_entities_Player = function(pAsset) {
	com_ragestudio_game_sprites_Character.call(this,pAsset);
};
$hxClasses["com.ragestudio.game.sprites.entities.Player"] = com_ragestudio_game_sprites_entities_Player;
com_ragestudio_game_sprites_entities_Player.__name__ = ["com","ragestudio","game","sprites","entities","Player"];
com_ragestudio_game_sprites_entities_Player.createPlayer = function() {
	var lPlayer;
	lPlayer = js_Boot.__cast(com_ragestudio_game_PoolManager.getFromPool("Player") , com_ragestudio_game_sprites_entities_Player);
	com_ragestudio_game_sprites_entities_Player.list.push(lPlayer);
	return lPlayer;
};
com_ragestudio_game_sprites_entities_Player.getPlayers = function() {
	return com_ragestudio_game_sprites_entities_Player.list;
};
com_ragestudio_game_sprites_entities_Player.__super__ = com_ragestudio_game_sprites_Character;
com_ragestudio_game_sprites_entities_Player.prototype = $extend(com_ragestudio_game_sprites_Character.prototype,{
	dispose: function() {
		com_ragestudio_game_sprites_Character.prototype.dispose.call(this);
		com_ragestudio_game_sprites_entities_Player.list.splice(HxOverrides.indexOf(com_ragestudio_game_sprites_entities_Player.list,this,0),1);
	}
	,__class__: com_ragestudio_game_sprites_entities_Player
});
var com_ragestudio_game_Generator = function() {
};
$hxClasses["com.ragestudio.game.Generator"] = com_ragestudio_game_Generator;
com_ragestudio_game_Generator.__name__ = ["com","ragestudio","game","Generator"];
com_ragestudio_game_Generator.getInstance = function() {
	if(com_ragestudio_game_Generator.instance == null) com_ragestudio_game_Generator.instance = new com_ragestudio_game_Generator();
	return com_ragestudio_game_Generator.instance;
};
com_ragestudio_game_Generator.generateElement = function(pJson,pName,pCheckForExisting) {
	if(pCheckForExisting == null) pCheckForExisting = true;
	var lPos = new PIXI.Point(pJson.x,pJson.y);
	var lContainer = com_ragestudio_game_Generator.getRightContainer(pJson.type);
	if(pCheckForExisting && lContainer.getChildByName(pName) != null) return js_Boot.__cast(lContainer.getChildByName(pName) , com_ragestudio_game_sprites_PoolObject);
	var lElement = com_ragestudio_game_PoolManager.getFromPool(pJson.type);
	lElement.name = pName;
	lElement.x = lPos.x;
	lElement.y = lPos.y;
	lElement.scale.x = pJson.scaleX;
	lElement.scale.y = pJson.scaleY;
	lElement.rotation = pJson.rotation / 180 * Math.PI;
	lContainer.addChild(lElement);
	lElement.start();
	return lElement;
};
com_ragestudio_game_Generator.createInstanceFromStringType = function(pElementName) {
	var lElement;
	var lPath = com_ragestudio_game_Generator.getPathToClass(pElementName);
	lElement = Type.createInstance(Type.resolveClass(lPath),[]);
	return lElement;
};
com_ragestudio_game_Generator.getRightContainer = function(pElementType) {
	return com_ragestudio_game_sprites_planes_GamePlane.getInstance().limitContainer;
};
com_ragestudio_game_Generator.getPathToClass = function(pClassName) {
	var path;
	if(com_ragestudio_game_Generator.ELEMENT_LIST.get(pClassName) != null) return com_ragestudio_game_Generator.ELEMENT_LIST.get(pClassName);
	console.log("ERROR 404 : Path not found");
	return com_ragestudio_game_Generator.ELEMENT_LIST.get("Player");
};
com_ragestudio_game_Generator.prototype = {
	destroy: function() {
		com_ragestudio_game_Generator.instance = null;
	}
	,__class__: com_ragestudio_game_Generator
};
var com_ragestudio_game_PoolManager = function() {
};
$hxClasses["com.ragestudio.game.PoolManager"] = com_ragestudio_game_PoolManager;
com_ragestudio_game_PoolManager.__name__ = ["com","ragestudio","game","PoolManager"];
com_ragestudio_game_PoolManager.init = function() {
	var poolJson = com_ragestudio_utils_loader_GameLoader.getContent("pool.json");
	var jsonObject = Reflect.fields(poolJson);
	var _g = 0;
	while(_g < jsonObject.length) {
		var key = jsonObject[_g];
		++_g;
		var _g2 = 0;
		var _g1 = Reflect.field(poolJson,key);
		while(_g2 < _g1) {
			var i = _g2++;
			com_ragestudio_game_PoolManager.addToPool(key,com_ragestudio_game_Generator.createInstanceFromStringType(key));
		}
	}
};
com_ragestudio_game_PoolManager.addToPool = function(pType,pInstance) {
	if(!com_ragestudio_game_PoolManager.available.exists(pType)) com_ragestudio_game_PoolManager.available.set(pType,[]);
	com_ragestudio_game_PoolManager.available.get(pType).unshift(pInstance);
};
com_ragestudio_game_PoolManager.getFromPool = function(pType) {
	var lInstance;
	if(!com_ragestudio_game_PoolManager.available.exists(pType) || com_ragestudio_game_PoolManager.available.get(pType).length == 0) {
		lInstance = com_ragestudio_game_Generator.createInstanceFromStringType(pType);
		com_ragestudio_game_PoolManager.addToPool(pType,lInstance);
	}
	lInstance = com_ragestudio_game_PoolManager.available.get(pType).pop();
	lInstance.init();
	return lInstance;
};
com_ragestudio_game_PoolManager.clear = function(pType) {
	com_ragestudio_game_PoolManager.available.remove(pType);
};
com_ragestudio_game_PoolManager.clearAll = function() {
	var $it0 = com_ragestudio_game_PoolManager.available.keys();
	while( $it0.hasNext() ) {
		var lType = $it0.next();
		com_ragestudio_game_PoolManager.clear(lType);
	}
};
com_ragestudio_game_PoolManager.prototype = {
	__class__: com_ragestudio_game_PoolManager
};
var com_ragestudio_game_sprites_GridManager = function(texture) {
	PIXI.Sprite.call(this,texture);
	this.gridGeneration();
};
$hxClasses["com.ragestudio.game.sprites.GridManager"] = com_ragestudio_game_sprites_GridManager;
com_ragestudio_game_sprites_GridManager.__name__ = ["com","ragestudio","game","sprites","GridManager"];
com_ragestudio_game_sprites_GridManager.__super__ = PIXI.Sprite;
com_ragestudio_game_sprites_GridManager.prototype = $extend(PIXI.Sprite.prototype,{
	gridGeneration: function() {
		var dX = -650;
		var dY = 0;
		var _g = 0;
		while(_g < 50) {
			var i = _g++;
			var _g1 = 0;
			while(_g1 < 75) {
				var e = _g1++;
				var graphics = new PIXI.Graphics();
				graphics.beginFill(16776960,0.2);
				graphics.lineStyle(1,0);
				graphics.drawRect(0,0,50,50);
				graphics.x = dX;
				graphics.y = dY;
				dX += graphics.width;
				com_ragestudio_utils_game_GameStage.getInstance().getGameContainer().addChild(graphics);
			}
			dY += 51;
			dX = -650;
		}
	}
	,__class__: com_ragestudio_game_sprites_GridManager
});
var com_ragestudio_game_sprites_planes_GamePlane = function() {
	this.collectableContainer = new PIXI.Container();
	this.enemiesContainer = new PIXI.Container();
	this.killZonesContainer = new PIXI.Container();
	this.destructibleContainer = new PIXI.Container();
	this.platformContainer = new PIXI.Container();
	this.limitContainer = new PIXI.Container();
	this.groundContainer = new PIXI.Container();
	this.wallContainer = new PIXI.Container();
	com_ragestudio_utils_game_GameObject.call(this);
	this.addChild(this.platformContainer);
	this.addChild(this.destructibleContainer);
	this.addChild(this.wallContainer);
	this.addChild(this.groundContainer);
	this.addChild(this.enemiesContainer);
	this.addChild(this.collectableContainer);
	this.addChild(this.limitContainer);
	this.addChild(this.killZonesContainer);
};
$hxClasses["com.ragestudio.game.sprites.planes.GamePlane"] = com_ragestudio_game_sprites_planes_GamePlane;
com_ragestudio_game_sprites_planes_GamePlane.__name__ = ["com","ragestudio","game","sprites","planes","GamePlane"];
com_ragestudio_game_sprites_planes_GamePlane.getInstance = function() {
	if(com_ragestudio_game_sprites_planes_GamePlane.instance == null) com_ragestudio_game_sprites_planes_GamePlane.instance = new com_ragestudio_game_sprites_planes_GamePlane();
	return com_ragestudio_game_sprites_planes_GamePlane.instance;
};
com_ragestudio_game_sprites_planes_GamePlane.__super__ = com_ragestudio_utils_game_GameObject;
com_ragestudio_game_sprites_planes_GamePlane.prototype = $extend(com_ragestudio_utils_game_GameObject.prototype,{
	destroy: function() {
		this.removeChild(this.platformContainer);
		this.removeChild(this.destructibleContainer);
		this.removeChild(this.wallContainer);
		this.removeChild(this.groundContainer);
		this.removeChild(this.enemiesContainer);
		this.removeChild(this.collectableContainer);
		this.removeChild(this.limitContainer);
		this.removeChild(this.killZonesContainer);
		if(this.parent != null) this.parent.removeChild(this);
		com_ragestudio_game_sprites_planes_GamePlane.instance = null;
		com_ragestudio_utils_game_GameObject.prototype.destroy.call(this);
	}
	,__class__: com_ragestudio_game_sprites_planes_GamePlane
});
var com_ragestudio_ui_CheatPanel = function() {
	this.init();
};
$hxClasses["com.ragestudio.ui.CheatPanel"] = com_ragestudio_ui_CheatPanel;
com_ragestudio_ui_CheatPanel.__name__ = ["com","ragestudio","ui","CheatPanel"];
com_ragestudio_ui_CheatPanel.getInstance = function() {
	if(com_ragestudio_ui_CheatPanel.instance == null) com_ragestudio_ui_CheatPanel.instance = new com_ragestudio_ui_CheatPanel();
	return com_ragestudio_ui_CheatPanel.instance;
};
com_ragestudio_ui_CheatPanel.prototype = {
	init: function() {
		if(com_ragestudio_utils_Config.get_debug() && com_ragestudio_utils_Config.get_data().cheat) this.gui = new dat.gui.GUI();
	}
	,ingame: function() {
		if(this.gui == null) return;
		this.gui.add(com_ragestudio_game_sprites_entities_Player.getPlayers(),"x",-1000,1000).listen();
		this.gui.add(com_ragestudio_game_sprites_entities_Player.getPlayers(),"y",-500,500).listen();
	}
	,clear: function() {
		if(this.gui == null) return;
		this.gui.destroy();
		this.init();
	}
	,destroy: function() {
		com_ragestudio_ui_CheatPanel.instance = null;
	}
	,__class__: com_ragestudio_ui_CheatPanel
};
var com_ragestudio_utils_loader_GameLoader = function() {
	this.soundsList = [];
	this.soundsSpecs = new haxe_ds_StringMap();
	PIXI.loaders.Loader.call(this);
	this.once("complete",$bind(this,this.onComplete));
};
$hxClasses["com.ragestudio.utils.loader.GameLoader"] = com_ragestudio_utils_loader_GameLoader;
com_ragestudio_utils_loader_GameLoader.__name__ = ["com","ragestudio","utils","loader","GameLoader"];
com_ragestudio_utils_loader_GameLoader.getContent = function(pFile) {
	var key = com_ragestudio_utils_Config.get_txtsPath() + pFile;
	return com_ragestudio_utils_loader_GameLoader.txtLoaded.get(key);
};
com_ragestudio_utils_loader_GameLoader.__super__ = PIXI.loaders.Loader;
com_ragestudio_utils_loader_GameLoader.prototype = $extend(PIXI.loaders.Loader.prototype,{
	addTxtFile: function(pUrl) {
		var lUrl = com_ragestudio_utils_Config.get_txtsPath() + pUrl;
		this.add(com_ragestudio_utils_Config.url(lUrl));
	}
	,addAssetFile: function(pUrl) {
		var lUrl = com_ragestudio_utils_Config.get_assetsPath() + pUrl;
		this.add(com_ragestudio_utils_Config.url(lUrl));
	}
	,addSoundFile: function(pUrl) {
		var lUrl = com_ragestudio_utils_Config.get_soundsPath() + pUrl;
		this.soundsList.push(lUrl);
		this.add(com_ragestudio_utils_Config.url(lUrl));
	}
	,addFontFile: function(pUrl) {
		var lUrl = com_ragestudio_utils_Config.get_fontsPath() + pUrl;
		this.add(com_ragestudio_utils_Config.url(lUrl));
	}
	,parseData: function(pResource,pNext) {
		console.log(pResource.url + " loaded");
		var lUrl = pResource.url.split("?")[0];
		if(lUrl.indexOf(".css") > 0) {
			var lData = pResource.data.split(";");
			var lFamilies = [];
			var lReg = new EReg("font-family:\\s?(.*)","");
			var _g1 = 0;
			var _g = lData.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(lReg.match(lData[i])) lFamilies.push(lReg.matched(1));
			}
			var lWebFontConfig = { custom : { families : lFamilies, urls : [com_ragestudio_utils_Config.get_fontsPath() + "fonts.css"]}, active : pNext};
			WebFont.load(lWebFontConfig);
			return;
		}
		if(pResource.isJson) {
			var v = pResource.data;
			com_ragestudio_utils_loader_GameLoader.txtLoaded.set(lUrl,v);
			v;
			if(this.soundsList.length > 0) {
				var lData1;
				var _g11 = 0;
				var _g2 = this.soundsList.length;
				while(_g11 < _g2) {
					var i1 = _g11++;
					if(lUrl == this.soundsList[i1]) {
						this.soundsList.splice(i1,1);
						lData1 = pResource.data;
						var _g3 = 0;
						var _g21 = lData1.extensions.length;
						while(_g3 < _g21) {
							var j = _g3++;
							if(window.Howler.codecs(lData1.extensions[j])) {
								this.addSounds(lData1.fxs,false,lData1.extensions,lData1.extensions[i1]);
								this.addSounds(lData1.musics,true,lData1.extensions,lData1.extensions[i1]);
								break;
							}
						}
						break;
					}
				}
			}
		} else if(pResource.isXml) {
			var v1 = Xml.parse(new XMLSerializer().serializeToString(pResource.data));
			com_ragestudio_utils_loader_GameLoader.txtLoaded.set(lUrl,v1);
			v1;
		}
		pNext();
	}
	,manageCache: function(pResource,pNext) {
		if(pResource.name != pResource.url) pResource.url = com_ragestudio_utils_Config.url(pResource.url);
		pNext();
	}
	,addSounds: function(pList,pLoop,pExtensions,pCodec) {
		var lUrl;
		var _g = 0;
		var _g1 = Reflect.fields(pList);
		while(_g < _g1.length) {
			var lID = _g1[_g];
			++_g;
			lUrl = com_ragestudio_utils_Config.url(com_ragestudio_utils_Config.get_soundsPath() + lID + "." + pCodec);
			var value = { urls : [lUrl], volume : Reflect.field(pList,lID) / 100, loop : pLoop};
			this.soundsSpecs.set(lID,value);
			this.add(lUrl);
		}
	}
	,load: function(cb) {
		this.before($bind(this,this.manageCache));
		this.after($bind(this,this.parseData));
		return PIXI.loaders.Loader.prototype.load.call(this);
	}
	,onComplete: function() {
		var $it0 = this.soundsSpecs.keys();
		while( $it0.hasNext() ) {
			var lID = $it0.next();
			com_ragestudio_utils_sounds_SoundManager.addSound(lID,new window.Howl(this.soundsSpecs.get(lID)));
		}
	}
	,__class__: com_ragestudio_utils_loader_GameLoader
});
var com_ragestudio_ui_LoaderManager = function() {
	com_ragestudio_utils_loader_GameLoader.call(this);
};
$hxClasses["com.ragestudio.ui.LoaderManager"] = com_ragestudio_ui_LoaderManager;
com_ragestudio_ui_LoaderManager.__name__ = ["com","ragestudio","ui","LoaderManager"];
com_ragestudio_ui_LoaderManager.getInstance = function() {
	if(com_ragestudio_ui_LoaderManager.instance == null) com_ragestudio_ui_LoaderManager.instance = new com_ragestudio_ui_LoaderManager();
	return com_ragestudio_ui_LoaderManager.instance;
};
com_ragestudio_ui_LoaderManager.__super__ = com_ragestudio_utils_loader_GameLoader;
com_ragestudio_ui_LoaderManager.prototype = $extend(com_ragestudio_utils_loader_GameLoader.prototype,{
	startLoadingProcess: function(pLoadingPhase,pSuccessCallback) {
		var _g = this;
		var lLoader = new com_ragestudio_utils_loader_GameLoader();
		if(pLoadingPhase == com_ragestudio_ui_LoaderManager.PRELOAD_PHASE_NAME) {
			this.executeFunctionOnAllArrayElements(com_ragestudio_utils_Config.get_data().preload_Fonts,$bind(lLoader,lLoader.addFontFile));
			this.executeFunctionOnAllArrayElements(com_ragestudio_utils_Config.get_data().preload_stateGraphic_Textures,$bind(lLoader,lLoader.addAssetFile));
			this.executeFunctionOnAllArrayElements(com_ragestudio_utils_Config.get_data().preload_Assets,$bind(lLoader,lLoader.addAssetFile));
		} else if(pLoadingPhase == com_ragestudio_ui_LoaderManager.GENERAL_PHASE_NAME) {
			this.executeFunctionOnAllArrayElements(com_ragestudio_utils_Config.get_data().general_Assets,$bind(lLoader,lLoader.addAssetFile));
			this.executeFunctionOnAllArrayElements(com_ragestudio_utils_Config.get_data().general_stateGraphic_Textures,$bind(lLoader,lLoader.addAssetFile));
			this.executeFunctionOnAllArrayElements(com_ragestudio_utils_Config.get_data().general_Sounds,$bind(lLoader,lLoader.addSoundFile));
			this.executeFunctionOnAllArrayElements(com_ragestudio_utils_Config.get_data().general_Fonts,$bind(lLoader,lLoader.addFontFile));
			this.executeFunctionOnAllArrayElements(com_ragestudio_utils_Config.get_data().general_Texts,$bind(lLoader,lLoader.addTxtFile));
			lLoader.on("progress",$bind(this,this.onLoadProgress));
		} else if(pLoadingPhase == com_ragestudio_ui_LoaderManager.WORLD_PHASE_NAME) {
			this.executeFunctionOnAllArrayElements(com_ragestudio_utils_Config.get_data().world_Assets,$bind(lLoader,lLoader.addAssetFile));
			this.executeFunctionOnAllArrayElements(com_ragestudio_utils_Config.get_data().world_stateGraphic_Textures,$bind(lLoader,lLoader.addAssetFile));
			lLoader.on("progress",$bind(this,this.onLoadProgress));
		} else {
			console.log("Unknown loading phase \"" + pLoadingPhase + "\". Should be : \"" + com_ragestudio_ui_LoaderManager.PRELOAD_PHASE_NAME + "\", \"" + com_ragestudio_ui_LoaderManager.GENERAL_PHASE_NAME + "\" or \"" + com_ragestudio_ui_LoaderManager.WORLD_PHASE_NAME + "\". Aborted loading process");
			return;
		}
		lLoader.once("complete",function() {
			_g.onProcessComplete(lLoader,pLoadingPhase,pSuccessCallback);
		});
		lLoader.load();
	}
	,onLoadProgress: function(pLoader) {
		com_ragestudio_ui_screens_GraphicLoader.getInstance().update(pLoader.progress / 100);
	}
	,onProcessComplete: function(pLoader,pLoadingPhase,pSuccessCallback) {
		var _g = this;
		pLoader.off("progress",function() {
			_g.onProcessComplete(pLoader,pLoadingPhase,pSuccessCallback);
		});
		if(pLoadingPhase == com_ragestudio_ui_LoaderManager.PRELOAD_PHASE_NAME) {
			this.addTexturesToStateGraphic(com_ragestudio_utils_Config.get_data().preload_stateGraphic_Textures);
			console.log(com_ragestudio_utils_Config.get_data().preload_stateGraphic_Textures);
		} else if(pLoadingPhase == com_ragestudio_ui_LoaderManager.GENERAL_PHASE_NAME) {
			this.addTexturesToStateGraphic(com_ragestudio_utils_Config.get_data().general_stateGraphic_Textures);
			com_ragestudio_utils_game_StateGraphic.addBoxes(com_ragestudio_utils_loader_GameLoader.getContent("boxes.json"));
		} else if(pLoadingPhase == com_ragestudio_ui_LoaderManager.WORLD_PHASE_NAME) this.addTexturesToStateGraphic(com_ragestudio_utils_Config.get_data().world_stateGraphic_Textures);
		pSuccessCallback();
	}
	,executeFunctionOnAllArrayElements: function(pElementsArray,pFunction,pOptimized) {
		if(pOptimized == null) pOptimized = false;
		var lLength = pElementsArray.length;
		var _g = 0;
		while(_g < lLength) {
			var i = _g++;
			pFunction((pOptimized?com_ragestudio_utils_system_DeviceCapabilities.textureType + "/":"") + pElementsArray[i]);
		}
	}
	,addTexturesToStateGraphic: function(pTexturesArray) {
		var lLength = pTexturesArray.length;
		var _g = 0;
		while(_g < lLength) {
			var i = _g++;
			com_ragestudio_utils_game_StateGraphic.addTextures(com_ragestudio_utils_loader_GameLoader.getContent(pTexturesArray[i]));
		}
	}
	,destroy: function() {
		com_ragestudio_ui_LoaderManager.instance = null;
	}
	,__class__: com_ragestudio_ui_LoaderManager
});
var com_ragestudio_ui_UIManager = function() {
	this.popins = [];
};
$hxClasses["com.ragestudio.ui.UIManager"] = com_ragestudio_ui_UIManager;
com_ragestudio_ui_UIManager.__name__ = ["com","ragestudio","ui","UIManager"];
com_ragestudio_ui_UIManager.getInstance = function() {
	if(com_ragestudio_ui_UIManager.instance == null) com_ragestudio_ui_UIManager.instance = new com_ragestudio_ui_UIManager();
	return com_ragestudio_ui_UIManager.instance;
};
com_ragestudio_ui_UIManager.prototype = {
	openScreen: function(pScreen) {
		this.closeScreens();
		com_ragestudio_utils_game_GameStage.getInstance().getScreensContainer().addChild(pScreen);
		pScreen.open();
	}
	,closeScreens: function() {
		var lContainer = com_ragestudio_utils_game_GameStage.getInstance().getScreensContainer();
		while(lContainer.children.length > 0) {
			var lCurrent;
			lCurrent = js_Boot.__cast(lContainer.getChildAt(lContainer.children.length - 1) , com_ragestudio_utils_ui_Screen);
			lCurrent.interactive = false;
			lContainer.removeChild(lCurrent);
			lCurrent.close();
		}
	}
	,openPopin: function(pPopin) {
		this.popins.push(pPopin);
		com_ragestudio_utils_game_GameStage.getInstance().getPopinsContainer().addChild(pPopin);
		pPopin.open();
	}
	,closeCurrentPopin: function() {
		if(this.popins.length == 0) return;
		var lCurrent = this.popins.pop();
		lCurrent.interactive = false;
		com_ragestudio_utils_game_GameStage.getInstance().getPopinsContainer().removeChild(lCurrent);
		lCurrent.close();
	}
	,openHud: function() {
		com_ragestudio_utils_game_GameStage.getInstance().getHudContainer().addChild(com_ragestudio_ui_hud_Hud.getInstance());
		com_ragestudio_ui_hud_Hud.getInstance().open();
	}
	,closeHud: function() {
		com_ragestudio_utils_game_GameStage.getInstance().getHudContainer().removeChild(com_ragestudio_ui_hud_Hud.getInstance());
		com_ragestudio_ui_hud_Hud.getInstance().close();
	}
	,startGame: function() {
		this.closeScreens();
		this.openHud();
	}
	,destroy: function() {
		com_ragestudio_ui_UIManager.instance = null;
	}
	,__class__: com_ragestudio_ui_UIManager
};
var com_ragestudio_utils_ui_UIComponent = function() {
	this.modalImage = "assets/alpha_bg.png";
	this._modal = true;
	this.positionables = [];
	com_ragestudio_utils_game_GameObject.call(this);
};
$hxClasses["com.ragestudio.utils.ui.UIComponent"] = com_ragestudio_utils_ui_UIComponent;
com_ragestudio_utils_ui_UIComponent.__name__ = ["com","ragestudio","utils","ui","UIComponent"];
com_ragestudio_utils_ui_UIComponent.__super__ = com_ragestudio_utils_game_GameObject;
com_ragestudio_utils_ui_UIComponent.prototype = $extend(com_ragestudio_utils_game_GameObject.prototype,{
	open: function() {
		if(this.isOpened) return;
		this.isOpened = true;
		this.set_modal(this._modal);
		com_ragestudio_utils_game_GameStage.getInstance().on("resize",$bind(this,this.onResize));
		this.onResize();
	}
	,get_modal: function() {
		return this._modal;
	}
	,set_modal: function(pModal) {
		this._modal = pModal;
		if(this._modal) {
			if(this.modalZone == null) {
				this.modalZone = new PIXI.Sprite(PIXI.Texture.fromImage(com_ragestudio_utils_Config.url(this.modalImage)));
				this.modalZone.interactive = true;
				this.modalZone.on("click",$bind(this,this.stopPropagation));
				this.modalZone.on("tap",$bind(this,this.stopPropagation));
				this.positionables.unshift({ item : this.modalZone, align : "fitScreen", offsetX : 0, offsetY : 0});
			}
			if(this.parent != null) this.parent.addChildAt(this.modalZone,this.parent.getChildIndex(this));
		} else if(this.modalZone != null) {
			if(this.modalZone.parent != null) this.modalZone.parent.removeChild(this.modalZone);
			this.modalZone.off("click",$bind(this,this.stopPropagation));
			this.modalZone.off("tap",$bind(this,this.stopPropagation));
			this.modalZone = null;
			if(this.positionables[0].item == this.modalZone) this.positionables.shift();
		}
		return this._modal;
	}
	,stopPropagation: function(pEvent) {
	}
	,close: function() {
		if(!this.isOpened) return;
		this.isOpened = false;
		this.set_modal(false);
		this.destroy();
	}
	,onResize: function(pEvent) {
		var _g = 0;
		var _g1 = this.positionables;
		while(_g < _g1.length) {
			var lObj = _g1[_g];
			++_g;
			if(lObj.update) {
				if(lObj.align == "top" || lObj.align == "topLeft" || lObj.align == "topRight") lObj.offsetY = this.parent.y + lObj.item.y; else if(lObj.align == "bottom" || lObj.align == "bottomLeft" || lObj.align == "bottomRight") lObj.offsetY = com_ragestudio_utils_game_GameStage.getInstance().get_safeZone().height - this.parent.y - lObj.item.y;
				if(lObj.align == "left" || lObj.align == "topLeft" || lObj.align == "bottomLeft") lObj.offsetX = this.parent.x + lObj.item.x; else if(lObj.align == "right" || lObj.align == "topRight" || lObj.align == "bottomRight") lObj.offsetX = com_ragestudio_utils_game_GameStage.getInstance().get_safeZone().width - this.parent.x - lObj.item.x;
				lObj.update = false;
			}
			com_ragestudio_utils_ui_UIPosition.setPosition(lObj.item,lObj.align,lObj.offsetX,lObj.offsetY);
		}
	}
	,destroy: function() {
		this.close();
		com_ragestudio_utils_game_GameStage.getInstance().off("resize",$bind(this,this.onResize));
		com_ragestudio_utils_game_GameObject.prototype.destroy.call(this);
	}
	,__class__: com_ragestudio_utils_ui_UIComponent
});
var com_ragestudio_utils_ui_Screen = function() {
	com_ragestudio_utils_ui_UIComponent.call(this);
	this.modalImage = "assets/black_bg.png";
};
$hxClasses["com.ragestudio.utils.ui.Screen"] = com_ragestudio_utils_ui_Screen;
com_ragestudio_utils_ui_Screen.__name__ = ["com","ragestudio","utils","ui","Screen"];
com_ragestudio_utils_ui_Screen.__super__ = com_ragestudio_utils_ui_UIComponent;
com_ragestudio_utils_ui_Screen.prototype = $extend(com_ragestudio_utils_ui_UIComponent.prototype,{
	__class__: com_ragestudio_utils_ui_Screen
});
var com_ragestudio_ui_hud_Hud = function() {
	com_ragestudio_utils_ui_Screen.call(this);
	this._modal = false;
	this.hudTopLeft = new PIXI.Container();
	this.hudBottomLeft = new PIXI.Container();
	this.addChild(this.hudTopLeft);
	this.addChild(this.hudBottomLeft);
	this.positionables.push({ item : this.hudTopLeft, align : "topLeft", offsetX : 0, offsetY : 0});
	this.positionables.push({ item : this.hudBottomLeft, align : "bottomLeft", offsetX : 0, offsetY : 0});
};
$hxClasses["com.ragestudio.ui.hud.Hud"] = com_ragestudio_ui_hud_Hud;
com_ragestudio_ui_hud_Hud.__name__ = ["com","ragestudio","ui","hud","Hud"];
com_ragestudio_ui_hud_Hud.getInstance = function() {
	if(com_ragestudio_ui_hud_Hud.instance == null) com_ragestudio_ui_hud_Hud.instance = new com_ragestudio_ui_hud_Hud();
	return com_ragestudio_ui_hud_Hud.instance;
};
com_ragestudio_ui_hud_Hud.__super__ = com_ragestudio_utils_ui_Screen;
com_ragestudio_ui_hud_Hud.prototype = $extend(com_ragestudio_utils_ui_Screen.prototype,{
	destroy: function() {
		com_ragestudio_ui_hud_Hud.instance = null;
		com_ragestudio_utils_ui_Screen.prototype.destroy.call(this);
	}
	,__class__: com_ragestudio_ui_hud_Hud
});
var com_ragestudio_utils_ui_Popin = function() {
	com_ragestudio_utils_ui_UIComponent.call(this);
};
$hxClasses["com.ragestudio.utils.ui.Popin"] = com_ragestudio_utils_ui_Popin;
com_ragestudio_utils_ui_Popin.__name__ = ["com","ragestudio","utils","ui","Popin"];
com_ragestudio_utils_ui_Popin.__super__ = com_ragestudio_utils_ui_UIComponent;
com_ragestudio_utils_ui_Popin.prototype = $extend(com_ragestudio_utils_ui_UIComponent.prototype,{
	__class__: com_ragestudio_utils_ui_Popin
});
var com_ragestudio_ui_popin_Confirm = function() {
	com_ragestudio_utils_ui_Popin.call(this);
	this.background = new PIXI.Sprite(PIXI.Texture.fromImage(com_ragestudio_utils_Config.url(com_ragestudio_utils_Config.get_assetsPath() + "Confirm.png")));
	this.background.anchor.set(0.5,0.5);
	this.addChild(this.background);
	this.interactive = true;
	this.buttonMode = true;
	this.once("click",$bind(this,this.onClick));
	this.once("tap",$bind(this,this.onClick));
};
$hxClasses["com.ragestudio.ui.popin.Confirm"] = com_ragestudio_ui_popin_Confirm;
com_ragestudio_ui_popin_Confirm.__name__ = ["com","ragestudio","ui","popin","Confirm"];
com_ragestudio_ui_popin_Confirm.getInstance = function() {
	if(com_ragestudio_ui_popin_Confirm.instance == null) com_ragestudio_ui_popin_Confirm.instance = new com_ragestudio_ui_popin_Confirm();
	return com_ragestudio_ui_popin_Confirm.instance;
};
com_ragestudio_ui_popin_Confirm.__super__ = com_ragestudio_utils_ui_Popin;
com_ragestudio_ui_popin_Confirm.prototype = $extend(com_ragestudio_utils_ui_Popin.prototype,{
	test: function(pEvent) {
		console.log(pEvent);
	}
	,onClick: function(pEvent) {
		com_ragestudio_utils_sounds_SoundManager.getSound("click").play();
		com_ragestudio_ui_UIManager.getInstance().closeCurrentPopin();
		com_ragestudio_game_GameManager.getInstance().start();
	}
	,destroy: function() {
		com_ragestudio_ui_popin_Confirm.instance = null;
		com_ragestudio_utils_ui_Popin.prototype.destroy.call(this);
	}
	,__class__: com_ragestudio_ui_popin_Confirm
});
var com_ragestudio_ui_screens_GraphicLoader = function() {
	com_ragestudio_utils_ui_Screen.call(this);
	var lBg = new com_ragestudio_ui_screens_SpriteAmplified("preload_bg");
	lBg.start();
	this.addChild(lBg);
	this.title = new PIXI.Text("NEXT DAYS",{ font : "150px Arial black", fill : 16777215, align : "center"});
	this.title.anchor.set(0.5,0.5);
	this.title.y = -250.;
	this.addChild(this.title);
	this.pourcentage = new PIXI.Text(" ",{ font : "50px Arial black", fill : 16777215, align : "center"});
	this.pourcentage.anchor.set(0.5,0.5);
	this.pourcentage.y = 250.;
	this.addChild(this.pourcentage);
	this.loaderBar = new com_ragestudio_ui_screens_SpriteAmplified("preload");
	this.loaderBar.start();
	this.loaderBar.x = -this.loaderBar.width / 2;
	this.addChild(this.loaderBar);
	this.loaderBar.scale.x = 0;
};
$hxClasses["com.ragestudio.ui.screens.GraphicLoader"] = com_ragestudio_ui_screens_GraphicLoader;
com_ragestudio_ui_screens_GraphicLoader.__name__ = ["com","ragestudio","ui","screens","GraphicLoader"];
com_ragestudio_ui_screens_GraphicLoader.getInstance = function() {
	if(com_ragestudio_ui_screens_GraphicLoader.instance == null) com_ragestudio_ui_screens_GraphicLoader.instance = new com_ragestudio_ui_screens_GraphicLoader();
	return com_ragestudio_ui_screens_GraphicLoader.instance;
};
com_ragestudio_ui_screens_GraphicLoader.__super__ = com_ragestudio_utils_ui_Screen;
com_ragestudio_ui_screens_GraphicLoader.prototype = $extend(com_ragestudio_utils_ui_Screen.prototype,{
	update: function(pProgress) {
		this.loaderBar.scale.x = pProgress;
		this.pourcentage.text = Math.floor(pProgress * 100) + "%";
	}
	,destroy: function() {
		com_ragestudio_ui_screens_GraphicLoader.instance = null;
		com_ragestudio_utils_ui_Screen.prototype.destroy.call(this);
	}
	,__class__: com_ragestudio_ui_screens_GraphicLoader
});
var com_ragestudio_ui_screens_SpriteAmplified = function(pAssetName) {
	this.assetName = pAssetName;
	com_ragestudio_utils_game_StateGraphic.call(this);
};
$hxClasses["com.ragestudio.ui.screens.SpriteAmplified"] = com_ragestudio_ui_screens_SpriteAmplified;
com_ragestudio_ui_screens_SpriteAmplified.__name__ = ["com","ragestudio","ui","screens","SpriteAmplified"];
com_ragestudio_ui_screens_SpriteAmplified.__super__ = com_ragestudio_utils_game_StateGraphic;
com_ragestudio_ui_screens_SpriteAmplified.prototype = $extend(com_ragestudio_utils_game_StateGraphic.prototype,{
	start: function() {
		com_ragestudio_utils_game_StateGraphic.prototype.start.call(this);
		this.setState(this.DEFAULT_STATE);
	}
	,__class__: com_ragestudio_ui_screens_SpriteAmplified
});
var com_ragestudio_ui_screens_TitleCard = function() {
	com_ragestudio_utils_ui_Screen.call(this);
	this.background = new PIXI.Sprite(PIXI.Texture.fromImage(com_ragestudio_utils_Config.url(com_ragestudio_utils_Config.get_assetsPath() + "TitleCard_bg.png")));
	this.background.anchor.set(0.5,0.5);
	this.addChild(this.background);
	this.interactive = true;
	this.buttonMode = true;
	this.once("click",$bind(this,this.onClick));
	this.once("tap",$bind(this,this.onClick));
};
$hxClasses["com.ragestudio.ui.screens.TitleCard"] = com_ragestudio_ui_screens_TitleCard;
com_ragestudio_ui_screens_TitleCard.__name__ = ["com","ragestudio","ui","screens","TitleCard"];
com_ragestudio_ui_screens_TitleCard.getInstance = function() {
	if(com_ragestudio_ui_screens_TitleCard.instance == null) com_ragestudio_ui_screens_TitleCard.instance = new com_ragestudio_ui_screens_TitleCard();
	return com_ragestudio_ui_screens_TitleCard.instance;
};
com_ragestudio_ui_screens_TitleCard.__super__ = com_ragestudio_utils_ui_Screen;
com_ragestudio_ui_screens_TitleCard.prototype = $extend(com_ragestudio_utils_ui_Screen.prototype,{
	onClick: function(pEvent) {
		com_ragestudio_utils_sounds_SoundManager.getSound("click").play();
		com_ragestudio_ui_UIManager.getInstance().openPopin(com_ragestudio_ui_popin_Confirm.getInstance());
	}
	,destroy: function() {
		com_ragestudio_ui_screens_TitleCard.instance = null;
		com_ragestudio_utils_ui_Screen.prototype.destroy.call(this);
	}
	,__class__: com_ragestudio_ui_screens_TitleCard
});
var com_ragestudio_utils_Config = function() { };
$hxClasses["com.ragestudio.utils.Config"] = com_ragestudio_utils_Config;
com_ragestudio_utils_Config.__name__ = ["com","ragestudio","utils","Config"];
com_ragestudio_utils_Config.init = function(pConfig) {
	var _g = 0;
	var _g1 = Reflect.fields(pConfig);
	while(_g < _g1.length) {
		var i = _g1[_g];
		++_g;
		Reflect.setField(com_ragestudio_utils_Config._data,i,Reflect.field(pConfig,i));
	}
	if(com_ragestudio_utils_Config._data.version == null || com_ragestudio_utils_Config._data.version == "") com_ragestudio_utils_Config._data.version = "0.0.0";
	if(com_ragestudio_utils_Config._data.language == null || com_ragestudio_utils_Config._data.language == "") {
		var _this = window.navigator.language;
		com_ragestudio_utils_Config._data.language = HxOverrides.substr(_this,0,2);
	}
	if(com_ragestudio_utils_Config._data.languages == "" || com_ragestudio_utils_Config._data.languages == []) com_ragestudio_utils_Config._data.languages.push(com_ragestudio_utils_Config._data.language);
	if(com_ragestudio_utils_Config._data.debug == null || com_ragestudio_utils_Config._data.debug == "") com_ragestudio_utils_Config._data.debug = false;
	if(com_ragestudio_utils_Config._data.fps == null || com_ragestudio_utils_Config._data.fps == "") com_ragestudio_utils_Config._data.fps = false;
	if(com_ragestudio_utils_Config._data.qrcode == null || com_ragestudio_utils_Config._data.qrcode == "") com_ragestudio_utils_Config._data.qrcode = false;
	if(com_ragestudio_utils_Config._data.langPath == null) com_ragestudio_utils_Config._data.langPath = "";
	if(com_ragestudio_utils_Config._data.txtsPath == null) com_ragestudio_utils_Config._data.txtsPath = "";
	if(com_ragestudio_utils_Config._data.assetsPath == null) com_ragestudio_utils_Config._data.assetsPath = "";
	if(com_ragestudio_utils_Config._data.fontsPath == null) com_ragestudio_utils_Config._data.fontsPath = "";
	if(com_ragestudio_utils_Config._data.soundsPath == null) com_ragestudio_utils_Config._data.soundsPath = "";
	if(com_ragestudio_utils_Config._data.preload_Assets == null) com_ragestudio_utils_Config._data.preload_Assets = [];
	if(com_ragestudio_utils_Config._data.preload_Fonts == null) com_ragestudio_utils_Config._data.preload_Fonts = [];
	if(com_ragestudio_utils_Config._data.preload_stateGraphic_Textures == null) com_ragestudio_utils_Config._data.preload_stateGraphic_Textures = [];
	if(com_ragestudio_utils_Config._data.general_Assets == null) com_ragestudio_utils_Config._data.general_Assets = [];
	if(com_ragestudio_utils_Config._data.general_Sounds == null) com_ragestudio_utils_Config._data.general_Sounds = [];
	if(com_ragestudio_utils_Config._data.general_Texts == null) com_ragestudio_utils_Config._data.general_Texts = [];
	if(com_ragestudio_utils_Config._data.general_Fonts == null) com_ragestudio_utils_Config._data.general_Fonts = [];
	if(com_ragestudio_utils_Config._data.general_stateGraphic_Textures == null) com_ragestudio_utils_Config._data.general_stateGraphic_Textures = [];
	if(com_ragestudio_utils_Config._data.general_stateGraphic_Boxes == null) com_ragestudio_utils_Config._data.general_stateGraphic_Boxes = [];
	if(com_ragestudio_utils_Config._data.world1_Assets == null) com_ragestudio_utils_Config._data.world_Assets = [];
	if(com_ragestudio_utils_Config._data.world1_stateGraphic_Textures == null) com_ragestudio_utils_Config._data.world_stateGraphic_Textures = [];
};
com_ragestudio_utils_Config.url = function(pPath) {
	return pPath + "?" + com_ragestudio_utils_Config.get_version();
};
com_ragestudio_utils_Config.get_data = function() {
	return com_ragestudio_utils_Config._data;
};
com_ragestudio_utils_Config.get_version = function() {
	return com_ragestudio_utils_Config._data.version;
};
com_ragestudio_utils_Config.get_language = function() {
	return com_ragestudio_utils_Config.get_data().language;
};
com_ragestudio_utils_Config.get_languages = function() {
	return com_ragestudio_utils_Config.get_data().languages;
};
com_ragestudio_utils_Config.get_debug = function() {
	return com_ragestudio_utils_Config.get_data().debug;
};
com_ragestudio_utils_Config.get_fps = function() {
	return com_ragestudio_utils_Config.get_data().fps;
};
com_ragestudio_utils_Config.get_qrcode = function() {
	return com_ragestudio_utils_Config.get_data().qrcode;
};
com_ragestudio_utils_Config.get_langPath = function() {
	return com_ragestudio_utils_Config._data.langPath;
};
com_ragestudio_utils_Config.get_txtsPath = function() {
	return com_ragestudio_utils_Config._data.txtsPath;
};
com_ragestudio_utils_Config.get_assetsPath = function() {
	return com_ragestudio_utils_Config._data.assetsPath;
};
com_ragestudio_utils_Config.get_fontsPath = function() {
	return com_ragestudio_utils_Config._data.fontsPath;
};
com_ragestudio_utils_Config.get_soundsPath = function() {
	return com_ragestudio_utils_Config._data.soundsPath;
};
var com_ragestudio_utils_Debug = function() {
};
$hxClasses["com.ragestudio.utils.Debug"] = com_ragestudio_utils_Debug;
com_ragestudio_utils_Debug.__name__ = ["com","ragestudio","utils","Debug"];
com_ragestudio_utils_Debug.getInstance = function() {
	if(com_ragestudio_utils_Debug.instance == null) com_ragestudio_utils_Debug.instance = new com_ragestudio_utils_Debug();
	return com_ragestudio_utils_Debug.instance;
};
com_ragestudio_utils_Debug.error = function(pArg) {
	window.console.error(pArg);
};
com_ragestudio_utils_Debug.warn = function(pArg) {
	window.console.warn(pArg);
};
com_ragestudio_utils_Debug.table = function(pArg) {
	window.console.table(pArg);
};
com_ragestudio_utils_Debug.info = function(pArg) {
	window.console.info(pArg);
};
com_ragestudio_utils_Debug.prototype = {
	init: function() {
		if(com_ragestudio_utils_Config.get_fps()) this.fps = new Perf("TL");
		if(com_ragestudio_utils_Config.get_qrcode()) {
			var lQr = new Image();
			lQr.style.position = "absolute";
			lQr.style.right = "0px";
			lQr.style.bottom = "0px";
			var lSize = Std["int"](0.35 * com_ragestudio_utils_system_DeviceCapabilities.getSizeFactor());
			lQr.src = "https://chart.googleapis.com/chart?chs=" + lSize + "x" + lSize + "&cht=qr&chl=" + window.location.href + "&choe=UTF-8";
			window.document.body.appendChild(lQr);
		}
	}
	,destroy: function() {
	}
	,__class__: com_ragestudio_utils_Debug
};
var com_ragestudio_utils_events_EventType = function() { };
$hxClasses["com.ragestudio.utils.events.EventType"] = com_ragestudio_utils_events_EventType;
com_ragestudio_utils_events_EventType.__name__ = ["com","ragestudio","utils","events","EventType"];
var com_ragestudio_utils_events_LoadEventType = function() { };
$hxClasses["com.ragestudio.utils.events.LoadEventType"] = com_ragestudio_utils_events_LoadEventType;
com_ragestudio_utils_events_LoadEventType.__name__ = ["com","ragestudio","utils","events","LoadEventType"];
com_ragestudio_utils_events_LoadEventType.__super__ = com_ragestudio_utils_events_EventType;
com_ragestudio_utils_events_LoadEventType.prototype = $extend(com_ragestudio_utils_events_EventType.prototype,{
	__class__: com_ragestudio_utils_events_LoadEventType
});
var com_ragestudio_utils_events_MouseEventType = function() { };
$hxClasses["com.ragestudio.utils.events.MouseEventType"] = com_ragestudio_utils_events_MouseEventType;
com_ragestudio_utils_events_MouseEventType.__name__ = ["com","ragestudio","utils","events","MouseEventType"];
com_ragestudio_utils_events_MouseEventType.__super__ = com_ragestudio_utils_events_EventType;
com_ragestudio_utils_events_MouseEventType.prototype = $extend(com_ragestudio_utils_events_EventType.prototype,{
	__class__: com_ragestudio_utils_events_MouseEventType
});
var com_ragestudio_utils_events_TouchEventType = function() { };
$hxClasses["com.ragestudio.utils.events.TouchEventType"] = com_ragestudio_utils_events_TouchEventType;
com_ragestudio_utils_events_TouchEventType.__name__ = ["com","ragestudio","utils","events","TouchEventType"];
com_ragestudio_utils_events_TouchEventType.__super__ = com_ragestudio_utils_events_EventType;
com_ragestudio_utils_events_TouchEventType.prototype = $extend(com_ragestudio_utils_events_EventType.prototype,{
	__class__: com_ragestudio_utils_events_TouchEventType
});
var com_ragestudio_utils_game_BoxType = { __ename__ : true, __constructs__ : ["NONE","SIMPLE","MULTIPLE","SELF"] };
com_ragestudio_utils_game_BoxType.NONE = ["NONE",0];
com_ragestudio_utils_game_BoxType.NONE.toString = $estr;
com_ragestudio_utils_game_BoxType.NONE.__enum__ = com_ragestudio_utils_game_BoxType;
com_ragestudio_utils_game_BoxType.SIMPLE = ["SIMPLE",1];
com_ragestudio_utils_game_BoxType.SIMPLE.toString = $estr;
com_ragestudio_utils_game_BoxType.SIMPLE.__enum__ = com_ragestudio_utils_game_BoxType;
com_ragestudio_utils_game_BoxType.MULTIPLE = ["MULTIPLE",2];
com_ragestudio_utils_game_BoxType.MULTIPLE.toString = $estr;
com_ragestudio_utils_game_BoxType.MULTIPLE.__enum__ = com_ragestudio_utils_game_BoxType;
com_ragestudio_utils_game_BoxType.SELF = ["SELF",3];
com_ragestudio_utils_game_BoxType.SELF.toString = $estr;
com_ragestudio_utils_game_BoxType.SELF.__enum__ = com_ragestudio_utils_game_BoxType;
var com_ragestudio_utils_game_CollisionManager = function() {
};
$hxClasses["com.ragestudio.utils.game.CollisionManager"] = com_ragestudio_utils_game_CollisionManager;
com_ragestudio_utils_game_CollisionManager.__name__ = ["com","ragestudio","utils","game","CollisionManager"];
com_ragestudio_utils_game_CollisionManager.hitTestObject = function(pObjectA,pObjectB) {
	return com_ragestudio_utils_game_CollisionManager.getIntersection(pObjectA.getBounds(),pObjectB.getBounds());
};
com_ragestudio_utils_game_CollisionManager.hitTestPoint = function(pItem,pGlobalPoint) {
	var lPoint = pItem.toLocal(pGlobalPoint);
	var x = lPoint.x;
	var y = lPoint.y;
	if(pItem.hitArea != null && pItem.hitArea.contains != null) return pItem.hitArea.contains(x,y); else if(js_Boot.__instanceof(pItem,PIXI.Sprite)) {
		var lSprite;
		lSprite = js_Boot.__cast(pItem , PIXI.Sprite);
		var lWidth = lSprite.texture.frame.width;
		var lHeight = lSprite.texture.frame.height;
		var lX1 = -lWidth * lSprite.anchor.x;
		var lY1;
		if(x > lX1 && x < lX1 + lWidth) {
			lY1 = -lHeight * lSprite.anchor.y;
			if(y > lY1 && y < lY1 + lHeight) return true;
		}
	} else if(js_Boot.__instanceof(pItem,PIXI.Graphics)) {
		var lGraphicsData = pItem.graphicsData;
		var _g1 = 0;
		var _g = lGraphicsData.length;
		while(_g1 < _g) {
			var i = _g1++;
			var lData = lGraphicsData[i];
			if(!lData.fill) continue;
			if(lData.shape != null && lData.shape.contains(x,y)) return true;
		}
	} else if(js_Boot.__instanceof(pItem,PIXI.Container)) {
		var lContainer;
		lContainer = js_Boot.__cast(pItem , PIXI.Container);
		var lLength = lContainer.children.length;
		var _g2 = 0;
		while(_g2 < lLength) {
			var i1 = _g2++;
			if(com_ragestudio_utils_game_CollisionManager.hitTestPoint(lContainer.children[i1],pGlobalPoint)) return true;
		}
	}
	return false;
};
com_ragestudio_utils_game_CollisionManager.hasCollision = function(pHitBoxA,pHitBoxB,pPointsA,pPointsB) {
	if(pHitBoxA == null || pHitBoxB == null) return false;
	if(!com_ragestudio_utils_game_CollisionManager.hitTestObject(pHitBoxA,pHitBoxB)) return false;
	if(pPointsA == null && pPointsB == null) return true;
	if(pPointsA != null) return com_ragestudio_utils_game_CollisionManager.testPoints(pPointsA,pHitBoxB);
	if(pPointsB != null) return com_ragestudio_utils_game_CollisionManager.testPoints(pPointsB,pHitBoxA);
	return false;
};
com_ragestudio_utils_game_CollisionManager.getIntersection = function(pRectA,pRectB) {
	return !(pRectB.x > pRectA.x + pRectA.width || pRectB.x + pRectB.width < pRectA.x || pRectB.y > pRectA.y + pRectA.height || pRectB.y + pRectB.height < pRectA.y);
};
com_ragestudio_utils_game_CollisionManager.testPoints = function(pHitPoints,pHitBox) {
	var lLength = pHitPoints.length;
	var _g = 0;
	while(_g < lLength) {
		var i = _g++;
		if(com_ragestudio_utils_game_CollisionManager.hitTestPoint(pHitBox,pHitPoints[i])) return true;
	}
	return false;
};
com_ragestudio_utils_game_CollisionManager.prototype = {
	__class__: com_ragestudio_utils_game_CollisionManager
};
var com_ragestudio_utils_game_GameStage = function() {
	this._safeZone = new PIXI.Rectangle(0,0,2048,1366);
	this._scaleMode = com_ragestudio_utils_game_GameStageScale.SHOW_ALL;
	this._alignMode = com_ragestudio_utils_game_GameStageAlign.CENTER;
	PIXI.Container.call(this);
	this.gameContainer = new PIXI.Container();
	this.addChild(this.gameContainer);
	this.screensContainer = new PIXI.Container();
	this.addChild(this.screensContainer);
	this.hudContainer = new PIXI.Container();
	this.addChild(this.hudContainer);
	this.popinsContainer = new PIXI.Container();
	this.addChild(this.popinsContainer);
};
$hxClasses["com.ragestudio.utils.game.GameStage"] = com_ragestudio_utils_game_GameStage;
com_ragestudio_utils_game_GameStage.__name__ = ["com","ragestudio","utils","game","GameStage"];
com_ragestudio_utils_game_GameStage.getInstance = function() {
	if(com_ragestudio_utils_game_GameStage.instance == null) com_ragestudio_utils_game_GameStage.instance = new com_ragestudio_utils_game_GameStage();
	return com_ragestudio_utils_game_GameStage.instance;
};
com_ragestudio_utils_game_GameStage.__super__ = PIXI.Container;
com_ragestudio_utils_game_GameStage.prototype = $extend(PIXI.Container.prototype,{
	init: function(pRender,pSafeZoneWidth,pSafeZoneHeight,pCenterGameContainer,pCenterScreensContainer,pCenterPopinContainer) {
		if(pCenterPopinContainer == null) pCenterPopinContainer = true;
		if(pCenterScreensContainer == null) pCenterScreensContainer = true;
		if(pCenterGameContainer == null) pCenterGameContainer = false;
		if(pSafeZoneHeight == null) pSafeZoneHeight = 2048;
		if(pSafeZoneWidth == null) pSafeZoneWidth = 2048;
		this._safeZone = new PIXI.Rectangle(0,0,_$UInt_UInt_$Impl_$.toFloat(pSafeZoneWidth),_$UInt_UInt_$Impl_$.toFloat(pSafeZoneHeight));
		if(pCenterGameContainer) {
			this.gameContainer.x = this.get_safeZone().width / 2;
			this.gameContainer.y = this.get_safeZone().height / 2;
		}
		if(pCenterScreensContainer) {
			this.screensContainer.x = this.get_safeZone().width / 2;
			this.screensContainer.y = this.get_safeZone().height / 2;
		}
		if(pCenterPopinContainer) {
			this.popinsContainer.x = this.get_safeZone().width / 2;
			this.popinsContainer.y = this.get_safeZone().height / 2;
		}
		this._render = pRender;
	}
	,resize: function() {
		var lWidth = com_ragestudio_utils_system_DeviceCapabilities.get_width();
		var lHeight = com_ragestudio_utils_system_DeviceCapabilities.get_height();
		var lRatio = Math.round(10000 * Math.min((function($this) {
			var $r;
			var b = $this.get_safeZone().width;
			$r = _$UInt_UInt_$Impl_$.toFloat(lWidth) / b;
			return $r;
		}(this)),(function($this) {
			var $r;
			var b1 = $this.get_safeZone().height;
			$r = _$UInt_UInt_$Impl_$.toFloat(lHeight) / b1;
			return $r;
		}(this)))) / 10000;
		if(this.get_scaleMode() == com_ragestudio_utils_game_GameStageScale.SHOW_ALL) this.scale.set(lRatio,lRatio); else this.scale.set(com_ragestudio_utils_system_DeviceCapabilities.textureRatio,com_ragestudio_utils_system_DeviceCapabilities.textureRatio);
		if(this.get_alignMode() == com_ragestudio_utils_game_GameStageAlign.LEFT || this.get_alignMode() == com_ragestudio_utils_game_GameStageAlign.TOP_LEFT || this.get_alignMode() == com_ragestudio_utils_game_GameStageAlign.BOTTOM_LEFT) this.x = 0; else if(this.get_alignMode() == com_ragestudio_utils_game_GameStageAlign.RIGHT || this.get_alignMode() == com_ragestudio_utils_game_GameStageAlign.TOP_RIGHT || this.get_alignMode() == com_ragestudio_utils_game_GameStageAlign.BOTTOM_RIGHT) {
			var b2 = this.get_safeZone().width * this.scale.x;
			this.x = _$UInt_UInt_$Impl_$.toFloat(lWidth) - b2;
		} else this.x = (function($this) {
			var $r;
			var b3 = $this.get_safeZone().width * $this.scale.x;
			$r = _$UInt_UInt_$Impl_$.toFloat(lWidth) - b3;
			return $r;
		}(this)) / 2;
		if(this.get_alignMode() == com_ragestudio_utils_game_GameStageAlign.TOP || this.get_alignMode() == com_ragestudio_utils_game_GameStageAlign.TOP_LEFT || this.get_alignMode() == com_ragestudio_utils_game_GameStageAlign.TOP_RIGHT) this.y = 0; else if(this.get_alignMode() == com_ragestudio_utils_game_GameStageAlign.BOTTOM || this.get_alignMode() == com_ragestudio_utils_game_GameStageAlign.BOTTOM_LEFT || this.get_alignMode() == com_ragestudio_utils_game_GameStageAlign.BOTTOM_RIGHT) {
			var b4 = this.get_safeZone().height * this.scale.y;
			this.y = _$UInt_UInt_$Impl_$.toFloat(lHeight) - b4;
		} else this.y = (function($this) {
			var $r;
			var b5 = $this.get_safeZone().height * $this.scale.y;
			$r = _$UInt_UInt_$Impl_$.toFloat(lHeight) - b5;
			return $r;
		}(this)) / 2;
		this.render();
		this.emit("resize",{ width : lWidth, height : lHeight});
	}
	,render: function() {
		if(this._render != null) this._render();
	}
	,get_alignMode: function() {
		return this._alignMode;
	}
	,set_alignMode: function(pAlign) {
		this._alignMode = pAlign;
		this.resize();
		return this._alignMode;
	}
	,get_scaleMode: function() {
		return this._scaleMode;
	}
	,set_scaleMode: function(pScale) {
		this._scaleMode = pScale;
		this.resize();
		return this._scaleMode;
	}
	,get_safeZone: function() {
		return this._safeZone;
	}
	,getGameContainer: function() {
		return this.gameContainer;
	}
	,getScreensContainer: function() {
		return this.screensContainer;
	}
	,getHudContainer: function() {
		return this.hudContainer;
	}
	,getPopinsContainer: function() {
		return this.popinsContainer;
	}
	,destroy: function() {
		com_ragestudio_utils_game_GameStage.instance = null;
		PIXI.Container.prototype.destroy.call(this,true);
	}
	,__class__: com_ragestudio_utils_game_GameStage
});
var com_ragestudio_utils_game_GameStageAlign = { __ename__ : true, __constructs__ : ["TOP","TOP_LEFT","TOP_RIGHT","CENTER","LEFT","RIGHT","BOTTOM","BOTTOM_LEFT","BOTTOM_RIGHT"] };
com_ragestudio_utils_game_GameStageAlign.TOP = ["TOP",0];
com_ragestudio_utils_game_GameStageAlign.TOP.toString = $estr;
com_ragestudio_utils_game_GameStageAlign.TOP.__enum__ = com_ragestudio_utils_game_GameStageAlign;
com_ragestudio_utils_game_GameStageAlign.TOP_LEFT = ["TOP_LEFT",1];
com_ragestudio_utils_game_GameStageAlign.TOP_LEFT.toString = $estr;
com_ragestudio_utils_game_GameStageAlign.TOP_LEFT.__enum__ = com_ragestudio_utils_game_GameStageAlign;
com_ragestudio_utils_game_GameStageAlign.TOP_RIGHT = ["TOP_RIGHT",2];
com_ragestudio_utils_game_GameStageAlign.TOP_RIGHT.toString = $estr;
com_ragestudio_utils_game_GameStageAlign.TOP_RIGHT.__enum__ = com_ragestudio_utils_game_GameStageAlign;
com_ragestudio_utils_game_GameStageAlign.CENTER = ["CENTER",3];
com_ragestudio_utils_game_GameStageAlign.CENTER.toString = $estr;
com_ragestudio_utils_game_GameStageAlign.CENTER.__enum__ = com_ragestudio_utils_game_GameStageAlign;
com_ragestudio_utils_game_GameStageAlign.LEFT = ["LEFT",4];
com_ragestudio_utils_game_GameStageAlign.LEFT.toString = $estr;
com_ragestudio_utils_game_GameStageAlign.LEFT.__enum__ = com_ragestudio_utils_game_GameStageAlign;
com_ragestudio_utils_game_GameStageAlign.RIGHT = ["RIGHT",5];
com_ragestudio_utils_game_GameStageAlign.RIGHT.toString = $estr;
com_ragestudio_utils_game_GameStageAlign.RIGHT.__enum__ = com_ragestudio_utils_game_GameStageAlign;
com_ragestudio_utils_game_GameStageAlign.BOTTOM = ["BOTTOM",6];
com_ragestudio_utils_game_GameStageAlign.BOTTOM.toString = $estr;
com_ragestudio_utils_game_GameStageAlign.BOTTOM.__enum__ = com_ragestudio_utils_game_GameStageAlign;
com_ragestudio_utils_game_GameStageAlign.BOTTOM_LEFT = ["BOTTOM_LEFT",7];
com_ragestudio_utils_game_GameStageAlign.BOTTOM_LEFT.toString = $estr;
com_ragestudio_utils_game_GameStageAlign.BOTTOM_LEFT.__enum__ = com_ragestudio_utils_game_GameStageAlign;
com_ragestudio_utils_game_GameStageAlign.BOTTOM_RIGHT = ["BOTTOM_RIGHT",8];
com_ragestudio_utils_game_GameStageAlign.BOTTOM_RIGHT.toString = $estr;
com_ragestudio_utils_game_GameStageAlign.BOTTOM_RIGHT.__enum__ = com_ragestudio_utils_game_GameStageAlign;
var com_ragestudio_utils_game_GameStageScale = { __ename__ : true, __constructs__ : ["NO_SCALE","SHOW_ALL"] };
com_ragestudio_utils_game_GameStageScale.NO_SCALE = ["NO_SCALE",0];
com_ragestudio_utils_game_GameStageScale.NO_SCALE.toString = $estr;
com_ragestudio_utils_game_GameStageScale.NO_SCALE.__enum__ = com_ragestudio_utils_game_GameStageScale;
com_ragestudio_utils_game_GameStageScale.SHOW_ALL = ["SHOW_ALL",1];
com_ragestudio_utils_game_GameStageScale.SHOW_ALL.toString = $estr;
com_ragestudio_utils_game_GameStageScale.SHOW_ALL.__enum__ = com_ragestudio_utils_game_GameStageScale;
var com_ragestudio_utils_sounds_SoundManager = function() {
};
$hxClasses["com.ragestudio.utils.sounds.SoundManager"] = com_ragestudio_utils_sounds_SoundManager;
com_ragestudio_utils_sounds_SoundManager.__name__ = ["com","ragestudio","utils","sounds","SoundManager"];
com_ragestudio_utils_sounds_SoundManager.addSound = function(pName,pSound) {
	if(com_ragestudio_utils_sounds_SoundManager.list == null) com_ragestudio_utils_sounds_SoundManager.list = new haxe_ds_StringMap();
	{
		com_ragestudio_utils_sounds_SoundManager.list.set(pName,pSound);
		pSound;
	}
};
com_ragestudio_utils_sounds_SoundManager.getSound = function(pName) {
	return com_ragestudio_utils_sounds_SoundManager.list.get(pName);
};
com_ragestudio_utils_sounds_SoundManager.prototype = {
	__class__: com_ragestudio_utils_sounds_SoundManager
};
var com_ragestudio_utils_system_DeviceCapabilities = function() { };
$hxClasses["com.ragestudio.utils.system.DeviceCapabilities"] = com_ragestudio_utils_system_DeviceCapabilities;
com_ragestudio_utils_system_DeviceCapabilities.__name__ = ["com","ragestudio","utils","system","DeviceCapabilities"];
com_ragestudio_utils_system_DeviceCapabilities.get_height = function() {
	return window.innerHeight;
};
com_ragestudio_utils_system_DeviceCapabilities.get_width = function() {
	return window.innerWidth;
};
com_ragestudio_utils_system_DeviceCapabilities.get_system = function() {
	if(new EReg("IEMobile","i").match(window.navigator.userAgent)) return "IEMobile"; else if(new EReg("iPhone|iPad|iPod","i").match(window.navigator.userAgent)) return "iOS"; else if(new EReg("BlackBerry","i").match(window.navigator.userAgent)) return "BlackBerry"; else if(new EReg("PlayBook","i").match(window.navigator.userAgent)) return "BlackBerry PlayBook"; else if(new EReg("Android","i").match(window.navigator.userAgent)) return "Android"; else return "Desktop";
};
com_ragestudio_utils_system_DeviceCapabilities.get_isCocoonJS = function() {
	return window.navigator.isCocoonJS;
};
com_ragestudio_utils_system_DeviceCapabilities.displayFullScreenButton = function() {
	if(com_ragestudio_utils_system_DeviceCapabilities.get_isCocoonJS()) return;
	if(!new EReg("(iPad|iPhone|iPod)","g").match(window.navigator.userAgent) && !new EReg("MSIE","i").match(window.navigator.userAgent)) {
		window.document.onfullscreenchange = com_ragestudio_utils_system_DeviceCapabilities.onChangeFullScreen;
		window.document.onwebkitfullscreenchange = com_ragestudio_utils_system_DeviceCapabilities.onChangeFullScreen;
		window.document.onmozfullscreenchange = com_ragestudio_utils_system_DeviceCapabilities.onChangeFullScreen;
		window.document.onmsfullscreenchange = com_ragestudio_utils_system_DeviceCapabilities.onChangeFullScreen;
		com_ragestudio_utils_system_DeviceCapabilities.fullScreenButton = new Image();
		com_ragestudio_utils_system_DeviceCapabilities.fullScreenButton.style.position = "absolute";
		com_ragestudio_utils_system_DeviceCapabilities.fullScreenButton.style.right = "0px";
		com_ragestudio_utils_system_DeviceCapabilities.fullScreenButton.style.top = "0px";
		com_ragestudio_utils_system_DeviceCapabilities.fullScreenButton.style.cursor = "pointer";
		com_ragestudio_utils_system_DeviceCapabilities.fullScreenButton.width = Std["int"](com_ragestudio_utils_system_DeviceCapabilities.getSizeFactor() * 0.075);
		com_ragestudio_utils_system_DeviceCapabilities.fullScreenButton.height = Std["int"](com_ragestudio_utils_system_DeviceCapabilities.getSizeFactor() * 0.075);
		com_ragestudio_utils_system_DeviceCapabilities.fullScreenButton.onclick = com_ragestudio_utils_system_DeviceCapabilities.enterFullscreen;
		com_ragestudio_utils_system_DeviceCapabilities.fullScreenButton.src = com_ragestudio_utils_Config.get_assetsPath() + "fullscreen.png";
		window.document.body.appendChild(com_ragestudio_utils_system_DeviceCapabilities.fullScreenButton);
	}
};
com_ragestudio_utils_system_DeviceCapabilities.enterFullscreen = function(pEvent) {
	var lDocElm = window.document.documentElement;
	if($bind(lDocElm,lDocElm.requestFullscreen) != null) lDocElm.requestFullscreen(); else if(lDocElm.mozRequestFullScreen != null) lDocElm.mozRequestFullScreen(); else if(lDocElm.webkitRequestFullScreen != null) lDocElm.webkitRequestFullScreen(); else if(lDocElm.msRequestFullscreen != null) lDocElm.msRequestFullscreen();
};
com_ragestudio_utils_system_DeviceCapabilities.exitFullscreen = function() {
	if(($_=window.document,$bind($_,$_.exitFullscreen)) != null) window.document.exitFullscreen(); else if(window.document.mozCancelFullScreen != null) window.document.mozCancelFullScreen(); else if(window.document.webkitCancelFullScreen != null) window.document.webkitCancelFullScreen(); else if(window.document.msExitFullscreen) window.document.msExitFullscreen();
};
com_ragestudio_utils_system_DeviceCapabilities.onChangeFullScreen = function(pEvent) {
	if(window.document.fullScreen || (window.document.mozFullScreen || (window.document.webkitIsFullScreen || window.document.msFullscreenElement))) com_ragestudio_utils_system_DeviceCapabilities.fullScreenButton.style.display = "none"; else com_ragestudio_utils_system_DeviceCapabilities.fullScreenButton.style.display = "block";
	pEvent.preventDefault();
};
com_ragestudio_utils_system_DeviceCapabilities.getSizeFactor = function() {
	var lSize = Math.floor(Math.min(window.screen.width,window.screen.height));
	if(com_ragestudio_utils_system_DeviceCapabilities.get_system() == "Desktop") lSize /= 3;
	return lSize;
};
com_ragestudio_utils_system_DeviceCapabilities.getScreenRect = function(pTarget) {
	var lTopLeft = new PIXI.Point(0,0);
	var lBottomRight = new PIXI.Point(_$UInt_UInt_$Impl_$.toFloat(com_ragestudio_utils_system_DeviceCapabilities.get_width()),_$UInt_UInt_$Impl_$.toFloat(com_ragestudio_utils_system_DeviceCapabilities.get_height()));
	lTopLeft = pTarget.toLocal(lTopLeft);
	lBottomRight = pTarget.toLocal(lBottomRight);
	return new PIXI.Rectangle(lTopLeft.x,lTopLeft.y,lBottomRight.x - lTopLeft.x,lBottomRight.y - lTopLeft.y);
};
com_ragestudio_utils_system_DeviceCapabilities.scaleViewport = function() {
	if(com_ragestudio_utils_system_DeviceCapabilities.get_system() == "IEMobile") return;
	com_ragestudio_utils_system_DeviceCapabilities.screenRatio = window.devicePixelRatio;
	if(!com_ragestudio_utils_system_DeviceCapabilities.get_isCocoonJS()) window.document.write("<meta name=\"viewport\" content=\"initial-scale=" + Math.round(100 / com_ragestudio_utils_system_DeviceCapabilities.screenRatio) / 100 + ", user-scalable=no, minimal-ui\">");
};
com_ragestudio_utils_system_DeviceCapabilities.init = function(pHd,pMd,pLd) {
	if(pLd == null) pLd = 0.25;
	if(pMd == null) pMd = 0.5;
	if(pHd == null) pHd = 1;
	{
		com_ragestudio_utils_system_DeviceCapabilities.texturesRatios.set("hd",pHd);
		pHd;
	}
	{
		com_ragestudio_utils_system_DeviceCapabilities.texturesRatios.set("md",pMd);
		pMd;
	}
	{
		com_ragestudio_utils_system_DeviceCapabilities.texturesRatios.set("ld",pLd);
		pLd;
	}
	if(com_ragestudio_utils_Config.get_data().texture != null && com_ragestudio_utils_Config.get_data().texture != "") com_ragestudio_utils_system_DeviceCapabilities.textureType = com_ragestudio_utils_Config.get_data().texture; else {
		var lRatio = Math.min(window.screen.width * com_ragestudio_utils_system_DeviceCapabilities.screenRatio / com_ragestudio_utils_game_GameStage.getInstance().get_safeZone().width,window.screen.height * com_ragestudio_utils_system_DeviceCapabilities.screenRatio / com_ragestudio_utils_game_GameStage.getInstance().get_safeZone().height);
		if(lRatio <= 0.25) com_ragestudio_utils_system_DeviceCapabilities.textureType = "ld"; else if(lRatio <= 0.5) com_ragestudio_utils_system_DeviceCapabilities.textureType = "md"; else com_ragestudio_utils_system_DeviceCapabilities.textureType = "hd";
	}
	com_ragestudio_utils_system_DeviceCapabilities.textureRatio = com_ragestudio_utils_system_DeviceCapabilities.texturesRatios.get(com_ragestudio_utils_system_DeviceCapabilities.textureType);
};
var com_ragestudio_utils_ui_UIPosition = function() {
};
$hxClasses["com.ragestudio.utils.ui.UIPosition"] = com_ragestudio_utils_ui_UIPosition;
com_ragestudio_utils_ui_UIPosition.__name__ = ["com","ragestudio","utils","ui","UIPosition"];
com_ragestudio_utils_ui_UIPosition.setPosition = function(pTarget,pPosition,pOffsetX,pOffsetY) {
	if(pOffsetY == null) pOffsetY = 0;
	if(pOffsetX == null) pOffsetX = 0;
	var lScreen = com_ragestudio_utils_system_DeviceCapabilities.getScreenRect(pTarget.parent);
	var lTopLeft = new PIXI.Point(lScreen.x,lScreen.y);
	var lBottomRight = new PIXI.Point(lScreen.x + lScreen.width,lScreen.y + lScreen.height);
	if(pPosition == "top" || pPosition == "topLeft" || pPosition == "topRight") pTarget.y = lTopLeft.y + pOffsetY;
	if(pPosition == "bottom" || pPosition == "bottomLeft" || pPosition == "bottomRight") pTarget.y = lBottomRight.y - pOffsetY;
	if(pPosition == "left" || pPosition == "topLeft" || pPosition == "bottomLeft") pTarget.x = lTopLeft.x + pOffsetX;
	if(pPosition == "right" || pPosition == "topRight" || pPosition == "bottomRight") pTarget.x = lBottomRight.x - pOffsetX;
	if(pPosition == "fitWidth" || pPosition == "fitScreen") {
		pTarget.x = lTopLeft.x;
		pTarget.width = lBottomRight.x - lTopLeft.x;
	}
	if(pPosition == "fitHeight" || pPosition == "fitScreen") {
		pTarget.y = lTopLeft.y;
		pTarget.height = lBottomRight.y - lTopLeft.y;
	}
};
com_ragestudio_utils_ui_UIPosition.prototype = {
	__class__: com_ragestudio_utils_ui_UIPosition
};
var haxe_IMap = function() { };
$hxClasses["haxe.IMap"] = haxe_IMap;
haxe_IMap.__name__ = ["haxe","IMap"];
haxe_IMap.prototype = {
	__class__: haxe_IMap
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe_Timer;
haxe_Timer.__name__ = ["haxe","Timer"];
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe_Timer
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		if(__map_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) return false;
			delete(this.rh[key]);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			return true;
		}
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,__class__: haxe_ds_StringMap
};
var haxe_xml_Parser = function() { };
$hxClasses["haxe.xml.Parser"] = haxe_xml_Parser;
haxe_xml_Parser.__name__ = ["haxe","xml","Parser"];
haxe_xml_Parser.parse = function(str,strict) {
	if(strict == null) strict = false;
	var doc = Xml.createDocument();
	haxe_xml_Parser.doParse(str,strict,0,doc);
	return doc;
};
haxe_xml_Parser.doParse = function(str,strict,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	var buf = new StringBuf();
	var escapeNext = 1;
	var attrValQuote = -1;
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				buf.addSub(str,start,p - start);
				var child = Xml.createPCData(buf.b);
				buf = new StringBuf();
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			} else if(c == 38) {
				buf.addSub(str,start,p - start);
				state = 18;
				escapeNext = 13;
				start = p + 1;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child1 = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child1);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw new js__$Boot_HaxeError("Expected <![CDATA[");
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw new js__$Boot_HaxeError("Expected <!DOCTYPE");
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw new js__$Boot_HaxeError("Expected <!--"); else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw new js__$Boot_HaxeError("Expected node name");
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw new js__$Boot_HaxeError("Expected node name");
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				nsubs++;
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				break;
			case 62:
				state = 9;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw new js__$Boot_HaxeError("Expected attribute name");
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw new js__$Boot_HaxeError("Duplicate attribute");
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw new js__$Boot_HaxeError("Expected =");
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				buf = new StringBuf();
				state = 8;
				start = p + 1;
				attrValQuote = c;
				break;
			default:
				throw new js__$Boot_HaxeError("Expected \"");
			}
			break;
		case 8:
			switch(c) {
			case 38:
				buf.addSub(str,start,p - start);
				state = 18;
				escapeNext = 8;
				start = p + 1;
				break;
			case 62:
				if(strict) throw new js__$Boot_HaxeError("Invalid unescaped " + String.fromCharCode(c) + " in attribute value"); else if(c == attrValQuote) {
					buf.addSub(str,start,p - start);
					var val = buf.b;
					buf = new StringBuf();
					xml.set(aname,val);
					state = 0;
					next = 4;
				}
				break;
			case 60:
				if(strict) throw new js__$Boot_HaxeError("Invalid unescaped " + String.fromCharCode(c) + " in attribute value"); else if(c == attrValQuote) {
					buf.addSub(str,start,p - start);
					var val1 = buf.b;
					buf = new StringBuf();
					xml.set(aname,val1);
					state = 0;
					next = 4;
				}
				break;
			default:
				if(c == attrValQuote) {
					buf.addSub(str,start,p - start);
					var val2 = buf.b;
					buf = new StringBuf();
					xml.set(aname,val2);
					state = 0;
					next = 4;
				}
			}
			break;
		case 9:
			p = haxe_xml_Parser.doParse(str,strict,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw new js__$Boot_HaxeError("Expected >");
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw new js__$Boot_HaxeError("Expected >");
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw new js__$Boot_HaxeError("Expected node name");
				var v = HxOverrides.substr(str,start,p - start);
				if(v != (function($this) {
					var $r;
					if(parent.nodeType != Xml.Element) throw new js__$Boot_HaxeError("Bad node type, expected Element but found " + parent.nodeType);
					$r = parent.nodeName;
					return $r;
				}(this))) throw new js__$Boot_HaxeError("Expected </" + (function($this) {
					var $r;
					if(parent.nodeType != Xml.Element) throw "Bad node type, expected Element but found " + parent.nodeType;
					$r = parent.nodeName;
					return $r;
				}(this)) + ">");
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				var xml1 = Xml.createComment(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml1);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				var xml2 = Xml.createDocType(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml2);
				nsubs++;
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				var xml3 = Xml.createProcessingInstruction(str1);
				parent.addChild(xml3);
				nsubs++;
				state = 1;
			}
			break;
		case 18:
			if(c == 59) {
				var s = HxOverrides.substr(str,start,p - start);
				if(s.charCodeAt(0) == 35) {
					var c1;
					if(s.charCodeAt(1) == 120) c1 = Std.parseInt("0" + HxOverrides.substr(s,1,s.length - 1)); else c1 = Std.parseInt(HxOverrides.substr(s,1,s.length - 1));
					buf.b += String.fromCharCode(c1);
				} else if(!haxe_xml_Parser.escapes.exists(s)) {
					if(strict) throw new js__$Boot_HaxeError("Undefined entity: " + s);
					buf.b += Std.string("&" + s + ";");
				} else buf.add(haxe_xml_Parser.escapes.get(s));
				start = p + 1;
				state = escapeNext;
			} else if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45) && c != 35) {
				if(strict) throw new js__$Boot_HaxeError("Invalid character in entity: " + String.fromCharCode(c));
				buf.b += "&";
				buf.addSub(str,start,p - start);
				p--;
				start = p + 1;
				state = escapeNext;
			}
			break;
		}
		c = StringTools.fastCodeAt(str,++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) {
			buf.addSub(str,start,p - start);
			var xml4 = Xml.createPCData(buf.b);
			parent.addChild(xml4);
			nsubs++;
		}
		return p;
	}
	if(!strict && state == 18 && escapeNext == 13) {
		buf.b += "&";
		buf.addSub(str,start,p - start);
		var xml5 = Xml.createPCData(buf.b);
		parent.addChild(xml5);
		nsubs++;
		return p;
	}
	throw new js__$Boot_HaxeError("Unexpected end");
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
$hxClasses["js._Boot.HaxeError"] = js__$Boot_HaxeError;
js__$Boot_HaxeError.__name__ = ["js","_Boot","HaxeError"];
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = ["js","Boot"];
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__cast = function(o,t) {
	if(js_Boot.__instanceof(o,t)) return o; else throw new js__$Boot_HaxeError("Cannot cast " + Std.string(o) + " to " + Std.string(t));
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
$hxClasses.Math = Math;
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
$hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var __map_reserved = {}
Perf.MEASUREMENT_INTERVAL = 1000;
Perf.FONT_FAMILY = "Helvetica,Arial";
Perf.FPS_BG_CLR = "#00FF00";
Perf.FPS_WARN_BG_CLR = "#FF8000";
Perf.FPS_PROB_BG_CLR = "#FF0000";
Perf.MS_BG_CLR = "#FFFF00";
Perf.MEM_BG_CLR = "#086A87";
Perf.INFO_BG_CLR = "#00FFFF";
Perf.FPS_TXT_CLR = "#000000";
Perf.MS_TXT_CLR = "#000000";
Perf.MEM_TXT_CLR = "#FFFFFF";
Perf.INFO_TXT_CLR = "#000000";
Perf.TOP_LEFT = "TL";
Perf.TOP_RIGHT = "TR";
Perf.BOTTOM_LEFT = "BL";
Perf.BOTTOM_RIGHT = "BR";
Xml.Element = 0;
Xml.PCData = 1;
Xml.CData = 2;
Xml.Comment = 3;
Xml.DocType = 4;
Xml.ProcessingInstruction = 5;
Xml.Document = 6;
com_ragestudio_Main.configPath = "config.json";
com_ragestudio_Main.FPS = 16;
com_ragestudio_utils_game_StateGraphic.textureDigits = 4;
com_ragestudio_utils_game_StateGraphic.animAlpha = 1;
com_ragestudio_utils_game_StateGraphic.boxAlpha = 0;
com_ragestudio_game_sprites_Mobile.WAIT_STATE = "wait";
com_ragestudio_game_sprites_entities_Player.list = [];
com_ragestudio_game_Generator.PLAYER_NAME = "Player";
com_ragestudio_game_Generator.ELEMENT_LIST = (function($this) {
	var $r;
	var _g = new haxe_ds_StringMap();
	{
		var value = Type.getClassName(com_ragestudio_game_sprites_entities_Player);
		if(__map_reserved.Player != null) _g.setReserved("Player",value); else _g.h["Player"] = value;
	}
	$r = _g;
	return $r;
}(this));
com_ragestudio_game_PoolManager.jsonPool = new haxe_ds_StringMap();
com_ragestudio_game_PoolManager.available = new haxe_ds_StringMap();
com_ragestudio_utils_loader_GameLoader.txtLoaded = new haxe_ds_StringMap();
com_ragestudio_ui_LoaderManager.PRELOAD_PHASE_NAME = "preload";
com_ragestudio_ui_LoaderManager.GENERAL_PHASE_NAME = "general";
com_ragestudio_ui_LoaderManager.WORLD_PHASE_NAME = "world";
com_ragestudio_ui_screens_GraphicLoader.MARGIN_TOP = 500;
com_ragestudio_utils_Config._data = { };
com_ragestudio_utils_Debug.QR_SIZE = 0.35;
com_ragestudio_utils_events_EventType.GAME_LOOP = "gameLoop";
com_ragestudio_utils_events_EventType.RESIZE = "resize";
com_ragestudio_utils_events_EventType.ADDED = "added";
com_ragestudio_utils_events_EventType.REMOVED = "removed";
com_ragestudio_utils_events_LoadEventType.COMPLETE = "complete";
com_ragestudio_utils_events_LoadEventType.LOADED = "load";
com_ragestudio_utils_events_LoadEventType.PROGRESS = "progress";
com_ragestudio_utils_events_LoadEventType.ERROR = "error";
com_ragestudio_utils_events_MouseEventType.MOUSE_MOVE = "mousemove";
com_ragestudio_utils_events_MouseEventType.MOUSE_DOWN = "mousedown";
com_ragestudio_utils_events_MouseEventType.MOUSE_OUT = "mouseout";
com_ragestudio_utils_events_MouseEventType.MOUSE_OVER = "mouseover";
com_ragestudio_utils_events_MouseEventType.MOUSE_UP = "mouseup";
com_ragestudio_utils_events_MouseEventType.MOUSE_UP_OUTSIDE = "mouseupoutside";
com_ragestudio_utils_events_MouseEventType.CLICK = "click";
com_ragestudio_utils_events_MouseEventType.RIGHT_DOWN = "rightdown";
com_ragestudio_utils_events_MouseEventType.RIGHT_UP = "rightup";
com_ragestudio_utils_events_MouseEventType.RIGHT_UP_OUTSIDE = "rightupoutside";
com_ragestudio_utils_events_MouseEventType.RIGHT_CLICK = "rightclick";
com_ragestudio_utils_events_TouchEventType.TOUCH_START = "touchstart";
com_ragestudio_utils_events_TouchEventType.TOUCH_MOVE = "touchmove";
com_ragestudio_utils_events_TouchEventType.TOUCH_END = "touchend";
com_ragestudio_utils_events_TouchEventType.TOUCH_END_OUTSIDE = "touchendoutside";
com_ragestudio_utils_events_TouchEventType.TAP = "tap";
com_ragestudio_utils_game_GameStage.SAFE_ZONE_WIDTH = 2048;
com_ragestudio_utils_game_GameStage.SAFE_ZONE_HEIGHT = 1366;
com_ragestudio_utils_system_DeviceCapabilities.SYSTEM_ANDROID = "Android";
com_ragestudio_utils_system_DeviceCapabilities.SYSTEM_IOS = "iOS";
com_ragestudio_utils_system_DeviceCapabilities.SYSTEM_BLACKBERRY = "BlackBerry";
com_ragestudio_utils_system_DeviceCapabilities.SYSTEM_BB_PLAYBOOK = "BlackBerry PlayBook";
com_ragestudio_utils_system_DeviceCapabilities.SYSTEM_WINDOWS_MOBILE = "IEMobile";
com_ragestudio_utils_system_DeviceCapabilities.SYSTEM_DESKTOP = "Desktop";
com_ragestudio_utils_system_DeviceCapabilities.ICON_SIZE = 0.075;
com_ragestudio_utils_system_DeviceCapabilities.TEXTURE_NO_SCALE = "";
com_ragestudio_utils_system_DeviceCapabilities.TEXTURE_HD = "hd";
com_ragestudio_utils_system_DeviceCapabilities.TEXTURE_MD = "md";
com_ragestudio_utils_system_DeviceCapabilities.TEXTURE_LD = "ld";
com_ragestudio_utils_system_DeviceCapabilities.texturesRatios = (function($this) {
	var $r;
	var _g = new haxe_ds_StringMap();
	if(__map_reserved.hd != null) _g.setReserved("hd",1); else _g.h["hd"] = 1;
	if(__map_reserved.md != null) _g.setReserved("md",0.5); else _g.h["md"] = 0.5;
	if(__map_reserved.ld != null) _g.setReserved("ld",0.25); else _g.h["ld"] = 0.25;
	$r = _g;
	return $r;
}(this));
com_ragestudio_utils_system_DeviceCapabilities.textureRatio = 1;
com_ragestudio_utils_system_DeviceCapabilities.textureType = "";
com_ragestudio_utils_system_DeviceCapabilities.screenRatio = 1;
com_ragestudio_utils_ui_UIPosition.LEFT = "left";
com_ragestudio_utils_ui_UIPosition.RIGHT = "right";
com_ragestudio_utils_ui_UIPosition.TOP = "top";
com_ragestudio_utils_ui_UIPosition.BOTTOM = "bottom";
com_ragestudio_utils_ui_UIPosition.TOP_LEFT = "topLeft";
com_ragestudio_utils_ui_UIPosition.TOP_RIGHT = "topRight";
com_ragestudio_utils_ui_UIPosition.BOTTOM_LEFT = "bottomLeft";
com_ragestudio_utils_ui_UIPosition.BOTTOM_RIGHT = "bottomRight";
com_ragestudio_utils_ui_UIPosition.FIT_WIDTH = "fitWidth";
com_ragestudio_utils_ui_UIPosition.FIT_HEIGHT = "fitHeight";
com_ragestudio_utils_ui_UIPosition.FIT_SCREEN = "fitScreen";
haxe_xml_Parser.escapes = (function($this) {
	var $r;
	var h = new haxe_ds_StringMap();
	if(__map_reserved.lt != null) h.setReserved("lt","<"); else h.h["lt"] = "<";
	if(__map_reserved.gt != null) h.setReserved("gt",">"); else h.h["gt"] = ">";
	if(__map_reserved.amp != null) h.setReserved("amp","&"); else h.h["amp"] = "&";
	if(__map_reserved.quot != null) h.setReserved("quot","\""); else h.h["quot"] = "\"";
	if(__map_reserved.apos != null) h.setReserved("apos","'"); else h.h["apos"] = "'";
	$r = h;
	return $r;
}(this));
js_Boot.__toStr = {}.toString;
com_ragestudio_Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
