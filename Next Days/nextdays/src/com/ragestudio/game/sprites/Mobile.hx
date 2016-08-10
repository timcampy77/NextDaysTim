package com.ragestudio.game.sprites;
import com.ragestudio.utils.Config;
import com.ragestudio.utils.game.BoxType;
import com.ragestudio.utils.game.GameObject;
import com.ragestudio.utils.game.StateGraphic;
import pixi.core.math.Point;

/**
 * ...
 * @author Nicolas Vernou
 */
class Mobile extends PoolObject
{

	//public static var actorsList:Array<StateGraphicAmplified> = new Array<StateGraphicAmplified>();
	public static inline var WAIT_STATE:String = "wait";
	
	public function new(?pAsset:String) 
	{
		super(pAsset);
		boxType = BoxType.SIMPLE;
	}
	
	override public function dispose():Void 
	{
		if (parent != null) parent.removeChild(this);
		super.dispose();
	}
	
	override public function start():Void 
	{
		super.start();
		setState(WAIT_STATE, true);
	}
	
	/**
	 * Permits to easily access the distance between an object and this entity, you can precise the anchor of the target if you want to take the center in consideration
	 */
	private function getDistanceToObject(pObject:PoolObject):Float {
		var lMid1:Point = pObject.getMidCoords();
		var lMid2:Point = getMidCoords();
		return Math.sqrt(Math.pow(lMid1.x - lMid2.x , 2)  +  Math.pow(lMid1.y - lMid2.y, 2));
	}
}