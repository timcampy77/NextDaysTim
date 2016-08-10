package com.ragestudio.game;
import com.ragestudio.game.sprites.planes.GamePlane;
import com.ragestudio.game.sprites.entities.Player;
import com.ragestudio.game.sprites.PoolObject;
import com.ragestudio.utils.game.GameStage;
import com.ragestudio.utils.loader.GameLoader;
import haxe.Json;
import haxe.Timer;
import js.Browser;
import pixi.core.display.Container;
import pixi.core.math.Point;

	
/**
 * Utilitary class which has references to numerous classes and containers and is able to link strings with them, it also generates the levels.
 * Its main use it basicaly to generate stuff and place it where it belongs according to specified data
 * @author Nicolas VERNOU
 */
class Generator 
{
	
	/**
	 * instance unique de la classe LevelGenerator
	 */
	private static var instance: Generator;
	public static inline var PLAYER_NAME:String = "Player";
	private var spriteSheetLoadersArray:Array<PoolObject>;
	
	/**
	 * List that contains the path to every possible object we could want to generate on a level
	 */
	private static var ELEMENT_LIST(default, never):Map<String, String> = [
	PLAYER_NAME					=>	Type.getClassName(Player)
	/*COLLECTABLE_NAME			=>	Type.getClassName(CollectableSimple),
	"UpgradeDoubleJump" 		=>	Type.getClassName(UpgradeDoubleJump),
	"UpgradeShield" 			=>	Type.getClassName(UpgradeShield),
	"UpgradeSuperShootPlayer" 	=>	Type.getClassName(UpgradeSuperShootPlayer),
	"EnemyBomb" 				=>	Type.getClassName(EnemyBomb),
	"EnemyFire" 				=>	Type.getClassName(EnemyFire),
	"EnemySpeed" 				=>	Type.getClassName(EnemySpeed),
	"EnemyTurret" 				=>	Type.getClassName(EnemyTurret),
	"KillZoneDynamic" 			=>	Type.getClassName(KillZoneDynamic),
	"KillZoneStatic" 			=>	Type.getClassName(KillZoneStatic),
	"Destructible" 				=>	Type.getClassName(Destructible),
	"ShootEnemyTurret"			=>	Type.getClassName(ShootEnemyTurret),
	"ShootEnemyFire"			=>	Type.getClassName(ShootEnemyFire),
	"ShootPlayer"				=>	Type.getClassName(ShootPlayer),
	"SuperShootPlayer"			=>	Type.getClassName(SuperShootPlayer),
	CHECKPOINT_NAME				=>	Type.getClassName(Checkpoint)*/
	];

	/**
	 * List that indicates in which container each element shall be
	 */
/*	private static var CATEGORIES_LIST(default, never):Map<String, Array<String>> = [
	"platformContainer" 	=> ["Platform0", "Platform1"],
	"killZonesContainer" 	=> ["KillZoneStatic", "KillZoneDynamic"],
	"wallContainer" 		=> ["Wall0", "Wall1", "Wall2", "Wall3"],
	"limitContainer"		=> [LIMIT_LEFT_NAME, LIMIT_RIGHT_NAME],
	"groundContainer"		=> [GROUND_NAME],
	"destructibleContainer" => ["BridgeLeft", "BridgeRight", "Destructible"],
	"enemiesContainer"		=> ["EnemyFire", "EnemyTurret", "EnemyBomb", "EnemySpeed"],
	"collectableContainer" 	=> [COLLECTABLE_NAME, CHECKPOINT_NAME, "UpgradeDoubleJump", "UpgradeShield", "UpgradeSuperShootPlayer"]
	];*/

	
	/**
	 * List that indicates what type of obstacle we're dealing with
	 */
/*	private static var OBSTACLES_LIST(default, never):Map<String, Array<String>> = [
	"obstaclePlatform" 	=> ["BridgeLeft", "BridgeRight", "Platform0", "Platform1"],
	"obstacleFull" 	=> ["Wall0", "Wall1", "Wall2", "Wall3", GROUND_NAME, LIMIT_LEFT_NAME, LIMIT_RIGHT_NAME]
	];*/
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): Generator {
		if (instance == null) instance = new Generator();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new()  
	{
		
	}
	
	/**
	 * Reads a Json file to place all the elements of a level on the GameStage
	 * @param	pLevel Json that will be read for generation
	 */
	/*public function generateLevel(pLevel:Json):Void {
		ClippingManager.getInstance().init(pLevel);
		PoolManager.init();
		ScrollingPlane.initialPosition.y = 0;
		
		//We create the level using the corresponding json
		for (i in Reflect.fields(pLevel)) {
			//We do not want to create instances with the grid stats
			if (i == ClippingManager.GRID_NAME) continue;
			
			//We create an element reference from the json file
			var jsonObject:Dynamic = Reflect.field(pLevel, i);
			var lPos:Point = new Point(jsonObject.x, jsonObject.y);
			//Add the element to the clipping/game grid
			ClippingManager.getInstance().addToGrid(i, lPos.x, lPos.y, jsonObject.width, jsonObject.height);
			
			//The player is created here, else it would cause problems going forward, specialy considering the camera
			if (jsonObject.type == PLAYER_NAME) {
				generateElement(jsonObject, i, false);
			}
			
			//Sets limits to the camera with ground, limitLefts and limitRights
			if (jsonObject.type == GROUND_NAME && (lPos.y < ScrollingPlane.initialPosition.y ||  ScrollingPlane.initialPosition.y == 0)) {
				ScrollingPlane.initialPosition.y = lPos.y;
				Camera.getInstance().limitBottom = lPos.y + jsonObject.height;
			}
			else if (jsonObject.type == LIMIT_LEFT_NAME) Camera.getInstance().limitLeft = lPos.x;
			else if (jsonObject.type == LIMIT_RIGHT_NAME) Camera.getInstance().limitRight = lPos.x + jsonObject.width*2;
		}
		
		preloadSpriteSheets();
	}
	*/
	/**
	 * Creates and places an element using data contained in a json object and gives it a name
	 * @param	pJson json object which contains the relevant data
	 * @param	pName which name should be assigned to this element
	 * @return  Returns the instance created
	 */
	public static function generateElement(pJson:Dynamic, pName:String, pCheckForExisting:Bool = true): PoolObject {
		var lPos:Point = new Point(pJson.x, pJson.y);
		var lContainer:Container = getRightContainer(pJson.type);
		
		//If there is already a child by that name, doesn't add it
		if (pCheckForExisting && lContainer.getChildByName(pName) != null) return cast(lContainer.getChildByName(pName), PoolObject);
		
		//If we're talking about the player, a new instance isn't created and it's only instance is used instead
		var lElement:PoolObject = PoolManager.getFromPool(pJson.type);
		
		lElement.name = pName;
		lElement.x = lPos.x;
		lElement.y = lPos.y;
		lElement.scale.x = pJson.scaleX;
		lElement.scale.y = pJson.scaleY;
		lElement.rotation = pJson.rotation / 180 * Math.PI;
		
		
		lContainer.addChild(lElement);
		
		lElement.start();
		
		return lElement;
	}
	
	
	/**
	 * Creates all kinds of stuff to add their textures to the texture cache beforehand
	 */
/*	public function preloadSpriteSheets():Void {
		spriteSheetLoadersArray = [];
		for (lType in ELEMENT_LIST.keys()) {
			var lInstance:PoolObject = PoolManager.getFromPool(lType);
			GamePlane.getInstance().addChild(lInstance);
			lInstance.x = Player.getInstance().x-10000;
			lInstance.y = Player.getInstance().y-10000;
			
			lInstance.start();
			lInstance.setModeVoid();
			spriteSheetLoadersArray.push(lInstance);
		}

	}*/
		
	/**
	 * Gets the right element considering the type from json file. Will go through different lists to make it dynamicaly.
	 * @param	pClassName
	 * @return
	 */
	public static function createInstanceFromStringType(pElementName:String):PoolObject {
		var lElement:PoolObject;
		
/*		if (OBSTACLES_LIST["obstaclePlatform"].indexOf(pElementName) >= 0) {
			lElement = new ObstaclePlatform(pElementName);
		}
		else if (OBSTACLES_LIST["obstacleFull"].indexOf(pElementName) >= 0) {
			lElement = new ObstacleFull(pElementName);
		}
		else*/ 
		var lPath:String = getPathToClass(pElementName);
		lElement = Type.createInstance(Type.resolveClass(lPath), []);
		
		return lElement;
	}
	
	/**
	 * Searches through CATEGORIES_LIST to get what container an element should be added to, so that we can keep a good looking element superposition
	 * @param	pElementType Class/Type name of the element that will be searched in CATEGORIES_LIST
	 * @return
	 */
	public static function getRightContainer(pElementType:String):Container {
/*		if (CATEGORIES_LIST["collectableContainer"].indexOf(pElementType) >= 0) {
			return GamePlane.getInstance().collectableContainer;
		}
		else if (CATEGORIES_LIST["destructibleContainer"].indexOf(pElementType) >= 0) {
			return GamePlane.getInstance().destructibleContainer;
		}
		else if (CATEGORIES_LIST["wallContainer"].indexOf(pElementType) >= 0) {
			return GamePlane.getInstance().wallContainer;
		}
		else if (CATEGORIES_LIST["enemiesContainer"].indexOf(pElementType) >= 0) {
			return GamePlane.getInstance().enemiesContainer;
		}
		else if (CATEGORIES_LIST["limitContainer"].indexOf(pElementType) >= 0) {
			return GamePlane.getInstance().limitContainer;
		}
		else if (CATEGORIES_LIST["groundContainer"].indexOf(pElementType) >= 0) {
			return GamePlane.getInstance().groundContainer;
		}
		else if (CATEGORIES_LIST["platformContainer"].indexOf(pElementType) >= 0) {
			return GamePlane.getInstance().enemiesContainer;
		}
		else if (CATEGORIES_LIST["killZonesContainer"].indexOf(pElementType) >= 0) {
			return GamePlane.getInstance().killZonesContainer;
		}*/
		
		return GamePlane.getInstance().limitContainer;
		
		
	}
	
	/**
	 * Finds the path to a class from the ELEMENT_LIST, only thanks to its name
	 * @param	pClassName
	 * @return
	 */
	private static function getPathToClass(pClassName:String):String {
		var path:String;
		if (ELEMENT_LIST[pClassName] != null) return ELEMENT_LIST[pClassName];
		trace("ERROR 404 : Path not found");
		return ELEMENT_LIST[PLAYER_NAME];
	}
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	public function destroy (): Void {
		instance = null;
	}

}