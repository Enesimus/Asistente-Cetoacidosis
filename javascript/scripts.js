
// Define variables para ingreso de datos
var pes = document.getElementById("pesopac");
var i = document.getElementById("insulin");
var cg = document.getElementById("carga");
var ap = document.getElementById("apprevio");
var dh = document.getElementById("dh");
var vm = document.getElementById("volmant");
var u = document.getElementById("unidv");
var k = document.getElementById("ki");
var n = document.getElementById("na");

// Agrega los eventos que gatillaran el recálculo
window.addEventListener("load",visor);
pes.addEventListener("change",calcularHoja);
i.addEventListener("change",calcularHoja);
cg.addEventListener("change",calcularHoja);
ap.addEventListener("change",calcularHoja);
dh.addEventListener("change",calcularHoja);
vm.addEventListener("change",calcularHoja);
u.addEventListener("change",calcularHoja);
k.addEventListener("change",calcularHoja);
n.addEventListener("change",calcularHoja);
dh.addEventListener("change",visor);


// Funcion que muestra valor del nivel de deshidratacion
function visor() {
    var dh = document.getElementById("dh").value;
    document.getElementById("visor").innerHTML = dh+"%.";
}

// Funcion principal de calculo y presentacion de datos
function calcularHoja() {
    var peso=Number(document.getElementById("pesopac").value);
    var supercorp = supcorp(peso);
    var ic = Number(document.getElementById("insulin").value);
    var dh = Number(document.getElementById("dh").value);  
    var df= defFluid(peso,dh);
    var unid = document.getElementById("unidv").value;
    var volumen= Number(document.getElementById("volmant").value);
    var vmanten= volMant(peso,supercorp,unid,volumen);
    var app=Number(document.getElementById("apprevio").value);
    var ap1=aport24h(vmanten,app,df);
    document.getElementById("sc").innerHTML=supercorp.toPrecision(2);
    var ap2=aport48h(vmanten,df);
    var insul = insulinDrip(ic,peso);
    var cagl = Number(document.getElementById("carga").value);
    var suero1 = (ap1 - ap1*cagl/10)/24;
    var suero2 = ap1*cagl/10/24;
    var kcl = potasio(Number(document.getElementById("ki").value));
    var nacl = sodio(Number(document.getElementById("na").value));
    document.getElementById("deffluid").innerHTML=df;
    document.getElementById("apprimdia").innerHTML=ap1.toFixed(0);
    document.getElementById("apsegdia").innerHTML=ap2.toFixed(0);
    document.getElementById("cantinsul").innerHTML = insul.toFixed(0);
    document.getElementById("concinsul").innerHTML = ic;
    document.getElementById("drip1").innerHTML = suero1.toFixed(0);
    document.getElementById("drip2").innerHTML = suero2.toFixed(0);
    document.getElementById("k1").innerHTML = kcl.toFixed(0);
    document.getElementById("k2").innerHTML = kcl.toFixed(0);
    document.getElementById("na1").innerHTML = nacl.toFixed(0);
}

// Calculo superficie corporal
function supcorp(peso) {
    var sc = ((peso*4)+7)/(90+peso);
    return sc;
}

// Calculo volumen mantencion
function volMant(peso,sc,unid,volumen) {  
    switch (unid) {
        case "a":
            var volumant = volumen*peso;
            break;
        case "b":
            var volumant = volumen * sc;
    }
    return volumant;
}

// Calculo del deficit de fluidos
function defFluid(peso,porcentaje) {
    var defFluido = peso * porcentaje * 10;
    return defFluido;
}

// Calculo de los aportes durante el primer dia
function aport24h(volMant,aportePrevio,defFluid) {
    var aportes1 = (volMant - aportePrevio) + defFluid*0.5;
    return aportes1;
}

// Calculo de los aportes durante el segundo dia
function aport48h(volMant,defFluid){
    var aportes2 = volMant+defFluid*0.5;
    return aportes2;
}

// Calculo de la cantidad de insulina a preparar
function insulinDrip(ic,peso){
    var cantIns = ic*50*peso;
    return cantIns;
}


/* Administracion de potasio
K < 3,5 --> 40 mEq/L
K 3,5 - 5,5 --> 20 mEq/L
K > 5,5 --> Sin K hasta que baje a menos de 5*/

function potasio(k) {
    var kcl;
    if (k<3.5) {
        kcl = 40;
    } else { 
        if (k < 5.5) {
            kcl = 20;
        } else {
            kcl = 0;
        }  
    }
    var kclml = kcl/(2*1.34);
    return kclml
}

/* Administracion de Fosfato
Fosfemia menor a 1 mg/dL o compromiso de conciencia persistente --> 20-30 mEq/L monitoreo calcemia.
Maximo a administrar es 4,5 mmol/h (1,5 mL/h K2PO4)*/

/* Administracion de sodio*/

function sodio(na) {
    var nacl = na/(2*1.74);
    return nacl;
    
}

