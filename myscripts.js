// Initialise settings
var settings = getSelectedSettings();
var mySpeed, timeRemaining;

switch (settings.speed) {
    case 'slow':
        if (settings.difficulty === 'challenging')
            mySpeed = 40;
        else
            mySpeed = 30;
        break;
    case 'normal':
        if (settings.difficulty === 'challenging')
            mySpeed = 30;
        else
            mySpeed = 20;
        break;
    case 'fast':
        if (settings.difficulty === 'challenging')
            mySpeed = 20;
        else
            mySpeed = 10;
        break;
    default:
        mySpeed = 20;
        break; 
}

// Start countdown timer
Timer(mySpeed);

// Set Focus on first text box
setFocusOnTextBox();

// Import helper classes 
const { 
    Renderer, 
    Stave,
    StaveNote, 
    Voice,
    Formatter,
} = Vex.Flow;

// Assign variables
var numBeat = 4, beatValue = 4;
var rendererWidth = 500, rendererHeight = 250;
var countDelay = 3000;

// Generate random notes and octaves based on difficulty level
var randNoteArrM1 = [], randOctArrM1 = [], randNoteArrFormattedM1 = [];
var randNoteArrM2 = [], randOctArrM2 = [], randNoteArrFormattedM2 = [];

 switch (settings.difficulty) {
    case 'easy':
        for (i = 0; i < numBeat; i++) {
            randNoteArrM1[i] = getRandNote();
            randNoteArrFormattedM1[i] = randNoteArrM1[i].concat('/4');
        }

        oneMeasure();
        break;
    case 'normal':
        for (i = 0; i < numBeat; i++) {
            randNoteArrM1[i] = getRandNote();
            randOctArrM1[i] = '/'.concat(getRandOct(4, 5));
            randNoteArrFormattedM1[i] = randNoteArrM1[i].concat(randOctArrM1[i]);
        }

        oneMeasure();
        break;
    case 'challenging':
        for (i = 0; i < numBeat; i++) {
            // Measure 1
            randNoteArrM1[i] = getRandNote();
            randOctArrM1[i] = '/'.concat(getRandOct(4, 5));
            randNoteArrFormattedM1[i] = randNoteArrM1[i].concat(randOctArrM1[i]);
            
            // Measure 2
            randNoteArrM2[i] = getRandNote();
            randOctArrM2[i] = '/'.concat(getRandOct(4, 5));
            randNoteArrFormattedM2[i] = randNoteArrM2[i].concat(randOctArrM2[i]);
        }

        twoMeasures();

        // Add four new text boxes
        addTextBox(5); addTextBox(6); addTextBox(7); addTextBox(8);
        break;
    default:
        for (i = 0; i < numBeat; i++) {
            randNoteArrM1[i] = getRandNote();
            randOctArrM1[i] = '/'.concat(getRandOct(3, 4));
            randNoteArrFormattedM1[i] = randNoteArrM1[i].concat(randOctArrM1[i]);
        }

        oneMeasure();
        break;
 }

 // Function to initialise renderer for one measure
 function initRendererOneMeasure() {
    // Create an SVG renderer and attach it to the DIV element named "staveOutput".
    const div = document.getElementById("staveOutput");
    const renderer = new Renderer(div, Renderer.Backends.SVG);

    // Configure the rendering context of width 500 and height 500.
    renderer.resize(rendererWidth, rendererHeight);
    const context = renderer.getContext();
    
    // Scale viewbox of the stave by multipler x and y
    context.scale(1.15, 1.15);

    // Open a group to hold all the SVG elements in the measure:
    const group = context.openGroup();

    // Create a stave of width 400 at position 10, 40 on the canvas.
    const stave = new Stave(10, 40, 400);

    // Add a clef and time signature.
    stave.addClef("treble").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();

    return {
        context: context,
        stave: stave
    };
}

// Function to intialise renderer for two measures
function initRendererTwoMeasures() {
    // Create an SVG renderer and attach it to the DIV element named "output".
    const div = document.getElementById("staveOutput");
    const renderer = new Renderer(div, Renderer.Backends.SVG);
    
    // Configure the rendering context of width 500 and height 200.
    renderer.resize(rendererWidth, rendererHeight);
    const context = renderer.getContext();

    // Scale viewbox of the stave by multipler x and y
    //context.scale(1.2, 1.2);

    // Open a group to hold all the SVG elements in the measure:
    const group = context.openGroup();

    // Measure 1
    const staveMeasure1 = new Stave(10, 50, 225);
    staveMeasure1.addClef("treble").addTimeSignature("4/4");
    staveMeasure1.setContext(context).draw();

    return {
        context: context,
        staveMeasure1: staveMeasure1
    };
}

// Function to render one measure
function oneMeasure () {
    var rendererDetails = initRendererOneMeasure();

    // Create the quarter random notes
    const notes = [
        new StaveNote({ keys: [randNoteArrFormattedM1[0]], duration: "q" }),
        new StaveNote({ keys: [randNoteArrFormattedM1[1]], duration: "q" }),
        new StaveNote({ keys: [randNoteArrFormattedM1[2]], duration: "q" }),
        new StaveNote({ keys: [randNoteArrFormattedM1[3]], duration: "q" })
    ];

    // Create a voice in 4/4 and add above notes
    const voice = new Voice({ num_beats: numBeat, beat_value: beatValue });
    voice.addTickables(notes);

    // Format and justify the notes to 400 pixels.
    new Formatter().joinVoices([voice]).format([voice], 350);

    // Render voice
    voice.draw(rendererDetails.context, rendererDetails.stave);
}

// Function to render two measures
function twoMeasures() {
    var rendererDetails = initRendererTwoMeasures();
    // Measure 1
    const notesMeasure1 = [
        new StaveNote({ keys: [randNoteArrFormattedM1[0]], duration: "q" }),
        new StaveNote({ keys: [randNoteArrFormattedM1[1]], duration: "q" }),
        new StaveNote({ keys: [randNoteArrFormattedM1[2]], duration: "q" }),
        new StaveNote({ keys: [randNoteArrFormattedM1[3]], duration: "q" })
    ];

    // Helper function to justify and draw a 4/4 voice
    Formatter.FormatAndDraw(rendererDetails.context, rendererDetails.staveMeasure1, notesMeasure1);

    // Measure 2 - second measure is placed adjacent to first measure
    const staveMeasure2 = new Stave(rendererDetails.staveMeasure1.width + rendererDetails.staveMeasure1.x, 50, 225);

    const notesMeasure2 = [
        new StaveNote({ keys: [randNoteArrFormattedM2[0]], duration: "q" }),
        new StaveNote({ keys: [randNoteArrFormattedM2[1]], duration: "q" }),
        new StaveNote({ keys: [randNoteArrFormattedM2[2]], duration: "q" }),
        new StaveNote({ keys: [randNoteArrFormattedM2[3]], duration: "q" })
    ];

    // Render stave and notes of measure 2
    staveMeasure2.setContext(rendererDetails.context).draw();
    Formatter.FormatAndDraw(rendererDetails.context, staveMeasure2, notesMeasure2);
}

// Function to clear stave
function clearStave() {
    // Then close the group:
    context.closeGroup();

    // And when you want to delete it, do this:
    context.svg.removeChild(group);
}

// Function to generate random notes
function getRandNote() {
var randNum = Math.floor(Math.random() * 7) + 1;
var randNote = (randNum + 9).toString(36).toLocaleUpperCase();

return randNote;
}

// Function to generate random octaves
function getRandOct(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to validate and process form
function validateForm() {
    if (settings.difficulty !== 'challenging') {
    // Get the values from the text boxes
    var note1Value = document.getElementById("note1").value.toLocaleUpperCase();
    var note2Value = document.getElementById("note2").value.toLocaleUpperCase();
    var note3Value = document.getElementById("note3").value.toLocaleUpperCase();
    var note4Value = document.getElementById("note4").value.toLocaleUpperCase();
    
    // Check if both text boxes are filled out
    if (note1Value.trim() === "" || note2Value.trim() === "" ||
    note3Value.trim() === "" || note4Value.trim() === "") {
        // Display an alert
        alert("All text boxes must be filled out!");
        
        // Return false to prevent form submission
        return false;
    }
    
    // Evaluate results
    formDataM1(note1Value, note2Value, note3Value, note4Value);
    } else {
        // Get the values from the text boxes
        var note1Value = document.getElementById("note1").value.toLocaleUpperCase();
        var note2Value = document.getElementById("note2").value.toLocaleUpperCase();
        var note3Value = document.getElementById("note3").value.toLocaleUpperCase();
        var note4Value = document.getElementById("note4").value.toLocaleUpperCase();
        var note5Value = document.getElementById("note5").value.toLocaleUpperCase();
        var note6Value = document.getElementById("note6").value.toLocaleUpperCase();
        var note7Value = document.getElementById("note7").value.toLocaleUpperCase();
        var note8Value = document.getElementById("note8").value.toLocaleUpperCase();
        
        // Check if both text boxes are filled out
        if (note1Value.trim() === "" || note2Value.trim() === "" ||
        note3Value.trim() === "" || note4Value.trim() === "" ||
        note5Value.trim() === "" || note6Value.trim() === "" ||
        note7Value.trim() === "" || note8Value.trim() === "") {
            // Display an alert
            alert("All text boxes must be filled out!");
            
            // Return false to prevent form submission
            return false;
        }
    
    // Evaluate results
    formDataM2(note1Value, note2Value, note3Value, note4Value, note5Value, note6Value, note7Value, note8Value);
    }
    
    // If validation passes, the form will be submitted
    return true;
}

// Function to display user inputs for one measure
function formDataM1(firstNote, secondNote, thirdNote, fourthNote) {
    // Default delay of 5 seconds
    var delay = 5000;

    // Check if form is complete
    if (firstNote.trim() !== "" && secondNote.trim() !== "" &&
    thirdNote.trim() !== "" && fourthNote.trim() !== "") {

        // Create a container with a div element for displaying result
        var containerHTML = '<div class="container centered-container">';
        containerHTML += '<h3 style="font-weight: lighter;">LearnMusicalNotes</h3>';
        containerHTML += '<h1 style="font-weight: normal; color: blueviolet;">Gamifying the learning of musical notes</h1>';
        // Close the div element
        containerHTML += '</div>';
        // Write the container HTML to the document
        document.write(containerHTML);

        // Calculate number of correct notes
        var numCorrect = 0;
        if (firstNote === randNoteArrM1[0])
            numCorrect++;
        if (secondNote === randNoteArrM1[1])
            numCorrect++;
        if (thirdNote === randNoteArrM1[2])
            numCorrect++;
        if (fourthNote === randNoteArrM1[3])
            numCorrect++;

        // Calculate score based on accuracy and speed
        var swingFactor;
        if (settings.difficulty === "normal")
            swingFactor = 1.5;
        else
            swingFactor = 1.0;

        var myScore = numCorrect !== numBeat ? (numCorrect/numBeat)*100 : ((numCorrect/numBeat) + (1-(mySpeed-timeRemaining)/30)*swingFactor)*100;
        //console.log("Time Remaining:" + timeRemaining);
        //console.log(1-(mySpeed-timeRemaining)/(30));
        
        // Display score with sound effects 
        startCounter(myScore);

        var containerHTML = '<div class="container centered-container">';
        containerHTML += "The first note is " + randNoteArrM1[0] + ". Your answer is " + firstNote + ".<br>";
        containerHTML += "The second note is " + randNoteArrM1[1] + ". Your answer is " + secondNote + ".<br>";
        containerHTML += "The third note is " + randNoteArrM1[2] + ". Your answer is " + thirdNote + ".<br>";
        containerHTML += "The fourth note is " + randNoteArrM1[3] + ". Your answer is " + fourthNote + ".<br><br>";

        if (numCorrect !== 0) {
            if (numCorrect === numBeat) {
                if (settings.sound === 'on') {
                    playAudioM1(randNoteArrFormattedM1[0], randNoteArrFormattedM1[1], 
                        randNoteArrFormattedM1[2], randNoteArrFormattedM1[3]);
                    
                    // Delay for 15 seonds when playing audio for one measure
                    delay = countDelay + 15000;
                }
                
                // Start counting to the score
                containerHTML += '<h2 style="font-weight: lighter;">Yippee... You got all the notes correct!!!"</h2>';
                containerHTML += '<img src="./assets/olaf_exclaimed.gif" alt="Animated GIF" width="300" class="img-fluid"><br><br>'; 
            }
            else {
                if (numCorrect !== 1)
                    containerHTML += '<h2 style="font-weight: lighter;">' + "You got " + numCorrect + " notes correct. You can do it!" + '</h2>'
                else
                    containerHTML += '<h2 style="font-weight: lighter;">' + "You got " + numCorrect + " note correct. You can do it!" + '</h2>';
                containerHTML += '<img src="./assets/olaf_puzzled.gif" alt="Animated GIF" width="300" class="img-fluid"><br><br>'
            }
        } else {
            containerHTML += '<h2 style="font-weight: lighter;">You didn\'t get any notes correct... Don\'t give up!"</h2>';
            containerHTML += '<img src="./assets/olaf_confused.gif" alt="Animated GIF" width="300" class="img-fluid"><br><br>';
        }
    } else {
        var containerHTML = '<div class="container centered-container">';
        containerHTML += '<h3 style="font-weight: lighter;">LearnMusicalNotes</h3>';
        containerHTML += '<h1 style="font-weight: normal; color: blueviolet;">Gamifying the learning of musical notes</h1>';
        containerHTML += '<h2 style="font-weight: lighter;">A little faster... Try again!</h2>';
        containerHTML += '<img src="./assets/olaf_sad.gif" alt="Animated GIF" width="300" class="img-fluid"><br><br>';
    }   

    // Close the div element
    containerHTML += '</div>';

    // Write the container HTML to the document
    document.write(containerHTML);
    
    // Set a delay before reloading the page
    setTimeout(function () {
        // Reload page
        location.reload();
        // Set Focus on first text box
        setFocusOnTextBox();
    }, delay);
}

// Function to display user inputs for two measures
function formDataM2(firstNote, secondNote, thirdNote, fourthNote, fifthNote, sixthNote, seventhNote, eighthNote) {              
    // Default delay of 10 seconds
    var delay = 10000;

    // Check if form is complete
    if (firstNote.trim() !== "" && secondNote.trim() !== "" &&
    thirdNote.trim() !== "" && fourthNote.trim() !== "" &&
    fifthNote.trim() !== "" && sixthNote.trim() !== "" &&
    seventhNote.trim() !== "" && eighthNote.trim() !== "") {

        // Create a container with a div element for displaying result
        var containerHTML = '<div class="container centered-container">';
        containerHTML += '<h3 style="font-weight: lighter;">LearnMusicalNotes</h3>';
        containerHTML += '<h1 style="font-weight: normal; color: blueviolet;">Gamifying the learning of musical notes</h1>';
        // Close the div element
        containerHTML += '</div>';
        // Write the container HTML to the document
        document.write(containerHTML);

        // Calculate number of correct notes
        var numCorrect = 0;
        if (firstNote === randNoteArrM1[0])
            numCorrect++;
        if (secondNote === randNoteArrM1[1])
            numCorrect++;
        if (thirdNote === randNoteArrM1[2])
            numCorrect++;
        if (fourthNote === randNoteArrM1[3])
            numCorrect++;
        if (fifthNote === randNoteArrM2[0])
            numCorrect++;
        if (sixthNote === randNoteArrM2[1])
            numCorrect++;
        if (seventhNote === randNoteArrM2[2])
            numCorrect++;
        if (eighthNote === randNoteArrM2[3])
            numCorrect++;

        // Calculate score based on accuracy and speed
        var swingFactor = 2.0;

        var myScore = numCorrect !== numBeat*2 ? (numCorrect/(numBeat*2))*100 : ((numCorrect/(numBeat*2)) + (1-(mySpeed-timeRemaining)/40)*swingFactor)*100;
        //console.log("Time Remaining:" + timeRemaining);
        //console.log(1-(mySpeed-timeRemaining)/(40));

        // Display score with sound effects 
        startCounter(myScore);

        var containerHTML = '<div class="container centered-container">';
        containerHTML += "The first note is " + randNoteArrM1[0] + ". Your answer is " + firstNote + ".<br>";
        containerHTML += "The second note is " + randNoteArrM1[1] + ". Your answer is " + secondNote + ".<br>";
        containerHTML += "The third note is " + randNoteArrM1[2] + ". Your answer is " + thirdNote + ".<br>";
        containerHTML += "The fourth note is " + randNoteArrM1[3] + ". Your answer is " + fourthNote + ".<br><br>";
        containerHTML += "The fifth note is " + randNoteArrM2[0] + ". Your answer is " + fifthNote + ".<br>";
        containerHTML += "The sixth note is " + randNoteArrM2[1] + ". Your answer is " + sixthNote + ".<br>";
        containerHTML += "The seventh note is " + randNoteArrM2[2] + ". Your answer is " + seventhNote + ".<br>";
        containerHTML += "The eighth note is " + randNoteArrM2[3] + ". Your answer is " + eighthNote + ".<br>";

        if (numCorrect !== 0) {
            if (numCorrect === numBeat * 2) {
                if (settings.sound === 'on') {
                    playAudioM2(randNoteArrFormattedM1[0], randNoteArrFormattedM1[1], 
                        randNoteArrFormattedM1[2], randNoteArrFormattedM1[3],
                        randNoteArrFormattedM2[0], randNoteArrFormattedM2[1],
                        randNoteArrFormattedM2[2], randNoteArrFormattedM2[3]);
                    
                    // Delay for 30 seonds when playing audio for two measures
                    delay = countDelay + 30000;
                }

                containerHTML += '<h2 style="font-weight: lighter;">Yippee... You got all the notes correct!!!"</h2>';
                containerHTML += '<img src="./assets/olaf_exclaimed.gif" alt="Animated GIF" width="300" class="img-fluid"><br><br>';  
            }
            else {
                if (numCorrect !== 1)
                    containerHTML += '<h2 style="font-weight: lighter;">' + "You got " + numCorrect + " notes correct. You can do it!" + '</h2>'
                else
                    containerHTML += '<h2 style="font-weight: lighter;">' + "You got " + numCorrect + " note correct. You can do it!" + '</h2>';
                containerHTML += '<img src="./assets/olaf_puzzled.gif" alt="Animated GIF" width="300" class="img-fluid"><br><br>'
            }
        } else {
            containerHTML += '<h2 style="font-weight: lighter;">You didn\'t get any notes correct... Don\'t give up!"</h2>';
            containerHTML += '<img src="./assets/olaf_confused.gif" alt="Animated GIF" width="300" class="img-fluid"><br><br>';
        }
    } 
    else {
        var containerHTML = '<div class="container centered-container">';
        containerHTML += '<h3 style="font-weight: lighter;">LearnMusicalNotes</h3>';
        containerHTML += '<h1 style="font-weight: normal; color: blueviolet;">Gamifying the learning of musical notes</h1>';
        containerHTML += '<h2 style="font-weight: lighter;">A little faster... Try again!</h2>';
        containerHTML += '<img src="./assets/olaf_sad.gif" alt="Animated GIF" width="300" class="img-fluid"><br><br>';

        // Delay for 5 seconds when there is no input
        delay = 5000;
    }   

    // Close the div element
    containerHTML += '</div>';

    // Write the container HTML to the document
    document.write(containerHTML);
    
    // Set a delay before reloading the page
    setTimeout(function () {
        // Reload page
        location.reload();
        // Set Focus on first text box
        setFocusOnTextBox();
    }, delay);      
}

// Function to playback audio files for one measure
function playAudioM1(note1, note2, note3, note4) {
    
    var audioFiles = [];
    audioFiles [0] = "./assets/violin-" + note1.replace("/", "").toLowerCase() + ".wav";
    audioFiles [1] = "./assets/violin-" + note2.replace("/", "").toLowerCase() + ".wav";
    audioFiles [2] = "./assets/violin-" + note3.replace("/", "").toLowerCase() + ".wav";
    audioFiles [3] = "./assets/violin-" + note4.replace("/", "").toLowerCase() + ".wav"; 

    // Index to keep track of the current audio file
    var currentAudioIndex = 0;
    
   // Function to create and play the next audio file
    function playNextAudio() {
        // Check if there are more audio files to play
        if (currentAudioIndex < audioFiles.length) {
            // Create an Audio object
            var audio = new Audio(audioFiles[currentAudioIndex]);

            // Event listener for when the audio has ended
            audio.addEventListener('ended', function() {
                // Increment the index to move to the next audio file
                currentAudioIndex++;

                // Log to console for debugging
                //console.log('Playing next audio file. Index:', currentAudioIndex);

                // Play the next audio file
                playNextAudio();
            });

            /*
            // Event listener for audio loading errors
            audio.addEventListener('error', function(event) {
                console.error('Error loading audio file:', audioFiles[currentAudioIndex], event);
            });
            */

            audio.addEventListener('error', function (e) {
                console.error('Error loading audio file:', audio.src, e);
                // Move to the next audio file even if there's an error
                currentAudioIndex++;
                playNextAudio();
            });

            // Play the audio
            audio.play();
        } else {
            // Log to console when all audio files have been played
            //console.log('All audio files have been played.');
        }
    }

    // Start playing the first audio file after a 5 seconds delay
    setTimeout(function() {
        playNextAudio();
    }, countDelay);
}

// Function to playback audio files for two measures
function playAudioM2(note1, note2, note3, note4, note5, note6, note7, note8) {
    
    var audioFiles = [];
    audioFiles [0] = "./assets/violin-" + note1.replace("/", "").toLowerCase() + ".wav";
    audioFiles [1] = "./assets/violin-" + note2.replace("/", "").toLowerCase() + ".wav";
    audioFiles [2] = "./assets/violin-" + note3.replace("/", "").toLowerCase() + ".wav";
    audioFiles [3] = "./assets/violin-" + note4.replace("/", "").toLowerCase() + ".wav"; 
    audioFiles [4] = "./assets/violin-" + note5.replace("/", "").toLowerCase() + ".wav"; 
    audioFiles [5] = "./assets/violin-" + note6.replace("/", "").toLowerCase() + ".wav"; 
    audioFiles [6] = "./assets/violin-" + note7.replace("/", "").toLowerCase() + ".wav"; 
    audioFiles [7] = "./assets/violin-" + note8.replace("/", "").toLowerCase() + ".wav"; 

    // Index to keep track of the current audio file
    var currentAudioIndex = 0;
    
   // Function to create and play the next audio file
    function playNextAudio() {
        // Check if there are more audio files to play
        if (currentAudioIndex < audioFiles.length) {
            // Create an Audio object
            var audio = new Audio(audioFiles[currentAudioIndex]);

            // Event listener for when the audio has ended
            audio.addEventListener('ended', function() {
                // Increment the index to move to the next audio file
                currentAudioIndex++;

                // Log to console for debugging
                //console.log('Playing next audio file. Index:', currentAudioIndex);

                // Play the next audio file
                playNextAudio();
            });

            // Event listener for audio loading errors
            audio.addEventListener('error', function(event) {
                console.error('Error loading audio file:', audioFiles[currentAudioIndex], event);
            });

            // Play the audio
            audio.play();
        } else {
            // Log to console when all audio files have been played
            //console.log('All audio files have been played.');
        }
    }

    // Start playing the first audio file after a 5 seconds delay
    setTimeout(function() {
        playNextAudio();
    }, countDelay);
}

// Function for countdown timer
function Timer(duration) {
    // Set the countdown time in seconds
    var countdownTimeInSeconds = duration;

    // Get the countdown element
    var countdownElement = document.getElementById('countdown');

    // Update the countdown every second
    var countdownInterval = setInterval(function () {
        // Calculate minutes and seconds
        var minutes = Math.floor(countdownTimeInSeconds / 60);
        var seconds = countdownTimeInSeconds % 60;

        // Display the countdown
        countdownElement.innerHTML = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

        // Decrease the countdown time
        countdownTimeInSeconds--;
        timeRemaining = countdownTimeInSeconds;

        // Change color of timer object
        if (countdownTimeInSeconds < 5) {
            var myDiv = document.getElementById("countdown");
            if (myDiv) {
                myDiv.style.backgroundColor = "crimson";
                myDiv.style.color = "white";
            } else {
                console.error("Element with ID 'countdown' not found!");
            }
        }
        
        // Check if the countdown has reached zero    
        if (countdownTimeInSeconds <= 0) {
            // Display a message or perform any action when the countdown reaches zero
            countdownElement.innerHTML = "Time's up!";
            // Clear the interval to stop the countdown
            clearInterval(countdownInterval);
            
            // Submit inputs anyway
            if (settings.difficulty !== 'challenging') {
                formDataM1(document.getElementById("note1").value.toLocaleUpperCase(), document.getElementById("note2").value.toLocaleUpperCase(), 
                document.getElementById("note3").value.toLocaleUpperCase(), document.getElementById("note4").value.toLocaleUpperCase());
            } else {
                formDataM2(document.getElementById("note1").value.toLocaleUpperCase(), document.getElementById("note2").value.toLocaleUpperCase(), 
                document.getElementById("note3").value.toLocaleUpperCase(), document.getElementById("note4").value.toLocaleUpperCase(),
                document.getElementById("note5").value.toLocaleUpperCase(), document.getElementById("note6").value.toLocaleUpperCase(),
                document.getElementById("note7").value.toLocaleUpperCase(), document.getElementById("note8").value.toLocaleUpperCase());
            }
            
        }
    }, 1000); // Update the countdown every 1 second
}   

// Function for toggle menu
function toggleMenu() {
    var menu = document.querySelector('.menu');
    menu.classList.toggle('show');
}

// Function to retrieve saved settings from local storage
function getSelectedSettings() {
    var selectedDifficulty = localStorage.getItem('difficulty');
    var selectedSpeed = localStorage.getItem('speed');
    var selectedSound = localStorage.getItem('sound');

    return {
        difficulty: selectedDifficulty, 
        speed: selectedSpeed, 
        sound: selectedSound
    };
}

// Function to dynamically include additional text box
function addTextBox(num) {
    // Create a new div element with Bootstrap form-group class
    var textBoxContainer = document.createElement("div");
    textBoxContainer.classList.add("form-group", "col-md-3");

    // Create a new label element with Bootstrap control-label class
    var label = document.createElement("label");
    label.classList.add("control-label");

    // Set the label text
    switch (num) {
        case 5:
            label.textContent = "Fifth Note: ";
            break;
        case 6:
            label.textContent = "Sixth Note: ";
            break;
        case 7:
            label.textContent = "Seventh Note: ";
            break;
        case 8:
            label.textContent = "Eight Note: ";
            break;
    }

    // Create a new input element with Bootstrap form-control class
    var textBox = document.createElement("input");
    textBox.classList.add("form-control");

    // Generate a unique ID using the counter
    var uniqueId = "note" + num;

    // Set the id attribute for the label and the text box
    label.setAttribute("for", uniqueId);
    textBox.id = uniqueId;

    // Set attributes of the text box
    textBox.type = "text";
    textBox.size = "1";
    textBox.maxLength = "1";
    textBox.pattern = "[A-Ga-g]+";
    textBox.title = "Please enter only valid notes (A to G)";
    textBox.autocomplete = "off";
    textBox.required = "required";

    // Append the label and the text box to the container
    textBoxContainer.appendChild(label);
    textBoxContainer.appendChild(textBox);

    // Append the container to the main form
    var form = document.getElementById("inputForm");
    if (form) {
        // Append to the existing form-row
        form.querySelector(".form-row").appendChild(textBoxContainer);
    } else {
        console.error("Form not found!");
    }
}

// Function to set focus on text box
function setFocusOnTextBox() {
    // Get the text box element by ID
    var note1TextBox = document.getElementById("note1");

    // Set focus on the text box
    if (note1TextBox) {
        note1TextBox.focus();
    } else {
        console.error("Text box not found!");
    }
}

// Function to play sound effect
function playSoundEffect() {
    var soundEffect = document.getElementById('soundEffect');
    soundEffect.play();
}

// Function to start the counter
function startCounter(score) {
    // Create a container with div for counting score with sound effects
    var countContainerHTML = '<div class="h1-container">';
    countContainerHTML += '<h1 style="font-weight: bold">Your Score:</h1>';
    countContainerHTML += '<h1 id="counter" style="font-weight: bold";>0</h1>';
    countContainerHTML += '<audio id="soundEffect" src="./assets/score-tally.wav"></audio>';
    // Close the div element
    countContainerHTML += '</div>';
    // Write the container HTML to the document
    document.write(countContainerHTML);

    var counterElement = document.getElementById('counter');
    var count = 0;

    function updateCounter() {
        counterElement.innerText = count;
        count++;

        // Play sound effect on each update conditionally
        if (settings.sound === 'on' && score !== 0) 
            playSoundEffect();

        if (count <= score) {
            // Continue counting
            if (score <= 50)
                setTimeout(updateCounter, 40);
            else
                setTimeout(updateCounter, 10);
        }
    }

    // Start the counter after a delay
    setTimeout(updateCounter, 500);
}