function changeProductStatus(orderId, productId) {
    const statusElementId = `${orderId}${productId}`;
    const newstatus = document.getElementById(statusElementId).value;



    // const newstatus = document.getElementById("newstatus").value
    console.log(orderId, productId, newstatus);


    try {
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

                if (data.success === true) {
                    window.location.reload();

                    // $('#relodedive').load('/detaile #relodedive');

                }



            }).catch(error => {
                console.log(error);

            })

    } catch (errr) {
        console.log(errr);
    }





}



function cancelorder(x) {
    const orderId = x;
    console.log(orderId);
    fetch('/orderstatus', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            orderId

        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                Swal.fire({
                    icon: 'success',
                    title: 'Order Cancelled',

                });
            }
            window.location.reload();
        }).catch(error => {
            console.log(error);

        })
}



function blockButton(bannerId) {
    try {
        fetch('/admin/listbanner', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bannerId
            })
        })
            .then(response => response.json())
            .then(data => {

                if (data.status === true || data.status === false) {

                    window.location.reload();
                    // $('#relode-div').load('/detaile #relode-div');

                }


            }).catch(error => {
                console.log(error);

            })
    } catch (error) {

    }
}


