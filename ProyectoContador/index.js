let c = 0;

function increment(){
    c++;
    document.getElementById('count').textContent = c;
}

function decrement(){
    c--;
    document.getElementById('count').textContent = c;
}

function reset(){
    c = 0;
    document.getElementById('count').textContent = c;
}

