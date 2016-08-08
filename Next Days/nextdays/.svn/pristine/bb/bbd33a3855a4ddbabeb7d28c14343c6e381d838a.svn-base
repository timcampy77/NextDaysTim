package  {
	
	import flash.display.MovieClip;
	import flash.utils.*;
	import flash.display.DisplayObjectContainer;
	import flash.net.FileReference;
	import flash.utils.ByteArray;
	import flash.events.Event;
	import flash.geom.Point;
	
	public class ExportLevelDesign extends MovieClip {
		
		private var content:Object;
		private var file: FileReference;
		private var level:String;
		private const GRID_SCALE:Number = 280;
		private const GRID_NAME:String = "Grid";
		
		public function ExportLevelDesign() {
			stop();
			browse();
		}
		
		private function browse (pEvent:Event=null):void {
			browseLevel(DisplayObjectContainer(getChildAt(0)));
			if (pEvent==null) nextFrame();
		}
		
		private function getScaleAndRotation(pItem:DisplayObjectContainer):Object {
			var lObject:Object= {scaleX: pItem.scaleX, scaleY:pItem.scaleY, rotation:pItem.rotation};
			if (pItem.rotation==0 || pItem.rotation == 180) {
				lObject.scaleX = pItem.transform.matrix.a;
				lObject.scaleY = pItem.transform.matrix.d;
				lObject.rotation = 0;
			}
			return lObject;
		}
		
		private function browseLevel (pChild:DisplayObjectContainer): void {
			
			content={};
			file = new FileReference();			
			
			content[GRID_NAME] = {};
			content[GRID_NAME].cols = Math.floor(pChild.width / GRID_SCALE);
			content[GRID_NAME].rows = Math.floor(pChild.height / GRID_SCALE);
			content[GRID_NAME].scale = GRID_SCALE;
			
			var lItem;
			var lName:String;
			var lScaleAndRotation:Object;
			
			for (var i:int = 0; i<pChild.numChildren;i++) {
				lItem=pChild.getChildAt(i);
				if (lItem is DisplayObjectContainer) {
					lName=lItem.name;
					content[lName]={};
					content[lName].type=getQualifiedClassName(lItem);
					content[lName].x=lItem.x;
					content[lName].y=lItem.y;
					
					lScaleAndRotation=getScaleAndRotation(lItem);
					
					content[lName].scaleX=lScaleAndRotation.scaleX;
					content[lName].scaleY=lScaleAndRotation.scaleY;
					content[lName].rotation = lScaleAndRotation.rotation;
					
					content[lName].width=lItem.width;
					content[lName].height=lItem.height;
				}
			}
			
			//trace (JSON.stringify(content,null,"\t"));
			
			
			var lData:ByteArray = new ByteArray();
			lData.writeMultiByte(JSON.stringify(content,null,"\t"), "utf-8" );

			if (currentFrame<totalFrames) file.addEventListener(Event.COMPLETE,browse);
			
			file.save(lData, getQualifiedClassName(pChild)+".json" );
			
			
		}
		
	}
	
}
