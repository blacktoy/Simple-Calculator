//
var {ToggleButton} = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");

var clipboard = require("sdk/clipboard");

var button = ToggleButton({
	id: "my-button", 
    label: "Simple Calculator",
    icon: {
      "16": "./calculator-addon-icon/kalkulator16_icon.png",
	    "24": "./calculator-addon-icon/kalkulator24_icon.png",
      "32": "./calculator-addon-icon/kalkulator32_icon.png",
      "48": "./calculator-addon-icon/kalkulator48_icon.png",
      "64": "./calculator-addon-icon/kalulator64_icon.png"
    },
    onChange: handleChange
});

var panel = panels.Panel({
	contentStyle: "body{background: -moz-linear-gradient(#171717, #F5F5F5, #171717);}",
  width: 274,
  height: 278,
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

panel.on('show', function(){
  panel.port.on('kopiToClipboard', function(request){
    clipboard.set(request);
  })
});