package com.ragestudio.game.sprites.entities;
import com.ragestudio.game.sprites.PoolObject;

/**
 * ...
 * @author 
 */
class Player extends Character
{
	private static var list:Array<Player> = new Array<Player>();

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
}