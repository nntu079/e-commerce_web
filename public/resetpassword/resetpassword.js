async function sendInfor(){

	username=document.getElementById('username').value;

	if(username.length==0){
		alert('Ban can nhap username')
	}
	else{
		url='http://localhost:3000/user/reset_passwordAPI/'+username;
	    await fetch(url);  
	    alert("Gửi mã thành công");

	    $('#myModal').modal('show'); 
	}
}


async function sendInfor2(){

              
              username=document.getElementById('username').value;
              newPassword=document.getElementById('newpass858').value;
              code=document.getElementById('code858').value;

                url='http://localhost:3000/user/reset_passwordAPI2/'+username+'/'+code+'/'+newPassword;


                fetch(url)
                  .then(
                    function(response) {
                      if (response.status !== 200) {
                        	alert('Server error')
                      }
                      // parse response data
                      response.json().then(data => {
                      	//alert(data)

                      	if(data=='1'){
                      		alert('Thay doi thanh cong');
                      		 window.location.replace("http://localhost:3000/user/login");
                      	}
                      	else{
                      		alert('Sai code');
                      	}
                      })
                    }
                  )
                  .catch(err => {
                    console.log('Error :-S', err)
                  });
        }