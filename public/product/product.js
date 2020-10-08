var slideIndex = 1;
var rate = 4;
const totalStar = 5;
const json = '{"Công ty phát hành": "R.E.A.D Books","Kích thước": "14 x 20.5cm","Số trang" : "208","SKU": "20681947681"}';
const des_label = 'Không phải chưa đủ năng lực, mà là chưa đủ kiên định';
const des_content = 'Bạn định sẽ giảm cân sớm thôi, nhưng không bao giờ ngừng nuông chiều bản thân, ăn uống vô độ Bạn quyết tâm học hành, làm việc chăm chỉ, nhưng cứ bật máy tính là xem phim, nghe nhạc hết cả ngày? Bạn tự nhủ rằng tiền không còn nhiều, phải tiết kiệm, nhưng lại không cầm lòng được trước các món đồ mà hiện tại mình không thực sự cần Hay có những lúc bạn rất bận rộn với việc của mình, nhưng vì cả nể vẫn chấp nhận giúp đỡ, làm hộ người khác cả phần việc của họ?';
const num_rating = 2;
const num_comment = 5;

window.onload = function () {
  showSlides(slideIndex);
  changeFavoriteStatus(true);
  loadTop();
  addRating();
  loadTable();
  loadContent();
  loadComment();
}

function loadTop() {
  //document.getElementById("product-name").innerHTML = "Không phải chưa đủ năng lực, mà là chưa đủ kiên định";
  //document.getElementById("product-id").innerHTML = "Mã sản phẩm: 1712210";
  //document.getElementById("product-author").innerHTML = "Tác giả: Hàn Xuân Trạch";
  //document.getElementById("product-seller").innerHTML = "Người bán: NXB Thế Giới";
  document.getElementById("nav_bar_it1").innerHTML = "Sản phẩm";
  //document.getElementById("nav_bar_it2").innerHTML = "Không phải chưa đủ năng lực, mà là chưa đủ kiên định";
}

function addCommas(nStr)
{
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}

function loadContent() {
  let head = document.getElementById("description-label");
  head.innerHTML = des_label.toUpperCase();
  let body = document.getElementById("description-content");
  body.innerHTML = des_content;
}

function loadTable() {
  let body = document.getElementById("product-info-body");
  const json_arr = JSON.parse(json);
  jQuery.each(json_arr, function (index, value) {
    let object_tr = document.createElement("TR");

    let object_th = document.createElement("TH");
    object_th.innerHTML = index;
    object_th.scope = "row";
    object_th.className = "info-body-th";
    object_tr.appendChild(object_th);

    let object_td = document.createElement("TD");
    object_td.className = "info-body-td form-control";
    object_td.innerHTML = value;
    object_tr.appendChild(object_td);

    body.appendChild(object_tr);
  });
}

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

var favorite = true;
async function changeFavoriteStatus(onInit) {
  
  user=document.getElementById("user").innerHTML;
  product=document.getElementById("product").innerHTML
  
  favorite = !favorite;
  
  if (favorite) {
    if(user.length==14){
      alert('Bạn chưa đăng nhập')
    }else{
      document.getElementById("favorite-image").src = "/images/love.png";
      if (onInit == false){
          url='http://localhost:3000/user/add_favorite_product/'+product;
          await fetch(url);  
          alert("Đã thêm vào mục yêu thích");
      }
    }
  }
  else {
    if(user.length==14){
      alert('Bạn chưa đăng nhập')
    }else{
      document.getElementById("favorite-image").src = "/images/nolove.png";
      if (onInit == false)   
          url='http://localhost:3000/user/delete_favorite_product/'+product;
          await fetch(url);  
          alert("Đã xóa khỏi mục yêu thích");
      }
    }
}

function addRating() {
  var i;
  let star = document.getElementById("rating-star");



  rate=parseInt(document.getElementById("rating-star-rate").innerHTML);

  console.log(rate)
  for (i = 0; i < rate; i++) {
    let object_tr = document.createElement("SPAN");
    object_tr.className = "fa fa-star checked";
    star.appendChild(object_tr);
  }

  for (i = rate; i < 5; i++) {
    let object_tr = document.createElement("SPAN");
    object_tr.className = "fa fa-star not-checked";
    star.appendChild(object_tr);
  }

  cost=document.getElementById("price");
  truecost=document.getElementById("true-cost");

  cost.innerHTML=addCommas(cost.innerHTML)
  truecost.innerHTML=addCommas(truecost.innerHTML)

}

function loadComment() {
  document.getElementById("view-ranking-rate").innerHTML = rate.toString();

  let star = document.getElementById("view-ranking-star-draw");
  for (i = 0; i < rate.toFixed(0); i++) {
    let object_tr = document.createElement("SPAN");
    object_tr.className = "fa fa-star checked size";
    star.appendChild(object_tr);
  }

  for (i = rate.toFixed(0); i < 5; i++) {
    let object_tr = document.createElement("SPAN");
    object_tr.className = "fa fa-star not-checked size";
    star.appendChild(object_tr);
  }

  document.getElementById("view-ranking-num-comment").innerHTML = "(" + num_rating + " nhận xét)";
}

function showBigImage(link) {
  let img = document.getElementById("img-modal");
  img.src = link;
  $('#modal').modal("show");
}

async function addProductToShoppingCart(link) {
  user=document.getElementById("user").innerHTML;
  product=document.getElementById("product").innerHTML;
  quantity=document.getElementById("soluong").value;
  //alert(quantity);
   if(user.length==14){
      alert('Bạn chưa đăng nhập')
    }else{
        url='http://localhost:3000/user/addProductToShoppingCart/'+product+'/'+quantity;
        await fetch(url);  
        alert("Thêm thành công vào giỏ hàng");
        window.location.replace("http://localhost:3000/user/shopping_cart");

    }

  
}

        

