const formManager = {
    myme: document.querySelector("main.myme"),
    q: function(data){
        return document.querySelector(data);
    },
    triggetImages: function(){
        let field_me_foto = this.q("#field_me_foto"),
            field_me_input = this.q("#field_eu_foto"),
            field_my_foto = this.q("#field_my_foto"),
            field_my_input = this.q("#field_meu_foto");

            field_me_foto.src = "https://image.flaticon.com/icons/png/512/1692/1692911.png"
            field_my_foto.src = "https://image.flaticon.com/icons/png/512/1692/1692911.png"

            field_me_foto.addEventListener("click", function(){
                field_me_input.click();
            });

            field_my_foto.addEventListener("click", function(){
                field_my_input.click();
            });
    },
    termsValidate: function(){
        let terms = this.q("#field_terms"),
            submit = this.q("button[type='submit']");

            terms.addEventListener("change", function(e){
                if(e.target.checked){
                    submit.disabled = false;
                }else{
                    submit.disabled = true;
                }
            });
    },
    checkIfEnabled: function(){
        if(this.myme.classList.contains("usado")){
            document.querySelector(".edit").remove();
        }else{
            document.querySelector(".help").remove();
            this.triggetImages();
        }
    },
    init: function(){
        this.checkIfEnabled();
        this.termsValidate();
    }
}

window.addEventListener("load", formManager.init())