import { _decorator } from 'cc';
const { ccclass } = _decorator;

export class NetworkManager {
    private static _instance: NetworkManager;
    public static get Instance(): NetworkManager {
        if (!this._instance) {
            this._instance = new NetworkManager();
        }
        return this._instance;
    }

    public async connect(): Promise<void> {
        // TODO: 实现网络连接逻辑
    }

    public async call(func: string, data: any): Promise<any> {
        // TODO: 实现RPC调用逻辑
        return null;
    }
} 