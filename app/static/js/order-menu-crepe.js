var editCrepeIndex = undefined;
var editCrepe = undefined;

function stringify(dataObject) {
	console.log('dataObject', dataObject);
	if (dataObject['crepeTotal'] > 0) {
		if (editCrepeIndex == undefined) {
			console.log('editCrepeIndexNot: %s', editCrepeIndex);

			if (localStorage.length > 0) {
				const order = JSON.parse(localStorage.getItem(localStorage.key(0)));
				console.log('order: %s', order);

				if ('orderCrepe' in order) {
					// the order object is a dictioanry whose only key is orderCrepe. orderCrepe is an array that holds dictionaries whose only key is "crepes". the value for this
					// key is a list of crepe dictionary objects that were a part of that order
					order['orderCrepe'].push(dataObject);
					const stringifiedDataObject = JSON.stringify(order);
					console.log('stringifiedDataObject', stringifiedDataObject);
					localStorage.setItem('order', stringifiedDataObject);
				} else {
					order['orderCrepe'] = [];
					order['orderCrepe'].push(dataObject);
					const stringifiedDataObject = JSON.stringify(order);
					console.log('order', order);
					console.log('stringifiedDataObject', stringifiedDataObject);
					localStorage.setItem('order', stringifiedDataObject);
				}
			} else {
				const order = {};
				order['orderCrepe'] = [];
				order['orderCrepe'].push(dataObject);
				const stringifiedDataObject = JSON.stringify(order);
				console.log('order', order);
				console.log('stringifiedDataObjectOrder', stringifiedDataObject);
				localStorage.setItem('order', stringifiedDataObject);
			}
		} else {
			console.log('editCrepe', editCrepe);
			var currentOrder = JSON.parse(localStorage.getItem(localStorage.key(0)));
			var currentOrderCrepeList = currentOrder['orderCrepe'];
			var currentOrderCrepe = currentOrderCrepeList[editCrepeIndex];
			Object.assign(currentOrderCrepe, dataObject);
			// if a previously had two proteins and then i remove one then i will have an empty object in my array that i don't want
			for (var i = 0; i < currentOrderCrepeList.length; i++) {
				if (currentOrderCrepeList[i] === {}) {
					currentOrderCrepeList.splice(i);
				}
			}
			localStorage.setItem('order', JSON.stringify(currentOrder));

			console.log('editCrepe2', editCrepe);
		}
	}
	for (var i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		console.log('key: %s', key);

		const value = localStorage[key];
		console.log('value: %s', value);
	}
	return true;
}

function getCSSToppingName(element) {
	var toppingCategory = $(element).closest('.card-deck').attr('id');
	var toppingName = $(element).closest('.card').find('.card-title').text().split(' ');
	var formattedtoppingName = '';

	if (toppingName.length > 1) {
		const firstName = toppingName[0].toLowerCase();
		formattedtoppingName += firstName;
		for (var i = 1; i < toppingName.length; i++) {
			const otherPartsOftoppingName = toppingName[i];
			formattedtoppingName += otherPartsOftoppingName;
		}
		toppingName = formattedtoppingName;
	} else {
		toppingName = toppingName[0].toLowerCase();
	}
	var resultArray = [];
	resultArray.push(toppingCategory);
	resultArray.push(toppingName);
	return resultArray;
}

function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}
//format the document
$(window).on('load', function () {
	$('.card').each(function () {
		var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
		var toppingName = toppingCategoryAndToppingNameArray[1];
		this.id = toppingName;
		$(this).css('--flavorProfile', $(this).closest('.card-deck').attr('id'));
	});

	//https://api.jquery.com/wrap/
	$('.card-img-top').wrap('<div class="container2"></div>');

	$('.card-img-top').each(function (i) {
		$('<button class="btn2" type="button">✓</button>').insertAfter($(this));
		$(`<div class="grid-container"  style="margin-top: 0px; margin-bottom:0px; align-content:space-evenly; align-items:center; grid-template-columns: auto auto auto; align-self: center; overflow:auto;
            grid-gap: 2px; display:grid;"><button class="btn7" type="button">+</button><button class="btn6" type="button">-</button></div>`).insertAfter(
			$(this)
		);
	});

	$('.btn2').each(function (i) {
		this.id = 'btn' + i;
		$(this).css('--quantity', 0);
		// var crepeName = $(this).closest('.card').find('.card-title').text().split(' ').pop().toLowerCase();

		var price = $(this).closest('.card').find('.card-text').text();
		if (price.trim() != '') {
			console.log('price', price);
			price = price.replace('$', '');
			// this is just for the almond milk which has extra in the price name
			if (price.split(' ').length > 1) {
				console.log('price', price);
				$(this).css('--price', price.split(' ').shift());
				console.log('price', price.split(' ').shift());
			} else {
				$(this).css('--price', price);
			}
			// console.log('--price', $(this).css('--price'));
			var flavorProfile = $(this).closest('.card').find('.card-text').text();
		}
	});

	if ($('.edit').length) {
		editCrepeIndex = $('.edit').first().attr('id');
		console.log('editCrepeIndex: %s', editCrepeIndex);
		editCrepe = JSON.parse(localStorage.getItem(localStorage.key(0)))['orderCrepe'][editCrepeIndex];
		console.log('editCrepe: %s', editCrepe);

		const crepeDict = editCrepe['crepes'];
		for (var crepeCategoryKey in crepeDict) {
			console.log('crepeCategoryKey: %s', crepeCategoryKey);

			const crepeArray = crepeDict[crepeCategoryKey];
			console.log('crepeArray: %s', crepeArray);
			for (var i = 0; i < crepeArray.length; i++) {
				const crepe = crepeArray[i];
				if ('name' in crepe) {
					// i add the word milkshake to each name for formatting so i have to remove it for the html element id to be recognized
					const crepeName = crepe['name'];
					console.log('nonCoffeeCrepeName: %s', crepeName);
					const crepeQuantity = crepe['quantity'];
					const crepeServingSize = crepe['servingSize'];
					$(`#${crepeName}`).find('.btn2').css(`--${crepeCategoryKey}`, `${crepeName}`);
					$(`#${crepeName}`).find('.btn2').css(`--${crepeServingSize}`, 'true');
					$(`#${crepeName}`).find('.btn2').css(`--quantity`, `${crepeQuantity}`);
					$(`#${crepeName}`).find('.btn2').html(crepeQuantity);
					$(`#${crepeName}`).find('.btn2').show();
					$(`#${crepeName}`).find('.btn6').show();
					$(`#${crepeName}`).find('.btn7').show();
				}
			}
		}
	}
	const x = document.getElementsByClassName('card-title');
	const y = [];

	for (i = 2; i < x.length; i++) {
		y.push(x[i].innerHTML);
	}

	$('.card-img-top').each(function () {
		this.src = '../static/images/vanilla_ice_cream.jpg';
		console.log('this.src: %s', this.src);
	});
	//veggie + all other topping functionality
	$(document)
		.on('mouseenter', '.card', function () {
			if (
				$(this).find('.card-body').attr('id') != 'cardBody' &&
				$(this).closest('.card-deck').attr('id') != 'toppings'
			) {
				$(this).find('.card-body').css('opacity', '.3');
				$(this).find('.card-img-top').css('opacity', '.3');
			}

			//click the card somewhere
			$(this)
				.find('.card-text, .card-title, .card-body, .card-img-top')
				.unbind('click')
				.bind('click', function () {
					var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
					console.log('toppingCategoryAndToppingNameArray: %s', toppingCategoryAndToppingNameArray);

					var toppingCategory = toppingCategoryAndToppingNameArray[0];
					console.log('toppingCategory: %s', toppingCategory);

					var toppingName = toppingCategoryAndToppingNameArray[1];
					console.log('toppingName: %s', toppingName);

					// if you click the card and it hasn't been selected
					if (
						$(this).closest('.card').find('.btn2').css('--extra') != 'true' &&
						$(this).closest('.card').find('.btn2').css('--half') != 'true' &&
						$(this).closest('.card').find('.btn2').css('--regular') != 'true' &&
						$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`) != toppingName
					) {
						if (parseFloat($(this).closest('.card').find('.btn2').css('--quantity')) === 0) {
							$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
							$(this).closest('.card').find('.btn2').css('--quantity', 1);
							console.log('price', $(this).closest('.card-text').val());

							$(this).closest('.card').find('.btn2').html(1);
							$(this).closest('.card').find('.btn2').show();

							//after clicking the card show the + and - buttons
							$(this).closest('.card').find('.btn6').show();
							$(this).closest('.card').find('.btn7').show();
						}
					} else if ($(this).closest('.card').find('.btn2').css('--half') === 'true') {
						$(this).closest('.card').find('.btn2').css('--half', 'false');
						$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
						$(this).closest('.card').find('.btn2').toggle();
						//https://stackoverflow.com/questions/21286887/adding-check-marks-to-bootstrap-button-drop-down-items/46890814
						$(this).closest('.card').find('.btn2').html('✓');
					} else if ($(this).closest('.card').find('.btn2').css('--extra') === 'true') {
						console.log('dVeggies toggle');
						$(this).closest('.card').find('.btn2').css('--extra', 'false');
						$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
						$(this).closest('.card').find('.btn2').toggle();
						$(this).closest('.card').find('.btn2').html('✓');
					} else if ($(this).closest('.card').find('.btn2').css('--regular') === 'true') {
						$(this).closest('.card').find('.btn2').css('--regular', 'false');
						$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
						$(this).closest('.card').find('.btn2').toggle();
						$(this).closest('.card').find('.btn2').html('✓');
					}
				});
		})
		.on('mouseleave', '.card', function () {
			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			var toppingCategory = toppingCategoryAndToppingNameArray[0];
			var toppingName = toppingCategoryAndToppingNameArray[1];
			// console.log('tc', toppingCategory, 'tn', toppingName);

			if (
				$(this).find('.btn2').css('--extra') != 'true' &&
				$(this).find('.btn2').css('--half') != 'true' &&
				$(this).find('.btn2').css('--regular') != 'true' &&
				$(this).find('.btn2').css(`--${toppingCategory}`) != toppingName
			) {
				$(this).find('.btn').hide();
				$(this).find('.btn3').hide();
				$(this).find('.btn4').hide();
			} else {
				$(this).find('.btn3').hide();
				$(this).find('.btn4').hide();
			}

			$(this).find('img').css('opacity', '1');
			$(this).find('.card-body').css('opacity', '1');
		});

	$('.btn6')
		.unbind('click')
		.bind('click', function () {
			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			var toppingCategory = toppingCategoryAndToppingNameArray[0];
			var toppingName = toppingCategoryAndToppingNameArray[1];
			// console.log('tc', toppingCategory, 'tn', toppingName);
			var currentQuant = parseFloat($(this).closest('.card').find('.btn2').css('--quantity'));
			console.log('currentQuant: %s', currentQuant);

			// console.log('cuuremtQuant', currentQuant);
			currentQuant -= 1;
			console.log('currentQuant: %s', currentQuant);

			if (currentQuant === 0) {
				$(this).closest('.card').find('.btn2').hide();
				$(this).closest('.card').find('.btn2').html(`${currentQuant}`);
				$(this).closest('.card').find('.btn2').css('--quantity', currentQuant);
				$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, 'false');
				$(this).hide();
				$(this).closest('.card').find('.btn7').hide();
			} else {
				$(this).closest('.card').find('.btn2').html(`${currentQuant}`);
				$(this).closest('.card').find('.btn2').show();
				$(this).closest('.card').find('.btn2').css('--quantity', currentQuant);
			}
			console.log('.btn quant value', $(this).closest('.card').find('.btn2').css('--quantity'));
		});

	$('.btn7')
		.unbind('click')
		.bind('click', function () {
			var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
			var toppingCategory = toppingCategoryAndToppingNameArray[0];
			var toppingName = toppingCategoryAndToppingNameArray[1];
			// console.log('tc', toppingCategory, 'tn', toppingName);
			var currentQuant = parseFloat($(this).closest('.card').find('.btn2').css('--quantity'));
			// console.log('--price', $(this).css('--price'));
			currentQuant += 1;
			$(this).closest('.card').find('.btn2').html(`${currentQuant}`);
			$(this).closest('.card').find('.btn2').show();
			$(this).closest('.card').find('.btn2').css(`--${toppingCategory}`, `${toppingName}`);
			$(this).closest('.card').find('.btn2').css('--quantity', currentQuant);

			console.log('.btn quant value', $(this).closest('.card').find('.btn2').css('--quantity'));
		});
});

function checkOut() {
	const menuCrepes = {};
	menuCrepes['crepes'] = [];

	var orderTotal = 0;
	$('.btn2').each(function () {
		const crepe = {};

		var toppingCategoryAndToppingNameArray = getCSSToppingName($(this));
		var toppingCategory = toppingCategoryAndToppingNameArray[0];
		var toppingName = toppingCategoryAndToppingNameArray[1];
		if ($(this).css(`--${toppingCategory}`) == toppingName) {
			crepe['name'] = `${toppingName}`;
			if ($(this).css('--price')) {
				crepe['price'] = parseFloat($(this).css('--price'));
			} else {
				crepe['price'] = 0;
			}
			crepe['quantity'] = $(this).css('--quantity');
			crepe['flavorProfile'] = $(this).css('--flavorProfile');
			crepe['cost'] = crepe['quantity'] * crepe['price'];
			crepe['customCrepe'] = false;
			orderTotal += crepe['cost'];
			menuCrepes['crepes'].push(crepe);
		}
	});
	menuCrepes['crepeTotal'] = orderTotal;
	console.log('menuCrepeswithIngredient', menuCrepes);
	// stringify(menuCrepes);
	$.when(stringify(menuCrepes)).then(location.assign('/order?userOrder=True'));
}

// all this code changes display for smaller screen sizes
//https://stackoverflow.com/questions/15876302/uncaught-typeerror-cannot-read-property-clientwidth-of-null
var cWidth = $(window).width();
//https://stackoverflow.com/questions/1974788/combine-onload-and-onresize-jquery
$(window).on('load resize', function () {
	newWidth = $(window).width();

	if (cWidth < newWidth) {
		cWidth = newWidth;
	}

	if ($(window).width() < 767) {
		const a = document.getElementsByClassName('container');
		const b = document.getElementsByClassName('card-deck');
		const c = document.getElementsByClassName('card-title');
		const d = document.getElementsByClassName('card-text');
		const e = document.getElementsByClassName('card-img-top');
		const f = document.getElementsByClassName('card');
		const g = document.getElementsByClassName('h3');

		$('#crepeImg').css('margin-left', '0px');
		$('#cardText').css('margin-left', '0px');
		$('#cardText').css('margin-right', '0px');
		$('#cardText').css('margin-bottom', '20px');
		$('#cardBody').css('margin-left', '0px');

		var cardTitleValues = [];
		for (var i = 2; i < c.length; i++) {
			cardTitleValues.push(c[i].innerHTML);
		}

		const constCardTitleValues = [...cardTitleValues];
		var cardTextValues = [];
		for (var i = 1; i < d.length; i++) {
			cardTextValues.push(d[i].innerHTML);
		}

		const constCardTextValues = [...cardTextValues];
		var cardImgSrcValues = [];
		for (var i = 0; i < e.length; i++) {
			cardImgSrcValues.push(e[i].src);
		}

		const constCardImgSrcValues = [...cardImgSrcValues];
		const constBLength = b.length;
		var cardDeckTitleValues = [];
		for (var i = 0; i < g.length; i++) {
			cardDeckTitleValues.push(g[i].innerHTML);
		}

		var cardDeckChildrenLength = [];
		var constCardDeckNodes = [];
		for (i = 0; i < constBLength; i++) {
			clone = b[i].cloneNode(true);
			constCardDeckNodes.push(clone);
			var cardDeckCards = b[i].children;
			var counter = 0;
			for (j = 0; j < cardDeckCards.length; j++) {
				if (cardDeckCards[j].className == 'card') {
					counter += 1;
				}
			}
			cardDeckChildrenLength.push(counter);
		}

		for (i = 0; i < constBLength; i++) {
			removeAllChildNodes(b[i]);
		}

		for (i = 0; i < constBLength; i++) {
			var row = document.createElement('div');
			row.setAttribute('class', 'row');
			row.setAttribute('style', 'width: 100%');
			var listGroupTitle = document.createElement('div');
			//https://www.htmldog.com/guides/javascript/advanced/creatingelements/
			listGroupTitle.setAttribute('class', 'col-12 col-sm-12 col-lg-12 col-md-12');

			//https://stackoverflow.com/questions/3304014/how-to-interpolate-variables-in-strings-in-javascript-without-concatenation
			$(`#${constCardDeckNodes[i].id}`).removeClass('card-deck');
			$(`#${constCardDeckNodes[i].id}`).addClass('list-group');

			//need to move the iterator for each card deck to not get the prior deck's card titles
			var k;
			if (i == 0) {
				k = 0;
			} else {
				var priorChildLength = 0;
				for (m = 0; m < i; m++) {
					priorChildLength += cardDeckChildrenLength[m];
				}

				k = priorChildLength;
			}

			var stoppingPoint = k + cardDeckChildrenLength[i];
			for (k; k < stoppingPoint; k++) {
				var listValue = document.createElement('li');
				listValue.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
				listValue.setAttribute('style', 'width:100%');

				if (constCardTextValues[k]) {
					string1 = String(constCardTitleValues[k]);
					string2 = String(constCardTextValues[k]);
					var listValueText = string1 + '<br>' + string2;
					listValue.innerHTML = listValueText;
				} else {
					var listValueText = String(constCardTitleValues[k]);
					listValue.innerHTML = listValueText;
				}

				var imageParent = document.createElement('div');
				imageParent.setAttribute('class', 'image-parent');
				var img = document.createElement('img');
				img.setAttribute('src', constCardImgSrcValues[k]);
				img.setAttribute('class', 'img-fluid');
				imageParent.appendChild(img);

				listValue.appendChild(imageParent);
				listGroupTitle.append(listValue);
			}

			row.appendChild(listGroupTitle);
			x = document.getElementsByClassName('list-group');
			x[i].appendChild(row);
		}
	} else {
		$('#crepeImg').css('margin-left', '80px');
		$('#cardText').css('margin-left', '180px');
		$('#cardText').css('margin-right', '50px');
		$('#cardBody').css('margin-left', '170px');
	}
});
// TODO: add sauteed onions & peppers, pesto, dill
var cWidth = $(window).width();
$(window).on('resize', function () {
	newWidth = $(window).width();
	if (cWidth < newWidth) {
		cWidth = newWidth;
	}
	if ($(window).width() > 767) {
		location.reload();
	}
});
