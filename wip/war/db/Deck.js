var Deck = {
	Ini:function(){
		pagenum     = 0;
		winlocation = 'deck';
		deck_index  = -4;
		XI.Hide('stats');
		XI.Hide('lastmission');
		XI.Hide('utility');
		XI.Hide('actions');
		XI.Show('pagecount');
		XI.Show('arrnext');
		XU.DFB('arrnext',100);
		XU.DFB('pagecount',5);
		XU.El('pagecount').style.left = 5;
		XU.DFR('arrnext',0);
		XI.ZIndex('arrnext',100);
		XI.Hide('arrback');
		XU.DFB('arrback',150);
		XU.El('arrback').style.left = 0;
		XI.ZIndex('arrback',100);
		for (i=0;i<=4;i++){
			var calc = Math.round((i+1)*8+(210*i)+((document.body.clientWidth-1116)/2));
			XI.Show('c'+i);		
			XU.DFB('c'+i,10);
			XU.El('c'+i).style.left = calc;
			XI.Show('ic'+i);		
			XU.DFB('ic'+i,300);
			XU.El('ic'+i).style.left = calc;
		}
		Deck.ScrollRight();
	},
	DrawCardContainers:function(it){
		for (i=0;i<=it-1;i++){
			draw_index[0]++;
			XI.New('mainwindow','c'+draw_index[0],'1:1','285:230',0);
			XI.Fill('c'+draw_index[0],'<img src="cardpics/aether2.png"><font color="white">?&nbsp;&nbsp;&nbsp;</font>???',XS.File('db/stringCardTemplate.txt','open').replace('carddes','carddes'+draw_index[0]).replace('cardpic','cardpic'+draw_index[0]));
		}
	},
	DrawCardInfoContainers:function(it){
		for (i=0;i<=it-1;i++){
			draw_index[1]++;
			XI.New('mainwindow','ic'+draw_index[1],'1:1','130:230',0);
			XI.Fill('ic'+draw_index[1],'<center><img src="cardpics/more.png" onclick="Deck.CardAmt(this.value,1)" class="btnhw chand" id="deckadd'+draw_index[1]+'"><img src="cardpics/less.png" onclick="Deck.CardAmt(this.value,-1)" class="btnhw chand" id="deckrem'+draw_index[1]+'"></center>',XS.File('db/stringStatTemplate.txt','open').replace('indeck','indeck'+draw_index[1]).replace('inlibrary','inlibrary'+draw_index[1]).replace('totalown','totalown'+draw_index[1]));
		}
	},
	LoadCard:function(it2,it,it3){
		var tempcolor = 'white';
		if (Deck.CardLookup(it,'type') == 'U'){
			tempcolor = '#B5E61D';
		}else if (Deck.CardLookup(it,'type') == 'R'){
			tempcolor = 'yellow';
		}
		document.getElementById('cardpic'+it2).style.background = 'url("cardpics/'+Deck.CardLookup(it,'image')+'")';
		document.getElementById('carddes'+it2).innerHTML        = Deck.CardLookup(it,'description');
		if (it!=0){
			XI.Title('c'+it2,'<img src="cardpics/aether_'+Deck.CardLookup(it,'type')+'.png"><font color="'+tempcolor+'">'+Deck.CardLookup(it,'aether')+'&nbsp;&nbsp;&nbsp;</font><font size=2>'+Deck.CardLookup(it,'name')+'</font>');
		}else{
			if (Deck.CardLookup(it3,'type') == 'U'){
				tempcolor = '#B5E61D';
			}else if (Deck.CardLookup(it3,'type') == 'R'){
				tempcolor = 'yellow';
			}
			XI.Title('c'+it2,'<img src="cardpics/aether_'+Deck.CardLookup(it3,'type')+'.png"><font color="'+tempcolor+'">'+Deck.CardLookup(it,'aether')+'&nbsp;&nbsp;&nbsp;</font><font size=2>'+Deck.CardLookup(it,'name')+'</font>');
		}
		XI.Show('c'+it2);
	},
	ScrollRight:function(){
		if (deck_index+5<=card_list.length-1){
			pagenum++;
			if (deck_index>=1){
				XI.Show('arrback');
			}
			deck_index-=-5;
			Deck.ScrollSub(i);
		}if (deck_index+5>=card_list.length-2){
			XI.Hide('arrnext');
		}
	},
	ScrollLeft:function(){
		if (deck_index>=2){
			pagenum--;
			XI.Show('arrnext');
			deck_index-=5;
			Deck.ScrollSub();
		}if (deck_index<=2){
			XI.Hide('arrback');
		}		
	},
	ScrollSub:function(it){
		for (i=0;i<=4;i++){
			if (current_deck[deck_index+i-1]>=1 || card_library[deck_index+i-1]>=1){
				if (it!=1){
					Deck.LoadCard(i,deck_index+i);
				}
				XI.Show('ic'+i);
				XU.El('deckadd'+i).value       = deck_index+i;
				XU.El('indeck'+i).innerHTML    = current_deck[deck_index+i-1]+'/'+Deck.CardLookup(deck_index+i,'allowed');
				XU.El('inlibrary'+i).innerHTML = card_library[deck_index+i-1];
				XU.El('totalown'+i).innerHTML  = Math.round(parseInt(card_library[deck_index+i-1])+parseInt(current_deck[deck_index+i-1]));
				XU.El('deckrem'+i).value       = deck_index+i;
			}else{
				Deck.LoadCard(i,0,deck_index+i);
				XI.Hide('ic'+i);
			}
		}
		Deck.CardSize();
		pagecount.innerHTML = '<font color="black" size=2>' + pagenum + '/'+Math.round((card_list.length-2)/5)+'</font>';
	},
	Cleanup:function(){
		if (winlocation == 'deck'){
			XI.Hide('arrback');
			XI.Hide('arrnext');
			for (i=0;i<=4;i++){
				XI.Hide('c'+i);
				XI.Hide('ic'+i);
			}
		}
	},
	BlankLibrary:function(){
		for (i=0;i<=card_library.length-1;i++){
			card_library[i] = 0;

		}
		for (i=0;i<=incardstore.length-1;i++){
			if (incardstore[i]>=1){
				incardstore[i] = 1;
			}
		}
		for (i=0;i<=cret_library.length-1;i++){
			cret_library[i] = 0;
		}
	},
	CardAmt:function(it,it2){
		if (it2>=1){
			if (card_library[it-1]>=1 && current_deck[it-1]<=Deck.CardLookup(it-1,'allowed')-1){
				current_deck[it-1] -=- it2;
				card_library[it-1] -= it2;
				Deck.ScrollSub(1);
			}
		}else{
			if (current_deck[it-1]>=1){
				current_deck[it-1] -=- it2;
				card_library[it-1] -= it2;
				Deck.ScrollSub(1);
			}
		}
	},
	CardSize:function(){
		var total = 0;
		for (i=0;i<=current_deck.length-1;i++){
			total -=- current_deck[i];
		}
		if (winlocation == 'deck'){
			XI.Title('multiuse','Deck - '+total+'/50');
		}
		return total;
	},
	CretSize:function(){
		var total = 0;
		for (i=0;i<=cret_library.length-1;i++){
			total -=- cret_library[i];
		}
		return total;
	},
	GrandTotal:function(){
		var total = 0;
		for (i=0;i<=card_library.length-1;i++){
			total -=- card_library[i];
		}
		current_data[3] = Math.round(Deck.CardSize()+total);
		return current_data[3];
	},
	CardLookup:function(it,it2){
		if (it<=card_list.length-1 && it>=0 && Math.round(it*1)==it){
			if (it2=='name'){
				return card_list[it][0];
			}else if (it2=='image'){
				return card_list[it][1];
			}else if (it2=='aether'){
				return card_list[it][2];
			}else if (it2=='buy'){
				return card_list[it][3];
			}else if (it2=='sell'){
				return card_list[it][4];
			}else if (it2=='pack'){
				return card_list[it][5];
			}else if (it2=='type'){
				return card_list[it][6];
			}else if (it2=='command'){
				return card_list[it][7];
			}else if (it2=='description'){
				return card_list[it][8];
			}else if (it2=='indeck'){
				return current_deck[it];
			}else if (it2=='inlib'){
				return card_library[it];
			}else if (it2=='total'){
				return Math.round(parseInt(card_library[it])+parseInt(current_deck[it]));
			}else if (it2=='allowed'){
				if (card_list[it][6] == 'C'){
					return 4;
				}else if (card_list[it][6] == 'U'){
					return 2;
				}else if (card_list[it][6] == 'R'){
					return 1;
				}
			}
		}
	},
	CretLookup:function(it,it2){
		if (it<=cret_list.length-1 && it>=0 && Math.round(it*1)==it){
			if (it2=='name'){
				return cret_list[it][0];
			}else if (it2=='image'){
				return cret_list[it][1];
			}else if (it2=='atk'){
				return cret_list[it][2];
			}else if (it2=='def'){
				return cret_list[it][3];
			}else if (it2=='buy'){
				return cret_list[it][4];
			}else if (it2=='sell'){
				return cret_list[it][5];
			}else if (it2=='type'){
				return cret_list[it][6];
			}else if (it2=='command'){
				return cret_list[it][7];
			}else if (it2=='description'){
				return cret_list[it][8];
			}else if (it2=='total'){
				return cret_library[it];
			}
		}
	},
	LoadCret:function(it2,it,it3){
		document.getElementById('cardpic'+it2).style.background = 'url("cretpics/'+Deck.CretLookup(it,'image')+'")';
		document.getElementById('carddes'+it2).innerHTML        = Deck.CretLookup(it,'description');
		if (it!=0){
			XI.Title('c'+it2,'<font size=2>'+Deck.CretLookup(it,'name')+'</font>');
		}else{
			XI.Title('c'+it2,'<font size=2>'+Deck.CretLookup(it,'name')+'</font>');
		}
		XI.Show('c'+it2);
	}
};