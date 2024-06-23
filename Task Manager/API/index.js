let express=require("express");
let config=require("config")
let cors=require("cors")
let {corsObj}=require ("./middleware/cors")
let router=require("./routes");
let app=express();
let port=config.get("port")

app.use(cors(corsObj))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(router);    

app.listen(port,()=>{
    console.log(`connected to port ${port}`);
})