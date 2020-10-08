
//#region helper

//Kiểm tra 2 kết quả nhập password có trùng nhau không?
function IsTwoPasswordEqual(pass1, pass2){
    if (pass1 == pass2){
        return true;
    } else {
        return false;
    }       
}


//Kiểm tra xem số điện thoại có bao gồm ký tự lạ không?
function IsPhoneNumberAcceptable(phone){
    return /^\d+$/.test(phone);                 //regular expression
}

//Kiểm tra xem email có dấu @ không
function IsEmailAcceptable(email){
    return /@/.test(email);                     //regular expression
}

//#endregion

//Lấy data từ input về
function GetRegisterInputs(){
    var username = document.getElementById("usernameTxb").value;
    var password = document.getElementById("passwordTxb").value;
    var password2 = document.getElementById("password2Txb").value;
    var phone = document.getElementById("phoneTxb").value;
    var email = document.getElementById("emailTxb").value;

    var obj = {
        username, password, password2, phone, email
    };
    return obj;
}

//Kiểm tra tính hợp lệ của các input
//Nếu hợp lệ thì mới gửi qua bên controller
function CheckTheInputs(){

    // password = document.getElementById("passwordTxb").value;
    // password2 = document.getElementById("password2Txb").value;

    var str = "";
    var ok = true;
    var inputs = GetRegisterInputs();
    if(inputs.username==''){
        ok=false;
        str+='Tài khoản không được trống';
    }
    if (!IsTwoPasswordEqual(inputs.password, inputs.password2)){
        str += "Hai mật khẩu không giống nhau\n";
        ok = false;
    }
    if (!IsPhoneNumberAcceptable(inputs.phone)){
        str += "Điện thoại không hợp lệ\n";
        ok = false;
    }
    if (!IsEmailAcceptable(inputs.email)){
        str += "Email không hợp lệ\n";
        ok = false;
    }

    if (!ok) {
        alert(str);
    }

    // window.location.href='/user/login';
    return ok;               
}

// function RegisterToDatabase(inputs)
// {
//     var usr = inputs.username;
//     var pass = inputs.password;
//     var phone = inputs.phone;
//     var email = inputs.email;

//     const url = `/user/registerOK?a=${usr}&b=${pass}&c=${email}&d=${phone}`;

//     window.location.href = url;
// }

function OnSubmitButtonClick()
{
    var ok = CheckTheInputs();
    if (ok) {
        var inputs = GetRegisterInputs();
        
        SendPostRequest('/user/registering', inputs);
    }
}

function SendPostRequest(url, inputs)
{
    var usr = inputs.username;
    var pass = inputs.password;
    var phone = inputs.phone;
    var email = inputs.email;

    //const url = `/user/registerOK?a=${usr}&b=${pass}&c=${email}&d=${phone}`;
    var form = $(`<form action='${url}' method='post'>`);
    var inputUsr = $(`<input type='hidden' name='usr' value='${usr}'>`);
    var inputOldPass = $(`<input type='hidden' name='pass' value='${pass}'>`);
    var inputEmail = $(`<input type='hidden' name='email' value='${email}'>`);
    var inputPhone = $(`<input type='hidden' name='phone' value='${phone}'>`);

    form.append(inputUsr, inputOldPass, inputEmail, inputPhone);
    $('body').append(form);
    alert("Cảm ơn bạn nhé! <3 Hệ thống sẽ tự động đăng nhập cho bạn trong giây lát.");
    form.submit();
}