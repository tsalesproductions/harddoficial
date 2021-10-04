const formManager = {
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

                    default:
                        let t = target.img.parentElement.parentElement.parentElement;
                        if(!t.getAttribute('data-id')) return;
                        let meu = self.findMy(t.getAttribute('data-id'));
                        switch(target.type){
                            case "meu-anexo":
                                meu['meu_anexo'] =  response.data.display_url;
                                $(t).find(".has").show();
                                $(t).find(".not").hide();
                            break;

                            case "meu-foto":
                                meu['meu_foto'] = response.data.display_url;
                            break;
                        }
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
    findMy(id){
        let meu = this.dataInputs.meus.find(f => f.field_id === id);

        return meu;
    },
    meManager: function(){
        let self = this,
            limit = 4,
            total = this.qall(".meus > .meu").length;

        function addMoreBtn(){
            return {
                hide: () => $(".add-more").hide(),
                show: () => $(".add-more").show()
            }
        }

        function checkIfHasId(){
            let id = "MEU-"+Math.floor(Math.random() * 99999999);
            let has = document.querySelector(`.meu[data-id='${id}']`);
            if(has) return checkIfHasId();
            self.dataInputs.meus.push(defaultFields(id));
            return addMoreForm(id);
        }

        function defaultFields(id){
            return {
                field_id: id,
                meu_nome: '',
                meu_data: '',
                meu_foto: '',
                meu_modelo: '',
                meu_alergia: '',
                meu_sangue: '',
                meu_peso: '',
                meu_doenca: '',
                meu_medicamento: '',
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
        }

        function addMoreForm(id){
            $(".meus").append(`<div class="meu" data-id="${id}">
            <div class="gd m3" style="position: relative">
                <div class="field field-nome b">
                    <strong>NOME/OBJETO:</strong>
                    <input  type="text" name="meu_nome" class="form-control" required/>
                </div>
                <div class="field field-data-ano b">
                    <strong>DATA/ANO:</strong>
                    <input  type="text" name="meu_data" class="form-control"/>
                </div>
                <div class="field field-foto without" data-type="meu-foto">
                    <img id="field_my_foto" src="../assets/img/meu-default.svg" />
                    <input type="file" name="upload" accept="image/jpg,image/jpeg,image/png">
                </div>
                <div class="opt-del">
                    <img title="deletar" src="../assets/img/trash-can.png"/>
                </div>
            </div>
        
            <div class="gd">
                <div class="field field-alergia">
                    <strong>RAÇA / MODELO:</strong>
                    <input  type="text" name="meu_modelo" class="form-control"/>
                </div>
            </div>
        
            <div class="gd m3">
                <div class="field field-alergia b">
                    <strong>ALERGIA:</strong>
                    <input  type="text" name="meu_alergia" class="form-control"/>
                </div>
                
                <div class="field field-sangue b">
                    <strong>TIPO SANGUINEO:</strong>
                    <input  type="text" name="meu_sangue" class="form-control"/>
                </div>
                
                <div class="field field-peso b">
                    <strong>PESO:</strong>
                    <input  type="text" name="meu_peso" class="form-control"/>
                </div>
                </div>
                
                <div class="gd">
                <div class="field field-doenca">
                    <strong>DOENÇA DIAGNOSTICADA:</strong>
                    <input  type="text" name="meu_doenca" class="form-control"/>
                </div>
                </div>
                
                <div class="gd m41">
                <div class="field field-medicamento b">
                    <strong>USO MEDICAMENTO:</strong>
                    <input  type="text" name="meu_medicamento" class="form-control"/>
                </div>
                
                <div class="field field-anexo b without" data-type="meu-anexo">
                <strong>ANEXO:</strong>
                <input type="file" name="upload" accept="application/pdf,image/jpg,image/jpeg,image/png">
                    <div>
                        <svg class="has" style="display: none;" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.62" fill-rule="evenodd" clip-rule="evenodd" d="M2.77 7.99999C2.87969 7.9703 2.97316 7.8984 3.03 7.8L5.38 3.58999C5.39005 3.56427 5.39005 3.53571 5.38 3.50999C5.38468 3.49026 5.38468 3.46972 5.38 3.44999L4.86 3.16C4.84189 3.14451 4.81883 3.13598 4.795 3.13598C4.77116 3.13598 4.74811 3.14451 4.73 3.16L2.61 6.99999C2.57781 7.05381 2.53248 7.09856 2.47826 7.13004C2.42403 7.16153 2.36269 7.17871 2.3 7.17999C2.24425 7.19438 2.18576 7.19438 2.13 7.17999C2.04904 7.1337 1.98919 7.05781 1.96307 6.96827C1.93696 6.87874 1.94662 6.78255 1.99001 6.69999L4.07001 2.97999C4.1211 2.88794 4.18984 2.80688 4.27232 2.74145C4.3548 2.67602 4.44938 2.62752 4.55064 2.59872C4.65191 2.56992 4.75786 2.56139 4.86243 2.57362C4.96699 2.58585 5.06812 2.6186 5.16 2.66999L5.69 2.96C5.87126 3.06797 6.00651 3.2388 6.07001 3.44C6.1246 3.64594 6.09586 3.8651 5.99001 4.05L3.64 8.25999C3.48978 8.52565 3.24247 8.72279 2.95 8.80999L2.28999 8.99C2.18053 9.00533 2.06947 9.00533 1.96001 8.99C1.68826 8.98938 1.4241 8.90021 1.20756 8.736C0.991033 8.5718 0.83391 8.3415 0.759994 8.08L0.580001 7.44C0.50032 7.14685 0.539866 6.83409 0.690002 6.57L2.03999 4.14999L3.46001 1.58999C3.53189 1.45751 3.63022 1.34122 3.74892 1.24833C3.86761 1.15544 4.00412 1.08793 4.14999 1.05L5.53999 0.649988C5.86088 0.560681 6.20409 0.602068 6.49455 0.765101C6.78501 0.928133 6.99909 1.19956 7.09 1.52L7.48 2.91C7.56271 3.20184 7.52677 3.51453 7.38 3.77999L6 6.27999C5.96935 6.33516 5.92437 6.38101 5.8698 6.4127C5.81523 6.44439 5.7531 6.46073 5.69 6.46C5.63012 6.45735 5.57178 6.44019 5.52 6.41C5.47979 6.38717 5.44449 6.3566 5.41615 6.32006C5.38782 6.28352 5.36702 6.24172 5.35493 6.19709C5.34285 6.15246 5.33971 6.10588 5.34573 6.06004C5.35175 6.01419 5.3668 5.96999 5.39 5.92999L6.82001 3.36999C6.85989 3.26361 6.85989 3.14637 6.82001 3.03999L6.42 1.64999C6.40151 1.58071 6.36941 1.51582 6.32558 1.45909C6.28174 1.40235 6.22704 1.3549 6.16467 1.31953C6.1023 1.28416 6.0335 1.26157 5.96231 1.25306C5.89112 1.24456 5.81894 1.25031 5.75 1.27L4.35001 1.66C4.24008 1.69492 4.14727 1.76987 4.09 1.86999L2.59 4.57L1.32001 6.85C1.28812 6.89993 1.26638 6.95567 1.25609 7.01402C1.24579 7.07236 1.24712 7.13216 1.25999 7.19L1.45 7.83C1.46849 7.89927 1.50059 7.96418 1.54443 8.02091C1.58827 8.07765 1.64297 8.12508 1.70534 8.16046C1.76771 8.19583 1.83649 8.21843 1.90768 8.22694C1.97888 8.23544 2.05105 8.22969 2.11999 8.21L2.77 7.99999Z" fill="#4D4D4D"/></svg>
                        <svg class="not" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.2 4.24C6.27142 4.25299 6.33604 4.29063 6.38255 4.34637C6.42907 4.40211 6.45454 4.4724 6.45454 4.545C6.45454 4.6176 6.42907 4.6879 6.38255 4.74363C6.33604 4.79937 6.27142 4.83702 6.2 4.85H4.84V6.21C4.82701 6.28143 4.78936 6.34603 4.73363 6.39255C4.67789 6.43907 4.6076 6.46455 4.535 6.46455C4.4624 6.46455 4.3921 6.43907 4.33636 6.39255C4.28063 6.34603 4.24298 6.28143 4.23 6.21V4.85H2.87C2.79857 4.83702 2.73397 4.79937 2.68745 4.74363C2.64094 4.6879 2.61545 4.6176 2.61545 4.545C2.61545 4.4724 2.64094 4.40211 2.68745 4.34637C2.73397 4.29063 2.79857 4.25299 2.87 4.24H4.23V2.88C4.24298 2.80857 4.28063 2.74397 4.33636 2.69745C4.3921 2.65093 4.4624 2.62545 4.535 2.62545C4.6076 2.62545 4.67789 2.65093 4.73363 2.69745C4.78936 2.74397 4.82701 2.80857 4.84 2.88V4.24H6.2ZM7.95 0.600002H1.12C1.04918 0.599932 0.97907 0.614052 0.913803 0.641533C0.848536 0.669014 0.789444 0.709298 0.740005 0.760002V0.760002C0.647943 0.857005 0.597652 0.986285 0.599991 1.12V7.95C0.599384 8.01851 0.612335 8.08647 0.638077 8.14997C0.663819 8.21346 0.701854 8.27125 0.75 8.32C0.799438 8.37071 0.85853 8.41098 0.923798 8.43847C0.989065 8.46595 1.05919 8.48007 1.13 8.48H7.95999C8.0293 8.47987 8.09787 8.46562 8.16148 8.43811C8.2251 8.4106 8.28244 8.37041 8.33 8.32C8.38139 8.27321 8.42223 8.21601 8.44981 8.15222C8.4774 8.08843 8.4911 8.01949 8.49001 7.95V1.13C8.48504 0.991019 8.42759 0.85908 8.32925 0.760742C8.23092 0.662404 8.09897 0.604971 7.95999 0.600002H7.95ZM1.12 0C0.82032 0.000574809 0.532919 0.119128 0.319992 0.330002C0.118429 0.540117 0.0040782 0.818866 0 1.11V7.94C0.00105465 8.08919 0.0316407 8.2367 0.0899963 8.374C0.148352 8.51131 0.233318 8.6357 0.339996 8.74C0.444104 8.84624 0.568672 8.93025 0.706177 8.98697C0.843681 9.04369 0.991268 9.07194 1.14 9.07H7.97C8.11857 9.07081 8.26581 9.04204 8.40315 8.98539C8.5405 8.92873 8.66521 8.84532 8.77 8.74C8.97908 8.52589 9.0973 8.23925 9.09999 7.94V1.13C9.09999 0.830306 8.98094 0.542887 8.76903 0.330971C8.55711 0.119055 8.2697 0 7.97 0H1.12Z" fill="#4D4D4D"/></svg>
                    </div>
                </div>
                </div>
                
                <div class="gd m2">
                <div class="field field-endereco">
                    <strong>ENDEREÇO:</strong>
                    <input  type="text" name="meu_endereco" class="form-control"/>
                </div>
                
                <div class="field field-numero">
                    <strong>NUMERO:</strong>
                    <input  type="text" name="meu_numero" class="form-control"/>
                </div>
                
                <div class="field field-cidade">
                    <strong>CIDADE:</strong>
                    <input  type="text" name="meu_cidade" class="form-control"/>
                </div>
                </div>
                
                <div class="gd">
                <div class="field field-obs">
                    <strong>OBS:</strong>
                    <textarea name="meu_obs" class="form-control"></textarea>
                </div>
                </div>
                
                <h4 class="emergencia">CONTATO DE EMERGÊNCIA</h4>
                <div class="gd m5 emergencia-form">
                <div class="field field-nome">
                    <strong>NOME:</strong>
                    <input type="text" name="meu_emergencia1_nome" class="form-control"/>
                </div>
                
                <div class="field field-contato">
                    <strong>CONTATO:</strong>
                    <input type="text" name="meu_emergencia1_contato" class="form-control"/>
                </div>
                
                <div class="field field-nome b">
                    <strong>NOME:</strong>
                    <input type="text" name="meu_emergencia2_nome" class="form-control"/>
                </div>
                
                <div class="field field-contato b">
                    <strong>CONTATO:</strong>
                    <input type="text" name="meu_emergencia2_contato" class="form-control"/>
                </div>
            </div>`);
            triggetInputs();
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
                
                target.children[1].click()
            })

            $("input[type='file']").change(function(e){
                let attr = e.target.parentElement.getAttribute('data-type');
                self.upload(e.target.files, {type: attr, img: e.target.parentElement.children[0]})
            });

            $(".meus .meu input[type='text'],.meus .meu textarea").change("change", (e) => {
                let data = {
                    id: e.target.parentElement.parentElement.parentElement.getAttribute('data-id'),
                    name: e.target.name,
                }

                let meu = self.findMy(data.id);
                    meu[data.name] = e.target.value;
            });
            
        }

        function addMore(){
            $("#field_terms").prop('checked', false);
            total = (self.qall(".meus > .meu").length);
            if(total >= limit) return addMoreBtn().hide();
            checkIfHasId(),deleteMy(),deleteMsg();
        }

        function triggetClick(){
            $(".add-more").click(() => addMore());
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
            if($(".meus .meu").length > 0){
                $(".default-reset").remove();
            }else{
                if($(".default-reset").length > 0) return;
                $(".meus").after(`<div class="default-reset">
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
            msg: deleteMsg
        }
    },
    checkifHasMe: function(){
        let self = this;

        function my(){
            let items = document.querySelectorAll("div.meu[data-id]");
        
            items.forEach((item) => {
                let fields = self.meManager().fields();

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
            }
        }else{
            document.querySelector(".help").remove();
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
        this.checkIfEnabled();
        this.termsValidate();
        this.meManager().trigger();
        this.meManager().click();
        this.disableAllInputs();
        this.contactValidate();
    }
}

window.addEventListener("load", formManager.init())