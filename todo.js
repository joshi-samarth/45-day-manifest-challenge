const lc=document.getElementById("list-container");


lc.addEventListener("click",function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked")
    }
});