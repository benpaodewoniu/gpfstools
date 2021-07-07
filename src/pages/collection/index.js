import "@pages/common/common"
import "./index.css"
import Web3 from "web3"
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
        "constant": false,
        "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
        "name": "transfer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }]

let tokenContract = new w3.eth.Contract(tokenContractABI, contractAddr);

$("#submit").click(() => {
    $("#hex").empty();
    let addresses_vals = $("#addresses").val();
    let addresses = addresses_vals.split(/\s+/)
    let privates_vals = $("#privates").val();
    let privates = privates_vals.split(/\s+/)
    let threshold = parseFloat($("#threshold").val())
    let collection_address = $("#collection").val()
    if (isNaN(collection_address) || !w3.utils.isAddress(collection_address)) {
        alert("请输入正确的归集地址")
        return
    }
    console.log(collection_address)
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

            tokenContract.methods.balanceOf(address).call().then((gps_balance) => {
                console.log(gps_balance)

                if (parseFloat(gps_balance) / 10000 < threshold) {
                    let element = '<tr><th scope="row">' + 1 + '</th><td>' + 0 + '</td><td>' + address + '</td><td>' + 0 + '</td><td>' + 0 + '</td><td>' + "小于阈值" + '</td></tr>'
                    $("#hex").append(element)
                    return
                }

                w3.eth.getTransactionCount(address, "latest", ((error, count) => {
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
                        data: tokenContract.methods.transfer(collection_address, gps_balance).encodeABI()
                    }
                    console.log(rawTx)


                    let tx = new Tx(rawTx);
                    tx.sign(new Buffer(private_key, 'hex'));
                    let serializedTx = tx.serialize();
                    let raw = '0x' + serializedTx.toString('hex')
                    w3.eth.sendSignedTransaction(raw, (err, txHash) => {
                        if (err) {
                            let element = '<tr><th scope="row">' + 1 + '</th><td>' + txHash + '</td><td>' + address + '</td><td>' + "<0.0005" + '</td><td>' + 0 + '</td><td>' + "未知错误" + '</td></tr>'
                            $("#hex").append(element)
                        } else {
                            let element = '<tr><th scope="row">' + 1 + '</th><td>' + txHash + '</td><td>' + address + '</td><td>' + "<0.0005" + '</td><td>' + parseFloat(gps_balance) / 10000 + '</td><td>' + "成功" + '</td></tr>'
                            $("#hex").append(element)
                        }
                    })

                }))
            })
        })
    }
})
