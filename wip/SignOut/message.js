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