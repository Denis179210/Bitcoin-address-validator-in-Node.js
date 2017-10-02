/////////////////////////////////////
var fs = require("fs");         ////////
var base58 = require("bs58");   ////////////////////////////////// необходимые для работы программы модули, в т.ч сторонние через NPM  
var SHA256 = require("sha256"); ////////
/////////////////////////////////////

var arg = process.argv[2];                                      // входной аргумент из global environment, текстовый файл с биткоин-адресом
var btcAddress = fs.readFileSync(arg, {encoding : "utf-8"});    // читаем его и сохраняем 
var binAddress = base58.decode(btcAddress);                     // дешифрование адреса в бинарный 25-байтовый
var REPIMD_160_DIGEST_AND_ID_BYTE = binAddress.slice(0, 21);    // расширеный 1 байтом идентфикатора сети REPIMD-160 дайджест
var hashing = SHA256(REPIMD_160_DIGEST_AND_ID_BYTE);            // вычисление 
var checkSum = SHA256(Buffer.from(hashing,"hex"));              // контрольной суммы
var toBufferCS = Buffer.from(checkSum,"hex");                   // предварительная конвертация в буфер для дальнейшей проверки на равенство

// Валидация биткоин-адреса
function isValid() {
	var BASE_58_ENCODING = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";    // 
	var value;                                                                              ////
	for( var i = 0; i < btcAddress.length; i++ ) {                                          ////// тут все ясно
		if( BASE_58_ENCODING.indexOf(btcAddress.charAt(i)) == -1) {                         ////
			throw new Error("Not valid encoding!");                                         //
		}
	}	
	if( btcAddress.length < 25 || btcAddress.length > 34 ) {							    // проверка на корректность 
		throw new Error("Not valid length!"); 												// ввода данных
	}                                                                                      
	if( binAddress.slice(21).toString("hex") !== toBufferCS.slice(0, 4).toString("hex") ) { // проверка на равенство контрольной суммы 
		throw new Error("Not valid btcAdress!");                                            // и 4-байтового хвоста биткоин-адреса
	
	} else { 
		value = true;      // Отлично !
	}
	return value      // Введеный биткоин-адрес действительный
}

console.log(isValid())

