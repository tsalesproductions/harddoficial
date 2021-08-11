function copyToClipBoard(data){
    let input = document.createElement("textarea");
        input.value = data;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();

    alertFire("success", "Copiado para a àrea de transferência");
}

function alertFire(type, text){
  Swal.fire({
    position: 'top-end',
    icon: type,
    text: text,
    showConfirmButton: false,
    timer: 1500
  })
}

function download64(data, id){
  var a = document.createElement("a"); //Create <a>
  a.href = data; //Image Base64 Goes here
  a.download = "qr_"+id+".png"; //File name Here
  a.click(); //Downloaded file
}

let request = {
  get: async function(method, url, data){
    let response =  await fetch(url, {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return await response.json();
  },

  triggerReset: async function(id, e){
    e.preventDefault()
    try{
      let response = await this.get("POST", "qrcode/resetar", {id: id});
          response = response[0];
      switch(response.status){
        case "success":
          alertFire(response.status, response.msg);
          let target = e.target.parentElement.parentElement.parentElement.querySelector(".bg-gradient-danger");
              target.classList.remove("bg-gradient-danger");
              target.classList.add("bg-gradient-success");
        break;

        default: 
          alertFire(response.status, response.msg);
        break;
      }
    }catch(e){
      console.log(e)
    }
  }


}