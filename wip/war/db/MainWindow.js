var MainWindow = {
	Ini:function(){
		document.body.innerHTML = XS.File('db/stringExtraElements.txt','open');
		winlocation = 'mainmenu';
		XM.Ini();
		XDS.Ini();
		XI.New('mainwindow','multiuse','1:1','10:500',0);
		XI.New('mainwindow','stats','1:1','10:250',0);
		XI.New('mainwindow','lastmission','1:1','10:350',0);
		XI.New('mainwindow','utility','1:1','10:350',0);
		XI.New('mainwindow','actions','1:1','10:500',0);
		MainWindow.FindSaves();
		Deck.DrawCardContainers(5);
		Deck.DrawCardInfoContainers(5);
	},
	FindSaves:function(){
		var tempdata = '';
		var tempact  = '';
		XS.Folder('war.saves/','search','*.txt');
		if (xscan.length != 0){
			for (i=0;i<=xscan.length-1;i++){
				tempact = xscan[i].split('.txt')[0];
				tempdata += '<span onclick="XDS.Load(\'war.saves/'+tempact+'.txt\');Dashboard.Ini()">'+tempact+'<font color="#0099ff"></font></span><br>';
			}
		}
		tempdata += '<span style="text-align:right;width:99%;" onclick="MainWindow.NewGame(0)"><br>+New Game</span>';
		XI.Fill('multiuse','New / Continue',tempdata,1);
		XU.CenterElement('multiuse','b');
	},
	NewGame:function(it,it2){
		if (it==0){
			XI.Fill('multiuse','+New Game',XS.File('db/stringNewGame.txt','open'),1);
			XU.CenterElement('multiuse','b');
		}else if (it==1){
			current_data[1] = it2;
			XI.Fill('multiuse','Enter Name',XS.File('db/stringNameEntry.txt','open'),1);
			setTimeout("iname.focus();",100);
			XU.CenterElement('multiuse','b');
		}else if (it==2){
			if (!XS.File('war.saves/'+it2+'.txt','exist')){
				current_data[0] = it2;
				current_data[2] = 100000;
				current_data[3] = 0;
				current_data[4] = 0;
				current_data[5] = 0;
				current_data[6] = 0;
				current_data[7] = '0:N/A';
				card_library    = window['deck_'+current_data[1]].copy();
				current_deck    = window['deck_'+current_data[1]].copy();
				incardstore     = window['deck_'+current_data[1]].copy();
				cret_library    = cret_list.copy();
				incretstore     = new Array(1,2,3,4);
				Deck.BlankLibrary();
				if (current_data[1] == 'violence'){
					cret_library[0] = 1;
					current_data[8] = 1;
				}else if (current_data[1] == 'healing'){
					cret_library[1] = 1;
					current_data[8] = 2;
				}else if (current_data[1] == 'poison'){
					cret_library[2] = 1;
					current_data[8] = 3;
				}else if (current_data[1] == 'counter'){
					cret_library[3] = 1;
					current_data[8] = 4;
				}
				GameGlobal.Save();
				MainWindow.FindSaves();
			}else{
				iinfo.innerHTML = '<font color="red">The name you have typed is already in use.</font>';
			}
		}
	}
};