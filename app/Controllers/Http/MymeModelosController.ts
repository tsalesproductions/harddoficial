import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import QrData from 'App/Models/QrCode';

const QRCode = require('qrcode');
var axios = require('axios');
const { createCanvas, loadImage } = require("canvas");

export default class MymeModelosController {
  private async create(dataForQRcode, center_image, width, cwidth) {
    const canvas = createCanvas(width, width);
    QRCode.toCanvas(
      canvas,
      dataForQRcode,
      {
        errorCorrectionLevel: "H",
        margin: 1,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      }
    );
  
    const ctx = canvas.getContext("2d");
    const img = await loadImage(center_image);
    const center = (width - cwidth) / 2;
    ctx.drawImage(img, center, center, cwidth, cwidth);
    return canvas.toDataURL("image/png", {width: 140});
  }

  private async searchInDatabase(term, field){
    return await QrData.findBy(term, field);
  }

  public async generateCode(url, modo, prefeitura){
    return this.switchModel(url, modo, prefeitura);
    // return await QRCode.toDataURL(url, {width: 140});
  }

  public async generateId(){
    let id = "HM"+Math.floor(Math.random() * 9999999) + 1;
    let search = await this.searchInDatabase('qr_id', id);
    
    if(search){
     this.generateId();
    }else{
      return id;
    }
  }

  private async getBase64FromUrl(url) {
    let image = await axios.get("https://painel.hardd.com.br/"+url, {responseType: 'arraybuffer'});
    let raw = Buffer.from(image.data).toString('base64');
    return "data:" + image.headers["content-type"] + ";base64,"+raw;
  }

  public async switchModel (url, modo, prefeitura) {
    if(!modo) return;
    switch(modo){
      case "default":
        return await QRCode.toDataURL(url, {width: 140});
      break;

      case "prefeitura":
        // let logo = await this.getBase64FromUrl(prefeitura);
        
        return await this.create(
          url,
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAACkHAAApBwHVmLH7AAAD9ElEQVRogdVaT0gUURj/CqFk3DU38M9BD2rZxUrDtTJJO0QdNBMpEeyQ1UoUmWFEZKZWt9CjEl0KVykxSfBPl4oySFJL8VCpByNXNzA7hEGHiW/YN7z5t/v2zazr/GCYed97zH4/5vvzezMLoijicUcUxVXRPlgN+Ayb8AIAmsCeaEYCqwAQb1MCv5GASEY9Xi+8fvVGnu142BktxxSoPe+Rh0XFh6Gyqkoex9AL0fme3meQtSMzOp4aYPLzpDTx5dusdDYkgEDnP4yNRddjFYg/+W63Zm5zVD2zAIocsCM0IWQlXg4NQ1/fc8Ud1UmIuN96FxYWvitsnloP5OzLDe1NJFuXb9EnpqamiTFbtspH/LYEyU4wMjikmMfDnZfH/BsRJYDo7urSOFh1ulKeR2fVBCc+jjPfP+IEEOiwmgQSu9fSqrE31F8L695MSTw5PgGdHdqmVl5+Eo4ePyaP6YZDx3xR8RFw5+eDz++X7Tsz0uHHog/+rK3Jttzd2eGXcBaWemGgDgWjNZ5zF4LO84YOgak+8Gl6Sr6mJYgesPKcKisznL9eX89WdVQwReDr3Dws+Zaka9Lug+FBWxukJCZqVhQe2A83G29x+WC6E/f19krnianpkGuTU5LhRkODxu71dnP/PhcBTECC0dFRScXqzenBtd2lsSIxXnAR2Ju9W77GPKDjn55bD3ARKCgokK8xD96+f6c7tx7g0kIYBhgq6DwhQVBeUQFXdOKcICtrF9RUn7GMGreYw1ChHYdA/IeK559+v1SxkhKTYNm/zPvzMrgJlJSWwNP+foWNJf5Xfq1IFUuInVV0YV5wl1G1JIYw4l+IjQWnwyGdo0YAAtqFBsY/C1D/oC7Cs2CSBFMIuRJcCmdxjDhRUirbMKZJ/NNr09JSDe8lCALECXGmCDCpUdxZNTbd1tiv1tUpQklv040kZ2ZmYHZ+jtmpzPQM6Oph685MT4AknhoDLwZkAtiN9dbk7MmRnGeRGjxYNzUaKZja1BM1irHPokYJMAfwyRhBnTfBYPqtBKrRi5cvhRUi6LxVry25CNAyAtUorTDpOSMMjgzrJjxBa3OLYqtqOQFaRmAeOBxO3TkjYA+g98dqYNFghe3VKBcBokYJ1Go0FFCN/vu7ZnjoyRRLCSAKDx7S2FjUqNXgrkL4vufRk8cKG+tuDEuu3jskGqxVipsAPubqszUKG2v8Y8kNVXZZCURFjVoJpieg3gbiGAJijkgIp9Mhxz+9FkMNO2uwzmsGtv/AoQghTKxgHTLaQN/UyW/7b2SaHMBPmeQpbJSvlcQf9E2dSwoCmHAbEcRpPKt9tP1fDTAH2jeAI7xot/ffbUQR/gNCYEYZpC9THgAAAABJRU5ErkJggg==",
          150,
          50
        );
      break;
    }
  }
}
