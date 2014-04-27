var Check = {
	IllegalMove:function(it,it2){
		var tdata = new Array(2);
		tdata[0] = it.split('');
		tdata[1] = it2.split('');
		if (App.SpotInfo(it,'piece') == 1){ //pawn
			if (Math.round(tdata[0][1]-tdata[1][1])<=0 && sett[2]==2 && App.SpotInfo(it,'owner')==1){ //backwards
				return false;
			}
			else if (Math.round(tdata[0][1]-tdata[1][1])>=0 && sett[2]==2 && App.SpotInfo(it,'owner')==2){ //backwards
				return false;
			}
			else if (Math.round(tdata[0][1]-tdata[1][1])<=0 && sett[2]==1 && App.SpotInfo(it,'owner')==2){ //backwards
				return false;
			}
			else if (Math.round(tdata[0][1]-tdata[1][1])>=0 && sett[2]==1 && App.SpotInfo(it,'owner')==1){ //backwards
				return false;
			}
			//2nd move single
			else if (tdata[0][1]!=2 && Math.abs(tdata[1][1]-tdata[0][1])!=1){
				return false;
			}
			//1st move single or double
			else if (tdata[0][1] == 2 && Math.abs(tdata[1][1]-tdata[0][1])>=3){
				return false;
			}
			//prevent jump of pieces double
			else if (tdata[0][1] == 2 && Math.abs(tdata[1][1]-tdata[0][1])==2 && App.SpotInfo(tdata[0][0]+Math.round(parseInt(tdata[0][1])+1),'owner')!=0){
				return false;
			}
			else if ((tdata[1][0]!=tdata[0][0] && Math.abs(noman.indexOf(tdata[1][0])-noman.indexOf(tdata[0][0]))!=1) || (tdata[1][0]!=tdata[0][0] && App.SpotInfo(it2,'owner')==0) || (tdata[1][0]!=tdata[0][0] && Math.abs(tdata[1][1]-tdata[0][1])!=1)){
				return false;
			}
			else if (tdata[1][0]==tdata[0][0] && App.SpotInfo(it2,'owner')!=0){ //prevent foward take
				return false;
			}
		}
		else if (App.SpotInfo(it,'piece') == 2){ //castle
			if (tdata[1][1]!=tdata[0][1] && tdata[1][0]!=tdata[0][0]){ //diag
				return false;
			}
			else if (tdata[1][0] == tdata[0][0]){ //vert
				tdata[2] = 0;
				if (tdata[0][1]<tdata[1][1]){
					for (a=Math.round(parseInt(tdata[0][1])+1);a<=tdata[1][1]-1;a++){ //right
						if (App.SpotInfo(tdata[0][0]+a,'piece')!=0){
							tdata[2] = 1;
						}
					}
				}else{
					for (a=tdata[0][1]-1;a>=Math.round(parseInt(tdata[1][1])+1);a--){ //left
						if (App.SpotInfo(tdata[0][0]+a,'piece')!=0){
							tdata[2] = 1;
						}
					}
				}
			}
			else if (tdata[1][1] == tdata[0][1]){ //horiz
				tdata[2] = 0;
				if (noman.indexOf(tdata[0][0])<noman.indexOf(tdata[1][0])){
					for (a=noman.indexOf(tdata[0][0])+1;a<=noman.indexOf(tdata[1][0])-1;a++){ //up
						if (App.SpotInfo(noman[a]+tdata[0][1],'piece')!=0){
							tdata[2] = 1;
						}
					}
				}else{
					for (a=noman.indexOf(tdata[0][0])-1;a>=noman.indexOf(tdata[1][0])+1;a--){ //down
						if (App.SpotInfo(noman[a]+tdata[0][1],'piece')!=0){
							tdata[2] = 1;
						}
					}
				}
			}
			if (tdata[2] == 1){
				return false;
			}
		}
		else if (App.SpotInfo(it,'piece') == 3){ //horse
			if (Math.abs(tdata[0][1]-tdata[1][1])==2){
				if (Math.abs(tdata[0][1]-tdata[1][1])!=2 || Math.abs(noman.indexOf(tdata[0][0])-noman.indexOf(tdata[1][0]))!=1){
					return false;
				}
			}else{
				if (Math.abs(tdata[0][1]-tdata[1][1])!=1 || Math.abs(noman.indexOf(tdata[0][0])-noman.indexOf(tdata[1][0]))!=2){
					return false;
				}
			}
		}
		else if (App.SpotInfo(it,'piece') == 4){ //bishop
			if (tdata[1][1]==tdata[0][1] || tdata[1][0]==tdata[0][0] || Math.abs(tdata[0][1]-tdata[1][1])!=Math.abs(noman.indexOf(tdata[0][0])-noman.indexOf(tdata[1][0]))){
				return false;	
			}
			else if (tdata[1][1] > tdata[0][1]){ //up
				tdata[2] = 0;
				tdata[3] = 0;
				if (noman.indexOf(tdata[1][0])>=noman.indexOf(tdata[0][0])){
					for (a=Math.round(parseInt(tdata[0][1])+1);a<=tdata[1][1]-1;a++){
						tdata[3]++;
						if (App.SpotInfo(noman[noman.indexOf(tdata[0][0])+tdata[3]]+a,'piece')!=0){
							tdata[2] = 1;
						}
					}
				}else{
					for (a=Math.round(parseInt(tdata[0][1])+1);a<=tdata[1][1]-1;a++){
						tdata[3]--;
						if (App.SpotInfo(noman[noman.indexOf(tdata[0][0])+tdata[3]]+a,'piece')!=0){
							tdata[2] = 1;
						}
					}
				}
			}else{
				tdata[2] = 0;
				tdata[3] = 0;
				if (noman.indexOf(tdata[1][0])>=noman.indexOf(tdata[0][0])){
					for (a=tdata[0][1]-1;a>=parseInt(tdata[1][1])+1;a--){
						tdata[3]++;
						if (App.SpotInfo(noman[noman.indexOf(tdata[0][0])+tdata[3]]+a,'piece')!=0){
							tdata[2] = 1;
						}
					}
				}else{
					for (a=tdata[0][1]-1;a>=parseInt(tdata[1][1])+1;a--){
						tdata[3]--;
						if (App.SpotInfo(noman[noman.indexOf(tdata[0][0])+tdata[3]]+a,'piece')!=0){
							tdata[2] = 1;
						}
					}
				}
			}
			if (tdata[2] == 1){
				return false;
			}
		}
		else if (App.SpotInfo(it,'piece') == 5){ //queen
			if (tdata[1][1]!=tdata[0][1] && tdata[1][0]!=tdata[0][0]){ //diag
				if (tdata[1][1]==tdata[0][1] || tdata[1][0]==tdata[0][0] || Math.abs(tdata[0][1]-tdata[1][1])!=Math.abs(noman.indexOf(tdata[0][0])-noman.indexOf(tdata[1][0]))){
					return false;	
				}
				else if (tdata[1][1] > tdata[0][1]){ //up
					tdata[2] = 0;
					tdata[3] = 0;
					if (noman.indexOf(tdata[1][0])>=noman.indexOf(tdata[0][0])){
						for (a=Math.round(parseInt(tdata[0][1])+1);a<=tdata[1][1]-1;a++){
							tdata[3]++;
							if (App.SpotInfo(noman[noman.indexOf(tdata[0][0])+tdata[3]]+a,'piece')!=0){
								tdata[2] = 1;
							}
						}
					}else{
						for (a=Math.round(parseInt(tdata[0][1])+1);a<=tdata[1][1]-1;a++){
							tdata[3]--;
							if (App.SpotInfo(noman[noman.indexOf(tdata[0][0])+tdata[3]]+a,'piece')!=0){
								tdata[2] = 1;
							}
						}
					}
				}else{
					tdata[2] = 0;
					tdata[3] = 0;
					if (noman.indexOf(tdata[1][0])>=noman.indexOf(tdata[0][0])){
						for (a=tdata[0][1]-1;a>=parseInt(tdata[1][1])+1;a--){
							tdata[3]++;
							if (App.SpotInfo(noman[noman.indexOf(tdata[0][0])+tdata[3]]+a,'piece')!=0){
								tdata[2] = 1;
							}
						}
					}else{
						for (a=tdata[0][1]-1;a>=parseInt(tdata[1][1])+1;a--){
							tdata[3]--;
							if (App.SpotInfo(noman[noman.indexOf(tdata[0][0])+tdata[3]]+a,'piece')!=0){
								tdata[2] = 1;
							}
						}
					}
				}
				if (tdata[2] == 1){
					return false;
				}
			}
			else if (tdata[1][0] == tdata[0][0]){ //vert
				tdata[2] = 0;
				if (tdata[0][1]<tdata[1][1]){
					for (a=Math.round(parseInt(tdata[0][1])+1);a<=tdata[1][1]-1;a++){ //right
						if (App.SpotInfo(tdata[0][0]+a,'piece')!=0){
							tdata[2] = 1;
						}
					}
				}else{
					for (a=tdata[0][1]-1;a>=Math.round(parseInt(tdata[1][1])+1);a--){ //left
						if (App.SpotInfo(tdata[0][0]+a,'piece')!=0){
							tdata[2] = 1;
						}
					}
				}
			}
			else if (tdata[1][1] == tdata[0][1]){ //horiz
				tdata[2] = 0;
				if (noman.indexOf(tdata[0][0])<noman.indexOf(tdata[1][0])){
					for (a=noman.indexOf(tdata[0][0])+1;a<=noman.indexOf(tdata[1][0])-1;a++){ //up
						if (App.SpotInfo(noman[a]+tdata[0][1],'piece')!=0){
							tdata[2] = 1;
						}
					}
				}else{
					for (a=noman.indexOf(tdata[0][0])-1;a>=noman.indexOf(tdata[1][0])+1;a--){ //down
						if (App.SpotInfo(noman[a]+tdata[0][1],'piece')!=0){
							tdata[2] = 1;
						}
					}
				}
			}
			if (tdata[2] == 1){
				return false;
			}
		}
		else if (App.SpotInfo(it,'piece') == 6){ //king
			if (Math.abs(tdata[1][1]-tdata[0][1])>=2 || Math.abs(noman.indexOf(tdata[1][0])-noman.indexOf(tdata[0][0]))>=2){ //move any dir 1 space
				return false;
			}
		}
		return true;
	}
};