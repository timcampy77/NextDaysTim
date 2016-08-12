package com.ragestudio.game.sprites.entities;
import com.ragestudio.game.controller.ControllerKeyboard;
import com.ragestudio.game.controller.Controller;
import com.ragestudio.game.sprites.PoolObject;
import com.ragestudio.utils.events.KeyboardEventType;
import js.html.KeyboardEvent;

/**
 * ...
 * @author 
 */
class Player extends Character
{
	public static var list:Array<Player> = new Array<Player>();
	
	
	private var controller:Controller;
	private var speed:Float = 5;
	private static inline var NORMAL_SPEED:Int = 20;
	private static inline var SPRINT_SPEED:Int = 40;

	public function new(pAsset:String=null) 
	{
		super(pAsset);
		
	}
	
	public static function createPlayer():Player
	{
		var lPlayer:Player = cast(PoolManager.getFromPool("Player"), Player);
		list.push(lPlayer);
		return lPlayer;
	}
	
	public static function getPlayers():Array<Player>
	{
		return list;
	}
	
	public function initControllers():Void
	{
		controller = cast(new ControllerKeyboard(), Controller);
	}
	
	override public function dispose():Void 
	{
		super.dispose();
		list.splice(list.indexOf(this), 1);
	}
	
	public function move():Void {
		if (controller.up) y -= speed;
		if (controller.down) y += speed;
		if (controller.left) x -= speed;
		if (controller.right) x += speed;
		
		rotation = Math.atan2( Main.getInstance().getMouseY() - Main.getInstance().stage.toLocal(position).y , Main.getInstance().getMouseX() - Main.getInstance().stage.toLocal(position).x);
		
		/*if (canWalk) {
			canRunning == true ? speed = SPRINT_SPEED : speed = NORMAL_SPEED;
			if (keyDown == KeyboardEventType.KEY_DOWN) {
				y += speed;
				scale.y == 1 ? scale.y *= -1 : scale.y *= 1;
			}
			if (keyDown == KeyboardEventType.KEY_UP) {
				y -= speed;
				scale.y == -1 ? scale.y *= -1 : scale.y *= 1;
			}
			if (keyDown == KeyboardEventType.KEY_RIGHT) x += speed;
			if (keyDown == KeyboardEventType.KEY_LEFT) x -= speed;
			canWalk = false; 
		}*/ // truc a Emeline...
		
	}
}