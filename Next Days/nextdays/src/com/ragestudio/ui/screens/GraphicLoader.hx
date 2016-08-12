package com.ragestudio.ui.screens;

import com.ragestudio.utils.Config;
import com.ragestudio.utils.ui.Screen;
import pixi.core.sprites.Sprite;
import pixi.core.text.Text;
import pixi.core.textures.Texture;
/**
 * Preloader Graphique principal
 * @author Mathieu ANTHOINE
 */
class GraphicLoader extends Screen 
{
	
	/**
	 * instance unique de la classe GraphicLoader
	 */
	private static var instance: GraphicLoader;

	private var loaderBar:SpriteAmplified;
	private var pourcentage:Text;
	private var title:Text;
	private static inline var MARGIN_TOP: Float = 500;
	
	public function new() 
	{
		super();
		var lBg:SpriteAmplified = new SpriteAmplified("preload_bg");
		lBg.start();
		addChild(lBg);
		
		title = new Text("NEXT DAYS", { font:'150px Arial black', fill : 0xFFFFFF, align : 'center' } );
		title.anchor.set(0.5, 0.5);
		title.y = -MARGIN_TOP/2;
		addChild(title);
		
		pourcentage  = new Text(" ", { font : '50px Arial black', fill : 0xFFFFFF, align : 'center' } );
		pourcentage.anchor.set(0.5, 0.5);
		pourcentage.y = MARGIN_TOP/2;
		addChild(pourcentage);
		
		loaderBar = new SpriteAmplified ("preload");
		loaderBar.start();
		loaderBar.x = -loaderBar.width / 2;
		addChild(loaderBar);
		loaderBar.scale.x = 0;
	}
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): GraphicLoader {
		if (instance == null) instance = new GraphicLoader();
		return instance;
	}
	
	/**
	 * mise à jour de la barre de chargement
	 * @param	pProgress
	 */
	public function update (pProgress:Float): Void {
		loaderBar.scale.x = pProgress;
		pourcentage.text = Math.floor(pProgress*100) + "%";
	}
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
		super.destroy();
	}

}