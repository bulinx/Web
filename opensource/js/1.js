/**
 * Created by wcs on 2016/9/9.
 */
window.onload=function(){

    //     ��ȡ��Ҫ�õ��ı�ǩ
        var video=document.querySelector('video');
    //������ͣ
        var playBtn=document.querySelector('.switch');
    //     ������
        var progress=document.querySelector('.progress');
    //    ��ǰ������
        var currProgress=document.querySelector('.curr-progress');
    //    ��ǰʱ��
        var currentTime=document.querySelector('.current-time');
    //    ��ʱ��
        var totalTime=document.querySelector('.total-time');
    //    ȫ����ť
        var extend=document.querySelector('.extend');
    
    
        var tTime=0;
    //��������˼·
    //    ��һ�� ��� ��ʼ��ť ʵ�ֲ�����ͣ
    //    ��ȡ��ʱ����������ʱ�������ʽ��ʾ����
    //    ����Ƶ���ź� ���½����� �� ��ǰʱ��
    //    ���ȫ�����л�ȫ��״̬
    
    
        //    ��һ�� ��� ��ʼ��ť ʵ�ֲ�����ͣ����ť�ϵ�logҲҪ�ı�
        playBtn.onclick=function(){
            // video.paused ��Ƶ����ͣ״̬  true ��ͣ ��false ����
            if(video.paused){
                video.play();
                //�ı�log
                this.classList.remove('icon-play');
                this.classList.add('icon-pause');
            }else{
                video.pause();
                //�ı�log
                this.classList.remove('icon-pause');
                this.classList.add('icon-play');
            }
        }
    
    //    ��ȡ��Ƶ����ʱ�� ������ʾ
    //    ������Ƶ������ɵ��¼�
        video.oncanplay=function(){
            // duration ��ȡ��Ƶ����ʱ��
            tTime=video.duration;
            console.log(tTime);
    
        //    ����ʱ��ת����ʱ����
            var h=Math.floor(tTime/3600);
            var m=Math.floor(tTime%3600/60);
            var s=Math.floor(tTime%60);
    
        //    ʱ���� 00:00:00  1 2  01:02:23 ��ʱ��ƴ�ӳ�ָ���ĸ�ʽ
    
             h=h<10?'0'+h:h;
             m=m<10?'0'+m:m;
             s=s<10?'0'+s:s;
    
        //    ���ø� ��ʱ��
            console.log(h+":"+m+":"+s);
            totalTime.innerHTML=h+":"+m+":"+s;
        }
    
    
    //    ��ʱ��Ƶ���ŵ�ʱ�򣬸ı�������͵�ǰʱ��
    //    ����Ƶ����ʱ����µ��¼�
        video.ontimeupdate=function(){
            //��ȡ��Ƶ��ǰ����ʱ��
            var cTime=video.currentTime;
            console.log(cTime);
    
            //    ����ʱ��ת����ʱ����
            var h=Math.floor(cTime/3600);
            var m=Math.floor(cTime%3600/60);
            var s=Math.floor(cTime%60);
    
            //    ʱ���� 00:00:00  1 2  01:02:23 ��ʱ��ƴ�ӳ�ָ���ĸ�ʽ
    
            h=h<10?'0'+h:h;
            m=m<10?'0'+m:m;
            s=s<10?'0'+s:s;
            // ����ǰ���ŵ�ʵ�� ���µ� �ؼ���
            currentTime.innerHTML=h+":"+m+":"+s;
    
            //���������� �õ�ǰ��ʱ��/��ʱ�� *100%
    
            var value=cTime/tTime;
            // �ѵ�ǰ���ŵı��� ��ֵ��������
            currProgress.style.width=value*100+'%';
    
        }
    
    //    ȫ��
        extend.onclick=function(){
            video.webkitRequestFullScreen();
        }
    
    
    }