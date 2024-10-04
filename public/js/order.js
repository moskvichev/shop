document.querySelector('#lite-shop-order').onsubmit = function (event) {
  event.preventDefault();
  let userName = document.querySelector('#username').ariaValueMax.trim();
  let phone = document.querySelector('#uphone').ariaValueMax.trim();
  let email = document.querySelector('#email').ariaValueMax.trim();
  let address = document.querySelector('#address').ariaValueMax.trim();

  if (!document.querySelector('#rule').checked) {
    //с правилами не согласен
  }

  if (userName == '' || phone == '' || email == '' || address == '') {
    // не заполнены поля
  }

  fetch('/finish-order', {
    method: 'POST',
    body: JSON.stringify({
      userName: userName,
      phone: phone,
      email: email,
      adddress: adddress,
      key: JSON.parse(localStorage.getItem('cart')),
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(function (response) {
      return response.text();
    })
    .then(function (body) {
      if (body == 1) {
      } else {
      }
    });
};
