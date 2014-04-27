/*
Created by Gavin Delphia 2007 - 2011
Not compatible with previous versions
*/

var xdev = 1;

// File System //
var xshell = new ActiveXObject("WScript.Shell");
var xfso   = new ActiveXObject("Scripting.FileSystemObject");
var xs_tmp = new Array();
var xscan  = new Array();
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
			return false;
		}
	}
};



// Shell Functions //
var XWS = {
	Launch:function(it){
		xshell.Run(it,0);
	}
};


// Utility Functions //
var xel        = 0;
var xele_temp  = 0;
var xityp_temp = 0;
var xutil_date = new Array(new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"),new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"));
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
				if (new Date().getSeconds()<=9){
					itemp += '.0' + new Date().getSeconds()+' PM';
				}else{
					itemp += '.' + new Date().getSeconds()+' PM';
				}
			}else{
				if (new Date().getSeconds()<=9){
					itemp += '.0' + new Date().getSeconds()+' AM';
				}else{
					itemp += '.' + new Date().getSeconds()+' AM';
				}
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
	El:function(it){
		return document.getElementById(it);
	}
};