function scoll(){// 开始封装自己的scrollTop
    //window.pageYOffset只读属性pageYOffset是 scrollY 的别名。
    if (window.pageYOffset !== undefined){// ie9+ 高版本浏览器
        // 因为 window.pageYOffset 默认的是  0  所以这里需要判断

        return{
            left:window.pageXOffset,
            top:window.pageYOffset
        }

    }
    else if(document.compatMode ==="CSS1Compat"){
        return{
            left:document.documentElement.scrollLeft,
            top:document.documentElement.scrollTop
        }
    }
    return{
        left:document.body.scrollLeft,
        top.document.body.scrollTop
    }
}