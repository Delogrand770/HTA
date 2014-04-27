/*
Created by Gavin Delphia 2007 - 2009
*/

var fso_oldres_x  = 0;
var fso_oldres_y  = 0;
var FileName      = new String();
var Extention     = new String();
var scanned_files = new Array();
var scanned_fldrs = new Array();
var fso_temp      = "";
var fso_status    = "";
var xg_height     = parseInt(screen.height);
var xg_width      = parseInt(screen.width);
var xg_avheight   = parseInt(screen.availHeight);
var xg_avwidth    = parseInt(screen.availWidth);
var xpreload      = new Array();

// Scripting.FileSystemObject //
var XScripting={
	WriteLineInFile:function(t,fso_data){
		var fso    = new ActiveXObject("Scripting.FileSystemObject");
		var linein = fso.OpenTextFile(t,8,1,-2);
		linein.writeline(fso_data);
		linein.Close();
		return true;
	},
	OpenFile:function(t){
		if (this.FileExist(t)){
			var fso        = new ActiveXObject("Scripting.FileSystemObject");
			var loadfile   = fso.GetFile(t).OpenAsTextStream(1,0);
			var returndata = loadfile.ReadAll();
			loadfile.close();
			return returndata;
		}else{
			return false;
		}
	},
	FileSize:function(t){
		if (this.FileExist(t)){
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			return fso.GetFile(t).Size;
		}
	},
	GetFolderFiles:function(t){
		if (this.FolderExist(t)){
			var fso        = new ActiveXObject("Scripting.FileSystemObject");
			var loadfolder = fso.GetFolder(t);
			var returndata = new Array();
			var index      = -1;
			for(var objEnum=new Enumerator(loadfolder.Files);!objEnum.atEnd();objEnum.moveNext()){
				index++;
				returndata[index] = objEnum.item();
			}
			return returndata;
		}else{
			return false;
		}
	},
	GetFileBaseName:function(t){
		if (this.FileExist(t)){
			var fso      = new ActiveXObject("Scripting.FileSystemObject");
			var basename = fso.GetBaseName(t);
			return basename;
		}else{
			return false;
		}
	},
	GetFileExtension:function(t){
		if (this.FileExist(t)){
			var fso       = new ActiveXObject("Scripting.FileSystemObject");
			var extension = fso.GetExtensionName(t);
			return extension;
		}else{
			return false;
		}
	},
	GetFileName:function(t){
		if (this.FileExist(t)){
			var fso      = new ActiveXObject("Scripting.FileSystemObject");
			var filename = fso.GetFileName(t);
			return filename;
		}else{
			return false;
		}
	},
	GetParentFolder:function(t){
		if (this.FileExist(t) || this.FolderExist(t)){
			var fso          = new ActiveXObject("Scripting.FileSystemObject");
			var parentfolder = fso.GetParentFolderName(t);
			return parentfolder;
		}else{
			return false;
		}
	},
	CreateFile:function(t,fso_data){
		var fso     = new ActiveXObject("Scripting.FileSystemObject");
		var newfile = fso.createTextFile(t); 
		newfile.write(fso_data);
		newfile.close();
		return true;
	},
	CreateFolder:function(t){
		if (!this.FolderExist(t)){
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			fso.createFolder(t); 
			return true;
		}else{
			return false;
		}
	},
	DeleteFile:function(t){
		if (this.FileExist(t)){
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			fso.DeleteFile(t); 
			return true;
		}else{
			return false;
		}
	},
	DeleteFolder:function(t){
		if (this.FolderExist(t)){
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			fso.DeleteFolder(t); 
			return true;
		}else{
			return false;
		}
	},
	FileExist:function(t){
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		if (fso.FileExists(t)){
			return true;
		}else{
			return false;
		}
	},
	FolderExist:function(t){
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		if (fso.FolderExists(t)){
			return true;
		}else{
			return false;
		}
	},
	CurrentPath:function(){
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		return fso.GetFolder(".").Path
	},
	CopyFile:function(t,d){
		if (this.FileExist(t) && this.FolderExist(d)){
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			fso.CopyFile(t,d);
			return true;
		}else{
			return false;
		}
	},
	SpecCopyFile:function(t,d){
		if (this.FileExist(t)){
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			fso.CopyFile(t,d);
			return true;
		}else{
			return false;
		}
	},
	CopyFolder:function(t,d){
		if (this.FolderExist(t) && this.FolderExist(d)){
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			fso.CopyFolder(t,d);
			return true;
		}else{
			return false;
		}
	},
	MoveFile:function(t,d){
		if (this.FileExist(t) && this.FolderExist(d)){
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			fso.MoveFile(t,d);
			return true;
		}else{
			return false;
		}
	},
	MoveFolder:function(t,d){
		if (this.FolderExist(t) && this.FolderExist(d)){
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			fso.MoveFolder(t,d);
			return true;
		}else{
			return false;
		}
	},
	SearchDirectory:function(what_path,what_search){
		scanned_files = scanned_files.splice(0,0);
		var fso       = new ActiveXObject("Scripting.FileSystemObject");
		FileName      = (what_search.lastIndexOf(".")>-1)? what_search.slice(0,what_search.lastIndexOf(".")):(what_search.length>0)? what_search.toLowerCase():"*";
		Extention     = (what_search.lastIndexOf(".")>-1)? what_search.slice(what_search.lastIndexOf(".")+1).toLowerCase():"*"; 
		if(what_path.length>0 && fso.FolderExists(what_path)){
			this.FindFile(fso.GetFolder(what_path));
		}
	},
	FindFolders:function(t){
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var f   = fso.GetFolder(t.toString());
		var e   = new Enumerator(f.SubFolders);
		for(;!e.atEnd();e.moveNext()){
			scanned_fldrs[scanned_fldrs.length] = e.item().Name;
		}
	},
	FindFile:function(foo){
		var enu = new Enumerator(foo.Files);
		for(i=0;!enu.atEnd();enu.moveNext()){
			if(FileName == "*" ||  enu.item().name.slice(0,enu.item().name.lastIndexOf(".")).toLowerCase().indexOf(FileName)>-1){
				if(Extention == "*" || enu.item().name.slice(enu.item().name.lastIndexOf(".")+1).toLowerCase().indexOf(Extention)>-1){
					scanned_files[i] = enu.item().name;
					i++;
				}
			}
		}
	},
	DownloadFile:function(sourcefile,targetfile){
		var fso     = new ActiveXObject("Scripting.FileSystemObject");
		var stream  = new ActiveXObject("ADODB.Stream");
		var xmlHttp = new ActiveXObject("Microsoft.XMLHttp");
		xmlHttp.Open("GET", sourcefile, false);
		xmlHttp.Send();
		stream.open();
		stream.type = 1;
		stream.write(xmlHttp.responseBody);
		stream.position = 0;
		if (fso.fileExists(targetfile)){
			fso.deleteFile(targetfile);
		}
		stream.saveToFile(targetfile);
		stream.close();
		fso = stream = xmlHttp = null;
		return true;
	}
};


// WScript.Network //
var XNetwork={
	ComputerName:function(){
		var fso = new ActiveXObject("WScript.Network");
		return fso.ComputerName;
	},
	UserName:function(){
		var fso = new ActiveXObject("WScript.Network");
		return fso.UserName;
	},
	DomainName:function(){
		var fso = new ActiveXObject("WScript.Network");
		return fso.UserDomain;
	}
};


// WScript.Shell //
var XShell={
	LaunchApp:function(target_app){
		var apprunner = new ActiveXObject("WScript.Shell");
		apprunner.Run(target_app,0);
	},
	ReadRegKey:function(target_key){
		var readkey = new ActiveXObject("WScript.Shell");
		return readkey.RegRead(target_key);
	},
	WriteRegKey:function(target_key,key_value){
		var writekey = new ActiveXObject("WScript.Shell");
		writekey.RegWrite(target_key,key_value);
		return true;
	},
	DeleteRegKey:function(target_key){
		var deletekey = new ActiveXObject("WScript.Shell");
		//deletekey.RegDelete(target_key);
		alert('Key Deletion Disabled');
		return true;
	},
	SendKey:function(keys){
		var simkeys = new ActiveXObject("WScript.Shell");
		simkeys.SendKeys(keys);
		return true;
	}
};


// Data Conversion //
var xxor = 0;
var XData={
	frontPad:function(s,len,chr){ //Dont self call
		for(var r = s.toString(); r.length < len; r = (chr || "0") + r);
		return r;
	},
	group:function(arr, len){ //Dont self call
		for(var i = 0, r = [], n = arr.length; i < n; ++i) {
			if(i % len === 0)
				r.push([]);
				r[r.length - 1].push(arr[i]);
			}
			return r;
	},

	ToBinary:function(str, charsiz){
		for(var i = 0, r = "", n = str.length; i < n; r += this.frontPad(str.charCodeAt(i++).toString(2), charsiz || 8));
		return r;
	},
	ToAscii:function(bin, charsiz){
		for(var i = 0, cs = this.group(bin.split(""), charsiz || 8), n = cs.length; i < n; cs[i] = String.fromCharCode(parseInt(cs[i++].join(""), 2)));
		return cs.join("");
	},

	ToXOR:function(it,key){
		if (!key){alert('No XOR key specified');}
		else if (Math.round(key*1)!=key){alert('Key must be a number')}
		xxor = "";
		for(i=0;i<it.length;i++){
			xxor += String.fromCharCode(key^it.charCodeAt(i));
		}
		return xxor;
	},
	ToROX:function(it,key){
		if (!key){alert('No XOR key specified');}
		else if (Math.round(key*1)!=key){alert('Key must be a number')}
		xxor = "";
		for(i=0;i<it.length;i++){
			xxor += String.fromCharCode(key^it.charCodeAt(i));
		}
		return xxor;
	}
};


// Utility FUNCTIONS //
var xele_temp  = 0;
var xityp_temp = 0;
var fso_dd = new Array(new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"),new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"));
var fso_fd = "("+fso_dd[0][new Date().getDay()]+") "+new Date().getDate()+" "+fso_dd[1][new Date().getMonth()]+" "+new Date().getFullYear();
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
	DFR:function(el,d){
		document.getElementById(el).style.left = Math.round(parseInt(document.body.offsetWidth) - (document.getElementById(el).offsetWidth+d));
	},
	DFB:function(el,d){
		document.getElementById(el).style.top = Math.round(parseInt(document.body.offsetHeight) - (document.getElementById(el).offsetHeight+d));
	},
	DFRConvert:function(el){
		 return Math.round(parseInt(document.body.offsetWidth) - (parseInt(document.getElementById(el).style.left)+document.getElementById(el).offsetWidth));
	},
	DFBConvert:function(el){
		 return Math.round(parseInt(document.body.offsetHeight) - (parseInt(document.getElementById(el).style.top)+document.getElementById(el).offsetHeight));
	},
	GenerateDFP:function(){
		fso_temp = "";
		for (i=0;i<=document.getElementsByTagName('*').length-1;i++){
			if (document.getElementsByTagName('*')[i].id){
				if (XUtil.DFRConvert(document.getElementsByTagName('*')[i].id)){	
					fso_temp += "XUtil.DFR('"+document.getElementsByTagName('*')[i].id + "'," + XUtil.DFRConvert(document.getElementsByTagName('*')[i].id) + ");";
				}
				if (XUtil.DFBConvert(document.getElementsByTagName('*')[i].id)){	
					fso_temp += "XUtil.DFB('"+document.getElementsByTagName('*')[i].id + "'," + XUtil.DFBConvert(document.getElementsByTagName('*')[i].id) + ");";
				}
			}
		}
		XScripting.CreateFile('dfp_list.txt',fso_temp)
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
	},
	ResChange:function(m,h,w){
		if (m == 1){
			fso_oldres_x = xg_width;
			fso_oldres_y = xg_height;
			XShell.LaunchApp('xres/ResChange.exe -width='+w+' -height='+h);
		}else if (m == 0){
			XShell.LaunchApp('xres/ResChange.exe -width='+fso_oldres_x+' -height='+fso_oldres_y);
		}
		xg_height   = parseInt(screen.height);
		xg_width    = parseInt(screen.width);
		xg_avheight = parseInt(screen.availHeight);
		xg_avwidth  = parseInt(screen.availWidth);
	},
	Date:function(){
		return fso_fd;
	},
	Time:function(imode,itemp,itemp2){
		itemp = new Date().getMinutes();
		itemp2 = new Date().getHours();
		if (itemp<=9){
			itemp = "0"+itemp;
		}
		if (itemp2<=9){
			itemp2 = "0"+itemp2;
		}
		if (imode==1){
			return itemp2+':'+itemp;
		}else{
			return itemp2+''+itemp;
		}
	},
	Roll:function(){ //onmouseover="MenuSystem.Roll()" onmouseout="MenuSystem.Roll()" ityp="res.block.2.2a.png" 			 			//location.basename.outadd.overadd.extension
		xele_temp = event.srcElement;
		xityp_temp = xele_temp.ityp.split('.');
		if (event.type == "mouseover"){
			xele_temp.style.backgroundImage = 'url("'+xityp_temp[0]+'/'+xityp_temp[1]+xityp_temp[3]+'.'+xityp_temp[4]+'")';
		}else if (event.type == "mouseout"){
			xele_temp.style.backgroundImage = 'url("'+xityp_temp[0]+'/'+xityp_temp[1]+xityp_temp[2]+'.'+xityp_temp[4]+'")';
		}
	},
	PreloadImages:function(dir,typ,idx){ // PreloadImages('cardpics/','*.png');
		if (!idx){
			idx = xpreload.length;
		}
		XScripting.SearchDirectory(dir,typ);
		xpreload[idx] = new Array();
		for (x=0;x<scanned_files.length-1;x++){
		xpreload[idx][x] = new Image();
		xpreload[idx][x].src = dir+scanned_files[x];
		}
	},
	RollBgColor:function(it){
		event.srcElement.style.backgroundColor = it;
	},
	RollColor:function(it){
		event.srcElement.style.color = it;
	},
	IsArray:function(it){
		if (it.constructor.toString().indexOf('Array') == -1){
			return false;
		}else{
			return true;
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
		catch(e){;}
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

var xmsgen = 0;
var XMessage = {
	Ini:function(color1,color2,color3){
		if (!color1){
			color1 = '#0099ff';
		}
		if (!color2){
			color2 = 'white';
		}
		if (!color3){
			color3 = 'white';
		}
		document.body.innerHTML+="<div id='xmsgscreen' style='height:105%;width:105%;position:absolute;top:-2;left:-2;display:none;filter:alpha(opacity=20);background-Color:"+color3+";z-index:110;'></div>";
		document.body.innerHTML+='<table style="position:absolute;top:-10;left:-10;z-index:111;" cellpadding=0 cellspacing=0 id="xmsg"><tr><td class="xmsg_t_l"></td><td class="xmsg_t_c"></td><td class="xmsg_t_r"></td></tr><tr><td class="xmsg_bg_l"></td><td class="xmsg_bg_c_t" id="xmsgtitle" style="color:'+color1+';"></td><td class="xmsg_bg_r"></tr><tr><td class="xmsg_bg_l"></td><td class="xmsg_bg_c_b" id="xmsgbody" style="color:'+color2+';"></td><td class="xmsg_bg_r"></td></tr><tr id="xmsgok"><td class="xmsg_bg_l"></td><td class="xmsg_bg_c_c" onclick="XMessage.Close()" onmouseover="XUtil.RollColor(\''+color1+'\');" onmouseout="XUtil.RollColor(\''+color2+'\');" style="color:'+color2+';">Accept</td><td class="xmsg_bg_r"></tr><tr><td class="xmsg_b_l"></td><td class="xmsg_b_c"></td><td class="xmsg_b_r"></td></tr></table>';
		xmsgen = 1;
	},
	Overlay:function(it){
		if (it==0){
			xmsgscreen.style.display = "none";
		}else if (it==1){
			xmsgscreen.style.display = "block";
		}else if (it==2){
			if (xmsgscreen.style.display == "none"){
				return false;
			}else if (xmsgscreen.style.display == "block"){
				return true;
			}
		}
	},
	Alert:function(ti,msg,h,w,noclose,nolay){
		if (!h){
			h = 0;
		}
		if (!w){
			w = 400;
		}
		XMessage.Enabled();
		xmsgok.style.display = 'none'
		if (noclose!=1){
			xmsgok.style.display = 'block';
		}
		if (nolay!=1){
			XMessage.Overlay(1);
		}
		xmsgtitle.innerHTML   = ti;
		xmsgbody.style.width  = w;
		if (h!=0){
			xmsgbody.style.height = h;
		}
		xmsgbody.innerHTML  = msg+"<br><br>";
		xmsg.style.display  = "block";
		XUtil.CenterElement('xmsg','b');
		xmsg.focus();
	},
	Close:function(){
		XMessage.Overlay(0);
		xmsg.style.display = "none";
	},
	Enabled:function(){
		if (xmsgen==0){
			XMessage.Ini();
		}
	}
};

var xsave_vars  = new Array();
var xall_vars   = new Array();
var xencrypt    = 0;
var xtemp       = new Array(3);
var xkey        = 0;
var XDataSystem = {
	Ini:function(enc,key){
		xencrypt = enc;
		xkey = key;
		if (xmsgen == 0){
			XMessage.Ini();
		}
		if (xsave_vars.length == 0 || xall_vars.length == 0){
			XMessage.Alert('XDataSystem - Error','You have not defined the arrays <font color="red">xsave_vars</font> and <font color="red">xall_vars</font>');
		}
		if (enc==2 && !key){
			XMessage.Alert('XDataSystem - Error','You have chosen XOR encryption but have not passed a key');
		}
	},
	Save:function(it){
		xtemp[0] = "";
		xtemp[1] = 0;
		for (i=0;i<=xsave_vars.length-1;i++){
			if (XUtil.IsArray(window[xsave_vars[i]])){
				for (a=0;a<=window[xsave_vars[i]].length-1;a++){
					if (XUtil.IsArray(window[xsave_vars[i]][a])){
						xtemp[1] = 1;
					}
				}
				if (xtemp[1]==0){
					xtemp[0] += "!${a}"+xsave_vars[i]+"@#"+window[xsave_vars[i]].join('!~');
				}else{
					xtemp[0] += "!${m}"+xsave_vars[i]+"@#";
					for (a=0;a<=window[xsave_vars[i]].length-1;a++){
						if (XUtil.IsArray(window[xsave_vars[i]][a])){
							xtemp[0] += window[xsave_vars[i]][a].join('!~')+"$@";
						}else{
							xtemp[0] += window[xsave_vars[i]][a]+"$@";
						}
					}
				}
			}else{
				xtemp[0] += "!${s}"+xsave_vars[i]+"@#"+window[xsave_vars[i]];
			}
		}
		if (xencrypt == 1){
			XScripting.CreateFile(it,XData.ToBinary(xtemp[0]));
		}else if (xencrypt == 2){
			XScripting.CreateFile(it,XData.ToROX(xtemp[0],xkey));
		}else{
			XScripting.CreateFile(it,xtemp[0]);
		}
	},
	Load:function(it){
		xtemp[1] = xtemp[2] = '';
		if (xencrypt == 1){
			xtemp[0] = XData.ToAscii(XScripting.OpenFile(it)).split('!$');
		}else if (xencrypt == 2){
			xtemp[0] = XData.ToXOR(XScripting.OpenFile(it),xkey).split('!$');
		}else{
			xtemp[0] = XScripting.OpenFile(it).split('!$');
		}
		for (a=1;a<=xtemp[0].length-1;a++){
			xtemp[0][a] = xtemp[0][a].split('}');
		}
		for (a=1;a<=xtemp[0].length-1;a++){
			if (xtemp[0][a][0] == '{s'){
				xtemp[1] = xtemp[0][a][1].split('@#');
				xtemp[2] += ""+xtemp[1][0]+"=";
				if (Math.round(xtemp[1][1]*1)==xtemp[1][1] && isNaN(xtemp[1][1])){
					xtemp[2] += xtemp[1][1]+";";
				}else{
					xtemp[2] += "'"+xtemp[1][1]+"';";
				}
			}
			else if (xtemp[0][a][0] == '{a'){ 
				xtemp[1] = xtemp[0][a][1].split('@#');
				xtemp[2] += ""+xtemp[1][0]+"=new Array(";
				xtemp[1][1] = xtemp[1][1].split('!~');
				for (c=0;c<=xtemp[1][1].length-1;c++){
					if (Math.round(xtemp[1][1][c]*1)==xtemp[1][1][c] && isNaN(xtemp[1][1][c])){
						if (c>=xtemp[1][1].length-1){
							xtemp[2] += xtemp[1][1][c];
						}else{
							xtemp[2] += xtemp[1][1][c]+",";
						}
					}else{
						if (c>=xtemp[1][1].length-1){
							xtemp[2] += "'"+xtemp[1][1][c]+"'";
						}else{
							xtemp[2] += "'"+xtemp[1][1][c]+"',";
						}
					}
				}
				xtemp[2] += ");"
			}
			else if (xtemp[0][a][0] == '{m'){
				xtemp[1] = xtemp[0][a][1].split('@#');
				xtemp[2] += ""+xtemp[1][0]+"=new Array(";
				xtemp[1][1] = xtemp[1][1].split('$@');
				xtemp[1][1].pop()
				for (d=0;d<=xtemp[1][1].length-1;d++){
					xtemp[1][1][d] = xtemp[1][1][d].split('!~');
					if (xtemp[1][1][d].length!=1){
						xtemp[2] += "new Array(";
					}
					for (c=0;c<=xtemp[1][1][d].length-1;c++){
						if (Math.round(xtemp[1][1][d][c]*1)==xtemp[1][1][d][c] && isNaN(xtemp[1][1][d][c])){
							if (c>=xtemp[1][1][d].length-1){
								xtemp[2] += xtemp[1][1][d][c];
							}else{
								xtemp[2] += xtemp[1][1][d][c]+",";
							}
						}else{
							if (c>=xtemp[1][1][d].length-1){
								xtemp[2] += "'"+xtemp[1][1][d][c]+"'";
							}else{
								xtemp[2] += "'"+xtemp[1][1][d][c]+"',";
							}
						}
					}
					if (xtemp[1][1][d].length!=1){
						if (d>=xtemp[1][1].length-1){
							xtemp[2] += ")";
						}else{
							xtemp[2] += "),";
						}
					}else{
						if (d>=xtemp[1][1].length-1){
							xtemp[2] += "";
						}else{
							xtemp[2] += ",";
						}
					}
				}
				xtemp[2] += ");"
			}
		}
		eval(xtemp[2]);
	},
	VarState:function(){
		xtemp[2] = "";
		for (i=0;i<=xall_vars.length-1;i++){
			if (XUtil.IsArray(xall_vars[i])){
				xtemp[2] += xall_vars[i] + " = new Array("+window[xall_vars[i]] + ");<br>";
			}else{
				xtemp[2] += xall_vars[i] + " = "+window[xall_vars[i]] + ";<br>";
			}
		}
		XMessage.Alert('XData System - Variable State',xtemp[2]);
	}
};

var xconndir    = 0;
var xdatainact  = 0;
var xdataoutact = 0;
var xmyrole     = 0;
var xtimer      = 0;
var xreceived   = 0;
var xconnstate  = 0;
var XConnect={
	Ini:function(it1,it2,it3){
		if (it1){
			xconndir = it1;
		}
		if (it2){
			xdatainact = it2;
		}
		if (it3){
			xdataoutact = it3;
		}
		if (xconndir==0){
			XMessage.Alert('XConnect','No xconndir directory specified');
		}else if (xdatainact==0){
			XMessage.Alert('XConnect','No xdatainact function specified');
		}else if (xdataoutact==0){
			XMessage.Alert('XConnect','No xdataoutact function specified');
		}
	},
	Connect:function(){
		if (XScripting.FileExist(xconndir+document.title+'-host.txt') && XScripting.FileExist(xconndir+document.title+'-client.txt')){
			xmyrole = -1;
		}else if (!XScripting.FileExist(xconndir+document.title+'-host.txt')){
			XScripting.CreateFile(xconndir+document.title+'-host.txt',eval(xdataoutact)(0));
			xmyrole = 'host';
		}else{
			XScripting.CreateFile(xconndir+document.title+'-client.txt',eval(xdataoutact)(0));
			xmyrole = 'client';
		}
		if (xmyrole==-1){
			XMessage.Alert(document.title,'Game server is full<br><br><input type="button" value="Exit Game" class="btn" onclick="window.close()">',1);
		}else{
			document.body.innerHTML += ' - '+xmyrole;
			xtimer = setInterval("XConnect.GetOpponent()",2000);
			XMessage.Alert(document.title,'Waiting for opponent',1);
		}
	},
	GetOpponent:function(){
		if (XScripting.FileExist(xconndir+document.title+'-host.txt') && XScripting.FileExist(xconndir+document.title+'-client.txt')){
			XMessage.Alert(document.title,'Opponent ready');
			clearInterval(xtimer);
			if (XConnect.Role()){
				xreceived  = XScripting.OpenFile(xconndir+document.title+'-client.txt');
				xconnstate = 'needtosend'; 
				eval(xdatainact)(0);
				xtimer = setInterval("XConnect.Receive()",1000);
			}else{
				xreceived = XScripting.OpenFile(xconndir+document.title+'-host.txt');
				xconnstate = 'needtorecieve';
				eval(xdatainact)(0);
				xtimer = setInterval("XConnect.Receive()",1000);
			}
			
		}
	},
	Receive:function(){
		if (XConnect.Role()){
			if (XScripting.FileExist(xconndir+document.title+'-tohost.txt')){
				xreceived = XScripting.OpenFile(xconndir+document.title+'-tohost.txt');
				eval(xdatainact)(1);
				XScripting.DeleteFile(xconndir+document.title+'-tohost.txt');
			}
		}else{
			if (XScripting.FileExist(xconndir+document.title+'-toclient.txt')){
				xreceived = XScripting.OpenFile(xconndir+document.title+'-toclient.txt');
				eval(xdatainact)(1);
				XScripting.DeleteFile(xconndir+document.title+'-toclient.txt');
			}
		}
	},
	Disconnect:function(){
		if (XConnect.Role()){
			XScripting.DeleteFile(xconndir+document.title+'-host.txt');
			XScripting.DeleteFile(xconndir+document.title+'-toclient.txt');
		}else if (xmyrole == 'client'){
			XScripting.DeleteFile(xconndir+document.title+'-client.txt');
			XScripting.DeleteFile(xconndir+document.title+'-tohost.txt');
		}
	},
	Send:function(it){
		if (XConnect.Role()){
			XScripting.CreateFile(xconndir+document.title+'-toclient.txt',it);
		}else {
			XScripting.CreateFile(xconndir+document.title+'-tohost.txt',it);
		}
	},
	Role:function(){
		if (xmyrole == 'host'){
			return true;
		}else{
			return false;
		}
	}
};

var xctimer   = 0;
var xcolt     = new Array();
var xc_action = 0;
var XCollide = {
	Ini:function(ispeed,iaction){
		xc_action = iaction;
		if (!ispeed){
			ispeed = 100;
		}
		if (!iaction){
			XMessage.Alert('XCollide Error','You need to specify a <i>xc_action</i> function. <br>It always passes the iden number and the id of both elements in question.');
		}else{
			xctimer = setInterval("XCollide.CheckAll()",ispeed);
		}
	},
	Clear:function(){
		xcolt = new Array();
	},
	Stop:function(){
		clearInterval(xctimer);
	},
	Check:function(it1,it2,itd,iden){ //r value needs to be defined as sqrt(l*w)/2
		if (!xcolt[itd]){
			xcolt[itd]     = new Array();
			xcolt[itd][0]  = document.getElementById(it1);
			xcolt[itd][8]  = parseInt(xcolt[itd][0].style.height);
			xcolt[itd][9]  = parseInt(xcolt[itd][0].style.width);
			xcolt[itd][12] = it1;
			xcolt[itd][3]  = document.getElementById(it2);
			xcolt[itd][10] = parseInt(xcolt[itd][3].style.height);
			xcolt[itd][11] = parseInt(xcolt[itd][3].style.width);
			xcolt[itd][13] = it2;
			xcolt[itd][14] = itd;
			xcolt[itd][15] = 0;
			xcolt[itd][16] = iden;
			xcolt[itd][7]  = Math.round(Math.round(Math.sqrt(xcolt[itd][8]*xcolt[itd][9])/2)+Math.round(Math.sqrt(xcolt[itd][10]*xcolt[itd][11])/2));
		}
		xcolt[itd][1] = Math.round(parseInt(xcolt[itd][0].style.left) + (xcolt[itd][8]/2));  //a
		xcolt[itd][2] = Math.round(parseInt(xcolt[itd][0].style.top)  + (xcolt[itd][9]/2));  //b
		xcolt[itd][4] = Math.round(parseInt(xcolt[itd][3].style.left) + (xcolt[itd][10]/2)); //c
		xcolt[itd][5] = Math.round(parseInt(xcolt[itd][3].style.top)  + (xcolt[itd][11]/2)); //d
		xcolt[itd][6] = Math.round(Math.sqrt(Math.pow(xcolt[itd][1]-xcolt[itd][4],2)+Math.pow(xcolt[itd][2]-xcolt[itd][5],2))); //dist form
		if (xcolt[itd][7]>=xcolt[itd][6]){
			xcolt[itd][15] = 1;
			eval(xc_action)(xcolt[itd][16],xcolt[itd][12],xcolt[itd][13]);
		}else{
			xcolt[itd][15] = 0;
		}
		
	},
	CheckAll:function(){
		for (xi=0;xi<=xcolt.length-1;xi++){
			XCollide.Check(xcolt[xi][12],xcolt[xi][13],xi);
		}
	}
};