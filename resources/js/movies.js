const API_KEY="45e229fc858f2b60209ab5aabd5f73bd";
const END_POINT="https://api.themoviedb.org/3";
const POPULARES="/movie/popular";
const TOPRATED="/movie/top_rated";
const ESTRENOS="/movie/upcoming";
const EN_CARTELERA="/movie/now_playing";
const IMG_ENDPOINT="https://image.tmdb.org/t/p/";
var seccion=document.getElementsByClassName("movies");
var secciones=[];
secciones.push({title:"En Cartelera",id:"encartelera",pagina:1,recurso:EN_CARTELERA});
secciones.push({title:"Populares",id:"populares",pagina:1,recurso:POPULARES});
secciones.push({title:"Mejor Ranquedas",id:"ranqueadas",pagina:1,recurso:TOPRATED});
secciones.push({title:"Estrenos",id:"estrenos",pagina:1,recurso:ESTRENOS});

(function(){
    init();
    listener();
}());


function init(){
    showLoader();
    secciones.forEach(element => {
        getPeliculas(element.title,element.id,element.recurso,element.pagina);    
    });
    hideLoader();
}

function showLoader(){
    document.getElementById("modal").style.display='flex';
}

function hideLoader(){
    setTimeout(() => {
        document.getElementById("modal").style.display='none';    
    }, 3000);
}

function listener(){
    document.getElementById("movie").addEventListener('click',selectedMovie,false);
    document.getElementById("buscador").addEventListener('keyup',search)
}
function search(e){
    if(e.target.value.length>3){
        alert("buscar "+e.target.value);
    }
}
function selectedMovie(e){
    var closest = event.target.closest(".carousel-item__details");
    var id=closest.dataset.id
    alert("Obtener detalle pelicula "+id);
}

async function getPeliculas(titulo,id,recurso,pagina){
    crearTitulo(titulo);
    crearCarrusel(id);
    var movies=await getMoviesAPI(pagina,recurso);
    movies.results.forEach(element => {
        crearItem(id,element);
    });
}

function crearTitulo(title){
    var titulo=document.createElement("h2");
    titulo.classList.add("categories__title");
    titulo.innerText=title;
    seccion[0].appendChild(titulo);
}

function crearCarrusel(id){
    var carrusel=document.createElement("div");
    carrusel.classList.add("carousel");
    carrusel.id=id;

    var carruselContainer=document.createElement("div");
    carruselContainer.classList.add("carousel__container");
    carruselContainer.id="container-"+id;

    carrusel.appendChild(carruselContainer);
    seccion[0].appendChild(carrusel);

    document.getElementById(id).addEventListener("scroll",scroll);

}

async function scroll(e){
    if(e.target.offsetWidth + e.target.scrollLeft == e.target.scrollWidth){
        var element=secciones.filter(ele=>ele.id===e.target.id);
        var indice=secciones.indexOf(element[0]);
        secciones[indice].pagina=secciones[indice].pagina+1;
        var movies=await getMoviesAPI(secciones[indice].pagina,secciones[indice].recurso);
        movies.results.forEach(element => {
            crearItem(secciones[indice].id,element);
        });
        
    }
}

function crearItem(id,element){
    var contenedor=document.getElementById("container-"+id);

    var item=document.createElement("div");
    item.classList.add("carousel-item");

    var img=document.createElement("img");
    img.classList.add("carousel-item__img");
    img.src=IMG_ENDPOINT+"/original"+element.poster_path;

    var detailes=document.createElement("div");
    detailes.classList.add("carousel-item__details");
    detailes.setAttribute("data-id",element.id);

    var title=document.createElement("p");
    title.classList.add("carousel-item__details--title");
    title.innerText=element.original_title;

    var subtitle=document.createElement("p");
    subtitle.classList.add("carousel-item__details--subtitle");
    subtitle.innerText=element.release_date;

    detailes.appendChild(title);
    detailes.appendChild(subtitle);

    item.appendChild(img);
    item.appendChild(detailes);

    contenedor.appendChild(item);
}



async function getMoviesAPI (page,recurso){
    let data = await fetch(END_POINT+recurso+"?api_key="+API_KEY+"&language=en-US&page="+page)
        .then((response) => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
        });
    return data;
}
