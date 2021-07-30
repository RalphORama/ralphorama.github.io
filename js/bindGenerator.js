/**
 * ChatterBox for Source: Bind hundreds of phrases to one key in any Source Engine game!
 * Copyright (C) 2015-2021  Ralph Drake
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// Version number
var version = "1.2.1";

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
  // BEGIN FORM VALIDATION
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
  // END FORM VALIDATION
  // ------------------------------

  // Populate the array of aliases
  userBindList = userBindList.split("\n");
  for ( var i = 0; i < userBindList.length; ++i ) {
    // Check to make sure the message isn't too long
    // Most Source Engine games have a max char count of 229
    if ( userBindList[i].length > 229 ) {
      alert( "One of your messages is longer than 229 characters, the maximum length for a chat message." );
      selectTextAreaLine( document.getElementById("phrases"), i );
      return false;
    }

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
        // alias myAlias myAlias01"
        newAlias = "alias " + userBindName + " " + userBindName + (i + 1) + '"';
      }
      else {
        newAlias = "alias " + userBindName + " " + userBindName + 0 + '"';
      }

      userBindList[i] = aliasText + newAlias;
    }
    else {
      userBindList[i] = "alias " + bindNumber + "\"say " + userBindList[i] + "\"";
    }
  }

  // ------------------------------
  // GENERATE FINAL OUTPUT TEXT
  // ------------------------------
  var output = "";

  // Add a comment so the user knows what version the script was generated with
  output += "// Generated with ChatterBox for Source v" + version +"\n";
  output += "// http://ralphorama.github.io/\n\n";

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

    // alias "myBind_cycle" "myBind_diceroll_0"
    output += 'alias "' + userBindName + '_cycle" "' + userBindName + '_diceroll_0"\n';

    // alias "myBind" "myBind0; myBind_cycle"
    output += '\nalias "' + userBindName + '" "' + userBindName + '0; ' + userBindName + '_cycle' + '" \n';

    output += "\n";

    output += "// Add some randomness by adding the shuffle to movement.\n";
    output += "// WARNING: If you use something like the null-cancelling movement script, you should delete this.\n";
    // myBind_cycle
    var cycleName = userBindName + '_cycle';
    output += 'bind w "+forward; ' + cycleName + '"\n';
    output += 'bind s "+back; ' + cycleName + '"\n';
    output += 'bind a "+moveleft; ' + cycleName + '"\n';
    output += 'bind d "+moveright; ' + cycleName + '"\n';
  }
  else {
    // create the actual alias (e.g. alais "test" "test0")
    output += '\nalias "' + userBindName + '" "' + userBindName + '0" \n';
  }

  // if the user wants to bind their script to a key
  if ( userBindKey != "" ) {

    var toBind = "";

    if ( userBindRand ) {
      // myBind; myBind_cycle
      toBind = userBindName + "; " + userBindName + "_cycle";
    }
    else {
      // myBind
      toBind = userBindName;
    }

    // bind "kp_pgup" "myBind; myBind_cycle"
    output += '\nbind "' + userBindKey + '" "' + toBind + '"\n';
  }

  // Add the watermark if people want it
  if ( userAddWMark ) {
    // Handle the watermark in its own function as well
    output += coolWatermark();
  }

  outputField.value = output.trim();

}

// Creates a shitload of aliases in order to randomize which bind will be chosen
function generateRandomBinds( bindArray, bindName ) {

  // create an empty array that we'll fill with lines of aliases for randomizing
  var arrayForRandomizing = [];

  for ( var i = 0; i < bindArray.length; ++i ) {
    // initialize the line we're going to push into the array we're returning
    var toPush;

    // e.g. myBind_diceroll_3
    var diceName = bindName + "_diceroll_" + i;
    var nextDiceName = "";

    if ( i != bindArray.length - 1 ) {
      // e.g. myBind_diceroll_1
      nextDiceName = bindName + "_diceroll_" + (i + 1);
    }
    else {
      // If we're in the last item in the array
      // myBind_diceroll_0
      nextDiceName = bindName + "_diceroll_" + "0";
    }

    // Create full line
    // e.g. alias "myBind_diceroll_3" "alias myBind myBind3; alias myBind_cycle myBind_diceroll_4"
    toPush = 'alias "' + diceName + '" "alias ' + bindName + ' ' + bindName + i + '; alias ' + bindName + '_cycle ' + nextDiceName + '"';

    // push the line we just created into the array to return
    arrayForRandomizing.push( toPush );
  }

  // return that whole goddamn array
  return arrayForRandomizing;

}

// Just returns a cool watermark, put here for orginization.
function coolWatermark() {
  var toReturn = "\n";
  toReturn += 'echo ".__                    .___         .___"\n';
  toReturn += 'echo "|  |   _________     __| _/____   __| _/"\n';
  toReturn += 'echo "|  |  /  _ \\__  \\   / __ |/ __ \\ / __ | "\n';
  toReturn += 'echo "|  |_(  <_> ) __ \\_/ /_/ \\  ___// /_/ | "\n';
  toReturn += 'echo "|____/\\____(____  /\\____ |\\___  >____ | "\n';
  toReturn += 'echo "                \\/      \\/    \\/     \\/ "\n';
  toReturn += 'echo "Congrats! You just loaded some cool binds."\n';
  toReturn += 'echo "Generated with love at http://ralphorama.github.io/"\n';

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
function quotesFound( line ) {

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
