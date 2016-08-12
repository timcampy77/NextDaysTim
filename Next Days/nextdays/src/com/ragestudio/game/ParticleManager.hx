package com.ragestudio.platformer.game;
import cloudkid.Emitter;
import cloudkid.Particle;
import com.ragestudio.utils.loader.GameLoader;
import com.ragestudio.utils.system.DeviceCapabilities;
import haxe.Timer;
import js.Lib;
import pixi.core.display.Container;
import pixi.core.textures.Texture;

	
/**
 * ...
 * @author Julien Fournier & Nicolas Vernou
 */
class ParticleManager 
{
	
	/**
	 * instance unique de la classe ParticleManager
	 */
	private static var instance: ParticleManager;
	private var emitterList:Array<Emitter> = [];
	private static inline var PARTICLE_SPEED:Float = 0.01;
	private static inline var CONTAINER_DIMENSION:Float = 500;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): ParticleManager {
		if (instance == null) instance = new ParticleManager();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() 
	{
		
	}
	public function createParticle(pJsonConfig:String,pTextures:Array<String>, pDuration:Int=1000):Container
	{
		if (DeviceCapabilities.system != DeviceCapabilities.SYSTEM_DESKTOP) return new Container();
		var lNewContainer:Container = new Container();
		var lTextureArray:Array<Texture> = [];
		
		
		for (lElement in pTextures)
		{
			lTextureArray.push(Texture.fromImage("assets/" + lElement + ".png", false));
		}
		
		var lEmitter = new Emitter(lNewContainer, lTextureArray, GameLoader.getContent(pJsonConfig+".json"));
		
		lNewContainer.width = CONTAINER_DIMENSION;
		lNewContainer.height = CONTAINER_DIMENSION;
		emitterList.push(lEmitter);
		
		var timer = new haxe.Timer(pDuration); 
		timer.run = function() 
		{ 
			killParticle(lNewContainer, lEmitter);
			timer.stop();
		};
		
		return lNewContainer;
	}
	
	public function update():Void
	{
		//Lib.debug();
		for (lEmitter in emitterList)
		{
			lEmitter.update(PARTICLE_SPEED);
		}
	}
	
	private function killParticle(pContainer:Container, pEmitter:Emitter):Void
	{

		pEmitter.destroy();
		pContainer.parent.removeChild(pContainer);
		emitterList.splice(emitterList.indexOf(pEmitter), 1);


	}
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	public function destroy (): Void {
		instance = null;
	}

}