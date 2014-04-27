var GameGlobal = {
	Resize:function(){
		if (winlocation == 'dashboard'){
			XU.CenterElement('multiuse','b');
			Dashboard.Ini();
		}else if (winlocation == 'deck'){
			XU.CenterElement('multiuse','h');
			Deck.Ini();
		}else if (winlocation == 'mainmenu'){
			XU.CenterElement('multiuse','b');
		}else if (winlocation == 'store'){
			XU.CenterElement('multiuse','h');
			Store.Ini();
		}
	},
	Save:function(){
		XDS.Save('war.saves/'+current_data[0]+'.txt');
		if (winlocation == 'dashboard'){
			actions_info.innerHTML = '<font color="#B5E61D">Game Saved!</font>';
		}
	},
	Keys:function(){
		if (event.keyCode == 96 && winlocation == 'mainmenu'){
			XI.Fill('multiuse','Erase Save Data',XS.File('db/stringSaveErase.txt','open'),1);
			setTimeout("saveerase.focus();",100);
		}
	},
	EraseSave:function(it){
		if (XS.File('war.saves/'+it+'.txt','exist') && confirm('The data cannot be recovered!')){
			XS.File('war.saves/'+it+'.txt','delete');
			setTimeout("XU.CenterElement('multiuse','b');",100);		
		}
		MainWindow.FindSaves();
	}
};