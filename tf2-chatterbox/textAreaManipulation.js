// Sourced from http://jsfiddle.net/5enfp/

function selectTextAreaLine( textArea, lineNum ) {
  var lines = textArea.value.split("\n");

  // calculate start and end position
  var startPos = 0, endPos = textArea.value.length;
  for ( var i = 0; i < lines.length; ++i ) {
    if ( i == lineNum ) {
      break;
    }

    startPos += ( lines[i].length + 1 );
  }

  var endPos = lines[lineNum].length + startPos;

  // Select the line (two methods for different browsers)

  // Chrome / Firefox
  if ( typeof(textArea.selectionStart) != "undefined" ) {
    textArea.focus();
    textArea.selectionStart = startPos;
    textArea.selectionEnd = endPos;
    return true;
  }

  // Internet Explorer
  if ( document.selection && document.selection.createRange ) {
    textArea.focus();
    textArea.select();

    var range = document.selection.createRange();
    range.collapse( true );
    range.moveEnd( "character", endPos );
    range.moveStart( "character", startPos )
    range.select();
    return true;
  }

  return false;
}