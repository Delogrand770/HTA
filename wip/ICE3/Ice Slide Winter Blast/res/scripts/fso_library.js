/*
Created by Gavin Delphia © 2007
All Rights Reserved

Binary and Ascii Conversion Created By Twey on DynamicDrive.com


This library only works with internet Explorer and it is intended for use with Microsoft Hypertext Application or .hta
Errors and limited functionality may occur if used in a .html or .htm
All Functions are in the NameSpace Format

[Call Format:] funcname(target,parameters)

Every function either returns True, False, or the Requested Data.
For query functions such as does a FileExist() and FolderExist() true and false represent yes and no respectively.
The Open() function returns the documents contents if true or false if a error occurs.
All other functions return True for action executed or false for action failed.



XScripting.WriteLineInFile(file,datatowrite) -
	Writes new line in target file with specified data

XScripting.OpenFile(file) -
	opens file and returns text

XScripting.FileSize(file) -
	returns file size in bytes

XScripting.GetFolderFiles(folder) -
	Returns array of files in target folder

XScripting.GetFileBaseName(file) - 
	Returns just the name of the file without the path or file extension	

XScripting.GetFileExtension(file) - 
	Returns just the file extension without the path or name	

XScripting.GetFileName(file) - 
	Returns the file name followed by the extension. No path

XScripting.GetParentFolder(file) - 
	Returns the parent folder of any file or folder

XScripting.CreateFile(file,datatowrite) - 
	Creates a file with specified data

XScripting.CreateFolder(folder) - 
	Creates a folder

XScripting.DeleteFile(file) - 
	Deletes File

XScripting.DeleteFolder(folder) - 
	Delets Folder

XScripting.FileExist(file) - 
	Returns true if file exists and false if it does not

XScripting.FolderExist(folder) - 
	Returns true if folder exists and false if it does not

XScripting.CopyFile(file,destionation) - 
	Copies file to the destionation

XScripting.CopyFolder(folder,destination) - 
	Copies folder to the destination

XScripting.MoveFile(file,destination) - 
	Deletes file from original location and moves to destination

XScripting.MoveFolder(folder,destination) - 
	Deletes folder from original location and moves to destination

XScripting.SearchDirectory(path,files) -
	Searches Directory for file info. Extension or name
	Results will be assigned to the array scanned_files;

XScripting.DownloadFile(source,target) -
	Downloads a file from a webserver. Eg XScripting.DownloadFile("http://javag.f2g.net/index.html","newfilename.html")

XScripting.CurrentPath() -
	Returns the current path

XNetwork.ComputerName() -
	Returns the name of the computer

XNetwork.UserName() - 
	Returns the name of the user

XNetwork.UserDomain() - 
	Returns the domain of the user

XShell.LaunchApp(target_app) - 
	Launches the specified application. Eg   XShell.LaunchApp('cmd.exe -switch')

XShell.ReadRegKey(target_key) - 
	Returns Registry Key Value

XShell.WriteRegKey(target_key,key_value) - 
	Creates Registry Key and assigns a value

XShell.DeleteRegKey(target_key,key_value) - 
	Deletes Registry Key and value    ****** Disabled ****** If you really need it un-comment the line in the function

XData.ToBinary(string) - 
	Returns string converted to binary

XData.ToAscii(bin) -
	Returns string converted to ascii

XUtilities.ResizeWindow(width,height,fullscreen) - 
	Resizes and centers window to specified dimensions. Fullscreen is a 1 or 0 property

XUtilities.MoveWindow(x,y) - 
	Moves the window to the specified x and y coordinates

XUtilities.ResChange(mode,width,height) -
	mode=1 Specify Res
	mode=0 Return Res to original. Usually call using onbeforeunload=ResChange(0)

XUtilities.ErrorHandler(mode) -
	Handles Errors by specified mode.
	0=Hide All Errors and Continue
	1=Custom Alert Error and Continue
	2=Custom Alert and Close
	3=Close
	4=Log and Continue
	5=Log and Close
	6=Windows Error Message and Continue
*/

var oldres_x=0;
var oldres_y=0;
var FileName=new String();
var Extention=new String();
var scanned_files=new Array();

// Scripting.FileSystemObject //
var XScripting={
WriteLineInFile:function(fso_target,fso_data){
var fso=new ActiveXObject("Scripting.FileSystemObject");
var linein=fso.OpenTextFile(fso_target,8,1,-2);
linein.writeline(fso_data);
linein.Close();
return true;
},
OpenFile:function(fso_target){
if (this.FileExist(fso_target)){
var fso=new ActiveXObject("Scripting.FileSystemObject");
var loadfile=fso.GetFile(fso_target).OpenAsTextStream(1,0);
var returndata=loadfile.ReadAll();loadfile.close();
return returndata;
}
else{return false;}
},
FileSize:function(fso_target){
if (this.FileExist(fso_target)){
var fso=new ActiveXObject("Scripting.FileSystemObject");
return fso.GetFile(fso_target).Size;
}
},
GetFolderFiles:function(fso_target){
if (this.FolderExist(fso_target)){
var fso=new ActiveXObject("Scripting.FileSystemObject");
var loadfolder=fso.GetFolder(fso_target);
var returndata=new Array();
var index=-1;
for(var objEnum=new Enumerator(loadfolder.Files);!objEnum.atEnd();objEnum.moveNext()){index++;returndata[index]=objEnum.item();}
return returndata;
}
else{return false;}
},
GetFileBaseName:function(fso_target){
if (this.FileExist(fso_target)){
var fso=new ActiveXObject("Scripting.FileSystemObject");
var basename=fso.GetBaseName(fso_target);
return basename;
}
else{return false;}
},
GetFileExtension:function(fso_target){
if (this.FileExist(fso_target)){
var fso=new ActiveXObject("Scripting.FileSystemObject");
var extension=fso.GetExtensionName(fso_target);
return extension;
}
else{return false;}
},
GetFileName:function(fso_target){
if (this.FileExist(fso_target)){
var fso=new ActiveXObject("Scripting.FileSystemObject");
var filename=fso.GetFileName(fso_target);
return filename;
}
else{return false;}
},
GetParentFolder:function(fso_target){
if (this.FileExist(fso_target) || this.FolderExist(fso_target)){
var fso=new ActiveXObject("Scripting.FileSystemObject");
var parentfolder=fso.GetParentFolderName(fso_target);
return parentfolder;
}
else{return false;}
},
CreateFile:function(fso_target,fso_data){
var fso=new ActiveXObject("Scripting.FileSystemObject");
var newfile=fso.createTextFile(fso_target); 
newfile.write(fso_data);
newfile.close();
return true;
},
CreateFolder:function(fso_target){
if (!this.FolderExist(fso_target)){
var fso=new ActiveXObject("Scripting.FileSystemObject");
fso.createFolder(fso_target); 
return true;
}
else{return false;}
},
DeleteFile:function(fso_target){
if (this.FileExist(fso_target)){
var fso=new ActiveXObject("Scripting.FileSystemObject");
fso.DeleteFile(fso_target); 
return true;
}
else{return false;}
},
DeleteFolder:function(fso_target){
if (this.FolderExist(fso_target)){
var fso=new ActiveXObject("Scripting.FileSystemObject");
fso.DeleteFolder(fso_target); 
return true;
}
else{return false;}
},
FileExist:function(fso_target){
var fso=new ActiveXObject("Scripting.FileSystemObject");
if (fso.FileExists(fso_target)){return true;}
else{return false;}
},
FolderExist:function(fso_target){
var fso=new ActiveXObject("Scripting.FileSystemObject");
if (fso.FolderExists(fso_target)){return true;}
else{return false;}
},
CurrentPath:function(){
var fso=new ActiveXObject("Scripting.FileSystemObject");
return fso.GetFolder(".").Path
},
CopyFile:function(fso_target,fso_dest){
if (this.FileExist(fso_target) && this.FolderExist(fso_dest)){
var fso=new ActiveXObject("Scripting.FileSystemObject");
fso.CopyFile(fso_target,fso_dest);
return true;
}
else{return false;}
},
CopyFolder:function(fso_target,fso_dest){
if (this.FolderExist(fso_target) && this.FolderExist(fso_dest)){
var fso=new ActiveXObject("Scripting.FileSystemObject");
fso.CopyFolder(fso_target,fso_dest);
return true;
}
else{return false;}
},
MoveFile:function(fso_target,fso_dest){
if (this.FileExist(fso_target) && this.FolderExist(fso_dest)){
var fso=new ActiveXObject("Scripting.FileSystemObject");
fso.MoveFile(fso_target,fso_dest);
return true;
}
else{return false;}
},
MoveFolder:function(fso_target,fso_dest){
if (this.FolderExist(fso_target) && this.FolderExist(fso_dest)){
var fso=new ActiveXObject("Scripting.FileSystemObject");
fso.MoveFolder(fso_target,fso_dest);
return true;
}
else{return false;}
},
SearchDirectory:function(what_path,what_search){
var fso=new ActiveXObject("Scripting.FileSystemObject");
FileName=(what_search.lastIndexOf(".")>-1)? what_search.slice(0,what_search.lastIndexOf(".")):(what_search.length>0)? what_search.toLowerCase():"*";
Extention=(what_search.lastIndexOf(".")>-1)? what_search.slice(what_search.lastIndexOf(".")+1).toLowerCase():"*"; 
if(what_path.length>0 && fso.FolderExists(what_path)){
this.FindFile(fso.GetFolder(what_path));
}
},
FindFile:function(foo){
var enu=new Enumerator(foo.Files);
for(i=0;!enu.atEnd();enu.moveNext()){
if(FileName == "*" ||  enu.item().name.slice(0,enu.item().name.lastIndexOf(".")).toLowerCase().indexOf(FileName)>-1){
if(Extention == "*" || enu.item().name.slice(enu.item().name.lastIndexOf(".")+1).toLowerCase().indexOf(Extention)>-1){
scanned_files[i]=enu.item().name;i++;
}
}
}
},
DownloadFile:function(sourcefile,targetfile){
var fso=new ActiveXObject("Scripting.FileSystemObject");
var stream=new ActiveXObject("ADODB.Stream");
var xmlHttp=new ActiveXObject("Microsoft.XMLHttp");
xmlHttp.Open("GET", sourcefile, false);
xmlHttp.Send();stream.open();stream.type=1;
stream.write(xmlHttp.responseBody);stream.position=0;
if (fso.fileExists(targetfile)){fso.deleteFile(targetfile);}
stream.saveToFile(targetfile);stream.close();
fso=stream=xmlHttp=null;
return true;
}
};


// WScript.Network //
var XNetwork={
ComputerName:function(){
var fso=new ActiveXObject("WScript.Network");
return fso.ComputerName;
},
UserName:function(){
var fso=new ActiveXObject("WScript.Network");
return fso.UserName;
},
DomainName:function(){
var fso=new ActiveXObject("WScript.Network");
return fso.UserDomain;
}
};

// WScript.Shell //
var XShell={
LaunchApp:function(target_app){
var apprunner=new ActiveXObject("WScript.Shell");
apprunner.Run(target_app);
},
ReadRegKey:function(target_key){
var readkey=new ActiveXObject("WScript.Shell");
return readkey.RegRead(target_key);
},
WriteRegKey:function(target_key,key_value){
var writekey=new ActiveXObject("WScript.Shell");
writekey.RegWrite(target_key,key_value);
return true;
},
DeleteRegKey:function(target_key){
var deletekey=new ActiveXObject("WScript.Shell");
//deletekey.RegDelete(target_key); 
return true;
}
};


// Data Conversion //

var XData={
frontPad:function(s, len, chr){
for(var r = s.toString(); r.length < len; r = (chr || "0") + r);
return r;
},
group:function(arr, len){
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
}
};


// OTHER FUNCTIONS //
var XUtilities={
ResizeWindow:function(t_height,t_width,t_full){
if (t_full==1){t_height=screen.height;t_width=screen.width;}
window.resizeTo(t_width,t_height);
self.moveTo(screen.width/2-(t_width/2),screen.height/2-(t_height/2));
},
MoveWindow:function(t_x,t_y){
if (t_x=="c"){t_x=screen.width/2-(document.body.offsetWidth/2);}
if (t_y=="c"){t_y=screen.height/2-(document.body.offsetHeight/2);}
self.moveTo(t_x,t_y);
},
ErrorHandler:function(t_mode){
if (t_mode==0){window.onerror=function(){return true;}}
if (t_mode==1){window.onerror=function(msg,url,l){alert('Error: '+msg+'\nLocation: '+url+'\nLine: '+l);return true;}} 
if (t_mode==2){window.onerror=function(msg,url,l){alert('Error: '+msg+'\nLocation: '+url+'\nLine: '+l);window.opener=null;window.close()}}
if (t_mode==3){window.onerror=function(){window.opener=null;window.close()}}
if (t_mode==4){window.onerror=function(msg,url,l){if (FileExist('errorlog.txt')){WriteLineInFile('errorlog.txt','Error: '+msg+'\nLocation: '+url+'\nLine: '+l+'\n');}else{CreateFile('errorlog.txt','Error: '+msg+'\nLocation: '+url+'\nLine: '+l+'\n');} ;return true;}}
if (t_mode==5){window.onerror=function(msg,url,l){if (FileExist('errorlog.txt')){WriteLineInFile('errorlog.txt','Error: '+msg+'\nLocation: '+url+'\nLine: '+l+'\n');}else{CreateFile('errorlog.txt','Error: '+msg+'\nLocation: '+url+'\nLine: '+l+'\n');} ;window.close();}}
if (t_mode==6){window.onerror=function(){}}
},
ResChange:function(what_mode,new_h,new_w){
if (what_mode==1){oldres_x=screen.width;oldres_y=screen.height;XShell.LaunchApp('ResChange.exe -width='+new_w+' -height='+new_h);}
else if (what_mode==0){XShell.LaunchApp('ResChange.exe -width='+oldres_x+' -height='+oldres_y);}
}
}