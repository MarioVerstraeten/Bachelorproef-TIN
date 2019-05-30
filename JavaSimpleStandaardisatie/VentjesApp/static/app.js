//attributen
let canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    draw_flag = false;

let geselecteerdKleur = "black",
    geselecteerdBreedte = 5;

let outlineImage = new Image();
//let crayonTextureImage = new Image();

outlineImage.src = newFunction();

function init() {

    //verberg eerst trainingsmenu
    $("#ComplexEmotionsWindow").hide();

    //verbergen van de progressie-knoppen
    $("#save").hide();
    $("#volgende").hide();
    

    let complexe_Emoties = new Map();
    let simpele_Emoties = new Map();
    

    //Init resources
    /*laadResources(outlineImage,"Ventje.png" );
    laadResources(crayonTextureImage,"Crayon-texture.png" );*/

    //init van custom-dropdown
    $('.ui.dropdown').dropdown({ direction: "down" });

    //init van canvas
    canvas = document.getElementById('can');
    canvas.width = 405;
    canvas.height = 694;
    ctx = canvas.getContext("2d");
    rect = canvas.getBoundingClientRect()
    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);

    //Map van emoties en RGB-waarde vullen
    complexe_Emoties.set("Vermoeid", "RightEmotionsDiv");
    complexe_Emoties.set("Wanhopig", "RightEmotionsDiv");
    complexe_Emoties.set("Moedeloos", "RightEmotionsDiv");
    complexe_Emoties.set("Onbegrip", "RightEmotionsDiv");
    complexe_Emoties.set("Onzeker", "RightEmotionsDiv");
    complexe_Emoties.set("Ongerust", "RightEmotionsDiv");
    complexe_Emoties.set("Gefrustreerd", "RightEmotionsDiv");
    complexe_Emoties.set("Afschuw", "RightEmotionsDiv");
    complexe_Emoties.set("Opgewonden", "LeftEmotionsDiv");
    complexe_Emoties.set("Zelfverzekerd", "LeftEmotionsDiv");
    complexe_Emoties.set("Dankbaar", "LeftEmotionsDiv");
    complexe_Emoties.set("Opgelucht", "LeftEmotionsDiv");
    complexe_Emoties.set("Bewondering", "LeftEmotionsDiv");
    complexe_Emoties.set("Trots", "LeftEmotionsDiv");
    complexe_Emoties.set("Bezorgd", "LeftEmotionsDiv");
    complexe_Emoties.set("Beschaamd", "LeftEmotionsDiv");

    simpele_Emoties.set("Tevreden", "#EAF013");
    simpele_Emoties.set("Ontspannen", "#74BF04");
    simpele_Emoties.set("Boos", "#A61C00");
    simpele_Emoties.set("Angstig", "#741B47");
    simpele_Emoties.set("Verdrietig", "#1155CC");

    //Initieer simpele emotie-wrapper en add event-handlers voor kleur
    initieerSimpeleEmotiesDivs(simpele_Emoties);
    complexe_Emoties.forEach(function (value, key) {
        $("#Emotie-" + key + "").mousedown(function () {
            geselecteerdKleur = value;
        });
    });


    //Initieer complexe emotie-wrappers
    complexe_Emoties.forEach(function (value, key) {
        initieerComplexEmotiesDivs(key, value);
    });

    //Initieer complexe emotie-sliders
    initieerSliders();



    //Toevoegen van overige event-handlers
    $("#gom").click(function () {
        geselecteerdKleur = "white";
        geselecteerdBreedte = 10;

    });
    $("#save").click(function () {
        save();
    });

    $("#reset").click(function () {
        reset();
    });

    $("#volgende").click(function () {
        switchNaarComplexeEmoties();
    });

    /*$("#saveTekst").click(function() {
        
    });*/



    //Bug met Sementic Dropdown, waar event propogation voorkomt en ervoor zorgt dat data-value niet correct wordt meegegeven

    /* $(".item").click(function(e) {
 
         setGeselecteerdBreedte(e.target.getAttribute('data-value'));
         
     });*/


    ctx.drawImage(outlineImage, 0, 0, canvas.width, canvas.height);

    //toevoegen van event-listeners voor de simpele emoties.
    var emoties = document.getElementsByClassName("hvr-grow");
    for (var i = 0; i < emoties.length; i++) {
        emoties[i].addEventListener('click', function () {
            toggleElement(this);
        }, false);
    }

}

function presenteerResultaten(respons) {

   //console.log("start functie")

    let emotiesMap = new Map();

    emotiesMap.set(0, ["Opgewonden", "#F18819"]);
    emotiesMap.set(1, ["Zelfverzekerd", "#F1C232"]);
    emotiesMap.set(2, ["Dankbaar", "#B6EF67"]);
    emotiesMap.set(3, ["Opgelucht", "#54FF54"]);
    emotiesMap.set(4, ["Bewondering", "#74BF04"]);
    emotiesMap.set(5, ["Trots", "#A9DB20"]);
    emotiesMap.set(6, ["Bezorgd", "#4A86E8"]);
    emotiesMap.set(7, ["Beschaamd", "#4A86E8"]);
    emotiesMap.set(8, ["Vermoeid", "#3375B7"]);
    emotiesMap.set(9, ["Wanhopig", "#073763"]);
    emotiesMap.set(10, ["Moedeloos", "#1155CC"]);
    emotiesMap.set(11, ["Onbegrip", "#674EA7"]);
    emotiesMap.set(12, ["Onzeker", "#C27BA0"]);
    emotiesMap.set(13, ["Ongerust", "#A64D79"]);
    emotiesMap.set(14, ["Gefrustreerd", "#CC0000"]);
    emotiesMap.set(15, ["Afschuw", "#A61C00"]);

    //console.log(respons);

    var opgesplitst = respons.split(" ");
    //console.log(opgesplitst);
    opgesplitst.map(element => {
        element = Number(element);
    });

    for(let i = 0;i<opgesplitst.length;i++){
        if(Object.keys(opgesplitst[i]).length ===0 || opgesplitst[i] === ''){
            opgesplitst.splice(i,1);
          i--;
        }
      }
   //console.log(opgesplitst);
    let idx = findIndicesOfMax(opgesplitst, 3);
    let valueInMap = new Array();
    //console.log(idx);
    $("#Result-wrapper").html("");
    $("#Result-wrapper").append("<h1>Voel je jou misschien?</h1>");
    for (var i = 0; i < idx.length; i++) {
        valueInMap = emotiesMap.get(idx[i]);
        initieerResultDivs(valueInMap[0], valueInMap[1], i)
    }

    //$("#Result-wrapper").load("#Result-wrapper > *");

}

function initieerResultDivs(naam, kleur, i){
    let $fixture;

    $fixture = $([
        "<div class='row maakFlex addPadding'>",
        "<div id='top"+i+"' class='col-lg-"+(4-i)+" maakFlex borderRadius-wrap' style='background:" + kleur + "'>",
        "<div class='emoji-wrapper' style='max-width: 85%; padding-top: 10%'>",
        "<img class='emoji-image img-fluid' src='/static/Emoties/"+naam+".png' alt='"+naam+"-Smiley'>", 
        "<span class='maakFlex omschrijving' style='font-size:"+Number(150-(i*37.5))+"%'>"+naam +"</span>",
        "</div>",
        "</div>",
        "</div>"
    ].join("\n"));
    
    $("#Result-wrapper").append($fixture);    
}

function findIndicesOfMax(inp, count) {
    var outp = [];
    for (var i = 0; i < inp.length; i++) {
        outp.push(i); // add index to output array
        if (outp.length > count) {
            outp.sort(function (a, b) { return inp[b] - inp[a]; }); // descending sort the output array
            outp.pop(); // remove the last index (index of smallest element in output array)
        }
    }
    return outp;
}


function GoInFullscreen(element) {
    if (element.requestFullscreen)
        element.requestFullscreen();
    else if (element.mozRequestFullScreen)
        element.mozRequestFullScreen();
    else if (element.webkitRequestFullscreen)
        element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen)
        element.msRequestFullscreen();
}

function GoOutFullscreen() {
    if (document.exitFullscreen)
        document.exitFullscreen();
    else if (document.mozCancelFullScreen)
        document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen)
        document.webkitExitFullscreen();
    else if (document.msExitFullscreen)
        document.msExitFullscreen();
}



function genereerTekstBestandMetProcenten(filenaam) {

    var testdata = "";
    $(".SliderComponent[data-value]").each(function () {
        testdata += $(this).attr('data-slider-id');
        testdata = testdata.replace("Slider", " : ");
        testdata += $(this).data('value');
        testdata += " ; "; //delimiter
    });

    console.log(testdata);

    var data = new Blob([testdata], { type: 'text/plain' });

    /*textfile = window.URL.createObjectURL(data);
    var link = document.getElementById('downloadlink');
    link.href = textfile;*/

    var a = document.createElement('a');
    a.download = filenaam + ".txt";
    a.href = URL.createObjectURL(data);
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

}

function toggleElement(emotie) {
    if ($(".is-active")[0]) {
        for (let index = 0; index < $(".is-active").length; index++) {
            $(".is-active")[index].classList.toggle("is-active");
        }
        // $(".hvr-grow")[0].classList.toggle("is-active"); 
        emotie.classList.toggle("is-active");
    } else {
        emotie.classList.toggle("is-active");
    }
}

function switchNaarComplexeEmoties() {

    $("#SimpelEmotionsWindow").hide();
    $("#ComplexEmotionsWindow").show();

    $("#volgende").hide();
    $("#save").show();

    // Bug met de sliders. Het in en uit fullscreen -mode gaan zorgt ervoor dat de sliders opnieuw worden opgemaakt (door aanpassing in de vormgeving van het element), anders initialiseren ze foutief door op "display:none" te worden geplaatst in het begin.
    GoInFullscreen($("body").get(0));
    setTimeout(function () {
        GoOutFullscreen();
    }, 10);


}


function setGeselecteerdBreedte(breedte) {
    switch (breedte) {
        case "klein":
            geselecteerdBreedte = 5;
            break;
        case "medium":
            geselecteerdBreedte = 15;
            break;
        case "groot":
            geselecteerdBreedte = 25;
            break;

        default:
            geselecteerdBreedte = 5;
            break;
    }
}

/*function laadResources(variabele, url){
    variabele.src = url;
    variabele.origin = "Anonymous";
}*/

function initieerComplexEmotiesDivs(key, value) {

    let $fixture;

    $fixture = $([
        "<div id='Emotie-" + key + "' class='emotie-wrapper row hvr-sweep-to-right hvr-outline-out '>", //hvr-sweep-to-right hvr-outline-out
        "<div class='blank-wrapper maakFlex col-lg-3'>",
        "<div class='emoji-wrapper'>",
        "<img class='emoji-image img-fluid' src='/static/Emoties/" + key + ".png' alt='" + key + " Smiley'>",
        "<span class='maakFlex omschrijving'>" + key + "</span>",
        "</div>",
        "</div>",
        "<div class='blank-wrapper maakFlex col-lg-9'>",
        "<input class='SliderComponent' type='text' data-slider-id='" + key + "Slider'/>",
        "</div>",
        "</div>"
    ].join("\n"));
    $("#" + value).append($fixture);
}

function initieerSimpeleEmotiesDivs(map) {

    let $fixture;

    $fixture = $([
        /*Geen gebruik gemaakt van bootstrap-offset, door offset ook aan de rechterkant diende te gebeuren */
        "<h1>Klik op een gezichtje om een kleur te gebruiken</h1>",
        "<div id='TopEmotionsDiv' class='row' style='width:100%; margin-top:3%;'>",

        "<div class='col-lg-1 no-padding'></div>",
        "<div class='emoji-wrapper col-lg-2 no-padding '>",
        "<div id='Emotie-Tevreden' class='borderRadius-wrap hvr-grow'>",
        "<img class='simpel-emoji-image img-fluid' src='/static/SimpelEmoties/Tevreden.png' alt='Smiley'>",
        "</div>",
        "</div>",
        "<div class='col-lg-2 no-padding'></div>",
        "<div class='emoji-wrapper col-lg-2 no-padding'>",
        "<div id='Emotie-Ontspannen' class='borderRadius-wrap hvr-grow'>",
        "<img class='simpel-emoji-image img-fluid' src='/static/SimpelEmoties/Ontspannen.png' alt='Smiley'>",
        "</div>",
        "</div>",
        "<div class='col-lg-2 no-padding'></div>",
        "<div class='col-lg-2 emoji-wrapper no-padding'>",
        "<div id='Emotie-Verdrietig' class='borderRadius-wrap hvr-grow'>",
        "<img class='simpel-emoji-image img-fluid' src='/static/SimpelEmoties/Verdrietig.png' alt='Smiley'>",
        "</div>",
        "</div>",
        "<div class='col-lg-1 no-padding'></div>",
        "</div>",

        "<div id='BottomEmotionsDiv' class='row' style='width:100%'>",
        "<div class='col-lg-3 no-padding'></div>",
        "<div class='emoji-wrapper col-lg-2 no-padding'>",
        "<div id='Emotie-Angstig' class='borderRadius-wrap hvr-grow'>",
        "<img class='simpel-emoji-image img-fluid' src='/static/SimpelEmoties/Angstig.png' alt='Smiley'>",
        "</div>",
        "</div>",
        "<div class='col-lg-2 no-padding'></div>",
        "<div class='emoji-wrapper col-lg-2 no-padding'>",
        "<div id='Emotie-Boos' class='borderRadius-wrap hvr-grow'>",
        "<img class='simpel-emoji-image img-fluid' src='/static/SimpelEmoties/Boos.png' alt='Smiley'>",
        "</div>",
        "</div>",
        "<div class='col-lg-3 no-padding'></div>",
        "</div>",
    ].join("\n"));
    $("#SimpelEmotionsWindow").append($fixture);

    map.forEach(function (value, key) {
        $("#Emotie-" + key + "").mousedown(function () {
            geselecteerdKleur = value;
        });
        $("#Emotie-" + key + "").css("cssText", "background:" + value);

    });



}

function initieerSliders() {
    //Initieer Sliders:
    $(".SliderComponent").slider({
        ticks: [0, 25, 50, 75, 100],
        ticks_labels: ['0%', '25%', '50%', '75%', '100%'],
        ticks_snap_bounds: 0,
        value: 0

    });

    /*     $("#"+key+"Slider .slider-selection").css("cssText","background:"+value);
         $("#"+key+"Slider .slider-handle").css("cssText","background:"+value);
         $("#"+key+"Slider .in-selection").css("cssText","background:"+value);
         $("#"+key+"Slider .slider-tick.in-selection").css("cssText","background:"+value);*/

    //event-listener voor het kleur
    /* $("#Emotie-"+key+"").mousedown(function() {
        geselecteerdKleur = value;
    }); */
}

function draw() {

    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = geselecteerdKleur;
    ctx.lineWidth = geselecteerdBreedte;
    ctx.lineCap = "round"; //zorgt voor rond penseel i.p.v. vierkant
    ctx.stroke();
    ctx.closePath();
    //ctx.drawImage(crayonTextureImage, 0, 0, canvas.width, canvas.height); //Om texture van kleurpotlood toe te voegen.

}

function tekenVentje() {

    ctx.drawImage(outlineImage, 0, 0, canvas.width, canvas.height);

}

function clearCanvas() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

}

function reset() {
    location.reload();
}

function save() {
    var today = new Date();
    var date = today.getFullYear() + '_' + (today.getMonth() + 1) + '_' + today.getDate();
    var time = today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds();
    var dateTime = date + '_' + time;

    var dataURL = canvas.toDataURL('image/png');

    canvas.toBlob(function (blob) {
        saveAs(blob, dateTime + ".png");
    });

    genereerTekstBestandMetProcenten(dateTime);
}

function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        /*currX = e.pageX - canvas.offsetLeft;
        currY = e.pageY - canvas.offsetTop;*/
        currX = getMousePos(e).xCoord;
        currY = getMousePos(e).yCoord;

        flag = true;
        draw_flag = true;


        if (draw_flag) {
            ctx.beginPath();
            ctx.fillStyle = geselecteerdKleur;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            draw_flag = false;
            tekenVentje();
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            /*currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;*/ // deze methode werkt niet door de relatie tussen bitmap en element 
            currX = getMousePos(e).xCoord;
            currY = getMousePos(e).yCoord;
            draw();
            tekenVentje();
        }
    }
}

function getMousePos(e) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    return {
        xCoord: (e.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        yCoord: (e.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}


function newFunction() {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZUAAAK2CAMAAACxVfEMAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5SUlJWVlZaWlpeXl5iYmJmZmZqampubm5ycnJ2dnZ6enp+fn6CgoKGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tObm5v7+/v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJbizNEAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGHRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4wLjb8jGPfAABlaklEQVR4Xu2dh4MUxdb2T1V1T9hdMpJBEROIBFFESYI5IuaI4Rq5KoIRFBDMWVTMYrxeI4r67fx5fM9Tc4BlmdDd02l570+EnZ2Z6qp6KpxKp6RxfDGo/45sjjdVjg9GviqvvLBzx8UXXL764ktWLb/ikZd2vvynvnGIEVh9RpQqR+fvK49fNU3EmECcBIKfnDXGiFREJq1+cNvf+rGRyIhR5WhFdp5voYNICBXE4q/A+df4wYiFSHhtF278Cx8diT3NCGzB3rp2lM//EMJAgAB/USITosKg4uCFE8MaY0KpnPOyfmtEMZJUYan/8Kw6shuVIWzWkSaBpRxioI6Tqv8N/scraCMnb9XvjhxGVF3Zd0ENuc5sZ3tFUVgrWFnwTxN0LPiNb9e8RPyFmDPf0BBGCCNIlTt9DbAUwLGHZ0Vwk9du3PbitwcP8e3OHU+uOJUNmv7vvIDO2Cs0lBHBiFFlnc9b6xsq/C8y/a6n/lItjuXAy7dBG1YT1B2HagOBFv2jQZWfEaLKGrRK6EnQm/gOZNK6dzX7O/H1hpMgDBu6EDYZOp15P2twZafsqvheeiFbIZFa4HuJU3dprkfh8yW+pUN9EWednPidD7XsjIC6shqCOMuaIjWZ/m/N7uhsn+17fX7fVORMDbXUlF6VrUEwCr0C+gVj+27/R3M6Jg9OryEEaIK+Se7TkEtM2VUZG3ojiuOO8U9pHifhvZm+75cK5B3/mgZeWsqtynL00xAEHbyZukPzNylfnAZBauiZoPIiDb+slFmV/45B/4zGC5385Pc1b3vhxyW03zgRIPKqPqOclFiVuzmBgpIdyMCzmq+9snes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';
}