import { _decorator, Component, Node, EditBox, Label } from 'cc';
import Crypt from 'jsencrypt';
import { RpcFunc, PublicKey } from '../common';
const { ccclass, property } = _decorator;
import NetworkManager from "../global/NetworkManager";

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

    async login() {
        const account = crypt.encrypt(this.account.string);
        const password = crypt.encrypt(this.password.string);

        console.log(account, password);

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    account,
                    password,
                }),
            });

            const res = await response.json();
            console.log(res);

            if (response.ok) {
                this.updateStatus("登录成功");
                this.connect(res.token);
            } else {
                this.updateStatus(res.error || "登录失败");
            }
        } catch (error) {
            console.error(error);
            this.updateStatus("网络错误，请检查服务器是否启动");
        }
    }

    async connect(token: string) {
        await NetworkManager.Instance.connect();
        const res = await NetworkManager.Instance.call(RpcFunc.enterGame,{
            token,
        });

        
    }

    private updateStatus(message: string) {
        if (this.statusLabel) {
            this.statusLabel.string = message;
        }
    }
}


