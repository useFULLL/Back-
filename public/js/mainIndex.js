var socket = io();

socket.on('send',function(data){
    if(data){
        var tr_length = $('#top tr').length-1;
        for(i=1;i<=tr_length;i++){
            for(j=0;j<5;j++){
                $("#top tr:eq("+i+") td:eq("+j+")").html(data[j][i-1]);
            }
        }
    }
    console.log(data);
});

socket.on('sendFund',function(data){
    if(data){
        var tr_length = $('#fund tr').length-1;
        for(i=1;i<=tr_length;i++){
            for(j=0;j<5;j++){
                $("#fund tr:eq("+i+") td:eq("+j+")").html(data[j][i-1]);
            }
        }
    }
    console.log(data);
});

socket.on('sendTop',function(data){
    if(data){
        var tr_length = $('#topstock tr').length-1;
        for(i=1;i<=tr_length;i++){
            for(j=0;j<7;j++){
                $("#topstock tr:eq("+i+") td:eq("+j+")").html(data[j][i-1]);
            }
        }
    }
    console.log(data);
});

socket.on('sendOver',function(data){
    if(data){
        var tr_length = $('#overstock tr').length-1;
        for(i=1;i<=tr_length;i++){
            for(j=0;j<5;j++){
                $("#overstock tr:eq("+i+") td:eq("+j+")").html(data[j][i-1]);
            }
        }
    }
    console.log(data);
});