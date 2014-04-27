var Dashboard = {
	Ini:function(){
		XI.Title('multiuse','Dashboard');
		Deck.Cleanup();
		XI.Hide('c1');
		winlocation = 'dashboard';
		XI.Fill('multiuse','Dashboard',XS.File('db/stringMainMenu.txt','open'));
		multiuse.style.top = 10;

		XI.Fill('stats','Stats',XS.File('db/stringStats.txt','open'),1);
		XU.CenterElement('stats','b');
		dashboard_money.innerHTML   = '$' + current_data[2];
		dashboard_cards.innerHTML   = Deck.GrandTotal();
		dashboard_crets.innerHTML   = Deck.CretSize();
		dashboard_wlratio.innerHTML = current_data[5]+'/'+current_data[6];

		XI.Fill('lastmission','Last Mission Summary',XS.File('db/stringLastMission.txt','open'),1);
		XU.CenterElement('lastmission','v');
		lastmission_name.innerHTML    = mission_list[current_data[7].split(':')[0]][0];
		lastmission_outcome.innerHTML = current_data[7].split(':')[1];
		lastmission_reward.innerHTML  = mission_list[current_data[7].split(':')[0]][1];

		XI.Fill('utility','Version Info',XS.File('db/stringVersionInfo.txt','open'),1);
		XU.CenterElement('utility','v');
		XU.DFR('utility',10);

		XI.Fill('actions','Actions',XS.File('db/stringActionsMenu.txt','open'),1);
		XU.CenterElement('actions','h');
		XU.DFB('actions',10);
		XI.Hide('pagecount');
		XU.El('utility_a').innerHTML = gamever+"."+(XS.File('war.hta','size')/10).toFixed(0);
		XU.El('utility_b').innerHTML = ""+card_list[0][3]+"."+Math.round(card_list.length-1);
		XU.El('utility_c').innerHTML = ""+cret_list[0][3]+"."+Math.round(cret_list.length-1);
	}
};