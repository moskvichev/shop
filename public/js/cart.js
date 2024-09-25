let cart = {};

document.querySelectorAll('.add-to-cart').forEach(function (element) {
  element.onclick = addToCart;
});

function addToCart() {
  let goodsId = this.dataset.goods_id;
  if (cart[goodsId]) {
    cart[goodsId]++;
  } else {
    cart[goodsId] = 1;
  }
  console.log(cart);
  ajaxGetGoodsInfo();
}

function ajaxGetGoodsInfo() {
  fetch('/get-goods-info', {
    method: 'POST',
    body: JSON.stringify({ key: Object.keys(cart) }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(function (response) {
      return response.text();
    })
    .then(function (body) {
      console.log(body);
      showCart(JSON.parse(body));
    });
}

function showCart(data) {
  let out = '<table class="table table-striped table-cart"><tbody>';
  let total = 0;
  for (let key in cart) {
    out += `<tr><td><a href="/goods?id=${key}">${data[key]['name']}</a></tr>`;
    out += `<tr><td><i class="far fa-minus-square cart-minus" data-goods_id="${key}"></i><td>`;
    out += `<td>${cart[key]}<td>`;
    out += `<td><i class="far fa-plus-square cart-plus" data-goods_id="${key}"></i><td>`;
    out += `</tr>`;
  }
  out += '</tbody></table>';
  document.querySelector('#cart-nav').innerHTML = out;
}
