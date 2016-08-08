package com.ragestudio.game;


import com.ragestudio.game.sprites.Template;
import com.ragestudio.ui.CheatPanel;
import com.ragestudio.ui.UIManager;
import com.ragestudio.utils.events.EventType;
import com.ragestudio.utils.game.CollisionManager;
import com.ragestudio.utils.game.GameStage;
import com.ragestudio.utils.system.DeviceCapabilities;
import pixi.interaction.EventTarget;
import pixi.interaction.InteractionManager;

/**
 * Manager (Singleton) en charge de gérer le déroulement d'une partie
 * @author Mathieu ANTHOINE
 */
class GameManager
{
	
	/**
	 * instance unique de la classe GameManager
	 */
	private static var instance: GameManager;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): GameManager {
		if (instance == null) instance = new GameManager();
		return instance;
	}
	
	private function new() {
		
	}
	
	public function start (): Void {
		
		// demande au Manager d'interface de se mettre en mode "jeu"
		UIManager.getInstance().startGame();	
		
		// début de l'initialisation du jeu
		GameStage.getInstance().getGameContainer().addChild(Template.getInstance());
		Template.getInstance().start();	
		CheatPanel.getInstance().ingame();	
		
		// enregistre le GameManager en tant qu'écouteur de la gameloop principale
		Main.getInstance().on(EventType.GAME_LOOP, gameLoop);
		
	}
	
	/**
	 * boucle de jeu (répétée à la cadence du jeu en fps)
	 */
	public function gameLoop (pEvent:EventTarget): Void {
		// le renderer possède une propriété plugins qui contient une propriété interaction de type InteractionManager
		// les instances d'InteractionManager fournissent un certain nombre d'informations comme les coordonnées globales de la souris
		//if (DeviceCapabilities.system==DeviceCapabilities.SYSTEM_DESKTOP) trace (CollisionManager.hitTestPoint(Template.getInstance().hitBox, cast(Main.getInstance().renderer.plugins.interaction,InteractionManager).mouse.global));
	}
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	public function destroy (): Void {
		Main.getInstance().off(EventType.GAME_LOOP,gameLoop);
		instance = null;
	}

}