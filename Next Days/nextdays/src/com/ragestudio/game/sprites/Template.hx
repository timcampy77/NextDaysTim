package com.ragestudio.game.sprites;

import com.ragestudio.utils.events.MouseEventType;
import com.ragestudio.utils.events.TouchEventType;
import com.ragestudio.utils.game.BoxType;
import com.ragestudio.utils.game.StateGraphic;
import com.ragestudio.utils.system.DeviceCapabilities;
import js.Browser;
import js.html.CanvasElement;
import js.html.MouseEvent;
import js.html.TouchEvent;
import pixi.core.math.Point;
	
/**
 * Exemple de classe héritant de StateGraphic
 * @author Mathieu ANTHOINE
 */
class Template extends StateGraphic 
{
	
	/**
	 * instance unique de la classe Template
	 */
	private static var instance: Template;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): Template {
		if (instance == null) instance = new Template();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() 
	{
		super();
		
		// ATTENTION: assetName et boxType se définissent après le super
		boxType = BoxType.SIMPLE;
		
		// ATTENTION : l'évènement onClick natif (Browser.window) est également appelé quand un évenement natif TOUCH_START se produit
		// Par contre l'écoute des évènement CLICK ou TAP pixi peuvent être défini tous les deux sans test car un seul est diffusé suivant le contexte
		if (DeviceCapabilities.system==DeviceCapabilities.SYSTEM_DESKTOP) Browser.window.addEventListener(MouseEventType.CLICK, onClick);
		else Browser.window.addEventListener(TouchEventType.TOUCH_START, onTouch);
		
	}
	
	override private function setModeNormal():Void {
		setState(DEFAULT_STATE, true);
		super.setModeNormal();
	}
	
	private function onTouch (pEvent:TouchEvent): Void {
		if (!Std.is(pEvent.target, CanvasElement)) return;
		setPosition(new Point(pEvent.targetTouches[pEvent.targetTouches.length-1].clientX, pEvent.targetTouches[pEvent.targetTouches.length-1].clientY));
	}
	
	private function onClick (pEvent:MouseEvent):Void {
		if (!Std.is(pEvent.target,CanvasElement)) return;
		setPosition (new Point(pEvent.layerX,pEvent.layerY));		
	}
	
	private function setPosition (pGlobal:Point):Void {
		var lLocal:Point = parent.toLocal(pGlobal);
		position.set(lLocal.x, lLocal.y);
	}
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		Browser.window.removeEventListener(MouseEventType.CLICK, onClick);
		Browser.window.removeEventListener(TouchEventType.TOUCH_START, onTouch);
		instance = null;
		super.destroy();
	}

}