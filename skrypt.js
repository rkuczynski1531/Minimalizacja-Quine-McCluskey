    class Minterm{

        constructor(dziesietne, binarne){
          this.dziesietne = dziesietne;
          this.binarne = binarne;
          this.uzyte = false;
        }
  
        uzyj(){
          this.uzyte = true;
        }
  
        porownajIPolacz(minterm) {
          let roznice = 0;
          let porownanie = "";
          for(let i = 0; i < this.binarne.length; i++){
            if(this.binarne.charAt(i) != minterm.binarne.charAt(i)){
              roznice++;
              if(roznice > 1){
                return null;
              }
              porownanie += "*";
            }
            else{
              porownanie += this.binarne.charAt(i);
            }
          }
          return new Minterm(this.dziesietne.concat(minterm.dziesietne), porownanie);
        }
      }
  
      function dodajDoTablicyDec(czyX = true){
        var wartosci = [];
        let jedynki = 0;
        var liczbaWierszow = document.getElementById("tabela").rows.length - 1;
        console.log(liczbaWierszow);
        for(let i = 0; i < liczbaWierszow; i++){
          var temp = document.getElementsByName("in" + i);
          var temp2 = Array.from(temp);
          for(let j = 0; j < 3; j++){
            if(temp2[j].checked){
              wartosci = wartosci.concat(temp2[j].value);
              if(temp2[j].value == 1){
                jedynki++;
              }
            }
          }
        }
        if(jedynki == 0){
          return -1;
        }
        var tablica = [];
        for(let i = 0; i < wartosci.length; i++){
          if(czyX == true){
            if(wartosci[i] != 0){
              tablica.push(i);
            }
          }
          else if(wartosci[i] == 1){
            tablica.push(i);
          }
        }
        return tablica;
      }
  
      function liczJedynki(wartoscBinarna){
        var licznik = 0;
        for(const bit of wartoscBinarna){
          if(bit == "1"){
            licznik += 1;
          }
        }
        return licznik;
      }
  
      function pogrupujPoJedynkach(tablicaDec, tablicaBin, liczbaZmiennych){
        var grupy = [];
        for(let i = 0; i < liczbaZmiennych + 1; i++){
          grupy.push([]);
        }
        for(let i = 0; i < tablicaDec.length; i++){
          let licznik = liczJedynki(tablicaBin[i]);
          let wartoscDziesietna = tablicaDec[i];
          grupy[licznik].push(new Minterm([wartoscDziesietna], tablicaBin[i]));
        }
        return grupy;
      }
  
  
      function porownajBinarneWGrupach(grupy) {
        if(grupy.length == 1){
          return grupy[0];
        }
        let noweGrupy = [];
        for(let i = 0; i < grupy.length - 1; i++){
          noweGrupy.push([]);
        }
        let nieuzyte = [];
        for(let i = 0; i < noweGrupy.length; i++){
          let grupa1 = grupy[i];
          let grupa2 = grupy[i + 1];
          for(const minterm1 of grupa1){
            for(const minterm2 of grupa2){
              let minterm3 = minterm1.porownajIPolacz(minterm2);
              if(minterm3 != null){
                minterm1.uzyj();
                minterm2.uzyj();  
                if(czyJestWGrupie(minterm3, noweGrupy[i]) == false){
                  noweGrupy[i].push(minterm3);
                }
              }
            }
          }
        }
        for(const grupa of grupy){
          for(const minterm of grupa){
            if(minterm.uzyte == false && czyJestWGrupie(minterm, nieuzyte) == false){
              nieuzyte.push(minterm);
            }
          }
        }
        for(const minterm of porownajBinarneWGrupach(noweGrupy)){
          if(minterm.uzyte == false && czyJestWGrupie(minterm, nieuzyte) == false){
            nieuzyte.push(minterm);
          }
        }
        return nieuzyte
      }
  
      function czyJestWGrupie(minterm, grupa) {
        for(const mintermWGrupie of grupa){
          if(minterm.binarne == mintermWGrupie.binarne && minterm.dziesietne.length == mintermWGrupie.dziesietne.length){
            return true;
          }
        }
        return false;
      }
  
      function zbierzNieuzyte(grupy) {
        var nieuzyte = [];
        console.log(grupy);
        for(const grupa in grupy){
          console.log(typeof(grupy));
          for(const minterm in grupa){
            console.log(minterm);
            if(minterm.uzyte == false){
              console.log("zbierznieuzyte");
              nieuzyte.push(minterm);
              console.log(nieuzyte);
            }
          }
        }
        return nieuzyte;
      }
      
      function stworzIRozwiazTabele(mintermy) {
        var kolumny = dodajDoTablicyDec(false);
        console.log(kolumny);
        var tabela = new Array(mintermy.length + 1);
        var wynik = [];
        for(let i = 0; i < mintermy.length + 1; i++){
          tabela[i] = new Array(kolumny.length + 1);
        }
        tabela[0][0] = "X";
        console.log(mintermy);
        for(let i = 1; i < kolumny.length + 1; i++){
          tabela[0][i] = kolumny[i - 1];
          console.log(kolumny[i - 1]);
        }
        for(let i = 1; i < tabela.length; i++){
          tabela[i][0] = mintermy[i - 1].dziesietne;
        }
        console.log(tabela);
        for(let i = 1; i < tabela.length; i++){
          for(let j = 0; j < kolumny.length; j++){
            if(tabela[i][0].includes(kolumny[j])){
              tabela[i][j + 1] = "X";
            }
          }
        }
        console.log(tabela);
        var pozycja = 0;
        var czyWypelniona = false;
        var iteracja = 1
        var iteracja2 = 0;
          if(iteracja == 1){      
          for(let i = 1; i < kolumny.length + 1; i++){
            let licznik = 0;
            for(let j = 1; j < tabela.length; j++){
              if(tabela[j][i] == "X"){
                licznik ++;
                pozycja = j;
              }
              if(j == tabela.length - 1 && licznik == 1){
                wynik.push(mintermy[pozycja - 1]); 
                for(let k = 1; k < tabela.length; k++){
                  if(tabela[k][i] == null){
                    tabela[k][i] = "O";
                  }
                }
                for(let k = 1; k < kolumny.length + 1; k++){
                  if(tabela[pozycja][k] == "X"){
                    for(let l = 1; l < tabela.length; l++){
                        tabela[l][k] = "O";
                    }
                  }
                    tabela[pozycja][k] = "W";
                }
              }
            }
          }
         }
         iteracja++;
         if(iteracja > 1){
          let puste = 0;
          for(let i = 1; i < tabela.length; i++){
            for(let j = 1; j < kolumny.length + 1; j++){
              if(tabela[i][j] == null || tabela[i][j] == "X"){
                puste++;
              }
            }
          }
          if(puste == 0){
            czyWypelniona = true;
          }
      let iteracja2 = 0;
      while(czyWypelniona == false){
          iteracja2++;
          puste = 0;
          var licznikX = 0;
          var najwiecejX = 0;
          var wierszNajwiecejX = 0;
          for(let i = 1; i < tabela.length; i++){
              licznikX = 0;
                  for(let k = 1; k < kolumny.length + 1; k++){
                      if(tabela[i][k] == "X"){
                          licznikX++;
                          if(licznikX > najwiecejX){
                            najwiecejX = licznikX;
                            wierszNajwiecejX = i;
                          }            
                          else if(iteracja2 > 1 && licznikX == najwiecejX && 
                            mintermy[i - 1].dziesietne.length > mintermy[wierszNajwiecejX - 1].dziesietne.length){
                            najwiecejX = licznikX;
                            wierszNajwiecejX = i;
                          }
                      }
                  }
          }
          wynik.push(mintermy[wierszNajwiecejX - 1]);
          for(let i = 1; i < kolumny.length + 1; i++){
              if(tabela[wierszNajwiecejX][i] == "X"){
                  for(let j = 1; j < tabela.length; j++){
                          tabela[j][i] = "O";
                  }
              }
              if(tabela[wierszNajwiecejX][i] == "X"){
                  tabela[wierszNajwiecejX][i] = "O";
              }
          }
          for(let i = 1; i < tabela.length; i++){
            for(let j = 1; j < kolumny.length + 1; j++){
              if(tabela[i][j] == null){
                puste++;
              }
            }
          }
          if(puste == 0){
            czyWypelniona = true;
          }          
          iteracja++;
        }
      }
        console.log(wynik);
        console.log(tabela);
        return wynik;
      }
  
      function wypiszWynik(wynik) {
        var slownik = {0: "A", 1: "B", 2: "C", 3: "D", 4: "E", 5: "F"};
        var stringWynikowy = "";
        var iteracja = -1;
        for(const minterm of wynik){
          iteracja++;
          if(iteracja > 0 && iteracja < wynik.length){
            stringWynikowy = stringWynikowy.concat(" + ");
          }
          for(let i = 0; i < minterm.binarne.length; i++){
            if(minterm.binarne.charAt(i) == "1"){
              stringWynikowy = stringWynikowy.concat(slownik[i]);
            }
            else if(minterm.binarne.charAt(i) == "0"){
              stringWynikowy = stringWynikowy.concat(slownik[i] + "'");
            }
          }
        }
        return stringWynikowy
      }

      var submit = document.getElementById("submit");
      submit.addEventListener("click", () => {

        console.log(zmienne);
        var tablicaDec = [];
        var tablicaDec = dodajDoTablicyDec(true);
        console.log(tablicaDec);
        if(tablicaDec.length == 0 || tablicaDec == -1){
          document.getElementById("wynik").innerHTML = 0;
          return;
        }
        else if(tablicaDec.length == document.getElementById("tabela").rows.length - 1){
          document.getElementById("wynik").innerHTML = 1;
          return;
        }
        console.log(tablicaDec);
        var tablicaBin = [];
  
        for(let i = 0; i < tablicaDec.length; i++){
          tablicaBin[i] = tablicaDec[i].toString(2);
          while(tablicaBin[i].length != zmienne){
            tablicaBin[i] = "0" + tablicaBin[i];
          }
        }
  
        console.log(tablicaBin);
  
        var grupy = pogrupujPoJedynkach(tablicaDec, tablicaBin, zmienne);
        console.log(grupy);
  
        var nieuzyte = porownajBinarneWGrupach(grupy);
        console.log(nieuzyte);
        var wynik = stworzIRozwiazTabele(nieuzyte);
        console.log(wynik);
        wynik2 = wypiszWynik(wynik);
        console.log(wynik2);
        document.getElementById("wynik").innerHTML = wynik2;
      })
