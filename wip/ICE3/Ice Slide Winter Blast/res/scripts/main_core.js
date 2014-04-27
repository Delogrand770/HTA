var required_gems=0;
var collected_gems=0;
var course_music=3;
var player_color=1;
var player_x=1;
var player_y=1;
var skin='blasted';
var premade_total=(20-1); //(#*5) 

var gridsize=15;
var iconsize=30;
var no_movement=1;
var move_direction=0;
var move_speed=10;

var map_index=0;
var maps_completed=new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
var compiled_data='var a=0;';
var timer=0;
var verify=0;

var Puzzle={
Verify:function(){
verify=0;
if (XScripting.FileExist('temp.js')){verify=1;map_container.src='temp.js';System.BeginMap();}
},
Success:function(){XScripting.CreateFile('token','');alert('Puzzle verified!!!\n\n Click [Save Map] in the editor to make it offical.');window.opener=null;window.close();}
};

var System={
CatchKeys:function(){
if (no_movement==0){
if (event.keyCode==39){move_direction=6;no_movement=1;}
if (event.keyCode==37){move_direction=4;no_movement=1;}
if (event.keyCode==38){move_direction=8;no_movement=1;}
if (event.keyCode==40){move_direction=5;no_movement=1;}
}
},
Setup:function(){
no_movement=1;
followx.style.top=0;
followy.style.left=0;
followxx.style.top=Math.round(iconsize*16);
followyy.style.left=Math.round(iconsize*16);
player.style.top=player_y*iconsize;
player.style.left=player_x*iconsize;
followx.src="res/skins/"+skin+"/f2.png";
followy.src="res/skins/"+skin+"/f1.png";
followxx.src="res/skins/"+skin+"/f4.png";
followyy.src="res/skins/"+skin+"/f3.png";
current_skin.innerHTML="["+skin+"]";
},
BeginMap:function(){
document.title="Ice Slide - Winter Blast"
title_menu.style.display="none";
Map();
followx.style.display="block";
followy.style.display="block";
followxx.style.display="block";
followyy.style.display="block";
bmap.style.display="block";
fmap.style.display="block";
player.style.display="block";
map_info.style.display="block";
player.src="res/skins/"+skin+"/"+player_color+".png";
textgems.value=collected_gems+"/"+required_gems;
if (course_music==-1){course_music=Math.round(9*Math.random());}
BG.src="res/music/"+course_music+".mid";
timer=setInterval("System.UpdatePosition()",move_speed);
move_direction=0;no_movement=0;
System.DoMove();
},
UpdatePosition:function(){
if (move_direction==6){player_x++;
if (player_x<=gridsize && System.NoColorMatch()){System.DoMove();}
else{player_x--;no_movement=0;}
}
else if (move_direction==4){player_x--;
if (player_x!=0 && System.NoColorMatch()){System.DoMove();}
else{player_x++;no_movement=0;}
}
else if (move_direction==8){player_y--;
if (player_y!=0 && System.NoColorMatch()){System.DoMove();}
else{player_y++;no_movement=0;}
}
else if (move_direction==5){player_y++;
if (player_y<=gridsize && System.NoColorMatch()){System.DoMove();}
else{player_y--;no_movement=0;}
}
},
DoMove:function(){
player.style.top=Math.round(player_y*iconsize);
player.style.left=Math.round(player_x*iconsize);
followx.style.left=Math.round(iconsize*player_x);
followy.style.top=Math.round(iconsize*player_y);
followxx.style.left=Math.round(iconsize*player_x);
followyy.style.top=Math.round(iconsize*player_y);
System.CheckForEvents()
},
NoColorMatch:function(){
if (player_color!=1 && document.getElementById("g"+player_y+"x"+player_x+"f").value==1){return false;}
else if (player_color!=2 && document.getElementById("g"+player_y+"x"+player_x+"f").value==2){return false;}
else if (player_color!=3 && document.getElementById("g"+player_y+"x"+player_x+"f").value==3){return false;}
else if (player_color!=4 && document.getElementById("g"+player_y+"x"+player_x+"f").value==4){return false;}
else if (player_color!=5 && document.getElementById("g"+player_y+"x"+player_x+"f").value==5){return false;}
else if (player_color!=6 && document.getElementById("g"+player_y+"x"+player_x+"f").value==6){return false;}
else{return true;}},
CheckForEvents:function(){
if (document.getElementById("g"+player_y+"x"+player_x+"f").value==7 || document.getElementById("g"+player_y+"x"+player_x+"f").value==8 || document.getElementById("g"+player_y+"x"+player_x+"f").value==9 || document.getElementById("g"+player_y+"x"+player_x+"f").value==10 || document.getElementById("g"+player_y+"x"+player_x+"f").value==11 || document.getElementById("g"+player_y+"x"+player_x+"f").value==12){
player_color=document.getElementById("g"+player_y+"x"+player_x+"f").value;
player_color-=6;
player.src="res/skins/"+skin+"/"+player_color+".png";
collected_gems++;textgems.value=collected_gems+"/"+required_gems;
document.getElementById("g"+player_y+"x"+player_x+"f").value=0;
document.getElementById("g"+player_y+"x"+player_x+"f").src='res/skins/'+skin+'/0.png';
}
else if (document.getElementById("g"+player_y+"x"+player_x+"f").value==14 && collected_gems>=required_gems){System.PuzzleEnd(1);}
},
PuzzleEnd:function(what_terms){
clearInterval(timer);
if (verify==1 && what_terms==1){Puzzle.Success();}
else if (what_terms==1 && custom==0){maps_completed[map_index]=1;System.UpdateLevels();alert('Level Completed!!')}
else if (custom==1 && what_terms==1){alert('Custom Level Completed!!')}
else if (custom==1 && what_terms==0){window.opener=null;window.close();}
bmap.style.display="none";
fmap.style.display="none";
player.style.display="none";
map_info.style.display="none";
followx.style.display="none";
followy.style.display="none";
followxx.style.display="none";
followyy.style.display="none";
title_menu.style.display="block";
},
UpdateLevels:function(){
var m=-1;
for (a=0;a<=premade_total;a++){
document.getElementById("lvlset0").style.display="block";
if ((maps_completed[a+(4*a)]+maps_completed[a+1+(4*a)]+maps_completed[a+2+(4*a)]+maps_completed[a+3+(4*a)]+maps_completed[a+4+(4*a)])>=4
){document.getElementById("lvlset"+(a+1)).style.display="block";}
for (b=0;b<=4;b++){m++;
if (maps_completed[m]==1){
document.getElementById("l"+a+"_"+b+"l").style.backgroundColor="red";
document.getElementById("l"+a+"_"+b+"l").onmouseover=function(){Swap.Color1()}
document.getElementById("l"+a+"_"+b+"l").onmouseout=function(){Swap.Color4()}
document.getElementById("l"+a+"_"+b+"l").innerHTML="&nbsp;&nbsp;Level "+m//+"<br>&nbsp;Complete";
}
}
}
},
NormalPlay:function(){
custom=0;normal_map.style.display="block";main_menu.style.display="none";
},
LoadSave:function(){
if (XScripting.FileExist('save.bin')){eval(XData.ToAscii(XScripting.OpenFile('save.bin')));}
else{System.UpdateSave();}
},
UpdateSave:function(){
compiled_data="maps_completed=new Array(";
for (i=0;i<=maps_completed.length-1;i++){
if (i>=maps_completed.length-1){compiled_data+=maps_completed[i];}
else{compiled_data+=maps_completed[i]+",";}
}
compiled_data+=");";
XScripting.CreateFile('save.bin',XData.ToBinary(compiled_data));
},
SearchMaps:function(){custom=1;
XScripting.SearchDirectory('res/maps/','.js');
for (i=0;i<=scanned_files.length-1;i++){
load_map.innerHTML+="<input type='button' value="+scanned_files[i].replace('.js','')+" onclick='System.LoadMap(this.value)' class='btn3' onmouseover='Swap.Class()' onmouseout='Swap.Class()'> ";
}
load_map.innerHTML+="<br><input type='button' value='Main Menu' onclick='load_map.style.display=\"none\";main_menu.style.display=\"block\";' class='btn1' onmouseover='Swap.Class()' onmouseout='Swap.Class()'>";
},
LoadMap:function(what_map){map_container.src="res/maps/"+what_map+".js";System.BeginMap();},
LoadRMap:function(what_map){map_container.src="res/maps/premade/map"+what_map+".js";System.BeginMap();}
};

var Swap={
Color1:function(){eval(event.srcElement).style.backgroundColor='#99ff00';},
Color2:function(){eval(event.srcElement).style.backgroundColor='#0099ff';},
Color3:function(){eval(event.srcElement).style.backgroundColor='transparent';},
Color4:function(){eval(event.srcElement).style.backgroundColor='red';},
Class:function(){if (eval(event.srcElement).className=='btn1'){eval(event.srcElement).className='btn3'}else{eval(event.srcElement).className='btn1'}},
Skin:function(){
if (skin=="classic"){skin="blasted";XScripting.CreateFile('config.ini','skin="blasted";');}
else if (skin=="blasted"){skin="challenger.se";XScripting.CreateFile('config.ini','skin="challenger.se";');}
else if (skin=="challenger.se"){skin="classic";XScripting.CreateFile('config.ini','skin="classic";');}
current_skin.innerHTML="["+skin+"]";System.Setup()},
Music:function(w_tog){
if (w_tog==1){music.value=0;BG.volume=-10000;music.src="res/skins/off.png";} else{music.value=1;BG.volume=0;music.src="res/skins/on.png";}
}
};
XUtilities.ErrorHandler(0);
XUtilities.ResizeWindow(660,520);
if (!XScripting.FileExist('config.ini')){XScripting.CreateFile('config.ini','skin="classic";');}
eval(XScripting.OpenFile('config.ini'));
window.onbeforeunload=function(){System.UpdateSave()}
window.onload=function(){System.Setup();BG.src="res/music/3.mid";System.SearchMaps();Puzzle.Verify();System.LoadSave();System.UpdateLevels()}
document.onkeydown=function(){System.CatchKeys()}