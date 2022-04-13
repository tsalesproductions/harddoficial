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
                // if(!document.body.classList.contains("usado")) return;
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

// $scLocation.init();

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

                        meu_telefone: '',
                        meu_pix: '',
                        meu_soc_facebook: '',
                        meu_soc_twitter: '',
                        meu_soc_insta: '',
                        meu_soc_linkedin: '',
                        meu_soc_whatsappp: '',
                        
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
                        <object type="image/svg+xml" class="meu-txt" data="../assets/img/est1/ficha/my.svg"></object>
                        
                        <div class="field field-foto without" data-type="meu-foto">
                            <img id="field_my_foto" src="../assets/img/v3/nophoto.svg" />
                            <input type="file" name="upload" accept="image/jpg,image/jpeg,image/png">
                        </div>
                        <img src="../assets/img/est1/ficha/trash.svg" class="opt-del"/>
                        <object type="image/svg+xml" data="../assets/img/est1/ficha/myme-top.svg" class="meu-tipo"></object>
                    </header>
                    <div class="gd m1">
                        <div class="field field-nome">
                            <strong>NOME:</strong>
                            <input  required type="text" name="meu_nome" value="" class=".form-control"/>
                        </div>

                        <div class="field field-nascimento">
                            <strong>DATA:</strong>
                            <input  type="text" name="meu_data" value="" class=".form-control"/>
                        </div>
                    </div>

                    <div class="gd m1">
                        <div class="field field-email">
                            <strong>E-EMAIL:</strong>
                            <input  type="text" name="meu_email" value="" class=".form-control"/>
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

                    <div class="gd m1">
                        <div class="field field-telefone">
                            <strong>TELEFONE:</strong>
                            <input  type="text" name="meu_telefone" value="" class=".form-control"/>
                        </div>

                        <div class="field field-pix">
                            <img class="me-pix" src="../assets/img/est1/ficha/pix.png"/>
                            <input  type="hidden" name="meu_pix" value="" class=".form-control"/>
                        </div>
                    </div>

                    <div class="df soc">
                        <div class="field">
                            <svg class="bf-soc" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3.82 7.27"><defs><style>.cls-1{fill-rule:evenodd;}</style></defs><g id="Camada_2" data-name="Camada 2"><g id="Camada_1-2" data-name="Camada 1"><path class="cls-1" d="M2.87,0l.58,0a2.21,2.21,0,0,1,.37,0V1.23H3.05c-.31,0-.54.12-.56.51s0,.9,0,.93h1.3c-.07.45-.12.88-.19,1.32H2.48l0,3.28H1.09L1.11,4H0V2.67H1.13v-.1c0-.26,0-.52,0-.79a2.89,2.89,0,0,1,0-.5,1.48,1.48,0,0,1,.6-1,1.7,1.7,0,0,1,1-.31Z"/></g></g></svg>
                            <input type="hidden" name="meu_soc_facebook" value="" data-tipo="facebook" class=".form-control"/>
                        </div>

                        <div class="field">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6.75 5.47"><defs><style>.cls-1{fill-rule:evenodd;}</style></defs><g id="Camada_2" data-name="Camada 2"><g id="Camada_1-2" data-name="Camada 1"><path class="cls-1" d="M6.75.65a1.77,1.77,0,0,1-.16.22,2.23,2.23,0,0,1-.5.47l0,0A3.12,3.12,0,0,1,6,2a4.05,4.05,0,0,1-.36,1.23,4.07,4.07,0,0,1-.75,1.09A3.86,3.86,0,0,1,3,5.38a5,5,0,0,1-.77.09H2.11A3.87,3.87,0,0,1,0,4.87l0,0,.32,0a2.75,2.75,0,0,0,1.06-.21A2.41,2.41,0,0,0,2,4.28a1.36,1.36,0,0,1-1.27-1,1.07,1.07,0,0,0,.25,0,2,2,0,0,0,.34,0l0,0a1.32,1.32,0,0,1-.89-.63,1.34,1.34,0,0,1-.2-.73,1.29,1.29,0,0,0,.61.16,1.37,1.37,0,0,1-.56-.83A1.34,1.34,0,0,1,.5.26,3.91,3.91,0,0,0,3.33,1.7a.68.68,0,0,0,0-.15,1.35,1.35,0,0,1,.21-.9A1.34,1.34,0,0,1,4.46,0l.25,0a1.35,1.35,0,0,1,1,.41l0,0h0A3,3,0,0,0,6.55.12h0A1.36,1.36,0,0,1,6,.86,2.59,2.59,0,0,0,6.75.65Z"/></g></g></svg>
                            <input type="hidden" name="meu_soc_twitter" value="" data-tipo="twitter" class=".form-control"/>
                        </div>

                        <div class="field">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6.44 6.43"><defs><style>.cls-1{fill-rule:evenodd;}</style></defs><g id="Camada_2" data-name="Camada 2"><g id="Camada_1-2" data-name="Camada 1"><path class="cls-1" d="M5,1.12H5a.39.39,0,1,1-.39.38A.38.38,0,0,1,5,1.12ZM3.21,4.28A1.07,1.07,0,0,0,4.28,3.23,1.06,1.06,0,0,0,3.23,2.15h0A1.08,1.08,0,0,0,2.15,3.21,1,1,0,0,0,3.2,4.28Zm0-2.71A1.66,1.66,0,0,0,1.57,3.22,1.63,1.63,0,0,0,3.2,4.87,1.67,1.67,0,0,0,4.87,3.22,1.64,1.64,0,0,0,3.23,1.57ZM5.78,4.83a23.89,23.89,0,0,0,0-3.16,1.09,1.09,0,0,0-1-1A15.24,15.24,0,0,0,3.24.58C2.6.58,2,.6,1.69.63a1.1,1.1,0,0,0-1,1,22.13,22.13,0,0,0,0,3.25,1,1,0,0,0,.79.91,10.12,10.12,0,0,0,1.73.09c.68,0,1.34,0,1.59,0a1.1,1.1,0,0,0,1-1ZM6.4,1.61A1.65,1.65,0,0,0,5.88.52,1.73,1.73,0,0,0,4.71,0c-.37,0-1,0-1.57,0A13.46,13.46,0,0,0,1.52.07,1.65,1.65,0,0,0,.12,1.32,19,19,0,0,0,.06,4.93,1.63,1.63,0,0,0,1.34,6.34a12,12,0,0,0,1.79.09,14.87,14.87,0,0,0,1.78-.07A1.65,1.65,0,0,0,6.33,5.07,22.34,22.34,0,0,0,6.4,1.61Z"/></g></g></svg>
                            <input type="hidden" name="meu_soc_insta" value="" data-tipo="instagram" class=".form-control"/>
                        </div>

                        <div class="field">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.87 5.88"><defs><style>.cls-1{fill-rule:evenodd;}</style></defs><g id="Camada_2" data-name="Camada 2"><g id="Camada_1-2" data-name="Camada 1"><path class="cls-1" d="M.71,0a.71.71,0,0,1,.71.71.72.72,0,0,1-.72.71A.7.7,0,0,1,0,.71.71.71,0,0,1,.71,0ZM4.42,1.86c1.24,0,1.46.81,1.45,1.87l0,2.15H4.63L4.65,4c0-.46,0-1-.63-1s-.73.49-.74,1V5.88H2.05L2.08,2H3.25v.54h0a1.3,1.3,0,0,1,1.16-.63ZM1.31,2l0,3.93H.06L.09,2Z"/></g></g></svg>
                            <input type="hidden" name="meu_soc_linkedin" value="" data-tipo="linkedin"
                            class=".form-control"/>
                        </div>

                        <div class="field">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6.36 6.37"><defs><style>.cls-1{fill-rule:evenodd;}</style></defs><g id="Camada_2" data-name="Camada 2"><g id="Camada_1-2" data-name="Camada 1"><path class="cls-1" d="M2.13,1.7l.19,0a.16.16,0,0,1,.08.1c.09.2.18.41.25.62s0,.21-.19.39a.16.16,0,0,0,0,.18,2.18,2.18,0,0,0,1.1,1h.06a.12.12,0,0,0,.1-.06c.2-.24.26-.35.35-.35a.07.07,0,0,1,.06,0c.64.3.69.31.69.39a.69.69,0,0,1-.73.71H4A3,3,0,0,1,1.76,3a1,1,0,0,1,.15-1.22.32.32,0,0,1,.22-.08ZM3.6,5.77a2.66,2.66,0,0,0,2.22-3A2.61,2.61,0,0,0,3.23.52,2.65,2.65,0,0,0,.89,4.44a.53.53,0,0,1,0,.5c-.08.22-.13.45-.2.71l.9-.24h.07a.25.25,0,0,1,.14,0,2.63,2.63,0,0,0,1.32.37,2.15,2.15,0,0,0,.43,0Zm2.72-3.2A3.14,3.14,0,0,0,3.25,0a3.18,3.18,0,0,0-.74.09A3.17,3.17,0,0,0,.41,4.66a.31.31,0,0,1,0,.19C.32,5.23.21,5.61.1,6c0,.12-.06.24-.1.37.17,0,.73-.19,1.57-.4h.06a.31.31,0,0,1,.13,0,3.12,3.12,0,0,0,1.42.34,3.51,3.51,0,0,0,.55,0A3.2,3.2,0,0,0,6.32,2.57Z"/></g></g></svg>
                            <input type="hidden" name="meu_soc_whatsappp" value = "" data-tipo = "whatsapp" class=".form-control"/>
                        </div>
                    </div>

                    <div class="gd m2">
                        <div class="field field-endereco">
                            <strong>ENDEREÇO:</strong>
                            <input  type="text" name="meu_endereco" value="" class=".form-control"/>
                        </div>

                        <div class="field field-numero">
                            <strong>NUMERO:</strong>
                            <input  type="text" name="meu_numero" value="" class=".form-control"/>
                        </div>

                        <div class="field field-cidade">
                            <strong>CIDADE:</strong>
                            <input  type="text" name="meu_cidade" value="" class=".form-control"/>
                        </div>
                    </div>

                    <div class="gd m1">
                        <div class="field field-alergia">
                            <strong>ESCOLA / EMPRESA:</strong>
                            <input  type="text" name="meu_escola" value="" class=".form-control"/>
                        </div>

                        <div class="field field-serie">
                            <strong>SÉRIE / CARGO:</strong>
                            <input  type="text" name="meu_serie" value="" class=".form-control"/>
                        </div>
                    </div>

                    <div class="gd">
                        <div class="field field-doenca b">
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
                        <div class="field field-alergia b">
                            <strong>ALERGIA:</strong>
                            <input  type="text" name="meu_alergia" value="" class=".form-control"/>
                        </div>

                        <div class="field field-sangue b">
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
                        <div class="field field-sus-numero b">
                            <strong>PLANO DE SÁUDE:</strong>
                            <input  type="text" name="meu_plano_nome" value="" class=".form-control"/>
                        </div>

                        <div class="field field-sus-numero b">
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

                    <h4 class="emergencia" style="display: none">CONTATO DE EMERGÊNCIA</h4>
                    <div class="gd m5 emergencia-form"  style="display: none">
                        <div class="field field-nome">
                            <strong>NOME:</strong>
                            <input  type="text" name="meu_emergencia1_nome" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-contato">
                            <strong>CONTATO:</strong>
                            <input  type="text" name="meu_emergencia1_contato" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-nome b">
                            <strong>NOME:</strong>
                            <input type="text" name="meu_emergencia2_nome" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-contato b">
                            <strong>CONTATO:</strong>
                            <input type="text" name="meu_emergencia2_contato" value=""
                            class=".form-control"/>
                        </div>
                    </div>
                </div>`);
                break;

                case "pet":
                    $(".meus").append(`<div class="meu" data-type="pet" data-id="${id}">
                    <header>
                        <object type="image/svg+xml" class="meu-bg" data="../assets/img/v3/meu-bg.svg"></object>
                        <object type="image/svg+xml" class="meu-txt" data="../assets/img/est1/ficha/pet.svg"></object>
                        <div class="field field-foto without" data-type="meu-foto">
                            <img id="field_my_foto" src="../assets/img/v3/nophoto.svg" />
                            <input type="file" name="upload" accept="image/jpg,image/jpeg,image/png">
                        </div>
                        <img src="../assets/img/est1/ficha/trash.svg" class="opt-del"/>
                        <object type="image/svg+xml" data="../assets/img/est1/ficha/myme-top.svg" class="meu-tipo"></object>
                    </header>
                    <div class="gd m1">
                        <div class="field field-nome">
                            <strong>NOME:</strong>
                            <input  required type="text" name="meu_nome" value="" class=".form-control"/>
                        </div>

                        <div class="field field-nascimento">
                            <strong>DATA:</strong>
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
                        <div class="field field-endereco">
                            <strong>ENDEREÇO:</strong>
                            <input  type="text" name="meu_endereco" value="" class=".form-control"/>
                        </div>

                        <div class="field field-numero">
                            <strong>NUMERO:</strong>
                            <input  type="text" name="meu_numero" value="" class=".form-control"/>
                        </div>

                        <div class="field field-cidade">
                            <strong>CIDADE:</strong>
                            <input  type="text" name="meu_cidade" value="" class=".form-control"/>
                        </div>
                    </div>

                    <div class="gd m6">
                        <div class="field field-alergia b">
                            <strong>ALERGIA:</strong>
                            <input  type="text" name="meu_alergia" value="" class=".form-control"/>
                        </div>

                        <div class="field field-sangue b">
                            <strong>TIPO SANGUINEO:</strong>
                            <input  type="text" name="meu_sangue" value="" class=".form-control"/>
                        </div>

                        <div class="field field-peso b">
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

                    <h4 class="emergencia" style="display: none;">CONTATO DE EMERGÊNCIA</h4>
                    <div class="gd m5 emergencia-form" style="display: none;">
                        <div class="field field-nome">
                            <strong>NOME:</strong>
                            <input type="text" name="meu_emergencia1_nome" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-contato">
                            <strong>CONTATO:</strong>
                            <input type="text" name="meu_emergencia1_contato" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-nome b">
                            <strong>NOME:</strong>
                            <input type="text" name="meu_emergencia2_nome" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-contato b">
                            <strong>CONTATO:</strong>
                            <input type="text" name="meu_emergencia2_contato" value=""
                            class=".form-control"/>
                        </div>
                    </div>
                </div>`);
                break;

                case "object":
                    $(".meus").append(`<div class="meu" data-type="objeto" data-id="${id}">
                    <header>
                        <object type="image/svg+xml" class="meu-bg" data="../assets/img/v3/meu-bg.svg"></object>
                        <object type="image/svg+xml" class="meu-txt" data="../assets/img/est1/ficha/object.svg"></object>
                        <div class="field field-foto without" data-type="meu-foto">
                            <img id="field_my_foto" src="../assets/img/v3/nophoto.svg" />
                            <input type="file" name="upload" accept="image/jpg,image/jpeg,image/png">
                        </div>
                        <img src="../assets/img/est1/ficha/trash.svg" class="opt-del"/>
                        <object type="image/svg+xml" data="../assets/img/est1/ficha/myme-top.svg" class="meu-tipo"></object>
                    </header>
                    <div class="gd m1">
                        <div class="field field-nome">
                            <strong>NOME:</strong>
                            <input  required type="text" name="meu_nome" value="" class=".form-control"/>
                        </div>

                        <div class="field field-nascimento">
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
                        <div class="field field-obs b">
                            <strong>DESCREVA SEU OBJETO:</strong>
                            <textarea name="meu_obs" class=".form-control"></textarea>
                        </div>
                    </div>

                    <h4 class="emergencia" style="display: none;">CONTATO DE EMERGÊNCIA</h4>
                    <div class="gd m5 emergencia-form" style="display: none;">
                        <div class="field field-nome">
                            <strong>NOME:</strong>
                            <input type="text" name="meu_emergencia1_nome" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-contato">
                            <strong>CONTATO:</strong>
                            <input type="text" name="meu_emergencia1_contato" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-nome">
                            <strong>NOME:</strong>
                            <input type="text" name="meu_emergencia2_nome" value=""
                            class=".form-control"/>
                        </div>

                        <div class="field field-contato">
                            <strong>CONTATO:</strong>
                            <input type="text" name="meu_emergencia2_contato" value=""
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
                   $("#sus-sexo").text('SEXO: -').remove();
                   $("#sus-numero").text("Nº: "+$(target).find('.field-sus-numero input').val())

                   $("#susCard").modal("show");
                })
            })

        }

        function triggetInputs(){
            $(".disponivel .without").unbind("click");
            self.socManager();
            $("input[type='file']").unbind("change");
            $(".meus .meu input[type='text'],.meus .meu input[type='text'],.meus .meu .df.soc input, .meus .meu .field.field-pix input").unbind("change");
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

            $(".meus .meu input[type='text'],.meus .meu textarea, .meus .meu .df.soc input, .meus .meu .field.field-pix input").change("change", (e) => {
                let data = {
                    id: e.target.parentElement.parentElement.parentElement.getAttribute('data-id'),
                    name: e.target.name,
                }

                let meu = self.findMy(data.id);
                console.log(data.id)
                    meu[data.name] = $(e.target).closest(".field").find("input").val();
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
    sAlert: function (icon, msg){
        Swal.fire({
            position: 'top-end',
            icon: icon,
            text: msg,
            showConfirmButton: false,
            timer: 1500
        })
    },
    copyToClipBoard: function(data, icon, msg){
        let input = document.createElement("textarea");
            input.value = data;
            document.body.appendChild(input);
            input.select();
            document.execCommand("Copy");
            input.remove();

            this.sAlert(icon, msg)
            
    },
    socManager: function(){
        let self = this;
        $(".usado .df.soc .field").unbind("click")
        $(".usado .df.soc .field").click(({target}) => {
            let value = $(target).closest(".field").find("input").val().trim();
            
            if(value || value !== ''){
                let tipo = $(target).closest(".field").find("input").attr('data-tipo');
                if(tipo !== "whatsapp"){
                    tipo = `https://${tipo}.com/${value}`;
                }else{
                    tipo = `https://wa.me/${value}`
                }
                window.open(tipo);
            }
        })

        $(".disponivel .df.soc .field").unbind("click")
        $(".disponivel .df.soc .field").click(({target}) => {
            let tipo = $(target).closest(".field").find("input").attr('data-tipo'),
                value = $(target).closest(".field").find("input");
            let url = `https://${tipo}.com/`;

            $("#modalOpt .input-group-text").text(url);
            $("#modalOpt button").attr('data-tipo', tipo);
            $("#modalOpt input").val($(value).val().trim())

            if(tipo === "whatsapp"){
                $("#modalOpt .input-group-text").hide()
            }else{
                $("#modalOpt .input-group-text").show()
            }

            $("#modalOpt").modal("show")
        })

        $(".disponivel .field-pix").unbind("click")
        $(".disponivel .field-pix").click(({target}) => {
            let value = $(target).closest(".field").find("input").val();
            $("#modalOpt input").val(value);

            $("#modalOpt .input-group-text").hide()
            $("#modalOpt").modal("show")
        })

        $("#modalOpt button.btn-primary").unbind("click")
        $("#modalOpt button.btn-primary").click(({target}) => {
            let tipo = $(target).closest(".modal-body").find("button").attr("data-tipo");

            if(!tipo){
                $(".disponivel .field-pix input").val($("#modalOpt input").val())
            }else{
                $(".df.soc").find(`input[data-tipo='${tipo}']`).val($("#modalOpt input").val())
            }

            $("#modalOpt").modal("hide")
            self.sAlert("success", "")
            if($(".meus .meu .df.soc input").length){
                $(".meus .meu .df.soc input, .meus .meu .field.field-pix input").trigger("change")
            }
        })

        $(".usado .field-pix").unbind("click")
        $(".usado .field-pix").click(({target}) => {
            let value = $(target).closest(".field-pix").find("input").val().trim();
            if(value || value !== ''){
                self.copyToClipBoard(value, "success", "pix copiado para a área de transferência");
            }
        })
    },
    init: function(){
        $('input[name="field_eu_nascimento"]').mask('99/99/9999');
        //$('.phone_with_ddd').mask('(99) 9999-9999');
        this.checkIfEnabled();
        this.termsValidate();
        this.meManager().trigger();
        this.meManager().click();
        this.disableAllInputs();
        this.contactValidate();
        this.socManager();

        
    }
}

window.addEventListener("load", formManager.init())