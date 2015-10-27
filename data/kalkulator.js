// Get all the keys from document
var keys = document.querySelectorAll('#calculator span');
var operators = ['+', '-', 'x', '/', '%'];
var decimalAdded = false;

// Add onclick event to all the keys and perform operations
for(var i = 0; i < keys.length; i++) {
	keys[i].onclick = function(e) {
		// Get the input and button values
		var input = document.querySelector('.screen');
		var inputVal = input.textContent;
		var btnVal = this.textContent;
		
		if(btnVal == 'copy'){
			addon.port.emit('kopiToClipboard', inputVal);
			btnVal = '';
		}
		// Now, just append the key values (btnValue) to the input string and finally use javascript's eval function to get the result
		// If clear key is pressed, erase everything
		if(btnVal == 'C') {
			input.textContent = '';
			decimalAdded = false;
		}
		
		// If key is pressed, calculate and display the result
		else if(btnVal == '=') {
			var equation = inputVal;
			var lastChar = equation[equation.length - 1];
			
			// Replace all instances of x with * respectively. This can be done easily using regex and the 'g' tag which will replace all instances of the matched character/substring
			equation = equation.replace(/x/g, '*');

			//percent only work to calculate with the first digit that occure.
			if(lastChar == '%'){
				var operate = new RegExp("[-+*x]");
				equation = equation.replace(/%/g, '/100');
				var prefix = '';
				for(var f = 0; f < inputVal.length; f++){
					if(prefix.match(operate)){
						break;
					} else if(inputVal.charAt(f) == '%'){
						prefix = '';
						break;
					}
					prefix += inputVal.charAt(f);
				}
				//console.log(prefix);
				equation = equation + '*' + prefix;
				//console.log(equation);
			} else if(lastChar != '%' && inputVal.indexOf('%') > -1){
				equation = equation.replace(/%/, '/100*');
				//console.log(equation);
			}
			
			// Final thing left to do is checking the last character of the equation. If it's an operator or a decimal, remove it
			if(operators.indexOf(lastChar) > -1 || lastChar == '.')
				equation = equation.replace(/.$/, '');
			
			if(equation)
				//
				var result =( new Function('return ' + equation));
				input.textContent = result();
				//only 13 character result limit
				if(input.textContent.length > 13){
					var n;
					var divs = document.getElementsByClassName('screen');
					for(n=0;n<divs.length;n++) {
					if(divs[n].className == 'screen') {
						divs[n].textContent = divs[n].textContent.substring(0,13);
						}
					}
					//round up
					if(!decimalAdded){
						input.textContent = result().toPrecision(12);
					}
				}
				
			decimalAdded = false;
		}
		
		//TO DO
		//add power **
		else if(operators.indexOf(btnVal) > -1) {
			// Operator is clicked
			// Get the last character from the equation
			var lastChar = inputVal[inputVal.length - 1];

			// Only add operator if input is not empty and there is no operator at the last
			if(inputVal != '' && operators.indexOf(lastChar) == -1) 
				input.textContent += btnVal;
			
			// Allow minus if the string is empty
			else if(inputVal == '' && btnVal == '-') 
				input.textContent += btnVal;

			// Replace the last operator (if exists) with the newly pressed operator
			if(operators.indexOf(lastChar) > -1 && inputVal.length > 1) {
				// Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
				input.textContent = inputVal.replace(/.$/, btnVal);
			}

			//Can't make the percent calculate first, especially when met '/' operator. So just disable percent whenever there is a '/'
			if(inputVal.indexOf('/') > -1 && btnVal == '%'){
				input.textContent = inputVal.replace(/%/, '');
			}

			decimalAdded =false;
		}
		//clear the result of infinity
		else if(inputVal == Number.POSITIVE_INFINITY || inputVal == Number.NEGATIVE_INFINITY ){
			input.textContent = inputVal.replace(/Infinity/ig, '');
		}	

		// Now only the decimal problem is left. We can solve it easily using a flag 'decimalAdded' which we'll set once the decimal is added and prevent more decimals to be added once it's set. It will be reset when an operator, eval/return or clear key is pressed.
		//not allowing dot appendix if empty.
		else if(btnVal == '.') {
			if(!decimalAdded && inputVal !='') {
				input.textContent += btnVal;
				decimalAdded = true;
			}
		}
		
		// if any other key is pressed, just append it
		else {
			input.textContent += btnVal;
		}
		
		// prevent page jumps
		e.preventDefault();
	} 
}

