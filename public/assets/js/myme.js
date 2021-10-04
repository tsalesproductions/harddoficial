const formManager = {
    dataInputs: {
        eu: {
            foto: null,
            anexo: null,
        },
        meus: [],
        anexo: null
    },
    myme: document.querySelector("main.myme"),
    q: function(data){
        return document.querySelector(data);
    },
    qall: function(data){
        return document.querySelectorAll(data);
    },
    formSend: function(data, target){
        let self = this;

        $.ajax({
          url: 'https://api.imgbb.com/1/upload?expiration=600&key=dcec30faf072f6e164b080901e58e621',
          type: 'post',
          data: data,
          contentType: false,
          processData: false,
          beforeSend: function(){
              $("body").prepend(`<div class="loading-upload" style="position: fixed;top: 0;left: 0;padding: 20px;width: 100%;height: 100vh;background-color: rgba(0,0,0,.9);z-index: 999; display: flex; flex-direction: column; align-items: center;justify-content: center;"><div class="spinner-border" style="width: 5rem;height: 5rem; color: #fff" role="status"><span class="visually-hidden"></span></div> <span style="color: #fff; font-size: 20px; margin-top: 10px;">Enviando dados, não atualize a página...</span></div>`);
          },
          success: function(response){
              $(".loading-upload").remove();
            if(response.success){
                switch(target.type){
                    case "eu-foto":
                        self.dataInputs.eu.foto = response.data.display_url;
                    break;

                    case "eu-anexo":
                        self.dataInputs.eu.anexo = response.data.display_url;
                    break;

                    case "meu-foto":
                        // self.dataInputs.meu = ;
                        // MUDAR MEU
                    break;

                    
                }

                $("#data-upload").val(JSON.stringify(self.dataInputs))

                target.img.src = response.data.display_url;
            }else{
                alert("houve um erro ao enviar, entre em contato com o administrador")
            }
          },
        });
    },
    upload: async function(data, target){
        if(data.length <= 0) return;
        let fd = new FormData();
        switch(data[0].type){
            case "image/jpeg":
                fd.append('image',data[0]);
                    this.formSend(fd, target)
                break;
                
                case "image/png":
                    fd.append('image',data[0]);
                    this.formSend(fd, target)
                break;

                case "application/pdf":
                    fd.append('image',data[0]);
                    this.formSend(fd, target)
                break;
                
                default:
                    alert("Envie imagens apenas nos formatos jpeg e png");
                break;
        }
    },
    triggetImages: function(){
        let self = this,
            inputUpload = document.querySelector("#upload"),
            tg = null;

        let field_me_foto = this.q("#field_me_foto"),
            field_me_input = this.q("#field_eu_foto2"),
            field_my_foto = this.q("#field_my_foto"),
            field_my_input = this.q("#field_meu_foto2");

            if(!field_me_foto.getAttribute("data-has")){
                field_me_foto.src = "../assets/img/eu-default.svg"
                field_me_foto.style.border = "2px solid #E6E6E6"
            }

            if(!field_my_foto.getAttribute("data-has")){
                field_my_foto.src = "../assets/img/meu-default.svg"
                field_my_foto.style.border = "2px solid #E6E6E6"
                field_my_foto.style.borderRadius = "50%"
            }

        $("input[type='file']").change(function(e){
            let attr = e.target.parentElement.getAttribute('data-type');
            self.upload(e.target.files, {type: attr, img: e.target.parentElement.children[0]})
        });

        $(".disponivel .without").click((e) => {
            let target = null;

            if(e.target.tagName == "DIV"){
                target = e.target;
            }else if(e.target.tagName == "IMG"){
                target = e.target.parentElement;
            }else{
                target = e.currentTarget;
            }
            
            target.children[1].click()
        });

            // field_me_input.addEventListener("change", function(es){
            //     if (es.target.files && es.target.files[0]) {
            //         var reader = new FileReader();
            //         reader.onload = function (e) {
            //             field_me_foto.src =  e.target.result;
            //         }
            //         reader.readAsDataURL(es.target.files[0]);
            //     }
            // });

            // field_my_foto.addEventListener("click", function(){
            //     field_my_input.click();
            // });

            // field_my_input.addEventListener("change", function(es){
            //     if (es.target.files && es.target.files[0]) {
            //         var reader = new FileReader();
            //         reader.onload = function (e) {
            //             field_my_foto.src =  e.target.result;
            //         }
            //         reader.readAsDataURL(es.target.files[0]);
            //     }
            // });
    },
    termsValidate: function(){
        if(this.q(".usado")) return;
        let terms = this.q("#field_terms"),
            submit = this.q("button[type='submit']");

            terms.addEventListener("change", function(e){
                let fields = {
                    my: document.querySelector("#field_eu_foto2").value,
                    me: document.querySelector("#field_meu_foto2").value,
                    my_foto: document.querySelector("#field_me_foto").getAttribute('data-has'),
                    me_foto: document.querySelector("#field_my_foto").getAttribute('data-has'),
                    error: document.querySelector(".error")
                }

                if(fields.my == ''){
                    if(!document.querySelector("#field_me_foto").getAttribute('data-has')){
                        fields.my_foto = undefined;
                    }else{
                        fields.my_foto = document.querySelector("#field_me_foto").getAttribute('data-has');
                    }
                }else{
                    fields.my_foto = fields.my
                }

                if(fields.me == ''){
                    if(!document.querySelector("#field_my_foto").getAttribute('data-has')){
                        fields.me_foto = undefined;
                    }else{
                        fields.me_foto = document.querySelector("#field_my_foto").getAttribute('data-has');
                    }
                }else{
                    fields.me_foto = fields.me
                }

                if(e.target.checked && fields.me_foto && fields.my_foto){
                    submit.disabled = false;

                    fields.error.style.display = "none";
                    fields.error.innerText = "";

                    submit.addEventListener("click", function(e){
                        // e.target.children[0].style.display = "inline-block";
                        e.target.innerHTML = `<div class="spinner-border" style="width: 1.3rem;height: 1.3rem; display: inline-block;" role="status"><span class="visually-hidden"></span></div> SALVANDO...`;
                    });
                }else{
                    if(!fields.me_foto || !fields.my_foto){
                        fields.error.style.display = "block";
                        fields.error.innerText = "Ops... você esqueceu de inserir as imagens. Por favor, revise os campos de fotos.";
                    }
                    
                    terms.checked = false;

                    submit.disabled = true;
                    submit.removeEventListener('click', myFunction, false);
                }
            });
    },
    disableAllInputs: function(){
        if(!this.q(".usado")) return;
        let inputs = this.qall("input:not(.form),textarea,select");
        console.log(inputs)
        inputs.forEach(function(item){
            item.readOnly = true;
        })
    },
    checkIfEnabled: function(){
        if(this.myme.classList.contains("usado")){
            if(document.querySelector(".edit")){
                document.querySelector(".edit").remove();
            }
        }else{
            document.querySelector(".help").remove();
            this.triggetImages();
        }
    },
    contactValidate: function(){
        let list = document.querySelectorAll(".field-contato input[readonly]");
            list.forEach(function(item){
                item.style.cursor = "pointer";
                item.addEventListener("click", function(e){
                    let tel = item.value.replace("-","").replace("(", "").replace(")", "").replace(/\s/g, '');

                    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                    if (isIOS) {
                        window.open(`tel:${tel}`);
                    } else {
                        let ta = document.createElement("a");
                        ta.href = `tel:+55${tel}`;
                        ta.classList.add("tel-button");
                        document.body.append(ta);
                        let taa = document.querySelector(".tel-button");
                        taa.click();
                        setTimeout(() => taa.remove(), 1000);
                    }
                    
                })
            });

        let help = document.querySelectorAll(".help li");
            help.forEach(function(item){
                item.style.cursor = "pointer";
                item.addEventListener("click", function(e){
                    let input = null;
                    switch(e.target.tagName){
                        case "LI":
                            input = e.target;
                        break;
                        case "SPAN":
                            input = e.target.parentElement;
                        break;
                    }
                    
                    let tel = input.children[0].innerText;
                    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                    if (isIOS) {
                        window.open(`tel:${tel}`);
                    } else {
                        let ta = document.createElement("a");
                        ta.href = `tel:+55${tel}`;
                        ta.classList.add("tel-button");
                        document.body.append(ta);
                        let taa = document.querySelector(".tel-button");
                        taa.click();
                        setTimeout(() => taa.remove(), 1000);
                    }
                });
            });

        
    },
    init: function(){
        this.checkIfEnabled();
        this.termsValidate();
        this.disableAllInputs();
        this.contactValidate();
    }
}

window.addEventListener("load", formManager.init())