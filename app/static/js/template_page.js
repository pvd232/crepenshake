var cWidth = $(window).width();

//https://stackoverflow.com/questions/1974788/combine-onload-and-onresize-jquery
$(window).on('load resize', function () {
	$('body').css({ visibility: 'visible' });

	const newWidth = $(window).width();

	if (cWidth < newWidth) {
		cWidth = newWidth;
	}

	if ($(window).width() < 767) { 
		$('#crepeButtonImage').remove();
	}
});
