package com.ragestudio.game.controller;
import com.ragestudio.utils.ui.Keyboard;

/**
 * ...
 * @author Nicolas Vernou
 */
class Controller
{
	private var keyPressed:Map<Int, Bool> = new Map<Int, Bool>();
	
	public var right(get, null):Bool;
	public var left(get, null):Bool;
	public var up(get, null):Bool;
	public var down(get, null):Bool;
	public var pause(get, null):Bool;
	public var shoot(get, null):Bool;
	public var god(get, null):Bool;
	
	public function new() 
	{
		
	}
	
	private function get_right():Bool {
		return false;
	}
	
	private function get_left():Bool {
		return false;
	}
	
	private function get_up():Bool {
		return false;
	}
	
	private function get_down():Bool {
		return false;
	}
	
	private function get_pause():Bool {
		return false;
	}
	
	private function get_shoot():Bool {
		return false;
	}
	
	private function get_god():Bool {
		return false;
	}
	
	
	
}