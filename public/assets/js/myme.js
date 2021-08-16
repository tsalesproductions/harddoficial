const formManager = {
    myme: document.querySelector("main.myme"),
    q: function(data){
        return document.querySelector(data);
    },
    qall: function(data){
        return document.querySelectorAll(data);
    },
    triggetImages: function(){
        let field_me_foto = this.q("#field_me_foto"),
            field_me_input = this.q("#field_eu_foto2"),
            field_my_foto = this.q("#field_my_foto"),
            field_my_input = this.q("#field_meu_foto2");

            field_me_foto.src = "../assets/img/perfil_redondo.png"
            field_my_foto.src = "../assets/img/perfil_quadrado.png"

            field_me_foto.addEventListener("click", function(){
                field_me_input.click();
            });

            field_me_input.addEventListener("change", function(es){
                if (es.target.files && es.target.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        field_me_foto.src =  e.target.result;
                    }
                    reader.readAsDataURL(es.target.files[0]);
                }
            });

            field_my_foto.addEventListener("click", function(){
                field_my_input.click();
            });

            field_my_input.addEventListener("change", function(es){
                if (es.target.files && es.target.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        field_my_foto.src =  e.target.result;
                    }
                    reader.readAsDataURL(es.target.files[0]);
                }
            });
    },
    termsValidate: function(){
        if(this.q(".usado")) return;
        let terms = this.q("#field_terms"),
            submit = this.q("button[type='submit']");

            terms.addEventListener("change", function(e){
                if(e.target.checked){
                    submit.disabled = false;
                    submit.addEventListener("click", function(e){
                        e.target.children[0].style.display = "inline-block";
                    });
                }else{
                    submit.disabled = true;
                    submit.removeEventListener('click', myFunction, false);
                }
            });
    },
    disableAllInputs: function(){
        if(!this.q(".usado")) return;
        let inputs = this.qall("input,textarea");
        inputs.forEach(function(item){
            item.readOnly = true;
        })
    },
    checkIfEnabled: function(){
        if(this.myme.classList.contains("usado")){
            document.querySelector(".edit").remove();
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
                    let ta = document.createElement("a");
                        ta.href = `tel:${tel}`;
                        ta.classList.add("tel-button");
                    document.body.append(ta);
                    let taa = document.querySelector(".tel-button");
                    taa.click();
                    setTimeout(() => taa.remove(), 1000);
                })
            });

        let help = document.querySelectorAll(".help li");
            help.forEach(function(item){
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
                    let ta = document.createElement("a");
                        ta.href = `tel:${tel}`;
                        ta.classList.add("help-tel-button");
                    document.body.append(ta);
                    let taa = document.querySelector(".help-tel-button");
                    taa.click();
                    setTimeout(() => taa.remove(), 1000);
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