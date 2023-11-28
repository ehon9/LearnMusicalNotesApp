function startGame() {
    // Hide the splash screen
    document.getElementById('image-container').style.display = 'block';
    document.querySelector('.jumbotron').style.display = 'none';

    // Get the image element by its id
    var splashImage = document.getElementById('splashImage');
    splashImage.style.display = 'none';

    //Redirect to game page
    window.location.href="./main.html";

    // Add your game initialization logic here
    console.log('Game initialized');
}