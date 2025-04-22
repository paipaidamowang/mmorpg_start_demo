import { _decorator, Component, Node, EditBox, Label } from 'cc';
import Crypt from 'jsencrypt';
import { PublicKey } from '../common';
const { ccclass, property } = _decorator;

const crypt = new Crypt();
crypt.setKey(PublicKey);

@ccclass('LoginManager')
export class LoginManager extends Component {
    @property(Label)
    statusLabel: Label = null;

    account: EditBox;
    password: EditBox;

    onLoad() {
        this.account = this.node.getChildByName("Account").getComponent(EditBox);
        this.password = this.node.getChildByName("Password").getComponent(EditBox);
    }

    async register() {
        const account = crypt.encrypt(this.account.string);
        const password = crypt.encrypt(this.password.string);

        console.log(account, password);

        const res = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                account,
                password,
            }),
        }).then((response) => response.json())

        console.log(res);
    }

    private updateStatus(message: string) {
        if (this.statusLabel) {
            this.statusLabel.string = message;
        }
    }
}


