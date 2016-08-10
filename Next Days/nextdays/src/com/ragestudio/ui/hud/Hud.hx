package com.ragestudio.ui.hud;

import com.ragestudio.utils.Config;
import com.ragestudio.utils.system.DeviceCapabilities;
import com.ragestudio.utils.ui.Screen;
import com.ragestudio.utils.ui.UIPosition;
import pixi.core.display.Container;
import pixi.core.sprites.Sprite;
import pixi.core.text.Text;
import pixi.core.textures.Texture;
import pixi.interaction.EventTarget;

/**
 * Classe en charge de gérer les informations du Hud
 * @author Mathieu ANTHOINE
 */
class Hud extends Screen 
{
	
	/**
	 * instance unique de la classe Hud
	 */
	private static var instance: Hud;
	
	private var hudTopLeft:Container;
	private var hudBottomLeft:Container;

	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): Hud {
		if (instance == null) instance = new Hud();
		return instance;
	}	
	
	public function new() 
	{
		super();
		_modal = false;
		hudTopLeft = new Container();
		
		hudBottomLeft = new Container();
			
		addChild(hudTopLeft);
		addChild(hudBottomLeft);
		
		positionables.push({ item:hudTopLeft, align:UIPosition.TOP_LEFT, offsetX:0, offsetY:0});
		positionables.push({ item:hudBottomLeft, align:UIPosition.BOTTOM_LEFT, offsetX:0, offsetY:0});

	}
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
		super.destroy();
	}

}