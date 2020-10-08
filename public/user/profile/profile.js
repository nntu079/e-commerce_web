
//Lấy input từ HTML vào file này
function GetProfileInputs()
{
    var usr = document.getElementById("usernameLabel").innerHTML;

    var oldPass = document.getElementById("oldPassTxb").value;
    var fullname = document.getElementById("fullnameTxb").value;
    var oldFullName=document.getElementById("fullnameTxb").placeholder;

    var email = document.getElementById("emailTxb").value;
    var oldEmail=document.getElementById("emailTxb").placeholder;

    var phone = document.getElementById("phoneTxb").value;
    var oldPhone=document.getElementById("phoneTxb").placeholder;

    var newPass1 = document.getElementById("newPass1Txb").value;
    var newPass2 = document.getElementById("newPass2Txb").value;

    return {
        usr,
        oldPass,
        fullname,
        oldFullName,
        email,
        oldEmail,
        phone,
        oldPhone,
        newPass1,
        newPass2,
    }
}


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


//Kiểm tra tính đúng đắn của các đầu vào
function CheckInputs()
{
    var str = "";
    var ok = true;
    var inputs = GetProfileInputs();

    if (!IsTwoPasswordEqual(inputs.newPass1, inputs.newPass2)){
        str += "Hai mật khẩu không giống nhau\n";
        ok = false;
    }
    
    if (!IsPhoneNumberAcceptable(inputs.phone) && inputs.phone!= '' ){
       
        str += "Điện thoại không hợp lệ\n";
        ok = false;
    }
    if (!IsEmailAcceptable(inputs.email) && inputs.email!='' ){
        str += "Email không hợp lệ\n";
        ok = false;
    }

    if (!ok) {
        alert(str);
    }

    // window.location.href='/user/login';
    return ok;               
}

//Tạo 1 form ảo để gửi URL (vì route này là POST)
function SendProfileEditPostRequest(url, inputs)
{
    var usr = inputs.usr;

    var fullname = inputs.fullname;
    var oldFullName=inputs.oldFullName;

    if(fullname=='')
        fullname=oldFullName;
    
    var pass = inputs.oldPass;
 



    var phone = inputs.phone;
    var oldPhone=inputs.oldPhone;

        if(phone=='')
        phone=oldPhone;


    var email = inputs.email;
    var oldEmail=inputs.oldEmail;

      if(email=='')
        email=oldEmail;


    //const url = `/user/registerOK?a=${usr}&b=${pass}&c=${email}&d=${phone}`;
    var form = $(`<form action='${url}' method='post'>`);
    var inputUsr = $(`<input type='hidden' name='usr' value='${usr}'>`);
    var inputOldPass = $(`<input type='hidden' name='pass' value='${pass}'>`);

    var inputFullname = $(`<input type='hidden' name='fullname' value='${fullname}'>`);
    var inputEmail = $(`<input type='hidden' name='email' value='${email}'>`);
    var inputPhone = $(`<input type='hidden' name='phone' value='${phone}'>`);

    form.append(inputUsr, inputFullname, inputOldPass, inputEmail, inputPhone);

    //xét nếu như có sửa lại pass?
    if (inputs.newPass1 != '' && inputs.newPass2 != ''){
        var inputNewPass = $(`<input type='hidden' name='newPass' value='${inputs.newPass1}'>`);
        form.append(inputNewPass);
    }else{
        var inputNewPass = $(`<input type='hidden' name='newPass' value='${inputs.oldPass}'>`);
        form.append(inputNewPass);
    }

    $('body').append(form);
    alert("Hệ thống sẽ cập nhật lại thông tin và mở lại trang này cho bạn.");
    form.submit();
}

function OnConfirmButtonClick()
{
    var ok = CheckInputs();
    oldPass=document.getElementById("oldPassTxb").value;    
    if(oldPass==''){
        alert('Bạn chưa nhập mật khẩu cũ');
        ok=false;
    }
    if (ok){
        var inputs = GetProfileInputs();
        SendProfileEditPostRequest('/user/profile-editing', inputs);
    }
}