const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const server = http.createServer();	

server.on('request', (req, res) => {
	if(req.url === '/favicn.ico'){
		return ;
	}


	/**
	 * 将albums文件夹作为静态资源构建静态服务器
	 * @type {[type]}
	 */
	let pathName = url.parse(req.url, true).pathname;
	console.log(/\/albums\//.test(pathName))
	if(/\/albums\//.test(pathName)){
		fs.readFile(__dirname + '/' + pathName, (err, data) => {
			if(err) {
				console.log(err.toString());
			}
			res.writeHead(200, {"Content-Type": "image/jpg", "Access-Control-Allow-Origin": "*"});
			res.end(data);
			return;
		})
	}

	const dir = __dirname + '/albums/';

	if(req.url === '/albums'){
		getAlbums(req, res, dir);
	}

	if(req.url === '/addAlbum' && req.method.toLowerCase() === 'post'){
		createAlbum(req, res, dir);
	}

	if(req.url === '/getImages' && req.method.toLowerCase() === 'post'){
		let albumName = '';
		req.on('data', (chunk) => {
			albumName += chunk;
		})
		req.on('end', (err) => {
			if(err) {
				console.log(err.toString());
			}
			getImages(req, res, dir + '/' + JSON.parse(albumName).albumName);
		})
	}

})

server.listen(8080);
console.log('server started successfully!!');


/**
 * 获取相册列表
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @param  {[type]} dir [description]
 * @return []:相册列表
 */
function getAlbums(req, res,dir){
		let files = [];
		fs.readdir(dir, (err, files) => {
			files.forEach(file => {
				fs.stat(dir + '/' + file, (err, stats) => {
					if(stats.isDirectory()){
						files.push(file);
					}
				})
			})
			res.writeHead(200, {"Content-Type": "text/json;charset=utf8", "Access-Control-Allow-Origin": "*"});
			res.end(JSON.stringify(files));
		})
}

/**
 * 添加相册
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @param  {[type]} dir [description]
 * @return 返回成功信息
 */
function createAlbum(req, res, dir) {
		let data = '';
		req.on('data', (chunk) => {
			console.log(chunk.toString())
			data += chunk;
		})
		req.on('end', (err) => {
			if(err) {
				console.log(err.toString());
			}
			let dirName = JSON.parse(data).dirName;
				if(dirName) {
					fs.mkdir(dir + '/' + dirName, (err) => {
						console.log(err);
					if(err) {
						console.log(err.toString());
					}
					res.writeHead(200, {"Content-Type": "text/json;charset=utf8", "Access-Control-Allow-Origin": "*"});
					let msg = {'msg': 'success'};
					res.end(JSON.stringify(msg));
				});
				} else {
					console.log("参数格式错误");
				}
		})
}


/**
 * 获取相册中的图片信息
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */
// function getImages(req, res, dir) {
// 	console.log(dir)
// 	let images = {};
// 	fs.readdir(dir, (err, files) => {
// 		function iterator(i){
// 			fs.readFile(dir + '/' + files[i], (err, data) => {
// 				if(err){
// 					console.log(err.toString());
// 				}

// 				images[files[i]] = data;
// 				if(i >= files.length - 1){
// 					res.writeHead(200, {"Content-Type": "text/json;charset=utf8", "Access-Control-Allow-Origin": "*"});
// 					res.end(JSON.stringify(images));
// 				} else {
// 					iterator(i + 1);
// 				}
// 			})
// 		}
// 		iterator(0);
// 		// console.log(images, 'line 113');

// 		// for(let i = 0; i < files.length; i++){
// 		// 	fs.readFileSync(dir + '/' + files[i], (err, data) => {
// 		// 		images[files[i]] = data;
// 		// 		console.log(i);
// 		// 		if(i === images.length - 1) {
// 		// 			res.writeHead(200, {"Content-Type": "text/json;charset=utf8", "Access-Control-Allow-Origin": "*"});
// 		// 			res.end(JSON.stringify(images));
// 		// 		}
// 		// 	});
// 		// }
// 	})
// }

function getImages(req, res, dir){
	console.log(dir)
	let relat_dir = dir.replace(__dirname, "");
	console.log(relat_dir)
	fs.readdir(dir, (err, files) => {
		let urls = files.map(file => {
			return path.normalize(relat_dir + '/' + file);
		})
		res.writeHead(200, {"Content-Type": "text/json", "Access-Control-Allow-Origin": "*"});
		res.end(JSON.stringify(urls));
	})
}


