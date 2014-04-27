// File System //
var XS = {
	temp: [],
	xmlhttp: null,
	stream: null,
	fso: null,
	iniFSO:function(){
		if (!XS.fso){
			XC.log("File System Object Initialized");
			XS.fso = new ActiveXObject("Scripting.FileSystemObject");
		}
	},
	file:function(fileName, action, data){
		XS.iniFSO();
		if (XS.fso.FileExists(fileName)){
			if (action == 'exist'){
				return true;
			}
			else if (action == 'open'){
				XS.temp[0] = XS.fso.GetFile(fileName).OpenAsTextStream(1, 0);
				XS.temp[1] = XS.temp[0].ReadAll();
				XS.temp[0].close();
				return XS.temp[1];
			}
			else if (action == 'writeline'){
				XS.temp[0] = XS.fso.OpenTextFile(fileName, 8, 1, -2);
				XS.temp[0].writeline(data);
				XS.temp[0].Close();
			}
			else if (action == 'create'){
				XS.temp[0] = XS.fso.createTextFile(fileName);
				XS.temp[0].write(data); 
				XS.temp[0].close();
			}
			else if (action == 'delete'){
				XS.fso.DeleteFile(fileName); 
			}
			else if (action == 'size'){
				return XS.fso.GetFile(fileName).Size;
			}
			else if (action == 'basename'){
				return XS.fso.GetBaseName(fileName);
			}
			else if (action == 'extension'){
				return XS.fso.GetExtensionName(fileName);
			}
			else if (action == 'name'){
				return XS.fso.GetFileName(fileName);
			}
			else if (action == 'move' && XS.Folder(data, 'exist')){
				XS.fso.MoveFile(fileName, data);		
			}
			else if (action == 'copy' && XS.Folder(data, 'exist')){
				XS.fso.CopyFile(fileName, data);	
			}
			return false;
		}else if (action == 'create'){
			XS.temp[0] = XS.fso.createTextFile(fileName);
			XS.temp[0].write(data); 
			XS.temp[0].close();
		}else{
			return false;
		}
	},
	currentPath:function(){
		return XS.fso.GetFolder(".").Path;
	}
};

// Utility Functions //
var XU = {
	centerElement:function(eleId, mode, xOffset, yOffset){
		xOffset = xOffset || 0;
		yOffset = yOffset || 0;
		if (mode == 'v' || mode == 'b'){
			XU.el(eleId).style.top = Math.round(yOffset + (parseInt(document.body.offsetHeight) / 2) - (XU.el(eleId).offsetHeight / 2)) + yOffset;
		}
		if (mode == 'h' || mode == 'b'){
			XU.el(eleId).style.left = Math.round(xOffset + (parseInt(document.body.offsetWidth) / 2) - (XU.el(eleId).offsetWidth / 2)) + xOffset;
		}
	},
	DFR:function(eleId, distance){
		XU.el(eleId).style.left = Math.round(parseInt(document.body.offsetWidth) - (XU.el(eleId).offsetWidth + distance));
	},
	DFB:function(eleId, distance){
		XU.el(eleId).style.top = Math.round(parseInt(document.body.offsetHeight) - (XU.el(eleId).offsetHeight + distance));
	},
	resizeWindow:function(params){
		if (params.fullscreen){
			params.height = parseInt(screen.height);
			params.width = parseInt(screen.width);
		}
		if (params.centered){
			self.moveTo(parseInt(screen.width) / 2 - (params.width / 2), parseInt(screen.height) / 2 - (params.height / 2));
		}
		try{
			window.resizeTo(params.width, params.height);
		}catch(e){
			XU.resizeWindow(params);
		}
	},
	moveWindow:function(x, y){
		if (x == "c"){
			x = parseInt(screen.width) / 2 - (document.body.offsetWidth / 2);
		}
		if (y == "c"){
			y = parseInt(screen.height) / 2 - (document.body.offsetHeight / 2);
		}
		self.moveTo(x, y);
	},


	el:function(eleId){
		return document.getElementById(eleId);
	},
	changeClass:function(eleId, className){
		XU.el(eleId).className = className;
	},
	scroll:function(eleId){
		XU.el(eleId).scrollTop = XU.el(it).scrollHeight;
	},
	hide:function(eleId){
		XU.el(eleId).style.display = 'none';
	},
	show:function(eleId){
		XU.el(eleId).style.display = 'block';
	},
	intoBody:function(data){
		var container = document.createElement("SPAN");
		container.innerHTML = data;
		document.body.appendChild(container);
	}
};

var XM = {
	trueButton: "Accept",
	falseButton: "Cancel",
	nullResponse: "xcnull", //value returned when the falseButton is clicked for a prompt
	hoverColor: "#0099ff",
	defaultColor: "white",
	defaultSpace: 30, //Space between buttons on a confirm dialog
	alert:function(params){
		params.left = params.left || 'center';
		params.top = params.top || 'center';
		params.width = params.width || 300;
		XM.private.universal(params);
		XM.get('buttons', XM.private.seed).innerHTML = XM.private.button(XM.private.seed, true);
		return XM.private.seed;
	},
	static:function(params){
		XM.private.universal(params);
		XM.get('buttons', XM.private.seed).innerHTML = "";
		return XM.private.seed;
	},
	confirm:function(params){
		params.left = params.left || 'center';
		params.top = params.top || 'center';
		params.width = params.width || 300;
		XM.private.universal(params);
		XM.get('buttons', XM.private.seed).innerHTML = XM.private.button(XM.private.seed, true) + XU.drawRepeat('&nbsp;', XM.defaultSpace) + XM.private.button(XM.private.seed, false);
		return XM.private.seed;
	},
	prompt:function(params){
		params.left = params.left || 'center';
		params.top = params.top || 'center';
		params.width = params.width || 300;
		params.prompt = true;
		params.screen = params.screen || true;
		params.password = (params.password) ? "password" : "textarea";
		params.defaultText = params.defaultText || "";
		XM.private.universal(params);
		XM.get('body', XM.private.seed).innerHTML = XM.private.field(XM.private.seed, params);
		XM.get('buttons', XM.private.seed).innerHTML = XM.private.button(XM.private.seed, true) + XU.drawRepeat('&nbsp;', XM.defaultSpace) + XM.private.button(XM.private.seed, XM.nullResponse);
		XU.el("field" + XM.private.seed).focus();
		XU.el("field" + XM.private.seed).select();
		return XM.private.seed;
	},
	get:function(field, seed){
		try{
			return document.getElementById('xm_' + field + seed);
		}catch(e){}
	},
	destroy:function(seed){
		var ele = XU.el('xm_window' + seed);
		ele.parentNode.removeChild(ele);
	},
	screenCover:function(state){
		xm_screen.style.display = (state) ? "block" : "none";
	},
	setBody:function(seed, data){
		XM.get('body', seed).innerHTML = '<br>' + data;
	},
	setTitle:function(seed, data){
		XM.get('title', seed).innerHTML = data;
	},
	setSize:function(seed, params){
		XM.private.sizes(seed, params);
	},
	setPosition:function(seed, params){
		XM.private.positions(seed, params);
	},
	reCenter:function(seed){
		XM.private.positions(seed, {centered:true});
	},
	hide:function(seed){
		XM.get('window', seed).style.display = "none";
	},
	show:function(seed){
		XM.get('window', seed).style.display = "block";
	},
	private:{
		seed: -1,
		iniVar: false,
		ini:function(){
			try{
				var ele = XU.el('xm_container');
				ele.parentNode.removeChild(ele);
			}catch(e){}
			XU.intoBody('<div id="xm_screen" style="background-color:white;cursor:default;filter:alpha(opacity = 20);opacity:0.2;position:absolute;z-index:19998;left:0;top:0;width:100%;height:100%;border:none;zoom:1;display:none;"></div>');
			XM.private.iniVar = true;
		},
		universal:function(params){
			XM.private.draw();
			XM.screenCover(params.screen);
			XM.get('title', XM.private.seed).innerHTML = (params.title) ? params.title : "";
			XM.get('body', XM.private.seed).innerHTML = (params.body) ? "<br>" + params.body : "";
			XM.get('window', XM.private.seed).style.display = 'block';
			XM.private.sizes(XM.private.seed, params);
			XM.private.positions(XM.private.seed, params);
			XM.get('window', XM.private.seed).onmouseover = function(){
				var source = event.srcElement;
				if (source.seed && !source.field){
					source.style.color = XM.hoverColor;
				}
			}
			XM.get('window', XM.private.seed).onmouseout = function(){
				var source = event.srcElement;
				if (source.seed && !source.field){
					source.style.color = XM.defaultColor;
				}
			}
			XM.get('window', XM.private.seed).onclick = function(){
				var source = event.srcElement;
				if (source.seed && !source.field){
					XM.private.callback(source.result, params, source.seed);
				}
			}
			if (params.prompt){
				XM.get('window', XM.private.seed).onkeypress = function(){
					var source = event.srcElement;
					if (source.field && event.keyCode == 13){
						XM.private.callback(source.value, params, source.seed);
					}
				}
			}
		},
		sizes:function(seed, params){
			try{
				if (params.width){
					XM.get('window', seed).style.width = params.width;
				}
				if (params.height){
					XM.get('window', seed).style.height = params.height;
				}
			}catch(e){}
		},
		positions:function(seed, params){
			try{
				if (params.centered){
					params.top = 'center';
					params.left = 'center';
				}
				if (params.top == 'center'){
					XU.centerElement('xm_window' + seed, 'v');
				}else if (params.top){
					XM.get('window', seed).style.top = params.top;
				}
				if (params.left == 'center'){
					XU.centerElement('xm_window' + seed, 'h');
				}else if (params.left){
					XM.get('window', seed).style.left = params.left;
				}
			}catch(e){}
		},
		callback:function(result, params, seed){
			var usercall = params.callback;
			result =  (params.prompt && result != XM.nullResponse) ? document.getElementById("field" + seed).value : result;
			if (usercall){
				usercall(result);
			}
			XM.screenCover(false);
			XM.destroy(seed);
		},
		button:function(seed, type){
			var btnText = (type == true) ? XM.trueButton : XM.falseButton;
			return '<span result=' + type + ' style="cursor:hand;" seed=' + seed + ' id="btn' + type + seed + '">' + btnText + '</span>';
		},
		field:function(seed, params){
			return '<br><center><input type="' + params.password + '" style="border:1 solid white;background-Color:transparent;color:white;width:100%;" seed=' + seed + ' id="field' + seed + '" value="' + params.defaultText + '" field=true></center>';
		},
		draw:function(){
			XM.private.seed++;
			if (!XM.private.iniVar){
				XM.private.ini();
			}
			var container = document.createElement("SPAN");
			container.innerHTML = '<table style="position:absolute;top:0;left:0;display:none;z-index:19999;" cellpadding=0 cellspacing=0 id="xm_window' + XM.private.seed + '"><tr><td style="overflow:hidden;background:url(\'xres/WindowTopLeft.png\') repeat scroll 0% 0% transparent;width:15px;height:32px;">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowTopCenter.png\') repeat scroll 0% 0% transparent;color:' + XM.defaultColor + ';" id="xm_title' + XM.private.seed + '">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowTopRight.png\') repeat scroll 0% 0% transparent;width:15px;">&nbsp;</td></tr><tr><td style="overflow:hidden;background:url(\'xres/WindowCenterLeft.png\') repeat scroll 0% 0% transparent;">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowCenter.png\') repeat scroll 0% 0% transparent;text-align:left;color:' + XM.defaultColor + ';overflow-x:auto;word-wrap:break-word;" id="xm_body' + XM.private.seed + '">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowCenterRight.png\') repeat scroll 0% 0% transparent;">&nbsp;</td></tr><tr><td style="overflow:hidden;background:url(\'xres/WindowBottomLeft.png\') repeat scroll 0% 0% transparent;height:39px;">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowBottomCenter.png\') repeat scroll 0% 0% transparent;height:39px;color:' + XM.defaultColor + ';text-align:center;" id="xm_buttons' + XM.private.seed + '">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowBottomRight.png\') repeat scroll 0% 0% transparent;height:39px;">&nbsp;</td></tr></table>';
			document.body.appendChild(container);
		}
	}
};