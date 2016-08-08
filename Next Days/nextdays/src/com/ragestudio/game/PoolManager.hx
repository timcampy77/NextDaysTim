package com.ragestudio.game;
import com.ragestudio.game.Generator;
import com.ragestudio.game.sprites.PoolObject;
import com.ragestudio.GameLoader;
import haxe.Json;

/**
 * ...
 * @author Julien Fournier Nicolas Vernou
 */
class PoolManager
{
	public static var jsonPool:Map<String,Int> = new Map<String,Int>();
	public static var available:Map<String,Array<PoolObject>> = new Map<String,Array<PoolObject>>();
	
	public function new() 
	{
		
	}
	
	public static function init(): Void {
		
		var poolJson:Json = GameLoader.getContent("pool.json");
		var jsonObject:Array<String> = Reflect.fields(poolJson);
		//We create all instances and fill the pool of objects, using what is found in pool.json
		for (key in jsonObject)	{
			for (i in 0 ... Reflect.field(poolJson, key))
			{
				PoolManager.addToPool(key, Generator.createInstanceFromStringType(key));
			}
		}
	}
	
	
	/**
	 * Ajoute une instance au tableau des instances disponibles.
	 * @param	pType : type de l'instance
	 * @param	pInstance : instance
	 */
	public static function addToPool (pType:String, pInstance:PoolObject):Void 
	{ 
		if (!available.exists(pType)) available.set(pType, []);
		available[pType].unshift(pInstance); 
	}
	
	
	/**
	 * Prend une instance dans le tableau des instances disponibles
	 * @param	pType : type de l'instance
	 * @return une instance
	 */
	public static function getFromPool (pType:String):PoolObject 
	{
		var lInstance:PoolObject;
		if (!available.exists(pType) || available[pType].length == 0) {
			lInstance = Generator.createInstanceFromStringType(pType);
			addToPool(pType, lInstance);
		}
		//trace("Found " + pType + " n°" + available[pType].length);
		lInstance = available[pType].pop();
		
		lInstance.init();
		return lInstance;
	}
	


	public static function clear (?pType:String = null):Void 
	{
		available.remove(pType);
	}
	
	public static function clearAll ():Void 
	{
		for (lType in available.keys()) {
			/*for (lElement in available[lType]) {
				lElement.destroy();
			}*/
			clear(lType);
		}
	}
}