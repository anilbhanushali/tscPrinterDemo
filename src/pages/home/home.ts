import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/Bluetooth-Serial';

interface MyWindow extends Window {
  TscPrinter: any;
}
declare var window: MyWindow;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [BluetoothSerial]
})
export class HomePage {

  macAddress: String;
  constructor(public navCtrl: NavController,
    private _bluetooth: BluetoothSerial,
    private alertCtrl: AlertController) {

  }

  showListOfDevice() {
    this._bluetooth.list()
      .then(result => {
        console.log(result);
        // address: "00:19:0E:A0:9F:E6"
        // class: 7936
        // id: "00:19:0E:A0:9F:E6"
        // name: "Alpha4L"
        this.selectDevices(result);
      })
      .catch(err => {
        console.log(err);
      })
  }

  selectDevices(devices) {

    let alert = this.alertCtrl.create();
    alert.setTitle('Lightsaber color');

    devices.forEach(element => {
      alert.addInput({
        type: 'radio',
        label: element.name,
        value: element.address,
        checked: false
      });
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        console.log('Radio data:', data);
        this.saveDevice(data);
      }
    });
    alert.present();
  }

  printBarCode() {
    if (window.TscPrinter) {
      window.TscPrinter.printBarCode([
        100,
        100,
        "128",
        100,
        1,
        0,
        3,
        3,
        "123456789"
      ],
        result => {
          console.log(result);
        },
        err => {
          console.log(err);
        })
    } else {
      console.error('Cordova Plugin Not Loaded');
    }
  }

  saveDevice(macAddress) {
    this.macAddress = macAddress;
  }

  connectPrinter() {
    if (window.TscPrinter) {
      window.TscPrinter.connectPrinter(this.macAddress, result => {
        console.log(result);
      }, err => {
        console.log(err)
      })
    } else {
      console.error('Cordova Plugin Not Loaded');
    }
  }
}
