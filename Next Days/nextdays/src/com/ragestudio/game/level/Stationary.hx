package com.ragestudiogame.level;
import com.ragestudiogame.sprites.PoolObject;
import com.ragestudio.utils.game.BoxType;
import com.ragestudio.utils.game.StateGraphic;
import pixi.core.display.Container;

/**
 * ...
 * @author Nicolas Vernou
 */
class Stationary extends PoolObject
{
	public function new(?pAssetName:String)
	{
		super(pAssetName);
		boxType = BoxType.SIMPLE;
	}
	
	override public function start():Void 
	{
		super.start();
		setState(DEFAULT_STATE);
	}
	
	override public function dispose():Void 
	{
		if(parent != null) parent.removeChild(this);
		super.dispose();
	}
}