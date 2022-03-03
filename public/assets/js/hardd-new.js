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
  a.download = id+".png"; //File name Here
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

let logo = '',
    nome = '',
    nomeTransformed = '';
    

$qrPapelDownload = {
  element: function(data){
    let target = document.querySelector(".preview-target");
        if(!target) return;
        target.insertAdjacentHTML("beforeend", `<section id="myme-preview" data-id="${data.id}">
        <article class="myme">
        <img src="${logo}" class="logo" ${(data.isPrefeitura ? `style="transform: rotate(
-90deg);"` : '')}/>
        <img src="${nome}" class="name"/>
          <div class="tst">
            <img src="/assets/img/v3/bottom/escaneie-alt.png"/>
            <div style="background-image: url(${data.qr}); ${(data.isPrefeitura ? `background-size: contain;` : '')}" class="qr"></div>
          </div>
        </article>
        <article class="myme">
          <img src="${logo}" class="logo" ${(data.isPrefeitura ? `style="transform: rotate(
-90deg);"` : '')}/>
          <img src="${nome}" class="name"/>
          <div class="tst">
            <img src="/assets/img/v3/bottom/escaneie-alt.png"/>
            <div style="background-image: url(${data.qr}); ${(data.isPrefeitura ? `background-size: contain;` : '')}" class="qr"></div>
          </div>
          
        </article>
        <article class="myme">
          <img src="${logo}" class="logo" ${(data.isPrefeitura ? `style="transform: rotate(
-90deg);"` : '')}/>
          <img src="${nome}" class="name"/>
          <div class="tst">
            <img src="/assets/img/v3/bottom/escaneie-alt.png"/>
            <div style="background-image: url(${data.qr}); ${(data.isPrefeitura ? `background-size: contain;` : '')}" class="qr"></div>
          </div>
          
        </article>
        <article class="myme">
          <img src="${logo}" class="logo" ${(data.isPrefeitura ? `style="transform: rotate(
-90deg);"` : '')}/>
          <img src="${nome}" class="name"/>
          <div class="tst">
            <img src="/assets/img/v3/bottom/escaneie-alt.png"/>
            <div style="background-image: url(${data.qr}); ${(data.isPrefeitura ? `background-size: contain;` : '')}" class="qr"></div>
          </div>
          
        </article>
        <article class="myme">
          <img src="${logo}" class="logo" ${(data.isPrefeitura ? `style="transform: rotate(
-90deg);"` : '')}/>
          <img src="${nome}" class="name"/>
          <div class="tst">
            <img src="/assets/img/v3/bottom/escaneie-alt.png"/>
            <div style="background-image: url(${data.qr}); ${(data.isPrefeitura ? `background-size: contain;` : '')}" class="qr"></div>
          </div>
          
        </article>
        <article class="myme">
          <img src="${logo}" class="logo" ${(data.isPrefeitura ? `style="transform: rotate(
-90deg);"` : '')}/>
          <img src="${nome}" class="name"/>
          <div class="tst">
            <img src="/assets/img/v3/bottom/escaneie-alt.png"/>
            <div style="background-image: url(${data.qr}); ${(data.isPrefeitura ? `background-size: contain;` : '')}" class="qr"></div>
          </div>
          
        </article>
        <article class="myme">
          <img src="${logo}" class="logo" ${(data.isPrefeitura ? `style="transform: rotate(
-90deg);"` : '')}/>
          <img src="${nome}" class="name"/>
          <div class="tst">
            <img src="/assets/img/v3/bottom/escaneie-alt.png"/>
            <div style="background-image: url(${data.qr}); ${(data.isPrefeitura ? `background-size: contain;` : '')}" class="qr"></div>
          </div>
          
        </article>
        <article class="myme">
          <img src="${logo}" class="logo" ${(data.isPrefeitura ? `style="transform: rotate(
-90deg);"` : '')}/>
          <img src="${nome}" class="name"/>
          <div class="tst">
            <img src="/assets/img/v3/bottom/escaneie-alt.png"/>
            <div style="background-image: url(${data.qr}); ${(data.isPrefeitura ? `background-size: contain;` : '')}" class="qr"></div>
          </div>
          
        </article>
        <article class="serial">
          <p class="serial">SERIAL:</p>
          <p class="number">${data.id}</p>
          <p class="name"><img src="${nomeTransformed}" class="name"/></p>
        </article>
        <article class="myme">
          <img src="${logo}" class="logo" ${(data.isPrefeitura ? `style="transform: rotate(
-90deg);"` : '')}/>
          <img src="${nome}" class="name"/>
          <div class="tst">
            <img src="/assets/img/v3/bottom/escaneie-alt.png"/>
            <div style="background-image: url(${data.qr}); ${(data.isPrefeitura ? `background-size: contain;` : '')}" class="qr"></div>
          </div>
          
        </article>
        <article class="myme">
          <img src="${logo}" class="logo" ${(data.isPrefeitura ? `style="transform: rotate(
-90deg);"` : '')}/>
          <img src="${nome}" class="name"/>
          <div class="tst">
            <img src="/assets/img/v3/bottom/escaneie-alt.png"/>
            <div style="background-image: url(${data.qr}); ${(data.isPrefeitura ? `background-size: contain;` : '')}" class="qr"></div>
          </div>
          
        </article>
        <article class="myme">
          <img src="${logo}" class="logo" ${(data.isPrefeitura ? `style="transform: rotate(
-90deg);"` : '')}/>
          <img src="${nome}" class="name"/>
          <div class="tst">
            <img src="/assets/img/v3/bottom/escaneie-alt.png"/>
            <div style="background-image: url(${data.qr}); ${(data.isPrefeitura ? `background-size: contain;` : '')}" class="qr"></div>
          </div>
          
        </article>
  </section>`)

  html2canvas(document.querySelector(`#myme-preview[data-id='${data.id}']`), {
      letterRendering: 1, 
      allowTaint : true,
      useCORS:true,
      backgroundColor: 'rgba(0, 0, 0, 0)', 
      removeContainer: true,
  }).then(canvas => {
     $(".preview-target").css("opacity", "1");
      // document.body.appendChild(canvas)
      var a = document.createElement('a');
      // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
      a.href = canvas.toDataURL("image/png");
      a.download = data.id+'.png';
      a.click();
      a.remove();
      canvas.remove();
  });
  
    // setTimeout(() => {
    //   let i = document.querySelector(`#myme-preview[data-id='${data.id}']`);
    //       if(!i) return;
    //       i.remove();
    // }, 500)
  },
  init: function(data){
    if(data.isPrefeitura){
      logo = data.prefeitura.split("-id-")[0];
      nome = 'modelos/prefeitura/logo.png';
      nomeTransformed = 'modelos/prefeitura/logo_token.png';
      this.element(data);
    }else{
      let modo = data.modo;
      if(modo === "bottom"){
        downloadMymeBottom(data.id, data.qr, data.logo.split("-id-")[0])
      }else{
        logo = 'modelos/default/logo_hardd_old.png';
        nome = 'modelos/default/logo.png';
        nomeTransformed = 'modelos/default/logo_token.png';
        this.element(data);
      }
    }
    
  }
}