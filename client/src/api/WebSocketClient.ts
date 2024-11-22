class WebSocketClient {
    
    private socket: WebSocket;
    private url: string;
    private onMessage: (me:any)=>any;
    
    constructor(url: string, onMessage:(me:MessageEvent<any>)=>any) {

       // console.log("constructor WebSocketClient");

        this.url = url;
        this.socket = new WebSocket(this.url);
        this.onMessage= onMessage;   
        this.setupEventListeners();

    }

    private setupEventListeners() {
        this.socket.onopen = () => {
            console.log('Соединение установлено');
        };

        this.socket.onmessage = (event) => {   
            console.log('Получено сообщение:', event);
            this.onMessage(event)
        };

        this.socket.onclose = (event) => {
            console.log('Соединение закрыто:', event);
        };

        this.socket.onerror = (error) => {
            console.error('Ошибка соединения:', error);
        };
    }

    public sendMessage(message: string) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
            console.log('Сообщение отправлено:', message);
        } else {
            console.error('Соединение не открыто');
        }
    }

    public isOpen():boolean {
        return (this.socket.readyState === WebSocket.OPEN) 
    }


    public closeConnection() {
        this.socket.close();
        console.log('Соединение закрыто');
    }

    public getUrl(){
        return this.url
    }
}

export default WebSocketClient