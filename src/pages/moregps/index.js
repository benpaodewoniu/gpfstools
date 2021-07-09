import "@pages/common/common"
import "./index.css"
import Web3 from "web3"
import Tx from "ethereumjs-tx"
import {privateToAddress} from "ethereumjs-util"

let w3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org"));

let ncount = 0;

const sendgps = (privatekey, val, address) => {
    let publicaddress = "0x" + privateToAddress(new Buffer(privatekey, 'hex')).toString('hex')
    w3.eth.getBalance(publicaddress, ((error, balance) => {
        if (error) {
            return
        }
        console.log(balance);

        w3.eth.getTransactionCount(publicaddress, ((error, count) => {
            if (error) {
                return
            }
            console.log(count);
            ncount = count;

            let rawTx = {
                from: publicaddress,
                to: address,
                value: w3.utils.toHex(w3.utils.toWei(parseFloat(val), 'ether')),
                nonce: w3.utils.toHex(count),
                gasLimit: w3.utils.toHex(100000),
                gasPrice: w3.utils.toHex(w3.utils.toWei('5', 'gwei')),
            }

            let tx = new Tx(rawTx);
            tx.sign(new Buffer(privatekey, 'hex'));
            let serializedTx = tx.serialize();
            let raw = '0x' + serializedTx.toString('hex')
            w3.eth.sendSignedTransaction(raw, (err, txHash) => {
                console.log('txHash:', txHash)
                console.log(err)
            })
        }))
    }))
}

$("#submit").click(() => {
    let privatekey = $("#private").val()
    console.log(privatekey)
    let addresses_vals = $("#addresses").val();
    let addresses = addresses_vals.split(/\s+/)
    let val = parseFloat($("#val").val())
    for (let address of addresses) {
        // sendbnb(privatekey, val, address)
    }
})
