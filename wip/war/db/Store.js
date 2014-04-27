var Store = {
	Ini:function(){
		XI.Title('multiuse','Store - $'+current_data[2]);
		Deck.Cleanup();
		winlocation = 'store';
		XI.Hide('stats');
		XI.Hide('lastmission');
		XI.Hide('utility');
		XI.Hide('actions');
		XI.Hide('pagecount');
		XI.Fill('lastmission','Cards',XS.File('db/stringCardStore.txt','open'),1);
		XU.El('lastmission').style.top = 130;
		XU.El('lastmission').style.left = 10;
		XI.Fill('utility','Creatures',XS.File('db/stringCreatureStore.txt','open'),1);
		XU.El('utility').style.top = 130;
		XI.Fill('stats',XS.File('db/stringBuySell.txt','open'),XS.File('db/stringPurchaseInfo.txt','open'),1);
		storebtnbuy.it = -1;
		XU.CenterElement('stats','h');
		XU.DFB('stats',5);
		XU.DFR('utility',10);
		Store.FillLists();
		Deck.LoadCard(1,0,0);
		XI.Show('c1');
		XU.CenterElement('c1','b');
	},
	FillLists:function(){
		var temp = 0;
		for (i=1;i<=card_list.length-1;i++){
			if (incardstore[i-1]>=1){
				temp       = document.createElement('option');
				temp.text  = Deck.CardLookup(i,'name');
				temp.value = i;
				cardstorelist.options.add(temp);
			}
		}		
		for (i=1;i<=cret_list.length-1;i++){
			if (incretstore[i-1]>=1){
				temp       = document.createElement('option');
				temp.text  = Deck.CretLookup(i,'name');
				temp.value = i;
				cretstorelist.options.add(temp);
			}
		}
	},
	ShowItem:function(it,itype){
		if (itype == 1){
			Deck.LoadCard(1,it);
			storebtnbuy.it   = it;
			storebtnbuy.it2  = itype;
			picost.innerHTML = '$'+Deck.CardLookup(it,'buy');
			pisell.innerHTML = '$'+Deck.CardLookup(it,'sell');
			piown.innerHTML  = Deck.CardLookup(it-1,'total');
			piuse.innerHTML  = Deck.CardLookup(it-1,'indeck')+'/'+Deck.CardLookup(it,'allowed');
		}else if (itype == 2){
			Deck.LoadCret(1,it);
			storebtnbuy.it   = it;
			storebtnbuy.it2  = itype;
			picost.innerHTML = '$'+Deck.CretLookup(it,'buy');
			pisell.innerHTML = '$'+Deck.CretLookup(it,'sell');
			piown.innerHTML  = Deck.CretLookup(it-1,'total');
			piuse.innerHTML  = 'No';
			if (current_data[8] == it){
				piuse.innerHTML  = 'Yes';
			}
		}
	},
	Sell:function(){
		var it   = storebtnbuy.it;
		var ityp = storebtnbuy.it2;
		if (ityp == 1){
			if (Deck.CardLookup(it-1,'total')!=0){
				if (Deck.CardSize()==50){
					if (Deck.CardLookup(it-1,'inlib')>=1){
						if (confirm('Sell 1 copy of this card?')){
							card_library[it-1] -= 1;
							current_data[2] -=- parseInt(Deck.CardLookup(it,'sell'));
							Store.ShowItem(it,1);
							XI.Title('multiuse','Store - $'+current_data[2]);
						}
					}else{
						if (it!=-1){
							XM.Alert('Oops...','You don\'t have unused copies of the card to sell.<br>Remove the card from your deck if you want to sell it.');
						}
					}
				}else{
					XM.Alert('Oops...','You can\'t sell cards until you have a deck of 50 cards.');
				}
			}else{

			}
		}else if (ityp == 2){
			if (Deck.CretLookup(it-1,'total')!=0){
				if (Deck.CretSize()>=2){
					if ((Deck.CretLookup(it-1,'total')==1 && current_data[8]!=it) || Deck.CretLookup(it-1,'total')>=2){
						if (confirm('Sell 1 copy of this creature?')){
							cret_library[it-1] -= 1;
							current_data[2] -=- parseInt(Deck.CretLookup(it,'sell'));
							Store.ShowItem(it,2);
							XI.Title('multiuse','Store - $'+current_data[2]);	
						}
					}else{
						XM.Alert('Oops...','You don\'t have unused copies of the creture to sell.<br>Remove the creature as your active if you want to sell it.');
					}
				}else{
					XM.Alert('Oops...','You can\'t sell your only creature.');
				}	
			}else{
				
			}
		}
		
	},
	Buy:function(){
		var it = storebtnbuy.it;
		var ityp = storebtnbuy.it2;
		if (ityp == 1){
			if (current_data[2] >= parseInt(Deck.CardLookup(it,'buy'))){
				if (confirm('Purchase 1 copy of this card?')){
					card_library[it-1] -=- 1;
					current_data[2] -= parseInt(Deck.CardLookup(it,'buy'));
					Store.ShowItem(it,1);
					XI.Title('multiuse','Store - $'+current_data[2]);
				}
			}else{
				XM.Alert('Oops...','You don\'t have enough money.')
			}
		}else if (ityp == 2){
			if (current_data[2] >= parseInt(Deck.CretLookup(it,'buy'))){
				if (confirm('Purchase 1 copy of this creature?')){
					cret_library[it-1] -=- 1;
					current_data[2] -= parseInt(Deck.CretLookup(it,'buy'));
					Store.ShowItem(it,2);
					XI.Title('multiuse','Store - $'+current_data[2]);
				}
			}else{
				XM.Alert('Oops...','You don\'t have enough money.');
			}		
		}
	}
};