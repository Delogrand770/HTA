var required_gems=0;
var course_music=0;
var player_color=1;
var player_x=1;
var player_y=1;
var custom=0;
var skin='classic';

var map_loaded=0;
var current_map_name="";
var bypass_samename=0;
var key_str="";
var gridsize=15;
var iconsize=30;

var brush_left=0;
var brush_right=0;

XUtilities.ResizeWindow(850,600)

function UpdateBrush(){lbrush.src="res/skins/classic/"+brush_left+".png";rbrush.src="res/skins/classic/"+brush_right+".png";}
function NewLBrush(what_brush){brush_left=what_brush;UpdateBrush();}
function NewRBrush(what_brush){brush_right=what_brush;UpdateBrush();}

function ValidateAllFields(){
if (p_color.value!=1 && p_color.value!=2 && p_color.value!=3 && p_color.value!=4 && p_color.value!=5 && p_color.value!=6){
alert('[Player Start Color] Error!\n\n---Valid colors---\nGreen Block\nBlue Block\nRed Block\nPurple Block\n\Teal Block\nOrange Block')
}
else if (r_gem.value-1>=t_gem.value){alert(r_gem.value+','+t_gem.value);alert('[Gems Required] Error!\n\n[Gems Required] cannot be greater than [Gems on Map]');}
else if (r_gem.value<=-1){alert('[Gems Required] Error!\n\n[Gems Required] cannot be less than 0');}
else{
small_vars.value='';medium_vars.value='';large_vars.value='';master_vars.value='';
small_vars.value+='required_gems='+r_gem.value+';collected_gems=0;course_music='+c_music.value+';player_color='+p_color.value+';player_x='+p_x.value+';player_y='+p_y.value+';';
for (a=1;a<=gridsize;a++){
for (b=1;b<=gridsize;b++){
medium_vars.value+="g"+a+"x"+b+"b.value="+document.getElementById('g'+a+'x'+b+'b').value+";";
medium_vars.value+="g"+a+"x"+b+"b.src='res/skins/'+skin+'/"+document.getElementById('g'+a+'x'+b+'b').value+".png';";
large_vars.value+="g"+a+"x"+b+"f.value="+document.getElementById('g'+a+'x'+b+'f').value+";";
large_vars.value+="g"+a+"x"+b+"f.src='res/skins/'+skin+'/"+document.getElementById('g'+a+'x'+b+'f').value+".png';";
}
}
master_vars.value+=small_vars.value+''+medium_vars.value+''+large_vars.value;
btn_save.style.visibility="visible";XScripting.DeleteFile('token');
SaveMap()
}
}

function LoadCustomMap(){
q2=prompt('Enter Level Name to Load','');
if (XScripting.FileExist("res/maps/"+q2+".js") && q2){
map_loaded=1;map_container.src="res/maps/"+q2+".js";Map();
r_gem.value=required_gems;
p_y.value=player_y;
p_x.value=player_x;
p_color.value=player_color;
p_color.src='res/skins/classic/'+player_color+'.png';
c_music.value=course_music;
CountGems();
}
}

function CheckKey(){
key_str+=''+event.keyCode;
//document.body.innerHTML=key_str;
if (key_str=="76796568776580"){LoadCustomMap();}
if (key_str=="83657769776580"){bypass_samename=1;alert('Map overwrite enabled!')}
}

function CountGems(dontask){
t_gem.value=0;
for (a=1;a<=gridsize;a++){
for (b=1;b<=gridsize;b++){
if (document.getElementById('g'+a+'x'+b+'f').value==7){t_gem.value++;}
else if (document.getElementById('g'+a+'x'+b+'f').value==8){t_gem.value++;}
else if (document.getElementById('g'+a+'x'+b+'f').value==9){t_gem.value++;}
else if (document.getElementById('g'+a+'x'+b+'f').value==10){t_gem.value++;}
else if (document.getElementById('g'+a+'x'+b+'f').value==11){t_gem.value++;}
else if (document.getElementById('g'+a+'x'+b+'f').value==12){t_gem.value++;}
}
}
if (dontask!=1){if (confirm('Count Complete!\n\nSet [Required Gems] equal to [Gems on Map]?')){r_gem.value=t_gem.value;}}else{ValidateAllFields()}
}

function FillMap(){
if (bmap.style.display=="block" && fmap.style.display=="block"){alert('[View] Error!\n\nCannot fill map when mode is set to [Both]')}
if (confirm('This will fill the map with the block next to the [Fill Map] button.')){
if (bmap.style.display=="block" && fmap.style.display=="none"){
for (a=1;a<=gridsize;a++){
for (b=1;b<=gridsize;b++){
document.getElementById('g'+a+'x'+b+'b').value=fill_color.value;
document.getElementById('g'+a+'x'+b+'b').src="res/skins/classic/"+fill_color.value+".png";
}
}
}
if (fmap.style.display=="block" && bmap.style.display=="none"){
for (a=1;a<=gridsize;a++){
for (b=1;b<=gridsize;b++){
document.getElementById('g'+a+'x'+b+'f').value=fill_color.value;
document.getElementById('g'+a+'x'+b+'f').src="res/skins/classic/"+fill_color.value+".png";
}
}
}
}
}

function AskReset(){if (confirm('This will reset everything and any unsaved work will be lost!!!')){window.location.reload()}}

function SaveMap(){
if (XScripting.FileExist('token')){
if (!current_map_name){q1=prompt('Enter Map Name to Save',current_map_name);current_map_name=q1;}
if ((q1 && !XScripting.FileExist('res/maps/'+q1+'.js')) || (q1 && bypass_samename==1) || (q1==current_map_name && map_loaded==0)){map_loaded=0;
XScripting.CreateFile('res/maps/'+q1+'.js','function Map(){document.title+=" [Map:'+q1+']";'+master_vars.value+'}');
XScripting.DeleteFile('token');XScripting.DeleteFile('temp.js');alert('Map: '+q1+' Saved!')}
else{current_map_name="";alert('[Enter Map #] Error!\n\nMap name invalid or map already exists');}
}
else{alert('You must verify your puzzle first!!!');XScripting.CreateFile('temp.js','function Map(){document.title+=" [Verifying]";'+master_vars.value+'}');XShell.LaunchApp('iceslide.hta');}
}

document.onkeydown=function(){CheckKey()}
document.oncontextmenu=function(){key_str='';}
window.onbeforeunload=function(){XScripting.DeleteFile('temp.js');}
window.onload=function(){fmap.style.display="block";bmap.style.display="none";UpdateBrush();t_gem.value=0;r_gem.value=0;bypass_samename=0;}