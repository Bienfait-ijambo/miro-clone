import { RouteLocationNormalizedLoaded } from "vue-router";
import { ref } from 'vue'
import { makeHttpReq2 } from '../../../../../helper/makeHttpReq';
import { getUserData } from "../../../../../helper/auth";
import { App } from "../../../../../app/app";
import { showError } from "../../../../../helper/toastnotification";



export function useAddJoinees(route: RouteLocationNormalizedLoaded){

    const loading=ref(false)
    const userData=getUserData()
    const projectCode=route?.query?.project_code as string

    async function addJoinees(){
        

        try {
            loading.value = true
            const data = await makeHttpReq2<{
                projectCode:string
                userId:string
            }, {
                message:string,
                status:boolean
            }>
            (`joinees`, 'POST',{
                projectCode:projectCode,
                userId:userData?.user?.userId as string
            })
            console.log(data)

            if(data.status){
                // http://127.0.0.1:8000/app/add_joinees?project_code=BJDfgJLrje-1730775993
                // http://127.0.0.1:8000/app/project-boards?project_code=BJDfgJLrje-1730775993
                window.location.href=App.baseUrl+'/app/project-boards?project_code='+projectCode
            }
            loading.value = false
          } catch (error) {
            showError((error as Error).message)
            loading.value = false
          }

    }


    return {addJoinees,loading}
}