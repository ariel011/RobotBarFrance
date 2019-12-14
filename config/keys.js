module.exports = {
    //guide says 27017 but opened in below
    mongoURI: "mongodb://localhost:27017/meven_auth",
    secret: 'yoursecret'
};

if(process.env.NODE_ENV == 'production'){
    module.exports = {
        mongoURI: "mongodb+srv://a101496:Arsenal11!@cluster0-qfmm0.mongodb.net/test?retryWrites=true&w=majority",
        secret: 'yoursecret'
    };
 } else {
     module.exports = {
         mongoURI: "",
         secret: 'yoursecret'
     };
 } 