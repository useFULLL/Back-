var socket = io();

socket.on('sendTop',function(data){
    if(data){
        var tr_length = $('#stockList tr').length-1;
        var user_length = $('#userInvest tr').length-1;
        for(i=1;i<=tr_length;i++){
            for(j=0;j<7;j++){
                $("#stockList tr:eq("+i+") td:eq("+j+")").html(data[j][i-1]);
            }

            for(k=1;k<=user_length;k++){
                var name = $("#userInvest tr:eq("+k+") td:eq("+0+")").text();
                if(name == data[0][i-1]){
                    $("#userInvest tr:eq("+k+") td:eq("+1+")").html(data[1][i-1]);
                    $("#userInvest tr:eq("+k+") td:eq("+2+")").html(data[2][i-1]);

                    var total=$("#total").val()*1;
                    var buy = data[6][i-1].replace(",","");
                    var amount = $("#userInvest tr:eq("+k+") td:eq("+5+")").text();
                    var stockPrice = $("#userInvest tr:eq("+k+") td:eq("+6+")").text();

                    $("#userInvest tr:eq("+k+") td:eq("+4+")").html((buy*amount-stockPrice)+"");
                    $("#userInvest tr:eq("+k+") td:eq("+3+")").html((parseFloat(buy*amount-stockPrice)/stockPrice).toFixed(2)+"");
                    
                }
            }
        }
    }
});