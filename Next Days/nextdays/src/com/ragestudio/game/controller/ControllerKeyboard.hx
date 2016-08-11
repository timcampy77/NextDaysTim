package com.ragestudio.game.controller;
import com.ragestudio.utils.events.KeyboardEventType;
import com.ragestudio.utils.ui.Keyboard;
import js.Browser;
import js.html.KeyboardEvent;

/**
 * ...
 * @author Nicolas Vernou
 */
class ControllerKeyboard extends Controller
{

	
	
	public function new() 
	{
		super(); 
		
		keyPressed = [
			Keyboard.SPACE => false,
			Keyboard.ESCAPE => false,
			Keyboard.P => false,
			Keyboard.Z => false,
			Keyboard.D => false,
			Keyboard.Q => false,
			Keyboard.S => false,
			Keyboard.G => false
		];
		Browser.window.addEventListener(KeyboardEventType.KEY_DOWN, onKeyDown);
		Browser.window.addEventListener(KeyboardEventType.KEY_UP, onKeyUp);
	}
	
	public function onKeyDown(pEvent:KeyboardEvent) 
	{
		if (keyPressed[pEvent.keyCode] != null) {
			keyPressed[pEvent.keyCode] = true;
			trace(pEvent.keyCode);
		}
	}
	
	public function onKeyUp(pEvent:KeyboardEvent) 
	{
		if (keyPressed[pEvent.keyCode] != null) {
			keyPressed[pEvent.keyCode] = false;
		}
	}
	
	
	
	override private function get_right():Bool {
		return keyPressed[Keyboard.D];
	}
	
	override private function get_left():Bool {
		return keyPressed[Keyboard.Q];
	}
	
	override private function get_up():Bool {
		return keyPressed[Keyboard.Z];
	}
	
	override private function get_down():Bool {
		return keyPressed[Keyboard.S];
	}
	
	override private function get_pause():Bool {
		return keyPressed[Keyboard.ESCAPE] ? keyPressed[Keyboard.ESCAPE] : keyPressed[Keyboard.P];
	}
	
	override private function get_shoot():Bool {
		return keyPressed[Keyboard.SPACE];
	}
	
	override private function get_god():Bool {
		return keyPressed[Keyboard.G];
	}
	
}