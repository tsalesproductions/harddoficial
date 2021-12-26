$fileconverted = [];
class xlsxConverter{
    sendToDatabase(){
        if($fileconverted.length <= 0) return alert("Nenhuma linha encontrada na planilha ou houve algum erro ao enviar, por favor, recarregue a página e tente novamente");

        $.ajax({
            url: '/construtora/upload',
            type: 'post',
            data: {files: JSON.stringify($fileconverted)},
            dataType: 'json',
            beforeSend: function(){
                NProgress.set(0.1);
                $("button#addFile").text("Enviando tabela").prop("disabled", true);
                $("pre#erro").hide()
            },
            success: function(response){
                NProgress.set(1.0);
                $("button#addFile").text("Tabela enviada").prop("disabled", false).removeClass("bg-gradient-info").removeClass("bg-gradient-danger").addClass("bg-gradient-success")
                $("pre#erro").hide()
                if(!response.status) return alert(response.msg);
                alert(response.msg);
                window.location.reload(true);
            },
          }).fail(function(e) {
            NProgress.set(1.0);
            $("button#addFile").text("Erro ao enviar a tabela").prop("disabled", false).removeClass("bg-gradient-info").removeClass("bg-gradient-success").addClass("bg-gradient-danger")
            $("pre#erro").html(JSON.stringify(e,undefined,4)).show();
          })
    }
    convertFile(){
        let self = this;
        let selectedFile;

        document.getElementById('funcionarios').addEventListener("change", (event) => {
            selectedFile = event.target.files[0];
        })

        let data = [];

        document.getElementById('addFile').addEventListener("click", () => {
            XLSX.utils.json_to_sheet(data, 'out.xlsx');
            if(selectedFile){
                let fileReader = new FileReader();
                fileReader.readAsBinaryString(selectedFile);
                fileReader.onload = (event)=>{
                    let data = event.target.result;
                    let workbook = XLSX.read(data,{type:"binary"});
                    for(let sheet of workbook.SheetNames){
                        let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                        $fileconverted = rowObject;
                    }

                    self.sendToDatabase();
                }

                
            }
        });
    }
    init(){
        this.convertFile();
    }
}

window.addEventListener("load", new xlsxConverter().init());


