document.write('<bgsound src="" loop="infinite" id="BG" volume=0>')
document.write('<span id="bmap" style="position:absolute;top:'+iconsize+';left:'+iconsize+';display:none;">')
document.write('<table cellpadding=0 border=0 cellspacing=0>');
for (a=1;a<=gridsize;a++){document.write('<tr>');
for (b=1;b<=gridsize;b++){document.write('<td><img src="res/skins/classic/0.png" height='+iconsize+' width='+iconsize+' id="g'+a+'x'+b+'b" style="z-index:1;"></td>');}
document.write('</tr>');
}
document.write('</table></span>');
document.write('<span id="fmap" style="position:absolute;top:'+iconsize+';left:'+iconsize+';display:none;">')
document.write('<table cellpadding=0 border=0 cellspacing=0>');
for (a=1;a<=gridsize;a++){document.write('<tr>');
for (b=1;b<=gridsize;b++){document.write('<td><img src="res/skins/classic/0.png" height='+iconsize+' width='+iconsize+' id="g'+a+'x'+b+'f" style="z-index:2;"></td>');}
document.write('</tr>');
}
document.write('</table></span>');
document.write('<img src="" id="player" style="position:absolute;display:block;display:none;" height='+iconsize+' width='+iconsize+'>');
document.write('<img src="" id="followx" style="position:absolute;display:none;" height='+iconsize+' width='+iconsize+'>');
document.write('<img src="" id="followy" style="position:absolute;display:none;" height='+iconsize+' width='+iconsize+'>');
document.write('<img src="" id="followxx" style="position:absolute;display:none;" height='+iconsize+' width='+iconsize+'>');
document.write('<img src="" id="followyy" style="position:absolute;display:none;" height='+iconsize+' width='+iconsize+'>');
document.write('<span style="position:absolute;top:525;left:30;display:none;" id="map_info">');
document.write('<b>Gems: </b><input type="textarea" id="textgems" readonly class="txt1"><input type="button" value="Restart" class="btn3" onclick="System.BeginMap()" onmouseover="Swap.Class()" onmouseout="Swap.Class()"> ');
document.write('<input type="button" value="Give Up" class="btn3" onclick="System.PuzzleEnd(0)" onmouseover="Swap.Class()" onmouseout="Swap.Class()"></span>');
document.write('<span id="title_menu" style="display:block;"><center><img src="res/skins/title.png"><img src="res/skins/logo.png"><br><br>');
document.write('<span id="main_menu" style="display:block;"><input type="button" value="Play Standard" class="btn3" onclick="System.NormalPlay()" onmouseover="Swap.Class()" onmouseout="Swap.Class()"><br><br>');
document.write('<input type="button" value="Play Custom" class="btn3" onclick="custom=1;main_menu.style.display=\'none\';load_map.style.display=\'block\';" onmouseover="Swap.Class()" onmouseout="Swap.Class()"> ');
document.write('<input type="button" value="Level Editor" class="btn3" onclick="XShell.LaunchApp(\'editor.hta\');window.opener=null;window.close();" onmouseover="Swap.Class()" onmouseout="Swap.Class()"><br><br>');
document.write('<input type="button" value="Change Theme" class="btn3" onclick="Swap.Skin()" onmouseover="Swap.Class()" onmouseout="Swap.Class()"><br><span id="current_skin"></span><br><br>Created by Gavin Delphia<br><br><br><br><input type="button" value="Instructions" onclick="XShell.LaunchApp(\'res\\\\help.txt\')" onmouseover="Swap.Class()" onmouseout="Swap.Class()" class="btn3"> <input type="button" value="Get Maps" onclick="XShell.LaunchApp(\'getmaps.hta\');window.opener=null;window.close();" onmouseover="Swap.Class()" onmouseout="Swap.Class()" class="btn3"></span>');
document.write('<span id="load_map" style="display:none;"></span><span id="normal_map" style="display:none;"><span style="overflow-y:auto;height:320;width:460;">');

var m=-1;
document.write('<table style="border:1 solid black;">');
for (a=0;a<=premade_total;a++){
document.write('<tr id="lvlset'+a+'" style="display:none;">');
for (b=0;b<=4;b++){m++;document.write('<td style="height:70;width:80;border:1 solid black;cursor:hand;background-Color:#0099ff;" onmouseover="Swap.Color1()" onmouseout="Swap.Color2()" value='+m+' onclick="map_index=this.value;System.LoadRMap(this.value);" id="l'+a+'_'+b+'l">&nbsp;&nbsp;Level '+m+'</td>')}
document.write('</tr>');
}
document.write('</table>');

document.write('</span><br>');
document.write('<input type="button" value="Main Menu" onclick="normal_map.style.display=\'none\';main_menu.style.display=\'block\';" class="btn1" onmouseover="Swap.Class()" onmouseout="Swap.Class()"></span></center></span>');
document.write('<img src="res/skins/on.png" onclick="Swap.Music(this.value)" value=1 id="music" style="position:absolute;top:1;left:1;height:25;width:25;cursor:hand;">');