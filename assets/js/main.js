document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".add-to-cart");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const product = {
        name: btn.dataset.name,
        price: parseInt(btn.dataset.price),
        img: btn.dataset.img,
        quantity: 1
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const index = cart.findIndex(p => p.name === product.name);
      if (index !== -1) {
        cart[index].quantity += 1;
      } else {
        cart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert("✅ Đã thêm " + product.name + " vào giỏ hàng!");
    });
  });

  // Nếu là trang cart.html
  const tbody = document.getElementById("cart-items");
  if (tbody) {
    renderCart();
  }
});

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const tbody = document.getElementById("cart-items");
  let total = 0;
  tbody.innerHTML = "";

  if (cart.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Giỏ hàng trống</td></tr>`;
  } else {
    cart.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      tbody.innerHTML += `
        <tr>
          <td><img src="${item.img}" width="70"></td>
          <td>${item.name}</td>
          <td>${item.price.toLocaleString()}₫</td>
          <td><input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)" class="form-control text-center" style="width:80px"></td>
          <td>${subtotal.toLocaleString()}₫</td>
          <td><button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})">Xóa</button></td>
        </tr>`;
    });
  }

  document.getElementById("cart-total").textContent = total.toLocaleString() + "₫";
}

function updateQuantity(index, quantity) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart[index].quantity = parseInt(quantity);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}
