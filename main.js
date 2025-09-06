var params = {
  q: "",
  sort: "",
  order: "",
  page: 1,
  per_page: 12,
  last: 3,
  limit: 30,
  category: "",
};
var a = 30 / 12;
console.log(Math.ceil(params.limit / params.per_page));
const API_PRODUCT = `http://localhost:3000/products`;
// lấy API
function getAPI() {
  // http://localhost:3000/products?q=son&category=groceries&_sort=price&_order=asc&_page=1&_limit=12
  let cate = "";
  if (params.category != "") {
    cate = `&category=${params.category}`;
  }
  const API = `${API_PRODUCT}?q=${params.q}${cate}&_sort=${params.sort}&_order=${params.order}&_page=${params.page}&_limit=12`;
  return API;
}

// category
function drawCategory(api) {
  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let htmls = ``;
      let categorys = data.map((items) => {
        return items.category;
      });
      const listCategory = new Set(categorys);
      listCategory.forEach((items) => {
        htmls += `<div class="items">${items}</div>`;
      });
      const category = document.querySelector(".top-items");
      category.innerHTML = htmls;
      const listCategorys = document.querySelectorAll(".items");
      listCategorys.forEach((items) => {
        items.addEventListener("click", () => {
          params.category = items.innerHTML;
          draw();
        });
      });
    });
}
// products

function draw() {
  fetch(getAPI())
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let htmls = ``;
      data.map((items) => {
        htmls += `<div class="item-list">
            <div class="image">
              <img
                src="${items.thumbnail}"
                alt="thumbnail"
              />
            </div>
            <div class="lists-title">
              <h4 class="title">${items.title}</h4>
            </div>
            <div class="info">
              <p class="price">${items.price}$</p>
              <p class="stock">Còn lại: <b>${items.stock}</b> sp</p>
            </div>
          </div>`;
      });
      const products = document.querySelector("#products");
      products.innerHTML = htmls;
    });
}

// Events
function Events() {
  // phân trang
  var paginate = document.querySelector(".paginate-number");
  const prew = document.querySelector(".prew");
  const next = document.querySelector(".next");
  prew.addEventListener("click", () => {
    if (params.page > 1) {
      params.page--;
      paginate.innerHTML = params.page;
      draw();
    }
  });
  next.addEventListener("click", () => {
    if (params.page < Math.ceil(params.limit / params.per_page)) {
      params.page++;
      paginate.innerHTML = params.page;
      draw();
    }
  });
  // Tìm kiếm theo giá
  const selects = document.getElementById("select");
  selects.addEventListener("change", function () {
    const value = this.value;
    console.log(value);
    switch (value) {
      case "low":
        params.sort = "price";
        params.order = "asc";
        draw();
        break;
      case "high":
        params.sort = "price";
        params.order = "desc";
        draw();
        break;
      case "sale":
        params.sort = "discountPercentage";
        params.order = "desc";
        draw();
        break;
      default:
        params.sort = "";
        params.order = "";
        draw();
        break;
    }
  });
  // seach
  const seach = document.querySelector("#seach");
  const button = document.querySelector("#button");
  button.addEventListener("click", () => {
    params.q = seach.value;
    draw();
  });
  seach.addEventListener("keydown", (a) => {
    if (a.key === "Enter") {
      params.q = seach.value;
      draw();
    }
  });
}

drawCategory(API_PRODUCT);
draw();
Events();
