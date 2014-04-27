/*
Created by Gavin Delphia 2007 - 2011
Version 25112011_0103
Not compatible with previous versions
*/

var xarc = 0; //Used to test if the application is still in a archive

// Array Prototypes //
Array.prototype.indexOf = function(v, n){
	n = (n == null) ? 0 : n; var m = this.length;
	for(var i = n; i < m; i++)
	if(this[i] == v)
	return i;
	return -1;
};

Array.prototype.copy = function(){
	var a = [], i = this.length;
	while(i--){
		a[i] = typeof this[i].copy !== 'undefined' ? this[i].copy() : this[i];
	}
	return a;
};

Array.prototype.shuffle = function(b){
	var i = this.length, j, t;
	while(i){
		j = Math.floor((i--) * Math.random());
		t = b && typeof this[i].shuffle !== 'undefined' ? this[i].shuffle() : this[i];
		this[i] = this[j];
		this[j] = t;
	}
	return this;
};

Array.prototype.unique = function(b){
	var a = [], i, l = this.length;
	for(var i = 0; i < l; i++){
		if(a.indexOf(this[i], 0, b) < 0){
			a.push(this[i]);
		}
	}
	return a;
};

Array.prototype.remove = function(b){
	this.splice(b, 1);
	return this;
};

//Console System//
var XC = {
	seed: null,
	data: "",
	onScreen: false,
	ini:function(){
		document.body.attachEvent('ondblclick', XC.private.toggle);
		XC.private.draw();
		XC.private.output("Console: " + document.title);
	},
	hide:function(){
		XC.onScreen = false;
		XM.hide(XC.seed);
	},
	show:function(){
		XC.onScreen = true;
		XM.show(XC.seed);
		XM.setPosition(XC.seed, {centered:true});
		XC.private.output();
		setTimeout("xc_input.focus()", 100);
	},
	log:function(data){
		XC.private.output("<> " + data);
	},
	private:{
		action:{
			set:function(item, data){
				if (data != XM.nullResponse){
					XC.private.output("\tEntered: " + data);
					if (data.length > 0){
						try{
							eval(item + " = " + data);
						}catch(e){
							XC.private.output("\tInvalid value");
						}
						XC.private.command("-get " + item);
					}
				}else{
					XC.private.output("\tOperation cancelled");
				}
				setTimeout("xc_input.focus()", 100);
			},
			run:function(data){
				if (data != XM.nullResponse){
					XC.private.lastRun = data;
					var tempSplit = data.split(';');
					var newString = "";
					for (var i = 0; i < tempSplit.length; i++) {
						if (tempSplit[i].length > 0){
							newString += tempSplit[i] + ";";
							newString += (i < tempSplit.length - 1) ? "\r\n\t\t " : "";
						}
					}
					XC.private.output("\tEntered: " + newString);
					if (data.length > 0){
						try{
							eval(data);
						}catch(e){
							XC.private.output("\tERROR: " + e.message);
						}
					}
					XC.private.output("\tRun Complete");
				}else{
					XC.private.output("\tOperation cancelled");
				}
				setTimeout("xc_input.focus()", 100);
			}
		},
		lastRun:"",
		submit:function(){
			if (event.keyCode == 13){
				XC.private.command(xc_input.value);
				xc_input.value = "";
			}	
		},
		command:function(data){
			XC.private.output(data);
			data = data.split(" ");
			var cmd = data[0];
			var item = data[1];
			if (cmd == '-get'){
				try{
					var tempVal = eval(item);
					XC.private.output("\tvalue = " + tempVal + ";");
					try{
						XC.private.output("\ttype = " + XU.getType(tempVal) + ";");
					}catch(e){
						XC.private.output("\ttype = null;");
					}
				}catch(e){
					XC.private.output("\tVariable not found");
				}
			}else if (cmd == '-cls'){
				XC.data = "";
				XC.private.output();
			}else if (cmd == '-keygen'){
				XC.private.output("\tKeygen activated");
				Auth.genKey();
				XC.private.output("\tKey created. Reopen app to update encryption.");
			}else if (cmd == "-set"){
				XM.prompt({
					title:item + " = ", 
					defaultText: "Use quotes for strings", 
					callback:function(result){
						XC.private.action.set(item, result);
					}
				});
			}else if (cmd == "-source"){
				XS.file('source.txt', 'create', document.getElementsByTagName('html')[0].outerHTML);
				XC.private.output("\tSource exported to source.txt");
			}else if (cmd == "-savelog"){
				XS.file('xcLog.txt', 'create', XC.data);
				XC.private.output("\tLog exported to xcLog.txt");
			}else if (cmd == "-run"){
				XM.prompt({
					title:"Enter command to be evaluated", 
					defaultText: XC.private.lastRun, 
					callback:function(result){
						XC.private.action.run(result);
					}
				});
			}else if (cmd == "-help"){
				XC.private.output('\t-set [var] (Prompted to set the data of a variable)\r\n\t-get [var] (Retrieves the variable information)\r\n\t-cls (Clears the console)\r\n\t-savelog (Saves the console data to xcLog.txt)\r\n\t-help (Displays help information)\r\n\t-source (Outputs source to source.txt)\r\n\t-run (run box for javascript)');
			}else{
				XC.private.output("\tUnknown command");
			}
		},
		output:function(data){
			if (data){
				XC.data += data + "\r\n";
			}
			if (XC.onScreen){
				xc_output.value = XC.data;
				xc_output.scrollTop = xc_output.scrollHeight;
			}
		},
		toggle:function(){
			(XC.onScreen) ? XC.hide() : XC.show();
		},
		draw:function(){
			XC.seed = XM.static({
				title:"Console", 
				body:'<textarea id="xc_output" style="height:85%;width:97%;background-Color:transparent;border:0 solid white;color:white;" readonly></textarea><input type="textarea" id="xc_input" style="width:97%;background-Color:transparent;color:white;border:1 solid white;" onkeypress="XC.private.submit()">', 
				centered:true, 
				height:"70%", 
				width:"70%"});
			XM.hide(XC.seed);
		}
	}
};

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
	iniADODB:function(){
		if (!XS.stream){
			XC.log("ADODB.Stream Initialized");
			XS.stream = new ActiveXObject("ADODB.Stream");
		}		
	},
	iniXMLHttp:function(){
		if (!XS.xmlhttp){
			XC.log("Microsoft.XMLHttp Initialized");
			XS.xmlhttp = new ActiveXObject("Microsoft.XMLHttp");
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
		}else if (action == 'download'){
			XS.iniADODB();
			XS.iniXMLHttp();
			XS.xmlhttp.Open("GET", fileName, false);
			XS.xmlhttp.Send();
			XS.stream.open();
			XS.stream.type = 1;
			XS.stream.write(XS.xmlhttp.responseBody);
			XS.stream.position = 0;
			if (XS.fso.fileExists(data)){
				XS.fso.deleteFile(data);
			}
			XS.stream.saveToFile(data);
			XS.stream.close();
			XS.fso = XS.stream = XS.xmlhttp = null;
			return data;
		}else{
			return false;
		}
	},
	folder:function(fileName, action, data){
		XS.iniFSO();
		if (XS.fso.FolderExists(fileName)){
			if (action == 'exist'){
				return true;
			}
			else if (action == 'getfiles'){
				XS.temp[0] = XS.fso.GetFolder(fileName);
				XS.temp[1] = new Array();
				XS.temp[2] = -1;
				for(XS.temp[3] = new Enumerator(XS.temp[0].Files);!XS.temp[3].atEnd();XS.temp[3].moveNext()){
					XS.temp[2]++;
					XS.temp[1][XS.temp[2]] = XS.temp[3].item();
				}
				return XS.temp[1];
			}
			else if (action == 'delete'){
				XS.fso.DeleteFolder(fileName);
			}
			else if (action == 'move' && XS.Folder(data, 'exist')){
				XS.fso.MoveFolder(fileName, data);
			}
			else if (action == 'copy' && XS.Folder(data, 'exist')){
				XS.fso.CopyFolder(fileName, data);	
			}
			else if (action == 'search'){
				var xscan = xscan.splice(0, 0);
				XS.temp[0] = (data.lastIndexOf(".") > -1) ? data.slice(0, data.lastIndexOf(".")) : (data.length > 0) ? data.toLowerCase() : "*";
				XS.temp[1] = (data.lastIndexOf(".") > -1) ? data.slice(data.lastIndexOf(".") + 1).toLowerCase() : "*"; 
				if(fileName.length > 0 && XS.fso.FolderExists(fileName)){
					XS.temp[2] = new Enumerator(XS.fso.GetFolder(fileName).Files);
					for(var i = 0; !XS.temp[2].atEnd(); XS.temp[2].moveNext()){
						if(XS.temp[0] == "*" ||  XS.temp[2].item().name.slice(0,XS.temp[2].item().name.lastIndexOf(".")).toLowerCase().indexOf(XS.temp[0]) > -1){
							if(XS.temp[1] == "*" || XS.temp[2].item().name.slice(XS.temp[2].item().name.lastIndexOf(".") + 1).toLowerCase().indexOf(XS.temp[1]) > -1){
								xscan[i] = XS.temp[2].item().name;
								i++;
							}
						}
					}
				}
				return xscan;
			}
			return false;
		}
		else if (action == 'create'){
			XS.fso.createFolder(fileName);
			return fileName;		
		}
		else{
			return false;
		}
	},
	currentPath:function(){
		return XS.fso.GetFolder(".").Path;
	}
};


// Network Functions //
var XN = {
	net: null,
	iniNetwork:function(){
		if (!XN.net){
			XC.log("WScript.Network Initialized");
			XN.net = new ActiveXObject("WScript.Network");
		}
	},
	getName:function(mode){
		XN.iniNetwork();
		if (mode == 'computer'){
			return XN.net.ComputerName;
		}
		else if (mode == 'user'){
			return XN.net.UserName;
		}
		else if (mode == 'domain'){
			return XN.net.DomainName;
		}
		else if (mode == 'mac'){
			var objWMIService = GetObject("winmgmts:\\\\.\\root\\cimv2");
			var e = new Enumerator(objWMIService.ExecQuery("Select * from Win32_NetworkAdapter", "WQL", 48));
			for (; !e.atEnd(); e.moveNext()){	
				objItem = e.item();
				if (objItem.MACAddress != null){
					return objItem.MACAddress;
					break;
				}
			}
		}
	}
};


// Shell Functions //
var XWS = {
	shell: null,
	iniShell:function(){
		if (!XWS.shell){
			XC.log("WScript.Shell Initialized");
			XWS.shell = new ActiveXObject("WScript.Shell");
		}
	},
	env:function(path){
		XWS.iniShell();
		return XWS.shell.ExpandEnvironmentStrings(path);
	},
	launch:function(command){
		XWS.iniShell();
		XWS.shell.Run(command, 0);
	},
	reg:function(keyName, action, data){
		XWS.iniShell();
		if (action == 'read'){
			return XWS.shell.RegRead(keyName);
		}
		else if (action == 'delete'){
			return XWS.shell.RegDelete(keyName);
		}
		else if (action == 'write'){
			XWS.shell.RegWrite(keyName, data);
			XWS.Reg(keyName, 'read');
		}
	},
	sendKey:function(key){
		XWS.iniShell();
		XWS.shell.SendKeys(key);
	}
};

//Random number with seeds//
var XR = {
	seed: null,
	constant: Math.pow(2, 13) + 1,
	prime: 41,
	max: 1000,
	setSeed:function(seed){
		XR.seed = seed || new Date().getTime();
	},
	next:function(min, max){
		if (!XR.seed){
			XR.setSeed(null);
		}
		XR.seed *= XR.constant;
		XR.seed += XR.prime;
		return (min && max) ? min + XR.seed % XR.max / XR.max * (max - min) : XR.seed % XR.max / XR.max;  
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
	isArray:function(eleObj){
		return (eleObj.constructor.toString().indexOf('Array') == -1) ? false : true;
	},
	getType:function(eleObj){
		return eleObj.constructor.toString().split(" ")[1].split("()")[0];
	},
	drawRepeat:function(string, amt){
		var temp = '';
		for (var x = 0; x < amt; x++){
			temp += string;
		}
		return temp;
	},
	el:function(eleId){
		return document.getElementById(eleId);
	},
	createShortcut:function(name, path, icon, description){ //scut is not a param
		if (!XS.file(XS.shell.SpecialFolders('Desktop') + '\\' + name + '.lnk', 'exist')){
			var scut = XS.shell.CreateShortcut(XS.shell.SpecialFolders('Desktop') + '\\' + name + '.lnk');
			scut.TargetPath = XS.shell.CurrentDirectory + '\\' + path;
			scut.WindowStyle = 1;
			scut.IconLocation = XS.shell.CurrentDirectory + '\\' + icon;
			scut.Description = description;
			scut.WorkingDirectory = XS.CurrentPath();
			scut.Save();
		}
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
	/*
		note: Having trouble with dialog events firing? Make sure you always use XU.intoBody() to add content to
			the HTML body of the document or else events will break. This means do not use
			document.body.innerHTML += "Content"; You can use this method anywhere except when adding to the HTML body. The cause of this is unknown.

		params:
			title: string
				purpose: Specifices the dialog title bar content
				default: no default
			body: string
				purpose: Specifices the dialog body content
				default: no default
			left: number, string percentage, 'center'
				purpose: Specifies the left position of the dialog
				default: 'center'
					exception static: no default
			top:  number, string percentage, 'center'
				purpose: Specifies the top position of the dialog
				default: 'center'
					exception static: no default
			centered: boolean
				purpose: Centers the dialog if true
				default: no default
			width: number, string percentage
				purpose: Specifies the width of the dialog
				default: 300
					exception static: no default
			height: number, string percentage
				purpose: Specifies the height of the dialog
				default: no default
			screen: boolean
				purpose: Forces interaction with dialog by putting up a screen if true
				default: false
					exception prompt: true
			callback: function(result){}
				purpose: Specifies the function to execute after the dialog is acknowledged
				default: no default
				unrecognized: static
			defaultText: string
				purpose: Specifies the field text in a prompt dialog
				default: no default
				unrecognized: static, alert, confirm
			password: boolean
				purpose: Changes the field to a password type
				default: false;
				unrecognized: static, alert, confirm
	*/
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

// Save Data //
var XDS = {
	save_vars: [],
	temp: [3],
	ini:function(){
		if (XDS.save_vars.length == 0){
			XM.alert({title:'XDS', body:'You have not defined the array <font color="red">XDS.save_vars</font>'});
		}
	},
	save:function(it){
		XDS.temp[0] = "";
		XDS.temp[1] = 0;
		for (var i = 0; i <= XDS.save_vars.length - 1; i++){
			if (XU.isArray(window[XDS.save_vars[i]])){
				for (a = 0; a <= window[XDS.save_vars[i]].length - 1; a++){
					if (XU.isArray(window[XDS.save_vars[i]][a])){
						XDS.temp[1] = 1;
					}
				}
				if (XDS.temp[1] == 0){
					XDS.temp[0] += "!${a}" + XDS.save_vars[i] + "@#" + window[XDS.save_vars[i]].join('!~');
				}else{
					XDS.temp[0] += "!${m}" + XDS.save_vars[i] + "@#";
					for (var a = 0; a <= window[XDS.save_vars[i]].length - 1; a++){
						if (XU.isArray(window[XDS.save_vars[i]][a])){
							XDS.temp[0] += window[XDS.save_vars[i]][a].join('!~') + "$@";
						}else{
							XDS.temp[0] += window[XDS.save_vars[i]][a] + "$@";
						}
					}
				}
			}else{
				XDS.temp[0] += "!${s}" + XDS.save_vars[i] + "@#" + window[XDS.save_vars[i]];
			}
		}
		XS.file(it, 'create', XDS.temp[0]);
	},
	load:function(it){
		XDS.temp[1] = XDS.temp[2] = '';
		XDS.temp[0] = XS.file(it, 'open').split('!$');
		for (var a = 1; a <= XDS.temp[0].length - 1; a++){
			XDS.temp[0][a] = XDS.temp[0][a].split('}');
		}
		for (var a = 1; a <= XDS.temp[0].length - 1; a++){
			if (XDS.temp[0][a][0] == '{s'){
				XDS.temp[1] = XDS.temp[0][a][1].split('@#');
				XDS.temp[2] += "" + XDS.temp[1][0] + "=";
				if (Math.round(XDS.temp[1][1] * 1) == XDS.temp[1][1] && isNaN(XDS.temp[1][1])){
					XDS.temp[2] += XDS.temp[1][1] + ";";
				}else{
					XDS.temp[2] += "'" + XDS.temp[1][1] + "';";
				}
			}
			else if (XDS.temp[0][a][0] == '{a'){ 
				XDS.temp[1] = XDS.temp[0][a][1].split('@#');
				XDS.temp[2] += "" + XDS.temp[1][0] + "=new Array(";
				XDS.temp[1][1] = XDS.temp[1][1].split('!~');
				for (var c = 0; c <= XDS.temp[1][1].length - 1; c++){
					if (Math.round(XDS.temp[1][1][c] * 1) == XDS.temp[1][1][c] && isNaN(XDS.temp[1][1][c])){
						if (c >= XDS.temp[1][1].length - 1){
							XDS.temp[2] += XDS.temp[1][1][c];
						}else{
							XDS.temp[2] += XDS.temp[1][1][c] + ",";
						}
					}else{
						if (c >= XDS.temp[1][1].length - 1){
							XDS.temp[2] += "'" + XDS.temp[1][1][c] + "'";
						}else{
							XDS.temp[2] += "'" + XDS.temp[1][1][c] + "',";
						}
					}
				}
				XDS.temp[2] += ");"
			}
			else if (XDS.temp[0][a][0] == '{m'){
				XDS.temp[1] = XDS.temp[0][a][1].split('@#');
				XDS.temp[2] += "" + XDS.temp[1][0] + "=new Array(";
				XDS.temp[1][1] = XDS.temp[1][1].split('$@');
				XDS.temp[1][1].pop();
				for (var d = 0; d <= XDS.temp[1][1].length - 1; d++){
					XDS.temp[1][1][d] = XDS.temp[1][1][d].split('!~');
					if (XDS.temp[1][1][d].length != 1){
						XDS.temp[2] += "new Array(";
					}
					for (var c = 0; c <= XDS.temp[1][1][d].length - 1; c++){
						if (Math.round(XDS.temp[1][1][d][c] * 1) == XDS.temp[1][1][d][c] && isNaN(XDS.temp[1][1][d][c])){
							if (c >= XDS.temp[1][1][d].length - 1){
								XDS.temp[2] += XDS.temp[1][1][d][c];
							}else{
								XDS.temp[2] += XDS.temp[1][1][d][c] + ",";
							}
						}else{
							if (c >= XDS.temp[1][1][d].length - 1){
								XDS.temp[2] += "'" + XDS.temp[1][1][d][c] + "'";
							}else{
								XDS.temp[2] += "'" + XDS.temp[1][1][d][c] + "',";
							}
						}
					}
					if (XDS.temp[1][1][d].length != 1){
						if (d >= XDS.temp[1][1].length - 1){
							XDS.temp[2] += ")";
						}else{
							XDS.temp[2] += "),";
						}
					}else{
						if (d >= XDS.temp[1][1].length - 1){
							XDS.temp[2] += "";
						}else{
							XDS.temp[2] += ",";
						}
					}
				}
				XDS.temp[2] += ");"
			}
		}
		eval(XDS.temp[2]);
	}
};


//Threads
var Threads = {
	active: [],
	inactive: [],
	add:function(data){
		Threads.active.push(data);
	},
	read:function(){
		if (Threads.active[0]){
			Threads.inactive.push(Threads.active[0]);
			return Threads.active.shift();
		}
	},
	purge:function(){
		Threads.active = [];
		Threads.inactive = [];
	},
	status:function(){
		return [Threads.active.length, Threads.inactive.length];
	}
};


//Network Communication
var XCIP = {
	uname: "",
	timer: 0,
	queue:[],
	data: [],
	ini:function(it){
		XCIP.uname = XN.getName('user');
		if (it == 1){
			XCIP.purge();
		}
		XWS.launch('ipmsg.bat');
		XCIP.queue[2] = new Array();
		XCIP.data[0] = XCIP.uname;
		XCIP.data[1] = 'localhost';
		XCIP.data[2] = document.title;
		//setTimeout("XCIP.Connect(2,'localhost')",1000); //remove line its for testing
	},
	connect:function(it,it2){
		XCIP.data[3] = XS.file('ip.txt', 'open');
		if (!it){
			XM.alert({title:'Connection - IP Address/Computer Name', body:'<br><center>' + XCIP.data[3] + '- ' + XCIP.data[0] + '<br><br><input type="textarea" id="xcipmsgbox" style="border:1 solid white;background-Color:black;color:white;"> <input type="button" value="Connect" style="color:white;background-Color:black;border:1 solid white;height:20;" onclick="XCIP.Connect(1)"></center>'});
			xcipmsgbox.focus();
		}else if (it == 1){
			if (xcipmsgbox.value){
				XCIP.data[1] = xcipmsgbox.value;
			}
			document.title = XCIP.data[2] + ' >> ' + XCIP.data[0] + '@' + XCIP.data[3] + ' >> ' + XCIP.data[1];
			XCIP.timer = setInterval("XCIP.In()", 1000);
			try{
				App.pingServer();
			}catch(e){
				alert('App.pingServer() in XCIP does not exist. This is the function called immediatly after a ip address is entered');
			}
		}else if (it == 2){
			XCIP.data[1] = it2;
			document.title = XCIP.data[2] + ' >> ' + XCIP.data[0] + '@' + XCIP.data[3] + ' >> ' + XCIP.data[1];
			XCIP.timer = setInterval("XCIP.msgIn()", 1000);
		}
	},
	disconnect:function(){
		clearInterval(XCIP.timer);
	},
	purge:function(){
		XS.file('C:\\Users\\' + XCIP.uname + '\\Documents\\ipmsg.log', 'delete');
	},
	clean:function(){
		//XS.file('ip.txt','delete');
		XWS.launch('cleanup.bat');
		window.close();
	},
	msgOut:function(it, it2){
		if (it && it2){
			XWS.launch('ipmsg.exe /MSG /LOG ' + it + ' ' + it2);
		}
	},
	msgIn:function(){
		XCIP.queue[0] = [];
		XCIP.queue[1] = [];
		XCIP.queue[0] = XS.file('C:\\Users\\' + XCIP.uname + '\\Documents\\ipmsg.log', 'open');
		if (XCIP.queue[0]){
			if (XCIP.queue[0] != XCIP.queue[2]){
				XCIP.queue[2] = XCIP.queue[0];
				XCIP.queue[0] = XCIP.queue[0].split('=====================================');
				for (var i = 0; i <= XCIP.queue[0].length - 1; i++){
					XCIP.queue[0][i] = XCIP.queue[0][i].split('-------------------------------------');
				}
				for (var i = 0; i <= XCIP.queue[0].length - 1; i++){
					XCIP.queue[0][i][0] = XCIP.queue[0][i][0].split('(')[1];
				}
				for (var i = 1; i <= XCIP.queue[0].length - 1; i++){
					XCIP.queue[0][i][0] = XCIP.queue[0][i][0].split('/')[0];
				}
				XCIP.queue[1] = new Array();
				for (var i = 0; i <= XCIP.queue[0].length - 2; i++){
					XCIP.queue[1][i]    = new Array();
					XCIP.queue[1][i][0] = XCIP.queue[0][i + 1][0];
					XCIP.queue[1][i][1] = XCIP.queue[0][i + 1][1].split('\r\n')[1];
				}
				XCIP.queue[2] = XCIP.queue[1].copy();
			}
		}
	}
};

                         
var CAPICOM_STORE_OPEN_READ_ONLY = 0;
var CAPICOM_CURRENT_USER_STORE = 2;
var CAPICOM_CERTIFICATE_FIND_SHA1_HASH = 0;
var CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY = 6;
var CAPICOM_CERTIFICATE_FIND_TIME_VALID = 9;
var CAPICOM_CERTIFICATE_FIND_KEY_USAGE = 12;
var CAPICOM_DIGITAL_SIGNATURE_KEY_USAGE = 0x00000080;
var CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME = 0;
var CAPICOM_INFO_SUBJECT_SIMPLE_NAME = 0;
var CAPICOM_E_CANCELLED = -2138568446;
var CERT_KEY_SPEC_PROP_ID = 6;                           
var CAPICOM_ENCRYPTION_ALGORITHM_RC2 = 0;
var CAPICOM_ENCRYPTION_ALGORITHM_RC4 = 1;
var CAPICOM_ENCRYPTION_ALGORITHM_DES = 2;
var CAPICOM_ENCRYPTION_ALGORITHM_3DES = 3;
var CAPICOM_ENCRYPTION_ALGORITHM_AES = 4;
var CAPICOM_ENCRYPTION_KEY_LENGTH_MAXIMUM = 0;
var CAPICOM_ENCRYPTION_KEY_LENGTH_40_BITS = 1;
var CAPICOM_ENCRYPTION_KEY_LENGTH_56_BITS = 2;
var CAPICOM_ENCRYPTION_KEY_LENGTH_128_BITS = 3; 
var CAPICOM_ENCRYPTION_KEY_LENGTH_192_BITS = 4; 
var CAPICOM_ENCRYPTION_KEY_LENGTH_256_BITS = 5; 
var CAPICOM_SECRET_PASSWORD = 0;
var CAPICOM_ENCODE_BASE64 = 0;
var CAPICOM_ENCODE_BINARY = 1;
var CAPICOM_ENCODE_ANY = -1;
var CAPI_ERROR = 0;

var XCap = {
	encrypt:function(idata, ipass, imode){
		var temp = 0;
		var EncryptedData = new ActiveXObject("CAPICOM.EncryptedData");
		EncryptedData.Algorithm.KeyLength = 0;
		EncryptedData.Algorithm.Name = imode;
		if (!imode){
			EncryptedData.Algorithm.Name = 4;
		}
		EncryptedData.SetSecret(ipass, CAPICOM_SECRET_PASSWORD);
		EncryptedData.Content = idata;
		try{
			temp = EncryptedData.Encrypt(CAPICOM_ENCODE_BASE64);
			EncryptedData = null;
			return temp;
		}catch (e){
			alert(e.description);
			return false;
		}
	},
	decrypt:function(idata, ipass, imode){
		var temp = 0;
		var EncryptedData = new ActiveXObject("CAPICOM.EncryptedData");
		EncryptedData.SetSecret(ipass, CAPICOM_SECRET_PASSWORD);
		try{
			EncryptedData.Decrypt(idata);
			temp = EncryptedData.Content;
			EncryptedData = null;
			return temp;
		}catch (e){
			CAPI_ERROR = 1;
			if (e.description == 'Bad Data.\r\n'){
				alert('Invalid Credentials')
				Auth.genKey();
			}else{
				alert(e.description);
				return false;
			}
		}
	},
	chooseCert:function(){
		try{
			var MyStore = new ActiveXObject("CAPICOM.Store");
			MyStore.Open(CAPICOM_CURRENT_USER_STORE, "My", CAPICOM_STORE_OPEN_READ_ONLY);
			var FilteredCertificates = MyStore.Certificates.Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, strUserCertificateThumbprint);
			var Signer = new ActiveXObject("CAPICOM.Signer");
			Signer.Certificate = FilteredCertificates.Item(1);
			return Signer;
			MyStore = null;
			FilteredCertificates = null;
		}catch (e){
			if (e.number != CAPICOM_E_CANCELLED){
				return new ActiveXObject("CAPICOM.Signer");
			}else{
				CAPI_ERROR = 1;
			}
		}
	},
	useCard:function(ihash){
		try{
			var SignedData = new ActiveXObject("CAPICOM.SignedData");
			SignedData.Content = ihash;
			var mdata = SignedData.Sign(XCap.chooseCert(), true, CAPICOM_ENCODE_BASE64);
			return mdata.slice(mdata.length-256, mdata.length);
		}catch (e){
			CAPI_ERROR = 1;
			alert(e.description);
			return false;
		}
	},
	thumbPrint:function(){
		try{
			var MyStore = new ActiveXObject("CAPICOM.Store");
			MyStore.Open(CAPICOM_CURRENT_USER_STORE, "My", CAPICOM_STORE_OPEN_READ_ONLY);
			return MyStore.Certificates(3).thumbprint; //1-3
		}catch (e){
			CAPI_ERROR = 1;
			alert(e.description);
			return false;
		}
	},
	example:function(){
		var temp = XCap.encrypt('test', XCap.useCard(prompt('Secret Phrase', ' ')), 4);
		alert(XCap.decrypt(temp, XCap.useCard(prompt('Secret Phrase', ' ')), 4));
	}
};

var Auth = {
	file: '',
	key: 0,
	data: 0,
	compiled: 0,
	me:function(title){
		document.title = title;
		Auth.file = document.title + '_key';
		Auth.key = XS.file(XWS.env("%appdata%\\") + Auth.file, 'open');
		Auth.compiled = XCap.decrypt(xdocon.value, Auth.key, 4);
		document.write(Auth.compiled);
		xdocon.parentNode.removeChild(xdocon);
		Auth.key = null;
	},
	setup:function(result){
		Auth.file = document.title + '_key';
		Auth.key = XS.file(Auth.file, 'open');
		if (!Auth.key){
			Auth.key = prompt('Enter Key data', '');
			if (!Auth.key){
				Auth.key = "Invalid Key";
				Auth.file += 'invalid';		
			}else{
				XS.file(Auth.file + 'invalid', 'delete');
			}
			XS.file(Auth.file, 'create', Auth.key);
		}
		Auth.data = document.getElementsByTagName('html')[0].outerHTML;
		Auth.data = Auth.data.replace('<SCRIPT>Auth.setup()</SCRIPT>', '');
		Auth.compiled = XCap.encrypt(Auth.data, Auth.key, 4);
		var inject = '<script src="gaia.js"><' + '/' + 'script><textarea id="xdocon" style="display:none;">';
		inject += '\r\n' + Auth.compiled + '<' + '/' + 'textarea><script>Auth.me("' + document.title + '")<' + '/' + 'script>';
		XS.file('xcap_secure.hta', 'create', inject);
	},
	genKey:function(result){
		if (!result){
			document.body.background = "xres/bg.png";
			XM.prompt({
				password: true,
				title: 'Enter key data',
				defaultText: '-install',
				screen: true,
				callback: function(result){
					Auth.genKey(result);
				}
			});
		}else{
			Auth.file = document.title + '_key';
			Auth.key = result || 'Invalid Key';
			if (Auth.key == "-install"){
				Auth.key = XS.file(Auth.file, 'open');
			}
			if (result != XM.nullResponse){
				XS.file(Auth.file, 'create', 'Key Erased (:');
				XS.file(Auth.file, 'delete');
				XS.file(XWS.env("%appdata%\\") + Auth.file, 'create', Auth.key);
			}
			window.close();
		}
	}
};