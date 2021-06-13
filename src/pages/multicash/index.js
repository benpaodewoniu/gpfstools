import "@pages/common/common"
import "./index.css"
import Web3 from "web3"
import axios from "axios";
import Tx from "ethereumjs-tx"

let w3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed4.binance.org"));
let contractAddr = "0x5e772acf0f20b0315391021e0884cb1f1aa4545c";
let tokenContractABI = [
    {
        "constant": true,
        "inputs": [{"name": "who", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [
            {"internalType": "uint256", "name": "cumulativePayout", "type": "uint256"},
            {"internalType": "bytes", "name": "issuerSig", "type": "bytes"}],
        "name": "cashCheque",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }]
let tokenContract = new w3.eth.Contract(tokenContractABI, contractAddr);

const cash_pay = (address, private_key) => {
    tokenContract.methods.balanceOf(address).call().then((balance) => {
        console.log(balance);
    })
}

$("#submit").click(() => {
    $("#hex").empty();
    let addresses_vals = $("#addresses").val();
    let addresses = addresses_vals.split(/\s+/)
    let privates_vals = $("#privates").val();
    let privates = privates_vals.split(/\s+/)
    let threshold = parseFloat($("#threshold").val())
    console.log(threshold)
    if (isNaN(threshold) || threshold === 0) {
        alert("请输入正确的阈值")
        return
    }

    if (addresses.length !== privates.length || addresses[0] === null || addresses[0] === "" || privates[0] === "" || privates[0] === null) {
        alert("地址和私钥数量对应不对")
        return
    }

    for (let i = 0; i < addresses.length; i++) {
        let address = addresses[i]
        let private_key = privates[i]
        if (private_key.startsWith("0x")) {
            private_key = private_key.substr(2);
        }
        if (!w3.utils.isAddress(address)) {
            let element = '<tr><th scope="row">' + 1 + '</th><td>' + 0 + '</td><td>' + address + '</td><td>' + 0 + '</td><td>' + 0 + '</td><td>' + "地址错误" + '</td></tr>'
            $("#hex").append(element)
        }
        w3.eth.getBalance(address, (error, balance) => {
            console.log(balance)
            if (error) {
                let element = '<tr><th scope="row">' + 1 + '</th><td>' + 0 + '</td><td>' + address + '</td><td>' + 0 + '</td><td>' + 0 + '</td><td>' + "意外出错" + '</td></tr>'
                $("#hex").append(element)
                return
            }
            let bnb = w3.utils.fromWei(balance, "ether")
            console.log(bnb)
            if (bnb < 0.0005) {
                let element = '<tr><th scope="row">' + 1 + '</th><td>' + 0 + '</td><td>' + address + '</td><td>' + 0 + '</td><td>' + 0 + '</td><td>' + "燃料费不足" + '</td></tr>'
                $("#hex").append(element)
                return
            }
            let url = "https://api.gpfs.xyz/v1/cheque?address=" + address
            axios.get(url).then((response) => {
                let info = response.data
                if (response.status === 200 && info.msg === "success") {
                    let data = info.data;
                    let amount = data['amount'];
                    let amount_16 = w3.utils.toHex(amount)
                    let paidout = data['paid_out']
                    let paidin = (parseFloat(amount) - parseFloat(paidout)) / 10000
                    let signature = data['signature']
                    let signature_16 = "0x" + signature


                    if (threshold > paidin) {
                        let element = '<tr><th scope="row">' + 1 + '</th><td>' + 0 + '</td><td>' + address + '</td><td>' + 0 + '</td><td>' + 0 + '</td><td>' + "可兑换数量过低" + '</td></tr>'
                        $("#hex").append(element)
                        return
                    }

                    w3.eth.getTransactionCount(address, ((error, count) => {
                        if (error) {
                            let element = '<tr><th scope="row">' + 1 + '</th><td>' + 0 + '</td><td>' + address + '</td><td>' + 0 + '</td><td>' + 0 + '</td><td>' + "未知错误" + '</td></tr>'
                            $("#hex").append(element)
                            return
                        }

                        let rawTx = {
                            from: address,
                            to: '0x5e772acf0f20b0315391021e0884cb1f1aa4545c',
                            value: w3.utils.toHex(w3.utils.toWei('0', 'ether')),
                            nonce: w3.utils.toHex(count),
                            gasLimit: w3.utils.toHex(100000),
                            gasPrice: w3.utils.toHex(w3.utils.toWei('5', 'gwei')),
                            data: tokenContract.methods.cashCheque(amount_16, signature_16).encodeABI()
                        }
                        console.log(rawTx)

                        let tx = new Tx(rawTx);
                        tx.sign(new Buffer(private_key, 'hex'));
                        let serializedTx = tx.serialize();
                        let raw = '0x' + serializedTx.toString('hex')
                        w3.eth.sendSignedTransaction(raw, (err, txHash) => {
                            if(err){
                                console.log(err)
                                let element = '<tr><th scope="row">' + 1 + '</th><td>' + txHash + '</td><td>' + address + '</td><td>' + "<0.0005" + '</td><td>' + 0 + '</td><td>' + "未知错误" + '</td></tr>'
                                $("#hex").append(element)
                            }else {
                                let element = '<tr><th scope="row">' + 1 + '</th><td>' + txHash + '</td><td>' + address + '</td><td>' + "<0.0005" + '</td><td>' + paidin + '</td><td>' + "成功" + '</td></tr>'
                                $("#hex").append(element)
                            }
                        })

                    }))

                }
            })
        })
    }
})
