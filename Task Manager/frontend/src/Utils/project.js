 async function validator(schema,data){
    let check=await schema.validate(data,{abortEarly:false}).catch((error)=>{
        return {error}
    })
    if(check.error){
        let error={}
        for(let i of check.error.inner){
            error[i.path]=i.message;
        }
        return {error};
    }
    return check;
 }

 export {validator};