

export interface IStickyNote{

    id:number
    body:string
    color:string
    dragPosition:{
        x:number
        y:number
    }
    resizePosition:{
        x:number
        y:number
    }
}