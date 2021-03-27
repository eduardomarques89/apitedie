const fs = require('fs');
const fileName = './app.json';
const json = require(fileName);

// Obtem o buildNumber atual e incrementa com + 1
var newBuildNumber = parseInt(json.expo.ios.buildNumber) + 1;

// Atribui o novo buildNumber ao atributo ios.buildNumber
json.expo.ios.buildNumber = newBuildNumber.toString();

// Converte o json para string e mantem a formatação
var jsonStr = JSON.stringify(json, null, 2)

// Grava a alteração no arquivo app.json
fs.writeFileSync(
    fileName,
    jsonStr, 
    function writeJson(err) {
        if (err) return console.log(err);
        console.log(jsonStr);
        console.log('Incrementing iOS build number to ' + fileName);
    }
);