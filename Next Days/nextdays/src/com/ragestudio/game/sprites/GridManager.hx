package com.ragestudio.game.sprites;

import com.ragestudio.ui.screens.SpriteAmplified;
import com.ragestudio.utils.game.GameStage;
import pixi.core.graphics.Graphics;
import pixi.core.sprites.Sprite;
import pixi.core.textures.Texture;

/**
 * ...
 * @author julien guillochon
 */
class GridManager extends Sprite
{
	
	
	
	public function new(?texture:Texture) 
	{
		super(texture);
		gridGeneration();
	}
	
	private function gridGeneration()
	{
		var dX:Float = -650;
		var dY:Float = 0;
		
		for (i in 0...50) 
		{	
			for (e in 0...75)
			{
				var graphics = new Graphics();

				graphics.beginFill(0xFFFF00, 0.2 );

				graphics.lineStyle(1, 0x000000);

				graphics.drawRect(0, 0, 50, 50);
				
				graphics.x = dX;
		
				graphics.y = dY;
				
				dX += graphics.width;
			
				GameStage.getInstance().getGameContainer().addChild(graphics);
	
			}
			dY += 51;
			dX = -650;
		}	
	}
	
	
}