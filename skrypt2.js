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


  function zamienNaBinarna(wartosc){
    return(wartosc >>> 0).toString(2);
  }

  function dodajDoTablicyDec(czyX = true){
    var wartosci = [];
    var liczbaWierszow = document.getElementById("tabela").rows.length - 1;
    console.log(liczbaWierszow);
    for(let i = 0; i < liczbaWierszow; i++){
        var temp = document.getElementsByName("in" + i);
        var temp2 = Array.from(temp);
        console.log(typeof(temp2));
        for(let j = 0; j < 3; j++){
            if(temp2[j].checked){
                wartosci = wartosci.concat(temp2[j].value);
            }
        }
      }
      var tablica = [];
      for(let i = 0; i < wartosci.length; i++){
        if(czyX == true){
          if(wartosci[i] != 0){
            tablica.push(i);
          }
        }
        else
        if(wartosci[i] == 1){
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
    
    console.log(grupy);
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
  
  function stworzIRozwiazTabele(mintermy, f1) {
    var kolumny = f1.split(" ");;
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
                      else if(iteracja2 > 1 && licznikX == najwiecejX && mintermy[i - 1].dziesietne.length > mintermy[wierszNajwiecejX - 1].dziesietne.length){
                        najwiecejX = licznikX;
                        wierszNajwiecejX = i;
                      }
                      console.log(mintermy[i - 1]);
                      console.log(mintermy[i - 1].dziesietne);
                      console.log(mintermy[i - 1].dziesietne.length);
                  }
              }
      }
      wynik.push(mintermy[wierszNajwiecejX - 1]);
      console.log(mintermy[wierszNajwiecejX - 1]);
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
     console.log(tabela);
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
    var slownik = {0: "A", 1: "B", 2: "C", 3: "D", 4: "E", 5: "F", 6: "G", 7: "H", 8: "I"};
    var stringWynikowy = "";
    var iteracja = -1;
    for(const minterm of wynik){
      iteracja++;
      if(iteracja > 0 && iteracja < wynik.length){
        stringWynikowy = stringWynikowy.concat(" + ");
      }
      for(let i = 0; i < minterm.binarne.length; i++){
        if(minterm.binarne.charAt(i) == "1"){
          console.log(stringWynikowy);
          stringWynikowy = stringWynikowy.concat(slownik[i]);
        }
        else if(minterm.binarne.charAt(i) == "0"){
          stringWynikowy = stringWynikowy.concat(slownik[i] + "'");
        }
      }
    }
    return stringWynikowy
  }


  function zamienZbiory(f1, ff){
    let tablicaDec = [];
    f1split = [];
    ffsplit = [];
    if(f1.length > 0){
      f1split = f1.split(" ");
      tablicaDec = f1split;
    }
    if(ff.length > 0){
      if(tablicaDec.length > 0){
         ffsplit = ff.split(" ");
        tablicaDec = tablicaDec.concat(ff.split(" "));
      }
      else{
        tablicaDec = ff.split(" ");
      }
    }
    tablicaDec = tablicaDec.sort(sortuj);
    for(el of tablicaDec){
      console.log(el);
      if(el >= Math.pow(2, 9)){
        return -5;
      }
    }
    console.log(ff.length);

    if(f1.length == 0 && ff.length == 0){
        return -3;
    }

    if(tablicaDec[0].length == 0){
      return -4;
  }

    if(f1split.length != 0 && ffsplit.length != 0){
      for(el of f1split){
        for(el2 of ffsplit){
            if(el == el2){
                return -2;
            }
        }
    }
    }
    if(f1.length == 0){
        return -1;
    }
    
    return tablicaDec
  }

  function sortuj(a, b) {
    return a - b
 }

  function wyznaczLiczbeZmiennych(tablicaDec){
    let ostatni = tablicaDec[tablicaDec.length - 1];
    for(let i = 0; i < 10; i++){
      if(ostatni >= Math.pow(2, i)){
        var zmienne = i + 1;
      }
    }
    return zmienne;
  }

  var submit = document.getElementById("submit");
  submit.addEventListener("click", () => {
    var f1 = document.getElementById("F1").value;
    var ff = document.getElementById("F*").value;
    var tablicaDec = zamienZbiory(f1, ff);
    if(tablicaDec == -5){
      document.getElementById("wynik").innerHTML = "Wprawadzono wartość > 511. Proszę wprowadzić mniejsze wartości.";
      return;
    }
    if(tablicaDec == -3){
        document.getElementById("wynik").innerHTML = "Zbiory są puste.";
        return;
    }
    if(tablicaDec == -1){
        document.getElementById("wynik").innerHTML = 0;
        return;
    }
    if(tablicaDec == -2){
        document.getElementById("wynik").innerHTML = "Liczby w zbiorach się powtarzają.";
        return;
    }
    if(tablicaDec == -4){
        document.getElementById("wynik").innerHTML = "Na początku lub końcu jednego ze zbiorów stoi spacja.";
        return;
    }

    var zmienne = wyznaczLiczbeZmiennych(tablicaDec);
    
    console.log(tablicaDec)
    console.log(zmienne)
    if(tablicaDec.length == 0){
      document.getElementById("wynik").innerHTML = 0;
      return;
    }
    else if(tablicaDec.length == Math.pow(2, zmienne)){
      document.getElementById("wynik").innerHTML = 1;
      return;
    }
    console.log(tablicaDec);
    var tablicaBin = [];

    for(let i = 0; i < tablicaDec.length; i++){
      tablicaBin[i] = zamienNaBinarna(tablicaDec[i]);
      while(tablicaBin[i].length != zmienne){
        tablicaBin[i] = "0" + tablicaBin[i];
      }
    }

    console.log(tablicaBin);

    var grupy = pogrupujPoJedynkach(tablicaDec, tablicaBin, zmienne);
    console.log(grupy);

    var nieuzyte = porownajBinarneWGrupach(grupy);
    console.log(nieuzyte);
    var wynik = stworzIRozwiazTabele(nieuzyte, f1);
    console.log(wynik);
    wynik2 = wypiszWynik(wynik);
    console.log(wynik2);
    document.getElementById("wynik").innerHTML = wynik2;
  })
