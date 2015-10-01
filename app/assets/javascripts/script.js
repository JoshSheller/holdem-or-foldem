
var cards = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
var suits = ["s", "h", "d", "c"];

var users = {};
var currentUser = null;

var page = "";

var firstHoleCard = null;
var secondHoleCard = null;  
var hand = null;
var suited = null;
var numOpponents = 1;
var varianceArray = [];

function showUser() {
  document.getElementById('index').style.display = "none";
  document.getElementById('userHome').style.display = "block";
  document.getElementById('hand-histories').innerHTML = "";
};

function showIndex() {
  document.getElementById('userHome').style.display = "none";
  document.getElementById('index').style.display = "block";
  randomFunnyImage();
};

function randomFunnyImage() {
  var randImage = Math.floor(Math.random() * 11);
  document.getElementById('funny-image').innerHTML = '<img src="/assets/' + randImage + '.jpg" />';
};

function selectNumOpponents() {
  var selectBox = document.getElementById("numOpponentSelector");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  numOpponents = selectedValue; 
};

function randCardNumber() {
  return Math.floor(Math.random() * 13);
};

function randSuit() {
  return Math.floor(Math.random() * 4);
};

function randCard() {
  return cards[randCardNumber()] + (suits[randSuit()]);
};

function setHandAndSuited() {
  if (firstHoleCard[0] == secondHoleCard[0]) {
    hand = firstHoleCard[0] + secondHoleCard[0];
  } else if (firstHoleCard[1] != secondHoleCard[1]) {
    if((firstHoleCard[0] + secondHoleCard[0] + "o") in oddsArray) {
      hand = firstHoleCard[0] + secondHoleCard[0] + "o";
    } else {
      hand = secondHoleCard[0] + firstHoleCard[0] + "o";
    };
  } else {
    if ((hand = firstHoleCard[0] + secondHoleCard[0] + "s") in oddsArray) {
      hand = firstHoleCard[0] + secondHoleCard[0] + "s";
    } else {
      hand = secondHoleCard[0] + firstHoleCard[0] + "s";
    };
  };
};

function holeCards() {
  firstHoleCard = randCard();
  secondHoleCard = randCard();

  setHandAndSuited();

  while(secondHoleCard == firstHoleCard) {
    secondHoleCard = randCard();
    setHandAndSuited();
  };

  document.getElementById('first-hole-card').innerHTML = '<img src="/assets/' + firstHoleCard + '.png" />';
  document.getElementById('second-hole-card').innerHTML = '<img src="/assets/' + secondHoleCard + '.png" />';
};

function addToUserVariance() {
  var currentPrediction = document.getElementById("current-prediction").value;

  document.getElementById('you-predicted').innerHTML = '<p>' + currentPrediction + '%</p>';
  document.getElementById('the-answer').innerHTML = '<p>' + oddsArray[hand][numOpponents - 1] + '%</p>';

  if (users[currentUser][hand + numOpponents] != undefined) {
    users[currentUser][hand + numOpponents].push(currentPrediction);
    document.getElementById('begin-play').innerHTML = '<button onclick="beginPlay()">Next Hand</button>';
  } else {
    users[currentUser][hand + numOpponents] = [currentPrediction];
    users[currentUser].handsPlayed.push(hand + numOpponents);
    document.getElementById('begin-play').innerHTML = '<button onclick="beginPlay()">Next Hand</button>';
  };
};

function logIn() {
  var username = document.getElementById("username").value;
  var userPassword = document.getElementById("password").value;
  if (username == "") {
    alert("Please add your username and re-submit!");
  } else if (userPassword == "") {
    alert("Please add your password and re-submit!");
  } else if (userPassword.toString() != users[username.toString()].password) {
    alert("This password does not match this username, please try again :)");
  } else {
    currentUser = username.toString();
    showUser();
  };
};

function logOut() {
  currentUser = null;
  showIndex();
};

function newUser() {
  var newUsername = document.getElementById("new-username").value;
  var newPassword = document.getElementById("new-password").value;
  if (newUsername == "") {
    alert("Please add a username and re-submit!");
  } else if (users[newUsername.toString()] != undefined) {
    alert(newUsername + " already exists, please try another username :)");
  } else if (newPassword == "") {
    alert("Please add a password and re-submit!");
  } else {
    users[newUsername.toString()] = {};
    users[newUsername.toString()].password = newPassword.toString();
    currentUser = newUsername.toString();

    users[newUsername.toString()].handsPlayed = [];

    alert("Welcome, " + newUsername + ". Let the poker practice begin!");

    showUser();
  };
};

function contains(a, obj) {
  for (var i = 0; i < a.length; i++) {
    if (a[i] === obj) {
      return true;
    };
  };
  return false;
};

function showHandVariance() {
  document.getElementById('user-variance').innerHTML = '<p>' + users[currentUser][hand + numOpponents] + '</p>';
};
 
function showUserObject() {
  var output = '';
  for (var property in users[currentUser]) {
    output += property + ': ' + users[currentUser][property]+'; ';
  };
  alert(output);
};

function showTotalVariance() {
  var totalVariance = 0;

  for (var i = 0; i < (users[currentUser][hand + numOpponents]).length; i++) {
    totalVariance += Math.abs((users[currentUser][hand + numOpponents][i]) - oddsArray[hand][numOpponents - 1]);
  };
  
  document.getElementById('total-user-variance').innerHTML = '<p>' + totalVariance / users[currentUser][hand + numOpponents].length + '</p>';
};

function handHistories() {
  var output = '';

  for (var i = 0; i < users[currentUser].handsPlayed.length; i++) {
    output += users[currentUser].handsPlayed[i] + ' : ' + users[currentUser][(users[currentUser].handsPlayed[i])] + "<br><br>";
  };

  document.getElementById('hand-histories').innerHTML = '<p>' + output + '</p>';
};

function beginPlay() {
  document.getElementById('begin-play').innerHTML = '<p>Submit Your % Prediction</p><form id="form" onsubmit="return false;"><input type="text" id="current-prediction"><input id="prediction-submit" type="submit" onclick="addToUserVariance()"></form>';

  holeCards();
};



var oddsArray =
  {
    "AA": [85, 73, 64, 56],
    "KK": [82, 69, 58, 50],
    "QQ": [80, 65, 54, 45],
    "JJ": [78, 61, 49, 40],
    "TT": [75, 58, 45, 36],
    "99": [72, 54, 41, 33],
    "88": [69, 50, 38, 29],
    "77": [66, 46, 34, 27],
    "66": [63, 43, 32, 25],
    "55": [60, 40, 29, 22],
    "44": [57, 37, 26, 21],
    "33": [54, 34, 24, 19],
    "22": [50, 31, 22, 18],
    "AKs": [67, 51, 41, 35],
    "AKo": [65, 48, 39, 32],
    "AQs": [66, 49, 40, 34],
    "AQo": [65, 47, 37, 30],
    "AJs": [65, 48, 39, 32],
    "AJo": [64, 46, 35, 29],
    "ATs": [65, 47, 37, 30],
    "ATo": [63, 44, 34, 28],
    "A9s": [63, 45, 35, 28],
    "A9o": [61, 42, 31, 25],
    "A8s": [62, 44, 34, 27],
    "A8o": [60, 41, 30, 24],
    "A7s": [61, 43, 33, 27],
    "A7o": [59, 39, 29, 23],
    "A6s": [60, 41, 31, 26],
    "A6o": [58, 38, 28, 22],
    "A5s": [60, 41, 32, 26],
    "A5o": [58, 38, 28, 22],
    "A4s": [59, 40, 31, 25],
    "A4o": [56, 37, 27, 21],
    "A3s": [58, 39, 30, 25],
    "A3o": [56, 36, 26, 20],
    "A2s": [57, 39, 29, 24],
    "A2o": [55, 35, 25, 20],
    "KQs": [63, 47, 38, 33],
    "KQo": [61, 44, 35, 29],
    "KJs": [63, 46, 37, 31],
    "KJo": [61, 43, 34, 28],
    "KTs": [62, 45, 36, 30],
    "KTo": [60, 42, 33, 27],
    "K9s": [60, 42, 33, 27],
    "K9o": [58, 40, 30, 24],
    "K8s": [59, 40, 31, 25],
    "K8o": [56, 37, 27, 21],
    "K7s": [58, 39, 30, 25],
    "K7o": [55, 36, 26, 21],
    "K6s": [57, 38, 29, 24],
    "K6o": [54, 35, 25, 20],
    "K5s": [56, 37, 28, 23],
    "K5o": [53, 34, 25, 19],
    "K4s": [55, 36, 27, 22],
    "K4o": [52, 33, 23, 18],
    "K3s": [54, 36, 27, 22],
    "K3o": [51, 32, 23, 18],
    "K2s": [53, 35, 26, 21],
    "K2o": [50, 31, 22, 17],
    "QJs": [60, 44, 36, 30],
    "QJo": [58, 41, 33, 27],
    "QTs": [60, 43, 35, 29],
    "QTo": [57, 40, 31, 26],
    "Q9s": [58, 41, 32, 36],
    "Q9o": [56, 38, 29, 23],
    "Q8s": [56, 39, 30, 24],
    "Q8o": [54, 35, 26, 21],
    "Q7s": [55, 37, 28, 23],
    "Q7o": [52, 33, 24, 19],
    "Q6s": [54, 36, 27, 22],
    "Q6o": [51, 32, 23, 18],
    "Q5s": [53, 35, 26, 21],
    "Q5o": [50, 31, 22, 17],
    "Q4s": [52, 34, 26, 21],
    "Q4o": [49, 30, 21, 16],
    "Q3s": [51, 33, 25, 20],
    "Q3o": [48, 29, 21, 16],
    "Q2s": [50, 32, 24, 20],
    "Q2o": [47, 28, 20, 15],
    "JTs": [58, 42, 34, 29],
    "JTo": [55, 39, 31, 25],
    "J9s": [56, 40, 31, 26],
    "J9o": [53, 37, 28, 23],
    "J8s": [54, 38, 29, 24],
    "J8o": [52, 34, 26, 20],
    "J7s": [52, 35, 27, 22],
    "J7o": [50, 32, 24, 18],
    "J6s": [51, 34, 25, 21],
    "J6o": [48, 30, 21, 17],
    "J5s": [50, 33, 25, 20],
    "J5o": [47, 29, 21, 16],
    "J4s": [49, 32, 24, 19],
    "J4o": [46, 28, 20, 15],
    "J3s": [48, 31, 23, 19],
    "J3o": [45, 27, 19, 15],
    "J2s": [47, 30, 23, 18],
    "J2o": [44, 26, 18, 14],
    "T9s": [54, 39, 31, 26],
    "T9o": [52, 36, 28, 23],
    "T8s": [53, 37, 29, 24],
    "T8o": [50, 34, 25, 20],
    "T7s": [51, 35, 27, 22],
    "T7o": [48, 31, 23, 18],
    "T6s": [49, 33, 25, 21],
    "T6o": [46, 29, 21, 17],
    "T5s": [47, 31, 23, 19],
    "T5o": [44, 27, 19, 15],
    "T4s": [46, 30, 23, 18],
    "T4o": [43, 26, 19, 14],
    "T3s": [46, 29, 22, 19],
    "T3o": [42, 26, 18, 14],
    "T2s": [45, 29, 21, 17],
    "T2o": [42, 25, 17, 13],
    "98s": [51, 36, 29, 24],
    "98o": [48, 33, 25, 20],
    "97s": [50, 34, 27, 22],
    "97o": [47, 31, 23, 18],
    "96s": [48, 32, 25, 20],
    "96o": [45, 29, 21, 17],
    "95s": [46, 30, 23, 19],
    "95o": [43, 27, 19, 15],
    "94s": [44, 28, 21, 17],
    "94o": [41, 25, 17, 13],
    "93s": [43, 28, 21, 17],
    "93o": [40, 24, 17, 13],
    "92s": [42, 27, 20, 16],
    "92o": [39, 23, 16, 12],
    "87s": [48, 34, 27, 22],
    "87o": [46, 31, 23, 19],
    "86s": [47, 32, 25, 21],
    "86o": [44, 29, 21, 17],
    "85s": [45, 30, 23, 19],
    "85o": [42, 27, 19, 15],
    "84s": [43, 28, 21, 17],
    "84o": [40, 24, 18, 13],
    "83s": [41, 26, 20, 16],
    "83o": [38, 22, 16, 12],
    "82s": [40, 26, 19, 16],
    "82o": [37, 22, 15, 11],
    "76s": [46, 32, 25, 21],
    "76o": [43, 29, 22, 17],
    "75s": [44, 30, 23, 19],
    "75o": [41, 27, 20, 16],
    "74s": [42, 28, 22, 18],
    "74o": [39, 25, 18, 14],
    "73s": [40, 26, 20, 16],
    "73o": [37, 22, 16, 12],
    "72s": [38, 25, 18, 15],
    "72o": [35, 20, 14, 11],
    "65s": [43, 30, 24, 20],
    "65o": [40, 27, 20, 16],
    "64s": [41, 29, 22, 18],
    "64o": [38, 25, 18, 14],
    "63s": [39, 27, 20, 17],
    "63o": [36, 23, 16, 13],
    "62s": [38, 25, 19, 15],
    "62o": [34, 21, 15, 11],
    "54s": [41, 29, 23, 19],
    "54o": [38, 25, 19, 15],
    "53s": [39, 27, 21, 18],
    "53o": [36, 23, 17, 14],
    "52s": [38, 25, 20, 16],
    "52o": [34, 21, 15, 12],
    "43s": [38, 26, 20, 17],
    "43o": [34, 22, 16, 13],
    "42s": [36, 25, 19, 16],
    "42o": [33, 21, 15, 12],
    "32s": [35, 24, 18, 15],
    "32o": [31, 20, 14, 11]
  };





