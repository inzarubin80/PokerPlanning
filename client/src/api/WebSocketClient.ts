import { authAxios } from '../service/http-common';


class WebSocketClient {

    private socket: WebSocket | null = null;
    private url: string;
    private onMessage: (me: MessageEvent<any>) => any;
    private reconnectInterval: number = 5000; // Интервал переподключения в миллисекундах
    private maxReconnectAttempts: number = 100000; // Максимальное количество попыток переподключения
    private reconnectAttempts: number = 0; // Текущее количество попыток переподключения
    private isManualClose: boolean = false; // Флаг для определения, было ли соединение закрыто вручную

    constructor(url: string, onMessage: (me: MessageEvent<any>) => any) {
        this.url = url;
        this.onMessage = onMessage;
        this.connect();
    }

    private connect() {
        this.socket = new WebSocket(this.url);
        this.setupEventListeners();
        console.log('Попытка подключения к:', this.url);
    }

    private setupEventListeners() {
        if (!this.socket) return;

        this.socket.onopen = () => {
            console.log('Соединение установлено');
            this.reconnectAttempts = 0; // Сбрасываем счетчик попыток
        };

        this.socket.onmessage = (event) => {
        
            this.onMessage(event);
        };

        this.socket.onclose = (event) => {
            if (this.isManualClose) {
                console.log('Соединение закрыто вручную:', event);
            } else {
                console.log('Соединение закрыто, попытка переподключения...', event);
                this.reconnect();
            }
        };

        this.socket.onerror = (error) => {
            console.error('Ошибка соединения:', error);
        };
    }

    private reconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Превышено максимальное количество попыток переподключения');
            return;
        }
    
        authAxios.get(`/ping`)
            .then(() => {
                // Если запрос успешен, можно выполнить какие-то действия
                console.log('Ping successful');
            })
            .catch((error) => {
                console.error('Ping failed:', error.message);   
            });


            this.reconnectAttempts++;
            console.log(`Следующая попытка переподключения через ${this.reconnectInterval} мс (попытка ${this.reconnectAttempts})`);

            setTimeout(() => {
                this.connect();
            }, this.reconnectInterval);

    }

    public sendMessage(message: string) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
            console.log('Сообщение отправлено:', message);
        } else {
            console.error('Соединение не открыто');
        }
    }

    public isOpen(): boolean {
        return this.socket?.readyState === WebSocket.OPEN;
    }

    public closeConnection() {
        this.isManualClose = true;
        if (this.socket) {
            this.socket.close();
            console.log('Соединение закрыто');
        }
    }

    public getUrl() {
        return this.url;
    }
}

export default WebSocketClient;