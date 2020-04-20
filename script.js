// import Axios from "axios";

let lastIndex = 0;
let dbURL = "http://127.0.0.1:9000/products";
var productList;

function saveToLocal(item, variable) {
    window.localStorage.setItem(item, JSON.stringify(variable));
}

function addProduct() {
    var createForm = document.getElementById("create-product");
    var formContent = `
                <p>Name</p>
                <input type="text" id="product-name" name="name"/><br>
                <p>price</p>
                <input type="number" id="product-price" name="price"/><br>
                <p>Category </p>
                <select id="product-category" name="categoryId">
					<option value="0">Sách Giáo Khoa</option>
					<option value="1">Sách Thiếu Nhi</option>
					<option value="2">Sách lịch sử</option>
					<option value="3">Sách Văn học</option>
					<option value="4">Sách Khoa Học</option>
					<option value="5">Sách Tham Khảo</option>
					<option value="6">Truyện Tranh</option>
					<option value="7">Sách phát triển kĩ năng sống</option>
					<option value="8">Technical</option>
				</select><br>
                <p>quantity</p>
				<input type="number" id="product-quantity" name = "quantity"/><br>
				<button id = "create-product-submit" onclick=storeProduct()>create </button>
			`;
    createForm.innerHTML = formContent;
}

function clearInputForm() {
    var onStored = ` <button id="add-prouct" onclick=addProduct()>
				Add Product
			</button>`;
    document.getElementById("create-product").innerHTML = onStored;
}
async function storeProduct() {
    let param = {
        id: new Number(),
        name: document.getElementById("product-name").value,
        price: parseInt(document.getElementById("product-price").value),
        categoryId: parseInt(document.getElementById("product-category").value),
        quantity: parseInt(document.getElementById("product-quantity").value),
    };
    // console.log(param);
    if ((param.name != "") & (param.price !== 0) & (param.quantity !== 0)) {
        param.id = ++lastIndex;
        await axios({
                method: "post",
                url: dbURL,
                data: param,
                responseType: "json",
            })
            .then((response) => console.log(response))
            .then(clearInputForm)
            .then(() => {
                itemGenarater(param);
                productList.push(param);
                saveToLocal("productList", productList);
            })
            .catch((err) => alert("Post ERR, try again", err));
    } else alert("data have not empty. Please try again!");
}
async function renderData() {
    productList = await axios
        .get(dbURL)
        .then((response) => (response.data))
        .catch((err) => console.error(err)); //ngủ dậy làm tiếp
    if (productList) {
        productList.map(product => {
            itemGenarater(product);
            if (lastIndex < product.id) lastIndex = product.id;
        });
        // console.log(productList);
    }
}
renderData();

function itemGenarater(data) {
    // console.log(data);
    var bodyList = document.getElementById('body-list')
    var item = document.createElement('tr');
    var itemId = document.createElement('td');
    var itemName = document.createElement('td');
    var itemPrice = document.createElement('td');
    var itemCategory = document.createElement('td');
    var itemQuantity = document.createElement('td');
    var itemFeature = document.createElement('td');
    item.id = 'item' + data.id;
    itemId.innerHTML = data.id;
    itemName.innerHTML = data.name;
    itemPrice.innerHTML = data.price;
    itemCategory.innerHTML = data.categoryId;
    itemQuantity.innerHTML = data.quantity;
    itemFeature.innerHTML = `<button id="edit-product" onclick=editProduct(${data.id})> edit </button> <button id="delete-product" onclick=deleteProduct(${data.id})>delete </button>`
    item.appendChild(itemId);
    item.appendChild(itemName);
    item.appendChild(itemPrice);
    item.appendChild(itemCategory);
    item.appendChild(itemQuantity);
    item.appendChild(itemFeature);
    bodyList.appendChild(item);
}

function editProduct(productId) {
    let selectedItem = 'item' + productId;
    let temp = productList.filter(product => product.id === productId);
    let localId = productList.indexOf(temp[0]);
    // console.log(localId);
    let onEditProduct = document.getElementById(selectedItem);
    let editForm = `<td>${productId}</td>
                <td> <input type = "text" id = "product-name" value = "${productList[localId].name}"/></td>
               <td> <input type = "number" id = "product-price" value = "${productList[localId].price}"/></td>
              <td>
                <select id = "product-category" value="${productList[localId].categoryId}">
					<option value="0">Sách Giáo Khoa</option>
					<option value="1">Sách Thiếu Nhi</option>
					<option value="2">Sách lịch sử</option>
					<option value="3">Sách Văn học</option>
					<option value="4">Sách Khoa Học</option>
					<option value="5">Sách Tham Khảo</option>
					<option value="6">Truyện Tranh</option>
					<option value="7">Sách phát triển kĩ năng sống</option>
					<option value="8">Technical</option>
				</select></td>
                <td>
				<input type = "number" id = "product-quantity" value = "${productList[localId].quantity}"/><td>
				<td><button id = "update-product" onclick=updateProduct(${productId})>update </button><td>
			`;
    onEditProduct.innerHTML = editForm;

}
async function updateProduct(productId) {
    let selectedItem = 'item' + productId;
    console.log(selectedItem);
    let temp = productList.filter(product => product.id === productId);
    let localId = productList.indexOf(temp[0]);
    let param = {
        id: productId,
        name: document.getElementById("product-name").value,
        price: parseInt(document.getElementById("product-price").value),
        categoryId: parseInt(document.getElementById("product-category").value),
        quantity: parseInt(document.getElementById("product-quantity").value),
    };
    let confirm = window.confirm(" Bạn muốn cập nhật dữ liệu mới chứ? Sau khi cập nhật  không thể phục hồi! (y/n)?")
    if (confirm) {

        if ((param.name != "") & (param.price !== 0) & (param.quantity !== 0)) {
            productList.splice(localId, 1, param);
            saveToLocal("productList", productList);
            document.getElementById(selectedItem).innerHTML = `<td>${productId}</td><td>${param.name}</td><td>${param.price}</td><td>${param.categoryId}</td><td>${param.quantity}</td><td><button id="edit-product" onclick=editProduct(${param.id})> edit </button> <button id="delete-product" onclick=deleteProduct(${param.id})>delete </button></td>`
            await axios({
                    method: "put",
                    url: dbURL + '/' + productId,
                    data: param,
                    responseType: "json",
                })
                .then((response) => console.log(response))
                .catch((err) => alert("PUT ERR, try again", err.status));
        } else alert("data have not empty. Please try again!");
    }

}
async function deleteProduct(productId) {
    let confirm = window.confirm("Bạn có thật sự muốn xoá dữ liệu này khỏi bảng?\n Lưu ý rằng sau khi xóa dữ liệu này không thể phục hồi");
    if (confirm === true) {
        let selectedItem = 'item' + productId;
        document.getElementById(selectedItem).remove();
        productList.splice(productId, 1);
        saveToLocal("productList", productList);
        await axios({
                method: 'delete',
                url: dbURL + '/' + productId
            }).then(response => console.log(response.status))
            .catch(err => console.error(err));
    }

}