var xdev = 1;


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


// File System //
var xshell  = new ActiveXObject("WScript.Shell");
var xnet    = new ActiveXObject("WScript.Network");
var xfso    = new ActiveXObject("Scripting.FileSystemObject");
var xstream = new ActiveXObject("ADODB.Stream");
var xmlHttp = new ActiveXObject("Microsoft.XMLHttp");
var xs_tmp  = new Array();
var xscan   = new Array();
var XS = {
	File:function(it,iact,idat){
		if (xfso.FileExists(it)){
			if (iact == 'exist'){
				return true;
			}
			else if (iact == 'open'){
				xs_tmp[0] = xfso.GetFile(it).OpenAsTextStream(1,0);
				xs_tmp[1] = xs_tmp[0].ReadAll();
				xs_tmp[0].close();
				return xs_tmp[1];
			}
			else if (iact == 'writeline'){
				xs_tmp[0] = xfso.OpenTextFile(it,8,1,-2);
				xs_tmp[0].writeline(idat);
				xs_tmp[0].Close();
			}
			else if (iact == 'create'){
				xs_tmp[0] = xfso.createTextFile(it);
				xs_tmp[0].write(idat); 
				xs_tmp[0].close();
			}
			else if (iact == 'delete'){
				xfso.DeleteFile(it); 
			}
			else if (iact == 'size'){
				return xfso.GetFile(it).Size;
			}
			else if (iact == 'basename'){
				return xfso.GetBaseName(it);
			}
			else if (iact == 'extension'){
				return xfso.GetExtensionName(it);
			}
			else if (iact == 'name'){
				return xfso.GetFileName(it);
			}
			else if (iact == 'move' && XS.Folder(idat,'exist')){
				xfso.MoveFile(it,idat);		
			}
			else if (iact == 'copy' && XS.Folder(idat,'exist')){
				xfso.CopyFile(it,idat);	
			}
			return false;
		}else if (iact == 'create'){
			xs_tmp[0] = xfso.createTextFile(it);
			xs_tmp[0].write(idat); 
			xs_tmp[0].close();
		}else if (iact == 'download'){
			xmlHttp.Open("GET",it,false);
			xmlHttp.Send();
			xstream.open();
			xstream.type = 1;
			xstream.write(xmlHttp.responseBody);
			xstream.position = 0;
			if (xfso.fileExists(idat)){
				xfso.deleteFile(idat);
			}
			xstream.saveToFile(idat);
			xstream.close();
			xfso = xstream = xmlHttp = null;
			return idat;
		}else{
			return false;
		}
	},
	Folder:function(it,iact,idat){
		if (xfso.FolderExists(it)){
			if (iact == 'exist'){
				return true;
			}
			else if (iact == 'getfiles'){
				xs_tmp[0] = xfso.GetFolder(it);
				xs_tmp[1] = new Array();
				xs_tmp[2] = -1;
				for(xs_tmp[3]=new Enumerator(xs_tmp[0].Files);!xs_tmp[3].atEnd();xs_tmp[3].moveNext()){
					xs_tmp[2]++;
					xs_tmp[1][xs_tmp[2]] = xs_tmp[3].item();
				}
				return xs_tmp[1];
			}
			else if (iact == 'delete'){
				xfso.DeleteFolder(it); 
			}
			else if (iact == 'move' && XS.Folder(idat,'exist')){
				xfso.MoveFolder(it,idat);		
			}
			else if (iact == 'copy' && XS.Folder(idat,'exist')){
				xfso.CopyFolder(it,idat);	
			}
			else if (iact == 'search'){
				xscan = xscan.splice(0,0);
				xs_tmp[0]    = (idat.lastIndexOf(".")>-1)? idat.slice(0,idat.lastIndexOf(".")):(idat.length>0)? idat.toLowerCase():"*";
				xs_tmp[1]   = (idat.lastIndexOf(".")>-1)? idat.slice(idat.lastIndexOf(".")+1).toLowerCase():"*"; 
				if(it.length>0 && xfso.FolderExists(it)){
					xs_tmp[2] = new Enumerator(xfso.GetFolder(it).Files);
					for(i=0;!xs_tmp[2].atEnd();xs_tmp[2].moveNext()){
						if(xs_tmp[0] == "*" ||  xs_tmp[2].item().name.slice(0,xs_tmp[2].item().name.lastIndexOf(".")).toLowerCase().indexOf(xs_tmp[0])>-1){
							if(xs_tmp[1] == "*" || xs_tmp[2].item().name.slice(xs_tmp[2].item().name.lastIndexOf(".")+1).toLowerCase().indexOf(xs_tmp[1])>-1){
								xscan[i] = xs_tmp[2].item().name;
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
			xfso.createFolder(it);
			return it;		
		}
		else{
			return false;
		}
	},
	CurrentPath:function(){
		return xfso.GetFolder(".").Path;
	}
};


// Network Functions //
var XN = {
	Name:function(it){
		if (it == 'computer'){
			return xnet.ComputerName;
		}
		else if (it == 'user'){
			return xnet.UserName;
		}
		else if (it == 'domain'){
			return xnet.DomainName;
		}
	}
};


// Shell Functions //
var XWS = {
	Launch:function(it){
		xshell.Run(it,0);
	},
	Reg:function(it,iact,idata){
		if (iact == 'read'){
			return xshell.RegRead(it);
		}
		else if (iact == 'delete'){
			//return xshell.RegDelete(it);
		}
		else if (iact == 'write'){
			xshell.RegWrite(it,idata);
			XWS.Reg(it,'read');
		}
	},
	SendKey:function(it){
		xshell.SendKeys(it);
	}
};


// Data Conversion //
var XD = {
	ToBinary:function(str,charsiz){
		for(i=0,r="",n=str.length;i<n;r+=XD.FrontPad(str.charCodeAt(i++).toString(2),charsiz || 8));
		return r;
	},
	ToAscii:function(bin,charsiz){
		for(i=0,cs=XD.Group(bin.split(""),charsiz || 8),n=cs.length;i<n;cs[i]=String.fromCharCode(parseInt(cs[i++].join(""),2)));
		return cs.join("");
	},
	FrontPad:function(s,len,chr){
		for(r=s.toString();r.length<len;r=(chr || "0")+r);
		return r;
	},
	Group:function(arr,len){
		for(i=0,r=[],n=arr.length;i<n;++i){
			if(i%len === 0)
				r.push([]);
				r[r.length-1].push(arr[i]);
		}
		return r;
	}
};


// Utility Functions //
var xel        = 0;
var xele_temp  = 0;
var xityp_temp = 0;
var xutil_date = new Array(new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"),new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"));
var custdir    = 'C:\\Users\\'+XN.Name('user')+'\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\';
var XU = {
	CenterElement:function(el,m,xoff,yoff){
		if (!xoff){
			xoff = 0;
		}
		if (!yoff){
			yoff = 0;
		}
		if (m == 'v' || m == 'b'){
			document.getElementById(el).style.top = Math.round(yoff+(parseInt(document.body.offsetHeight)/2) - (document.getElementById(el).offsetHeight/2))+yoff;
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
		if (m == 0){
			window.onerror = function(){return true;}
		}
		if (m == 1){
			window.onerror = function(msg,url,l){
				XS.File('error_report.txt','create','error_report = new Array('+l+',"'+msg+'");');
				alert('Error: '+msg+'\nLine: '+l);
				window.opener = null;
				window.close();
			}
		}
		if (m == -1){
			window.onerror = function(msg,url,l){
				window.opener = null;
				window.close();
			}
		}
		if (m == 2){
			window.onerror = function(){App.Reset();}
		}
	},
	Date:function(it){
		if (it==1){
			return new Date().getDate()+" "+xutil_date[1][new Date().getMonth()]+" "+new Date().getFullYear();
		}else{
			return "("+xutil_date[0][new Date().getDay()]+") "+new Date().getDate()+" "+xutil_date[1][new Date().getMonth()]+" "+new Date().getFullYear();
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
		temp2[2] = (t1 - temp2[0])/100;
		temp2[3] = (t2 - temp2[1])/100;
		temp2[4] = temp2[3] - temp2[2];
		temp2[5] = temp2[1] - temp2[0];
		if (temp2[5] < 0){
			temp2[5] += 60;
			temp2[4] -= 1;
		}
		return Math.round(temp2[5] + (temp2[4]*60));
	},
	Roll:function(){ 
		//onmouseover="MenuSystem.Roll()" onmouseout="MenuSystem.Roll()" ityp="res.block.2.2a.png" 			 					//location.basename.outadd.overadd.extension
		xele_temp  = event.srcElement;
		xityp_temp = xele_temp.ityp.split('.');
		if (event.type == "mouseover"){
			xele_temp.style.backgroundImage = 'url("'+xityp_temp[0]+'/'+xityp_temp[1]+xityp_temp[3]+'.'+xityp_temp[4]+'")';
		}else if (event.type == "mouseout"){
			xele_temp.style.backgroundImage = 'url("'+xityp_temp[0]+'/'+xityp_temp[1]+xityp_temp[2]+'.'+xityp_temp[4]+'")';
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
	},
	DrawSpace:function(it){
		for (xi=0;xi<=it-1;xi++){
			document.write('&nbsp;');
		}
	},
	El:function(it){
		xel = document.getElementById(it);
		return xel;
	},
	CreateShortcut:function(it,it2,ico,des,scut){ //scut is not a param
		if (!XS.File(custdir + '\\' + it + '.lnk','exist')){
			scut                  = xshell.CreateShortcut(custdir + '\\' + it + '.lnk');
			scut.TargetPath       = xshell.CurrentDirectory + '\\' + it2;
			scut.WindowStyle      = 1;
			scut.IconLocation     = xshell.CurrentDirectory + '\\' + ico;
			scut.Description      = des;
			scut.WorkingDirectory = XS.CurrentPath();
			scut.Save();
		}
	}
};


// Alerts //
var xmsgen = 0;
var XM = {
	Ini:function(color1,color2,color3){
		if (!color1){
			color1 = '#0099ff';
		}
		if (!color2){
			color2 = 'white';
		}
		if (!color3){
			color3 = 'black';
		}
		document.body.innerHTML+="<div id='xmsgscreen' style='height:105%;width:105%;position:absolute;top:-2;left:-2;display:none;filter:alpha(opacity=20);background-Color:"+color3+";z-index:110;'></div>";
		document.body.innerHTML+='<table style="position:absolute;top:-10;left:-10;z-index:111;display:none;" cellpadding=0 cellspacing=0 id="xmsg"><tr><td class="xmsg_t_l"></td><td class="xmsg_t_c"></td><td class="xmsg_t_r"></td></tr><tr><td class="xmsg_bg_l"></td><td class="xmsg_bg_c_t" id="xmsgtitle" style="color:'+color1+';"></td><td class="xmsg_bg_r"></tr><tr><td class="xmsg_bg_l"></td><td class="xmsg_bg_c_b" id="xmsgbody" style="color:'+color2+';overflow-x:auto;word-wrap:break-word;"></td><td class="xmsg_bg_r"></td></tr><tr id="xmsgok"><td class="xmsg_bg_l"></td><td class="xmsg_bg_c_c" onclick="XM.Close()" onmouseover="XU.RollColor(\''+color1+'\');" onmouseout="XU.RollColor(\''+color2+'\');" style="color:'+color2+';">Accept</td><td class="xmsg_bg_r"></tr><tr><td class="xmsg_b_l"></td><td class="xmsg_b_c"></td><td class="xmsg_b_r"></td></tr></table>';
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
		XM.Enabled();
		xmsgok.style.display = 'none'
		if (noclose!=1){
			xmsgok.style.display = 'block';
		}
		if (nolay!=1){
			XM.Overlay(1);
		}
		xmsgtitle.innerHTML   = ti;
		
		if (h!=0){
			xmsgbody.style.height = h;
		}
		xmsgbody.innerHTML   = msg+"<br><br>";
		xmsgbody.style.width = w;
		xmsg.style.display   = "block";
		XU.CenterElement('xmsg','b');
		xmsg.focus();
	},
	Close:function(){
		XM.Overlay(0);
		xmsg.style.display = "none";
	},
	Enabled:function(){
		if (xmsgen==0){
			XM.Ini();
		}
	}
};


// Info Boxes //
var xinfcanc = 0;
var XI = {
	New:function(iwhere,iid,ipos,isize,idisplay,izindex,itcolor,ibcolor){
		xinfcanc = 0;
		ix = parseInt(ipos.split(':')[0]);
		iy = parseInt(ipos.split(':')[1]);
		ih = parseInt(isize.split(':')[0]);
		iw = parseInt(isize.split(':')[1]);
		if (idisplay==0){
			idisplay = 'none';
		}else{
			idisplay = 'block';
		}
		if (!izindex){
			izindex = 100;
		}
		if (!itcolor){
			itcolor = '#0099ff';
		}
		if (!ibcolor){
			ibcolor = 'white';
		}
		if (!iy || !ix){
			xinfcanc = 1;
			XM.Alert('XInfo','You didnt specify <i>x:y [2]</i>');
		}
		if (!ih || !iw){
			xinfcanc = 1;
			XM.Alert('XInfo','You didnt specify <i>h:w [3]</i>');
		}
		if (!iwhere){
			xinfcanc = 1;
			XM.Alert('XInfo','You didnt specify <i>iwhere [0]</i>');
		}
		if (!iid){
			xinfcanc = 1;
			XM.Alert('XInfo','You didnt specify <i>iid [1]</i>');
		}
		if (xinfcanc == 0){
			document.getElementById(iwhere).innerHTML += '<table style="position:absolute;top:'+iy+';left:'+ix+';z-index:'+izindex+';display:'+idisplay+';height:'+ih+';width:'+iw+';" cellpadding=0 cellspacing=0 id="'+iid+'"><tr><td class="xmsg_t_l"></td><td class="xmsg_t_c"></td><td class="xmsg_t_r"></td></tr><tr><td class="xmsg_bg_l"></td><td class="xmsg_bg_c_t" style="color:'+itcolor+';" id="'+iid+'_title">Title</td><td class="xmsg_bg_r"></tr><tr><td class="xmsg_bg_l"></td><td class="xmsg_bg_c_b" style="color:'+ibcolor+';overflow-x:auto;"  id="'+iid+'_body">Body Content</td><td class="xmsg_bg_r"></td></tr><tr><td class="xmsg_b_l"></td><td class="xmsg_b_c"></td><td class="xmsg_b_r"></td></tr></table>';
		}
	},
	Fill:function(iid,it,it2,ishow){
		document.getElementById(iid+'_title').innerHTML = it;
		document.getElementById(iid+'_body').innerHTML  = it2;
		if (ishow == 1){
			XI.Show(iid);
		}
		if (ishow == 0){
			XI.Hide(iid);
		}
	},
	Hide:function(iid){
		document.getElementById(iid).style.display = 'none';
	},
	Show:function(iid){
		document.getElementById(iid).style.display = 'block';
	},
	ZIndex:function(iid,it){
		document.getElementById(iid).style.zIndex = it;
	},
	Position:function(iid,itx,ity){
		document.getElementById(iid).style.top  = ity;
		document.getElementById(iid).style.left = itx;
	},
	TColor:function(iid,icolor){
		document.getElementById(iid+'_title').style.color = icolor;
	},
	BColor:function(iid,icolor){
		document.getElementById(iid+'_body').style.color = icolor;
	},
	Title:function(iid,it){
		document.getElementById(iid+'_title').innerHTML = it;
	}
};


// Save Data //
var xsave_vars  = new Array();
var xall_vars   = new Array();
var xencrypt    = 0;
var xtemp       = new Array(3);
var xkey        = 0;
var XDS = {
	Ini:function(enc){
		xencrypt = enc;
		XM.Enabled();
		if (xsave_vars.length == 0 || xall_vars.length == 0){
			XM.Alert('XDataSystem - Error','You have not defined the arrays <font color="red">xsave_vars</font> and <font color="red">xall_vars</font>');
		}
	},
	Save:function(it){
		xtemp[0] = "";
		xtemp[1] = 0;
		for (i=0;i<=xsave_vars.length-1;i++){
			if (XU.IsArray(window[xsave_vars[i]])){
				for (a=0;a<=window[xsave_vars[i]].length-1;a++){
					if (XU.IsArray(window[xsave_vars[i]][a])){
						xtemp[1] = 1;
					}
				}
				if (xtemp[1]==0){
					xtemp[0] += "!${a}"+xsave_vars[i]+"@#"+window[xsave_vars[i]].join('!~');
				}else{
					xtemp[0] += "!${m}"+xsave_vars[i]+"@#";
					for (a=0;a<=window[xsave_vars[i]].length-1;a++){
						if (XU.IsArray(window[xsave_vars[i]][a])){
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
			XS.File(it,'create',XDS.ToBinary(xtemp[0]));
		}else{
			XS.File(it,'create',xtemp[0]);
		}
	},
	Load:function(it){
		xtemp[1] = xtemp[2] = '';
		if (xencrypt == 1){
			xtemp[0] = XD.ToAscii(XS.File(it,'open')).split('!$');
		}else{
			xtemp[0] = XS.File(it,'open').split('!$');
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
				xtemp[1]    = xtemp[0][a][1].split('@#');
				xtemp[2]   += ""+xtemp[1][0]+"=new Array(";
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
				xtemp[1]    = xtemp[0][a][1].split('@#');
				xtemp[2]   += ""+xtemp[1][0]+"=new Array(";
				xtemp[1][1] = xtemp[1][1].split('$@');
				xtemp[1][1].pop();
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
			if (XU.IsArray(xall_vars[i])){
				xtemp[2] += xall_vars[i] + " = new Array("+window[xall_vars[i]] + ");<br>";
			}else{
				xtemp[2] += xall_vars[i] + " = "+window[xall_vars[i]] + ";<br>";
			}
		}
		XM.Alert('XData System - Variable State',xtemp[2],0,300);
		alert(xtemp[2]);
	}
};


// Multiplayer Connection //
if (xdev == 1){var xusername = XN.Name('user')+Math.round(100*Math.random());}else{var xusername = XN.Name('user');}
var xconndir      = 0; //Shared directory
var xdatainact    = 0; //Function to execute when data comes in
var xdataoutact   = 0; //Function to execute when data is sent
var xmyrole       = 0; //If =1 then I am host
var xtimer        = 0; //Timer variable for creating connection
var xwait         = 0; //Timer variable for recieving data
var xreceived     = 0; //Raw data recieved is stored here
var xappid        = 0; //Application name
var xmaxplayers   = 0; //Maximum players allowed to connect
var xminplayers   = 0; //Minimum players needed to continue
var xgamevalid    = 0; //Function to execute when game has correct number of players
var xusersconn    = 0; //Transfer variable for xscan so it does not need to be run as often
var xgameready    = 0; //Function to execute when the app is ready
var xappstate     = 0; //Used to transfer app state. No mandatory. You must choose to use it.
var xmyself       = 0; //2p only use. My name.
var xoppo         = 0; //2p only use. Oppo name. Use to as itgt to send from host to person
var XC={
	Ini:function(it1,it2,it3,it4,it5,it6,it7,it8){
		if (it1){xconndir    = it1;}
		if (it2){xdatainact  = it2;}
		if (it3){xdataoutact = it3;}
		if (it4){xappid      = it4;}
		if (it5){xmaxplayers = it5;}
		if (it6){xminplayers = it6;}
		if (it7){xgamevalid  = it7;}
		if (it8){xgameready  = it8;}
		if (xconndir==0){
			XM.Alert('XConnect','No xconndir directory specified');
		}else if (xdatainact==0){
			XM.Alert('XConnect','No xdatainact function specified');
		}else if (xdataoutact==0){
			XM.Alert('XConnect','No xdataoutact function specified');
		}else if (xappid==0){
			XM.Alert('XConnect','No xappid specified');
		}else if (xmaxplayers==0){
			XM.Alert('XConnect','No xmaxplayers specified');
		}else if (xminplayers==0){
			XM.Alert('XConnect','No xmminplayers specified');
		}else if (xgamevalid==0){
			XM.Alert('XConnect','No xgamevalid function specified');
		}else if (xgameready==0){
			XM.Alert('XConnect','No xgameready function specified');
		}
	},
	Connect:function(){
		xmyrole = 0;
		if (!XS.File(xconndir+xappid+'-host.xcon','exist')){
			XS.File(xconndir+xappid+'-host.xcon','create',0);
			XS.File(xconndir+xappid+xusername+'-client.xcon','create',0);
			xmyrole = 'host';
			xtimer = setInterval("XC.GetOpponents()",2000);
		}else{
			XS.Folder(xconndir,'search','client.xcon');
			if (xscan.length<xmaxplayers){
				XS.File(xconndir+xappid+xusername+'-client.xcon','create',0);
				xmyrole = 'client';
				xtimer = setInterval("XC.GetOpponents()",2000);
			}else{
				clearInterval(xtimer);
				XM.Alert(xappid,'Game is full');
			}
		}
		if (xmyrole!=0){
			if (xdev == 1){
				document.title += ' - '+xmyrole;
			}
			XM.Alert(xappid,'Players connecting',0,0,1);
		}
	},
	GetOpponents:function(){
		XS.Folder(xconndir,'search','client.xcon');
		XM.Alert(xappid,'Players connecting<br><br>'+xscan.join('<br>').replace(new RegExp(xappid,"g"),"").replace(new RegExp("-client.xcon","g"),""),0,0,1);
		xusersconn = xscan.length;
		if (XC.Role()){
			if (xusersconn>=xminplayers){
				clearInterval(xtimer);
				XM.Close();
				XS.File(xconndir+xappid+'-gamevalid.xcon','create');
				eval(xgameready)();
			}
		}else{
			if (XS.File(xconndir+xappid+'-gamevalid.xcon','exist')){
				clearInterval(xtimer);
				XM.Close();
				eval(xgameready)();
			}
		}
	},
	Disconnect:function(){
		if (XC.Role()){
			XS.File(xconndir+xappid+'-host.xcon','delete');
			XS.File(xconndir+xappid+'-gamevalid.xcon','delete');
		}
		XS.File(xconndir+xappid+'-chat.xcon','delete');
		XS.File(xconndir+xappid+xusername+'-client.xcon','delete');
	},
	Role:function(){
		if (xmyrole == 'host'){
			return true;
		}else{
			return false;
		}
	},
	Send:function(it,oride,tgt,hride){
		if ((XC.Role() && !tgt && !hride) || oride==1){ //If host and no target or overide is 1, send to all
			XS.File(xconndir+xappid+'-allread.xcon','create',it);
		}else if (!tgt && !hride){ //If no target is specified and your not the host, send to host
			XS.File(xconndir+xappid+xusername+'-tohost.xcon','create',it);
		}else if (hride!=1){ //If you are the host and have specified a target, send to target.
			XS.File(xconndir+xappid+tgt+'-read.xcon','create',it);
		}else{ //hride was specified. this means host sending to host.
			XS.File(xconndir+xappid+xusername+'-tohost.xcon','create',it);
		}
		//eval(xdataoutact)();
	},
	Receive:function(){
		if (XC.Role()){
			XS.Folder(xconndir,'search','tohost.xcon');
			for (xi=0;xi<=xscan.length-1;xi++){
				if (XS.File(xconndir+xscan[xi],'exist')){
					xreceived = XS.File(xconndir+xscan[xi],'open');
					XS.File(xconndir+xscan[xi],'delete');
					eval(xdatainact)();
				}
			}
		}
		if (XS.File(xconndir+xappid+'-allread.xcon','exist')){
				xreceived = XS.File(xconndir+xappid+'-allread.xcon','open');
				XS.File(xconndir+xappid+xusername+'-receipt.xcon','create');
				eval(xdatainact)();
		}
		if (XS.File(xconndir+xappid+xusername+'-read.xcon','exist')){
				xreceived = XS.File(xconndir+xappid+xusername+'-read.xcon','open');
				eval(xdatainact)();
				XS.File(xconndir+xappid+xusername+'-read.xcon','delete');
		}
	},
	ReadReceipt:function(){
		XS.Folder(xconndir,'search','receipt.xcon');
		if (xscan.length>=xusersconn){
			XS.File(xconndir+xappid+'-allread.xcon','delete');
			for (xi=0;xi<=xscan.length-1;xi++){
				XS.File(xconndir+xscan[xi],'delete');
			}
			return true;
		}
		return false;
	},
	VerifyGameValid:function(){
		XS.Folder(xconndir,'search','client.xcon');
		xusersconn = xscan.length;
		if (xusersconn>=xminplayers){
			eval(xgamevalid)();
		}else{
			XS.File(xconndir+xappid+'-gamevalid.xcon','delete');
			xtimer = setInterval("XC.GetOpponents()",2000);
		}
	},
	FakeReceipt:function(){
		XS.File(xconndir+xappid+xusername+'-receipt.xcon','create');
	},
	Wait:function(it){
		if (it == 0){
			clearInterval(xwait);
		}else{
			clearInterval(xwait);
			xwait = setInterval("XC.Receive()",it);
		}
	},
	TwoPlayerName:function(){
		XS.Folder(xconndir,'search','-client');
		if (xscan[0].split('-client')[0].split(xappid)[1] == xusername){
			oppo   = xscan[1].split('-client')[0].split(xappid)[1];
			myself = xscan[0].split('-client')[0].split(xappid)[1];
		}else{
			oppo   = xscan[0].split('-client')[0].split(xappid)[1];
			myself = xscan[1].split('-client')[0].split(xappid)[1];
		}
	},
	ChatSend:function(it){
		if (it){
			if (!XS.File(xconndir+xappid+'-chat.xcon','exist')){
				XS.File(xconndir+xappid+'-chat.xcon','create',myself.split('.')[1] + ': '+it+'\n');
			}else{
				XS.File(xconndir+xappid+'-chat.xcon','writeline',myself.split('.')[1] + ': '+it+'\n');
			}
		}
	},
	ChatRead:function(){
		if (XS.File(xconndir+xappid+'-chat.xcon','exist')){
			return XS.File(xconndir+xappid+'-chat.xcon','open');
		}else{
			return 'No Messages';
		}
	}
};

var xcipque  = new Array();
var xcipdata = new Array();
var xcitimer = 0;
var XCIP={
	Ini:function(it){
		if (it==1){
			XCIP.Purge();
		}
		XWS.Launch('ipmsg.bat');
		xcipque[2]  = new Array();
		xcipdata[0] = XN.Name('computer');
		xcipdata[1] = 'localhost';
		xcipdata[2] = document.title;
		//setTimeout("XCIP.Connect(2,'localhost')",1000); //remove line its for testing
	},
	Connect:function(it,it2){
		xcipdata[3] = XS.File('ip.txt','open');
		if (!it){
			XM.Alert('Connection - IP Address/Computer Name','<br><center>'+xcipdata[3]+'- '+xcipdata[0]+'<br><br><input type="textarea" id="xcipmsgbox" style="border:1 solid white;background-Color:black;color:white;"> <input type="button" value="Connect" style="color:white;background-Color:black;border:1 solid white;height:20;" onclick="XCIP.Connect(1)"></center>',0,0,1);
			xcipmsgbox.focus();
		}else if (it == 1){
			XM.Close();
			if (xcipmsgbox.value){
				xcipdata[1] = xcipmsgbox.value;
			}
			document.title = xcipdata[2] + ' >> '+xcipdata[0]+'@'+xcipdata[3]+' >> ' +xcipdata[1];
			xciptimer      = setInterval("XCIP.In()",1000);
		}else if (it == 2){
			xcipdata[1]    = it2;
			document.title = xcipdata[2] + ' >> '+xcipdata[0]+'@'+xcipdata[3]+' >> ' +xcipdata[1];
			xciptimer      = setInterval("XCIP.In()",1000);
		}
	},
	Disconnect:function(){
		clearInterval(xciptimer);
	},
	Purge:function(){
		XS.File('C:\\Users\\'+XN.Name('user')+'\\Documents\\ipmsg.log','delete');
	},
	Clean:function(){
		XS.File('ip.txt','delete');
		XWS.Launch('cleanup.bat');
		window.close();
	},
	Out:function(it,it2){
		if (it && it2){
			XWS.Launch('ipmsg.exe /MSG /LOG '+it+' '+it2);
		}
	},
	In:function(){
		xcipque[0] = [];
		xcipque[1] = [];
		xcipque[0] = XS.File('C:\\Users\\'+XN.Name('user')+'\\Documents\\ipmsg.log','open');
		if (xcipque[0]){
			if (xcipque[0]!=xcipque[2]){
				xcipque[2] = xcipque[0];
				xcipque[0] = xcipque[0].split('=====================================');
				for (i=0;i<=xcipque[0].length-1;i++){
					xcipque[0][i] = xcipque[0][i].split('-------------------------------------');
				}
				for (i=0;i<=xcipque[0].length-1;i++){
					xcipque[0][i][0] = xcipque[0][i][0].split('(')[1];
				}
				for (i=1;i<=xcipque[0].length-1;i++){
					xcipque[0][i][0] = xcipque[0][i][0].split('/')[0];
				}
				xcipque[1] = new Array();
				for (i=0;i<=xcipque[0].length-2;i++){
					xcipque[1][i]    = new Array();
					xcipque[1][i][0] = xcipque[0][i+1][0];
					xcipque[1][i][1] = xcipque[0][i+1][1].split('\r\n')[1];
				}
				xout.value = xcipque[1];
			}
		}
	}
};