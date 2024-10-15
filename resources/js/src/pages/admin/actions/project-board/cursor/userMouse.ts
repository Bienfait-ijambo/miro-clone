import { yDocStore } from "./../../../../../store/yDoc";
export function useShareUserCursor() {
    function trackMousePosition(event: any) {

        yDocStore.mousePosition.x = event.clientX;
        yDocStore.mousePosition.y = event.clientY;
        yDocStore.yMouse.set("x", event.clientX);
        yDocStore.yMouse.set("y", event.clientY);
    }

    return {
        trackMousePosition,
    };
}
