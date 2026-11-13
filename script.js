const products = [
    {
        id: 1,
        nama: "WHITE ALBUM 2: Extended Edition",
        harga: 450000,
        stok: 5,
        dev: "Leaf / AQUAPLUS",
        img: "https://t.vndb.org/cv/06/97306.jpg"
    },
    {
        id: 2,
        nama: "Hamidashi Creative",
        harga: 320000,
        stok: 7,
        dev: "Madosoft",
        img: "https://t.vndb.org/cv/21/114521.jpg"
    },
    {
        id: 3,
        nama: "Dimension Totsu Lovers!!",
        harga: 350000,
        stok: 4,
        dev: "CRYSTALiA",
        img: "https://t.vndb.org/cv/38/146538.jpg"
    },
    {
        id: 4,
        nama: "Dekinai watashi ga, Kurikaesu",
        harga: 280000,
        stok: 6,
        dev: "AKABEiSOFT3",
        img: "https://t.vndb.org/cv.t/13/142313.jpg"
    },
    {
        id: 5,
        nama: "Full Metal Daemon Muramasa",
        harga: 420000,
        stok: 3,
        dev: "nitro+",
        img: "https://t.vndb.org/cv/25/77925.jpg"
    },
    {
        id: 6,
        nama: "Utawarerumono: Mask of Truth",
        harga: 390000,
        stok: 5,
        dev: "AQUAPLUS",
        img: "https://t.vndb.org/cv/65/85165.jpg"
    }
];

let cart = [];

const formatRupiah = (n) => "Rp " + Number(n).toLocaleString("id-ID");

function renderProducts() {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    products.forEach((p) => {
        const card = document.createElement("div");
        card.className = "product-card";

        const imgWrapper = document.createElement("div");
        imgWrapper.className = "product-img-wrapper";
        const img = document.createElement("img");
        img.className = "product-img";
        img.src = p.img;
        img.alt = p.nama;
        imgWrapper.appendChild(img);

        const dev = document.createElement("div");
        dev.className = "product-tag";
        dev.appendChild(document.createTextNode(p.dev));

        const title = document.createElement("h3");
        title.className = "product-title";
        title.appendChild(document.createTextNode(p.nama));

        const metaRow = document.createElement("div");
        metaRow.className = "product-meta-row";

        const price = document.createElement("span");
        price.className = "product-price";
        price.appendChild(document.createTextNode(formatRupiah(p.harga)));

        const stock = document.createElement("span");
        stock.className = "product-stock";
        stock.id = "stock-" + p.id;
        stock.appendChild(document.createTextNode("Game Key: " + p.stok));

        metaRow.appendChild(price);
        metaRow.appendChild(stock);

        const btn = document.createElement("button");
        btn.className = "btn-add-cart";
        btn.id = "btn-add-" + p.id;
        btn.appendChild(document.createTextNode("Tambah ke Keranjang"));
        btn.onclick = () => addToCart(p.id);

        card.appendChild(imgWrapper);
        card.appendChild(dev);
        card.appendChild(title);
        card.appendChild(metaRow);
        card.appendChild(btn);

        grid.appendChild(card);
    });
}

function addToCart(productId) {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    if (prod.stok <= 0) {
        alert('Maaf, Digital key produk "' + prod.nama + '" sudah habis!');
        return;
    }

    prod.stok--;
    const stockEl = $("#stock-" + prod.id).text("Game Key: " + prod.stok);
    if (prod.stok === 0) {
        stockEl.addClass("out").text("Stok Key Habis");
        $("#btn-add-" + prod.id).prop("disabled", true).text("Habis");
    }

    let item = cart.find((i) => i.id === prod.id);
    if (item) {
        item.qty++;
        const el = $("#cart-item-" + prod.id);
        el.find(".cart-item-qty").text(item.qty);
        el.find(".cart-item-subtotal").text(formatRupiah(item.qty * prod.harga));
    } else {
        item = { id: prod.id, nama: prod.nama, harga: prod.harga, qty: 1 };
        cart.push(item);
        $("#cartEmptyMessage").hide();

        const html = `
            <li class="cart-item" id="cart-item-${prod.id}" style="display:none;">
                <div class="cart-item-info">
                    <div class="cart-item-name">${prod.nama}</div>
                    <div class="cart-item-sub">
                        <span class="cart-item-qty">1</span> x ${formatRupiah(prod.harga)} = 
                        <strong class="cart-item-subtotal">${formatRupiah(prod.harga)}</strong>
                    </div>
                </div>
                <button class="btn-remove-item" data-id="${prod.id}" title="Hapus satu item">Hapus</button>
            </li>`;
        $("#cartItemList").append(html);
        $("#cart-item-" + prod.id).fadeIn(300);
    }
    updateCartSummary();
}

function removeOneFromCart(productId) {
    const idx = cart.findIndex((i) => i.id === productId);
    if (idx === -1) return;

    const item = cart[idx];
    if (!confirm('Yakin ingin menghapus 1 unit "' + item.nama + '" dari keranjang?')) return;

    const prod = products.find((p) => p.id === productId);
    if (prod) {
        prod.stok++;
        $("#stock-" + prod.id).removeClass("out").text("Key: " + prod.stok);
        $("#btn-add-" + prod.id).prop("disabled", false).text("Tambah ke Keranjang");
    }

    item.qty--;
    if (item.qty <= 0) {
        cart.splice(idx, 1);
        $("#cart-item-" + productId).fadeOut(300, function () {
            $(this).remove();
            if (cart.length === 0) $("#cartEmptyMessage").fadeIn(200);
        });
    } else {
        const el = $("#cart-item-" + productId);
        el.find(".cart-item-qty").text(item.qty);
        el.find(".cart-item-subtotal").text(formatRupiah(item.qty * item.harga));
    }
    updateCartSummary();
}

function emptyCart() {
    if (cart.length === 0) return alert("Keranjang belanja masih kosong!");
    if (!confirm("Apakah Anda yakin ingin mengosongkan seluruh isi keranjang belanja?")) return;

    cart.forEach((item) => {
        const prod = products.find((p) => p.id === item.id);
        if (prod) {
            prod.stok += item.qty;
            $("#stock-" + prod.id).removeClass("out").text("Game Key: " + prod.stok);
            $("#btn-add-" + prod.id).prop("disabled", false).text("Tambah ke Keranjang");
        }
    });

    $("#cartItemList").fadeOut(250, function () {
        $(this).empty().show();
        $("#cartEmptyMessage").fadeIn(200);
    });
    cart = [];
    updateCartSummary();
}

function updateCartSummary() {
    const qty = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + (i.qty * i.harga), 0);
    $("#totalQtyText, #cartCountPill").text(qty + " Item");
    $("#totalPriceText").text(formatRupiah(total));
    $("#cartBadge").text(qty);
}

function checkout() {
    if (cart.length === 0) return alert("Keranjang masih kosong! Silakan pilih produk terlebih dahulu.");

    const nama = prompt("Masukkan nama lengkap Anda untuk konfirmasi pemesanan:");
    if (nama === null) return;
    if (!nama.trim()) return alert("Nama pembeli tidak boleh kosong!");

    const total = cart.reduce((s, i) => s + (i.qty * i.harga), 0);
    const qty = cart.reduce((s, i) => s + i.qty, 0);

    $("#receiptBuyerName").text(nama.trim());
    $("#receiptDate").text(new Date().toLocaleDateString("id-ID", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    }));

    const tbody = $("#receiptTableBody").empty();
    cart.forEach((i) => {
        tbody.append(`<tr>
            <td>${i.nama}</td>
            <td style="text-align:center;">${i.qty}</td>
            <td style="text-align:right;">${formatRupiah(i.harga * i.qty)}</td>
        </tr>`);
    });

    $("#receiptTotalItems").text(qty);
    $("#receiptTotalPrice").text(formatRupiah(total));
    $("#receiptModal").css("display", "flex").hide().fadeIn(300);

    $("#cartItemList").empty();
    $("#cartEmptyMessage").show();
    cart = [];
    updateCartSummary();
}

$(document).ready(function () {
    renderProducts();

    $("#btnCartToggle").click(() => $("#cartSidebar").fadeToggle(300));

    $("#searchInput").on("keyup", function () {
        const q = $(this).val().toLowerCase().trim();
        $(".product-card").each(function () {
            const text = ($(this).find(".product-title").text() + " " + $(this).find(".product-tag").text()).toLowerCase();
            $(this).toggle(text.includes(q));
        });
    });

    $(document).on("click", ".btn-remove-item", function () {
        removeOneFromCart(parseInt($(this).data("id")));
    });

    $("#btnEmptyCart").click(emptyCart);
    $("#btnCheckout").click(checkout);
    $("#btnCloseReceipt").click(() => $("#receiptModal").fadeOut(250));

    $(document).mouseup(function (e) {
        const card = $(".receipt-card");
        if ($("#receiptModal").is(":visible") && !card.is(e.target) && card.has(e.target).length === 0) {
            $("#receiptModal").fadeOut(250);
        }
    });
});
