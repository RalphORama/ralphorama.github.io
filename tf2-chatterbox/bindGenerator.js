// Prevent the form from resetting itself when the user submits it
$("#generator-form").submit(function(event){
   event.preventDefault();
});

function createBinds() {

  // Get user input values
  var userBindList = document.getElementById("phrases").value;
  var userBindName = document.getElementById("bindName").value;
  var userBindRand = document.getElementById("randomize").checked;
  var userBindKey  = document.getElementById("bindKey").value.trim();
  var userAddWMark = document.getElementById("watermark").checked;

  // Save the output object for later
  var outputField  = document.getElementById("results");

  // ------------------------------
  // BEGIN ERROR CHECKING BOYEEE
  // ------------------------------
  if ( userBindList.indexOf("\"") != -1 || userBindName.indexOf("\"") != -1 ) {
    return quotesFound();
  }

  if ( !userBindList ) {
    return emptyBindList();
  }

  if ( !userBindName ) {
    return emptyBindName();
  }
  // ------------------------------
  // END ERROR CHECKING
  // ------------------------------

  // Populate the array of aliases
  userBindList = userBindList.split("\n");
  for ( var i = 0; i < userBindList.length; ++i ) {
    // create Bind Number Name, e.g. mybindlist1, mybindlist23
    var bindNumber = '"' + userBindName + i +'" ';

    // set up the first part of the alias
    // e.g. alias "mybindlist23" "inputString";
    // TODO: Remove Trailing Whitespace
    var aliasText = "alias " + bindNumber + "\"say " + userBindList[i] + "; ";

    // set up the second part of the alias
    // if we're not at the end of the binds, make bind set next bind to
    // this bind's number + 1, otherwise set next bind to bind 1
    if ( !userBindRand ) {
      var newAlias = "";
      if ( i + 1 < userBindList.length ) {
        newAlias = "alias " + userBindName + " " + userBindName + (i + 1) + '"';
      }
      else {
        newAlias = "alias " + userBindName + " " + userBindName + 0 + '"';
      }

      userBindList[i] = aliasText + newAlias;
    }
    else {
      userBindList[i] = aliasText;
    }
  }

  // ------------------------------
  // GENERATE FINAL OUTPUT TEXT
  // ------------------------------
  var output = "";

  for ( var i = 0; i < userBindList.length; ++i ) {
    output += userBindList[i] + "\n";
  }

  // if the user wants random cycling, give them random cycling
  if ( userBindRand ) {
    // get an array of the randomly generated binds (dicerolls)
    randomizeArray = generateRandomBinds( userBindList, userBindName );

    // add all the dicerolls to the output
    output += "\n";

    for ( var i = 0; i < randomizeArray.length; ++i ) {
      output += randomizeArray[i] + "\n";
    }

    output += "\n";

    output += 'alias "' + userBindName + '_cycle" "' + userBindName + '_diceroll_0"\n';

    output += '\nalias "' + userBindName + '" "' + userBindName + '0; ' + userBindName + '_cycle' + '" \n';

    output += "\n";

    output += "// Add some randomness by adding the shuffle to movement.\n";
    output += "// WARNING: If you use something like the null-cancelling movement script, you should delete this.\n";
    var cycleName = userBindName + '_cycle';
    output += 'bind w "+forward; ' + cycleName + '"';
    output += 'bind s "+back; ' + cycleName + '"';
    output += 'bind a "+moveleft; ' + cycleName + '"';
    output += 'bind d "+moveright; ' + cycleName + '"';

  }
  else {
    // create the actual alias (e.g. alais "test" "test0")
    output += '\nalias "' + userBindName + '" "' + userBindName + '0" \n';
  }

  // if the user wants to bind their script to a key
  if ( userBindKey != "" ) {
    // bind "k" "test; test_cycle"
    output += '\nbind "' + userBindKey + '" "' + userBindName + '"\n';
  }

  // Add the watermark if people want it
  if ( userAddWMark ) {
    // Handle the watermark in its own function as well
    output += coolWaterMark();
  }

  outputField.value = output;

}

// Creates a shitload of aliases in order to randomize which bind will be chosen
function generateRandomBinds( bindArray, bindName ) {

  var arrayForRandomizing = [];

  for ( var i = 0; i < bindArray.length; ++i ) {
    var toPush;

    if ( i != bindArray.length - 1 ) {
      var diceName = bindName + "_diceroll_" + i;
      var nextDiceName = bindName + "_diceroll_" + (i + 1);
      toPush = 'alias "' + diceName + '" "alias ' + bindName + ' ' + bindName + i + '; alias ' + bindName + '_cycle ' + nextDiceName + '"';
    }
    else {
      // If we're in the last item in the array
      var diceName = bindName + "_diceroll_" + (bindArray.length - 1);
      var nextDiceName = bindName + "_diceroll_" + "0";
      toPush = 'alias "' + diceName + '" "alias ' + bindName + ' ' + bindName + i + '; alias ' + bindName + '_cycle ' + nextDiceName + '"';
    }

    arrayForRandomizing.push( toPush );
  }

  return arrayForRandomizing;

}

// Just returns a cool watermark, put here for orginization.
function coolWaterMark() {
  var toReturn = "\n";
  toReturn += 'echo ".__                    .___         .___"\n';
  toReturn += 'echo "|  |   _________     __| _/____   __| _/"\n';
  toReturn += 'echo "|  |  /  _ \\__  \\   / __ |/ __ \\ / __ | "\n';
  toReturn += 'echo "|  |_(  <_> ) __ \\_/ /_/ \\  ___// /_/ | "\n';
  toReturn += 'echo "|____/\\____(____  /\\____ |\\___  >____ | "\n';
  toReturn += 'echo "                \\/      \\/    \\/     \\/ "\n';
  toReturn += 'echo "Congrats! You just loaded some cool binds."\n';
  // TODO: Add Website Plug
  toReturn += 'echo "Generated with love at "\n';

  return toReturn;
}

// Reset all the fields n shit
function resetForm() {

  if ( confirm('Are you sure you want to reset every field?') ) {
    document.getElementById("phrases").value = "";
    document.getElementById("bindName").value = "";
    document.getElementById("randomize").checked = false;
    document.getElementById("bindKey").value = "";
    document.getElementById("watermark").checked = true;
    document.getElementById("results").value = "";
  }

}

// What to do if we find quotes in the user's input
function quotesFound() {

  // alert the user that they forgot to enter input
  alert('Quotes found in input.');

}

// what to do if the user didn't name his bind
function emptyBindName() {

  alert('Name field is empty');

}

// what to do if the user didn't enter any binds
function emptyBindList() {

  alert('You didn\'t enter any binds!');

}