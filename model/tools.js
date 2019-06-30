/**
 * Created by Administrator on 2018/3/21 0021.
 */
var md5 = require('md5');

let tools={

    getTime(){

        return new Date()
    },
    md5(str){
        return md5(str)
    },
    cateToList(data){
        var firstArr=[];

        for(var i=0;i<data.length;i++){
            if(data[i].pid=='0'){
                firstArr.push(data[i]);
            }
        }
        for(var i=0;i<firstArr.length;i++){

            firstArr[i].list=[];
            //����?��?��????????  ????????????pid?????��?��??????_id
            for(var j=0;j<data.length;j++){
                if(firstArr[i]._id==data[j].pid){
                    firstArr[i].list.push(data[j]);
                }
            }

        }
        console.log(firstArr);

        return firstArr;
    },
    panoramaCate(genre,data){

        var panoramaArr=[];

        for(var i=0;i<genre.length;i++){
            panoramaArr.push(genre[i]);
           // console.log(panoramaArr[i]);
        }
        for(var i=0;i<panoramaArr.length;i++){

            panoramaArr[i].list=[];

            for(var j=0;j<data.length;j++){
                if(panoramaArr[i]._id==data[j].genreId){
                    panoramaArr[i].list.push(data[j]);
                }
            }

        }


        return panoramaArr;
    },
    createSixNum(){
        var Num="";
        for(var i=0;i<6;i++)
        {
            Num+=Math.floor(Math.random()*10);
        }
        return Num;
    }
}

module.exports=tools;