const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

function newAlert(type, text, redirect = false){
    Swal.fire({
      position: 'top-end',
      icon: type,
      text: text,
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
        if(!redirect) return;
        location.href = location.origin+location.pathname
    })
  }

if(urlParams.get('deleted')){
    newAlert('success', 'Operário deletado com sucesso', true)
}