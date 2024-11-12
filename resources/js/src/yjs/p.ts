import { WebsocketProvider } from "y-websocket";
import { yDocStore } from "../store/yDoc";

export function pr(projectCode:string,){
    const provider=new WebsocketProvider(
        "ws://localhost:1234",
        `sv000013-${projectCode}`,
        yDocStore.doc
    );
    
    provider.on('sync', () =>{
        yDocStore.loading=false
        console.log('document is synchronized....');
    })

    return {provider}
}
