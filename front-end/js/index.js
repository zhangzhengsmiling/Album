const vm = new Vue({
	el: '#app',
	data() {
		return {
			albumList: [],
			imageList: [],
			isShow: true
		};
	},
	computed: {
		/**
		 * 将一维相册列表数组转换为二维数组
		 * @return {[} [相册列表二维数组]
		 */
		albumList2D() {
			let res = [];
			let list = [];
			let colNum = 4;
			res.push(list);
			for (let i = 0; i < this.albumList.length; i++) {
				if ((i + 1) % colNum === 0 && (i !== this.albumList.length - 1)) {
					list.push(this.albumList[i]);
					list = [];
					res.push(list);
				} else {
					list.push(this.albumList[i]);
				}
			}
			console.log('here')
			return res;
		}
	},
	methods: {
		createAblbum() {
			dirName = window.prompt("请输入相册名称：");
			addAlbum(dirName);
		},
		getImages(item){
			this.isShow = false;
			getImage(item);
		},
		goBack(){
			this.isShow =  true;
		}
	},
	mounted() {
		getAlbums();
	}
})

function ajax(url, callback, method = 'get', data = {}) {
	if (method === 'get') {
		const xhr = new XMLHttpRequest();
		xhr.open('get', 'http://127.0.0.1:8080/albums');
		xhr.onreadystatechange = function() {
			if (xhr.status === 200 && xhr.readyState === 4) {
				try {
					const data = JSON.parse(xhr.responseText);
					callback(data);
				} catch (err) {
					console.log('data is not json');
					console.log(xhr.responseText);
				}
			}
		}
		xhr.send();
	} else if (method === 'post') {
		let xhr = new XMLHttpRequest();
		xhr.open('post', url);
		xhr.onreadystatechange = function() {
			if (xhr.status === 200 && xhr.readyState === 4) {
				try {
					console.log(xhr.responseText)
					let data = JSON.parse(xhr.responseText);
					callback(data);
				} catch (err) {
					console.log(err.toString());
				}
			}
		}
		xhr.send(JSON.stringify(data));
	}
}

function getAlbums() {
	ajax('http://127.0.0.1:8080/albums', data => {
		console.log(data);
		vm.albumList = data
	});
}

function addAlbum(dirName) {
	ajax('http://127.0.0.1:8080/addAlbum', (data) => {
		console.log(data);
		getAlbums();
	}, 'post', {
		dirName
	});
}

function getImage(item) {
	console.log(item)
	ajax('http://127.0.0.1:8080/getImages', (images) => {
		vm.imageList = images.map(image => "http:127.0.0.1:8080" + image);
		console.log(vm.imageList);
	}, 'post', {
		albumName: item
	});
}