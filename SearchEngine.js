export
function searchSong(database, querry, flags = {isFull: false, isCaseSensitive: false, isExact: false, wholeWords: false}) {
	if (flags.isExact) {
		return searchSongByQuerry(database, querry, flags.isFull, flags.isCaseSensitive);
	} 
	if (flags.wholeWords){
		return searchSongByWords(database, querry, flags.isFull, flags.isCaseSensitive);
	} else {
		return searchSongByWords(database, querry, flags.isFull, flags.isCaseSensitive);
	}
}

function searchSongByQuerry(dataBase, querry, isFull = false, isCaseSensitive = false) {
	var results = [];
	if (Array.isArray(dataBase)) {
		for (var i = 0; i < dataBase.length; i++) {
			results = results.concat(searchSongByQuerry(dataBase[i], querry, isFull, isCaseSensitive));
		}
	} else {
		results = dataBase.songs.slice();
		if (!isCaseSensitive) {
			querry = querry.toLowerCase();
		}
		results = results.filter(song => {
			var title = song.title;
			if (!isCaseSensitive) {
				title = title.toLowerCase();
			}
			var res = title.includes(querry);
			if (isFull) {
				var data = song.data;
				if (!isCaseSensitive) {
					data = data.toLowerCase();
				}
				res = res || data.includes(querry);
			}
			return res;
		});
	}
	return results;
}


function searchSongByWords(dataBase, querry, isFull = false, isCaseSensitive = false) {
	const separators = / |\.|\?|!|,|\n/;
	if (Array.isArray(querry)) {
		var results = [];
		if (Array.isArray(dataBase)) {
			for (var i = 0; i < dataBase.length; i++) {
				results = results.concat(searchSongByWords(dataBase[i], querry, isFull, isCaseSensitive));
			}
		} else {
			results = dataBase.songs.slice();
			if (!isCaseSensitive) {
				querry = querry.map(x => x.toLowerCase());
			}
			results = results.filter(song => {
				var title = song.title;
				if (!isCaseSensitive) {
					title = title.toLowerCase();
				}
				var res = true;
				if (isFull) {
					var data = song.data;
					if (!isCaseSensitive) {
						data = data.toLowerCase();
					}
				}
				for (var i = 0; i < querry.length; i++) {
					if (!title.includes(querry[i])) {
						if (!isFull || !data.includes(querry[i])) {
							return false;
						}
					}
							
				}
				return true;
			});
		}
		return results;
	} else {
		return searchSongByWords(dataBase, querry.split(separators), isFull, isCaseSensitive);
	}
}

function searchSongByExactWords(dataBase, querry, isFull = false, isCaseSensitive = false) {
	const separators = / |\.|\?|!|,|\n/;
	if (Array.isArray(querry)) {
		var results = [];
		if (Array.isArray(dataBase)) {
			for (var i = 0; i < dataBase.length; i++) {
				results = results.concat(searchSongByExactWords(dataBase[i], querry, isFull, isCaseSensitive));
			}
		} else {
			results = dataBase.songs.slice();
			if (!isCaseSensitive) {
				querry = querry.map(x => x.toLowerCase());
			}
			results = results.filter(song => {
				var title = song.title;
				if (!isCaseSensitive) {
					title = title.toLowerCase();
				}
				title = title.split(separators);
				var dic = {};
				for (var i = 0; i < title.length; i++) {
					dic[title[i]] = true;
				}
				if (isFull) {
					var data = song.data;
					if (!isCaseSensitive) {
						data = data.toLowerCase();
					}
					data = data.split(separators);
					for (var i = 0; i < data.length; i++) {
						dic[data[i]] = true;
					}
				}
				for (var i = 0; i < querry.length; i++) {
					if (!(dic[querry[i]])) return false;
				}
				return true;
			});
		}
		return results;
	} else {
		return searchSongByExactWords(dataBase, querry.split(separators), isFull, isCaseSensitive);
	}
}