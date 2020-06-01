var colorList = ["#EE0000", "#334CFF", "#52FF6D", "#AF5AFF", "#FF5A5A", "#FF7ECC", "#00C5FF", "#7EF5FF", "#FBFF00", "#FFBD00"];
var colorListNew = ["#EE0000", "#334CFF", "#52FF6D", "#AF5AFF", "#FF5A5A", "#FF7ECC", "#00C5FF", "#7EF5FF", "#FBFF00", "#FFBD00"];
var labelarray = [], labelcolorarray = [], imagearray = [], annotatorarray = [], annotatorunique = [];
var modaltitle, modalbody, modalfooter;

$(document).ready(function () {
	$("#settingspage").addClass("active");

	$('.imageclass').each(function (index, element) {
		imagearray.push($(element).text());
	});
	$('.labelclass').each(function (index, element) {
		labelarray.push($(element).text());
		// alert($(element).text());
	});
	$('.labelcolor').each(function (index, element) {
		labelcolorarray.push($(element).text());
		// alert($(element).text());
	});
	$('.annotator').each(function (index, element) {
		annotatorarray.push($(element).text());
		// alert($(element).text());
	});

	$('[data-toggle="popover"]').popover();

	for (var i = 0; i < colorList.length; i++) {
		for (var y = 0; y < labelcolorarray.length; y++) {
			if (colorList[i] == labelcolorarray[y]) {
				var index = colorListNew.indexOf(colorList[i]);
				if (index > -1) {
					colorListNew.splice(index, 1);
				}
			}
		}
	}
	//downloadtest();
	loadannotator();
	document.getElementById("totalimagenumber").innerHTML = imagearray.length;
});

function addlabel() {
	var labeltrigger = false;
	var labelname = document.getElementById("labelname").value;

	if (labelname == "") {
		modalbody = "Label name must be filled!"
		warningmodal();
		callmodal();
	} else if (labelarray.length >= 10) {
		modalbody = "Maximum label limit reached!"
		warningmodal();
		callmodal();
	} else if (labelname.length > 15) {
		modalbody = "Maximum character length is 15!"
		warningmodal();
		callmodal();
	} else {
		for (var y = 0; y < labelarray.length; y++) {
			if (labelname == labelarray[y]) {
				modalbody = "Label already exists!";
				warningmodal();
				callmodal();
				labeltrigger = true;
			}
		}
		if (labeltrigger == false) {
			// for (var num = 0; num < labelcolorarray.length; num++) {
			//     ++count2;
			// }

			$.post("/savelabel", { save_labelname: labelname, save_colorvalue: colorListNew[0] });
			// labelname = "";
			// document.getElementById("labelname").value = labelname;
			setTimeout(() => { location.reload(); }, 250);

		}
	}
}

function deletelabelall() {
	if (labelarray.length == 0) {
		modalbody = "No labels to delete!";
		warningmodal();
		callmodal();
	} else {
		modaltitle = "Please Confirm Action";
		modalbody = "Are you sure you want to delete all label? This action CANNOT be reverted.";
		modalfooter = '<button type="button" class="btn btn-danger" data-dismiss="modal" onclick="deletelabelallconfirmed()">Delete All</button>'
			+ '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>';
		callmodal();
	}
}

function deletelabelallconfirmed() {
	$.post("/deletelabelall");
	setTimeout(() => { location.reload(); }, 250);
}

function deletelabel(labelname, labelcolor) {
	modaltitle = "Please Confirm Action";
	modalbody = "Are you sure you want to delete  " + labelname + "  ?";
	modalfooter = '<button type="button" class="btn btn-danger" data-dismiss="modal" onclick="deletelabelconfirmed(\'' + labelcolor + '\')">Delete</button>'
		+ '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>';
	callmodal();
}

function deletelabelconfirmed(labelcolor) {
	$.post("/deletelabel", { delete_labelcolor: labelcolor });
	setTimeout(() => { location.reload(); }, 150);
}

function warningmodal() {
	modaltitle = "You can't do that.";
	modalfooter = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
}

function callmodal() {
	document.getElementById("exampleModalLabel").innerHTML = modaltitle;
	document.getElementById("modalBody").innerHTML = modalbody;
	document.getElementById("modalFooter").innerHTML = modalfooter;
	$('#exampleModal').modal('toggle');
}

function viewimage() {
	modaltitle = 'View Image';
	modalbody = '<ul>';
	for (var i = 0; i < imagearray.length; i++) {
		modalbody += '<li >' + imagearray[i] + '</li><button onclick="clickedimage(\'' + imagearray[i] + '\')" class="btn btn-sm btn-primary">View</button>';
	}
	modalbody += '</ul>';
	modalfooter = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
	callmodal();
}

function clickedimage(filename) {
	modaltitle = filename;
	modalbody = '<img src="static/images/' + filename + '" style="width:450px;height:400px">';
	modalfooter = '<button type="button" class="btn btn-secondary" data-dismiss="modal" >Close</button>';
	document.getElementById("ModalLabel2").innerHTML = modaltitle;
	document.getElementById("modalBody2").innerHTML = modalbody;
	document.getElementById("modalFooter2").innerHTML = modalfooter;
	$('#exampleModal').modal('hide');
	//$('#exampleModal').modal('dispose');

	$('#Modal2').modal('toggle');
}

function loadimage() {
	var path = document.getElementById("file-input").value;
	var test = document.getElementById("file-input").value.replace("C:\\fakepath\\", "")
	//inputNode.value = fileInput.value.replace("C:\\fakepath\\", "");
	alert(test);
	//$.post("/loadimage", { sourcepath: path });
	setTimeout(function () { location.reload }, 250);
}

function createdownloadlist() {
	modaltitle = 'Download Image';
	//modalbody = '<h6>Choose which image to download : </h6>'
	modalbody = '<ul>';
	for (var i = 0; i < imagearray.length; i++) {
		modalbody += '<li class="mr-2" style="display:inline">- ' + imagearray[i] + '</li><button onclick="downloadimage(\'' + imagearray[i] + '\')" class="btn btn-sm btn-success mt-2">Download</button><br>';
	}
	modalbody += '</ul>';
	modalfooter = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
	callmodal();
}

function downloadimage(image_name) {
	//alert("Hello");
	$.post("/download/image", { filename: image_name });
	//alert("Downloading...");
}

function downloadtest() {
	modaltitle = 'Download Image';
	//modalbody = '<h6>Choose which image to download : </h6>'
	modalbody = '<ul>';
	for (var i = 0; i < imagearray.length; i++) {
		modalbody += '<a href="{{ url_for(\'.download_image\', filename=\'' + imagearray[i] + '\' ) }}"><li class="mr-2" style="display:inline">- ' + imagearray[i] + '</li>';
	}
	modalbody += '</ul>';
	modalfooter = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
	document.getElementById("collapseBody").innerHTML = modalbody;
}

function viewallstatistics() {
	modaltitle = "View all statistics";
	modalbody = "";
}

function loadannotator() {
	let annotatorunique = [...new Set(annotatorarray)];
	var annotator = "";
	for (var i = 0; i < annotatorunique.length; i++) {
		annotator += "<option>" + annotatorunique[i] + "</option>";
	}
	document.getElementById("deleteUserSelection").innerHTML = annotator;
}

function deleteuservalidation() {
	var selected = $('#deleteUserSelection').val();
	if (selected == "") {
		modalbody = "Please select a user!";
		warningmodal();
		callmodal();
	} else {
		modaltitle = "Please Confirm Action";
		modalbody = "Are you sure you want to delete annotations from " + selected + " ? this action CANNOT be undone.";
		modalfooter = '<button onclick="deleteuserdata()" class="btn btn-danger">Delete</button>'
			+ '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>';
		callmodal();
	}
}

function deleteallvalidation() {
	var selected = $('#deleteUserSelection').val();
	if (annotatorarray.length == 0) {
		modalbody = "No annotations were found!";
		warningmodal();
		callmodal();
	} else {
		modaltitle = "Please Confirm Action";
		modalbody = "Are you sure you want to delete all annotations? this action CANNOT be undone.";
		modalfooter = '<a href="delete/alldata"><button type="button" class="btn btn-danger">Delete All</button></a>'
			+ '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>';
		callmodal();
	}
}

function deleteuserdata() {
	var selected = ''+$('#deleteUserSelection').val();+'';
	// $.post("/delete/userdata", { annotator_name : ""+selected+"" });
	var container = selected.split(',');
	var selectedArray = [];
	for(var i=0;i<container.length;i++){
		selectedArray.push({name : container[i]});
	}
	//alert(selectedArray);
	var xhr = new XMLHttpRequest();
	var url = "/delete/userdata";
	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			location.reload();
		}
	};
	var data = JSON.stringify(selectedArray);
	//alert(data);
	xhr.send(data);

}

function deletealldata() {

}