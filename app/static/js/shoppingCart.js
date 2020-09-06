//https://stackoverflow.com/questions/39627549/how-to-center-modal-to-the-center-of-screen/39636961
$(window).on('load', function () {
	const modal = $('#shoppingCart');
	// console.log('fdjaopisdfjaosij');
	// console.log(localStorage.length, 'localStorage.length');
	// for (var i = 0; i < localStorage.length; i++) {
	// 	const order = {};
	// 	const key = localStorage.key(0);
	// 	console.log('key', key);
	// 	order[key] = JSON.parse(localStorage.getItem(key));
	// 	console.log('order', order);
	// }

	const body = $(window);
	// Get modal size
	const w = modal.width();
	const h = modal.height();
	// Get window size
	const bw = body.width();
	const bh = body.height();

	// Update the css and center the modal on screen
	modal.css({
		position: 'absolute',
		top: (bh - h) / 2 + 'px',
		left: (bw - w) / 2 + 'px',
	});
	doShowAll();
	$('#shoppingCart').modal('show');
});

//https://www.smashingmagazine.com/2019/08/shopping-cart-html5-web-storage/
function checkBrowser() {
	if ('localStorage' in window && window['localStorage'] !== null) {
		console.log('true');
		// We can use localStorage object to store data.
		return true;
	} else {
		return false;
	}
}

// Dynamically populate the table with shopping list items.
//Step below can be done via PHP and AJAX, too.
function splitCamelCaseToString(str) {
	return (
		str
			// insert a space between lower & upper
			.replace(/([a-z])([A-Z])/g, '$1 $2')
			// space before last upper in a sequence followed by lower
			.replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
			// uppercase the first character
			.replace(/^./, function (str) {
				return str.toUpperCase();
			})
	);
}

function capitalize(str) {
	return str.replace(/^./, function (str) {
		return str.toUpperCase();
	});
}

//https://stackoverflow.com/questions/2827764/ecommerceshopping-cartwhere-should-i-store-shopping-cart-data-in-session-or#:~:text=The%20client%20never%20stores%20individual,cart%20is%20lost%20for%20good.
function doShowAll() {
	if (checkBrowser()) {
		var orderPrice = 0;
		key = localStorage.key(0);
		const orderDict = JSON.parse(localStorage.getItem(key));
		console.log('check orderDict', orderDict);
		if ('orderCreep' in orderDict) {
			const crepes = orderDict['orderCrepe'];

			for (k = 0; k <= crepes.length - 1; k++) {
				// had to do this to get this first crepe to show up as number 1 on the meal summary
				// const stringifiedDataObject = localStorage.getItem(key);
				// console.log('StringifiedDataObject', stringifiedDataObject);

				//https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
				var formattedOtherToppings = [];
				const customCrepeIngredients = crepes[k]['ingredients'];
				console.log('customCrepeIngredients', customCrepeIngredients);
				for (var key in customCrepeIngredients) {
					if (key != 'crepeTotal' && key != 'flavorProfile') {
						console.log('key', key);
						const topping = customCrepeIngredients[key];
						console.log('topping', topping);
						if (topping != '') {
							console.log('topping', topping);
							const formatDict = {};
							if (key != 'protein') {
								var format = '';
								for (var i = 0; i < topping.length; i++) {
									var toppingName = Object.keys(topping[i])[0];
									var toppingQuantity = topping[i][toppingName];
									if (toppingName != 'price') {
										toppingQuantity = capitalize(toppingQuantity);
										toppingName = splitCamelCaseToString(toppingName);
										format += toppingQuantity;
										format += ' ';
										format += toppingName;
										if (i != topping.length - 2) {
											format += ' and ';
										}
									} else {
										formatDict['price'] = toppingQuantity;
									}
								}

								formatDict['format'] = format;
								formattedOtherToppings.push(formatDict);
							} else {
								const protein = customCrepeIngredients[key];
								console.log('protein', protein);
								//if (protein.length > 1) {
								var formattedProtein = '';
								for (var i = 0; i < protein.length; i++) {
									var proteinName = Object.keys(protein[i])[0];
									var proteinQuantity = protein[i][proteinName];
									if (proteinName != 'price') {
										console.log('pq', proteinQuantity);
										console.log('pn', proteinName);
										proteinName = splitCamelCaseToString(proteinName);
										proteinQuantity = capitalize(proteinQuantity);
										formattedProtein += proteinQuantity;
										formattedProtein += ' ';
										formattedProtein += proteinName;
										if (i != protein.length - 2) {
											formattedProtein += ' and ';
										}
									} else {
										formatDict['price'] = proteinQuantity;
									}
								}

								formatDict['format'] = formattedProtein;
								formattedOtherToppings.unshift(formatDict);
							}
						}
					}
				}
				var subtotal = 0;

				// insert the row and child header with the crepe number
				console.log('formattedOtherToppings', formattedOtherToppings);
				$('#modalBody1').append(`<div class="container" id="container${k}"></div>`);

				$(`#container${k}`).append(
					`<div class="row" style= "border-bottom: 1px solid black; margin-bottom:20px;" id="row${k}0"><h5 style='font-weight: 700; '>Crepe #${
						k + 1
					}</h5></div>`
				);

				for (var i = 0; i < formattedOtherToppings.length; i++) {
					const toppingPrice = formattedOtherToppings[i]['price'];
					orderPrice += toppingPrice;
					subtotal += toppingPrice;

					$(`<div class="row" style= "margin-bottom: 20px;" id="row${k}${
						i + 1
					}"><div class="col-9" style="margin-right: 0px; " id="col${k}${i}"><h5 style=''>
				${formattedOtherToppings[i]['format']}</h5>
					</div><div class="col-3" style=""id="col${k}${i + 2}"><h4 style=''>$${formattedOtherToppings[i]['price'].toFixed(
						2
					)}</h4></div></div>`).insertAfter(`#row${k}${i}`);
				} // end of the loop iterating through the toppings in the crepe

				// the i iterator ends with an id of k, i+1 so this must be formattedOtherToppings.length not formattedothertoppings.length -1
				// insert the subtotal after completing the insertion of the toppings
				$(
					`<div class="row" id=row${k}${
						formattedOtherToppings.length + 1
					} style="margin-top: 20px; margin-bottom: 20px; border-bottom: 1px solid black" id=""><div class="col-9" id="0col23" style="margin-left: 0px;"><h5 style="font-weight: 700" ;="">Subtotal</h5></div><div class="col-3" id="0col22" style="margin-left: 0px;"><h4 style="font-weight: 700">$${subtotal.toFixed(
						2
					)}</h4></div></div>`
				).insertAfter($(`#row${k}${formattedOtherToppings.length}`));

				// insert the modify, edit, delete buttons
				$(`<div class="grid-container" id="buttoncontainer${k}" style="margin-top: 30px; margin-bottom:40px; align-content:space-evenly; grid-template-columns: auto auto auto;
            grid-gap: 5px; display:grid;"></div>`).insertAfter($(`#container${k}`));
				$(`#buttoncontainer${k}`).append(
					`<div id="col5"><h6 style=" margin-left:75px;text-decoration:underline"><a href="copyItem()">duplicate</a></h6></div>`
				);
				$(`#buttoncontainer${k}`).append(
					`<div  id="col6" ><h6 style=" margin-left: 0px; text-decoration:underline;"><a href="{{url_for('make_your_own_crepe', edit=true)}}">edit</a></h6></div>`
				);
				$(`#buttoncontainer${k}`).append(
					`<div  id="col7"><h6 style=" text-decoration:underline; margin-right: 35px"><a href="removeItem()">remove</a></h6></div>`
				);
			} // end of the loop iterating through crepes in the order
		} // end of for loop confirming orderCrepe existence

		if ('orderDrink' in orderDict) {
			const drinks = orderDict['orderDrink'];
			for (var i = 0; i < drinks.length; i++) {
				$(`<div class="row" style= "margin-bottom: 20px;" id="${i}row"><div class="col-9" style="margin-right: 0px; " id="${i}col"><h5 style=''>
				${Object.keys(drinks[i])[0]}</h5>
					</div><div class="col-3" style=""id="${i}col"><h4 style=''>${
					drinks[i][Object.keys(drinks[i])[0]]
				}</h4></div></div>`).insertAfter(`#${i}row`);
			}
		}
		$(`<div class="modal-footer" id="footer"></div>`).insertAfter(`#modalBody1`);

		$(`#footer`).append(`<div class="col-8" id="footerCol0"><h3 style="font-weight: bold;">Order Total</h3>
		</div>`);
		$(`#footer`)
			.append(`<div class="col-3" style="margin-left: 21px; " id="footerCol1"><h3 style="float:right; font-weight: bold; ">$${orderPrice.toFixed(
			2
		)}</h3>
		</div>`);
	}
}
