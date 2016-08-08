package com.ragestudio.ui.screens;

import com.ragestudio.ui.popin.Confirm;
import com.ragestudio.utils.Config;
import com.ragestudio.utils.events.MouseEventType;
import com.ragestudio.utils.events.TouchEventType;
import com.ragestudio.utils.sounds.SoundManager;
import com.ragestudio.utils.ui.Screen;
import pixi.core.sprites.Sprite;
import pixi.core.textures.Texture;
import pixi.interaction.EventTarget;

	
/**
 * Exemple de classe héritant de Screen
 * @author Mathieu ANTHOINE
 */
class TitleCard extends Screen 
{
	private var background:Sprite;
	
	/**
	 * instance unique de la classe TitleCard
	 */
	private static var instance: TitleCard;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): TitleCard {
		if (instance == null) instance = new TitleCard();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	public function new() 
	{
		super();
		background = new Sprite(Texture.fromImage(Config.url(Config.assetsPath+"TitleCard_bg.png")));
		background.anchor.set(0.5, 0.5);
		addChild(background);
		interactive = true;
		buttonMode = true;
		
		once(MouseEventType.CLICK,onClick);
		once(TouchEventType.TAP,onClick);
	}
	
	private function onClick (pEvent:EventTarget): Void {
		SoundManager.getSound("click").play();
		UIManager.getInstance().openPopin(Confirm.getInstance());
	}
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
		super.destroy();
	}

}