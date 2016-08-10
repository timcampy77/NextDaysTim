package com.ragestudio.controller;
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
			Keyboard.UP => false,
			Keyboard.RIGHT => false,
			Keyboard.LEFT => false,
			Keyboard.G => false
		];
		Browser.window.addEventListener(KeyboardEventType.KEY_DOWN, onKeyDown);
		Browser.window.addEventListener(KeyboardEventType.KEY_UP, onKeyUp);
	}
	
	public function onKeyDown(pEvent:KeyboardEvent) 
	{
		if (keyPressed[pEvent.keyCode] != null) {
			keyPressed[pEvent.keyCode] = true;
		}
	}
	
	public function onKeyUp(pEvent:KeyboardEvent) 
	{
		if (keyPressed[pEvent.keyCode] != null) {
			keyPressed[pEvent.keyCode] = false;
		}
	}
	
	
	
	override private function get_right():Bool {
		return keyPressed[Keyboard.RIGHT];
	}
	
	override private function get_left():Bool {
		return keyPressed[Keyboard.LEFT];
	}
	
	override private function get_jump():Bool {
		return keyPressed[Keyboard.UP];
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