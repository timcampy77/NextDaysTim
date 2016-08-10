package com.ragestudio;

import com.ragestudio.ui.screens.GraphicLoader;
import com.ragestudio.ui.LoaderManager;
import com.ragestudio.ui.screens.SpriteAmplified;
import com.ragestudio.ui.screens.TitleCard;
import com.ragestudio.ui.UIManager;
import com.ragestudio.utils.Config;
import com.ragestudio.utils.Debug;
import com.ragestudio.utils.events.EventType;
import com.ragestudio.utils.events.LoadEventType;
import com.ragestudio.utils.game.GameStage;
import com.ragestudio.utils.game.GameStageScale;
import com.ragestudio.utils.game.StateGraphic;
import com.ragestudio.utils.loader.GameLoader;
import com.ragestudio.utils.sounds.SoundManager;
import com.ragestudio.utils.system.DeviceCapabilities;
import eventemitter3.EventEmitter;
import haxe.Timer;
import js.Browser;
import pixi.core.display.Container;
import pixi.core.renderers.Detector;
import pixi.core.renderers.webgl.WebGLRenderer;
import pixi.interaction.EventTarget;
import pixi.loaders.Loader;
/**
 * Classe d'initialisation et lancement du jeu
 * @author Mathieu ANTHOINE
 */

class Main extends EventEmitter
{
	
	/**
	 * chemin vers le fichier de configuration
	 */
	private static var configPath:String = "config.json";	
	
	/**
	 * instance unique de la classe Main
	 */
	private static var instance: Main;
	
	/**
	 * renderer (WebGL ou Canvas)
	 */
	public var renderer:WebGLRenderer;
	
	/**
	 * Element racine de la displayList
	 */
	public var stage:Container;
	
	public var frames (default, null):Int = 0;
	public static inline var FPS:Int = 16;//Math.floor(1000 / 60);
	private var blackBarLeft:SpriteAmplified = new SpriteAmplified("black_bg");
	private var blackBarRight:SpriteAmplified = new SpriteAmplified("black_bg");
	private var blackBarTop:SpriteAmplified = new SpriteAmplified("black_bg");
	private var blackBarBot:SpriteAmplified = new SpriteAmplified("black_bg");

	
	/**
	 * initialisation générale
	 */
	private static function main ():Void {
		Main.getInstance();
	}

	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): Main {
		if (instance == null) instance = new Main();
		return instance;
	}
	
	/**
	 * création du jeu et lancement du chargement du fichier de configuration
	 */
	private function new () {
		
		super();
		
		var lOptions:RenderingOptions = {};
		//lOptions.antialias = true;
		//lOptions.autoResize = true;
		lOptions.backgroundColor = 0x9DC07A;
		//lOptions.resolution = 1;
		//lOptions.transparent = false;
		//lOptions.preserveDrawingBuffer (pour dataToURL)
		
		
		DeviceCapabilities.scaleViewport();
		renderer = Detector.autoDetectRenderer(DeviceCapabilities.width, DeviceCapabilities.height,lOptions);
		renderer.roundPixels = true;
		
		Browser.document.body.appendChild(renderer.view);
		
		stage = new Container();
		
		var lConfig:Loader = new Loader();
		configPath += "?" + Date.now().getTime();
		lConfig.add(configPath);
		
		lConfig.once(LoadEventType.COMPLETE, preloadAssets);
		
		lConfig.load();

	}

	
	/**
	 * charge les assets graphiques du preloader principal
	 */
	private function preloadAssets(pLoader:Loader):Void {
		
		// initialise les paramètres de configuration
		Config.init(Reflect.field(pLoader.resources,configPath).data);
		// Active le mode debug
		if (Config.debug) Debug.getInstance().init();
		// défini l'alpha des Boxes de collision
		if (Config.debug && Config.data.boxAlpha != null) StateGraphic.boxAlpha = Config.data.boxAlpha;
		// défini l'alpha des anims
		if (Config.debug && Config.data.animAlpha != null) StateGraphic.animAlpha = Config.data.animAlpha;
		
		
		DeviceCapabilities.init();
		
		
		// défini le mode de redimensionnement du Jeu
		GameStage.getInstance().scaleMode = GameStageScale.SHOW_ALL;
		// initialise le GameStage et défini la taille de la safeZone
		GameStage.getInstance().init(render,2048, 1366);
		
		// affiche le bouton FullScreen quand c'est nécessaire
		DeviceCapabilities.displayFullScreenButton();
		
		// Ajoute le GameStage au stage
		stage.addChild(GameStage.getInstance());
		
		// ajoute Main en tant qu'écouteur des évenements de redimensionnement
		Browser.window.addEventListener(EventType.RESIZE, resize);
		resize();
		
		
		
		// lance le chargement des assets graphiques du preloader
		LoaderManager.getInstance().startLoadingProcess("preload", loadAssets);
	}	
	
	/**
	 * lance le chargement principal
	 */
	private function loadAssets (pLoader:GameLoader): Void {
		LoaderManager.getInstance().startLoadingProcess("general", onLoadComplete);
		
		// affiche l'écran de préchargement
		UIManager.getInstance().openScreen(GraphicLoader.getInstance());
		
		
		//Browser.window.requestAnimationFrame(gameLoop);
		gameLoop();
		
	}
	
	
	/**
	 * initialisation du jeu
	 * @param	pEvent evenement de chargement
	 */
	private function onLoadComplete (): Void {
		
		// Ouvre la TitleClard
		//SoundManager.getSound("uiloop").play();
		UIManager.getInstance().openScreen(TitleCard.getInstance());
		
		/*blackBarLeft.start();
		blackBarRight.start();
		blackBarTop.start();
		blackBarBot.start();
		blackBarLeft.scale.set(GameStage.getInstance().safeZone.width / blackBarLeft.width, GameStage.getInstance().safeZone.height * 2 / blackBarLeft.width);
		blackBarRight.scale.set(GameStage.getInstance().safeZone.width / blackBarRight.width, GameStage.getInstance().safeZone.height * 2 / blackBarRight.width);
		trace(blackBarLeft.width, blackBarLeft.height, blackBarLeft.x);
		blackBarTop.scale.set(GameStage.getInstance().safeZone.width * 2 / blackBarLeft.width, GameStage.getInstance().safeZone.height/ blackBarLeft.width);
		blackBarBot.scale = blackBarTop.scale;*/
	}
	

	/**
	 * game loop
	 */
	private function gameLoop():Void {
		Timer.delay(gameLoop, FPS);
		//Browser.window.requestAnimationFrame(gameLoop);
		render();
		emit(EventType.GAME_LOOP);
		
	}
	
	/**
	 * Ecouteur du redimensionnement
	 * @param	pEvent evenement de redimensionnement
	 */
	public function resize (pEvent:EventTarget = null): Void {
		renderer.resize(DeviceCapabilities.width, DeviceCapabilities.height);
		GameStage.getInstance().resize();
	}
	
	
	
	/**
	 * fait le rendu de l'écran
	 */
	private function render (): Void {
		
		if (frames++ % 2 == 0) renderer.render(stage);
		else GameStage.getInstance().updateTransform();
	}
		
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	public function destroy (): Void {
		Browser.window.removeEventListener(EventType.RESIZE, resize);
		instance = null;
	}
	
}