/**
	Created by C1C Gavin Delphia
	Documentation: None
**/

Array.prototype.fillMatrix = function(n, r, val){
	for (var i = 0; i < n; i++){
		this[i] = new Array(r);
		for (var j = 0; j < r; j++){
			this[i][j] = val;
		}
	}
	return this;
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
	paramArray: new Array(),
	trueButton: "Accept",
	falseButton: "Cancel",
	nullResponse: false, //value returned when the falseButton is clicked for a prompt
	hoverColor: "#0099ff",
	defaultColor: "white",
	defaultColor2: "#0099ff",
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
			bodySource: string (id)
				purpose: Specifices the element id to take the HTML from
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

		----CALLBACK HELP

		XM.prompt({
			title: 'test', 
			callback: function(response){alert(response.result + " | " + response.values + " | " + response.passed)}
		});

		XM.confirm({
			title: "CreateRoom", 
			screen: true, 
			passValues: {a:5, b:"fun", c:c}, 
			getValueOfElements: {"hName":null, "pass":null}, 
			body: 'hostName: <input type="textarea" class="input" id="hName"><br>password: <input type="textarea" class="input" id="pass"><br>', 
			callback: function(response){alert(response.result + " | " + response.values + " | " + response.passed)}
		});

			response.result: shows if accept or cancel btn was pressed or for XM.prompt shows the value of the textarea
			response.values: the resulting object of getValueOfElements
				response.values["hName"];
				response.values["pass"];
			response.passed: the resulting object of passValues

			getValueOfElements: {"hName":null, "pass":null}
				purpose: Will lookup the values of object and pass to call back function as an object.
			passValues: object of anything {id:id, name:name}
				purpose: Will pass the object to the callback function
	*/
	alert:function(params){
		params.left = params.left || 'center';
		params.top = params.top || 'center';
		params.width = params.width || 300;
		params.screen = params.screen || true;
		params.alert = true;
		XM.private.universal(params);
		XM.get('body', XM.private.seed).innerHTML += "<br><center>" + XM.private.button(XM.private.seed, true) + "</center>";
		return XM.private.seed;
	},
	static:function(params){
		params.stat = true;
		XM.private.universal(params);
		return XM.private.seed;
	},
	confirm:function(params){
		params.left = params.left || 'center';
		params.top = params.top || 'center';
		params.width = params.width || 300;
		params.confirm = true;
		XM.private.universal(params);
		XM.get('body', XM.private.seed).innerHTML += "<br><center>" + XM.private.button(XM.private.seed, true) + XU.drawRepeat('&nbsp;', XM.defaultSpace) + XM.private.button(XM.private.seed, false) + "</center>";
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
		XM.get('body', XM.private.seed).innerHTML += "<br><center>" + XM.private.button(XM.private.seed, true) + XU.drawRepeat('&nbsp;', XM.defaultSpace) + XM.private.button(XM.private.seed, XM.nullResponse) + "</center>";
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
		XM.get('body', seed).innerHTML = data;
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
			XU.intoBody('<div id="xm_screen" style="background-color:'+XM.screenColor+';cursor:default;filter:alpha(opacity = 20);opacity:0.5;position:absolute;z-index:19998;left:0;top:0;width:100%;height:100%;border:none;zoom:1;display:none;"></div>');
			XM.private.iniVar = true;
		},
		universal:function(params){
			XM.private.draw(params);
			XM.paramArray[XM.private.seed] = params;
			XM.screenCover(params.screen);
			XM.get('title', XM.private.seed).innerHTML = (params.title) ? params.title : "";
			XM.get('body', XM.private.seed).innerHTML = (params.body) ? params.body : (params.bodySource) ? XM.private.getBodyFromElement(params.bodySource) : "";
			XM.get('window', XM.private.seed).style.display = 'block';
			XM.private.sizes(XM.private.seed, params);
			XM.private.positions(XM.private.seed, params);
			XM.get('window', XM.private.seed).addEventListener('mouseover', function(){var source = event.target;if (source.getAttribute('seed') && !source.getAttribute('field')){source.style.color = XM.hoverColor;}}, false);
			XM.get('window', XM.private.seed).addEventListener('mouseout', function(){var source = event.target;if (source.getAttribute('seed') && !source.getAttribute('field')){source.style.color = XM.defaultColor;}}, false);
			XM.get('window', XM.private.seed).addEventListener('click', function(){var source = event.target;if (source.getAttribute('seed') && !source.getAttribute('field')){XM.private.callback(source.getAttribute('result'), XM.paramArray[source.getAttribute('seed')], source.getAttribute('seed'));}}, false);

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
		getBodyFromElement:function(data){
			try{
				var ele = document.getElementById(data);
				var content = ele.innerHTML;
				ele.innerHTML = ""; //necessary?
				ele.parentNode.removeChild(ele);
				return content;
			}catch(e){}
		},
		callback:function(result, params, seed){			
			var usercall = params.callback;
			response = {};
			result =  (params.prompt && result != XM.nullResponse) ? document.getElementById("field" + seed).value : result;
			response.result = result;
			if (usercall){

				if (params.getValueOfElements){
			    for (var key in params.getValueOfElements) {
			      if (params.getValueOfElements.hasOwnProperty(key)) {
         			params.getValueOfElements[key] = document.getElementById(key).value;
			      }
			    }
			    response.values = params.getValueOfElements;
				}

				if (params.passValues){
					response.passed = params.passValues;
				}

				usercall(response);
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
			//container.innerHTML = '<table style="position:absolute;top:0;left:0;display:none;z-index:'+zindex+';" cellpadding=0 cellspacing=0 id="xm_window' + XM.private.seed + '"><tr><td style="overflow:hidden;background:url(\'xres/WindowTopLeft.png\') repeat scroll 0% 0% transparent;width:15px;height:32px;">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowTopCenter.png\') repeat scroll 0% 0% transparent;color:' + XM.defaultColor + ';" id="xm_title' + XM.private.seed + '">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowTopRight.png\') repeat scroll 0% 0% transparent;width:15px;">&nbsp;</td></tr><tr><td style="overflow:hidden;background:url(\'xres/WindowCenterLeft.png\') repeat scroll 0% 0% transparent;">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowCenter.png\') repeat scroll 0% 0% transparent;text-align:left;color:' + XM.defaultColor + ';overflow-x:auto;word-wrap:break-word;" id="xm_body' + XM.private.seed + '">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowCenterRight.png\') repeat scroll 0% 0% transparent;">&nbsp;</td></tr><tr><td style="overflow:hidden;background:url(\'xres/WindowBottomLeft.png\') repeat scroll 0% 0% transparent;height:39px;">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowBottomCenter.png\') repeat scroll 0% 0% transparent;height:39px;color:' + XM.defaultColor + ';text-align:center;" id="xm_buttons' + XM.private.seed + '">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowBottomRight.png\') repeat scroll 0% 0% transparent;height:39px;">&nbsp;</td></tr></table>';

			container.innerHTML = '<table style="position:absolute;top:0;left:0;display:none;z-index:'+zindex+';background-color:rgba(0, 0, 0, 0.7);border:1px solid;border-color:rgba(255, 255, 255, 0.1);border-bottom-color:rgba(255, 255, 255, 0.2);border-right-color:rgba(255, 255, 255, 0.2);box-shadow:0 2px 5px rgba(0, 0, 0, 0.3);" cellspacing=0 id="xm_window' + XM.private.seed + '"><tr><td style="padding:0px 5px;overflow:hidden;height:30;background-Color:rgba(255, 255, 255, 0.1);color:' + XM.defaultColor2 + ';" id="xm_title' + XM.private.seed + '"></td></tr><tr><td style="padding:5px 10px;text-align:left;color:' + XM.defaultColor + ';overflow-x:auto;word-wrap:break-word;" id="xm_body' + XM.private.seed + '"></td></tr></table>';
			document.body.appendChild(container);
		}
	}
};