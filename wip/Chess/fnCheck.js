var Check = {
	IllegalMove:function(it,it2){
		tempdata[0] = it.split('');
		tempdata[1] = it2.split('');
		if (App.SpotInfo(it,'piece') == 1){ //pawn
			if (Math.round(tempdata[0][1]-tempdata[1][1])<=0 && mycolor==2 && App.SpotInfo(it,'owner')==1){ //backwards
				//App.CancelMove();
				return false;
			}
			else if (Math.round(tempdata[0][1]-tempdata[1][1])>=0 && mycolor==2 && App.SpotInfo(it,'owner')==2){ //backwards
				//App.CancelMove();
				return false;
			}
			else if (Math.round(tempdata[0][1]-tempdata[1][1])<=0 && mycolor==1 && App.SpotInfo(it,'owner')==2){ //backwards
				//App.CancelMove();
				return false;
			}
			else if (Math.round(tempdata[0][1]-tempdata[1][1])>=0 && mycolor==1 && App.SpotInfo(it,'owner')==1){ //backwards
				//App.CancelMove();
				return false;
			}
			//2nd move single
			else if (tempdata[0][1]!=2 && Math.abs(tempdata[1][1]-tempdata[0][1])!=1){
				//App.CancelMove();
				return false;
			}
			//1st move single or double
			else if (tempdata[0][1] == 2 && Math.abs(tempdata[1][1]-tempdata[0][1])>=3){
				//App.CancelMove();
				return false;
			}
			else if ((tempdata[1][0]!=tempdata[0][0] && Math.abs(noman.indexOf(tempdata[1][0])-noman.indexOf(tempdata[0][0]))!=1) || (tempdata[1][0]!=tempdata[0][0] && App.SpotInfo(it2,'owner')==0) || (tempdata[1][0]!=tempdata[0][0] && Math.abs(tempdata[1][1]-tempdata[0][1])!=1)){ 
				//App.CancelMove();
				return false;
			}
			else if (tempdata[1][0]==tempdata[0][0] && App.SpotInfo(it2,'owner')!=0){ //prevent foward take
				//App.CancelMove();
				return false;
			}
		}
		else if (App.SpotInfo(it,'piece') == 2){ //castle
			if (tempdata[1][1]!=tempdata[0][1] && tempdata[1][0]!=tempdata[0][0]){ //diag
				//App.CancelMove();
				return false;
			}
			else if (tempdata[1][0] == tempdata[0][0]){ //vert
				tempdata[2] = 0;
				if (tempdata[0][1]<tempdata[1][1]){
					for (a=Math.round(parseInt(tempdata[0][1])+1);a<=tempdata[1][1]-1;a++){ //right
						if (App.SpotInfo(tempdata[0][0]+a,'piece')!=0){
							tempdata[2] = 1;
						}
					}
				}else{
					for (a=tempdata[0][1]-1;a>=Math.round(parseInt(tempdata[1][1])+1);a--){ //left
						if (App.SpotInfo(tempdata[0][0]+a,'piece')!=0){
							tempdata[2] = 1;
						}
					}
				}
			}
			else if (tempdata[1][1] == tempdata[0][1]){ //horiz
				tempdata[2] = 0;
				if (noman.indexOf(tempdata[0][0])<noman.indexOf(tempdata[1][0])){
					for (a=noman.indexOf(tempdata[0][0])+1;a<=noman.indexOf(tempdata[1][0])-1;a++){ //up
						if (App.SpotInfo(noman[a]+tempdata[0][1],'piece')!=0){
							tempdata[2] = 1;
						}
					}
				}else{
					for (a=noman.indexOf(tempdata[0][0])-1;a>=noman.indexOf(tempdata[1][0])+1;a--){ //down
						if (App.SpotInfo(noman[a]+tempdata[0][1],'piece')!=0){
							tempdata[2] = 1;
						}
					}
				}
			}
			if (tempdata[2] == 1){
				//App.CancelMove();
				return false;
			}
		}
		else if (App.SpotInfo(it,'piece') == 3){ //horse
			if (Math.abs(tempdata[0][1]-tempdata[1][1])==2){
				if (Math.abs(tempdata[0][1]-tempdata[1][1])!=2 || Math.abs(noman.indexOf(tempdata[0][0])-noman.indexOf(tempdata[1][0]))!=1){
					//App.CancelMove();
					return false;
				}
			}else{
				if (Math.abs(tempdata[0][1]-tempdata[1][1])!=1 || Math.abs(noman.indexOf(tempdata[0][0])-noman.indexOf(tempdata[1][0]))!=2){
					//App.CancelMove();
					return false;
				}
			}
		}
		else if (App.SpotInfo(it,'piece') == 4){ //bishop
			if (tempdata[1][1]==tempdata[0][1] || tempdata[1][0]==tempdata[0][0] || Math.abs(tempdata[0][1]-tempdata[1][1])!=Math.abs(noman.indexOf(tempdata[0][0])-noman.indexOf(tempdata[1][0]))){
				//App.CancelMove();
				return false;	
			}
			else if (tempdata[1][1] > tempdata[0][1]){ //up
				tempdata[2] = 0;
				tempdata[3] = 0;
				if (noman.indexOf(tempdata[1][0])>=noman.indexOf(tempdata[0][0])){
					for (a=Math.round(parseInt(tempdata[0][1])+1);a<=tempdata[1][1]-1;a++){
						tempdata[3]++;
						if (App.SpotInfo(noman[noman.indexOf(tempdata[0][0])+tempdata[3]]+a,'piece')!=0){
							tempdata[2] = 1;
						}
					}
				}else{
					for (a=Math.round(parseInt(tempdata[0][1])+1);a<=tempdata[1][1]-1;a++){
						tempdata[3]--;
						if (App.SpotInfo(noman[noman.indexOf(tempdata[0][0])+tempdata[3]]+a,'piece')!=0){
							tempdata[2] = 1;
						}
					}
				}
			}else{
				tempdata[2] = 0;
				tempdata[3] = 0;
				if (noman.indexOf(tempdata[1][0])>=noman.indexOf(tempdata[0][0])){
					for (a=tempdata[0][1]-1;a>=parseInt(tempdata[1][1])+1;a--){
						tempdata[3]++;
						if (App.SpotInfo(noman[noman.indexOf(tempdata[0][0])+tempdata[3]]+a,'piece')!=0){
							tempdata[2] = 1;
						}
					}
				}else{
					for (a=tempdata[0][1]-1;a>=parseInt(tempdata[1][1])+1;a--){
						tempdata[3]--;
						if (App.SpotInfo(noman[noman.indexOf(tempdata[0][0])+tempdata[3]]+a,'piece')!=0){
							tempdata[2] = 1;
						}
					}
				}
			}
			if (tempdata[2] == 1){
				//App.CancelMove();
				return false;
			}
		}
		else if (App.SpotInfo(it,'piece') == 5){ //queen
			if (tempdata[1][1]!=tempdata[0][1] && tempdata[1][0]!=tempdata[0][0]){ //diag
				if (tempdata[1][1]==tempdata[0][1] || tempdata[1][0]==tempdata[0][0] || Math.abs(tempdata[0][1]-tempdata[1][1])!=Math.abs(noman.indexOf(tempdata[0][0])-noman.indexOf(tempdata[1][0]))){
					//App.CancelMove();
					return false;	
				}
				else if (tempdata[1][1] > tempdata[0][1]){ //up
					tempdata[2] = 0;
					tempdata[3] = 0;
					if (noman.indexOf(tempdata[1][0])>=noman.indexOf(tempdata[0][0])){
						for (a=Math.round(parseInt(tempdata[0][1])+1);a<=tempdata[1][1]-1;a++){
							tempdata[3]++;
							if (App.SpotInfo(noman[noman.indexOf(tempdata[0][0])+tempdata[3]]+a,'piece')!=0){
								tempdata[2] = 1;
							}
						}
					}else{
						for (a=Math.round(parseInt(tempdata[0][1])+1);a<=tempdata[1][1]-1;a++){
							tempdata[3]--;
							if (App.SpotInfo(noman[noman.indexOf(tempdata[0][0])+tempdata[3]]+a,'piece')!=0){
								tempdata[2] = 1;
							}
						}
					}
				}else{
					tempdata[2] = 0;
					tempdata[3] = 0;
					if (noman.indexOf(tempdata[1][0])>=noman.indexOf(tempdata[0][0])){
						for (a=tempdata[0][1]-1;a>=parseInt(tempdata[1][1])+1;a--){
							tempdata[3]++;
							if (App.SpotInfo(noman[noman.indexOf(tempdata[0][0])+tempdata[3]]+a,'piece')!=0){
								tempdata[2] = 1;
							}
						}
					}else{
						for (a=tempdata[0][1]-1;a>=parseInt(tempdata[1][1])+1;a--){
							tempdata[3]--;
							if (App.SpotInfo(noman[noman.indexOf(tempdata[0][0])+tempdata[3]]+a,'piece')!=0){
								tempdata[2] = 1;
							}
						}
					}
				}
				if (tempdata[2] == 1){
					//App.CancelMove();
					return false;
				}
			}
			else if (tempdata[1][0] == tempdata[0][0]){ //vert
				tempdata[2] = 0;
				if (tempdata[0][1]<tempdata[1][1]){
					for (a=Math.round(parseInt(tempdata[0][1])+1);a<=tempdata[1][1]-1;a++){ //right
						if (App.SpotInfo(tempdata[0][0]+a,'piece')!=0){
							tempdata[2] = 1;
						}
					}
				}else{
					for (a=tempdata[0][1]-1;a>=Math.round(parseInt(tempdata[1][1])+1);a--){ //left
						if (App.SpotInfo(tempdata[0][0]+a,'piece')!=0){
							tempdata[2] = 1;
						}
					}
				}
			}
			else if (tempdata[1][1] == tempdata[0][1]){ //horiz
				tempdata[2] = 0;
				if (noman.indexOf(tempdata[0][0])<noman.indexOf(tempdata[1][0])){
					for (a=noman.indexOf(tempdata[0][0])+1;a<=noman.indexOf(tempdata[1][0])-1;a++){ //up
						if (App.SpotInfo(noman[a]+tempdata[0][1],'piece')!=0){
							tempdata[2] = 1;
						}
					}
				}else{
					for (a=noman.indexOf(tempdata[0][0])-1;a>=noman.indexOf(tempdata[1][0])+1;a--){ //down
						if (App.SpotInfo(noman[a]+tempdata[0][1],'piece')!=0){
							tempdata[2] = 1;
						}
					}
				}
			}
			if (tempdata[2] == 1){
				//App.CancelMove();
				return false;
			}
		}
		else if (App.SpotInfo(it,'piece') == 6){ //king
			if (Math.abs(tempdata[1][1]-tempdata[0][1])>=2 || Math.abs(noman.indexOf(tempdata[1][0])-noman.indexOf(tempdata[0][0]))>=2){ //move any dir 1 space
				//App.CancelMove();
				return false;
			}
		}
		return true;
	}
};