package com.ragestudio.utils ;
import haxe.Json;
import js.Browser;

	
/**
 * Classe utilitaire contenant les données de configuration du jeu
 * @author Mathieu ANTHOINE
 */
class Config 
{
	
	/**
	 * version de l'application
	 */
	public static var version (get,never):String;
	
	/**
	 * langue courante
	 */
	public static var language (get,never): String;
	
	/**
	 * langues disponibles
	 */
	public static var languages (get,never): Array<String>;
	
	/**
	 * défini si le jeu est en mode "debug" ou pas (si prévu dans le code du jeu)
	 */
	public static var debug (get, never): Bool;
	
	/**
	 * défini si il faut afficher les fps ou non
	 */
	public static var fps (get,never): Bool;

	/**
	 * défini si il faut afficher le qrcode ou non
	 */
	public static var qrcode (get, never): Bool;
	
	/** 
	 * chemin du dossier de langues
	 */
	public static var langPath (get, never): String;
	
	/** 
	 * chemin du dossier des fichiers textes
	 */
	public static var txtsPath (get, never): String;
	
	/** 
	 * chemin du dossier d'assets graphiques
	 */
	public static var assetsPath (get, never): String;
	
	
	/** 
	 * chemin du dossier de sons
	 */
	public static var soundsPath (get, never): String;

	/** 
	 * chemin du dossier des polices de caractères
	 */
	public static var fontsPath (get, never): String;	
	
	
	
	/**
	 * ############# LOADER RELATED ###############
	 */
	
	/** 
	 * contient le nom des fichiers de tous les assets à charger lors du preload
	 */
	public static var preload_Assets:Array<String>;
	public static var preload_Fonts:Array<String>;
	public static var preload_stateGraphic_Textures:Array<String>;
	
	/** 
	 * contienent le nom des fichiers de tous les assets, sons, textes et polices à charger lors du load général
	 */
	public static var general_Assets:Array<String>;
	public static var general_Sounds:Array<String>;
	public static var general_Texts:Array<String>;
	public static var general_Fonts:Array<String>;
	/** 
	 * contient le nom des fichiers de tous les éléments à ajouter aux stateGraphic
	 */
	public static var general_stateGraphic_Textures:Array<String>;
	public static var general_stateGraphic_Boxes:Array<String>;
	
	
	/** 
	 * contient le nom des fichiers de tous les assets à charger lors de l'ouverture d'un monde
	 */
	public static var world1_Assets:Array<String>;
	public static var world1_stateGraphic_Textures:Array<String>;
	public static var world2_Assets:Array<String>;
	public static var world2_stateGraphic_Textures:Array<String>;
	public static var world3_Assets:Array<String>;
	public static var world3_stateGraphic_Textures:Array<String>;
	
	
	
	
	
	
	/**
	 * conteneur des données de configuration
	 */
	public static var data (get, never):Dynamic;
	private static var _data:Dynamic={};
	
	public static function init(pConfig:Json): Void {
		for (i in Reflect.fields(pConfig)) Reflect.setField(_data, i, Reflect.field(pConfig, i));
		
		if (_data.version == null || _data.version=="") _data.version = "0.0.0";
		if (_data.language == null || _data.language=="") _data.language = Browser.window.navigator.language.substr(0, 2);
		if (_data.languages=="" || _data.languages == []) _data.languages.push(_data.language);
		if (_data.debug == null || _data.debug=="") _data.debug = false;
		if (_data.fps == null || _data.fps=="") _data.fps = false;
		if (_data.qrcode == null || _data.qrcode=="") _data.qrcode = false;
		
		if (_data.langPath == null) _data.langPath = "";
		if (_data.txtsPath == null) _data.txtsPath = "";
		if (_data.assetsPath == null) _data.assetsPath = "";
		if (_data.fontsPath == null) _data.fontsPath = "";
		if (_data.soundsPath == null) _data.soundsPath = "";
		
		
		if (_data.preload_Assets == null) _data.preload_Assets = [];
		if (_data.preload_Fonts == null) _data.preload_Fonts = [];
		if (_data.preload_stateGraphic_Textures == null) _data.preload_stateGraphic_Textures = [];
		
		if (_data.general_Assets == null) _data.general_Assets = [];
		if (_data.general_Sounds == null) _data.general_Sounds = [];
		if (_data.general_Texts == null) _data.general_Texts = [];
		if (_data.general_Fonts == null) _data.general_Fonts = [];
		if (_data.general_stateGraphic_Textures == null) _data.general_stateGraphic_Textures = [];
		if (_data.general_stateGraphic_Boxes == null) _data.general_stateGraphic_Boxes = [];
		
		if (_data.world1_Assets == null) _data.world_Assets = [];
		if (_data.world1_stateGraphic_Textures == null) _data.world_stateGraphic_Textures = [];
		
	}

	/**
	 * Retourne l'url complète (chemin+version)
	 * @return url complète
	 */
	public static function url (pPath:String):String {
		return pPath + "?" + version;
	}	
	
	private static function get_data ():Dynamic {
		return _data;
	}
	
	private static function get_version ():String {
		return _data.version;
	}
	
	private static function get_language ():String {
		return data.language;
	}
	
	private static function get_languages ():Array<String> {
		return data.languages;
	}
	
	private static function get_debug ():Bool {
		return data.debug;
	}
	
	private static function get_fps ():Bool {
		return data.fps;
	}
	
	private static function get_qrcode ():Bool {
		return data.qrcode;
	}
	
	private static function get_langPath ():String {
		return _data.langPath;
	}

	private static function get_txtsPath ():String {
		return _data.txtsPath;
	}	
	
	private static function get_assetsPath ():String {
		return _data.assetsPath;
	}
	
	private static function get_fontsPath ():String {
		return _data.fontsPath;
	}
	
	private static function get_soundsPath ():String {
		return _data.soundsPath;
	}

}