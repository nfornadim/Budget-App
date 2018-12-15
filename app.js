//Budget Controller
var budgetController = (function() {

	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(cur) {
			sum += cur.value;
		});
		data.totals[type] = sum;
	};

// Data structure
	
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
		// -1 is a convention for non existence 
		
	};

	return {
		addItem: function(type, des, val) {
			var newItem, ID;

			// if array length + 1 = [1 2 3 4 5], next ID = 6
			// But in [1 2 3 4  6 8], next ID = 9
			// therefore last id + 1

			// Create new ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			

			// Create new item based on 'inc' or 'exp' type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income (ID, des, val);
			}

			// Push it into our data structure
			data.allItems[type].push(newItem);

			// Return the new element
			return newItem;
		}, 

		calculateBudget: function() {

			// Calculate both income & expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// Calculate the budget: income - expense
			data.budget = data.totals.inc - data.totals.exp;

			// Calulate the percentage of income that we spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
			

			// Expense = 100 and income 300, spent 33.333% = 100/300 = 0.333 * 100
		},

		getBudget: function() {
			return {
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				budget: data.budget,
				percentage: data.percentage
			};
		},

		testing: function() {
			console.log(data);
		}
	};

})();

// UI Controller
var UIController = (function() {

	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list'
	};
	
	return {
		getInput: function() {
			return {
				
				type: document.querySelector(DOMstrings.inputType).value, // Whether inc or exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},

		addListItem: function(obj, type) {
			var html, newHtml, incomeContainer, expensesContainer;

			// Create HTML string with placeholder text
			
			if (type === 'inc') {
				element = DOMstrings.incomeContainer;

				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';	
			} else if (type === 'exp') {
				element = DOMstrings.expensesContainer;

				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			

			// Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			// Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		clearFields: function() {
			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(current, index, array) {
				current.value = "";

			});

			fieldsArr[0].focus();

		},

		getDOMstrings: function() {
			return DOMstrings;
		}
	};

})();


// Global App Controller
var controller = (function(budgetCtrl, UICtrl) {

	var setupEventListeners = function() {

		var DOM = UICtrl.getDOMstrings();
	
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(event) {

			if (event.keyCode === 13 || event.which === 13) {
				
				ctrlAddItem();
			}
		});

	};

	var updateBudget = function() {

		// 1. Calculate the budget
		budgetCtrl.calculateBudget();

		// 2. Return the budget
		var budget = budgetCtrl.getBudget();

		// 3. Display the budget on the UI
		console.log(budget);
	};


	var ctrlAddItem = function() {
		var input, newItem;

		// 1. Get the filed input data
		input = UICtrl.getInput();
		
		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

			// 2. Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. Add the item to the UI
			UICtrl.addListItem(newItem, input.type);

			// 4. Clearing input fields
			UICtrl.clearFields();

			// 5. Calculate & update budget
			updateBudget();
		
		};

		
		
	};

	return {
		init: function() {
			setupEventListeners();
		}
	};

})(budgetController, UIController);
	

controller.init();











