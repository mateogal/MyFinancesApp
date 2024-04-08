const API_KEY = process.env.CMC_API_KEY

const axios = require('axios');

const getLatest = async (req, res) => {
    const request = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',{
        params: {
            'start': '1',
            'limit': '5000',
            'convert': 'USD'
        },
        headers: {
            'X-CMC_PRO_API_KEY': API_KEY
        },
        json: true
    })
    res.send(request.data)
}

const getCrypto = async (crypto) => {
    try{
        const request = await axios.get(' https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',{
            params: {
                'symbol': crypto,
            },
            headers: {
                'X-CMC_PRO_API_KEY': API_KEY
            },
            json: true
        })
        return request.data
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getLatest,
    getCrypto
}