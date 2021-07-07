import "@pages/common/common"
import "./index.css"
import axios from "axios";

let all_online;
let all_outline;
const get_state = (address) => {
    return new Promise((resolve, reject) => {
        axios.get("https://api.gpfs.xyz/v1/miners?page=1&limit=20&address=" + address).then((response) => {
            if (response.status === 200) {
                let node_data = response.data.data;
                try {
                    let balance = node_data['miners'][0]['balance'] //算力
                    let state = node_data['miners'][0]['state'] // 状态
                    let reward = node_data['miners'][0]['reward'] // 累计出票
                    let paid_out = node_data['miners'][0]['paid_out'] //已兑换
                    let paid_in = String(parseFloat(reward) - parseFloat(paid_out)) //未兑换
                    let all = parseFloat(balance) + parseFloat(paid_in)
                    // set_attr(paid_out, paid_in, all_balance)
                    if (state === "离线") {
                        let element = '<tr><th scope="row">' + 1 + '</th><td>' + address + '</td><td>' + balance + '</td><td>' + reward + '</td><td>' + paid_out + '</td><td>' + paid_in + '</td><td style="color: red">' + state + '</td></tr>'
                        $("#outline").append(element)
                    } else if (state === "在线") {
                        let element = '<tr><th scope="row">' + 1 + '</th><td>' + address + '</td><td>' + balance + '</td><td>' + reward + '</td><td>' + paid_out + '</td><td>' + paid_in + '</td><td>' + state + '</td></tr>'
                        $("#online").append(element)
                    }
                } catch (e) {
                    let element = '<tr><th scope="row">' + 1 + '</th><td>' + address + '</td><td>' + '未查询到' + '</td><td>' + '未查询到' + '</td><td>' + '未查询到' + '</td><td>' + '未查询到' + '</td><td>' + '未查询到' + '</td></tr>'
                    $("#notfind").append(element)
                }
                resolve(response)

            } else {
                let element = '<tr><th scope="row">' + 1 + '</th><td>' + address + '</td><td>' + '未查询到' + '</td><td>' + '未查询到' + '</td><td>' + '未查询到' + '</td><td>' + '未查询到' + '</td><td>' + '未查询到' + '</td></tr>'
                $("#state").append(element)
            }
        }).catch((reason) => {
            alert("api 查询失败 或者地址");
            return 1;
        })
    })
}

const state = async (address) => {
    return await get_state(address)
}

$("button").click(() => {
    let arr = []
    $("#outline").empty();
    $("#online").empty();
    $("#notfind").empty();
    let vals = $("#addresses").val();
    let addresses = vals.split(/\s+/)
    let index = 0
    let all_balance = 0
    let all_pdout = 0
    let all_pdin = 0
    let all_outline = 0
    let all_online = 0
    let all_reward = 0
    let online_amount = 0
    let outline_amount = 0
    for (let address of addresses) {
        index += 1
        if (address === "" || address === null) {
            continue;
        }
        arr.push(state(address))
    }

    Promise.all(arr).then(res => {
        for (let info of res) {
            console.log(Object.keys(info.data.data).length)
            if (info !== "" && info !== null && info.data.data.count > 0) {
                let node_data = info.data.data;
                let balance = node_data['miners'][0]['balance'] //算力
                let state = node_data['miners'][0]['state'] // 状态
                let reward = node_data['miners'][0]['reward'] // 累计出票
                let paid_out = node_data['miners'][0]['paid_out'] //已兑换
                let paid_in = parseFloat(reward) - parseFloat(paid_out) //未兑换
                let all = parseFloat(balance) + parseFloat(paid_in)
                if (state === "在线") {
                    all_online += all
                    online_amount += 1
                } else if (state === "离线") {
                    all_outline += all
                    outline_amount += 1
                }

                all_balance += all;
                all_pdout += parseFloat(paid_out);
                all_pdin += paid_in;
            }
        }
        set_attr(all_pdout, all_pdin, all_online, all_outline, all_balance, online_amount, outline_amount, index - (online_amount + outline_amount))
    }).catch(err => {
        console.log('error', err)
    })
})

const set_attr = (pdout, pdin, all_online, all_outline, all, online_amount, outline_amount, useless) => {
    $("#pdout").html("已兑换 " + String(pdout))
    $("#pdin").html("未兑换 " + String(pdin))
    $("#all_online").html("在线GPS " + String(all_online))
    $("#all_outline").html("离线GPS " + String(all_outline))
    $("#outline_amount").html("离线节点数 " + String(outline_amount))
    $("#online_amount").html("在线节点数 " + String(online_amount))
    $("#useless").html("无效节点数 " + String(useless))
    $("#all").html("全部 GPS " + String(all))
}
