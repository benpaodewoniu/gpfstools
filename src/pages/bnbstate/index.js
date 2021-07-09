import "@pages/common/common"
import "./index.css"
import Web3 from "web3"

let w3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org"));

const get_state = (address) => {
    w3.eth.getBalance(address, ((error, balance) => {
        if (error) {
            return
        }
        let bnb = String(w3.utils.fromWei(balance, "ether"))
        let element = '<tr><th scope="row">' + 1 + '</th><td>' + String(address) + '</td><td>' + bnb + '</td></tr>'
        if(bnb > 0.0005){
            $("#bnbhigh").append(element)
        }else {
            $("#bnblow").append(element)
        }


    }))
}

$("button").click(() => {
    let vals = $("#addresses").val();
    let addresses = vals.split(/\s+/)
    for (let address of addresses) {
        if (address === "" || address === null) {
            continue;
        }
        get_state(address)
    }
})
