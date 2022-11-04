$(document).ready(function () {
    "use strict"


    // waiting layer to make user know that we get the api

    $(".waitingApiLayer").fadeOut(500, function () {
        $(".waitingApiLayer").addClass("d-none")
    });

    /*Globle variables*/
    // arryOfUsers to carry all users of the website 

    let arryOfUsers = [];
    if (null !== localStorage.getItem("allUsers")) {
        arryOfUsers = JSON.parse(localStorage.getItem("allUsers"))
    }
    let user = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        city: "",
        state: "",
        favouritesGames: [

        ],



    };
    let loginStatu = false;
    const emailRegax = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
    let nextGroupGames = "https://api.rawg.io/api/games?key=a6c6a990c18c41298ca57a5cf71ef508&dates=2019-09-01,2019-09-30&platforms=18,1,7";
    let prevGroupGames = "";
    let presetGroupGames = "";
    let arryOfGames = [];

    // variables for previous button and next putton 
    let nextButton = document.querySelector("section.home .container .row.next_prev .btn.btn-warning");
    let prevButton = document.querySelector("section.home .container .row.next_prev .btn.btn-dark");

    // we will call the api now to creat the home 
    callApi(nextGroupGames);
    /*small functions*/

    // call the api of games
    async function callApi(groupGames) {
        await fetch(groupGames)
            .then((response) => response.json())
            .then((data) => {
                presetGroupGames = groupGames;
                nextGroupGames = data.next;
                prevGroupGames = data.previous;
                arryOfGames = data.results;



                $(".waitingApiLayer").removeClass("d-none");
                
                if (prevGroupGames == null) {

                    if (!prevButton.classList.contains("disabled")) prevButton.classList.add("disabled");

                } else {

                    if (prevButton.classList.contains("disabled")) prevButton.classList.remove("disabled");
                }
                if (nextGroupGames == null) {
                    if (!nextButton.classList.contains("disabled")) nextButton.classList.add("disabled");


                }
                else {
                    if (nextButton.classList.contains("disabled")) nextButton.classList.remove("disabled");


                }
                creatCards();
                creatHome();
                // waiting layer to make user know that we get the api
                
                $(".waitingApiLayer").css("display","block");

                $(".waitingApiLayer").fadeOut(1000, function () {
                    $(".waitingApiLayer").addClass("d-none")
                });
                checkUserHasLoged();
                creatfavouritesLayer();



            });
    }

    //checkUser to check user is exsit or not
    function checkUser(loginEmail) {
        for (const user of arryOfUsers) {
            if (user.email === loginEmail) {
                return user;
            }
        }
        return false;
    }

    //login function to take user email and pass 
    function LogIn() {
        let emailLoginInput = document.querySelector(".logIn .form-control#loginInputEmail1").value.toLocaleLowerCase();
        let passwordLoginInput = document.querySelector(".logIn .form-control#loginInputPassword1").value;

        if (emailRegax.test(emailLoginInput) && checkUser(emailLoginInput)) {
            user = checkUser(emailLoginInput);
            if (user.password == passwordLoginInput) {
                loginStatu = true;
                alert("Welcome " + user.firstName);
                emptyInputs();
                goHome();
                chaneHomePage();
                checkUserHasLoged();
                creatfavouritesLayer();
                return user.firstName;
            }
            else alert(" there is a mistake with your password  email");

        }
        else {
            alert("please enter a valid email");
        }


    }

    // function check empty to check whether inputs are empty or not
    function checkRegistrationEmpty() {
        let inputs = document.querySelectorAll(".registration input");
        for (const input of inputs) {
            if (input === "") {
                return false
            }


        }
        return true

    }

    // function check empty to check whether inputs are empty or not
    function checklogInEmpty() {
        let inputs = document.querySelectorAll(".logIn input");
        for (const input of inputs) {
            if (input.value === "") {
                return false
            }


        }
        return true

    }
    //emptyinputs to make all inputs empty
    function emptyInputs() {
        let inputs = document.querySelectorAll(" input");
        for (const input of inputs) {
            input.value = "";

        }


    }

    //Registre function help you to registre 
    function registre() {
        let firstNameRegistrationInput = document.querySelector(".registration .form-control#firstName").value;
        let lastNameRegistrationInput = document.querySelector(".registration .form-control#lastName").value;
        let emailRegistrationInput = document.querySelector(".registration .form-control#inputEmail4").value;
        let passwordRegistrationInput = document.querySelector(".registration .form-control#inputPassword4").value;
        let cityRegistrationInput = document.querySelector(".registration .form-control#inputCity").value;
        let stateRegistrationInput = document.querySelector(".registration .form-control#inputState").value;


        if (checkRegistrationEmpty() && !checkUser() && emailRegax.test(emailRegistrationInput)) {
            user.firstName = firstNameRegistrationInput;
            user.lastName = lastNameRegistrationInput;
            user.email = emailRegistrationInput;
            user.password = passwordRegistrationInput;
            user.city = cityRegistrationInput;
            user.state = stateRegistrationInput;
            loginStatu = true;
            checkUserHasLoged();
            arryOfUsers.push(user);
            alert("Welcome " + firstNameRegistrationInput);
            emptyInputs();
            chaneHomePage();
            localStorage.setItem("allUsers", JSON.stringify(arryOfUsers));
            goHome();
            creatfavouritesLayer();

        }
        else {
            alert("please enter a valid email");
        }




    }
    //function goLogIn to open login layer
    function goLogIn() {
        if (document.querySelector(".logIn").classList.contains("d-none")) {
            document.querySelector(".logIn").classList.remove('d-none');

        }
        if (!document.querySelector(".registration").classList.contains("d-none")) {
            document.querySelector(".registration").classList.add('d-none');

        }


    }
    //function goRegistration to open registration layer
    function goRegistration() {
        if (document.querySelector(".registration").classList.contains("d-none")) {
            document.querySelector(".registration").classList.remove('d-none');

        }
        if (!document.querySelector(".logIn").classList.contains("d-none")) {
            document.querySelector(".logIn").classList.add('d-none');

        }


    }
    //function goHome to open home layer
    function goHome() {
        if (!document.querySelector(".registration").classList.contains("d-none")) {
            document.querySelector(".registration").classList.add('d-none');

        }
        if (!document.querySelector(".logIn").classList.contains("d-none")) {
            document.querySelector(".logIn").classList.add('d-none');

        }


    }
    // function to change the home page after registration
    function chaneHomePage() {
        let lIs = document.querySelectorAll("nav li");
        for (const lI of lIs) {
            if (lI.classList.contains("d-none")) lI.classList.remove("d-none");
            else lI.classList.add("d-none");
        }
        if (loginStatu) document.querySelector("nav .container a.navbar-brand.text-white").innerHTML = "We all love Games , <span class='text-warning'>" + user.firstName + " " + user.lastName + "</span>";
        else document.querySelector("nav .container a.navbar-brand.text-white").innerHTML = "We all love Games ";


    }
    // function to check if user has loged in to able add favourites button
    function checkUserHasLoged() {
        if (loginStatu) {
            for (const favoriteButton of document.querySelectorAll(".card .btn.btn-warning")) {
                favoriteButton.classList.remove("disabled");

            }
        }
        else {
            for (const favoriteButton of document.querySelectorAll(".card .btn.btn-warning")) {
                if (!favoriteButton.classList.contains("disabled")) {
                    favoriteButton.classList.add("disabled");



                }
            }


        }



    }
    /* main functions */

    // this function will take a group of games from api an display it for user 
    let arryofcards = []
    function creatCards() {
        arryofcards = [];
        for (let i = 0; i < arryOfGames.length; i++) {
            arryofcards.push({
                nameOfGame: arryOfGames[i].name,
                gameHtml: `<div class="col-lg-3 col-md-6">
    <div class=" shadow  mb-2 card${checkFavouritesGames(arryOfGames[i]) ? " bg-warning" : ""}" >
        <img  style="height:171px;" src="${arryOfGames[i].background_image}" class="w-100  card-img-top" alt="Borderlands 3">
        <div class="card-body">
          <h5 class="card-title">${arryOfGames[i].name}</h5>
          <button type="button" onclick="makeItfavorite(${i})" class="btn ${checkFavouritesGames(arryOfGames[i]) ? "disabled" : ""} disabled btn-warning">Add to favorite</button>
        </div>
      </div>`})

        }


    }
    function creatHome() {
        document.querySelector("section.home .container .row ").innerHTML = "";
        for (const card of arryofcards) {
            document.querySelector("section.home .container .row ").innerHTML += card.gameHtml;

        }

    }

    function creatfavouritesLayer() {
        let content = document.querySelector(".layer.favourite .container .row ");

        content.innerHTML = "";

        for (const game of user.favouritesGames) {
            content.innerHTML += game.gameHtml;
        }



    }
    //check if game is in favouritegames or no
    function checkFavouritesGames(game) {

        for (const fGame of user.favouritesGames) {
            if (game.nameOfGame == fGame.nameOfGame) {

                return true;
            }




        }

        return false;


    }
    //add favourite to add game to user's favourite games
    function makeItfavorite(i) {
        let allCardButton = document.querySelectorAll(".card .btn.btn-warning");
        let allCards = document.querySelectorAll("section.home .card");



        user.favouritesGames.push(arryofcards[i]);
        localStorage.setItem("allUsers", JSON.stringify(arryOfUsers));
        allCards[i].classList.add("bg-warning");
        allCardButton[i].classList.add("disabled")
        creatfavouritesLayer();

    }


















    /* Events */
    //home buttons to go to login layer and registration layer
    let homeLogInButton = document.querySelector(".buttons button.btn.btn-dark.login ");
    homeLogInButton.addEventListener("click", goLogIn);

    let homeRegistrationButton = document.querySelector(".buttons button.btn.btn-warning.registre ");
    homeRegistrationButton.addEventListener("click", goRegistration);
    //login button to check user have an accout in the website or not
    let loginLayerLoginButton = document.querySelector(".layer.logIn button.btn.btn-dark ");
    loginLayerLoginButton.addEventListener("click", () => {
        let helloUser = document.querySelector("h1");
        if (LogIn()) {
            helloUser.innerHTML = "Hello <span class='text-warning'>" + user.firstName + "</span>";
        }
    });

    // if user don't have an account he has the ability to go to registration layer.
    let loginLayerNotAccountButton = document.querySelector(".layer.logIn button.btn.btn-warning ");
    loginLayerNotAccountButton.addEventListener("click", goRegistration);
    // registration button to registre user
    let registrationLayerButton = document.querySelector(".layer.registration button.btn.btn-dark");
    registrationLayerButton.addEventListener("click", registre);
    // EVENT to close layer if you don't want to change the log

    document.addEventListener("keydown", function (e) {
        if (e.key == "Escape") {
            for (const layer of document.querySelectorAll('.layer')) {
                layer.classList.add("d-none");

            }
        }

    })

    document.querySelector(".layer.registration").addEventListener("click", function (e) {

        if (e.target == document.querySelector(".layer.registration")) {
            document.querySelector('.layer.registration').classList.add("d-none");

        }
    })
    document.querySelector(".layer.logIn").addEventListener("click", function (e) {

        if (e.target == document.querySelector(".layer.logIn")) {
            document.querySelector('.layer.logIn').classList.add("d-none");

        }
    })

    // log out to make user loge out 
    document.querySelector("nav .container ul li button.btn.btn-warning.logout").addEventListener("click", () => {
        loginStatu = false;
        checkUserHasLoged();
        document.querySelector("h1").innerHTML = "";
        creatHome();
        chaneHomePage();
        callApi(presetGroupGames);
    });


    // next to button to make user call the next group og games
    nextButton.addEventListener("click", () => {
        callApi(nextGroupGames);
    })
    prevButton.addEventListener("click", () => {
        callApi(prevGroupGames);
    })
    //EVENT to DISPLAY THE favourite layer
    document.querySelector("nav .container ul li button.btn.btn-dark.Favourites").addEventListener("click", () => {
        document.querySelector(".layer.favourite").classList.remove("d-none");
    });

    document.querySelector(".layer.favourite").addEventListener("click", function (e) {

        if (e.target == document.querySelector(".layer.favourite")) {
            document.querySelector('.layer.favourite').classList.add("d-none");

        }
    })

})