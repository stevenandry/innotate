var imagearray = [], imagenamearray = [], imagelabelarray = [], colorarray = []
    , annotateindexarray = [], filteredimagearray = [], toolarray = [], annotatorarray = []
    , startxarray = [], startyarray = [], endxarray = [], endyarray = [], annotationidarray = [];
var yourresultarray = [], yourannotationid = [], yourannotationidunique = [];
var yourannotationimgid = [], yourantnimgidunique = [], imgrealwidth, imgrealheight;
var yourresult = document.getElementById("yourresult");
var otherresult = document.getElementById("otherresult");
var username = document.getElementById("username").textContent;

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
    $('.annotateindexclass').each(function (index, element) {
        annotateindexarray.push($(element).text());
        //alert($(element).text());
    });
    $('.annotationidclass').each(function (index, element) {
        annotationidarray.push($(element).text());
        // alert($(element).text());
    });
    $('[data-toggle="popover"]').popover();
    loadimage();
    createyourresult();
    createyourannotationid();
    createyourimgid();
    // var canvas = document.getElementById("paint");
    
    // var ctx = canvas.getContext("2d");
    
    // var test = document.getElementById("images10.jpg");
    // ctx.drawImage(test, 0, 0, canvas.width, canvas.height);
    
});

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
                , annotationindex: annotateindexarray[i], annotationid: annotationidarray[i]
            });
            // alert(yourresultarray[0].imagename+yourresultarray[0].imagelabel+yourresultarray[0].startx
            //     +yourresultarray[0].starty+yourresultarray[0].endx+yourresultarray[0].endy
            //     +yourresultarray[0].tool+yourresultarray[0].color+yourresultarray[0].annotator
            //     +yourresultarray[0].annotationindex+yourresultarray[0].annotationid);
        }
    }
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

function test(){
     for (var i = 0; i < yourantnimgidunique.length; i++) {
        alert(yourantnimgidunique[i].annotationid);
        var images = '<canvas class="mr-3 mb-3 hvr-grow" id="'+yourantnimgidunique[i].annotationid +'" width="300" height="300"></canvas>';
        document.getElementById("yourresultlist").innerHTML += images;
        var canvas = document.getElementById(yourantnimgidunique[i].annotationid);
        var ctx = canvas.getContext("2d");
        var image = document.getElementById(yourantnimgidunique[i].imagename);
        imgrealwidth = image.width;
        imgrealheight = image.height;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        for (var y = 0; y < yourresultarray.length; y++) {
            if (yourantnimgidunique[i].annotationid == yourresultarray[y].annotationid) {
                if (yourresultarray[y].tool == 'Dot Tool') {
                    var convertstartx = yourresultarray[y].startx * 300 / imgrealwidth;
                    var convertstarty = yourresultarray[y].starty * 300 / imgrealheight;
                    ctx.beginPath();
                    ctx.arc(convertstartx, convertstarty, 4, 0, Math.PI * 2, true);
                    ctx.fill();
                } else {
                    // var convertstartx = yourresultarray[y].startx * 300 / imgrealwidth;
                    // var convertstarty = yourresultarray[y].starty * 300 / imgrealheight;
                    // var convertendx = yourresultarray[y].endx * 300 / imgrealwidth;
                    // var convertendy = yourresultarray[y].endy * 300 / imgrealheight;
                    // var width = convertendx - convertstartx;
                    // var height = convertendy - convertstarty;
                    // images += '<rect x="'+convertstartx+'" y="'+convertstarty+'" width="'+width+'" height="'+height+'" fill="none" stroke="red" stroke-width="4"/>';
                }
            }
        }
        // alert("success");
    }
}

function test2() {
    for (var i = 0; i < yourantnimgidunique.length; i++) {
        var images = '<div style="position:relative"><img src="static/images/'+yourantnimgidunique[i].imagename+'" class="mb-3 mr-3 hvr-grow" width=300 height=300>'
				+'<svg class="hvr-fade" id="svgovercanvas" style="position:absolute;left: 0px; top:0px;z-index: 2;cursor:pointer"width=300 height=300> ';
        var getimage = document.getElementById(yourannotationimgid[i].imagename);
        imgrealwidth = getimage.width;
        imgrealheight = getimage.height;
        for (var y = 0; y < yourresultarray.length; y++) {
            if (yourantnimgidunique[i].annotationid == yourresultarray[y].annotationid) {
                if (yourresultarray[y].tool == 'Dot Tool') {
                    var convertstartx = yourresultarray[y].startx * 300 / imgrealwidth;
                    var convertstarty = yourresultarray[y].starty * 300 / imgrealheight;
                    images += '<circle cx="'+convertstartx+'" cy="'+convertstarty+'" r="4" fill="red" />';
                } else {
                    var convertstartx = yourresultarray[y].startx * 300 / imgrealwidth;
                    var convertstarty = yourresultarray[y].starty * 300 / imgrealheight;
                    var convertendx = yourresultarray[y].endx * 300 / imgrealwidth;
                    var convertendy = yourresultarray[y].endy * 300 / imgrealheight;
                    var width = convertendx - convertstartx;
                    var height = convertendy - convertstarty;
                    images += '<rect x="'+convertstartx+'" y="'+convertstarty+'" width="'+width+'" height="'+height+'" fill="none" stroke="red" stroke-width="4"/>';
                }
            }
        }
        images += '</svg></div>';
        document.getElementById("yourresultlist").innerHTML += images;
        // alert("success");
    }
}

// function loadresult() {
//     // var images = '<svg width="300" height="300" style="cursor:pointer" class="mr-3 mb-3 hvr-grow">' 
//     // 			+'<image xlink:href="static/images/images (2).jpeg" width="300" height="300" x="0" y="0" />'
//     // 		+'</svg>';
//     //bikin list baru dari yourresultarray untuk khusus annotationid aja, nanti dibikin unique
//     //bikin list baru dari yourresultarray jg untuk annotationid dan image, utk di compare
//     for (var i = 0; i < annotationidarray.length; i++) {
//         var images = '<svg width="300" height="300" style="cursor:pointer" class="mr-3 mb-3 hvr-grow">';
//         for(var z=0;z< imageannotationid.length; z++){
//             if(annotationidarray[i] == imageannotationid[z].annotationid){
//                 images+='<image xlink:href="static/images/images (2).jpeg" width="300" height="300" x="0" y="0" />';
//             }
//         }

//         for (var y = 0; y < yourresultarray.length; i++) {
//             if (annotationidarray[i] == yourresultarray[y].annotationid) {
//                 if (yourresultarray[y].tool == 'Dot Tool') {
//                     images += '<circle id="testcircle" cx="50" cy="50" r="40" fill="yellow" />';

//                 } else {
//                     images += '<rect>'
//                 }
//             }
//         }
//         images += '</svg>';
//         document.getElementById("yourresultlist").innerHTML += images;
//     }
// }

// function removeDuplicates(myArr, prop) {
//     return myArr.filter((obj, pos, arr) => {
//         return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
//     });
// }
// for(var i = 0;i<yourannotationidunique.length;i++){
//     for(var y =0;y<yourresultarray.length;y++){
//         if(yourresultarray[y].annotationid == yourannotationidunique[i]){
//             for( var z=0;z<yourannotationimgid.length;z++){
//                 var check = yourannotationimgid[z].annotationid.includes(yourannotationidunique[i]);
//                 if(check == false){
//                     yourannotationimgid.push({ imagename: yourresultarray[i].imagename, annotationid: yourresultarray[i].annotationid });
//                     alert("success");
//                 }
//             }
//         }
//     }
// }

function loadyourresult(){
    for (var i = 0; i < yourantnimgidunique.length; i++) {
        var images = '<svg width="300" height="300" style="cursor:pointer" class="mr-3 mb-3 hvr-grow">';
        images += '<image xlink:href="static/images/'+ yourantnimgidunique[i].imagename +'" width="300" height="300" x="0" y="0" />';
        // alert("1"); //passed
        for(var z=0;z<imagearray.length;z++){
            if(yourantnimgidunique[i].imagename == imagearray[z]){
                var image = document.getElementById(imagearray[z]);
                imgrealwidth = image.width;
                imgrealheight = image.height;
                // alert(imgrealheight + " " + imgrealwidth);
            }
        }
        for (var y = 0; y < yourresultarray.length; y++) {
            if (yourantnimgidunique[i].annotationid == yourresultarray[y].annotationid) {
                if (yourresultarray[y].tool == 'Dot Tool') {
                    var convertstartx = yourresultarray[y].startx * 300 / imgrealwidth;
                    var convertstarty = yourresultarray[y].starty * 300 / imgrealheight;
                    images += '<circle cx="'+convertstartx+'" cy="'+convertstarty+'" r="4" fill="red" />';
                } else {
                    var convertstartx = yourresultarray[y].startx * 300 / imgrealwidth;
                    var convertstarty = yourresultarray[y].starty * 300 / imgrealheight;
                    var convertendx = yourresultarray[y].endx * 300 / imgrealwidth;
                    var convertendy = yourresultarray[y].endy * 300 / imgrealheight;
                    var width = convertendx - convertstartx;
                    var height = convertendy - convertstarty;
                    images += '<rect x="'+convertstartx+'" y="'+convertstarty+'" width="'+width+'" height="'+height+'" fill="none" stroke="red" stroke-width="4"/>';
                }
            }
        }
        images += '</svg>';
        document.getElementById("yourresultlist").innerHTML += images;
        // alert("success");
    }

}

function alerttest() {
    alert("success");
    
}