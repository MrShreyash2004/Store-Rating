const http = require('http');
const data = JSON.stringify({email:'admin@storely.test', password:'Admin@1234'});
const options = {hostname:'localhost',port:4000,path:'/auth/login',method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}};
const req = http.request(options, res => { let body=''; res.on('data', chunk=> body+=chunk); res.on('end', ()=> console.log('RESPONSE:', body));});
req.on('error', err => { console.error('ERR message:', err && err.message); if (err && err.stack) console.error(err.stack); });
req.write(data);
req.end();
