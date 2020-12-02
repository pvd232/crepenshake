import { humanize, removeAllChildNodes } from './model.js';
var cWidth = $(window).width();
$(window).on('load', function () {
	$('.card-title, .head3').each(function () {
		$(this).html(humanize(null, null, $(this).html()));
	});
	$('.card-text').each(function () {
		const price = parseFloat($(this).html());
		if (!Number.isNaN(price)) {
			$(this).html('$' + price.toFixed(2));
		}
	});
	$('.head3').each(function () {
		$(this).html($(this).html().toLowerCase());
	});
	const description = 'Steak, grilled onions, mushrooms, garlic, blue cheese, diane sauce';
	// const description1 = 'Steak, grilled onions, mushrooms, garlic, blue cheese, diane sauce';
	// const description1 = 'Steak, grilled onions, mushrooms, garlic, blue cheese, diane sauce';
	// const description1 = 'Steak, grilled onions, mushrooms, garlic, blue cheese, diane sauce';
	// const description1 = 'Steak, grilled onions, mushrooms, garlic, blue cheese, diane sauce';
	// const description1 = 'Steak, grilled onions, mushrooms, garlic, blue cheese, diane sauce';
	// const description1 = 'Steak, grilled onions, mushrooms, garlic, blue cheese, diane sauce';
	// const description1 = 'Steak, grilled onions, mushrooms, garlic, blue cheese, diane sauce';

	$('#savory_menu_crepes').find('.card-body').first().append(`<p class="description" >${description}</p>`);
	const newWidth = $(window).width();

	if (cWidth < newWidth) {
		cWidth = newWidth;
	}

	if (cWidth <= 576) {
		const cardDeckElements = document.getElementsByClassName('card-deck');
		const cardTitleElements = document.getElementsByClassName('card-title');
		const cardTextElements = document.getElementsByClassName('card-text');
		// const descriptionElements = document.getElementsByClassName('description');

		const cardImgTopElements = document.getElementsByClassName('card-img-top');

		$('#crepeImg').css('margin-left', '0px');
		$('#cardText').css('margin-left', '0px');
		$('#cardText').css('margin-right', '0px');
		$('#cardText').css('margin-bottom', '20px');
		$('#cardBody').css('margin-left', '0px');

		const cardTitleValues = new Array();
		for (var i = 0; i < cardTitleElements.length; i++) {
			cardTitleValues.push(cardTitleElements[i].innerHTML);
		}

		const constCardTitleValues = [...cardTitleValues];
		const cardTextValues = new Array();
		for (var i = 0; i < cardTextElements.length; i++) {
			cardTextValues.push(cardTextElements[i].innerHTML);
		}

		const constCardTextValues = [...cardTextValues];
		var cardImgSrcValues = new Array();
		for (var i = 0; i < cardImgTopElements.length; i++) {
			cardImgSrcValues.push(cardImgTopElements[i].src);
		}

		const constCardImgSrcValues = [...cardImgSrcValues];
		const cardDeckElementsLength = cardDeckElements.length;

		const cardDeckChildrenLength = new Array();
		const constCardDeckNodes = new Array();
		for (var i = 0; i < cardDeckElementsLength; i++) {
			const clone = cardDeckElements[i].cloneNode(true);
			constCardDeckNodes.push(clone);
			const cardDeckCards = cardDeckElements[i].children;
			var counter = 0;
			for (var j = 0; j < cardDeckCards.length; j++) {
				if (cardDeckCards[j].className == 'card') {
					counter += 1;
				}
			}
			cardDeckChildrenLength.push(counter);
		}
		// const constDescriptionElements = new Array()
		// for (var i = 0; i < descriptionElements.length; i++) {
		// 	const clone = descriptionElements[i].cloneNode(true);
		// 	constDescriptionElements.push(clone)
		// }
		for (var i = 0; i < cardDeckElementsLength; i++) {
			removeAllChildNodes(cardDeckElements[i]);
		}
		// set this to one because the first card on the page is a decorative card without a value
		var counter = 0;
		for (var i = 0; i < cardDeckElementsLength; i++) {
			const row = document.createElement('div');
			row.setAttribute('class', 'row');
			row.setAttribute('style', 'width: 100%');
			const listGroupTitle = document.createElement('div');
			listGroupTitle.setAttribute('class', 'col-12 col-sm-12 col-lg-12 col-md-12');

			$(`#${constCardDeckNodes[i].id}`).removeClass('card-deck');
			$(`#${constCardDeckNodes[i].id}`).addClass('list-group');
			//need to move the iterator for each card deck to not get the prior deck's card titles
			var k;
			if (i == 0) {
				k = 0;
			} else {
				var priorChildLength = 0;
				for (var m = 0; m < i; m++) {
					priorChildLength += cardDeckChildrenLength[m];
				}

				k = priorChildLength;
			}

			const stoppingPoint = k + cardDeckChildrenLength[i];
			for (k; k < stoppingPoint; k++) {
				const listValue = document.createElement('li');
				listValue.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
				listValue.setAttribute('style', 'width:100%');

				const string1 = String(constCardTitleValues[k]);
				const string2 = String(constCardTextValues[k]);

				const container = document.createElement('container');
				container.setAttribute('style', 'max-width:25%');
				container.setAttribute('class', 'container5');

				const listValueHeader = document.createElement('h2');
				listValueHeader.setAttribute('style', 'font-size: 110%');

				const listValueBodyText = document.createElement('p');
				listValueBodyText.setAttribute('style', 'font-size: 110%');

				if (constCardTextValues[k]) {
					listValueBodyText.innerHTML = string2;
					listValueHeader.innerHTML = string1 + '<br>';
					container.appendChild(listValueHeader);
					container.appendChild(listValueBodyText);
					listValue.appendChild(container);
				} else {
					listValueHeader.innerHTML = string1;
					container.appendChild(listValueHeader);
					listValue.appendChild(container);
				}
				const container3 = document.createElement('div');
				container3.setAttribute('class', 'container3');
				listValue.appendChild(container3);

				const imageParent = document.createElement('div');
				imageParent.setAttribute('class', 'image-parent');
				const img = document.createElement('img');

				const cardImgAbsolutePath = constCardImgSrcValues[counter].split('/');
				const cardImgRelativePathFrags = cardImgAbsolutePath.slice(
					cardImgAbsolutePath.length - 3,
					cardImgAbsolutePath.length
				);
				const cardImgRelativePath = '../' + cardImgRelativePathFrags.join('/');
				img.setAttribute('src', cardImgRelativePath);

				img.setAttribute('class', 'img-fluid');
				imageParent.appendChild(img);

				listValue.appendChild(imageParent);
				listGroupTitle.append(listValue);

				counter += 1;
			}

			row.appendChild(listGroupTitle);
			const x = document.getElementsByClassName('list-group');
			x[i].appendChild(row);
		}
		$('.container0sweetCrepe').each(function () {
			$(this).css('border-bottom', '');
			$(this).find('.list-group').css('border-bottom', '');
		});
	} else {
		$('.container0sweetCrepe').each(function () {
			$(this).addClass('container');
			$(this).removeClass('container0sweetCrepe');
		});
	}
});
