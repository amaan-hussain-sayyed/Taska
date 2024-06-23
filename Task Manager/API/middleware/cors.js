
let corsObj = {
    origin: (domain, CB) => {
        let whiteList = {
        "http://localhost:3000":true
        
       }
        if (!whiteList[domain]) {
            return CB("Domain Not Found", false)
        }
        return CB(null, true)
    }
}

module.exports = { corsObj }