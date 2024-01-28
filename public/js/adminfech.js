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



// function addbanner() {
//     try {

//         const title = document.getElementById("title").value;
//         const description = document.getElementById("description").value;
//         const targeturl = document.getElementById("targeturl").value;
//         const image1 = document.getElementById("imageinput1").value;
//         const image2 = document.getElementById("imageinput2").value;

//         // const title = req.body.title;
//         // const description = req.body.description;
//         // // image: req.file.originalname
//         // const targeturl = req.body.targeturl;

//         console.log(title, description, targeturl,image1,image2);

//         fetch('/admin/addbanner', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 title,
//                 description,
//                 targeturl,
//                 image1,
//                 image2
//             })
//         })
//             .then(response => response.json())
//             .then(data => {

//                 if (data.status === "success") {
//                     Swal.fire({
//                         icon: 'success',
//                         title: 'Order Cancelled',

//                     });
//                 }

//                 window.location.reload();

//             }).catch(error => {
//                 console.log(error);

//             })
//     } catch (error) {

//     }
// }