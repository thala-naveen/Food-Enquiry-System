

$(document).ready(function(){
    $.getJSON('/food/fetchallcategory',function(data){
        
        data.map((item)=>{
            $('#categoryname').append($('<option>').text(item.categoryname).val(item.categoryid))       
        })

        $('#categoryname').formSelect();

    });

    $('#categoryname').change(function(data){

        $('#foodname').empty()

        $('#foodname').append($('<option disabled selected>').text('choose your food'));

        $.getJSON('/food/fetchallfood',{categoryid:$('#categoryname').val()},function(data){
            
            data.map((item)=>{
                
                $('#foodname').append($('<option>').text(item.foodname).val(item.foodid))
            })
    
            $('#foodname').formSelect();

        })

    })

    $('#btn').click(function(){
        $.getJSON('/food/searchfood',{cid:$('#categoryname').val(),fid:$('#foodname').val()},function(data){
                //alert(JSON.stringify(data))
                if(data.length==0)
                {
                    $('#result').html('<h1>food is not in the menu</h1>')
                }
                else
                {
                    var htm=""
                    htm+="<table class='stripped'><thead><tr><th>Food ID</th><th>Quisine</th><th>Customer name</th><th>Food name</th><th>Veg/Non-veg</th><th>Price</th><th>Offer Price</th><th>Image</th><th>ingredients</th></tr></thead>"
                   
                    data.map((item)=>{

                            htm += "<tbody><tr><td>"+item.foodlistid+"</td><td>"+item.cn+"</td><td>"+item.customername+"</td><td>"+item.fn+"</td><td>"+item.foodtype+"</td><td>"+item.price+"</td><td>"+item.offerprice+"</td><td><img src='/images/"+item.file+"' width=40 ></td><td>"+item.ingredients+"</td></tr></tbody></table>"

                         })

                    $('#result').html(htm)
                }
        })
    })
})