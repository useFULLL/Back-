var socket = io();

socket.on('send',function(data){
    //console.log(data);
    if(data){
        var tr_length = $('#topStock tr').length-1;
        for(i=1;i<=tr_length;i++){
            for(j=0;j<5;j++){
                $("#topStock tr:eq("+i+") td:eq("+j+")").html(data[j][i-1]);
            }
        }
    }
});