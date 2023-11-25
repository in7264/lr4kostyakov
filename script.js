
document.addEventListener("DOMContentLoaded", function () {
    var publicKeyElement = document.getElementById("publicKey");
    var privateKeyElement = document.getElementById("privateKey");
    var signatureValueElement = document.getElementById("signatureValue");
    var verificationResultElement = document.getElementById("verificationResult");

    document.getElementById("generateKey").addEventListener("click", function () {
      var p = parseInt(getInputValue("p"));
      var q = parseInt(getInputValue("q"));
      var e = parseInt(getInputValue("e"));

      var keys = generateKeys(p, q, e);

      publicKeyElement.textContent = `(${keys.n}, ${keys.e})`;
      privateKeyElement.textContent = `(${keys.n}, ${keys.d})`;
    });

    document.getElementById("sign").addEventListener("click", function () {
      var message = getInputValue("messageToSign");
      var privateKey = parseKey(privateKeyElement.textContent);

      var signature = sign(message, privateKey);

      signatureValueElement.textContent = signature;
    });

    document.getElementById("verify").addEventListener("click", function () {
      var message = getInputValue("messageToVerify");
      var receivedSignature = getInputValue("receivedSignature");
      var publicKey = parseKey(publicKeyElement.textContent);

      var isVerified = verify(message, receivedSignature, publicKey);

      verificationResultElement.textContent = isVerified ? "Valid" : "Invalid";
    });

    function getInputValue(id) {
      return document.getElementById(id).value;
    }

    function parseKey(keyString) {
      var keyValues = keyString.match(/\d+/g);
      return {
        n: parseInt(keyValues[0]),
        d: parseInt(keyValues[1])
      };
    }

    function generateKeys(p, q, e) {
      var n = p * q;
      var phi = (p - 1) * (q - 1);
      var d = modInverse(e, phi);

      return {
        n: n,
        e: e,
        d: d
      };
    }

    function modInverse(a, m) {
      for (var x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
          return x;
        }
      }
      return null;
    }

    function sign(message, privateKey) {
      var hash = hashFunction(message);
      return numberCalculation(hash, privateKey.n, privateKey.d);
    }

    function verify(message, signature, publicKey) {
      var hash = hashFunction(message);
      var decryptedSignature = numberCalculation(signature, publicKey.n, publicKey.d);
      return hash === decryptedSignature;
    }

    function numberCalculation(m, n, exp) {
      var result = 1;
      for (var i = 0; i < exp; i++) {
        result = (result * m) % n;
      }
      return result;
    }

    function hashFunction(message) {
      var hash = 0;
      for (var i = 0; i < message.length; i++) {
        hash += message.charCodeAt(i);
      }
      return hash;
    }
  });