import { RouteLocationNormalizedLoaded } from "vue-router";
import { makeHttpReq2 } from "../../../../../helper/makeHttpReq";
import { ref } from "vue";
import { userResponseType } from "../../../../auth/actions/tokenTypes";
import { showError } from "../../../../../helper/toastnotification";
import { yDocStore } from "../../../../../store/yDoc";
import { getUserData, LoginResponseType } from "../../../../../helper/auth";

export interface IProjectDetail {
    id: number;
    name: string;
    image: string;
    projectCode: string;
    userId: number;
}
export function useGetProjectDetail(route: RouteLocationNormalizedLoaded,userData:LoginResponseType| undefined) {
    const project_code = route?.query?.project_code;
    const loading = ref(false);
    const showJoinneesModal = ref(false);
    const sendId=userData?.user?.userId

    const projectData = ref<IProjectDetail>({} as IProjectDetail);

    async function getProjectDetail() {
        try {
            loading.value = true;
            const data = await makeHttpReq2<
                undefined,
                IProjectDetail | Array<any>
            >(`projects/detail?project_code=${project_code}&sendId=${sendId}`, "GET");

            if (!Array.isArray(data)) {
                projectData.value = data;
                knowWhoIsTyping()
            } else {
                window.location.href = "/app/projects";
            }

            loading.value = false;
        } catch (error) {
            showError((error as Error).message);
            loading.value = false;
        }
    }


    function knowWhoIsTyping() {
      
       
      window.Echo.private(`typing.${sendId}`)
          .listen("UserTypingEvent", (e: any) => {
              console.log("message here :", e);
              
          })
          .listenForWhisper("typing", (e:any) => {
            yDocStore.cursor.typingUser=e.name
              console.log(e.name, " is typing...");
          }).error((error: any) => {
            console.log(error);
            localStorage.clear();
            window.location.href = "/app/login";
        });
  
}


    function leavingUsers(joinee: userResponseType) {
        const filteredArray = yDocStore.joinees.filter(
            (user) => user.id !== joinee.id
        );
        yDocStore.joinees = [];
        yDocStore.joinees = [...filteredArray];
    }

    function joiningUsers(joinee: userResponseType) {
        const filteredArray = yDocStore.joinees.filter(
            (user) => user.id === joinee.id
        );
        if (filteredArray.length === 0) {
            yDocStore.joinees.push(joinee);
        }
    }

    function showJoiningUsersModal() {
        showJoinneesModal.value = true;
    }
    function hideJoiningUsersModal() {
        showJoinneesModal.value = false;
    }

  

    function trackJoinAndLeavingUsers() {
        window.Echo.join(`project.room.${project_code}`)
            .here((users: userResponseType[]) => {
                yDocStore.joinees = [...users];

            })
            .joining((user: userResponseType) => {
                joiningUsers(user);
            })
            .leaving((user: userResponseType) => {
                leavingUsers(user);
            })
            .error((error: any) => {
                console.log(error);
                localStorage.clear();
                window.location.href = "/app/login";
            });
    }

    return {
        getProjectDetail,
        projectData,
        showJoiningUsersModal,
        hideJoiningUsersModal,
        loading,
        showJoinneesModal,
        trackJoinAndLeavingUsers,
    
    };
}
