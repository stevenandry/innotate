var imagearray = [], imagenamearray = [], imagelabelarray = [], colorarray = []
    , annotateindexarray = [], filteredimagearray = [], toolarray = [], annotatorarray = []
    , startxarray = [], startyarray = [], endxarray = [], endyarray = [], annotationidarray = [], yourimageunique = []
var yourresultarray = [], yourannotationid = [], yourannotationidunique = [];
var yourannotationimgid = [], yourantnimgidunique = [], imgrealwidth, imgrealheight;
var yourresult = document.getElementById("yourresult");
var otherresult = document.getElementById("otherresult");
var username = document.getElementById("username").textContent;
var otherusernameholder = "";

$(window).on("load", function () {
    $(".loader").fadeOut("fast");
    setTimeout(function(){newload();},200);
});

$(document).ready(function () {
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
    $('.imagenameclass').each(function (index, element) {
        imagenamearray.push($(element).text());
        //alert($(element).text());
    });
    $('.imagelabelclass').each(function (index, element) {
        imagelabelarray.push($(element).text());
        //alert($(element).text());
    });
    $('.startxclass').each(function (index, element) {
        startxarray.push($(element).text());
        //alert($(element).text());
    });
    $('.startyclass').each(function (index, element) {
        startyarray.push($(element).text());
        //alert($(element).text());
    });
    $('.endxclass').each(function (index, element) {
        endxarray.push($(element).text());
        //alert($(element).text());
    });
    $('.endyclass').each(function (index, element) {
        endyarray.push($(element).text());
        //alert($(element).text());
    });
    $('.toolclass').each(function (index, element) {
        toolarray.push($(element).text());
        //alert($(element).text());
    });
    $('.colorclass').each(function (index, element) {
        colorarray.push($(element).text());
        //alert($(element).text());
    });
    $('.annotatorclass').each(function (index, element) {
        annotatorarray.push($(element).text());
        //alert($(element).text());
    });

    $('[data-toggle="popover"]').popover();

    $("#imagesearchbar").keyup(function() {
        var val = $.trim(this.value);
        if (val === ""){
            $('img').show();
            $('svg').show();
            $(".loader").fadeOut("fast");
        }
        else {
            $('img').hide();
            $('svg').hide();
            $("img[alt*=" + val + "]").show();
            $("svg[id*=" + val + "]").show();
        }
    });

    loadimage();
    createyourresult();
    createotherresult();
    listotherannotator();
    // createyourannotationid();
    // createyourimgid();

    
});

function listotherannotator(){
    var temparray = [];
    for (var i = 0; i < annotatorarray.length; i++) {
        if (annotatorarray[i] != username) {
            temparray.push({
                annotator: annotatorarray[i]
            });
        }
    }
    otherannotatorunique = _.uniqBy(temparray, function (e) {
        return e.annotator;
    });
    
    for( var i =0;i<otherannotatorunique.length;i++){
        var annotator = "";
        annotator += "<option>"+otherannotatorunique[i].annotator+"</option>";
        document.getElementById("selectusername").innerHTML += annotator;
    }
}

function selectusername(){
    var otherusername= document.getElementById("selectusername").value;
    if(otherusername != otherusernameholder){
        $('#otherresultlist div').html('');
        createotherresult(otherusername);
    }
}

function loadimage() {
    var html = "";
    for (var i = 0; i < imagearray.length; i++) {
        html += "<img id='"+ imagearray[i] +"' src='static/images/" + imagearray[i] + "'>";
    }
    document.getElementById("listimages").innerHTML = html;
}

function createyourresult() {
    for (var i = 0; i < annotatorarray.length; i++) {
        if (annotatorarray[i] == username) {
            yourresultarray.push({
                imagename: imagenamearray[i], imagelabel: imagelabelarray[i], startx: startxarray[i], starty: startyarray[i]
                , endx: endxarray[i], endy: endyarray[i], tool: toolarray[i], color: colorarray[i], annotator: annotatorarray[i]
                //, annotationindex: annotateindexarray[i], annotationid: annotationidarray[i]
            });
            // alert(yourresultarray[0].imagename+yourresultarray[0].imagelabel+yourresultarray[0].startx
            //     +yourresultarray[0].starty+yourresultarray[0].endx+yourresultarray[0].endy
            //     +yourresultarray[0].tool+yourresultarray[0].color+yourresultarray[0].annotator
            //     +yourresultarray[0].annotationindex+yourresultarray[0].annotationid);
        }
    }
    yourimageunique = _.uniqBy(yourresultarray, function (e) {
        return e.imagename;
    });
    // for(var i =0;i<yourimageunique.length;i++){
    //     alert(yourimageunique[i].imagename);
    // }
}

function createotherresult(otherusername){
    var otherresultarray =[], otherimageunique=[]; 
    for (var i = 0; i < annotatorarray.length; i++) {
        if (annotatorarray[i] == otherusername) {
            otherresultarray.push({
                imagename: imagenamearray[i], imagelabel: imagelabelarray[i], startx: startxarray[i], starty: startyarray[i]
                , endx: endxarray[i], endy: endyarray[i], tool: toolarray[i], color: colorarray[i], annotator: annotatorarray[i]
            });
        }
    }
    otherimageunique = _.uniqBy(otherresultarray, function (e) {
        return e.imagename;
    });
    for (var i = 0; i < otherimageunique.length; i++) {
        //alert(otherimageunique[i].imagename);
        var images = '<div style="position:relative;float:left">'
				+'<img src="static/images/'+otherimageunique[i].imagename+'" class="mb-3 mr-3 rounded" width=300 height=300>'
                // + '<img class="loader" src="static/loadinggif.gif" width=50 height=50 style="z-index:2 position: absolute; left: 50%; top: 50%; margin: -<25> 0 0 -<25>">'
				+'<svg class="hvr-border-fade" id="svgovercanvas" style="position:absolute;left: 0px; top:0px;z-index: 2;cursor:pointer" width=300 height=300> ';
        var image = document.getElementById(otherimageunique[i].imagename);
        imgrealwidth = image.width;
        imgrealheight = image.height;
       //alert(imgrealheight + " " + imgrealwidth);
           
        for (var y = 0; y < otherresultarray.length; y++) {
            if(otherresultarray[y].imagename == otherimageunique[i].imagename){
                if (otherresultarray[y].tool == 'Dot Tool') {
                    var convertstartx = otherresultarray[y].startx * 300 / imgrealwidth;
                    var convertstarty = otherresultarray[y].starty * 300 / imgrealheight;
                    images += '<circle cx="'+convertstartx+'" cy="'+convertstarty+'" r="3" fill="'+otherresultarray[y].color+'" />';
                } else {
                    var convertstartx = otherresultarray[y].startx * 300 / imgrealwidth;
                    var convertstarty = otherresultarray[y].starty * 300 / imgrealheight;
                    var convertendx = otherresultarray[y].endx * 300 / imgrealwidth;
                    var convertendy = otherresultarray[y].endy * 300 / imgrealheight;
                    var width = convertendx - convertstartx;
                    var height = convertendy - convertstarty;
                    var labelY = convertstarty - 3;

                    var fillY = convertstarty - 13;
                    var countlength = 0;
                    var activelabel = otherresultarray[y].imagelabel;
                    for(var z=0;z<activelabel.length;z++){
                        ++countlength;
                    }
                    var fillWidth = 10.5 * countlength;

                    images += '<rect x="'+convertstartx+'" y="'+convertstarty+'" width="'+width+'" height="'+height+'" fill="none" stroke="'+otherresultarray[y].color+'" stroke-width="3"/>'
                        + '<rect x="' + convertstartx + '" y="' + fillY + '" width="'+fillWidth+'" height="10" fill="'+otherresultarray[y].color+'" stroke="' + otherresultarray[y].color + '" stroke-width="3"/>'
                        + '<text x="' + convertstartx + '" y="' + labelY + '" fill="black" style="font-weight:bold">' + otherresultarray[y].imagelabel + '</text>';
                }
            }
        }
        images += '</svg></div>';
        document.getElementById("otherresultlist").innerHTML += images;
        // alert("success");
    }
    otherusernameholder = otherusername;
}

function createyourannotationid() {
    for (var i = 0; i < yourresultarray.length; i++) {
        yourannotationid.push(yourresultarray[i].annotationid);
        // alert(yourannotationid[i]);
    }

    let yourannotationidunique = [...new Set(yourannotationid)];
    // for(var i=0;i<yourannotationidunique.length;i++){

    //     alert(yourannotationidunique[i]);
    // }
}

function createyourimgid() {
    for (var i = 0; i < yourresultarray.length; i++) {
        yourannotationimgid.push({ imagename: yourresultarray[i].imagename, annotationid: yourresultarray[i].annotationid });
        // alert(yourannotationimgid[i].imagename + yourannotationimgid[i].annotationid);
    }
    // yourannotationimgidunique = R.uniqWith(R.eqProps, yourannotationimgid);
    for (var i = 0; i < yourannotationimgid.length; i++) {
        //alert(yourannotationimgid[i].imagename + yourannotationimgid[i].annotationid);
    }
    yourantnimgidunique = _.uniqBy(yourannotationimgid, function (e) {
        return e.annotationid;
    });
    // for(var i =0;i<yourantnimgidunique.length;i++){
    //     alert(yourantnimgidunique[i].imagename + " " + yourantnimgidunique[i].annotationid);
    // }

}

function newload(){
    for (var i = 0; i < yourimageunique.length; i++) {
        var images = '<div style="position:relative;float:left" onclick="changeimage(\''+yourimageunique[i].imagename+'\')">'
				+'<img src="static/images/'+yourimageunique[i].imagename+'" alt="'+yourimageunique[i].imagename+'" class="mb-3 mr-3 rounded" width=300 height=300>'
				+'<svg class="hvr-border-fade" id="'+yourimageunique[i].imagename+'" style="position:absolute;left: 0px; top:0px;z-index: 2;cursor:pointer" width=300 height=300> '
                +'<image id="loading-'+yourimageunique[i].imagename+'" style="display:none" href="static/loadinggif.gif" x="120" y="130" height="50px" width="50px"/>';
        var image = document.getElementById(yourimageunique[i].imagename);
        imgrealwidth = image.width;
        imgrealheight = image.height;
        //alert(imgrealheight + " " + imgrealwidth);
           
        for (var y = 0; y < yourresultarray.length; y++) {
            if(yourresultarray[y].imagename == yourimageunique[i].imagename){
                if (yourresultarray[y].tool == 'Dot Tool') {
                    var convertstartx = yourresultarray[y].startx * 300 / imgrealwidth;
                    var convertstarty = yourresultarray[y].starty * 300 / imgrealheight;
                    images += '<circle cx="'+convertstartx+'" cy="'+convertstarty+'" r="3" fill="'+yourresultarray[y].color+'" />';
                } else {
                    var convertstartx = yourresultarray[y].startx * 300 / imgrealwidth;
                    var convertstarty = yourresultarray[y].starty * 300 / imgrealheight;
                    var convertendx = yourresultarray[y].endx * 300 / imgrealwidth;
                    var convertendy = yourresultarray[y].endy * 300 / imgrealheight;
                    var width = convertendx - convertstartx;
                    var height = convertendy - convertstarty;
                    var labelY = convertstarty - 3;

                    var fillY = convertstarty - 13;
                    var countlength = 0;
                    var activelabel = yourresultarray[y].imagelabel;
                    for(var z=0;z<activelabel.length;z++){
                        ++countlength;
                    }
                    var fillWidth = 10.5 * countlength;
                    images += '<rect x="'+convertstartx+'" y="'+convertstarty+'" width="'+width+'" height="'+height+'" fill="none" stroke="'+yourresultarray[y].color+'" stroke-width="3"/>'
                        + '<rect x="' + convertstartx + '" y="' + fillY + '" width="'+fillWidth+'" height="10" fill="'+yourresultarray[y].color+'" stroke="' + yourresultarray[y].color + '" stroke-width="3"/>'
                        + '<text x="' + convertstartx + '" y="' + labelY + '" fill="black" style="font-weight:bold">' + yourresultarray[y].imagelabel + '</text>';
                }
            }
        }
        images += '</svg></div>';
        document.getElementById("yourresultlist").innerHTML += images;
        // alert("success");
    }

}

function changeimage(imagedata){
    //alert("running");
    document.getElementById("loading-"+imagedata+"").style.display = "inline";
    for(var i=0;i<imagearray.length;i++){
        if(imagearray[i] == imagedata){
            var cursor = i;
        }
    }
    var updatecursor = ++cursor;
    //$.post("/updatecursor", { update_cursor: updatecursor });
    //setTimeout( function (){window.location.href = "/resize";},750);
    var xhr = new XMLHttpRequest();
    var url = "/updatecursor";
    var data = JSON.stringify([{ "annotator": ""+username+"", "cursor": ""+updatecursor+"" }]);
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
                window.location.href = "/resize";
            }
        };
    xhr.send(data);
}

function alerttest() {
    alert("success");
    
}