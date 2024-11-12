import { ref } from "vue";
import { yDocStore } from "./../../../../../store/yDoc";
import { LoginResponseType } from "../../../../../helper/auth";
export function useShareUserCursor(userData:LoginResponseType|undefined) {


    function trackMousePosition(event: any) {
        const userName=userData?.user?.name
        yDocStore.mousePosition.x = event.clientX;
        yDocStore.mousePosition.y = event.clientY;
        yDocStore.mousePosition.userName = userName as string



        yDocStore.yMouse.set("x", event.clientX);
        yDocStore.yMouse.set("y", event.clientY);
        yDocStore.yMouse.set("userName", userName);



      
    }

    return {
        trackMousePosition,
        
    };
}
