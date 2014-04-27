var Login={
	u:'',
	p:'',
	e:'',
	Ini:function(){
		XM.Ini();
		XL.Ini();
		AJAX.Ini();
		XI.New('dialogs','loginform','1:1','200:400',0);
		Login.Dialog();
	},
	Dialog:function(it){
		AJAX.state = 'login';
		XI.Fill('loginform',document.title+' - Login','<center><table style="font-size:12;"><tr><td style="text-align:right;">Username:</td><td><input type="textarea" class="text" id="u"></td></tr><tr><td style="text-align:right;">Password:</td><td><input type="password" class="text" id="p"></td></tr><tr><td></td><td><input type="button" value="Register" class="btn" onclick="Login.Register()"> <input type="button" value="Login" class="btn" onclick="Login.Login()"></td></tr></table></center>');
		setTimeout("u.focus()",100);
		XI.Show('loginform');
		XU.CenterElement('loginform','b');			
	},
	Resize:function(){
		XU.CenterElement('loginform','b');
	},
	Login:function(){
		Login.u = XU.El('u').value;
		Login.p = XU.El('p').value;
		if (Login.u && Login.p){
			AJAX.state = 'login';
			XI.Show('nxms');
			AJAX.data = "u="+Login.u+'&p='+Login.p;
			AJAX.xmlhttp.open("POST","http://ttws.zzl.org/php/login.php",true);
			AJAX.xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			AJAX.xmlhttp.send(AJAX.data);
		}
	},
	Register:function(){	
		Login.u = XU.El('u').value;
		Login.p = XU.El('p').value;
		if (Login.u && Login.p){
			AJAX.state = 'register';
			XI.Show('nxms');
			AJAX.data = "u="+Login.u+'&p='+Login.p;
			AJAX.xmlhttp.open("POST","http://ttws.zzl.org/php/register.php",true);
			AJAX.xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			AJAX.xmlhttp.send(AJAX.data);
		}
	}
};