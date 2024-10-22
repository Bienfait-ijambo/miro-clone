


export function __debounce<T>(cb:(fn:(...args:any[])=>T)=>T,delay:number){

    let debounceTimer:any
    return function(fn:(...args:any[])=>T){
        clearTimeout(debounceTimer);
        debounceTimer=setTimeout(()=>cb(fn),delay)

    }

}

export  async function runFuncSequentially( functions: (() => any | Promise<any>)[] ) {
    for (const func of functions) {
        await func();
    }
}

