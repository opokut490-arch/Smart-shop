let products = [
  {
    id: 1,
    name: "Bread",
    category: "Food",
    cost: 10,
    price: 15,
    stock: 20
  },

  {
    id: 2,
    name: "Milk",
    category: "Food",
    cost: 8,
    price: 12,
    stock: 15
  },

  {
    id: 3,
    name: "Rice",
    category: "Food",
    cost: 22,
    price: 28.50,
    stock: 10
  },

  {
    id: 4,
    name: "Soap",
    category: "Household",
    cost: 5,
    price: 7.25,
    stock: 25
  },

  {
    id: 5,
    name: "Drink",
    category: "Drink",
    cost: 6,
    price: 10,
    stock: 30
  }
];

let cart = [];
let sales = [];


/* STORAGE */

function saveData() {

  localStorage.setItem(
    "smartShopProducts",
    JSON.stringify(products)
  );

  localStorage.setItem(
    "smartShopSales",
    JSON.stringify(sales)
  );
}


function loadData() {

  const savedProducts =
    localStorage.getItem(
      "smartShopProducts"
    );

  const savedSales =
    localStorage.getItem(
      "smartShopSales"
    );


  if (savedProducts) {
    products =
      JSON.parse(savedProducts);
  }


  if (savedSales) {
    sales =
      JSON.parse(savedSales);
  }
}


/* PAGE SWITCHING */

function showPage(pageId) {

  document
    .querySelectorAll(".page")
    .forEach(function(page) {

      page.classList.add("hidden");

    });


  document
    .getElementById(pageId)
    .classList.remove("hidden");


  if (pageId === "salePage") {
    displayProducts();
    displayCart();
  }


  if (pageId === "inventoryPage") {
    displayInventory();
  }


  if (pageId === "historyPage") {
    displayHistory();
  }


  if (pageId === "dashboardPage") {
    displayDashboard();
  }
}


/* PRODUCTS */

function displayProducts() {

  const box =
    document.getElementById("products");


  const search =
    document
      .getElementById("searchInput")
      .value
      .toLowerCase();


  box.innerHTML = "";


  products
    .filter(function(product) {

      return product.name
        .toLowerCase()
        .includes(search);

    })
    .forEach(function(product) {

      let button;


      if (product.stock > 0) {

        button = `

          <button
            class="add-cart-btn"
            onclick="addToCart(${product.id})">

            🛒 Add

          </button>

        `;

      } else {

        button = `

          <button
            class="disabled-btn"
            disabled>

            Out of Stock

          </button>

        `;

      }


      box.innerHTML += `

        <div class="product-card">

          <h3>
            ${product.name}
          </h3>

          <div class="product-category">
            ${product.category}
          </div>

          <div class="product-price">
            GH₵ ${product.price.toFixed(2)}
          </div>

          <div class="stock-text">
            Stock: ${product.stock}
          </div>

          <br>

          ${button}

        </div>

      `;

    });
}


/* CART */

function addToCart(id) {

  const product =
    products.find(function(product) {

      return product.id === id;

    });


  const existing =
    cart.find(function(item) {

      return item.id === id;

    });


  const currentQuantity =
    existing
      ? existing.quantity
      : 0;


  if (
    currentQuantity >=
    product.stock
  ) {

    alert("Not enough stock.");

    return;
  }


  if (existing) {

    existing.quantity++;

  } else {

    cart.push({
      id: id,
      quantity: 1
    });

  }


  displayCart();
}


function displayCart() {

  const box =
    document.getElementById("cart");


  box.innerHTML = "";


  if (cart.length === 0) {

    box.innerHTML =
      "<p>Your cart is empty.</p>";

    document
      .getElementById("saleTotal")
      .textContent = "0.00";

    return;
  }


  let total = 0;


  cart.forEach(function(item) {

    const product =
      products.find(function(product) {

        return product.id === item.id;

      });


    const itemTotal =
      product.price *
      item.quantity;


    total += itemTotal;


    box.innerHTML += `

      <div class="cart-item">

        <div>

          <strong>
            ${product.name}
          </strong>

          <br>

          GH₵
          ${itemTotal.toFixed(2)}

        </div>


        <div class="quantity">

          <button
            onclick="decreaseQuantity(${product.id})">
            −
          </button>

          <strong>
            ${item.quantity}
          </strong>

          <button
            onclick="increaseQuantity(${product.id})">
            +
          </button>

          <button
            class="remove-btn"
            onclick="removeFromCart(${product.id})">
            ✕
          </button>

        </div>

      </div>

    `;

  });


  document
    .getElementById("saleTotal")
    .textContent =
    total.toFixed(2);


  calculateChange(total);
}


function increaseQuantity(id) {

  const product =
    products.find(function(product) {

      return product.id === id;

    });


  const item =
    cart.find(function(item) {

      return item.id === id;

    });


  if (
    item.quantity >=
    product.stock
  ) {

    alert("Not enough stock.");

    return;
  }


  item.quantity++;

  displayCart();
}


function decreaseQuantity(id) {

  const item =
    cart.find(function(item) {

      return item.id === id;

    });


  if (!item) return;


  item.quantity--;


  if (item.quantity <= 0) {

    cart =
      cart.filter(function(item) {

        return item.id !== id;

      });

  }


  displayCart();
}


function removeFromCart(id) {

  cart =
    cart.filter(function(item) {

      return item.id !== id;

    });


  displayCart();
}


/* PAYMENT METHOD */

function updatePaymentMethod() {

  const method =
    document
      .getElementById(
        "paymentMethod"
      )
      .value;


  const cashSection =
    document
      .getElementById(
        "cashSection"
      );


  if (method === "Cash") {

    cashSection.classList.remove(
      "hidden"
    );

  } else {

    cashSection.classList.add(
      "hidden"
    );

    document
      .getElementById(
        "cashInput"
      )
      .value = "";


    document
      .getElementById(
        "changeAmount"
      )
      .textContent = "0.00";
  }
}


/* CHANGE */

function calculateChange(total) {

  const method =
    document
      .getElementById(
        "paymentMethod"
      )
      .value;


  if (method !== "Cash") {

    document
      .getElementById(
        "changeAmount"
      )
      .textContent = "0.00";

    return;
  }


  const cash =
    Number(
      document
        .getElementById(
          "cashInput"
        )
        .value
    );


  const change =
    document
      .getElementById(
        "changeAmount"
      );


  if (
    !cash ||
    cash < total
  ) {

    change.textContent =
      "0.00";

    return;
  }


  change.textContent =
    (
      cash - total
    ).toFixed(2);
}


/* COMPLETE SALE */

function completeSale() {

  const message =
    document.getElementById(
      "saleMessage"
    );


  if (cart.length === 0) {

    message.textContent =
      "⚠️ Cart is empty.";

    return;
  }


  let total = 0;

  let costTotal = 0;


  cart.forEach(function(item) {

    const product =
      products.find(function(product) {

        return product.id === item.id;

      });


    total +=
      product.price *
      item.quantity;


    costTotal +=
      product.cost *
      item.quantity;

  });


  const paymentMethod =
    document
      .getElementById(
        "paymentMethod"
      )
      .value;


  let cash = total;

  let change = 0;


  /* CASH PAYMENT */

  if (
    paymentMethod === "Cash"
  ) {

    cash =
      Number(
        document
          .getElementById(
            "cashInput"
          )
          .value
      );


    if (
      !cash ||
      cash < total
    ) {

      message.textContent =
        "⚠️ Cash received is not enough.";

      return;
    }


    change =
      cash - total;

  }


  /* MoMo OR CARD */

  if (
    paymentMethod === "MoMo" ||
    paymentMethod === "Card"
  ) {

    cash = total;

    change = 0;

  }


  const profit =
    total - costTotal;


  const saleItems =
    cart.map(function(item) {

      const product =
        products.find(function(product) {

          return product.id === item.id;

        });


      return {

        name: product.name,

        cost: product.cost,

        price: product.price,

        quantity: item.quantity

      };

    });


  /* REDUCE STOCK */

  cart.forEach(function(item) {

    const product =
      products.find(function(product) {

        return product.id === item.id;

      });


    product.stock -=
      item.quantity;

  });


  /* CREATE SALE */

  const sale = {

    id: Date.now(),

    items: saleItems,

    total: total,

    cost: costTotal,

    profit: profit,

    cash: cash,

    change: change,

    paymentMethod:
      paymentMethod,

    date:
      new Date().toLocaleString()

  };


  sales.unshift(sale);


  saveData();


  showReceipt(sale);


  cart = [];


  document
    .getElementById(
      "cashInput"
    )
    .value = "";


  message.textContent =
    "✅ Sale completed!";


  displayProducts();

  displayCart();

  displayDashboard();

  displayInventory();

  displayHistory();
}


/* INVENTORY */

function displayInventory() {

  const box =
    document.getElementById(
      "inventoryList"
    );


  const search =
    document
      .getElementById(
        "inventorySearch"
      )
      .value
      .toLowerCase();


  box.innerHTML = "";


  products
    .filter(function(product) {

      return product.name
        .toLowerCase()
        .includes(search);

    })
    .forEach(function(product) {

      const profit =
        product.price -
        product.cost;


      const low =
        product.stock <= 5;


      box.innerHTML += `

        <div
          class="inventory-item
          ${low ? "low-stock" : ""}">

          <strong>
            ${product.name}
          </strong>

          <br>

          Category:
          ${product.category}

          <br>

          Cost:
          GH₵
          ${product.cost.toFixed(2)}

          <br>

          Selling:
          GH₵
          ${product.price.toFixed(2)}

          <br>

          Profit per unit:
          GH₵
          ${profit.toFixed(2)}

          <br>

          Stock:
          ${product.stock}

          ${low ? " ⚠️ LOW STOCK" : ""}


          <div class="inventory-actions">

            <button
              class="edit-btn"
              onclick="editProduct(${product.id})">

              ✏️ Edit

            </button>


            <button
              class="restock-btn"
              onclick="restockProduct(${product.id})">

              🔄 Restock

            </button>


            <button
              class="danger-btn"
              onclick="deleteProduct(${product.id})">

              🗑️ Delete

            </button>

          </div>

        </div>

      `;

    });
}


/* ADD PRODUCT */

function addProduct() {

  const name =
    document
      .getElementById(
        "productName"
      )
      .value
      .trim();


  const category =
    document
      .getElementById(
        "productCategory"
      )
      .value;


  const cost =
    Number(
      document
        .getElementById(
          "productCost"
        )
        .value
    );


  const price =
    Number(
      document
        .getElementById(
          "productPrice"
        )
        .value
    );


  const stock =
    Number(
      document
        .getElementById(
          "productStock"
        )
        .value
    );


  const message =
    document
      .getElementById(
        "productMessage"
      );


  if (
    name === "" ||
    cost <= 0 ||
    price <= 0 ||
    stock < 0
  ) {

    message.textContent =
      "⚠️ Enter valid information.";

    return;
  }


  if (price < cost) {

    message.textContent =
      "⚠️ Selling price is below cost.";

    return;
  }


  products.push({

    id: Date.now(),

    name: name,

    category: category,

    cost: cost,

    price: price,

    stock: stock

  });


  saveData();


  message.textContent =
    "✅ " +
    name +
    " added successfully.";


  document
    .getElementById(
      "productName"
    )
    .value = "";


  document
    .getElementById(
      "productCost"
    )
    .value = "";


  document
    .getElementById(
      "productPrice"
    )
    .value = "";


  document
    .getElementById(
      "productStock"
    )
    .value = "";


  displayProducts();

  displayInventory();

  displayDashboard();
}


/* EDIT */

function editProduct(id) {

  const product =
    products.find(function(product) {

      return product.id === id;

    });


  if (!product) return;


  const name =
    prompt(
      "Product name:",
      product.name
    );


  if (name === null) return;


  const cost =
    Number(
      prompt(
        "Cost price:",
        product.cost
      )
    );


  const price =
    Number(
      prompt(
        "Selling price:",
        product.price
      )
    );


  if (
    !cost ||
    !price ||
    cost <= 0 ||
    price <= 0
  ) {

    alert("Invalid price.");

    return;
  }


  product.name =
    name.trim();

  product.cost =
    cost;

  product.price =
    price;


  saveData();


  displayInventory();

  displayProducts();

  displayDashboard();


  alert(
    "Product updated."
  );
}


/* RESTOCK */

function restockProduct(id) {

  const product =
    products.find(function(product) {

      return product.id === id;

    });


  if (!product) return;


  const amount =
    Number(
      prompt(
        "How many units are you adding?",
        "10"
      )
    );


  if (
    !amount ||
    amount <= 0
  ) {

    alert(
      "Invalid quantity."
    );

    return;
  }


  product.stock +=
    amount;


  saveData();


  displayInventory();

  displayProducts();

  displayDashboard();


  alert(
    product.name +
    " restocked."
  );
}


/* DELETE */

function deleteProduct(id) {

  const product =
    products.find(function(product) {

      return product.id === id;

    });


  if (!product) return;


  const confirmed =
    confirm(
      "Delete " +
      product.name +
      "?"
    );


  if (!confirmed) return;


  products =
    products.filter(function(product) {

      return product.id !== id;

    });


  cart =
    cart.filter(function(item) {

      return item.id !== id;

    });


  saveData();


  displayInventory();

  displayProducts();

  displayCart();

  displayDashboard();
}


/* DASHBOARD */

function displayDashboard() {

  let revenue = 0;

  let cost = 0;

  let profit = 0;


  sales.forEach(function(sale) {

    revenue +=
      Number(sale.total);

    cost +=
      Number(sale.cost);

    profit +=
      Number(sale.profit);

  });


  document
    .getElementById(
      "totalRevenue"
    )
    .textContent =
    revenue.toFixed(2);


  document
    .getElementById(
      "totalProfit"
    )
    .textContent =
    profit.toFixed(2);


  document
    .getElementById(
      "transactionCount"
    )
    .textContent =
    sales.length;


  document
    .getElementById(
      "productCount"
    )
    .textContent =
    products.length;


  document
    .getElementById(
      "summaryRevenue"
    )
    .textContent =
    revenue.toFixed(2);


  document
    .getElementById(
      "summaryCost"
    )
    .textContent =
    cost.toFixed(2);


  document
    .getElementById(
      "summaryProfit"
    )
    .textContent =
    profit.toFixed(2);


  let lowStock = 0;


  products.forEach(function(product) {

    if (product.stock <= 5) {

      lowStock++;

    }

  });


  document
    .getElementById(
      "lowStockCount"
    )
    .textContent =
    lowStock;


  displayStockAlerts();

  displayRecentSales();
}


/* STOCK ALERTS */

function displayStockAlerts() {

  const box =
    document.getElementById(
      "stockAlerts"
    );


  box.innerHTML = "";


  const lowProducts =
    products.filter(function(product) {

      return product.stock <= 5;

    });


  if (
    lowProducts.length === 0
  ) {

    box.innerHTML =
      "<p>✅ All products have enough stock.</p>";

    return;
  }


  lowProducts.forEach(function(product) {

    box.innerHTML += `

      <div class="alert-item">

        ⚠️

        <strong>
          ${product.name}
        </strong>

        —

        ${product.stock}
        units remaining.

      </div>

    `;

  });
}


/* RECENT SALES */

function displayRecentSales() {

  const box =
    document.getElementById(
      "recentSales"
    );


  box.innerHTML = "";


  if (sales.length === 0) {

    box.innerHTML =
      "<p>No sales yet.</p>";

    return;
  }


  sales
    .slice(0, 5)
    .forEach(function(sale) {

      box.innerHTML += `

        <div class="sale-item">

          <strong>
            GH₵
            ${sale.total.toFixed(2)}
          </strong>

          <br>

          Payment:
          ${sale.paymentMethod || "Cash"}

          <br>

          Profit:
          GH₵
          ${sale.profit.toFixed(2)}

          <br>

          🕒 ${sale.date}

        </div>

      `;

    });
}


/* SALES HISTORY */

function displayHistory() {

  const box =
    document.getElementById(
      "historyList"
    );


  box.innerHTML = "";


  if (sales.length === 0) {

    box.innerHTML =
      "<p>No sales yet.</p>";

    return;
  }


  sales.forEach(function(sale) {

    let items = "";


    sale.items.forEach(function(item) {

      items +=
        item.name +
        " × " +
        item.quantity +
        "<br>";

    });


    box.innerHTML += `

      <div class="sale-item">

        <strong>
          Sale #${sale.id}
        </strong>

        <br><br>

        ${items}

        <br>

        Total:
        GH₵
        ${sale.total.toFixed(2)}

        <br>

        Payment:
        ${sale.paymentMethod || "Cash"}

        <br>

        Cash:
        GH₵
        ${sale.cash.toFixed(2)}

        <br>

        Change:
        GH₵
        ${sale.change.toFixed(2)}

        <br>

        Profit:
        GH₵
        ${sale.profit.toFixed(2)}

        <br><br>

        🕒 ${sale.date}

        <br><br>

        <button
          class="receipt-btn"
          onclick="showReceiptById(${sale.id})">

          🧾 View Receipt

        </button>

      </div>

    `;

  });
}


/* RECEIPT */

function showReceipt(sale) {

  const modal =
    document.getElementById(
      "receiptModal"
    );


  const content =
    document.getElementById(
      "receiptContent"
    );


  let items = "";


  sale.items.forEach(function(item) {

    const total =
      item.price *
      item.quantity;


    items += `

      <div class="receipt-line">

        <span>

          ${item.name}
          × ${item.quantity}

        </span>

        <span>

          GH₵
          ${total.toFixed(2)}

        </span>

      </div>

    `;

  });


  content.innerHTML = `

    <div class="receipt-header">

      <h2>
        🛒 SMART SHOP
      </h2>

      <p>
        Thank you for shopping with us!
      </p>

      <small>
        ${sale.date}
      </small>

    </div>

    <br>

    ${items}


    <div class="receipt-line">

      <strong>
        Payment
      </strong>

      <strong>
        ${sale.paymentMethod || "Cash"}
      </strong>

    </div>


    <div
      class="receipt-line"
      style="font-weight:bold;">

      <span>
        Total
      </span>

      <span>
        GH₵
        ${sale.total.toFixed(2)}
      </span>

    </div>


    <div class="receipt-line">

      <span>
        Cash
      </span>

      <span>
        GH₵
        ${sale.cash.toFixed(2)}
      </span>

    </div>


    <div class="receipt-line">

      <span>
        Change
      </span>

      <span>
        GH₵
        ${sale.change.toFixed(2)}
      </span>

    </div>


    <br>

    <p style="text-align:center;">
      Thank you! Come again.
    </p>

  `;


  modal.classList.remove(
    "hidden"
  );
}


function showReceiptById(id) {

  const sale =
    sales.find(function(sale) {

      return sale.id === id;

    });


  if (sale) {

    showReceipt(sale);

  }
}


/* BUTTONS */

document
  .getElementById(
    "dashboardBtn"
  )
  .addEventListener(
    "click",
    function() {

      showPage(
        "dashboardPage"
      );

    }
  );


document
  .getElementById(
    "saleBtn"
  )
  .addEventListener(
    "click",
    function() {

      showPage(
        "salePage"
      );

    }
  );


document
  .getElementById(
    "inventoryBtn"
  )
  .addEventListener(
    "click",
    function() {

      showPage(
        "inventoryPage"
      );

    }
  );


document
  .getElementById(
    "addBtn"
  )
  .addEventListener(
    "click",
    function() {

      showPage(
        "addPage"
      );

    }
  );


document
  .getElementById(
    "historyBtn"
  )
  .addEventListener(
    "click",
    function() {

      showPage(
        "historyPage"
      );

    }
  );


document
  .getElementById(
    "completeSaleBtn"
  )
  .addEventListener(
    "click",
    completeSale
  );


document
  .getElementById(
    "saveProductBtn"
  )
  .addEventListener(
    "click",
    addProduct
  );


document
  .getElementById(
    "searchInput"
  )
  .addEventListener(
    "input",
    displayProducts
  );


document
  .getElementById(
    "inventorySearch"
  )
  .addEventListener(
    "input",
    displayInventory
  );


/* PAYMENT METHOD BUTTON */

document
  .getElementById(
    "paymentMethod"
  )
  .addEventListener(
    "change",
    function() {

      updatePaymentMethod();

    }
  );


/* CASH INPUT */

document
  .getElementById(
    "cashInput"
  )
  .addEventListener(
    "input",
    function() {

      const total =
        Number(
          document
            .getElementById(
              "saleTotal"
            )
            .textContent
        );


      calculateChange(total);

    }
  );


/* RECEIPT CLOSE */

document
  .getElementById(
    "closeReceiptBtn"
  )
  .addEventListener(
    "click",
    function() {

      document
        .getElementById(
          "receiptModal"
        )
        .classList.add(
          "hidden"
        );

    }
  );


/* PRINT */

document
  .getElementById(
    "printReceiptBtn"
  )
  .addEventListener(
    "click",
    function() {

      window.print();

    }
  );


/* CLEAR HISTORY */

document
  .getElementById(
    "clearSalesBtn"
  )
  .addEventListener(
    "click",
    function() {

      const confirmed =
        confirm(
          "Delete all sales history?"
        );


      if (!confirmed) return;


      sales = [];

      saveData();

      displayHistory();

      displayDashboard();

    }
  );


/* START */

loadData();

displayProducts();

displayCart();

displayInventory();

displayHistory();

displayDashboard();

updatePaymentMethod();

showPage(
  "dashboardPage"
);