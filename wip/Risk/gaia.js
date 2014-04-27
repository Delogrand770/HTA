/*
Created by Gavin Delphia 2007 - 2011
Not compatible with previous versions
*/

var xarc = 0; //Used to test if the application is still in a archive

// Array Prototypes //
[].indexOf || (Array.prototype.indexOf = function(v,n){
	n = (n==null)?0:n; var m = this.length;
	for(i=n;i<m;i++)
	if(this[i] == v)
	return i;
	return -1;
});

if(typeof Array.prototype.copy==='undefined'){
	Array.prototype.copy = function(){
		var a = [], i = this.length;
		while(i--){
			a[i] = typeof this[i].copy!=='undefined' ? this[i].copy() : this[i];
		}
		return a;
	};
}

Array.prototype.shuffle = function(b){
	var i = this.length, j, t;
	while(i){
		j = Math.floor((i--)*Math.random());
		t = b && typeof this[i].shuffle!=='undefined' ? this[i].shuffle() : this[i];
		this[i] = this[j];
		this[j] = t;
	}
	return this;
};

Array.prototype.unique = function(b){
	var a = [], i, l = this.length;
	for(i=0;i<l;i++){
		if(a.indexOf(this[i],0,b)<0){
			a.push(this[i]);
		}
	}
	return a;
};

Array.prototype.remove = function(b){
	this.splice(b,1);
	return this;
};

//CONSOLE//
var XL = {
	xlonsym:'<>', //new line symbol
	xlondata:'',  //All log data
	xlonon:0,     //Is system enabled
	Ini:function(){
		document.body.attachEvent('ondblclick',XL.Toggle);
		document.body.innerHTML += '<span id="xlonspan"></span>';
		XI.New('xlonspan','xlonxi','1:1','400:600',0,199);
		XL.xlonon = 1;
		XL.Log('Console v1.0\r\n\tAPP Name: '+document.title);
		XL.Update();
	},
	En:function(){
		return (XL.xlonon == 1)?true:false;
	},
	Log:function(it){
		if (XL.En()){
			XL.xlondata += '\r\n'+XL.xlonsym+it;
			if (xlonxi.style.display == 'block'){
				XL.Update(1)
			}
		}
	},
	Export:function(){
		XS.File('xlon.txt','create',XL.xlondata);
		XL.Log('Log exported to xlon.txt');
	},
	Toggle:function(){
		if (xlonxi.style.display == 'block'){
			XI.Hide('xlonxi');
		}else{
			XL.Update();
			XI.Show('xlonxi');
			XU.CenterElement('xlonxi','b');
			setTimeout("xlconin.focus()",100);
		}
	},
	Update:function(it){
		it = it || 0;
		if (XL.En()){
			XI.Fill('xlonxi','Console','<textarea style="background-Color:transparent;border:1 solid transparent;color:white;height:87%;width:100%;font-size:11px;scroll:auto;" readonly id="xlconout">'+XL.xlondata+'</textarea><input type="textarea" style="background-Color:transparent;color:white;border:1 solid silver;width:100%;" onkeypress="if (event.keyCode == 13){XL.Debug(this.value);this.value=\'\';}" id="xlconin">',it);
			xlconout.scrollTop = xlconout.scrollHeight;
		}
	},
	Debug:function(it){
		var itype   = '';
		var ilength = 0;
		var tmp     = it.split(' ');
		if (tmp[0] == '-export'){
			XL.Export();
		}else if (tmp[0] == '-get'){
			try{
				ilength = window[tmp[1]].length;
				if (XU.IsArray(window[tmp[1]])){
					itype = 'ARRAY';
					XL.Log('var '+tmp[1]+'\r\n\tTYPE   = '+itype+'\r\n\tLENGTH = '+ilength+'\r\n\tDATA   = '+window[tmp[1]]);
				}else if (Math.round(window[tmp[1]]*1) == window[tmp[1]]){
					itype = 'INTEGER';
					XL.Log('var '+tmp[1]+'\r\n\tTYPE   = '+itype+'\r\n\tDATA   = '+window[tmp[1]]);
				}else{
					
					if (!ilength){
						itype = 'FUNCTION';
						XL.Log('var '+tmp[1]+'\r\n\tTYPE   = '+itype+'\r\n\tDATA   = '+window[tmp[1]]);
					}else{
						itype = 'STRING';
						XL.Log('var '+tmp[1]+'\r\n\tTYPE   = '+itype+'\r\n\tLENGTH = '+ilength+'\r\n\tDATA   = '+window[tmp[1]]);
					}
				}				
			}catch(e){
				XL.Log('var '+tmp[1]+'\r\n\tTYPE   = UNDEFINED');	
			}
		}else if (tmp[0] == '-cls'){
			XL.xlondata = '';
			XL.Update();
		}else if (tmp[0] == '-set'){
			try{
				window[tmp[1]] = eval(prompt('var '+tmp[1]+'=\nUse quotes when assigning strings',''));
				XL.Debug('-get '+tmp[1]);
			}catch(e){
				XL.Log('CONSOLE ERROR: Use quotes when assigning strings');
			}
		}else if (tmp[0] == '-help'){
			XL.Log('\r\n-set [var] (Sets the data of a variable)\r\n-get [var] (Retrieves the variable information)\r\n-cls (Clears the console)\r\n-export (Saves the console data to xlon.txt)\r\n-help (Displays help information)\r\n-dim [height,width] (Sets the console height and width)\r\n-source (Outputs the source to xlsrc.txt including dynamic content)\r\n-sym [symbol] (changes the new line symbol)\r\n-update (Updates the console window)');
		}else if (tmp[0] == '-dim'){
			try{
				xlonxi.style.height = tmp[1].split(',')[0];
				xlonxi.style.width  = tmp[1].split(',')[1];
				XL.Log('Console dimensions\r\n\tHeight = '+xlonxi.style.height+'\r\n\tWidth  = '+xlonxi.style.width);
			}catch(e){
				XL.Log('CONSOLE ERROR: Invalid height and width');
			}
		}else if (tmp[0] == '-source'){
			XS.File('xlsrc.txt','create',document.getElementsByTagName('html')[0].outerHTML);
			XL.Log('Source exported to xlsrc.txt');
		}else if (tmp[0] == '-sym'){
			if (tmp[1]){
				XL.xlonsym = tmp[1];
				XL.Log('Symbol changed');
			}else{
				XL.Log('CONSOLE ERROR: No symbol entered');
			}
		}else if (tmp[0] == '-update'){
			XL.Log('Console window updated');
		}else{
			XL.Log('Invalid command. Type -help for the complete list');
		}
		setTimeout("xlconin.focus()",100);
	}
};


// File System //
var XS = {
	temp:new Array(),
	xmlhttp:new ActiveXObject("Microsoft.XMLHttp"),
	stream:new ActiveXObject("ADODB.Stream"),
	fso:new ActiveXObject("Scripting.FileSystemObject"),
	net:new ActiveXObject("WScript.Network"),
	shell:new ActiveXObject("WScript.Shell"),
	File:function(it,iact,idat){
		//XL.Log('XS.File('+it+','+iact+',data)');
		if (XS.fso.FileExists(it)){
			if (iact == 'exist'){
				return true;
			}
			else if (iact == 'open'){
				XS.temp[0] = XS.fso.GetFile(it).OpenAsTextStream(1,0);
				XS.temp[1] = XS.temp[0].ReadAll();
				XS.temp[0].close();
				return XS.temp[1];
			}
			else if (iact == 'writeline'){
				XS.temp[0] = XS.fso.OpenTextFile(it,8,1,-2);
				XS.temp[0].writeline(idat);
				XS.temp[0].Close();
			}
			else if (iact == 'create'){
				XS.temp[0] = XS.fso.createTextFile(it);
				XS.temp[0].write(idat); 
				XS.temp[0].close();
			}
			else if (iact == 'delete'){
				XS.fso.DeleteFile(it); 
			}
			else if (iact == 'size'){
				return XS.fso.GetFile(it).Size;
			}
			else if (iact == 'basename'){
				return XS.fso.GetBaseName(it);
			}
			else if (iact == 'extension'){
				return XS.fso.GetExtensionName(it);
			}
			else if (iact == 'name'){
				return XS.fso.GetFileName(it);
			}
			else if (iact == 'move' && XS.Folder(idat,'exist')){
				XS.fso.MoveFile(it,idat);		
			}
			else if (iact == 'copy' && XS.Folder(idat,'exist')){
				XS.fso.CopyFile(it,idat);	
			}
			return false;
		}else if (iact == 'create'){
			XS.temp[0] = XS.fso.createTextFile(it);
			XS.temp[0].write(idat); 
			XS.temp[0].close();
		}else if (iact == 'download'){
			XS.xmlhttp.Open("GET",it,false);
			XS.xmlhttp.Send();
			XS.stream.open();
			XS.stream.type = 1;
			XS.stream.write(XS.xmlhttp.responseBody);
			XS.stream.position = 0;
			if (XS.fso.fileExists(idat)){
				XS.fso.deleteFile(idat);
			}
			XS.stream.saveToFile(idat);
			XS.stream.close();
			XS.fso = XS.stream = XS.xmlhttp = null;
			return idat;
		}else{
			return false;
		}
	},
	Folder:function(it,iact,idat){
		//XL.Log('XS.File('+it+','+iact+',data)');
		if (XS.fso.FolderExists(it)){
			if (iact == 'exist'){
				return true;
			}
			else if (iact == 'getfiles'){
				XS.temp[0] = XS.fso.GetFolder(it);
				XS.temp[1] = new Array();
				XS.temp[2] = -1;
				for(XS.temp[3]=new Enumerator(XS.temp[0].Files);!XS.temp[3].atEnd();XS.temp[3].moveNext()){
					XS.temp[2]++;
					XS.temp[1][XS.temp[2]] = XS.temp[3].item();
				}
				return XS.temp[1];
			}
			else if (iact == 'delete'){
				XS.fso.DeleteFolder(it); 
			}
			else if (iact == 'move' && XS.Folder(idat,'exist')){
				XS.fso.MoveFolder(it,idat);		
			}
			else if (iact == 'copy' && XS.Folder(idat,'exist')){
				XS.fso.CopyFolder(it,idat);	
			}
			else if (iact == 'search'){
				var xscan = xscan.splice(0,0);
				XS.temp[0]    = (idat.lastIndexOf(".")>-1)? idat.slice(0,idat.lastIndexOf(".")):(idat.length>0)? idat.toLowerCase():"*";
				XS.temp[1]   = (idat.lastIndexOf(".")>-1)? idat.slice(idat.lastIndexOf(".")+1).toLowerCase():"*"; 
				if(it.length>0 && XS.fso.FolderExists(it)){
					XS.temp[2] = new Enumerator(XS.fso.GetFolder(it).Files);
					for(i=0;!XS.temp[2].atEnd();XS.temp[2].moveNext()){
						if(XS.temp[0] == "*" ||  XS.temp[2].item().name.slice(0,XS.temp[2].item().name.lastIndexOf(".")).toLowerCase().indexOf(XS.temp[0])>-1){
							if(XS.temp[1] == "*" || XS.temp[2].item().name.slice(XS.temp[2].item().name.lastIndexOf(".")+1).toLowerCase().indexOf(XS.temp[1])>-1){
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
		else if (iact == 'create'){
			XS.fso.createFolder(it);
			return it;		
		}
		else{
			return false;
		}
	},
	CurrentPath:function(){
		return XS.fso.GetFolder(".").Path;
	}
};


// Network Functions //
var XN = {
	Name:function(it){
		XL.Log('XN.Name('+it+')');
		if (it == 'computer'){
			return XS.net.ComputerName;
		}
		else if (it == 'user'){
			return XS.net.UserName;
		}
		else if (it == 'domain'){
			return XS.net.DomainName;
		}
		else if (it == 'mac'){
			var objWMIService = GetObject("winmgmts:\\\\.\\root\\cimv2");
			var e = new Enumerator(objWMIService.ExecQuery("Select * from Win32_NetworkAdapter","WQL",48));
			for (;!e.atEnd();e.moveNext()){	
				objItem = e.item();
				if (objItem.MACAddress!=null){
					return objItem.MACAddress;
					break;
				}
			}
		}
	}
};


// Shell Functions //
var XWS = {
	Launch:function(it){
		XL.Log('XWS.Launch('+it+')');
		XS.shell.Run(it,0);
	},
	Reg:function(it,iact,idata){
		XL.Log('XWS.Reg('+it+','+iact+','+idata+');');
		if (iact == 'read'){
			return XS.shell.RegRead(it);
		}
		else if (iact == 'delete'){
			return XS.shell.RegDelete(it);
		}
		else if (iact == 'write'){
			XS.shell.RegWrite(it,idata);
			XWS.Reg(it,'read');
		}
	},
	SendKey:function(it){
		XL.Log('XWS.SendKey('+it+');');
		XS.shell.SendKeys(it);
	}
};

// Utility Functions //
var XU = {
	util_date:new Array(new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"),new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec")),
	CenterElement:function(el,m,xoff,yoff){
		xoff = xoff || 0;
		yoff = yoff || 0;
		if (m == 'v' || m == 'b'){
			XU.El(el).style.top = Math.round(yoff+(parseInt(document.body.offsetHeight)/2) - (XU.El(el).offsetHeight/2))+yoff;
		}
		if (m == 'h' || m == 'b'){
			XU.El(el).style.left = Math.round(xoff+(parseInt(document.body.offsetWidth)/2) - (XU.El(el).offsetWidth/2));
		}
	},
	DFR:function(el,d){
		XU.El(el).style.left = Math.round(parseInt(document.body.offsetWidth) - (XU.El(el).offsetWidth+d));
	},
	DFB:function(el,d){
		XU.El(el).style.top = Math.round(parseInt(document.body.offsetHeight) - (XU.El(el).offsetHeight+d));
	},
	ResizeWindow:function(h,w,f,c){
		if (f == 1){
			h = parseInt(screen.height);
			w = parseInt(screen.width);
		}
		if (c == 1){
			self.moveTo(parseInt(screen.width)/2-(w/2),parseInt(screen.height)/2-(h/2));
		}
		try{
			window.resizeTo(w,h);
		}catch(e){
			XU.ResizeWindow(h,w,f,c);
		}
	},
	MoveWindow:function(x,y){
		if (x == "c"){
			x = parseInt(screen.width)/2-(document.body.offsetWidth/2);
		}
		if (y == "c"){
			y = parseInt(screen.height)/2-(document.body.offsetHeight/2);
		}
		self.moveTo(x,y);
	},
	ErrorHandler:function(m){
		XL.Log('XU.ErrorHandler('+m+') Error Handler enabled');
		if (m == 'log'){
			window.onerror = function(msg,url,l){
				XL.Log('APP ERROR: '+msg+'\r\n\tLINE: '+l);
				return true;
			}
		}
		if (m == 'file'){
			window.onerror = function(msg,url,l){
				XS.File('error_report.txt','create','error_report = new Array('+l+',"'+msg+'");');
				alert('Error: '+msg+'\nLine: '+l);
				window.opener = null;
				window.close();
			}
		}
		if (m == 'close'){
			window.onerror = function(msg,url,l){
				window.opener = null;
				window.close();
			}
		}
	},
	Date:function(it){
		if (it==1){
			return new Date().getDate()+" "+XU.util_date[1][new Date().getMonth()]+" "+new Date().getFullYear();
		}else{
			return "("+XU.util_date[0][new Date().getDay()]+") "+new Date().getDate()+" "+XU.util_date[1][new Date().getMonth()]+" "+new Date().getFullYear();
		}
	},
	Time:function(imode,itemp,itemp2){
		itemp  = new Date().getMinutes();
		itemp2 = new Date().getHours();
		if (itemp<=9){
			itemp = "0"+itemp;
		}
		if (itemp2<=9){
			itemp2 = "0"+itemp2;
		}
		if (imode==1){
			if (itemp2>=13){
				itemp2 -= 12;
				itemp += ' PM';
			}else{
				itemp += ' AM';
			}
			return itemp2+':'+itemp;
		}else{
			return itemp2+''+itemp;
		}
	},
	MilTimeDiff:function(t1,t2){
		var temp2 = new Array(t1%100,t2%100);
		temp2[2]  = (t1 - temp2[0])/100;
		temp2[3]  = (t2 - temp2[1])/100;
		temp2[4]  = temp2[3] - temp2[2];
		temp2[5]  = temp2[1] - temp2[0];
		if (temp2[5] < 0){
			temp2[5] += 60;
			temp2[4] -= 1;
		}
		return Math.round(temp2[5] + (temp2[4]*60));
	},
	Roll:function(){
		//onmouseover="MenuSystem.Roll()" onmouseout="MenuSystem.Roll()" ityp="res.block.2.2a.png" 			 						//location.basename.outadd.overadd.extension
		var temp1 = event.srcElement;
		var temp2 = temp1.ityp.split('.');
		if (event.type == "mouseover"){
			temp1.style.backgroundImage = 'url("'+temp2[0]+'/'+temp2[1]+temp2[3]+'.'+temp2[4]+'")';
		}else if (event.type == "mouseout"){
			temp1.style.backgroundImage = 'url("'+temp2[0]+'/'+temp2[1]+temp2[2]+'.'+temp2[4]+'")';
		}
	},
	RollBgColor:function(it){
		event.srcElement.style.backgroundColor = it;
	},
	RollColor:function(it){
		event.srcElement.style.color = it;
	},
	IsArray:function(it){
		return (it.constructor.toString().indexOf('Array') == -1)?false:true;
	},
	DrawSpace:function(it){
		var temp = '';
		for (xi=0;xi<=it-1;xi++){
			temp += '&nbsp;';
		}
		return temp;
	},
	El:function(it){
		return document.getElementById(it);
	},
	CreateShortcut:function(it,it2,ico,des,scut){ //scut is not a param
		if (!XS.File(XS.shell.SpecialFolders('Desktop') + '\\' + it + '.lnk','exist')){
			scut                  = XS.shell.CreateShortcut(XS.shell.SpecialFolders('Desktop') + '\\' + it + '.lnk');
			scut.TargetPath       = XS.shell.CurrentDirectory + '\\' + it2;
			scut.WindowStyle      = 1;
			scut.IconLocation     = XS.shell.CurrentDirectory + '\\' + ico;
			scut.Description      = des;
			scut.WorkingDirectory = XS.CurrentPath();
			scut.Save();
		}
	},
	Class:function(it,it2){
		XU.El(it).className = it2;
	},
	Scroll:function(it){
		XU.El(it).scrollTop = XU.El(it).scrollHeight;
	}
};

var XM = {
  trueButton:"Accept",
  falseButton:"Cancel",
  hoverColor:"#0099ff",
  defaultColor:"silver",
  defaultSpace:30,
  help:function(){
    var message = XM.confirm({
      title:'Title', 
      body:'Message Data', 
      screen:false, 
      top:100, 
      left:'centered', 
      callback:function(result){alert(result)}});
    XM.get('body',message).innerHTML = 'new body';
    XM.get('title',message).innerHTML = 'new title';
    var b = XM.alert({title:'Scores',body:'<br>Score1: 100<br>Score2: 200<br>Score3: 50',top:1,left:1,width:170,callback:function(result){alert(result)}});
    var a = XM.static({title:'test',body:'test'}); //can't have a callback
    alert(message+','+a+','+b); //alerts the seed number for the message so you can manipulate it later
  },
  alert:function(params){
    XM.private.universal(params);
    XM.get('buttons', XM.private.seed).innerHTML = XM.private.button(true);
    return XM.private.seed;
  },
  static:function(params){
    XM.private.universal(params);
    XM.get('buttons', XM.private.seed).innerHTML = "";
    return XM.private.seed;
  },
  confirm:function(params){
    XM.private.universal(params);
    XM.get('buttons', XM.private.seed).innerHTML = XM.private.button(true) + XM.private.space(XM.defaultSpace) + XM.private.button(false);
    return XM.private.seed;
  },
  get:function(field, seed){
    return document.getElementById('xm_' + field + seed);
  },
  destroy:function(seed){
    var ele = document.getElementById('xm_window' + seed);
    ele.parentNode.removeChild(ele);
  },
  screenCover:function(state){
    xm_screen.style.display = (state) ? "block" : "none";
  },
  private:{
    seed:-1,
    iniVar:false,
    ini:function(){
      try{
        var ele = document.getElementById('xm_container');
        ele.parentNode.removeChild(ele);
      }catch(e){}
        document.body.innerHTML += '<div id="xm_screen" style="background-color:#000;cursor:default;filter:alpha(opacity = 20);opacity:0.2;position:absolute;z-index:19998;left:0px;top:0px;width:100%;height:100%;border:none;zoom:1;display:none;"></div>';
        XM.private.iniVar = true;
    },
    space:function(amt){
      var temp = "";
      for (var i = 0; i < amt; i++) {
        temp += "&nbsp;";
      }
      return temp;
    },
    universal:function(params){
      XM.private.draw();
      XM.screenCover(params.screen);
      XM.get('title', XM.private.seed).innerHTML = params.title || "";
      XM.get('body', XM.private.seed).innerHTML = params.body || "";
      XM.get('window', XM.private.seed).style.display = 'block';
      XM.private.positions(params);
      XM.private.sizes(params);

      XM.get('window', XM.private.seed).onmouseover = function(){
        var source = event.srcElement;
        if (source.seed){
          source.style.color = XM.hoverColor;
        }
      }

      XM.get('window', XM.private.seed).onmouseout = function(){
        var source = event.srcElement;
        if (source.seed){
          source.style.color = XM.defaultColor;
        }
      }

      XM.get('window', XM.private.seed).onclick = function(){
        var source = event.srcElement;
        if (source.seed){
          XM.private.callback(source.result, params, source.seed);
        }
      }
    },
    sizes:function(params){
      if (params.width){
        XM.get('window',XM.private.seed).style.width = params.width;
      }
      if (params.height){
        XM.get('window',XM.private.seed).style.height = params.height;
      }
    },
    positions:function(params){
      var source = document.getElementById('xm_window' + XM.private.seed);
      params.top = params.top || 'centered';
      params.left = params.left || 'centered';
      if (params.top == 'centered'){
        params.top = Math.round((parseInt(document.body.offsetHeight)/2) - (source.offsetHeight/2));
      }
      if (params.left == 'centered'){
        params.left = Math.round((parseInt(document.body.offsetWidth)/2) - (source.offsetWidth/2));
      }
      XM.get('window', XM.private.seed).style.top = params.top;
      XM.get('window', XM.private.seed).style.left = params.left;
    },
    callback:function(result, params, seed){
      var usercall = params.callback;
      if (usercall){
        usercall(result);
      }
      XM.screenCover(false);
      XM.destroy(seed);
    },
    button:function(type){
      var btnText = (type == true) ? XM.trueButton : XM.falseButton;
      return '<span result='+type+' style="cursor:hand;" seed='+XM.private.seed+' id="btn'+type+XM.private.seed+'">'+btnText+'</span>';
    },
    draw:function(){
      XM.private.seed++;
      if (!XM.private.iniVar){
        XM.private.ini();
      }
      var container = document.createElement("DIV");
      container.innerHTML = '<table style="position:absolute;top:10;left:10;width:300;display:none;z-index:19999;" cellpadding=0 cellspacing=0 id="xm_window'+XM.private.seed+'"><tr><td style="overflow:hidden;background:url(\'xres/WindowTopLeft.png\') repeat scroll 0% 0% transparent;width:15px;height:32px;">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowTopCenter.png\') repeat scroll 0% 0% transparent;color:'+XM.defaultColor+';" id="xm_title'+XM.private.seed+'">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowTopRight.png\') repeat scroll 0% 0% transparent;width:15px;">&nbsp;</td></tr><tr><td style="overflow:hidden;background:url(\'xres/WindowCenterLeft.png\') repeat scroll 0% 0% transparent;">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowCenter.png\') repeat scroll 0% 0% transparent;text-align:left;color:'+XM.defaultColor+';overflow-x:auto;word-wrap:break-word;" id="xm_body'+XM.private.seed+'">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowCenterRight.png\') repeat scroll 0% 0% transparent;">&nbsp;</td></tr><tr><td style="overflow:hidden;background:url(\'xres/WindowBottomLeft.png\') repeat scroll 0% 0% transparent;height:39px;">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowBottomCenter.png\') repeat scroll 0% 0% transparent;height:39px;color:'+XM.defaultColor+';text-align:center;" id="xm_buttons'+XM.private.seed+'">&nbsp;</td><td style="overflow:hidden;background:url(\'xres/WindowBottomRight.png\') repeat scroll 0% 0% transparent;height:39px;">&nbsp;</td></tr></table>';
      document.body.appendChild(container);
    }     
  }
};

// Save Data //
var XDS = {
	save_vars:new Array(),
	encrypt:0,
	temp:new Array(3),
	Ini:function(enc){
		XL.Log('XDS.Ini() Save Data system enabled');
		XDS.encrypt = enc;
		if (XDS.save_vars.length == 0){
			XM.Alert('XDataSystem - Error','You have not defined the array <font color="red">XDS.save_vars</font>');
		}
	},
	Save:function(it){
		XL.Log('XDS.Save('+it+')');
		XDS.temp[0] = "";
		XDS.temp[1] = 0;
		for (i=0;i<=XDS.save_vars.length-1;i++){
			if (XU.IsArray(window[XDS.save_vars[i]])){
				for (a=0;a<=window[XDS.save_vars[i]].length-1;a++){
					if (XU.IsArray(window[XDS.save_vars[i]][a])){
						XDS.temp[1] = 1;
					}
				}
				if (XDS.temp[1]==0){
					XDS.temp[0] += "!${a}"+XDS.save_vars[i]+"@#"+window[XDS.save_vars[i]].join('!~');
				}else{
					XDS.temp[0] += "!${m}"+XDS.save_vars[i]+"@#";
					for (a=0;a<=window[XDS.save_vars[i]].length-1;a++){
						if (XU.IsArray(window[XDS.save_vars[i]][a])){
							XDS.temp[0] += window[XDS.save_vars[i]][a].join('!~')+"$@";
						}else{
							XDS.temp[0] += window[XDS.save_vars[i]][a]+"$@";
						}
					}
				}
			}else{
				XDS.temp[0] += "!${s}"+XDS.save_vars[i]+"@#"+window[XDS.save_vars[i]];
			}
		}
		if (XDS.encrypt == 1){
			XS.File(it,'create',XDS.ToBinary(XDS.temp[0]));
		}else{
			XS.File(it,'create',XDS.temp[0]);
		}
	},
	Load:function(it){
		XL.Log('XDS.Load('+it+')');
		XDS.temp[1] = XDS.temp[2] = '';
		if (XDS.encrypt == 1){
			XDS.temp[0] = XD.ToAscii(XS.File(it,'open')).split('!$');
		}else{
			XDS.temp[0] = XS.File(it,'open').split('!$');
		}
		for (a=1;a<=XDS.temp[0].length-1;a++){
			XDS.temp[0][a] = XDS.temp[0][a].split('}');
		}
		for (a=1;a<=XDS.temp[0].length-1;a++){
			if (XDS.temp[0][a][0] == '{s'){
				XDS.temp[1] = XDS.temp[0][a][1].split('@#');
				XDS.temp[2] += ""+XDS.temp[1][0]+"=";
				if (Math.round(XDS.temp[1][1]*1)==XDS.temp[1][1] && isNaN(XDS.temp[1][1])){
					XDS.temp[2] += XDS.temp[1][1]+";";
				}else{
					XDS.temp[2] += "'"+XDS.temp[1][1]+"';";
				}
			}
			else if (XDS.temp[0][a][0] == '{a'){ 
				XDS.temp[1]    = XDS.temp[0][a][1].split('@#');
				XDS.temp[2]   += ""+XDS.temp[1][0]+"=new Array(";
				XDS.temp[1][1] = XDS.temp[1][1].split('!~');
				for (c=0;c<=XDS.temp[1][1].length-1;c++){
					if (Math.round(XDS.temp[1][1][c]*1)==XDS.temp[1][1][c] && isNaN(XDS.temp[1][1][c])){
						if (c>=XDS.temp[1][1].length-1){
							XDS.temp[2] += XDS.temp[1][1][c];
						}else{
							XDS.temp[2] += XDS.temp[1][1][c]+",";
						}
					}else{
						if (c>=XDS.temp[1][1].length-1){
							XDS.temp[2] += "'"+XDS.temp[1][1][c]+"'";
						}else{
							XDS.temp[2] += "'"+XDS.temp[1][1][c]+"',";
						}
					}
				}
				XDS.temp[2] += ");"
			}
			else if (XDS.temp[0][a][0] == '{m'){
				XDS.temp[1]    = XDS.temp[0][a][1].split('@#');
				XDS.temp[2]   += ""+XDS.temp[1][0]+"=new Array(";
				XDS.temp[1][1] = XDS.temp[1][1].split('$@');
				XDS.temp[1][1].pop();
				for (d=0;d<=XDS.temp[1][1].length-1;d++){
					XDS.temp[1][1][d] = XDS.temp[1][1][d].split('!~');
					if (XDS.temp[1][1][d].length!=1){
						XDS.temp[2] += "new Array(";
					}
					for (c=0;c<=XDS.temp[1][1][d].length-1;c++){
						if (Math.round(XDS.temp[1][1][d][c]*1)==XDS.temp[1][1][d][c] && isNaN(XDS.temp[1][1][d][c])){
							if (c>=XDS.temp[1][1][d].length-1){
								XDS.temp[2] += XDS.temp[1][1][d][c];
							}else{
								XDS.temp[2] += XDS.temp[1][1][d][c]+",";
							}
						}else{
							if (c>=XDS.temp[1][1][d].length-1){
								XDS.temp[2] += "'"+XDS.temp[1][1][d][c]+"'";
							}else{
								XDS.temp[2] += "'"+XDS.temp[1][1][d][c]+"',";
							}
						}
					}
					if (XDS.temp[1][1][d].length!=1){
						if (d>=XDS.temp[1][1].length-1){
							XDS.temp[2] += ")";
						}else{
							XDS.temp[2] += "),";
						}
					}else{
						if (d>=XDS.temp[1][1].length-1){
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
	active:[],
	inactive:[],
	Add:function(it){
		Threads.active.push(it);
	},
	Read:function(){
		if (Threads.active[0]){
			Threads.inactive.push(Threads.active[0]);
			return Threads.active.shift();
		}
	},
	Purge:function(){
		Threads.active   = [];
		Threads.inactive = [];
	},
	Status:function(){
		return [Threads.active.length,Threads.inactive.length];
	}
};


//Network Communication
var XCIP={
	uname:XN.Name('user'),
	timer:0,
	queue:new Array(),
	data:new Array(),
	Ini:function(it){
		XL.Log('XCIP.Ini() New Multi-connect enabled');
		if (it==1){
			XCIP.Purge();
		}
		XWS.Launch('ipmsg.bat');
		XCIP.queue[2] = new Array();
		XCIP.data[0]  = XCIP.uname;
		XCIP.data[1]  = 'localhost';
		XCIP.data[2]  = document.title;
		//setTimeout("XCIP.Connect(2,'localhost')",1000); //remove line its for testing
	},
	Connect:function(it,it2){
		XCIP.data[3] = XS.File('ip.txt','open');
		if (!it){
			XM.Alert('Connection - IP Address/Computer Name','<br><center>'+XCIP.data[3]+'- '+XCIP.data[0]+'<br><br><input type="textarea" id="xcipmsgbox" style="border:1 solid white;background-Color:black;color:white;"> <input type="button" value="Connect" style="color:white;background-Color:black;border:1 solid white;height:20;" onclick="XCIP.Connect(1)"></center>',1);
			xcipmsgbox.focus();
		}else if (it == 1){
			XM.Close();
			if (xcipmsgbox.value){
				XCIP.data[1] = xcipmsgbox.value;
			}
			document.title = XCIP.data[2] + ' >> '+XCIP.data[0]+'@'+XCIP.data[3]+' >> ' +XCIP.data[1];
			XCIP.timer     = setInterval("XCIP.In()",1000);
			try{
				App.PingServer();
			}catch(e){
				alert('App.PingServer() in XCIP does not exist. This is the function called immediatly after a ip address is entered');
			}
		}else if (it == 2){
			XCIP.data[1]   = it2;
			document.title = XCIP.data[2] + ' >> '+XCIP.data[0]+'@'+XCIP.data[3]+' >> ' +XCIP.data[1];
			XCIP.timer     = setInterval("XCIP.In()",1000);
		}
	},
	Disconnect:function(){
		clearInterval(XCIP.timer);
	},
	Purge:function(){
		XS.File('C:\\Users\\'+XCIP.uname+'\\Documents\\ipmsg.log','delete');
	},
	Clean:function(){
		//XS.File('ip.txt','delete');
		XWS.Launch('cleanup.bat');
		window.close();
	},
	Out:function(it,it2){
		if (it && it2){
			XWS.Launch('ipmsg.exe /MSG /LOG '+it+' '+it2);
		}
	},
	In:function(){
		XCIP.queue[0] = [];
		XCIP.queue[1] = [];
		XCIP.queue[0] = XS.File('C:\\Users\\'+XCIP.uname+'\\Documents\\ipmsg.log','open');
		if (XCIP.queue[0]){
			if (XCIP.queue[0]!=XCIP.queue[2]){
				XCIP.queue[2] = XCIP.queue[0];
				XCIP.queue[0] = XCIP.queue[0].split('=====================================');
				for (i=0;i<=XCIP.queue[0].length-1;i++){
					XCIP.queue[0][i] = XCIP.queue[0][i].split('-------------------------------------');
				}
				for (i=0;i<=XCIP.queue[0].length-1;i++){
					XCIP.queue[0][i][0] = XCIP.queue[0][i][0].split('(')[1];
				}
				for (i=1;i<=XCIP.queue[0].length-1;i++){
					XCIP.queue[0][i][0] = XCIP.queue[0][i][0].split('/')[0];
				}
				XCIP.queue[1] = new Array();
				for (i=0;i<=XCIP.queue[0].length-2;i++){
					XCIP.queue[1][i]    = new Array();
					XCIP.queue[1][i][0] = XCIP.queue[0][i+1][0];
					XCIP.queue[1][i][1] = XCIP.queue[0][i+1][1].split('\r\n')[1];
				}
				XCIP.queue[2] = XCIP.queue[1].copy();
			}
		}
	}
};

                         
var CAPICOM_STORE_OPEN_READ_ONLY                 = 0;
var CAPICOM_CURRENT_USER_STORE                   = 2;
var CAPICOM_CERTIFICATE_FIND_SHA1_HASH           = 0;
var CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY   = 6;
var CAPICOM_CERTIFICATE_FIND_TIME_VALID          = 9;
var CAPICOM_CERTIFICATE_FIND_KEY_USAGE           = 12;
var CAPICOM_DIGITAL_SIGNATURE_KEY_USAGE          = 0x00000080;
var CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME = 0;
var CAPICOM_INFO_SUBJECT_SIMPLE_NAME             = 0;
var CAPICOM_E_CANCELLED                          = -2138568446;
var CERT_KEY_SPEC_PROP_ID                        = 6;                           
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
var CAPI_ERROR         = 0;
var XCap = {
	Encrypt:function(idata,ipass,imode){
		XL.Log('XCap.Encrypt() called');
		var temp                          = 0;
		var EncryptedData 		  = new ActiveXObject("CAPICOM.EncryptedData");
		EncryptedData.Algorithm.KeyLength = 0; //0-5
		EncryptedData.Algorithm.Name      = imode; //0-4
		if (!imode){
			EncryptedData.Algorithm.Name = 4; 
		}
		EncryptedData.SetSecret(ipass,CAPICOM_SECRET_PASSWORD);
		EncryptedData.Content             = idata;
		try{
			temp          = EncryptedData.Encrypt(CAPICOM_ENCODE_BASE64);
			EncryptedData = null;
			return temp;
		}catch (e){
			alert(e.description);
			return false;
		}
	},
	Decrypt:function(idata,ipass,imode){
		XL.Log('XCap.Decrypt() called');
		var temp                          = 0;
		var EncryptedData 		  = new ActiveXObject("CAPICOM.EncryptedData");
		//EncryptedData.Algorithm.KeyLength = 0; //0-5
		//EncryptedData.Algorithm.Name      = imode; //0-4
		//if (!imode){
		//	EncryptedData.Algorithm.Name = 4; 
		//}
		EncryptedData.SetSecret(ipass,CAPICOM_SECRET_PASSWORD);
		try{
			EncryptedData.Decrypt(idata);
			temp          = EncryptedData.Content;
			EncryptedData = null;
			return temp;
		}catch (e){
			CAPI_ERROR = 1;
			if (e.description == 'Bad Data.\r\n'){
				alert('Invalid Credentials')
				window.close();
			}else{
				alert(e.description);
				return false;
			}
		}
	},
	ChooseCert:function(){
		try{
			var MyStore              = new ActiveXObject("CAPICOM.Store");
			MyStore.Open(CAPICOM_CURRENT_USER_STORE, "My", CAPICOM_STORE_OPEN_READ_ONLY);
			var FilteredCertificates = MyStore.Certificates.Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, strUserCertificateThumbprint);
			var Signer               = new ActiveXObject("CAPICOM.Signer");
			Signer.Certificate       = FilteredCertificates.Item(1);
			return Signer;
			MyStore                  = null;
			FilteredCertificates     = null;
		}catch (e){
			if (e.number != CAPICOM_E_CANCELLED){
				return new ActiveXObject("CAPICOM.Signer");
			}else{
				CAPI_ERROR = 1;
			}
		}
	},
	UseCard:function(ihash){
		XL.Log('XCap.UseCard() called');
		try{
			var SignedData     = new ActiveXObject("CAPICOM.SignedData");
			SignedData.Content = ihash;
			var mdata          = SignedData.Sign(XCap.ChooseCert(), true, CAPICOM_ENCODE_BASE64);
			return mdata.slice(mdata.length-256,mdata.length);
		}catch (e){
			CAPI_ERROR = 1;
			alert(e.description);
			return false;
		}
	},
	ThumbPrint:function(){
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
	Example:function(){
		var temp = XCap.Encrypt('test',XCap.UseCard(prompt('Secret Phrase',' ')),4);
		alert(XCap.Decrypt(temp,XCap.UseCard(prompt('Secret Phrase',' ')),4));
	}
};