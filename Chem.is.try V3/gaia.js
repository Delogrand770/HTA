/*
Created by Gavin Delphia 2007 - 2011
Version 25112011_0103
Not compatible with previous versions
*/

var xarc = 0; //Used to test if the application is still in a archive

Object.prototype.properties = function(){
	var data = "";
	for (var prop in this){
		if (prop != "properties"){
			data += "<b>" + prop + "</b>: " + this[prop] + "<br>";
		}
	}
	return data;
};

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

var XM2 = {
	savedSettings: new Array(),
	uidCounter: 0,
	overlayDrawn: false,
	ui: {
		//Best to leave consistient across the UI
		overlayColor: "white",
		btnColor: "white",
		btnHoverColor: "#0099ff",
		titleTextColor: "white",
		bodyTextColor: "white",
		trueBtnText: "Accept",
		falseBtnText: "Cancel",
		btnSpace: 50,
		alertOverlay: true,
		staticOverlay: false,
		promptOverlay: true,
		confirmOverlay: true,
		alertCentered: true,
		staticCentered: false,
		promptCentered: true,
		confirmCentered: true,
		staticWidth: null
	},
	defaults: {
		//Best to change in the creation of the object
		height: 100,
		width: 300,
		top: 0,
		left: 0,
		title: "<center>title</center>",
		body: "body",
		mode: "alert",
		promptTextType: "textarea", //password
		promptText: "",
		showAlertButton: true,
		showAfterDraw: true,
		callback: null
	},
	callback:function(uid, result){
		var usercall = XM2.savedSettings[uid].callback;
		if (result != false && XM2.savedSettings[uid].mode == "prompt"){
			result = document.getElementById("xm_field" + uid).value;
		}

		document.getElementById('xm_overlay').style.display = "none";

		if (usercall){
			usercall(result);
		}

		//Remove the object's html and object reference
		var toRemove = document.getElementById('xm_window' + uid);
		toRemove.parentNode.removeChild(toRemove);
	},
	addButton:function(uid, type, btnText){
		return '<span style="cursor:hand;" id="btn' + type + uid + '" onclick="XM2.callback(' + uid + ',' + type + ')" onmouseover="this.style.color=\'' + XM2.ui.btnHoverColor + '\'" onmouseout="this.style.color=\'' + XM2.ui.btnColor + '\'">' + btnText + '</span>';
	},
	addTextfield:function(uid, type, fieldText){
		return '<center><input type="' + type + '" id="xm_field' + uid + '" value="' + fieldText + '" style="border:1 solid white;background-Color:transparent;color:white;width:100%;"></center>';
	},
	alert:function(settings){
		//Set default settings
		settings                 = settings || {};
		settings.mode            = "alert";
		settings.showAlertButton = settings.showAlertButton || XM2.defaults.showAlertButton;				
		settings.centered        = settings.centered || XM2.ui.alertCentered; //Allows for overide of default
		settings.overlay         = settings.overlay || XM2.ui.alertOverlay; //Allows for overide of default

		//Create the XM2 object
		var obj = new XM2.object(settings);

		//Add default button
		var btnTrue = XM2.addButton(obj.uid, true, XM2.ui.trueBtnText);
		document.getElementById('xm_buttons' + obj.uid).innerHTML = "<center>" + btnTrue + "</center>";

		return obj;
	},
	confirm:function(settings){
		//Set default settings
		settings          = settings || {};
		settings.mode     = "confirm";
		settings.centered = settings.centered || XM2.ui.confirmCentered; //Allows for overide of default
		settings.overlay  = settings.overlay || XM2.ui.confirmOverlay; //Allows for overide of default

		//Create the XM2 object
		var obj = new XM2.object(settings);

		//Create the buttons
		var btnTrue  = XM2.addButton(obj.uid, true, XM2.ui.trueBtnText);
		var btnFalse = XM2.addButton(obj.uid, false, XM2.ui.falseBtnText);
		document.getElementById('xm_buttons' + obj.uid).innerHTML = btnTrue + '<span style="width:' + XM2.ui.btnSpace + ';"></span>' + btnFalse;				

		return obj;
	},
	prompt: function(settings){
		//Set default settings
		settings                   = settings || {};
		settings.mode              = "prompt";
		settings.centered          = settings.centered || XM2.ui.promptCentered; //Allows for overide of default
		settings.overlay           = settings.overlay || XM2.ui.promptOverlay; //Allows for overide of default
		//Creates prompt textarea
		settings.promptTextType    = settings.promptTextType || XM2.defaults.promptTextType; //Allows for overide of default
		settings.promptDefaultText = settings.promptDefaultText || XM2.defaults.promptDefaultText; //Allows for overide of default

		//Create the XM2 object
		var obj = new XM2.object(settings);

		//Create the buttons		
		var btnTrue  = XM2.addButton(obj.uid, true, XM2.ui.trueBtnText);
		var btnFalse = XM2.addButton(obj.uid, false, XM2.ui.falseBtnText);
		document.getElementById('xm_buttons' + obj.uid).innerHTML = btnTrue + '<span style="width:' + XM2.ui.btnSpace + ';"></span>' + btnFalse;

		//Create the textarea
		obj.setBody(XM2.addTextfield(obj.uid, settings.promptTextType, settings.promptText));

		//Focus input box if its in prompt mode
		document.getElementById("xm_field" + obj.uid).focus();

		return obj;
	},
	static:function(settings){
		//Set default settings
		settings          = settings || {};
		settings.mode     = "static";
		settings.width    = settings.width || XM2.ui.staticWidth;
		settings.overlay  = settings.overlay || XM2.ui.staticOverlay; //Allows for overide of default
		settings.centered = settings.centered || XM2.ui.staticCentered; //Allows for overide of default	

		//Create the XM2 object
		var obj = new XM2.object(settings);

		return obj;
	},
	object:function(settings){
		//Assign a uid and increase the global counter
		this.uid = XM2.uidCounter;
		XM2.uidCounter++;

		//Save the settings to the object and in the global array
		this.settings               = settings || {};
		XM2.savedSettings[this.uid] = this.settings || {};
		this.drawn                  = false;

		this.applySettings = function(){
			//Get the dom reference to the xm window
			var xmWin = document.getElementById('xm_window' + this.uid);

			//Apply the overlay state
			document.getElementById("xm_overlay").style.display = this.settings.overlay ? "block" : "none";

			//Apply body and title
			this.setBody(this.settings.body);
			this.setTitle(this.settings.title);

			//Apply width and height
			xmWin.style.width  = this.settings.width;
			xmWin.style.height = this.settings.height;


			//IMPORTANT: The width and height settings must be applied before the top and left position if the centering is to work
			//If settings.centered is true then the settings.top and settings.left are set to "centered"
			//This will override any settings.top and settings.left that are already set
			this.settings.top  = this.settings.centered ? "centered" : this.settings.top;
			this.settings.left = this.settings.centered ? "centered" : this.settings.left;

			//Apply top and left positioning also handles the special property "centered"
			if (this.settings.top == "centered"){ XU.centerElement('xm_window' + this.uid, 'v') } else { xmWin.style.top = this.settings.top; }
			if (this.settings.left == "centered"){ XU.centerElement('xm_window' + this.uid, 'h') } else { xmWin.style.left = this.settings.left; }
		}

		this.show = function(){
			document.getElementById("xm_window" + this.uid).style.display = "block";
		}

		this.hide = function(){
			document.getElementById("xm_window" + this.uid).style.display = "none";
		}

		this.destroy = function(){
			var toRemove = document.getElementById('xm_window' + this.uid);
			toRemove.parentNode.removeChild(toRemove);
		}

		this.showProperties = function(){
			var data = "";
			for (var prop in this.settings){
				data += prop + ": " + this.settings[prop] + "\n";
			}
			return data;
		}

		this.checkOverrides = function(){
			for (var prop in XM2.defaults){
				//alert("prop: " + prop + "\nSettings: " + this.settings[prop] + "\nDefaults: " + XM2.defaults[prop]);
				if (this.settings.mode != "static" || prop != "width"){ //Allows fot the static mode width to be null so it can auto size
					this.settings[prop] = this.settings[prop] == null ? XM2.defaults[prop] : this.settings[prop];
				}
			}	
		}

		this.setBody = function(data){
			document.getElementById("xm_body" + this.uid).innerHTML = '<br>' + data;
		}

		this.setTitle = function(data){
			document.getElementById("xm_title" + this.uid).innerHTML = data;
		}

		this.setSize = function(newSizes){
			this.settings.width  = newSizes.width || this.settings.width;
			this.settings.height = newSizes.height || this.settings.height;
			this.applySettings();
		}

		this.setPosision = function(newPositions){
			this.settings.top  = newPositions.top || this.settings.top;
			this.settings.left = newPositions.left || this.settings.left;
			this.applySettings();
		}

		this.center = function(){
			this.settings.top  = "centered";
			this.settings.left = "centered";
			this.applySettings();
		}

		this.draw = function(){
			//Draw the overlay to the document
			if (!XM2.overlayDrawn){
				XU.intoBody('<div id="xm_overlay" style="background-color:' + XM2.ui.overlayColor + ';cursor:default;filter:alpha(opacity = 20);opacity:0.2;position:absolute;z-index:19998;left:0;top:0;width:100%;height:100%;border:none;zoom:1;display:none;"></div>');
				XM2.overlayDrawn = true;
			}

			//Draw the xm window to the document
			if (!this.drawn){
				this.drawn = true;
				zindex = (this.settings.mode == "static") ? 19997 : 19999;
				var container = document.createElement("SPAN");
				container.innerHTML = '<table style="position:absolute;top:0;left:0;display:none;z-index:' + zindex + ';" cellpadding=0 cellspacing=0 id="xm_window' + this.uid + '"><tr><td style="overflow:hidden;background:url(\'xres/WindowTopLeft.png\') repeat scroll 0% 0% transparent;width:15px;height:32px;">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowTopCenter.png\') repeat scroll 0% 0% transparent;color:' + XM2.ui.titleTextColor + ';" id="xm_title' + this.uid + '">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowTopRight.png\') repeat scroll 0% 0% transparent;width:15px;">&nbsp;</td></tr><tr><td style="overflow:hidden;background:url(\'xres/WindowCenterLeft.png\') repeat scroll 0% 0% transparent;">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowCenter.png\') repeat scroll 0% 0% transparent;text-align:left;color:' + XM2.ui.bodyTextColor + ';overflow-x:auto;word-wrap:break-word;" id="xm_body' + this.uid + '">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowCenterRight.png\') repeat scroll 0% 0% transparent;">&nbsp;</td></tr><tr><td style="overflow:hidden;background:url(\'xres/WindowBottomLeft.png\') repeat scroll 0% 0% transparent;height:39px;">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowBottomCenter.png\') repeat scroll 0% 0% transparent;height:39px;text-align:center;" id="xm_buttons' + this.uid + '">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowBottomRight.png\') repeat scroll 0% 0% transparent;height:39px;">&nbsp;</td></tr></table>';
				document.body.appendChild(container);
				if (this.settings.showAfterDraw){this.show();}
			} else {
				alert('you are calling draw after the object has been drawn.\nUID: ' + this.uid)
			}
		}

		//Run default methods
		this.checkOverrides();
		this.draw();
		this.applySettings();
	}
};

var XM = {
	paramArray: new Array(),
	trueButton: "Accept",
	falseButton: "Cancel",
	nullResponse: "xcnull", //value returned when the falseButton is clicked for a prompt
	hoverColor: "#0099ff",
	defaultColor: "white",
	defaultSpace: 30, //Space between buttons on a confirm dialog
	screenColor: "white",
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
		params.alert = true;
		XM.private.universal(params);
		XM.get('buttons', XM.private.seed).innerHTML = XM.private.button(XM.private.seed, true);
		return XM.private.seed;
	},
	static:function(params){
		params.stat = true;
		XM.private.universal(params);
		XM.get('buttons', XM.private.seed).innerHTML = "";
		return XM.private.seed;
	},
	confirm:function(params){
		params.left = params.left || 'center';
		params.top = params.top || 'center';
		params.width = params.width || 300;
		params.confirm = true;
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
			XU.intoBody('<div id="xm_screen" style="background-color:'+XM.screenColor+';cursor:default;filter:alpha(opacity = 20);opacity:0.2;position:absolute;z-index:19998;left:0;top:0;width:100%;height:100%;border:none;zoom:1;display:none;"></div>');
			XM.private.iniVar = true;
		},
		universal:function(params){
			XM.private.draw(params);
			XM.paramArray[XM.private.seed] = params;
			XM.screenCover(params.screen);
			XM.get('title', XM.private.seed).innerHTML = (params.title) ? params.title : "";
			XM.get('body', XM.private.seed).innerHTML = (params.body) ? "<br>" + params.body : "";
			XM.get('window', XM.private.seed).style.display = 'block';
			XM.private.sizes(XM.private.seed, params);
			XM.private.positions(XM.private.seed, params);
			try{
				XM.get('window', XM.private.seed).addEventListener('mouseover', 
					function(){
						var source = event.target;
						if (source.getAttribute('seed') && !source.getAttribute('field')){
								source.style.color = XM.hoverColor;}
						}
					,false);
				XM.get('window', XM.private.seed).addEventListener('mouseout', function(){var source = event.target;if (source.getAttribute('seed') && !source.getAttribute('field')){source.style.color = XM.defaultColor;}}, false);
				XM.get('window', XM.private.seed).addEventListener('click', function(){var source = event.target;if (source.getAttribute('seed') && !source.getAttribute('field')){XM.private.callback(source.getAttribute('result'), XM.paramArray[source.getAttribute('seed')], source.getAttribute('seed'));}}, false);
			}catch(e){
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
				return true;
			}
			if (params.prompt){
				XM.get('window', XM.private.seed).addEventListener('keypress', function(){var source = event.target;if (source.getAttribute('field') && event.keyCode == 13){XM.private.callback(source.getAttribute('value'), XM.paramArray[source.getAttribute('seed')], source.getAttribute('seed'));}}, false);
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
		draw:function(params){
			XM.private.seed++;
			if (!XM.private.iniVar){
				XM.private.ini();
			}
			var container = document.createElement("SPAN");
			zindex = (params.stat) ? 19997 : 19999;
			container.innerHTML = '<table style="position:absolute;top:0;left:0;display:none;z-index:'+zindex+';" cellpadding=0 cellspacing=0 id="xm_window' + XM.private.seed + '"><tr><td style="overflow:hidden;background:url(\'xres/WindowTopLeft.png\') repeat scroll 0% 0% transparent;width:15px;height:32px;">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowTopCenter.png\') repeat scroll 0% 0% transparent;color:' + XM.defaultColor + ';" id="xm_title' + XM.private.seed + '">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowTopRight.png\') repeat scroll 0% 0% transparent;width:15px;">&nbsp;</td></tr><tr><td style="overflow:hidden;background:url(\'xres/WindowCenterLeft.png\') repeat scroll 0% 0% transparent;">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowCenter.png\') repeat scroll 0% 0% transparent;text-align:left;color:' + XM.defaultColor + ';overflow-x:auto;word-wrap:break-word;" id="xm_body' + XM.private.seed + '">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowCenterRight.png\') repeat scroll 0% 0% transparent;">&nbsp;</td></tr><tr><td style="overflow:hidden;background:url(\'xres/WindowBottomLeft.png\') repeat scroll 0% 0% transparent;height:39px;">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowBottomCenter.png\') repeat scroll 0% 0% transparent;height:39px;color:' + XM.defaultColor + ';text-align:center;" id="xm_buttons' + XM.private.seed + '">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowBottomRight.png\') repeat scroll 0% 0% transparent;height:39px;">&nbsp;</td></tr></table>';
			document.body.appendChild(container);
		}
	}
};