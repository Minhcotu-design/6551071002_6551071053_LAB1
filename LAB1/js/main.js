// small demo JS: cart (in-memory), subscribe/contact demo
document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartSumEl = document.querySelector('.cart-sum');
    document.querySelectorAll('.add-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name || btn.closest('.product')?.querySelector('.card-title')?.innerText || 'Product';
            const price = parseInt(btn.dataset.price || 0);
            cart.push({ name, price });
            updateCartSum();
            alert(name + ' đã được thêm vào giỏ hàng.');
        });
    });

    function updateCartSum() {
        const total = cart.reduce((s, i) => s + i.price, 0);
        if (cartSumEl) cartSumEl.innerText = total ? '₫' + total.toLocaleString('vi-VN') : '₫0';
    }

    // subscribe demo
    const subForm = document.getElementById('subscribeForm');
    if (subForm) {
        subForm.addEventListener('submit', e => {
            e.preventDefault();
            alert('Cảm ơn bạn đã đăng ký!');
            subForm.reset();
        });
    }

    // contact demo
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            alert('Tin nhắn đã gửi.');
            contactForm.reset();
        });
    }

    // simple add-to-cart from product details
    document.querySelectorAll('[data-name][data-price]').forEach(btn => {
        // already handled above
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Lấy tất cả checkbox lọc
    const checkboxes = document.querySelectorAll('.category-filter');
    // Lấy tất cả sản phẩm
    const products = document.querySelectorAll('.product-card');
    // Nút xóa bộ lọc
    const clearBtn = document.getElementById('clear-filters');

    // Hàm lọc chính
    function filterProducts() {
        const selectedCategories = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        products.forEach(product => {
            const productCategories = product.getAttribute('data-category')?.split(' ').filter(Boolean) || [];

            // Nếu không chọn gì → hiện tất cả
            if (selectedCategories.length === 0) {
                product.classList.remove('hidden');
                return;
            }

            // Kiểm tra có ít nhất 1 danh mục trùng
            const hasMatch = selectedCategories.some(cat => productCategories.includes(cat));
            product.classList.toggle('hidden', !hasMatch);
        });
    }

    // Gắn sự kiện thay đổi checkbox
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });

    // Nút xóa toàn bộ bộ lọc
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            filterProducts();
        });
    }

    // Khởi chạy lần đầu
    filterProducts();
});

document.addEventListener('DOMContentLoaded', function () {
    // === 1. LẤY DỮ LIỆU GIỎ HÀNG ===
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartSumEl = document.querySelector('.cart-sum');
    const cartArea = document.getElementById('cartArea');
    const cartSummary = document.getElementById('cartSummary');
    const cartTotalEl = cartSummary?.querySelector('.cart-total');

    // === 2. CẬP NHẬT TỔNG TIỀN TRÊN NAVBAR ===
    function updateCartSum() {
        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        if (cartSumEl) {
            cartSumEl.textContent = `₫${total.toLocaleString()}`;
        }
    }

    // === 3. HIỂN THỊ GIỎ HÀNG TRÊN shopping-cart.html ===
    function renderCart() {
        if (!cartArea) return;

        if (cart.length === 0) {
            cartArea.innerHTML = `
        <div class="text-center py-5">
          <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
          <p class="text-muted">Giỏ hàng trống. Hãy thêm sản phẩm!</p>
          <a href="shop.html" class="btn btn-danger">Mua sắm ngay</a>
        </div>`;
            cartSummary?.classList.add('d-none');
            return;
        }

        let html = `
      <div class="table-responsive">
        <table class="table align-middle">
          <thead class="table-light">
            <tr>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Tổng</th>
              <th></th>
            </tr>
          </thead>
          <tbody>`;

        let total = 0;
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            html += `
        <tr data-index="${index}">
          <td>
            <div class="d-flex align-items-center gap-3">
              <div class="bg-light rounded p-1">
                <div class="placeholder-img" style="width:60px;height:60px;background:#eee;"></div>
              </div>
              <strong>${item.name}</strong>
            </div>
          </td>
          <td>₫${item.price.toLocaleString()}</td>
          <td>
            <div class="input-group input-group-sm" style="width: 100px;">
              <button class="btn btn-outline-secondary qty-btn minus">-</button>
              <input type="text" class="form-control text-center qty-input" value="${item.qty}" readonly>
              <button class="btn btn-outline-secondary qty-btn plus">+</button>
            </div>
          </td>
          <td class="item-total fw-bold">₫${itemTotal.toLocaleString()}</td>
          <td>
            <button class="btn btn-sm btn-danger remove-item">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>`;
        });

        html += `
          </tbody>
        </table>
      </div>`;

        cartArea.innerHTML = html;
        cartSummary?.classList.remove('d-none');
        if (cartTotalEl) cartTotalEl.textContent = `₫${total.toLocaleString()}`;
    }

    // === 4. SỰ KIỆN TRÊN GIỎ HÀNG ===
    document.addEventListener('click', function (e) {
        const target = e.target;

        // Xóa sản phẩm
        if (target.closest('.remove-item')) {
            const row = target.closest('tr');
            const index = row.dataset.index;
            cart.splice(index, 1);
            saveAndUpdate();
        }

        // Tăng số lượng
        if (target.closest('.plus')) {
            const row = target.closest('tr');
            const index = row.dataset.index;
            cart[index].qty += 1;
            saveAndUpdate();
        }

        // Giảm số lượng
        if (target.closest('.minus')) {
            const row = target.closest('tr');
            const index = row.dataset.index;
            if (cart[index].qty > 1) {
                cart[index].qty -= 1;
                saveAndUpdate();
            }
        }
    });

    // === 5. LƯU + CẬP NHẬT ===
    function saveAndUpdate() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartSum();
        renderCart();
    }

    // === 6. ADD TO CART (từ shop/index) ===
    const addButtons = document.querySelectorAll('.add-cart');
    addButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);
            const existing = cart.find(item => item.name === name);

            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ name, price, qty: 1 });
            }

            saveAndUpdate();
        });
    });

    // === 7. LỌC SẢN PHẨM (chỉ shop.html) ===
    const isShopPage = document.querySelector('#product-container') !== null;
    if (!isShopPage) return;

    const checkboxes = document.querySelectorAll('.category-filter');
    const products = document.querySelectorAll('#product-container .col-lg-3'); // lấy thẳng col để ẩn
    const clearBtn = document.getElementById('clear-filters');

    function filterProducts() {
        const selected = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        products.forEach(col => {
            const card = col.querySelector('.product-card');
            const cats = card.dataset.category?.split(' ').filter(Boolean) || [];

            if (selected.length === 0) {
                col.style.display = 'block';
            } else {
                const match = selected.some(cat => cats.includes(cat));
                col.style.display = match ? 'block' : 'none';
            }
        });
    }

    checkboxes.forEach(cb => cb.addEventListener('change', filterProducts));

    clearBtn?.addEventListener('click', () => {
        checkboxes.forEach(cb => cb.checked = false);
        filterProducts();
    });

    filterProducts(); // khởi tạo


    // === 8. KHỞI TẠO ===
    updateCartSum();
    renderCart();
});

/**
 * main.js - CHỈ HIỆN TÊN SẢN PHẨM TRONG GIỎ HÀNG
 */

document.addEventListener('DOMContentLoaded', function () {
    // === 1. LẤY DỮ LIỆU GIỎ HÀNG ===
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartSumEl = document.querySelector('.cart-sum');
    const cartArea = document.getElementById('cartArea');
    const cartSummary = document.getElementById('cartSummary');
    const cartTotalEl = cartSummary?.querySelector('.cart-total');

    // === 2. CẬP NHẬT TỔNG TIỀN ===
    function updateCartSum() {
        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        if (cartSumEl) {
            cartSumEl.textContent = `₫${total.toLocaleString()}`;
        }
    }

    // === 3. HIỂN THỊ GIỎ HÀNG - CHỈ TÊN + GIÁ + SỐ LƯỢNG ===
    function renderCart() {
        if (!cartArea) return;

        if (cart.length === 0) {
            cartArea.innerHTML = `
        <div class="text-center py-5">
          <p class="text-muted">Giỏ hàng trống. Hãy thêm sản phẩm!</p>
          <a href="shop.html" class="btn btn-danger">Mua sắm ngay</a>
        </div>`;
            cartSummary?.classList.add('d-none');
            return;
        }

        let html = `
      <div class="table-responsive">
        <table class="table align-middle">
          <thead class="table-light">
            <tr>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Tổng</th>
              <th></th>
            </tr>
          </thead>
          <tbody>`;

        let total = 0;
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            html += `
        <tr data-index="${index}">
          <td><strong>${item.name}</strong></td>
          <td>₫${item.price.toLocaleString()}</td>
          <td>
            <div class="input-group input-group-sm" style="width: 100px;">
              <button class="btn btn-outline-secondary qty-btn minus">-</button>
              <input type="text" class="form-control text-center" value="${item.qty}" readonly>
              <button class="btn btn-outline-secondary qty-btn plus">+</button>
            </div>
          </td>
          <td class="fw-bold">₫${itemTotal.toLocaleString()}</td>
          <td>
            <button class="btn btn-sm btn-danger remove-item">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>`;
        });

        html += `</tbody></table></div>`;

        cartArea.innerHTML = html;
        cartSummary?.classList.remove('d-none');
        if (cartTotalEl) cartTotalEl.textContent = `₫${total.toLocaleString()}`;
    }

    // === 4. SỰ KIỆN GIỎ HÀNG ===
    document.addEventListener('click', function (e) {
        const target = e.target;
        if (target.closest('.remove-item')) {
            const index = target.closest('tr').dataset.index;
            cart.splice(index, 1);
            saveAndUpdate();
        }
        if (target.closest('.plus')) {
            const index = target.closest('tr').dataset.index;
            cart[index].qty += 1;
            saveAndUpdate();
        }
        if (target.closest('.minus')) {
            const index = target.closest('tr').dataset.index;
            if (cart[index].qty > 1) {
                cart[index].qty -= 1;
                saveAndUpdate();
            }
        }
    });

    // === 5. LƯU + CẬP NHẬT ===
    function saveAndUpdate() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartSum();
        renderCart();
    }

    // === 6. ADD TO CART (KHÔNG CẦN ẢNH) ===
    const addButtons = document.querySelectorAll('.add-cart');
    addButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);

            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ name, price, qty: 1 });
            }

            saveAndUpdate();
        });
    });

    // === 7. LỌC SẢN PHẨM ===
    const isShopPage = document.querySelector('#product-container') !== null;
    if (isShopPage) {
        const checkboxes = document.querySelectorAll('.category-filter');
        const products = document.querySelectorAll('.product-card');
        const clearBtn = document.getElementById('clear-filters');

        function filterProducts() {
            const selected = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            products.forEach(product => {
                const cats = product.getAttribute('data-category')?.split(' ') || [];
                if (selected.length === 0 || selected.some(cat => cats.includes(cat))) {
                    product.classList.remove('hidden');
                } else {
                    product.classList.add('hidden');
                }
            });
        }

        checkboxes.forEach(cb => cb.addEventListener('change', filterProducts));
        clearBtn?.addEventListener('click', () => {
            checkboxes.forEach(cb => cb.checked = false);
            filterProducts();
        });
        filterProducts();
    }

    // === 8. KHỞI TẠO ===
    updateCartSum();
    renderCart();
});

// === 9. CHECKOUT PAGE: HIỂN THỊ DANH SÁCH SẢN PHẨM NGAY LẬP TỨC ===
const isCheckoutPage = document.getElementById('checkoutForm') !== null;
if (isCheckoutPage) {
    // ĐỌC LẠI CART TỪ localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const orderItemsEl = document.getElementById('orderItems');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    function renderCheckout() {
        if (cart.length === 0) {
            orderItemsEl.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-muted mb-0">Giỏ hàng trống!</p>
                    <a href="shop.html" class="btn btn-sm btn-outline-danger mt-2">Mua sắm ngay</a>
                </div>`;
            subtotalEl.textContent = '₫0';
            totalEl.textContent = '₫30,000';
            return;
        }

        let subtotal = 0;
        let html = '';

        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;
            html += `
                <div class="d-flex justify-content-between align-items-start mb-3 pb-3 border-bottom">
                    <div class="flex-grow-1">
                        <div class="fw-bold text-dark fs-6">${item.name}</div>
                        <small class="text-muted">
                            ${item.qty} × ₫${item.price.toLocaleString()}
                        </small>
                    </div>
                    <div class="fw-bold text-danger text-end">
                        ₫${itemTotal.toLocaleString()}
                    </div>
                </div>`;
        });

        const shipping = 30000;
        const total = subtotal + shipping;

        orderItemsEl.innerHTML = html;
        subtotalEl.textContent = `₫${subtotal.toLocaleString()}`;
        totalEl.textContent = `₫${total.toLocaleString()}`;
    }

    // Xử lý đặt hàng - SỬA LỖI subtotal
    document.getElementById('checkoutForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const address = document.getElementById('address').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone')?.value.trim() || 'Không có';

        if (!fullName || !address || !email) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        // TÍNH LẠI SUBTOTAL TRƯỚC KHI DÙNG (SỬA LỖI)
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        const shipping = 30000;
        const total = subtotal + shipping;

        // Tạo đơn hàng
        const order = {
            customer: { fullName, address, email, phone },
            items: cart,
            subtotal,
            shipping,
            total,
            date: new Date().toLocaleString('vi-VN')
        };

        localStorage.setItem('lastOrder', JSON.stringify(order));

        // THÔNG BÁO THÀNH CÔNG - HOẠT ĐỘNG 100%
        alert(`Cảm ơn ${fullName}!\n\nĐơn hàng đã được đặt thành công!\nTổng tiền: ₫${total.toLocaleString()}`);

        // Xóa giỏ hàng
        cart = [];
        localStorage.setItem('cart', '[]');
        if (typeof updateCartSum === 'function') updateCartSum();

        // Chuyển về trang chủ
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });

    // HIỂN THỊ NGAY
    renderCheckout();
}

// Danh sách sản phẩm/danh mục gợi ý
const products = [
    "Whey Protein",
    "BCAA",
    "Creatine",
    "Omega-3",
    "Vitamin",
    "Pre-Workout"
];

const searchInput = document.getElementById('search-input');
const suggestions = document.getElementById('suggestions');
const searchForm = document.getElementById('search-form');

if (searchInput && suggestions) {
    // Hiển thị gợi ý dropdown
    searchInput.addEventListener('input', function () {
        const value = this.value.toLowerCase();
        suggestions.innerHTML = '';

        if (value) {
            const filtered = products.filter(product => product.toLowerCase().includes(value));
            filtered.forEach(product => {
                const li = document.createElement('li');
                li.textContent = product;
                li.addEventListener('click', () => {
                    searchInput.value = product;
                    suggestions.innerHTML = '';
                    suggestions.style.display = 'none';
                });
                suggestions.appendChild(li);
            });

            suggestions.style.display = filtered.length ? 'block' : 'none';
        } else {
            suggestions.style.display = 'none';
        }
    });

    // Ẩn dropdown khi click ra ngoài
    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.style.display = 'none';
        }
    });

    // Khi submit form search
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            // Chuyển tới shop.html với query làm tham số URL
            const url = `shop.html?search=${encodeURIComponent(query)}`;
            window.location.href = url;
        }
    });
}


const params = new URLSearchParams(window.location.search);
const searchQuery = params.get('search')?.toLowerCase();

if (searchQuery) {
    // Ẩn các sản phẩm không thuộc danh mục searchQuery
    const productCards = document.querySelectorAll('.product');
    productCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        if (!title.includes(searchQuery)) {
            card.style.display = 'none';
        } else {
            card.style.display = 'block';
        }
    });
}
