var cWidth = $(window).width();

//https://stackoverflow.com/questions/1974788/combine-onload-and-onresize-jquery
$(window).on('load resize', function () {
	$('body').css({ visibility: 'visible' });

	const newWidth = $(window).width();

	if (cWidth < newWidth) {
		cWidth = newWidth;
	}

	if (cWidth <= 576) { 
		$('#crepeButtonImage').remove();
		$('#crepeButton').css("background-color", "rgba(251, 35, 49)")
		$('#crepeButton').css('margin-top', '20px');
		
	}
});
