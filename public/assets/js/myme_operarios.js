$obj = {
	eu_nome: $("input[name='field_eu_nome']").val(),
	eu_emergencia_telefone: function(){
		function escapeRegExp(string) {
		  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
		}
		
		function replaceAll(str, find, replace) {
			  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
			}
			
		let phone = $(".my .emergencia-form .field-contato input").val();
		if(phone){
			replaceAll(phone, " ", "")
			replaceAll(phone, "-", "")
			replaceAll(phone, ")", "")
			replaceAll(phone, "(", "")
			replaceAll(phone, ".", "")
		}
		return phone;
	}
}

const formManager = {
    api: {
        files: 'https://files.hardd.com.br/uploads/',
        uploads: 'https://files.hardd.com.br/lib/upload.php'
    },
    dataInputs: {
        eu: {
            foto: null,
            anexo: null,
        }
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
          url: self.api.uploads,
          type: 'post',
          data: data,
          dataType: 'json',
          contentType: false,
          processData: false,
          xhr: function() {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    if(percentComplete < 1){
                        if(target.type == "eu-foto"){
                            if(!$(target.img).hasClass("circle")){
                                $(target.img).addClass("circle");
                            }
                        }
                        NProgress.set(percentComplete);
                    }else{
                        NProgress.set(1.0);
                        $(target.img).removeClass("circle");
                    }
                }
            }, false);
            return xhr;
            },
          beforeSend: function(){
              $("body").prepend(`<div class="loading-upload" style="position: fixed;top: 0;left: 0;padding: 20px;width: 100%;height: 100vh;background-color: rgba(0,0,0,.9);z-index: 999; display: flex; flex-direction: column; align-items: center;justify-content: center;text-align: center;"><div class="spinner-border" style="width: 5rem;height: 5rem; color: #fff" role="status"><span class="visually-hidden"></span></div> <span style="color: #fff; font-size: 20px; margin-top: 10px;">Enviando dados, não atualize a página...</span></div>`);
              setTimeout(() => {
                $(".loading-upload").remove();
              }, 2000)
          },
          success: function(response){
              $(".loading-upload").remove();
              console.log(response)
            if(response.status){
                switch(target.type){
                    case "eu-foto":
                        self.dataInputs.eu.foto = self.api.files+response.file;
                    break;
                }

                $("#data-upload").val(JSON.stringify(self.dataInputs))

                target.img.src = self.api.files+response.file;
            }else{
                alert(response.msg)
            }
          },
        }).fail(function() {
            $(".loading-upload").remove();
            alert( "Houve um erro ao enviar a imagem, por favor, entre em contato com o suporte hardd imediatamente!!" );
        })
    },
    badgeClick: function(){
        if(this.q(".indisponivel")){
            $(".badgee").remove();
        }

        $(".badgee").click(({target}) => {
            $(target).closest(".badgee").remove();
        })
    },
    upload: async function(data, target){
        if(data.length <= 0) return;
        let fd = new FormData();
        switch(data[0].type){
            case "image/jpeg":
                fd.append('upload',data[0]);
                    this.formSend(fd, target)
                break;

                case "image/png":
                    fd.append('upload',data[0]);
                    this.formSend(fd, target)
                break;

                default:
                    alert("Envie imagens apenas nos formatos jpeg e png");
                break;
        }
    },
    disableAllInputs: function(){
        if(this.q(".disponivel")) return;
        let inputs = this.qall("input:not(.form),textarea,select");
        inputs.forEach(function(item){
            item.readOnly = true;
        })
    },
    contactValidate: function(){
        let list = document.querySelectorAll(".field-contato input[readonly]");
            list.forEach(function(item){
                item.style.cursor = "pointer";
                item.addEventListener("click", function(e){
                    let tel = item.value.replace("-","").replace("(", "").replace(")", "").replace(/\s/g, '');
                    if(tel === '') return;

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

        let help = document.querySelectorAll(".help .items img");
            help.forEach(function(item){
                item.style.cursor = "pointer";
                item.addEventListener("click", function(e){

                    let tel = e.target.getAttribute("data-emergencia");
                    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

                    if(tel === '') return;

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
    checkIfEnabled: function(){
        if(this.myme.classList.contains("indisponivel")){
            if(document.querySelector(".edit")){
                document.querySelector(".edit")?.remove();
                document.querySelector(".add-more")?.remove();
                this.susTrigger();
            }
        }else{
            document.querySelector(".help")?.remove();
            this.susTrigger();
            this.checkifHasMe();
        }
    },
    checkifHasMe: function(){
        let self = this;

        function me(){
            let me = document.querySelector(".my");

            let foto = (me.querySelector('[data-eu-foto]') ? me.querySelector('[data-eu-foto]').getAttribute('data-eu-foto') : ''),
                anexo = (me.querySelector('[data-meu-anexo]') ? me.querySelector('[data-meu-anexo]').getAttribute('data-meu-anexo') : '')

                self.dataInputs.eu.foto = foto;
                self.dataInputs.eu.anexo = anexo;
        }

        me();
    },
    susTrigger: function(){
        $("#susTrigger").unbind("click");

        document.querySelectorAll("#susTrigger").forEach((item) => {
            $(item).unbind("click");
            $(item).click(({target}) => {
                target = $(target).closest("div.meu, div.my")[0];

               $("#sus-nome").text("NOME: "+$(target).find('.field-nome input').val());
               $("#sus-nascimento").text("NASCIMENTO: "+$(target).find('.field-nascimento input').val())
               $("#sus-sexo").text('SEXO: -')
               $("#sus-numero").text("Nº: "+$(target).find('.field-sus-numero input').val())

               $("#susCard").modal("show");
            })
        })

    },
    triggetInputs: function(){
        let self = this;

        $(".disponivel .without").unbind("click");
        $("input[type='file']").unbind("change");
        $(".meus .meu input[type='text'],.meus .meu input[type='text']").unbind("change");
        $(".disponivel .without").click((e) => {
            let target = null;

            if(e.target.tagName == "DIV"){
                target = e.target;
            }else if(e.target.tagName == "IMG"){
                target = e.target.parentElement;
            }else{
                target = e.currentTarget;
            }

            target = $(target).closest('div[data-type]')[0]

            target.querySelector("input").click()
        })

        $("input[type='file']").change(function(e){
            let attr = e.target.parentElement.getAttribute('data-type');
            self.upload(e.target.files, {type: attr, img: e.target.parentElement.children[0]})
            let file = URL.createObjectURL(e.target.files[0]);
            let target = e.target.parentElement.children[0];
            switch(attr){
            case "eu-foto":
                target.src = file;
                self.dataInputs.eu.foto = '';
            break;
        }
        });
    },
    termsValidate: function(){
        if(this.q(".usado")) return;
        let terms = this.q("#field_terms"),
            submit = this.q("button[type='submit']"),
            self = this;

            if(!terms) return;
            terms.addEventListener("change", function(e){
                let fields = {
                    eu: (self.dataInputs.eu.foto ? true : false),
                    error: document.querySelector(".error"),
                }

                if(e.target.checked && fields.eu){
                    submit.disabled = false;

                    fields.error.style.display = "none";
                    fields.error.innerText = "";

                    submit.addEventListener("click", function(e){
                        let required = Array.from(document.querySelectorAll("input[required]")).filter(f => !f.value);
                        if(required.length > 0) return;
                        $("input[name='qr_meus']").val(JSON.stringify(self.dataInputs))
                        // e.target.children[0].style.display = "inline-block";
                        e.target.innerHTML = `<div class="spinner-border" style="width: 1.3rem;height: 1.3rem; display: inline-block;" role="status"><span class="visually-hidden"></span></div> SALVANDO...`;
                    });
                }else{
                    if(!fields.eu){
                        fields.error.style.display = "block";
                        fields.error.innerText = "Ops... você esqueceu de inserir as imagens. Por favor, revise os campos de fotos.";
                    }

                    terms.checked = false;

                    submit.disabled = true;
                    $(submit).unbind("click");
                }
            });
    },
    qualificacoes: function(){
        function checkboxToggle(){
            $(".qualificacoes li input[type=checkbox]").click(({target}) => {
                $(target).closest("li").find("input[type=text]").toggle();
            })  
        }

        function submitSave(){
            $("button[type=submit]").click(() => {
                let objs = [];

                let selecteds = document.querySelectorAll(".qualificacoes li input[type=checkbox]:checked");
                    if(selecteds.length > 0){
                        for(let selected of selecteds){
                            objs.push({
                                id: $(selected).closest("li").attr("data-id"),
                                date: $(selected).closest("li").find('input[type=text]').val(),
                                checked: selected.checked
                            })
                        }

                        $("input[name=field_qualificacoes]").val(JSON.stringify(objs))
                    }
            })
        }

        checkboxToggle(),submitSave()
    },
    init: function(){
        this.checkIfEnabled();
        this.termsValidate();
        this.disableAllInputs();
        this.contactValidate();
        this.badgeClick();
        this.triggetInputs();
        this.qualificacoes();
        this.dataInputs.eu.foto = "salve";
    }
}

window.addEventListener("load", formManager.init())
