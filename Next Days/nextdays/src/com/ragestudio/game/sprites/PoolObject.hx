package com.ragestudio.game.sprites;

import com.ragestudio.game.PoolManager;
import com.ragestudio.utils.game.StateGraphic;
import pixi.core.math.Point;

/**
 * ...
 * @author Julien Fournier Nicolas Vernou
 */
class PoolObject extends StateGraphic
{
	
	
	public function new(pAsset:String=null)
	{
		super();
		
		if (pAsset == null) pAsset = Type.getClassName(Type.getClass(this)).split(".").pop();
		assetName = pAsset;
		
	}
	
	public function init ():Void 
	{
		
	}
	
	public function dispose ():Void 
	{
		PoolManager.addToPool(assetName, this);
		removeAllListeners();
		setModeVoid();
	}
	
	override public function destroy():Void 
	{
		dispose();
		PoolManager.available[assetName].splice(PoolManager.available[assetName].indexOf(this), 1);
		super.destroy();
	}
	
	
	public function getMidCoords():Point {
		//var lPos:Point = parent != null ? parent.toGlobal(position) : GamePlane.getInstance().toGlobal(position);
		return new Point(x + (0.5 - getAnchor(state).x) * anim.width, y + (0.5 - getAnchor(state).y) * anim.height) ;
	}
}