// Example starter JavaScript for disabling form submissions if there are invalid fields
//https://www.codeply.com/p?starter=Bootstrap&ex=Sh3KmpOVTc
(function () {
	//https://www.tutorialspoint.com/Why-are-parenthesis-used-to-wrap-a-JavaScript-function-call#:~:text=In%20JavaScript%2C%20the%20functions%20wrapped,decrease%20clashing%20with%20other%20libraries.
	('use strict');

	window.addEventListener(
		'load',
		function () {
			// Fetch all the forms we want to apply custom Bootstrap validation styles to
			var forms = document.getElementsByClassName('needs-validation');

			// Loop over them and prevent submission
			Array.prototype.filter.call(forms, function (form) {
				//https://gomakethings.com/what-the-hell-is-the-call-method-and-when-should-you-use-it/
				form.addEventListener(
					'submit',
					function (event) {
						if (form.checkValidity() === false) {
							event.preventDefault();
							event.stopPropagation();
						}
						form.classList.add('was-validated');
					},
					false
				);
			});
		},
		false
	);
})();
