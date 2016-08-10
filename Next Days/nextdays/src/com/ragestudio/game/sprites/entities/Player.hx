package com.ragestudio.game.sprites.entities;
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
	private static var keyDown:Int;
	private static var canWalk:Bool;
	private static var canRunning:Bool;
	private var speed:Int;
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
	
	override public function dispose():Void 
	{
		super.dispose();
		list.splice(list.indexOf(this), 1);
	}
	
	public static function onKeyDown(pEvent:KeyboardEvent):Void {
		if (pEvent.keyCode == KeyboardEventType.KEY_DOWN || pEvent.keyCode == KeyboardEventType.KEY_UP || pEvent.keyCode == KeyboardEventType.KEY_RIGHT || pEvent.keyCode == KeyboardEventType.KEY_LEFT) {
			keyDown = pEvent.keyCode;
			canWalk = true;
		}
		
		if (pEvent.keyCode == KeyboardEventType.KEY_SHIFT) canRunning = true;
	}
	
	public function move():Void {
		trace (canRunning);
		if (canWalk) {
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
		}
		
	}
}