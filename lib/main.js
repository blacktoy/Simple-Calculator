// for firefox 29+ only 
var {ToggleButton} = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");

var button = ToggleButton({
	id: "my-button", 
    label: "Simple Calculator",
    icon: {
      "16": "./16-icon.png",
	    "24": "./24-icon.png"
    },
    onChange: handleChange
});

var panel = panels.Panel({
	contentStyle: "body{border-radius: 15px; background: -moz-linear-gradient(black, grey, black);}",
  contentURL: self.data.url("kalkulator.html"),
  onHide: handleHide
});

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}


/* earlier version of firefox. Act as a widget
data = require("sdk/self").data

var calculatorPanel = require("sdk/panel").Panel({
    width: 273,
    height: 245,
		contentURL: data.url("kalkulator.html")
		});

require("sdk/widget").Widget({
	id: "open-calculator-btn", 
    label: "Simple-Calculator",
    contentURL: data.url("16-icon.png"),
    panel: calculatorPanel
});
*/

