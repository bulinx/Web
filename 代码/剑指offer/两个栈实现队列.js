var CQueue = function(){

    this.stack1 = [];
    this.stack2 = [];
    // 队列

};
CQueue.prototype.appendtail = function(value){
    this.stack1.push(value);

};

CQueue.prototype.deletHead = function(value){
    if(this.stack2.length){
        return this.stack2.pop();
    }else{
        while(this.stack1.length){
            this.stack2.push(this.stack1.pop());
        }
        if(!this.stack2.length){
            return -1;
        }
        else{
            return this.stack2.pop();
        }
    }

};

// 两个栈模拟实现一个队列的作用
// 栈先进后出 队列先进先出

