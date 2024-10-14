


export function __debounce<T>(cb:(fn:(...args:any[])=>T)=>T,delay:number){

    let debounceTimer:any
    return function(fn:(...args:any[])=>T){
        clearTimeout(debounceTimer);
        debounceTimer=setTimeout(()=>cb(fn),delay)

    }

}

