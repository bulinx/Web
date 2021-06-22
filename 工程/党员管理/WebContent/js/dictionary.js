/**
 * 获取字典值
 */

//获得政治面貌,select使用，传入对应ID,均获得具体显示值
function politicalText(id) {
	$.post("dictionarys!getDictionary",{"code":'political'},function(v){
		var res = $.parseJSON(v);
		for (var i = 0; i < res.length; ++i) {
			$("#"+id).append('<option value="'+res[i].name+'">'+res[i].name+'</option>');
		}
	});
}

//获得学历,select使用，传入对应ID,均获得具体显示值
function educationText(id) {
	$.post("dictionarys!getDictionary",{"code":'education'},function(v){
		var res = $.parseJSON(v);
		for (var i = 0; i < res.length; ++i) {
			$("#"+id).append('<option value="'+res[i].name+'">'+res[i].name+'</option>');
		}
	});
}

//获得专业,select使用，传入对应ID,均获得具体显示值
function majorText(id) {
	$.post("dictionarys!getDictionary",{"code":'major'},function(v){
		var res = $.parseJSON(v);
		for (var i = 0; i < res.length; ++i) {
			$("#"+id).append('<option value="'+res[i].name+'">'+res[i].name+'</option>');
		}
	});
}

//获得外语语种,select使用，传入对应ID,均获得具体显示值
function languageText(id) {
	$.post("dictionarys!getDictionary",{"code":'language'},function(v){
		var res = $.parseJSON(v);
		for (var i = 0; i < res.length; ++i) {
			$("#"+id).append('<option value="'+res[i].name+'">'+res[i].name+'</option>');
		}
	});
}

//获得生源地区,select使用，传入对应ID,均获得具体显示值
function studentAreaText(id) {
	$.post("dictionarys!getDictionary",{"code":'studentArea'},function(v){
		var res = $.parseJSON(v);
		for (var i = 0; i < res.length; ++i) {
			$("#"+id).append('<option value="'+res[i].name+'">'+res[i].name+'</option>');
		}
	});
}

//获得班级,select使用，传入对应ID,均获得具体显示值
function classesText(id) {
	$.post("dictionarys!getDictionary",{"code":'classes'},function(v){
		var res = $.parseJSON(v);
		for (var i = 0; i < res.length; ++i) {
			$("#"+id).append('<option value="'+res[i].name+'">'+res[i].name+'</option>');
		}
	});
}

//获得文化程度,select使用，传入对应ID,均获得具体显示值
function cultureText(id) {
	$.post("dictionarys!getDictionary",{"code":'culture'},function(v){
		var res = $.parseJSON(v);
		for (var i = 0; i < res.length; ++i) {
			$("#"+id).append('<option value="'+res[i].name+'">'+res[i].name+'</option>');
		}
	});
}

//获得职业,select使用，传入对应ID,均获得具体显示值
function jobText(id) {
	$.post("dictionarys!getDictionary",{"code":'job'},function(v){
		var res = $.parseJSON(v);
		for (var i = 0; i < res.length; ++i) {
			$("#"+id).append('<option value="'+res[i].name+'">'+res[i].name+'</option>');
		}
	});
}

//获得公示起止时间,select使用，传入对应ID,均获得具体显示值
function positivePiblicText(id) {
	$.post("dictionarys!getDictionary",{"code":'positivePiblic'},function(v){
		var res = $.parseJSON(v);
		for (var i = 0; i < res.length; ++i) {
			$("#"+id).append('<option value="'+res[i].name+'">'+res[i].name+'</option>');
		}
	});
}

//获得推优或推荐方式,select使用，传入对应ID,均获得具体显示值
function promoteText(id) {
	$.post("dictionarys!getDictionary",{"code":'promote'},function(v){
		var res = $.parseJSON(v);
		for (var i = 0; i < res.length; ++i) {
			$("#"+id).append('<option value="'+res[i].name+'">'+res[i].name+'</option>');
		}
	});
}

//获得讨论意见,select使用，传入对应ID,均获得具体显示值
function discussText(id) {
	$.post("dictionarys!getDictionary",{"code":'discuss'},function(v){
		var res = $.parseJSON(v);
		for (var i = 0; i < res.length; ++i) {
			$("#"+id).append('<option value="'+res[i].name+'">'+res[i].name+'</option>');
		}
	});
}