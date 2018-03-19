// 27017 is the default port number.   
module.exports = { 
  database: './db/contact.db',
  appSecret: 'ba4cbb30-d324-44b0-9918-956fc655af42',
  allowAnonimous : allowAnonimous,
  getToken : getToken
}

function getToken(req){
  		var token = req.body.token || req.query.token || req.headers['x-access-token'];
      return token;
}

function allowAnonimous(req){
  var path = req.path;
  if (path === '/api/auth/authenticate' 
    || path === '/api/auth/recover'
    || path === '/api/registration' ){
      
    return true;
  }
  return false;
}