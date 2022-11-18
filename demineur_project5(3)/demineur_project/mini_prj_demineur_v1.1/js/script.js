/* On attend que le DOM soit totalement chargé */
document.addEventListener("DOMContentLoaded", function() {
	Demineur.initialise();

	$(".menu").click(function(){
		$("#plateau").removeClass("hide");
		$("#result").removeClass("active");

		 var id = this.id;
		 Demineur.startGame(id);
	});

	$("#help_btn").click(function(){
		affiche_aide();
	});
	
	$("body").click(function(){
		aide_close();
	});
});

var timer = false;
	var count = 0;
	setInterval(function () {
	if (timer) {
		$('#timer').text(("⏱️: 00" + count).slice(-3));
		count++;
	}
}, 1000);

var Demineur = {
	name: 'Demineur',
//DONNEES DES DIFFICULTE///
	difficulties: {
		easy: {
			lines: 8,
			columns: 8,
			mines: 10,
		},
		normal: {
			lines: 12,
			columns: 12,
			mines: 20,
		},
		hard: {
			lines: 16,
			columns: 16,
			mines: 32,
		},
		extreme: {
			lines: 20,
			columns: 20,
			mines: 48,
		},
	},

	settings: {

	},
    
///CREATION DU TABLEAU ////
	game: {
		status: 0,
		field: new Array(),
	},
///INITIALISATION DU JEU AVEC UNE DIFFICULTE ///
	initialise: function() {
		this.startGame('easy');
		timer=false;
		count=0;
	},
///DEMARRER LE JEU EN FONCTION DE LA DIFFICULTE///
	startGame: function(difficulty) {
		this.settings = this.difficulties[difficulty];
		this.drawGameBoard();
		this.resetGame();
	},
	//CREATION DU PLATEAU DE JEU EN FONCTION DE LA DIFFICULTE//
	drawGameBoard: function() {
		var table=""
		var board = $('#plateau'); //RECUPERATION DE L'ELEMENT PLATEAU DANS LE HTML//

		board.empty()
		$('#result').html('') ;

		table=$('<table class="field" oncontextmenu="return false;">'); //REPRESENTE LE CONTOURS DU TABLEAU //
		// table.attr('oncontextmenu', 'return false;');
		field = $('<tbody>'); //REPRESENTE LE CONTENU DU TABLEAU //
		table.append(field); // LIE LES DEUX PARTIT DU TABLEAU // 
		// table.Class('field');

		board.append(table);

		for (i = 1; i <= this.settings['lines']; i++) { //RECUPERATION DE LA DONNE LIGNE EN FONCTION DE LA DIFFICULTE//
			line = $('<tr>');

			for (j = 1; j <= this.settings['columns']; j++) {
				cell = $('<td id ="cell-'+i+'-'+j+'"'+'class="cell" >');
				cell.attr('onclick', this.name+'.checkPosition('+i+', '+j+', true);'); //CLIC GAUCHE INTERACTION //
				cell.attr('oncontextmenu', this.name+'.markPosition('+i+', '+j+'); return false;');//CLIC DROIT POUR MARQUAGE//
				line.append(cell);
			}
			field.append(line);
			//line.wrapAll(field)
		}
		count=0;
		timer=false
		$('#bombes').html(this.settings['mines'])
   
	},

	resetGame: function() {

		// CREATION DU CHAMPS VIDE 
		this.game.field = new Array();
		for (i = 1; i <= this.settings['lines']; i++) {
			this.game.field[i] = new Array();
			for (j = 1; j <= this.settings['columns']; j++) {
				this.game.field[i][j] = 0;   
			}
		}

		// AJOUT DES MINES 
		for (i = 1; i <= this.settings['mines']; i++) {
			// PLACEMENT DES MINE ALEATOIREMENT 
			x = Math.floor(Math.random() * (this.settings['columns']-1) + 1);
			y = Math.floor(Math.random() * (this.settings['lines']-1) + 1);

			while (this.game.field[x][y] == -1) {
				x = Math.floor(Math.random() * (this.settings['columns'] - 1) + 1);
				y = Math.floor(Math.random() * (this.settings['lines'] - 1) + 1);
			}
			this.game.field[x][y] = -1;

			/* MISE A JOUR DES DONNEE ADJACENTE */
			for (j = x-1; j <= x+1; j++) {
				if (j == 0 || j == (this.settings['columns'] + 1))
					continue;
				for (k = y-1; k <= y+1; k++) {
					if (k == 0 || k == (this.settings['lines'] + 1))
						continue;
					if (this.game.field[j][k] != -1)
						this.game.field[j][k] ++;
				}
			}
		}

		/*DEFINITION DU STATUS DU JEU*/
		this.game.status = 1;
	},

	checkPosition: function(x, y, check) {
		timer=true;

		/* VERIFICATION DU FONCTIONNEMENT */
		if (this.game.status != 1)
			return;

		/* VERIFICATION SI LA CELLULE A DEJA ETE VISITE  */
		if (this.game.field[x][y] == -2) {
			return;
		}

		/* VERIFIER SI LA CELLULE EST MARQUE */
		if (this.game.field[x][y] < -90) {
			return;
		}

		/* VERIFIER SI LA CELLULE EST UNE MINE*/
		if (this.game.field[x][y] == -1) {
            $( "#cell-"+x+'-'+y ).addClass( "cell bomb" );
            $("#cell-"+x+'-'+y).html('💣');
            this.displayLose();
            return;
        }

		/* MARQUE LA CELLULE COMME VERIFIER */
		$( "#cell-"+x+'-'+y ).addClass( "cell clear" );
        if (this.game.field[x][y] > 0) {
            /* MARQUE LE NOMBRE DE MINE DES CELLULE ADJACENTE */
            $( "#cell-"+x+'-'+y  ).html(this.game.field[x][y]);

            /* MARQUE LA CASE COMME VISITE  */
            this.game.field[x][y] = -2;
        } else if (this.game.field[x][y] == 0) {
           
            this.game.field[x][y] = -2;

			/*DEVOILE LES CELLULES ADJACENTES*/ ////+1 et -1 represente les case adjacente sur les ligne et colonne jusqua la decouverte d'une case contenant une mine //
			for (var j = x-1; j <= x+1; j++) {
				if (j == 0 || j == (this.settings['columns'] + 1))
					continue;
				for (var k = y-1; k <= y+1; k++) {
					if (k == 0 || k == (this.settings['lines'] + 1))
						continue;
					if (this.game.field[j][k] > -1) {
						this.checkPosition(j, k, false);
					}
				}
			}
		}

		/* VERIFICATION DE VICTOIRE*/
		if (check !== false)
			this.checkWin();
	},

	// MARQUAGE DES CELLULES/////
	//0 CASE VIDE 
	//-1 MINE 
	//-2 CASE VISITE 
	//-100 CASE MARQUE 
	//
	markPosition: function(x, y) {

		/* VERIFICATION DU FONCTIONNEMENT DU JEU  */
		if (this.game.status != 1)
			return;

		/* VERIFIE SI LA CELLULE EST DEJA VISITE */
		if (this.game.field[x][y] == -2)
			return;

		if (this.game.field[x][y] < -90) {
			/* RETIRE LE MARQUAGE*/
			$("#cell-'"+x+"-"+y).addClass('cell') ;
			$("#cell-'"+x+"-"+y).empty();// document.getElementById('cell-'+x+'-'+y).innerHTML = '';
			this.game.field[x][y] += 100;
		} else {
			/* APPLIQUE LA MARQUAGE */
			document.getElementById('cell-'+x+'-'+y).className = 'cell marked';
			document.getElementById('cell-'+x+'-'+y).innerHTML = '🏳️';
			this.game.field[x][y] -= 100;
		}
	},

	//VERIFICATION DE VICTOIRE ///
	/*checkWin: function() {
		// VERIFICATION DE TOUTES LES CASES 
		for (var i = 1; i <= this.settings['lines']; i++) {
			for (var j = 1; j <= this.settings['columns']; j++) {
				v = this.game.field[i][j];
				if (v != -1 && v != -2 && v != -101)
					return;
			}
		}

		//SI AUCUNE CASE N'EST BLOQUANTE AFFICHER LA VICTOIRE 
		this.displayWin();
	},*/
	
     // Verification de victoire en utilisant promise
	checkWin: function() {
		var promise = new Promise(function(resolve,reject)
		{
          // VERIFICATION DE TOUTES LES CASES 
		for (var i = 1; i <= this.settings['lines']; i++) {
			for (var j = 1; j <= this.settings['columns']; j++) {
				v = this.game.field[i][j];
				if (v != -1 && v != -2 && v != -101)
				{
					resolve("ok")
					return;
				}
				else{
					reject(Error("Echec après vérification"))
				}			
			}
		}
		
		})
		promise.then(function(resultat)
		{
			if(resultat=="ok")
			{
				this.displayWin()
			}
		});
		// si le condition sont bon resolve ok
		// si ne sont pas bon reject
	},


	displayWin: function() {
		// AFFICHAGE DE VICTOIRE 
		$("#plateau").addClass("hide");

		$("#result").addClass("active");
		$("#result").html('<div id="content"><h3>Gagné</h3><p>' + count + '</p></div>');
		$("#result").css('color', '#43b456');

		timer=false
		// CHANGE LE STATUT DU JEU A TERMINER 
		this.game.status = 0;
	},

	displayLose: function() {
		//AFFICHAGE DEFAITE
		$("#plateau").addClass("hide");

		$("#result").addClass("active");
		$("#result").html('<div id="content"><h3>Perdu</h3><p>' + count + '</p></div>');
		$("#result").css('color', '#CC3333');

		timer=false
		// CHANGE LE STATUT DU JEU A TERMINER 
		this.game.status = 0;
	},
};

/*each à la place des "for" */

/* Affiche l'aide */
function affiche_aide() {
	$.ajax({
		url: "./aide.html",
		type: "GET",
		cache: true,
		success: function(response){
			$("#aide").addClass("active");
			$('#aide').html(response);
		}
	})
};

function aide_close() {
	$("#aide").removeClass("active");
	$("#aide").html('');
};


