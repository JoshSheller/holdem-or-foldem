

/*
                                        GLOBAL VARIABLES (except oddsArray is at the end of this file)
*/

var cards = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
var suits = ["s", "h", "d", "c"];

var users = {};
var currentUser = null;

var firstHoleCard = null;
var secondHoleCard = null;
var suited = null;
var hand = null;

var numOpponents = 1;

var previousFunnyImage = '';

var scores = [84, 99, 91, 65, 87, 55, 72, 68, 95, 42];
var topScorers = [];
var scoreLimit = 90;

function testUnderscore() {
  topScorers = _.select(scores, function(score){ return score > scoreLimit;});
  
  alert(topScorers);
};

/*
                                        PAGE NAVIGATION (sort of)

showUserContent()
      displays the userHome content by changing its display style to block
      hides the index content by changing its display style to none
      clears the hand-histories results content (in case the user has been changed or so the current user cannot "cheat")
showIndexContent()
      displays the index content by changing its display style to block
      hides the userHome content by changing its display style to none
randomFunnyImage()
      a local randImage variable is declared containing a random number between 0-9
      if this random number is the same as the global variable 'previousFunnyImage', start randomFunnyImage() over
      else set previousFunnyImage to equal the new randImage value and use this number to display a random funny image with
        an img src tag in the 'funny-image' div
          (the image names are 0 through 10 .jpg)
*/

function showUserContent() {
  document.getElementById('index').style.display = "none";
  document.getElementById('userHome').style.display = "block";
  document.getElementById('hand-histories').innerHTML = '';
};

function showIndexContent() {
  document.getElementById('userHome').style.display = "none";
  document.getElementById('index').style.display = "block";
  randomFunnyImage();
};

function randomFunnyImage() {
  var randImage = Math.floor(Math.random() * 10);

  if (randImage == previousFunnyImage) {
    randomFunnyImage();
  } else {
    previousFunnyImage = randImage;
    document.getElementById('funny-image').innerHTML = '<img src="/assets/' + randImage + '.jpg" />';
  };
};

/*
                                        USER CREATION / SIGN IN / SIGN OUT
newUser()
      the user submitted username is stored in a local variable "newUsername"
      the user submitted password is stored in a local variable "newPassword"
      if the submitted username is blank, the user is alerted to try again
      else if the username already exists, the user is alerted to try again
      else if the username is not blank and does not already exist the password is tested --> if blank the user is alerted to try again
      else (username and password are both valid) --> the newUsername is converted to a string and added as an object to the users object
      the newPassword is converted to a string and stored as a "password" object in the newly created user object
      the newUsername is converted to a string and stored in the global currentUser variable
      the user is alerted with a welcome message
      showUserContent() is utilized to "change the page" to userHome
logIn()
      the user submitted username is stored in a local variable "username"
      the user submitted password is stored in a local variable "userPassword"
      if the submitted username is blank the user is alerted to try again
      else if the password is blank the user is alerted to try again
      else if the username does not exist in the users object the user is alerted to try again
      else if the submitted password does not match the password associated with the submitted username object the user is alerted
      else (username and password match) the submitted username is converted to a string and stored in the global currentUser object
      showUserContent() is utilized to "change the page" to userHome
logOut()
      the global currentUser variable is set to null
      the "begin-play" div is reset to its original state
      showIndexContent() is utilized to "change the page" to index
*/

function newUser() {
  var newUsername = document.getElementById("new-username").value;
  var newPassword = document.getElementById("new-password").value;
  if (newUsername == '') {
    alert("Please add a username and re-submit!");
  } else if (users[newUsername.toString()] != undefined) {
    alert(newUsername + " already exists, please try another username :)");
  } else if (newPassword == '') {
    alert("Please add a password and re-submit!");
  } else {
    users[newUsername.toString()] = {};
    users[newUsername.toString()].password = newPassword.toString();
    users[newUsername.toString()].handsPlayed = [];

    currentUser = newUsername.toString();

    alert("Welcome, " + currentUser + ". Let the poker practice begin!");

    showUserContent();
  };
};

function logIn() {
  var username = document.getElementById("username").value;
  var userPassword = document.getElementById("password").value;
  if (username == '') {
    alert("Please add your username and re-submit!");
  } else if (userPassword == '') {
    alert("Please add your password and re-submit!");
  } else if (users[username.toString()] == undefined) {
    alert("This username does not exist, please try again :)");
  } else if (userPassword.toString() != users[username.toString()].password) {
    alert("This password does not match this username, please try again :)");
  } else {
    currentUser = username.toString();
    showUserContent();
  };
};

function logOut() {
  currentUser = null;

  document.getElementById('begin-play').innerHTML = '<input id="begin-button" type="submit" value="Begin Play!" onclick="beginPlay()">';
  document.getElementById('first-hole-card').innerHTML = '<img src="/assets/faceDown.png" />';
  document.getElementById('second-hole-card').innerHTML = '<img src="/assets/faceDown.png" />';

  showIndexContent();
};


/*
                                        SELECTING / DISPLAYING A RANDOM POKER HAND

randCardNumber()
      returns a number representing one of the possible 13 cards (each having 4 suits = 52 in a deck)

randSuit()
      returns a number representing one of the 4 possible suits (spades/hearts/diamonds/clubs)

randCard()
      utilizes the two above functions to return a string by combining two values from the global (cards) and (suits) arrays

setHandAndSuited() 
      creates a string to represent a hand with two face cards and an "o" or "u" representing offsuit or suited
      this begins by checking if the two cards have the same face value (a pocket pair) in which case the hand 
        is set (pocket pairs are always unsuited)
      else if the two suits are different a string is created with the first and second cards and "o" for offsuit 
        (and stored in global hand variable)
      if this string exists in the oddsArray object the hand is set (AKs exists --> however KAs does not)
      if this string does not exists, the faces are swapped and the hand is set
      if the two suits were the same, the same testing for the existence of the string in oddsArray and swapping 
        card faces if not is done

holeCards() 
      utilizes randCard() to choose two random cards for a user hand (firstHoleCard/secondHoleCard)
      while the two random cards happen to be the same, secondHoleCard is reset as a new random card
      next setHandAndSuited() is utilized to set the global hand variable
      finally the two image divs for the hole cards are set to display each of the chosen cards (the images are named AKs etc)
*/

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

  while(firstHoleCard == secondHoleCard) {
    secondHoleCard = randCard();
  };

  setHandAndSuited();

  document.getElementById('first-hole-card').innerHTML = '<img src="/assets/' + firstHoleCard + '.png" />';
  document.getElementById('second-hole-card').innerHTML = '<img src="/assets/' + secondHoleCard + '.png" />';
};

/*
                                        USER PLAY

beginPlay() 
      utilizes holeCards() to set and display the user's hole cards
      it also adds a user input box for the user to put in their % prediction
selectNumOpponents()
      stores the # of opponents selector box location in a local variable "selectBox"
      sets the global variable "numOpponents" to the user selected value of the above selectBox
addToUserVariance()
      receives and stores user % prediction in a local variable currentPrediction
      if the user prediction is not a number the user is alerted to enter a valid prediction
      next both the user % prediction and actual % are displayed to the user
      if the handsPlayed array does not contain any previous submissions for the current hand and number of opponents an array
            is created and the user submission is stored within it
      else the user % prediction is pushed to the existing hand and number of opponent array
      finally in either case, the % submission box is removed and replaced with a next hand button option
*/

function beginPlay() {
  holeCards();

  document.getElementById('begin-play').innerHTML = '<p>Submit Your % Prediction</p><input type="text" id="current-prediction"><input id="prediction-submit" type="submit" onclick="addToUserVariance()"></form>';
};

function selectNumOpponents() {
  var selectBox = document.getElementById("numOpponentSelector");
  numOpponents = selectBox.options[selectBox.selectedIndex].value;
};

function addToUserVariance() {
  var currentPrediction = document.getElementById("current-prediction").value;
  if (currentPrediction < 0 || currentPrediction > 100) {
    alert("Your percent prediction is out of the possible range, please enter a number between 0 - 100");
  } else if (isNaN(currentPrediction)) {
    alert("This is not a valid number, please enter a number as your prediction :)");
  } else {
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
};

/*
                                        USER ANALYSIS

handHistories()
      creates a local "output" variable
      for each hand played by the user, the hand name followed by all previous user % submissions is added to the output variable
      the output variable is displayed in the Analysis section of the userHome "page"
singleHandVariance() --> (not in use)
      user submitted hand is stored in a local "hand" variable
      user submitted # opponents is stored in a local "numOpponents" variable
      a local totalVariance variable is declared
      a local handVariance variable is declared
      for each entry by the user for the given hand & # opponents, the absolute value of the difference between their % prediction
        and the actual % is added to totalVariance
      handVariance is set to equal the totalVariance divided by the number of entries for this hand
      handVariance is displayed in the Analysis section within the 'show-single-hand-variance' divs
allHandVariances()
      declares an empty local variable 'output'
      for each hand played by the user, three local variables are declared (totalVariance/currentHandString/numOpponents)
      if the card entry is 3 letters in length (a pocket pair without a suited or unsuited letter)
        store the first two letters (the card) in the currentHandString variable
        store the third letter (number of opponents) in the numOpponents variable
      else (the card is not a pocket pair and has four letters)
        store the first three letters (the card and suited or unsuited) in the currentHandString variable
        store the fourth letter (number of opponents) in the numOpponents variable
      (nested) for each entry in the current hand, add the absolute value of the difference between the user entry
        and the actual %
      the totalVariance for current hand is divided by the number of user entries for said hand to give 
        hand variance are added to 'output'
      output is displayed in the 'hand-variances' div
      
handVarianceRange()
      an 'output' variable is declared with an <h2> of the given lowerLimit and upperLimit arguments as a range
      for each hand played by the user, three local empty variables are declared (totalVariance/currentHandString/numOpponents)
      if the card entry is 3 letters in length (a pocket pair without a suited or unsuited letter)
        store the first two letters (the card) in the currentHandString variable
        store the third letter (number of opponents) in the numOpponents variable
      else (the card is not a pocket pair and has four letters)
        store the first three letters (the card and suited or unsuited) in the currentHandString variable
        store the fourth letter (number of opponents) in the numOpponents variable
      (nested) for each entry in the current hand, add the absolute value of the difference between the user entry
        and the actual %
      the totalVariance for current hand is divided by the number of user entries for said hand and stored in currentHandVariance
      if the currentHandVariance value is between the given lowerLimit/upperLimit arguments the card name and currentHandVariance
        are added to 'output'
      output is returned

allHandVarianceRanges()
      an empty 'output' variable is declared
      utlizes handVarianceRange() to add cards with variances within desired ranges to local 'output' variable
      displays 'output' in 'all-hand-variance-ranges' div
*/

function handHistories() {
  var output = '';

  for (var i = 0; i < users[currentUser].handsPlayed.length; i++) {
    output += users[currentUser].handsPlayed[i] + ' : ' + users[currentUser][(users[currentUser].handsPlayed[i])] + "<br><br>";
  };

  document.getElementById('hand-histories').innerHTML = '<p>' + output + '</p>';
};

/* not in use */
function singleHandVariance() {
  var hand = document.getElementById('single-hand-variance').value;
  var numOpponents = document.getElementById('single-hand-opponents').value;
  var totalVariance = 0;
  var handVariance = 0;

  for (var i = 0; i < (users[currentUser][hand + numOpponents]).length; i++) {
     totalVariance += Math.abs((users[currentUser][hand + numOpponents][i]) - oddsArray[hand][numOpponents - 1]);
   };

   handVariance = totalVariance / users[currentUser][hand + numOpponents].length;
   document.getElementById('show-single-hand-variance').innerHTML = '<p>' + handVariance + '</p>';
};

function allHandVariances() {
  var output = '';

  for (var i = 0; i < users[currentUser].handsPlayed.length; i++) {
    var totalVariance = 0;
    var currentHandString = '';
    var numOpponents = 0;

    if ((users[currentUser].handsPlayed[i]).length == 3) {
      currentHandString = (users[currentUser].handsPlayed[i]).charAt(0) + (users[currentUser].handsPlayed[i]).charAt(1);
      numOpponents = (users[currentUser].handsPlayed[i]).charAt(2);
    } else {
      currentHandString = (users[currentUser].handsPlayed[i]).charAt(0) + (users[currentUser].handsPlayed[i]).charAt(1) + (users[currentUser].handsPlayed[i]).charAt(2);
      numOpponents = (users[currentUser].handsPlayed[i]).charAt(3);
    };
    for (var j = 0; j < (users[currentUser][(users[currentUser].handsPlayed[i])]).length; j++) {
      totalVariance += Math.abs(users[currentUser][(users[currentUser].handsPlayed[i])][j] - oddsArray[currentHandString][numOpponents - 1]);
    };
    output += users[currentUser].handsPlayed[i] + ' : ' + totalVariance / users[currentUser][(users[currentUser].handsPlayed[i])].length + "<br><br>";
  };

  document.getElementById('hand-variances').innerHTML = '<p>' + output + '</p>';
};

function handVarianceRange(lowerLimit, upperLimit) {
  var output = '<h2>' + lowerLimit + '-' + upperLimit + '</h2>';

  for (var i = 0; i < users[currentUser].handsPlayed.length; i++) {
    var totalVariance = 0;
    var currentHandString = '';
    var numOpponents = 0;

    if ((users[currentUser].handsPlayed[i]).length == 3) {
      currentHandString = (users[currentUser].handsPlayed[i]).charAt(0) + (users[currentUser].handsPlayed[i]).charAt(1);
      numOpponents = (users[currentUser].handsPlayed[i]).charAt(2);
    } else {
      currentHandString = (users[currentUser].handsPlayed[i]).charAt(0) + (users[currentUser].handsPlayed[i]).charAt(1) + (users[currentUser].handsPlayed[i]).charAt(2);
      numOpponents = (users[currentUser].handsPlayed[i]).charAt(3);
    };
    for (var j = 0; j < (users[currentUser][(users[currentUser].handsPlayed[i])]).length; j++) {
      totalVariance += Math.abs(users[currentUser][(users[currentUser].handsPlayed[i])][j] - oddsArray[currentHandString][numOpponents - 1]);
    };
    var currentHandVariance = totalVariance / users[currentUser][(users[currentUser].handsPlayed[i])].length;
    if (lowerLimit <= currentHandVariance && currentHandVariance <= upperLimit) {
      output += users[currentUser].handsPlayed[i] + ' : ' + currentHandVariance + "<br><br>";
    };
  };
  return output;
};

function allHandVarianceRanges() {
  var output = '';

  output += handVarianceRange(0, 10);

  output += handVarianceRange(10, 20);

  output += handVarianceRange(20, 30);

  output += handVarianceRange(30, 40);

  output += handVarianceRange(40, 50);

  output += handVarianceRange(50, 60);

  output += handVarianceRange(60, 70);

  output += handVarianceRange(70, 80);

  output += handVarianceRange(80, 90);

  output += handVarianceRange(90, 100);

  document.getElementById('all-hand-variance-ranges').innerHTML = '<p>' + output + '</p>';
};



/*
                                        @JAS FIX UP AND UTILIZE BELOW
*/

function showTotalVariance() {
  var totalVariance = 0;

  for (var i = 0; i < (users[currentUser][hand + numOpponents]).length; i++) {
    totalVariance += Math.abs((users[currentUser][hand + numOpponents][i]) - oddsArray[hand][numOpponents - 1]);
  };
  
  document.getElementById('show-single-hand-variance').innerHTML = '<p>' + totalVariance / users[currentUser][hand + numOpponents].length + '</p>';
};

function contains(a, obj) {
  for (var i = 0; i < a.length; i++) {
    if (a[i] === obj) {
      return true;
    };
  };
  return false;
};

/*
                                        DEV FUNCTIONS

showCurrentUserObject()
      creates a local variable "output"
      adds each property of the current user object to output
      displays output
*/

function showCurrentUserObject() {
  var output = '';
  for (var property in users[currentUser]) {
    output += property + ': ' + users[currentUser][property]+'; ';
  };
  alert(output);
};

/*
                                        BUGS TO FIX / ADDONS TO FINISH


      add responses to user depending on how close their prediction was?

      add simpler game version which gives user %'s to choose from instead of asking for specific % prediction

      call functions with arguments and use return values more instead of pulling values from 
        document.getElementById('').value

      could rewrite pocket pairs with "o" for offsuit to keep everything consistent / simplify a few functions / reduce confusion
      for user when typing hand in for results

      add alert to handHistories() when user has no hand histories (not that important)

      improve hand naming conventions and app etc better / give a ? option to see this information only if needed by user

      CLEAN UP allHandVariances() --> it is such a horrible unreadable mess!?
          don't forget to add comment to explain this mess

      ability for user to clear hand histories or specific hand history
*/

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





