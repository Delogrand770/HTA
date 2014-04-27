/*
Chem.is.try specific - slim version
Created by Gavin Delphia © 2007 - 2009
All Rights Reserved
*/

var xg_height     = parseInt(screen.height);
var xg_width      = parseInt(screen.width);
var xg_avheight   = parseInt(screen.availHeight);
var xg_avwidth    = parseInt(screen.availWidth);


// WScript.Shell //
var XShell={
	LaunchApp:function(target_app){
		var apprunner = new ActiveXObject("WScript.Shell");
		apprunner.Run(target_app,0);
	}
};

// Utility FUNCTIONS //
var XUtil={
	CenterElement:function(el,m,xoff,yoff){
		if (!xoff){
			xoff = 0;
		}
		if (!yoff){
			yoff = 0;
		}
		if (m == 'v' || m == 'b'){
			document.getElementById(el).style.top  = Math.round(yoff+(parseInt(document.body.offsetHeight)/2) - (document.getElementById(el).offsetHeight/2))+yoff;
		}
		if (m == 'h' || m == 'b'){
			document.getElementById(el).style.left = Math.round(xoff+(parseInt(document.body.offsetWidth)/2) - (document.getElementById(el).offsetWidth/2));
		}
	},
	ResizeWindow:function(h,w,f,c){
		if (f == 1){
			h = xg_height;
			w = xg_width;
		}
		if (c == 1){
			self.moveTo(xg_width/2-(w/2),xg_height/2-(h/2));
		}
		window.resizeTo(w,h);
	},
	MoveWindow:function(x,y){
		if (x == "c"){
			x = xg_width/2-(document.body.offsetWidth/2);
		}
		if (y == "c"){
			y = xg_height/2-(document.body.offsetHeight/2);
		}
		self.moveTo(x,y);
	},
	ErrorHandler:function(m){
		if (m == 0){
			window.onerror = function(){return true;}
		}
		if (m == 1){
			window.onerror = function(msg,url,l){
				XScripting.CreateFile('error_report.txt','error_report = new Array('+l+',"'+msg+'");');
				alert('Error: '+msg+'\nLine: '+l);
				window.opener = null;
				window.close();
			}
		}
		if (m == 2){
			window.onerror = function(msg,url,l){
				window.opener = null;
				window.close();
			}
		}
	}
};


var xgui_move = new Object();
var xgui_data = new Array();
var XGUI = {
	Ini:function(i,t,h,w,x,y,c,f,l,g){ //icon,title,height,width,xpos,ypos,center,full,lock changes,gui style
		document.body.innerHTML += '<span id="xgui_span"></span>';
		xgui_data                = new Array(i,t,h,w,x,y,c,f,l,g);
		xgui_span.innerHTML      = '<img src="tc.png" style="width:820;height:30;position:absolute;top:0;left:0;" id="xgui_top" ondblclick="if (xgui_restore.disabled==false || xgui_restore.value==2){XGUI.TogSize()}"><img src="xres/sl'+g+'.png" style="width:10;height:800;position:absolute;top:30;left:0;" id="xgui_left"><img src="xres/sr'+g+'.png" style="position:absolute;left:810;top:30;height:800;width:10;" id="xgui_right"><img src="xres/bc'+g+'.png" style="width:820;height:10;position:absolute;top:830;left:0;" id="xgui_bottom"><img src="'+i+'" style="position:absolute;top:5;left:5;z-index:100;height:20;width:20;" id="xgui_icon" ondblclick="if (xgui_close.disabled==false){XGUI.Update(\'exit\')}"><span style="position:absolute;top:7;left:30;z-index:100;width:1000;font-family:arial,sans-serif;font-size:12;" id="xgui_title"></span><input type="button" value="0" class="xbtn" onclick="XGUI.Update(\'screen\',\'minimize\')" title="Minimize" onfocus="this.blur()" id="xgui_minimize" style="left:700;"><input type="button" value="1" class="xbtn" onclick="XGUI.TogSize()" title="Maximize/Restore" onfocus="this.blur()" id="xgui_restore" style="left:730;"><input type="button" value="r" class="xbtn" onclick="XGUI.Update(\'exit\')" title="Close" onfocus="this.blur()" id="xgui_close" style="left:760;">';
		xgui_span.attachEvent('onmousedown', XGUI.MouseDown);
		XGUI.UpdateAll(i,t,h,w,x,y,c,f,l,g);
	},
	MouseDown:function(){
		xgui_span.setCapture(); 
		xgui_move.x = window.event.screenX; 
		xgui_move.y = window.event.screenY; 
		xgui_span.attachEvent("onmousemove", XGUI.MouseMove); 
		xgui_span.attachEvent("onmouseup", XGUI.MouseUp); 
	},
	MouseMove:function(){
		try{
			if(window.event.screenY>(xg_avheight - 20)){
				window.event.screenY = xg_avheight - 20;
			}
			moveBy(window.event.screenX - xgui_move.x, window.event.screenY - xgui_move.y) 
			
		}
		catch(e){}
		xgui_move.x = window.event.screenX;
		xgui_move.y = window.event.screenY;
		xgui_span.setCapture(); 
	},
	MouseUp:function(){
		xgui_span.detachEvent("onmousemove", XGUI.MouseMove);
		xgui_span.detachEvent("onmouseup", XGUI.MouseUp);
		xgui_span.releaseCapture();
	},
	UpdateAll:function(i,t,h,w,x,y,c,f,l,g){
		if (x || y){
			xgui_data[4] = x;
			xgui_data[5] = y;
			XUtil.MoveWindow(x,y);
		}
		if (h && w){
			xgui_data[2] = h;
			xgui_data[3] = w;
			XUtil.ResizeWindow(h,w);
		}
		if (c){
			xgui_data[6] = c;
			XUtil.ResizeWindow(xgui_data[2],xgui_data[3],0,c);
		}
		if (f){
			xgui_data[7] = f;
			XUtil.ResizeWindow(h,w,f,1);
			h            = xg_height;
			w            = xg_width;
		}
		if (h && w){
			xgui_top.style.width     = w;
			xgui_left.style.height   = h-40;
			xgui_right.style.height  = h-40;
			xgui_right.style.left    = w-10;
			xgui_bottom.style.top    = h-10;
			xgui_bottom.style.width  = w;
			xgui_close.style.left    = w-40; 
			xgui_restore.style.left  = w-70; 
			xgui_minimize.style.left = w-100;
		}
		if (t){
			xgui_data[1] = t;
			xgui_title.innerHTML = '<b><font color="white">'+t+'</font></b>';
		}
		if (i){
			xgui_data[0]  = i;
			xgui_icon.src = i;
		}
		if (g){
			xgui_data[9]    = g;
			xgui_top.src    = 'xres/tc'+g+'.png';
			xgui_left.src   = 'xres/sl'+g+'.png';
			xgui_right.src  = 'xres/sr'+g+'.png';
			xgui_bottom.src = 'xres/bc'+g+'.png';
			if (g==1){
				xgui_title.innerHTML      = '<b><font color="white">'+xgui_data[1]+'</font></b>';
				document.body.bgColor     = "black";
				document.body.style.color = "white";
				xgui_minimize.style.color = "white";
				xgui_close.style.color    = "white";
				xgui_restore.style.color  = "white";				
			}
			else if (g==2){
				xgui_title.innerHTML      = '<b><font color="darkblue">'+xgui_data[1]+'</font></b>';
				document.body.bgColor     = "#bfdcf9";
				document.body.style.color = "darkblue";
				xgui_minimize.style.color = "darkblue";
				xgui_close.style.color    = "darkblue";
				xgui_restore.style.color  = "darkblue";
			}
			else if (g==3){
				xgui_title.innerHTML      = '<b><font color="black">'+xgui_data[1]+'</font></b>';
				document.body.bgColor     = "e3e8e9";
				document.body.style.color = "black";
				xgui_minimize.style.color = "black";
				xgui_close.style.color    = "black";
				xgui_restore.style.color  = "black";
			}
		}
		if (l){
			if (l==1){
				XGUI.Update('disable','all');
				XGUI.Update('enable','minimize');
			}
		}
	},
	Update:function(cmd,it){
		if (cmd == 'icon'){
			XGUI.UpdateAll(it);
		}
		else if (cmd == 'title'){
			XGUI.UpdateAll(0,it);
		}
		else if (cmd == 'height'){
			XGUI.UpdateAll(0,0,it,xgui_data[3]);
		}
		else if (cmd == 'width'){
			XGUI.UpdateAll(0,0,xgui_data[2],it);	
		}
		else if (cmd == 'xpos'){
			XGUI.UpdateAll(0,0,0,0,it,xgui_data[5]);
		}
		else if (cmd == 'ypos'){
			XGUI.UpdateAll(0,0,0,0,xgui_data[4],it);
		}
		else if (cmd == 'screen'){
			if (it == 'center'){
				XGUI.UpdateAll(0,0,0,0,0,0,1);
			}
			else if (it == 'full'){
				XGUI.UpdateAll(0,0,0,0,0,0,0,1);
				xgui_restore.value = 2;
			}
			else if (it == 'minimize'){
				XShell.LaunchApp('xres/nircmdc.exe win min title "'+document.title+'" 1');
				//if (xgui_data[7]  ==  1 && document.body.clientHeight!=30){
				//	XGUI.TogSize();
				//}
				//XUtil.ResizeWindow(30,xgui_data[3]);
				//xgui_restore.value = 2;
				//xgui_data[7] = 1;
				//if (xgui_data[8]==1){
				//	XGUI.Update('enable','restore');
				//}
			}
			else if (it == 'normal'){
				XGUI.UpdateAll(0,0,xgui_data[2],xgui_data[3],xgui_data[4],xgui_data[5],xgui_data[6]);
				xgui_restore.value = 1;
			}
		}
		else if (cmd == 'exit'){
			window.opener = null;
			window.close();
		}
		else if (cmd == 'theme'){ 
			XGUI.UpdateAll(0,0,0,0,0,0,0,0,0,it);
		}
		else if (cmd == "enable"){
			if (it == 'all'){
				xgui_data[8]           = 0;
				xgui_minimize.disabled = false;
				xgui_close.disabled    = false;
				xgui_restore.disabled  = false;
			}
			else if (it == 'minimize'){
				xgui_minimize.disabled = false;
			}
			else if (it == 'restore'){
				xgui_restore.disabled = false;
			}
			else if (it == 'close'){
				xgui_close.disabled = false;
			}
		}
		else if (cmd == "disable"){
			if (it == 'all'){
				xgui_data[8]           = 1;
				xgui_minimize.disabled = true;
				xgui_close.disabled    = true;
				xgui_restore.disabled  = true;
			}
			else if (it == 'minimize'){
				xgui_minimize.disabled = true;
			}
			else if (it == 'restore'){
				xgui_restore.disabled = true;
			}
			else if (it == 'close'){
				xgui_close.disabled = true;
			}
		}
	},
	TogSize:function(){
		if (xgui_data[7] == 0){
			XGUI.Update('screen','full');
		}else{
			xgui_data[7] = 0;
			XGUI.Update('screen','normal');
			if (xgui_data[8]==1){
				XGUI.Update('disable','restore');
			}
				
		}
		
	},
	Restore:function(){
		XGUI.UpdateAll(0,0,0,0,xgui_data[4],xgui_data[5]);
	}
};