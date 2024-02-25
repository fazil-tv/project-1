function changeProductStatus(orderId, productId) {
   
    const statusElementId = `${orderId}${productId}`;
    const newstatus = document.getElementById(statusElementId).value;

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


function addwishlist() {
    try {
        fetch('/admin/getwishlist', {
            method: 'POST',
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


function applyfilter() {
    const selectedvalue = document.getElementById("selectoption").value;


    const startDate = document.getElementById("startDate").value
    const endDate = document.getElementById("endDate").value

    try {
        fetch('/admin/salesfilter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                selectedvalue,
                startDate,
                endDate
                

            })
        })
            .then(response => response.json())
            .then(data => {
               
                if (data && data.orderData) {

                    const tableBody = document.getElementById('table-body');
                    tableBody.innerHTML = '';

                  


                    data.orderData.forEach((order,index) => {
                        order.index = index
                      
                        appendOrderToTable(order,index);


                    });
                }
            }).catch(error => {
                console.log(error);

            })
    } catch (error) {
        console.log(error)

    }





}


