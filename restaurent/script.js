"use strict";
const productsContainer = document.querySelector(".products");
let cartItems = [];
const showOrder = document.querySelector("#showOrder");
const orderContainer = document.querySelector(".confirm__order__container");

async function loadData() {
  try {
    const response = await fetch("data.json");
    const products = await response.json();

    products.forEach((product, index) => {
      let productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
            <img
                src="${product.image.mobile}"
                srcset="${product.image.mobile} 480w,
                        ${product.image.tablet} 768w,
                        ${product.image.desktop} 1024w"
                sizes="(max-width: 480px) 480px,
                        (max-width: 768px) 768px,
                        1024px"
                alt="${product.name}"
              class="product__img"
            />
            <div class="product__details">
              <span class="product__slug">${product.category}</span>
              <p class="product__name">${product.name}</p>
              <span class="product__price">$${String(product.price)}</span>
            </div>
              <div class="cart_btn cart_btn_container">
                <button
                    class="add_to_cart cart_btn cart_btn_front"
                    data-index="${index}"
                >
                    <img
                    src="./assets/images/icon-add-to-cart.svg"
                    alt=""
                    class="cart__icon cart_btn"
                    data-index="${index}"
                    />
                    <span class="cart__title cart_btn" data-index="${index}"
                    >Add To Cart</span
                    >
                </button>
                <button class="cart_btn_back hidden" data-index="${index}">
                <i class="ri-subtract-fill icon cart_substract" data-index="${index}"></i>

                    <span class="item__quantity ">1</span>

                    <i class="ri-add-line icon cart_add" data-index="${index}"></i>

                </button>
            </div>
        `;
      productsContainer.appendChild(productDiv);
    });
    document.addEventListener("click", function (e) {
      if (e.target.classList.contains("cart_btn")) {
        if (!e.target.dataset.index) return;
        const product = products[e.target.dataset.index];
        addToCart(e.target.dataset.index);
        const cartProduct = cartItems.find(
          (cartItem) => cartItem.product.name == product.name
        );
        let cartBtnContainer = e.target.closest(".cart_btn_container");
        let quantity = cartBtnContainer.querySelector(".item__quantity");

        quantity.textContent = cartProduct.quantity;
      }
    });
    function updateQuantity(item) {
      const product = products[item];
      const cartProduct = cartItems.find(
        (cartItem) => cartItem.name == product.name
      );
      let cartBtnContainer = e.target.closest(".cart_btn_container");
      let quantity = cartBtnContainer.querySelector(".item__quantity");

      quantity.textContent = cartProduct.quantity;
    }

    document.querySelector(".products").addEventListener("click", function (e) {
      if (e.target.classList.contains("cart_add")) {
        const product = products[e.target.dataset.index];
        addToCart(e.target.dataset.index);
        const cartProduct = cartItems.find(
          (cartItem) => cartItem.product.name == product.name
        );
        let cartBtnContainer = e.target.closest(".cart_btn_container");
        let quantity = cartBtnContainer.querySelector(".item__quantity");

        quantity.textContent = cartProduct.quantity;
      } else if (e.target.classList.contains("cart_substract")) {
        removeFromCart(e.target.dataset.index);

        const product = products[Number(e.target.dataset.index)];
        let exsistingProduct = cartItems.find(
          (item) => item.product.name == product.name
        );
        if (exsistingProduct) {
          //   updateQuantity(e.target.dataset.index);
          const cartProduct = cartItems.find(
            (cartItem) => cartItem.product.name == product.name
          );
          let cartBtnContainer = e.target.closest(".cart_btn_container");
          let quantity = cartBtnContainer.querySelector(".item__quantity");

          quantity.textContent = cartProduct.quantity;
          return;
        }
        checkButtonStatus(e.target);
      }
    });
    // document.querySelectorAll(".cart_add").forEach((icon) =>
    //   icon.addEventListener("click", function (e) {
    //     const product = products[e.target.dataset.index];
    //     addToCart(e.target.dataset.index);
    //     const cartProduct = cartItems.find(
    //       (cartItem) => cartItem.product.name == product.name
    //     );
    //     let cartBtnContainer = e.target.closest(".cart_btn_container");
    //     let quantity = cartBtnContainer.querySelector(".item__quantity");

    //     quantity.textContent = cartProduct.quantity;
    //   })
    // );
    // document.querySelectorAll(".cart_substract").forEach((icon) =>
    //   icon.addEventListener("click", function (e) {
    //     removeFromCart(e.target.dataset.index);

    //     const product = products[Number(e.target.dataset.index)];
    //     let exsistingProduct = cartItems.find(
    //       (item) => item.product.name == product.name
    //     );
    //     if (exsistingProduct) {
    //       //   updateQuantity(e.target.dataset.index);
    //       const cartProduct = cartItems.find(
    //         (cartItem) => cartItem.product.name == product.name
    //       );
    //       let cartBtnContainer = e.target.closest(".cart_btn_container");
    //       let quantity = cartBtnContainer.querySelector(".item__quantity");

    //       quantity.textContent = cartProduct.quantity;
    //       return;
    //     }
    //     checkButtonStatus(e.target);
    //   })
    // );

    document.querySelectorAll(".cart_btn_front").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();

        let frontBtn = e.target.closest(".cart_btn_front");
        let backBtn = frontBtn?.nextElementSibling;
        if (frontBtn) {
          frontBtn.style.opacity = 0;
          frontBtn.classList.add("hidden");
          frontBtn.style.pointerEvents = "none";
        }
        if (backBtn) {
          backBtn.style.opacity = 1;
          backBtn.classList.remove("hidden");
          backBtn.style.pointerEvents = "auto";
        }
      });
    });

    function addToCart(item) {
      const product = products[Number(item)];
      const exsistingProduct = cartItems.find(
        (item) => item.product.name == product.name
      );
      if (exsistingProduct) {
        exsistingProduct.quantity++;
        exsistingProduct.total =
          Number(exsistingProduct.product.price) *
          Number(exsistingProduct.quantity);
      } else {
        cartItems.push({
          product,
          quantity: 1,
          total: Number(product.price) * 1,
        });
      }

      updateCart(item);
      document.querySelector(
        ".cart__item_count"
      ).textContent = `(${calculateTotalItems()})`;
    }

    function removeFromCart(item) {
      const product = products[Number(item)];
      const exsistingProduct = cartItems.find(
        (item) => item.product.name == product.name
      );

      if (exsistingProduct && exsistingProduct.quantity > 1) {
        exsistingProduct.quantity--;
        exsistingProduct.total =
          Number(exsistingProduct.product.price) *
          Number(exsistingProduct.quantity);
      } else {
        cartItems = cartItems.filter(
          (cartItem) => cartItem.product.name != product.name
        );
      }

      updateCart(item);
      document.querySelector(
        ".cart__item_count"
      ).textContent = `(${calculateTotalItems()})`;
    }
    function updateCart(item) {
      const cartItemList = document.querySelector(".cart__items__list");
      cartItemList.textContent = "";
      if (cartItems.length > 0) {
        document.querySelector(".empty__cart__div").classList.add("hidden");
        document
          .querySelectorAll(".show__cart")
          .forEach((item) => (item.style.display = "flex"));

        cartItems.forEach((product, index) => {
          const cartItem = document.createElement("div");
          cartItem.classList.add("cart__item");
          cartItem.innerHTML = `
            <span class="cart__item__name">${product.product.name}</span>
            <div class="cart__item__details">
              <span class="cart__item__quantity">${Number(
                product.quantity
              )}x</span>
              <span class="cart__item__price">${Number(
                product.product.price
              )}</span>
              <span class="cart__item__totalprice">$${
                Number(product.product.price) * Number(product.quantity)
              }</span>
              <i class="ri-close-fill icon" data-item="${Number(index)}"></i>
            </div>
            `;
          cartItemList.appendChild(cartItem);
        });
        let total = calculateTotal();
        document.querySelector(".order__amount").textContent = `$${total}`;
        document.querySelector(
          ".cart__item_count"
        ).textContent = `(${calculateTotalItems()})`;
      } else {
        document
          .querySelectorAll(".show__cart")
          .forEach((item) => (item.style.display = "none"));
        document.querySelector(".empty__cart__div").classList.remove("hidden");
      }
    }
    function showCart() {
      if (cartItems.length > 0) {
        document.querySelector(".empty__cart__div").classList.add("hidden");
        document
          .querySelectorAll(".show__cart")
          .forEach((item) => (item.style.display = "flex"));
      }
    }

    function calculateTotal() {
      const total = cartItems.reduce(
        (acc, currentValue) => (acc += currentValue.total),
        0
      );
      return total;
    }
    function calculateTotalItems() {
      const totalItems = cartItems.reduce((acc, currentValue) => {
        acc += currentValue.quantity;
        return acc;
      }, 0);
      return totalItems;
    }

    showOrder.addEventListener("click", function (e) {
      e.preventDefault();
      const orderList = document.querySelector(".order__list");
      let total = calculateTotal();
      cartItems.forEach((cartItem) => {
        console.log(cartItem.product);
        const orderItem = document.createElement("div");
        orderItem.classList.add("order__item");
        orderItem.innerHTML = ` <img

            src="${cartItem.product.image.mobile}"
            srcset="${cartItem.product.image.mobile} 480w,
                    ${cartItem.product.image.tablet} 768w,
                    ${cartItem.product.image.desktop} 1024w"
            sizes="(max-width: 480px) 480px,
                    (max-width: 768px) 768px,
                    1024px"
            alt="${cartItem.product.name}"
            alt=""
            class="order__item__img"
          />
          <div class="order__item__details">
            <span class="order__item__name">${cartItem.product.name}</span>

            <span class="order__item__quantity">${cartItem.quantity}x</span>
            <span class="order__item__price">$${cartItem.product.price}</span>
            <span class="order__item__totalprice">${cartItem.total}</span>
          </div>
         `;
        orderList.append(orderItem);
      });
      const orderSummary = document.createElement("div");
      orderSummary.classList.add("order__total");
      orderSummary.innerHTML = `<span>Order Total</span>
          <span class="order__grand__total">$${total}</span>`;
      orderList.append(orderSummary);
      //   orderContainer.style.display = "flex";
      //   orderContainer.style.transform = "translateY(0)";
      orderContainer.classList.add("show");
      document.querySelector(".overlay").classList.add("showoverlay");
      disableScroll();
    });

    document.addEventListener("click", function (e) {
      e.preventDefault();

      if (!e.target.classList.contains("ri-close-fill")) return;
      let product = cartItems[Number(e.target.dataset.item)];

      cartItems = cartItems.filter(
        (cartItem) => cartItem.product.name != product.product.name
      );
      let allProductCartButtons = document.querySelectorAll(
        ".cart_btn_container"
      );
      allProductCartButtons.forEach((button) => {
        let frontBtn = button.querySelector(".cart_btn_front");
        let backBtn = frontBtn?.nextElementSibling;

        if (!frontBtn || frontBtn.dataset.index === undefined) return;

        let item = products[Number(frontBtn.dataset.index)];
        console.log(product);
        console.log(item.name, product.product.name);
        if (item.name === product.product.name) {
          console.log(frontBtn);
          frontBtn.style.opacity = 1;
          frontBtn.classList.remove("hidden");
          frontBtn.style.pointerEvents = "auto";

          if (backBtn) {
            backBtn.style.opacity = 0;
            backBtn.classList.add("hidden");
            backBtn.style.pointerEvents = "none";
          }
        }
      });

      updateCart();
      document.querySelector(
        ".cart__item_count"
      ).textContent = `(${calculateTotalItems()})`;
    });

    function checkButtonStatus(target) {
      let cartBtnContainer = target.closest(".cart_btn_container");

      let frontBtn = cartBtnContainer?.querySelector(".cart_btn_front");
      let backBtn = frontBtn?.nextElementSibling;

      if (frontBtn) {
        frontBtn.style.opacity = 1;
        frontBtn.classList.remove("hidden");
        frontBtn.style.pointerEvents = "auto";
      }
      if (backBtn) {
        backBtn.style.opacity = 0;
        backBtn.classList.add("hidden");
        backBtn.style.pointerEvents = "none";
      }
    }
  } catch (error) {
    console.log(error);
  }
}
document.querySelector(".overlay").addEventListener("click", function (e) {
  document.querySelector(".order__list").textContent = "";

  orderContainer.classList.remove("show");
  e.target.classList.remove("showoverlay");
  enableScroll();
});

function disableScroll() {
  document.body.style.overflow = "hidden";
}
function enableScroll() {
  document.body.style.overflow = "";
}
loadData();
