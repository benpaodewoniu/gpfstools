import "@pages/common/common"
import "./index.css"
import axios from "axios";

$("#test").click(() => {
    axios.get("http://127.0.0.1:8000/user/register",{
        params:{
            id:1
        }
    }).then((response) =>{
        console.log(response)
    })
})

// $("#test").click(() => {
//     axios.get()
// })
