// ====== LỚP LƯU TRỮ SẢN PHẨM (localStorage) ======
function getProducts() {
  return JSON.parse(localStorage.getItem("products") || "[]");
}
function setProducts(arr) {
  localStorage.setItem("products", JSON.stringify(arr));
}

// Dữ liệu mẫu lần đầu
function ensureSeed() {
  const current = getProducts();
  if (current.length === 0) {
    setProducts([
      { name: "Phở Bò", price: 45000, category: "Món chính", img: "../assets/img/pho-bo.jpg", desc: "Nước dùng đậm đà" },
      { name: "Cơm Gà", price: 40000, category: "Món chính", img: "../assets/img/com-ga.jpg", desc: "Gà xé thơm ngon" },
      { name: "Bánh Mì Thịt", price: 25000, category: "Ăn nhẹ", img: "../assets/img/banh-mi.jpg", desc: "Giòn rụm, nhiều nhân" },
      { name: "Trà Sữa Trân Châu", price: 35000, category: "Nước", img: "../assets/img/tra-sua.jpg", desc: "Trân châu dai ngon" }
    ]);
  }
}

// ====== UI MANAGE-PRODUCTS ======
function renderTable() {
  const tb = document.getElementById("tbody-products");
  if (!tb) return;
  const q = (document.getElementById("search")?.value || "").toLowerCase().trim();
  const list = getProducts().filter(p =>
    p.name.toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q)
  );

  tb.innerHTML = "";
  if (list.length === 0) {
    tb.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Không có dữ liệu</td></tr>`;
    return;
  }

  list.forEach((p, idx) => {
    tb.innerHTML += `
      <tr>
        <td><img src="${p.img || ''}" onerror="this.src='../assets/img/banh-mi.jpg'" width="70"></td>
        <td>
          <div class="fw-semibold">${p.name}</div>
          <div class="text-muted small">${p.desc || ""}</div>
        </td>
        <td>${p.category || "-"}</td>
        <td>${Number(p.price || 0).toLocaleString()}</td>
        <td>
          <button class="btn btn-sm btn-outline-secondary me-2" onclick="openEdit(${idx})">Sửa</button>
          <button class="btn btn-sm btn-outline-danger" onclick="removeProduct(${idx})">Xóa</button>
        </td>
      </tr>
    `;
  });
}

function openCreate() {
  document.getElementById("modalTitle").textContent = "Thêm món";
  document.getElementById("prodIndex").value = "";
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("category").value = "";
  document.getElementById("img").value = "";
  document.getElementById("desc").value = "";
}

function openEdit(index) {
  const list = getProducts();
  const p = list[index];
  document.getElementById("modalTitle").textContent = "Sửa món";
  document.getElementById("prodIndex").value = index;
  document.getElementById("name").value = p.name || "";
  document.getElementById("price").value = p.price || 0;
  document.getElementById("category").value = p.category || "";
  document.getElementById("img").value = p.img || "";
  document.getElementById("desc").value = p.desc || "";
  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}

function saveProduct(e) {
  e.preventDefault();
  const index = document.getElementById("prodIndex").value;
  const name = document.getElementById("name").value.trim();
  const price = parseInt(document.getElementById("price").value || "0");
  const category = document.getElementById("category").value.trim();
  const img = document.getElementById("img").value.trim();
  const desc = document.getElementById("desc").value.trim();

  if (!name || price < 0) {
    alert("Vui lòng nhập tên món và giá hợp lệ!");
    return;
  }

  const list = getProducts();
  const data = { name, price, category, img, desc };

  if (index === "") {
    list.push(data);
  } else {
    list[parseInt(index)] = data;
  }
  setProducts(list);

  bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
  renderTable();
}

// Xóa
function removeProduct(index) {
  if (!confirm("Xóa món này?")) return;
  const list = getProducts();
  list.splice(index, 1);
  setProducts(list);
  renderTable();
}

// ====== (TÙY CHỌN) RENDER MENU THEO PRODUCTS TRÊN TRANG KHÁCH ======
// Nếu muốn index.html tự động hiển thị theo products trong localStorage,
// đặt <div id="menu-list" class="row g-4"></div> và gọi renderMenu() khi load.
function renderMenu() {
  const root = document.getElementById("menu-list");
  if (!root) return;
  const list = getProducts();
  root.innerHTML = "";
  list.forEach(p => {
    root.innerHTML += `
      <div class="col-md-3">
        <div class="card shadow-sm">
          <img src="${p.img || 'assets/img/banh-mi.jpg'}" class="card-img-top" alt="${p.name}">
          <div class="card-body text-center">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text text-muted">${Number(p.price).toLocaleString()}₫</p>
            <button class="btn btn-success btn-sm add-to-cart"
              data-name="${p.name}"
              data-price="${p.price}"
              data-img="${p.img || 'assets/img/banh-mi.jpg'}">🛒 Thêm vào giỏ</button>
          </div>
        </div>
      </div>
    `;
  });
}
