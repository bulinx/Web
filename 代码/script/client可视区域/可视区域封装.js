function client(){
    if (window.innerHeight !== undefined){
              //ie9及其以上的版本的写法
        return{
        "width": window.innerWidth,
        "height": window.innerHeight
    }
} else if (document.compatMode === "CSS1Compat") {
    //标准模式的写法（有DTD时）
    return {
        "width": document.documentElement.clientWidth,
        "height": document.documentElement.clientHeight
    }
} else {
    //没有DTD时的写法
    return {
        "width": document.body.clientWidth,
        "height": document.body.clientHeight
    }
}
}
