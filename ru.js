var htmlToJson = require('html-to-json');


var get = (fn) => {

  var promise = htmlToJson.request('http://ru.ufpa.br/index.php?option=com_content&view=article&id=7', {
    'dia_da_semana': ['tbody tr', function ($doc) {
      return $doc.find('td').eq(0).text().replace(/\n/g, " ").replace(/\r/g, "").replace(/\. /g, "").replace(/^\s+|\s+$|\s+(?=\s)/g, "");
    }],
    'almoco': ['tbody tr', function ($doc) {
      return $doc.find('td').eq(1).text().replace(/\n/g, " ").replace(/\r/g, "").replace(/\. /g, "; ").replace(/^\s+|\s+$|\s+(?=\s)/g, "");
    }],
    'jantar': ['tbody tr', function ($doc) {
      return $doc.find('td').eq(2).text().replace(/\n/g, " ").replace(/\r/g, "").replace(/\. /g, "; ").replace(/^\s+|\s+$|\s+(?=\s)/g, "");
    }]
  });


  promise.done(function (result) {
    cardapioRU = {};
    cardapioRU['cardapio'] = {};
    cardapioRU['info'] = {};
    var ruDisponivel = {};
    var dateParser = result.dia_da_semana.slice(1, 3);
    var date_ano = /(\b[0-9]{4,4}\b)/.exec(dateParser[0])[1];
    var date_de = /(\b[0-9]{2})\/(\b[0-9]{2})/.exec(dateParser[0]);
    var almocoParser = /Almoço(.+)Jantar/.exec(result.dia_da_semana[1]);
    var jantarParser = /Jantar(.+)/.exec(result.dia_da_semana[1]);
    var horarioAlmoco = /([0-9][0-9]:[0-9][0-9]) às ([0-9][0-9]:[0-9][0-9])/.exec(almocoParser[1]).slice(1, 3);
    var horarioJanta = /([0-9][0-9]:[0-9][0-9]) às ([0-9][0-9]:[0-9][0-9])/.exec(jantarParser[1]).slice(1, 3);
    //var horarioJanta = [ '00:00', '00:00' ];
    var aviso = /Aviso: (.+)/.exec(result.dia_da_semana[1]);
    aviso = (aviso ? aviso[1] : "Sem avisos");
    var dias = result.dia_da_semana.slice(3, 8);
    var almoco = result.almoco.slice(3, 8);
    var jantar = result.jantar.slice(3, 8);
    var aux;

    ruDisponivel = {
      almoco: {
        horario_de: horarioAlmoco[0],
        horario_ate: horarioAlmoco[1],
        basico: (almocoParser[1].indexOf("BÁSICO") > -1) ? true : false,
        profissional: (almocoParser[1].indexOf("PROFISSIONAL") > -1) ? true : false
      },
      jantar: {
        horario_de: horarioJanta[0],
        horario_ate: horarioJanta[1],
        basico: (jantarParser[1].indexOf("BÁSICO") > -1) ? true : false,
        profissional: (jantarParser[1].indexOf("PROFISSIONAL") > -1) ? true : false
      },
      aviso: aviso ? aviso : false
    }
    for (var i in almoco)
      almoco[i] = almoco[i].split("; ");
    for (var i in jantar)
      jantar[i] = jantar[i].split("; ");
    for (var i in almoco) {
      for (var j in almoco[i]) {
        if (j == 0) {
          aux = almoco[i];
          almoco[i] = [];
          var arrSplit = /(\b[A-Z0-9ÃÔÇ \/]{3,}\b) (.+)/.exec(aux[0]);
          if (!arrSplit) arrSplit = ["", "", aux[0]];
          almoco[i].push(arrSplit[1]);
          var farofaChecker = /([A-z\s/ãáàéèíìõóòúù]+)\s(Farofa)|(Farofa)\s([A-z\s/ãáàéèíìõóòúù]+)/g.exec(arrSplit[2])
          if (farofaChecker) {
            almoco[i].push(farofaChecker[1]);
            almoco[i].push(farofaChecker[2]);
          } else {
            almoco[i].push(arrSplit[2]);
          }
        } else {
          var farofaChecker = /([A-z\s/ãáàéèíìõóòúù]+)\s(Farofa)|(Farofa)\s([A-z\s/ãáàéèíìõóòúù]+)/g.exec(aux[j]);
          if (farofaChecker) {
            if (farofaChecker[1] && farofaChecker[2]) {
              almoco[i].push(farofaChecker[1]);
              almoco[i].push(farofaChecker[2]);
            } else {
              almoco[i].push(farofaChecker[3]);
              almoco[i].push(farofaChecker[4]);
            }
          } else {
            almoco[i].push(aux[j]);
          }
        }
        if (aux.length - 1 == j) {
          if (almoco[i][almoco[i].length - 1])
            almoco[i][almoco[i].length - 1] = almoco[i][almoco[i].length - 1].replace(/\;/, "");
        }
      }
    }
    for (var i in jantar) {
      for (var j in jantar[i]) {
        if (j == 0) {
          aux = jantar[i];
          jantar[i] = [];
          var arrSplit = /(\b[A-Z0-9ÃÔÇ \/]{3,}\b) (.+)/.exec(aux[0]);
          if (!arrSplit) arrSplit = [, "", aux[0]];
          jantar[i].push(arrSplit[1]);
          var farofaChecker = /([A-z\s/ãáàéèíìõóòúù]+)\s(Farofa)|(Farofa)\s([A-z\s/ãáàéèíìõóòúù]+)/g.exec(arrSplit[2])
          if (farofaChecker) {
            jantar[i].push(farofaChecker[1]);
            jantar[i].push(farofaChecker[2]);
          } else {
            jantar[i].push(arrSplit[2]);
          }
        } else {
          var farofaChecker = /([A-z\s/ãáàéèíìõóòúù]+)\s(Farofa)|(Farofa)\s([A-z\s/ãáàéèíìõóòúù]+)/g.exec(aux[j]);
          if (farofaChecker) {
            if (farofaChecker[1] && farofaChecker[2]) {
              jantar[i].push(farofaChecker[1]);
              jantar[i].push(farofaChecker[2]);
            } else {
              console.log(almocoParser)
              jantar[i].push(farofaChecker[3]);
              jantar[i].push(farofaChecker[4]);
            }
          } else {
            jantar[i].push(aux[j]);
          }
        }
        if (aux.length - 1 == j) {
          if (jantar[i][jantar[i].length - 1])
            jantar[i][jantar[i].length - 1] = jantar[i][jantar[i].length - 1].replace(/\;/, "");
        }
      }
    }
    for (var i in dias) {
      var dateSoma = parseInt(date_de[1]) + parseInt(i);
      if (dateSoma < 9)
        dateSoma = '0' + dateSoma;
      dias[i] = dias[i].toLowerCase().replace('ç', 'c');
      var data = new Date(parseInt(date_ano), parseInt(date_de[2] - 1), dateSoma);
      cardapioRU['cardapio'][dias[i]] = {
        data: (data.getDate() > 9 ? data.getDate() : '0' + data.getDate()) + '/' + ((data.getMonth() + 1) > 9 ? data.getMonth() : '0' + data.getMonth()) + '/' + data.getFullYear(),
        almoco: almoco[i],
        jantar: jantar[i]
      }
    }
    cardapioRU['info'] = ruDisponivel;
    fn(cardapioRU.cardapio)
  });

}

module.exports = get;
