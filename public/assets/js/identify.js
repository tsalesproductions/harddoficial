const identify = {
    checkIfHasPassword: function(){
        function toggleManager(){
            if(toggle.checked){
                passInput.required = false;
                passInput.parentElement.style.display = "none"
            }else{
                passInput.required = true;
                passInput.parentElement.style.display = "block"
            }
        }

        let toggle = document.querySelector(".field-nopass input");
        let passInput = document.querySelector("input[type='password']");

        
        if(!toggle) return;
        
        toggleManager(toggle, passInput);

        toggle.addEventListener("change", function(e){
            if(e.target.checked){
                passInput.required = false;
                passInput.parentElement.style.display = "none"
            }else{
                passInput.required = true;
                passInput.parentElement.style.display = "block"
            }
        });
    },

    init: function (){
        this.checkIfHasPassword();
    }
}

window.addEventListener("load", function(){
    identify.init();
})