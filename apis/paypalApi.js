let baseUrl = 'https://api-m.sandbox.paypal.com';
const base64 = require('base-64');

let clientId = 'AYXoAIEyF0qmXIzabkxEz4QyZtyGLTiZ3NdDcQVFNi38YwTKkGY3r9mDBzRSFTOjS40qriTCqPnKYeY4';
let secretKey = 'ECQni54un8sUnFMVBz3FTo-zPYgJLfDEv3oWlNRiYVpyQ7oEDPUpO8qW2lrIxqwMFCRwhKAQp_g08j5y';





const generateToken = () => {
    var headers = new Headers()
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Authorization", "Basic " + base64.encode(`${clientId}:${secretKey}`));

    var requestOptions = {
        method: 'POST',
        headers: headers,
        body: 'grant_type=client_credentials',
    };

    return new Promise((resolve, reject) => {
        fetch(baseUrl + '/v1/oauth2/token', requestOptions).then(response => response.text()).then(result => {
            console.log("result print", result)
            const { access_token } = JSON.parse(result)
            resolve(access_token)
        }).catch(error => {
            console.log("error raised", error)
            reject(error)
        })
    })
}

const createOrder = (token = '', intent, itemName, description, quantity, amount, currencycode) => {

    let orderDetail = {
        "intent": intent,
        "purchase_units": [
            {
                "items": [
                    {
                        "name": itemName,
                        "description": description,
                        "quantity": quantity,
                        "unit_amount": {
                            "currency_code": currencycode,
                            "value": amount
                        }
                    }
                ],
                "amount": {
                    "currency_code": currencycode,
                    "value": amount,
                    "breakdown": {
                        "item_total": {
                            "currency_code": currencycode,
                            "value": amount
                        }
                    }
                }
            }
        ],
        "application_context": {
            "return_url": "https://example.com/return",
            "cancel_url": "https://example.com/cancel"
        }
    }

    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        },
        body: JSON.stringify(orderDetail)
    };

    return new Promise((resolve, reject) => {
        fetch(baseUrl + '/v2/checkout/orders', requestOptions).then(response => response.text()).then(result => {
            console.log("result print", result)
            const res = JSON.parse(result)
            resolve(res)
        }).catch(error => {
            console.log("error raised", error)
            reject(error)
        })
    })
}

const capturePayment = (id, token = '') => {
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        },
    };

    return new Promise((resolve, reject) => {
        fetch(baseUrl + `/v2/checkout/orders/${id}/capture`, requestOptions).then(response => response.text()).then(result => {
            console.log("result print", result)
            const res = JSON.parse(result)
            resolve(res)
        }).catch(error => {
            console.log("error raised", error)
            reject(error)
        })
    })
}







export default {
    generateToken,
    createOrder,
    capturePayment
}