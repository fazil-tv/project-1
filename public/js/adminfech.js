function changeProductStatus(orderId, productId) {
    const statusElementId = `${orderId}${productId}`;
    const newstatus = document.getElementById(statusElementId).value;



    // const newstatus = document.getElementById("newstatus").value
    console.log(orderId,productId,newstatus);


    try{
        fetch('/admin/updatestatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId,
                productId,
                newstatus
    
            })  
        })
            .then(response => response.json())
            .then(data => {

                if(data.success === true){
                       window.location.reload();

                // $('#relodedive').load('/detaile #relodedive');

                }
    
             
    
            }).catch(error => {
                console.log(error);
    
            })

    }catch(errr){
        console.log(errr);
    }





}