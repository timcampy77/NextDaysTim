package com.ragestudio.ui.screens;
import com.ragestudio.utils.game.StateGraphic;

/**
 * ...
 * @author Nicolas Vernou
 */
class SpriteAmplified extends StateGraphic
{

	public function new(pAssetName) 
	{
		assetName = pAssetName;
		super();
	}
	
	override public function start():Void 
	{
		super.start();
		setState(DEFAULT_STATE);
	}
}