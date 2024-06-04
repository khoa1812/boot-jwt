let us = docLocalStorage();
if (us == null) {
    window.location.href = "../login/login.html";
}
let token = us.token;

function docLocalStorage() {
    let userString = localStorage.getItem("u");
    let user = JSON.parse(userString);
    return user;
}

function addNewCustomer(event) {
    event.preventDefault(); // Chặn sự kiện mặc định của thẻ

    let name = $('#name').val();
    let age = $('#age').val();
    let gender = $('#gender').val();
    let address = $('#address').val();
    let newCustomer = {
        name: name,
        age: age,
        gender: gender,
        address: address
    };

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
        },
        type: "POST",
        data: JSON.stringify(newCustomer),
        url: "http://localhost:8080/api/customers",
        success: function() {
            successHandler();
            displayFormCreate(); // Hide the form after successful addition
        }
    });
}

function successHandler() {
    $.ajax({
        headers: {
            "Authorization": "Bearer " + token
        },
        method: "GET",
        url: "http://localhost:8080/api/customers/",
        success: function (data) {
            let content = '<table id="display-list" border="1"><tr>' +
                '<th>Tên</th>' +
                '<th>Tuổi</th>' +
                '<th>Giới Tính</th>' +
                '<th>Địa chỉ</th>' +
                '<th>Xóa</th>' +
                '<th>Sửa</th>' +
                '</tr>';
            for (let i = 0; i < data.length; i++) {
                content += getCustomer(data[i]);
            }
            content += "</table>";
            document.getElementById('customerList').innerHTML = content;
            hideForms();
        }
    });
}

function displayFormCreate() {
    document.getElementById('customerList').style.display = "none";
    document.getElementById('add-customer').style.display = "block";
    document.getElementById('update-customer').style.display = "none";
    document.getElementById('display-create').style.display = "none";
    document.getElementById('title').style.display = "none";
}

let currentUpdateId = null;

function showUpdateForm(customer) {
    $('#update-name').val(customer.name);
    $('#update-age').val(customer.age);
    $('#update-gender').val(customer.gender);
    $('#update-address').val(customer.address);
    currentUpdateId = customer.id;

    document.getElementById('customerList').style.display = "none";
    document.getElementById('add-customer').style.display = "none";
    document.getElementById('update-customer').style.display = "block";
    document.getElementById('display-create').style.display = "none";
    document.getElementById('title').style.display = "none";
}

function updateCustomer(event) {
    event.preventDefault(); // Chặn sự kiện mặc định của thẻ
    let name = $('#update-name').val();
    let age = $('#update-age').val();
    let gender = $('#update-gender').val();
    let address = $('#update-address').val();
    let updateCustomer = {
        name: name,
        age: age,
        gender: gender,
        address: address
    };

    $.ajax({
        headers: {
            "Authorization": "Bearer " + token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "PUT",
        data: JSON.stringify(updateCustomer),
        url: `http://localhost:8080/api/customers/${currentUpdateId}`,
        success: function() {
            successHandler();
            hideForms(); // Hide the form after successful update
        }
    });
}

function getCustomer(customer) {
    return `<tr><td>${customer.name}</td><td>${customer.age}</td><td>${customer.gender}</td><td>${customer.address}</td>` +
        `<td class="btn"><button class="deleteCustomer" onclick="deleteCustomer(${customer.id})">Xóa</button></td>` +
        `<td class="btn"><button class="editCustomer" onclick='showUpdateForm(${JSON.stringify(customer)})'>Sửa</button></td></tr>`;
}

function deleteCustomer(id) {
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
        },
        type: "DELETE",
        url: `http://localhost:8080/api/customers/${id}`,
        success: successHandler
    });
}

function hideForms() {
    document.getElementById('add-customer').style.display = "none";
    document.getElementById('update-customer').style.display = "none";
    document.getElementById('customerList').style.display = "block";
    document.getElementById('display-create').style.display = "block";
    document.getElementById('title').style.display = "block";
}

$(document).ready(function() {
    $('#add-customer').on('submit', addNewCustomer);
    $('#update-customer').on('submit', updateCustomer);
    successHandler();
});