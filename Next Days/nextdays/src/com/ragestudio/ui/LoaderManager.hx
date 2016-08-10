package com.ragestudio.ui;
import com.ragestudio.game.GameManager;
import com.ragestudio.ui.screens.GraphicLoader;
import com.ragestudio.utils.Config;
import com.ragestudio.utils.events.LoadEventType;
import com.ragestudio.utils.game.StateGraphic;
import com.ragestudio.utils.loader.GameLoader;
import com.ragestudio.utils.system.DeviceCapabilities;
import haxe.Constraints.Function;

/**
 * Class utilitaire permettant de manager simplement les chargements en les découpants en phases
 * @author Nicolas Vernou
 */
class LoaderManager extends GameLoader
{
	
	/**
	 * instance unique de la classe Level1
	 */
	private static var instance: LoaderManager;
	
	public static var PRELOAD_PHASE_NAME (default, never): String = "preload";		//What string shall be entered to load the preload phase
	public static var GENERAL_PHASE_NAME (default, never): String = "general";		//"                                      " general phase
	public static var WORLD_PHASE_NAME (default, never): String = "world";			//Currently obsolete, LevelButton.WORLD_PREFIX will be used instead
	
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): LoaderManager {
		if (instance == null) instance = new LoaderManager();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() 
	{
		super();
	}
	
	/**
	 * Launches a loading process corresponding to a certain phase of the game. There are currently 3 phases : preload, general and world(1, 2 or 3) internaly managed.
	 * @param	pLoadingPhase : Which phase should be launching
	 * @param	pSuccessCallback : Is there a function that should be executed on the loading's end and success
	 * @return	
	 */
	public function startLoadingProcess(pLoadingPhase:String, ?pSuccessCallback:Function):Void {
		var lLoader:GameLoader = new GameLoader();
		if (pLoadingPhase == PRELOAD_PHASE_NAME) {				// ------------------ PRELOAD -------------------
			//Assets
			executeFunctionOnAllArrayElements(Config.data.preload_Fonts, lLoader.addFontFile);
			executeFunctionOnAllArrayElements(Config.data.preload_stateGraphic_Textures, lLoader.addAssetFile);
			executeFunctionOnAllArrayElements(Config.data.preload_Assets, lLoader.addAssetFile);
			
			
		}
		else if (pLoadingPhase == GENERAL_PHASE_NAME) {			// --------------- GENERAL LOADING --------------
			//Assets
			executeFunctionOnAllArrayElements(Config.data.general_Assets, lLoader.addAssetFile);
			//Optimized textures
			executeFunctionOnAllArrayElements(Config.data.general_stateGraphic_Textures, lLoader.addAssetFile);
			//Sounds
			executeFunctionOnAllArrayElements(Config.data.general_Sounds, lLoader.addSoundFile);
			//Fonts
			executeFunctionOnAllArrayElements(Config.data.general_Fonts, lLoader.addFontFile);
			//Texts
			executeFunctionOnAllArrayElements(Config.data.general_Texts, lLoader.addTxtFile);
			
			//Update graphique
			lLoader.on(LoadEventType.PROGRESS, onLoadProgress);
			
		}
		else if (pLoadingPhase == WORLD_PHASE_NAME) {			// --------------- WORLDS LOADING ---------------
			
			
			executeFunctionOnAllArrayElements(Config.data.world_Assets, lLoader.addAssetFile);
			executeFunctionOnAllArrayElements(Config.data.world_stateGraphic_Textures, lLoader.addAssetFile);

			//Update graphique
			lLoader.on(LoadEventType.PROGRESS, onLoadProgress);
			
		}
		else {													// ----------------- UNKNOWN --------------------
			trace('Unknown loading phase "' + pLoadingPhase +'". Should be : "' + PRELOAD_PHASE_NAME + '", "' + GENERAL_PHASE_NAME + '" or "' + WORLD_PHASE_NAME + '". Aborted loading process');
			return;
			
		}
			
		lLoader.once(LoadEventType.COMPLETE, function() { onProcessComplete(lLoader, pLoadingPhase, pSuccessCallback); } );
		
		lLoader.load();
	}
	
	
	/**
	 * Transmits the loading parameters to the graphic element
	 * @param	pEvent Loading event
	 */
	private function onLoadProgress (pLoader:GameLoader): Void {
		GraphicLoader.getInstance().update(pLoader.progress / 100);
	}
	
	
	/**
	 * Manages stateGraphic textures and what comes after a loading phase
	 * @param	pLoader
	 * @param	pLoadingPhase
	 * @param	pSuccessCallback
	 */
	public function onProcessComplete(pLoader:GameLoader, pLoadingPhase:String, pSuccessCallback:Function):Void {
		pLoader.off(LoadEventType.PROGRESS, function() { onProcessComplete(pLoader, pLoadingPhase, pSuccessCallback); } );
		
		if (pLoadingPhase == PRELOAD_PHASE_NAME) {			// ------------------ PRELOAD -------------------
			addTexturesToStateGraphic(Config.data.preload_stateGraphic_Textures);
			trace(Config.data.preload_stateGraphic_Textures);
			
		}
		else if  (pLoadingPhase == GENERAL_PHASE_NAME) {	//------------ GENERAL --------------
			addTexturesToStateGraphic(Config.data.general_stateGraphic_Textures);
			StateGraphic.addBoxes(GameLoader.getContent("boxes.json"));
			
		}											//------------- WORLD ---------------
		else if (pLoadingPhase == WORLD_PHASE_NAME) {
			//Adds the right textures to StateGraphic considering the world we're trying to load
			
			addTexturesToStateGraphic(Config.data.world_stateGraphic_Textures);
		}
		pSuccessCallback();
	}
	
	/**
	 * Permits to execute a function with every element of an array as its parameter
	 * @param	pElementsArray : Array containing every elements we need
	 * @param	pFunction : Function that shall be executed with the elements as its parameter
	 */
	public function executeFunctionOnAllArrayElements(pElementsArray:Array<String>, pFunction:Function, pOptimized:Bool = false):Void {
		var lLength:Int = pElementsArray.length;
		for (i in 0...lLength) {
			pFunction((pOptimized ? (DeviceCapabilities.textureType + "/") : "" ) + pElementsArray[i]);
		}
	}
	
	/**
	 * Adds every texture paths contained in an array to StateGraphic
	 * @param	pTexturesArray : Array containing every elements we need
	 */
	public function addTexturesToStateGraphic(pTexturesArray:Array<String>):Void {
		var lLength:Int = pTexturesArray.length;
		for (i in 0...lLength) {
			// transmet à StateGraphic la description des planches de Sprites utilisées par les anim MovieClip des instances de StateGraphic
			StateGraphic.addTextures(GameLoader.getContent(pTexturesArray[i]));
	
		}
	}
	
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	public function destroy (): Void {
		instance = null;
	}
}