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
        let phoneb = $(".my .emergencia-form .field-contato.b input").val();
		if(phone){
			replaceAll(phone, " ", "")
			replaceAll(phone, "-", "")
			replaceAll(phone, ")", "")
			replaceAll(phone, "(", "")
			replaceAll(phone, ".", "")

            replaceAll(phoneb, " ", "")
			replaceAll(phoneb, "-", "")
			replaceAll(phoneb, ")", "")
			replaceAll(phoneb, "(", "")
			replaceAll(phoneb, ".", "")
		}
		return [phone,phoneb];
	}
}

$scLocation = {
	userLocate: null,
    latitude: null,
    longitude: null,
	getLocate: async function(){
		let response = await $.getJSON('https://ipinfo.io/json?token=acdeecdad53194');
		this.userLocate = response;
	},
	init: async function(){
        let self = this;

        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(showPosition,showError);
        }else{
            alert("Seu browser não suporta Geolocalização.");
        }
        async function showPosition(position){
            //position.coords.latitude
            //position.coords.longitude
            
        
            await self.getLocate();
            if($obj.eu_emergencia_telefone()){
                let phone = $obj.eu_emergencia_telefone();
                if(!document.body.classList.contains("usado")) return;
                let response = await $.ajax({
                    type: "GET",
                    url: 'https://mmwp.hardd.com.br/send/hardd?phone=55'+phone[0]+`&text=O MYME de ${$obj.eu_nome} acaba de ser lido em *${self.userLocate.city}* com as coordenadas *${position.coords.latitude},${position.coords.longitude}*. Localização: https://www.google.com.br/maps/place/${position.coords.latitude},${position.coords.longitude}`,
                });

                $.ajax({
                    type: "GET",
                    url: 'https://mmwp.hardd.com.br/send/hardd?phone=55'+phone[1]+`&text=O MYME de ${$obj.eu_nome} acaba de ser lido em *${self.userLocate.city}* com as coordenadas *${position.coords.latitude},${position.coords.longitude}*. Localização: https://www.google.com.br/maps/place/${position.coords.latitude},${position.coords.longitude}`,
                });
            }
        }
          
        function showError(error){
            switch(error.code){
                case error.PERMISSION_DENIED:
                    alert("Usuário rejeitou a solicitação de Geolocalização.")
                break;
                case error.POSITION_UNAVAILABLE:
                    alert("Localização indisponível.")
                break;
                case error.TIMEOUT:
                    alert("A requisição expirou.")
                break;
                case error.UNKNOWN_ERROR:
                    alert("Algum erro desconhecido aconteceu.")
                break;
            }
        }
	}
}

$scLocation.init();

const formManager = {
    api: {
        files: 'https://files.hardd.com.br/uploads/',
        uploads: 'https://files.hardd.com.br/lib/upload.php'
    },
    dataInputs: {
        eu: {
            foto: null,
            anexo: null,
        },
        meus: []
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
                        if(target.type == "eu-foto" || target.type === "meu-foto"){
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

                    case "eu-anexo":
                        self.dataInputs.eu.anexo = self.api.files+response.file;
                    break;

                    default:
                        let t = target.img.parentElement.parentElement.parentElement;
                        if(!t.getAttribute('data-id')) return;
                        let meu = self.findMy(t.getAttribute('data-id'));
                        switch(target.type){
                            case "meu-anexo":
                                meu['meu_anexo'] =  self.api.files+response.file;
                                $(t).find(".has").show();
                                $(t).find(".not").hide();
                            break;

                            case "meu-foto":
                                meu['meu_foto'] = self.api.files+response.file;
                            break;
                        }
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
    findMy(id){
        let meu = this.dataInputs.meus.find(f => f.field_id === id);

        return meu;
    },
    meManager: function(){
        let self = this,
            limit = 3,
            total = this.qall(".meus > .meu").length;

        function addMoreBtn(){
            return {
                hide: () => $(".add-more").hide(),
                show: () => $(".add-more").show()
            }
        }

        function checkIfHasId(e){
            let id = "MEU-"+Math.floor(Math.random() * 99999999);
            let has = document.querySelector(`.meu[data-id='${id}']`);
            if(has) return checkIfHasId(e);
            self.dataInputs.meus.push(defaultFields(id, e));
            return addMoreForm(id, e);
        }

        function defaultFields(id, e){
            switch(e){
                case "human":
                    return {
                        field_id: id,
                        field_type: 'human',
                        meu_foto: '',
                        meu_nome: '',
                        meu_data: '',
                        meu_email: '',
                        meu_anexo: '',
                        meu_endereco: '',
                        meu_numero: '',
                        meu_cidade: '',
                        meu_doenca: '',
                        meu_medicamento: '',
                        meu_peso: '',
                        meu_alergia: '',
                        meu_sangue: '',
                        meu_sus_numero: '',
                        meu_plano_nome: '',
                        meu_plano_numero: '',
                        meu_obs: '',
                        meu_emergencia1_nome: '',
                        meu_emergencia1_contato: '',
                        meu_emergencia2_nome: '',
                        meu_emergencia2_contato: ''
                    };
                break;

                case "pet":
                    return {
                        field_id: id,
                        field_type: 'pet',
                        meu_foto: '',
                        meu_nome: '',
                        meu_data: '',
                        meu_raca: '',
                        meu_anexo: '',
                        meu_endereco: '',
                        meu_numero: '',
                        meu_cidade: '',
                        meu_alergia: '',
                        meu_sangue: '',
                        meu_peso: '',
                        meu_obs: '',
                        meu_emergencia1_nome: '',
                        meu_emergencia1_contato: '',
                        meu_emergencia2_nome: '',
                        meu_emergencia2_contato: ''
                    };
                break;

                case "object":
                    return {
                        field_id: id,
                        field_type: 'object',
                        meu_foto: '',
                        meu_nome: '',
                        meu_ano: '',
                        meu_modelo: '',
                        meu_anexo: '',
                        meu_endereco: '',
                        meu_numero: '',
                        meu_cidade: '',
                        meu_obs: '',
                        meu_emergencia1_nome: '',
                        meu_emergencia1_contato: '',
                        meu_emergencia2_nome: '',
                        meu_emergencia2_contato: ''
                    };
                break;
            }
        }

        function addMoreForm(id, e){
            switch(e){
                case "human":
                    $(".meus").append(`<div class="meu" data-type="humano" data-id="${id}">
                    <header>
                        <object type="image/svg+xml" class="meu-bg" data="../assets/img/v3/meu-bg.svg"></object>
                        <h1>MEU</h1>
                        <div class="field field-foto without" data-type="meu-foto">
                            <img id="field_my_foto" src="../assets/img/v3/nophoto.svg" />
                            <input type="file" name="upload" accept="image/jpg,image/jpeg,image/png">
                        </div>
                        <img src="../assets/img/v3/trash.svg" class="opt-del"/>
                        <object type="image/svg+xml" data="../assets/img/v3/type-${e}.svg" class="meu-tipo"></object>
                    </header>
                    <div class="gd m1">
                        <div class="field field-nome b">
                            <strong>NOME:</strong>
                            <input  required type="text" name="meu_nome" value="" class=".form-control"/>
                        </div>

                        <div class="field field-nascimento b">
                            <strong>DATA DE NASC:</strong>
                            <input  type="text" name="meu_data" value="" class=".form-control"/>
                        </div>
                    </div>

                    <div class="gd m1">
                        <div class="field field-email">
                            <strong>E-EMAIL:</strong>
                            <input  type="text" name="meu_email" value="" class=".form-control"/>
                        </div>

                        <div class="field field-anexo b without" data-type="meu-anexo">
                            <strong>ANEXO:</strong>
                            <input type="file" name="upload" accept="application/pdf,image/jpg,image/jpeg,image/png">
                                <div>
                                    <img class="has" src="../assets/img/v3/anexo-has.svg" style="display: none;"/>
                                    <img class="not" src="../assets/img/v3/anexo-not.svg"/>
                                </div>
                        </div>
                    </div>

                    <div class="gd m1">
                        <div class="field field-alergia">
                            <strong>ESCOLA:</strong>
                            <input  type="text" name="meu_escola" value="" class=".form-control"/>
                        </div>

                        <div class="field field-serie">
                            <strong>SÉRIE:</strong>
                            <input  type="text" name="meu_serie" value="" class=".form-control"/>
                        </div>
                    </div>

                    <div class="gd m2">
                        <div class="field field-endereco b">
                            <strong>ENDEREÇO:</strong>
                            <input  type="text" name="meu_endereco" value="" class=".form-control"/>
                        </div>

                        <div class="field field-numero b">
                            <strong>NUMERO:</strong>
                            <input  type="text" name="meu_numero" value="" class=".form-control"/>
                        </div>

                        <div class="field field-cidade b">
                            <strong>CIDADE:</strong>
                            <input  type="text" name="meu_cidade" value="" class=".form-control"/>
                        </div>
                    </div>

                    <div class="gd">
                        <div class="field field-doenca">
                            <strong>DOENÇA DIAGNOSTICADA:</strong>
                            <input  type="text" name="meu_doenca" value="" class=".form-control"/>
                        </div>
                    </div>

                    <div class="gd m3">
                        <div class="field field-medicamento b">
                            <strong>USO MEDICAMENTO:</strong>
                            <input  type="text" name="meu_medicamento" value="" class=".form-control"/>
                        </div>

                        <div class="field field-peso b">
                            <strong>PESO:</strong>
                            <input  type="text" name="meu_peso" value="" class=".form-control"/>
                        </div>
                    </div>

                    <div class="gd m1">
                        <div class="field field-alergia">
                            <strong>ALERGIA:</strong>
                            <input  type="text" name="meu_alergia" value="" class=".form-control"/>
                        </div>

                        <div class="field field-sangue">
                            <strong>TIPO SANGUINEO:</strong>
                            <input  type="text" name="meu_sangue" value="" class=".form-control"/>
                        </div>
                    </div>

                    <div class="gd">
                        <div class="field field-sus-numero b">
                            <strong>SUS Nº:</strong>
                            <input  type="text" name="meu_sus_numero" value="" class=".form-control"/>
                            <img src="../assets/img/v3/sus-mini.svg" id="susTrigger"/>
                        </div>
                    </div>

                    <div class="gd m5">
                        <div class="field field-sus-numero">
                            <strong>PLANO DE SÁUDE:</strong>
                            <input  type="text" name="meu_plano_nome" value="" class=".form-control"/>
                        </div>

                        <div class="field field-sus-numero">
                            <strong>Nº:</strong>
                            <input  type="text" name="meu_plano_numero" value="" class=".form-control"/>
                        </div>
                    </div>

                    <div class="gd">
                        <div class="field field-obs b">
                            <strong>OBS:</strong>
                            <textarea name="meu_obs" class=".form-control"></textarea>
                        </div>
                    </div>

                    <h4 class="emergencia">CONTATO DE EMERGÊNCIA</h4>
                    <div class="gd m5 emergencia-form">
                        <div class="field field-nome">
                            <strong>NOME:</strong>
                            <input required  type="text" name="meu_emergencia1_nome" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-contato">
                            <strong>CONTATO:</strong>
                            <input required  type="text" name="meu_emergencia1_contato" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-nome b">
                            <strong>NOME:</strong>
                            <input  required type="text" name="meu_emergencia2_nome" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-contato b">
                            <strong>CONTATO:</strong>
                            <input required  type="text" name="meu_emergencia2_contato" value=""
                            class=".form-control"/>
                        </div>
                    </div>
                </div>`);
                break;

                case "pet":
                    $(".meus").append(`<div class="meu" data-type="pet" data-id="${id}">
                    <header>
                        <object type="image/svg+xml" class="meu-bg" data="../assets/img/v3/meu-bg.svg"></object>
                        <h1>MEU</h1>
                        <div class="field field-foto without" data-type="meu-foto">
                            <img id="field_my_foto" src="../assets/img/v3/nophoto.svg" />
                            <input type="file" name="upload" accept="image/jpg,image/jpeg,image/png">
                        </div>
                        <img src="../assets/img/v3/trash.svg" class="opt-del"/>
                        <object type="image/svg+xml" data="../assets/img/v3/type-${e}.svg" class="meu-tipo"></object>
                    </header>
                    <div class="gd m1">
                        <div class="field field-nome b">
                            <strong>NOME:</strong>
                            <input  required type="text" name="meu_nome" value="" class=".form-control"/>
                        </div>

                        <div class="field field-nascimento b">
                            <strong>DATA DE NASC:</strong>
                            <input  type="text" name="meu_data" value="" class=".form-control"/>
                        </div>
                    </div>

                    <div class="gd m1">
                        <div class="field field-email">
                            <strong>RAÇA:</strong>
                            <input  type="text" name="meu_raca" value="" class=".form-control"/>
                        </div>

                        <div class="field field-anexo without" data-type="meu-anexo">
                            <strong>ANEXO:</strong>
                            <input type="file" name="upload" accept="application/pdf,image/jpg,image/jpeg,image/png">
                                <div>
                                    <img class="has" src="../assets/img/v3/anexo-has.svg" style="display: none;"/>
                                    <img class="not" src="../assets/img/v3/anexo-not.svg"/>
                                </div>
                        </div>
                    </div>

                    <div class="gd m2">
                        <div class="field field-endereco b">
                            <strong>ENDEREÇO:</strong>
                            <input  type="text" name="meu_endereco" value="" class=".form-control"/>
                        </div>

                        <div class="field field-numero b">
                            <strong>NUMERO:</strong>
                            <input  type="text" name="meu_numero" value="" class=".form-control"/>
                        </div>

                        <div class="field field-cidade b">
                            <strong>CIDADE:</strong>
                            <input  type="text" name="meu_cidade" value="" class=".form-control"/>
                        </div>
                    </div>

                    <div class="gd m6">
                        <div class="field field-alergia">
                            <strong>ALERGIA:</strong>
                            <input  type="text" name="meu_alergia" value="" class=".form-control"/>
                        </div>

                        <div class="field field-sangue">
                            <strong>TIPO SANGUINEO:</strong>
                            <input  type="text" name="meu_sangue" value="" class=".form-control"/>
                        </div>

                        <div class="field field-peso">
                            <strong>PESO:</strong>
                            <input  type="text" name="meu_peso" value="" class=".form-control"/>
                        </div>
                    </div>

                    <div class="gd">
                        <div class="field field-obs b">
                            <strong>DESCREVA SEU PET:</strong>
                            <textarea name="meu_obs" class=".form-control"></textarea>
                        </div>
                    </div>

                    <h4 class="emergencia">CONTATO DE EMERGÊNCIA</h4>
                    <div class="gd m5 emergencia-form">
                        <div class="field field-nome">
                            <strong>NOME:</strong>
                            <input required  type="text" name="meu_emergencia1_nome" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-contato">
                            <strong>CONTATO:</strong>
                            <input required  type="text" name="meu_emergencia1_contato" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-nome b">
                            <strong>NOME:</strong>
                            <input  required type="text" name="meu_emergencia2_nome" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-contato b">
                            <strong>CONTATO:</strong>
                            <input required  type="text" name="meu_emergencia2_contato" value=""
                            class=".form-control"/>
                        </div>
                    </div>
                </div>`);
                break;

                case "object":
                    $(".meus").append(`<div class="meu" data-type="objeto" data-id="${id}">
                    <header>
                        <object type="image/svg+xml" class="meu-bg" data="../assets/img/v3/meu-bg.svg"></object>
                        <h1>MEU</h1>
                        <div class="field field-foto without" data-type="meu-foto">
                            <img id="field_my_foto" src="../assets/img/v3/nophoto.svg" />
                            <input type="file" name="upload" accept="image/jpg,image/jpeg,image/png">
                        </div>
                        <img src="../assets/img/v3/trash.svg" class="opt-del"/>
                        <object type="image/svg+xml" data="../assets/img/v3/type-${e}.svg" class="meu-tipo"></object>
                    </header>
                    <div class="gd m1">
                        <div class="field field-nome b">
                            <strong>NOME:</strong>
                            <input  required type="text" name="meu_nome" value="" class=".form-control"/>
                        </div>

                        <div class="field field-nascimento b">
                            <strong>ANO:</strong>
                            <input  type="text" name="meu_ano" value="" class=".form-control"/>
                        </div>
                    </div>

                    <div class="gd m1">
                        <div class="field field-email">
                            <strong>MODELO:</strong>
                            <input  type="text" name="meu_modelo" value="" class=".form-control"/>
                        </div>

                        <div class="field field-anexo without" data-type="meu-anexo">
                            <strong>ANEXO:</strong>
                            <input type="file" name="upload" accept="application/pdf,image/jpg,image/jpeg,image/png">
                                <div>
                                    <img class="has" src="../assets/img/v3/anexo-has.svg" style="display: none;"/>
                                    <img class="not" src="../assets/img/v3/anexo-not.svg"/>
                                </div>
                        </div>
                    </div>

                    <div class="gd m2">
                        <div class="field field-endereco b">
                            <strong>ENDEREÇO:</strong>
                            <input  type="text" name="meu_endereco" value="" class=".form-control"/>
                        </div>

                        <div class="field field-numero b">
                            <strong>NUMERO:</strong>
                            <input  type="text" name="meu_numero" value="" class=".form-control"/>
                        </div>

                        <div class="field field-cidade b">
                            <strong>CIDADE:</strong>
                            <input  type="text" name="meu_cidade" value="" class=".form-control"/>
                        </div>
                    </div>

                    <div class="gd">
                        <div class="field field-obs">
                            <strong>DESCREVA SEU OBJETO:</strong>
                            <textarea name="meu_obs" class=".form-control"></textarea>
                        </div>
                    </div>

                    <h4 class="emergencia">CONTATO DE EMERGÊNCIA</h4>
                    <div class="gd m5 emergencia-form">
                        <div class="field field-nome">
                            <strong>NOME:</strong>
                            <input required  type="text" name="meu_emergencia1_nome" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-contato">
                            <strong>CONTATO:</strong>
                            <input required  type="text" name="meu_emergencia1_contato" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-nome b">
                            <strong>NOME:</strong>
                            <input  required type="text" name="meu_emergencia2_nome" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-contato b">
                            <strong>CONTATO:</strong>
                            <input required  type="text" name="meu_emergencia2_contato" value=""
                            class=".form-control"/>
                        </div>
                    </div>
                </div>`);
                break;
            }

            $("#selectOpt").modal("hide");
            triggetInputs();
        }

        function susTrigger(){
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

        }

        function triggetInputs(){
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

                case "eu-anexo":
                    target.src = file;
                    self.dataInputs.eu.anexo = '';
                break;

                default:
                    let t = e.target.parentElement.parentElement.parentElement;
                    if(!t.getAttribute('data-id')) return;
                    let meu = self.findMy(t.getAttribute('data-id'));

                    switch(attr){
                        case "meu-anexo":
                            target.src = file;
                            meu['meu_anexo'] = '';
                        break;

                        case "meu-foto":
                            target.src = file;
                            meu['meu_foto'] = '';
                        break;
                    }
                break;
            }
            });

            $(".meus .meu input[type='text'],.meus .meu textarea").change("change", (e) => {
                let data = {
                    id: e.target.parentElement.parentElement.parentElement.getAttribute('data-id'),
                    name: e.target.name,
                }

                let meu = self.findMy(data.id);
                    meu[data.name] = e.target.value;
            });

            susTrigger()
        }

        function addMore(e){
            $("#field_terms").prop('checked', false);
            total = (self.qall(".meus > .meu").length);
            if(total >= limit) return addMoreBtn().hide();
            checkIfHasId(e.target.getAttribute('data-type')),deleteMy(),deleteMsg();
        }

        function triggetClick(){
            $(".add-more").click(() =>$("#selectOpt").modal("show"));
            $("#selectOpt img[data-type]").click((e) => addMore(e));
            susTrigger()
        }

        function deleteMy(){
            $(".meu .opt-del").unbind("click");
            $(".meu .opt-del").click(function(e){
                let id = $(e.target).closest("div[data-id]");
                let index = self.dataInputs.meus.findIndex(m => m.field_id === id[0].getAttribute('data-id'));
                let lista = self.dataInputs.meus;
                if(lista.splice(index, 1)){
                    self.dataInputs.meus = lista;
                    $(id[0]).addClass('removed-item')
                    .one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
                        $(this).remove();
                        deleteMsg();
                    });
                }
            })
        }

        function deleteMsg(){
            $(".badgee").click((e) => {
                e.preventDefault();
                $(e.target).remove();
                setTimeout(() => $(".btn-close").click(),20)
            });
            
            if($(".meus .meu").length > 0){
                $(".badgee").remove();
            }else{
                if($(".badgee").length > 0) return;
                $(".add-more").prepend(`<div class="badgee left">
                    Prezado cliente, para quem cadastrou os dados MY ME até a data 24/09/2021
                    favor recadastrar, pois fizemos melhorias no sistema operacional, e para que
                    todos os clientes possam usufruir das melhorias, essa operação do
                    recadastramento é necessária! Atenciosamente.
                </div>`);
            }
        }

        return {
            trigger:  triggetInputs,
            click: triggetClick,
            fields: defaultFields,
            delete: deleteMy,
            msg: deleteMsg,
            sus: susTrigger
        }
    },
    checkifHasMe: function(){
        let self = this;

        function my(){
            let items = document.querySelectorAll("div.meu[data-id]");

            items.forEach((item) => {
                let fields = self.meManager().fields(item.getAttribute('data-id'), item.getAttribute('data-type'));

                let inputs = item.querySelectorAll("input[type='text'], textarea"),
                    foto = (item.querySelector('[data-meu-imagem]') ? item.querySelector('[data-meu-imagem]').getAttribute('data-meu-imagem') : ''),
                    anexo = (item.querySelector('[data-meu-anexo]') ? item.querySelector('[data-meu-anexo]').getAttribute('data-meu-anexo') : '')

                    inputs.forEach((item) => {
                        fields[item.name] = item.value;
                    })

                    fields.meu_foto = foto;
                    fields.meu_anexo = anexo;
                    fields.field_id = item.getAttribute('data-id')

                    self.dataInputs.meus.push(fields);
            });
        }

        function me(){
            let me = document.querySelector(".my");

            let foto = (me.querySelector('[data-eu-foto]') ? me.querySelector('[data-eu-foto]').getAttribute('data-eu-foto') : ''),
                anexo = (me.querySelector('[data-meu-anexo]') ? me.querySelector('[data-meu-anexo]').getAttribute('data-meu-anexo') : '')

                self.dataInputs.eu.foto = foto;
                self.dataInputs.eu.anexo = anexo;
        }

        my(),me();
    },
    disableAllInputs: function(){
        if(!this.q(".usado")) return;
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
        this.meManager().msg();

        if(this.myme.classList.contains("usado")){
            if(document.querySelector(".edit")){
                document.querySelector(".edit").remove();
                document.querySelector(".add-more").remove();
                this.meManager().sus();
            }
        }else{
            // document.querySelector(".help").remove();
            this.checkifHasMe();
            this.meManager().delete();

        }
    },
    termsValidate: function(){
        if(this.q(".usado")) return;
        let terms = this.q("#field_terms"),
            submit = this.q("button[type='submit']"),
            self = this;

            terms.addEventListener("change", function(e){
                let fields = {
                    eu: (self.dataInputs.eu.foto ? true : false),
                    meu: (self.dataInputs.meus.filter(s => s.meu_foto == null).length > 0 ? false : true),
                    error: document.querySelector(".error"),
                }

                if(e.target.checked && fields.eu && fields.meu){
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
                    if(!fields.me_foto || !fields.my_foto){
                        fields.error.style.display = "block";
                        fields.error.innerText = "Ops... você esqueceu de inserir as imagens. Por favor, revise os campos de fotos.";
                    }

                    terms.checked = false;

                    submit.disabled = true;
                    $(submit).unbind("click");
                }
            });
    },
    init: function(){
        //$('input[name="field_eu_nascimento"]').mask('11/11/1111');
        //$('.phone_with_ddd').mask('(99) 9999-9999');
        this.checkIfEnabled();
        this.termsValidate();
        this.meManager().trigger();
        this.meManager().click();
        this.disableAllInputs();
        this.contactValidate();
    }
}

window.addEventListener("load", formManager.init())
