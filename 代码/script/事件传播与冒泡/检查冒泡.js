function event(){
alert("maopao happened")

event = event || window.event;
console.log(event.bubbles);
}

//阻止冒泡
function onclick(){
    alert("child");

    event = event || window.event;
    if(event && event.stopPropagation){
        event.stopPropagation();
    }else{
        event.cancelBubble = true;
    }
}