package com.ragestudio.game.sprites.planes;
/*import cloudkid.Emitter;
import cloudkid.Particle;*/
import com.ragestudio.utils.game.GameObject;
import com.ragestudio.utils.loader.GameLoader;
import pixi.core.display.Container;
import pixi.core.math.Point;
import pixi.core.math.shapes.Rectangle;
import pixi.core.textures.Texture;

	
/**
 * ...
 * @author Nicolas Vernou
 */
class GamePlane extends GameObject
{
	
	/**
	 * instance unique de la classe Gameplane
	 */
	private static var instance: GamePlane;
	
	public var wallContainer:Container = new Container();
	public var groundContainer:Container = new Container();
	public var limitContainer:Container = new Container();
	public var platformContainer:Container = new Container();
	public var destructibleContainer:Container = new Container();
	public var killZonesContainer:Container = new Container();
	public var enemiesContainer:Container = new Container();
	public var collectableContainer:Container = new Container();
	

	

	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): GamePlane {
		if (instance == null) instance = new GamePlane();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() 
	{
		super();
		
		addChild(platformContainer);
		addChild(destructibleContainer);
		addChild(wallContainer);
		addChild(groundContainer);
		addChild(enemiesContainer);
		addChild(collectableContainer);
		addChild(limitContainer);
		addChild(killZonesContainer);
	}
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		removeChild(platformContainer);
		removeChild(destructibleContainer);
		removeChild(wallContainer);
		removeChild(groundContainer);
		removeChild(enemiesContainer);
		removeChild(collectableContainer);
		removeChild(limitContainer);
		removeChild(killZonesContainer);
		if (parent != null) parent.removeChild(this);
		instance = null;
		super.destroy();
	}
}