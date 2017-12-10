;(function () {

    function httpGetPlayFields(url) {
        return new Promise(function (resolve, reject) {

            var xhr = new XMLHttpRequest();

            xhr.onload = function () {
                if (this.readyState === 4 && this.status === 200){

                    var data = JSON.parse(this.response);
                    resolve(data)
                } else {
                    var error = new Error(this.statusText);
                    error.code = this.status;
                    reject(error);
                }
            };

            xhr.open("GET", url, true);
            xhr.send();
            xhr.onerror = function() {
                reject(new Error("Server not response"));
            };
        })
    }

    httpGetPlayFields("https://kde.link/test/get_field_size.php")
        .then(
            response => ready(response),
            error => alert(`Rejected: ${error}`)
    );

    function ready(response) {
        param._settings.fields = response;
        param.init();
    }

    function PlayGame(data) {
        this._settings = data;
    }

    PlayGame.prototype.init = function () {

        var self = this;

        this.startGame(self);
        this.createPlayField(self);
        this.createRandomPictures(self);
        this.samePictures(self);
    };

    PlayGame.prototype.startGame = function (self) {
        var playBtn = document.querySelector(self._settings.playBtn);

        function hideEle() {
            document.querySelector(".top-section__overlay").style.display = "none";
            self.score();
        }

        playBtn.addEventListener("click", hideEle);
    };

    PlayGame.prototype.score = function (self) {

        var scoreCounterStart = this._settings.score,
            payingTime = 0,
            newScore = document.querySelector(".top-section__score-count"),
            newPlayingTime = document.querySelector(".top-section__playing-time");

        (function timeout() {
            newScore.innerHTML = scoreCounterStart;
            newPlayingTime.innerHTML = payingTime;

            setTimeout(function () {
                scoreCounterStart = scoreCounterStart - 1;
                payingTime = payingTime + 1;
                timeout();
            }, 1000);
        })();
    };

    PlayGame.prototype.createPlayField = function (self) {
        // setTimeout(function () {

            var inBox = document.querySelector(self._settings.playAreaElem);

            for (let i = 1, max = self._settings.fields.height; i <= max; i++){

                inBox.insertAdjacentHTML("afterbegin", `<tr></tr>`);//height

                for(let i = 1, max = self._settings.fields.width; i<= max; i++){

                    var row = document.querySelector(self._settings.rowAreaElem);

                    row.insertAdjacentHTML("afterbegin", `<th><img src=""></th>`);

                }
            }
        // },500)
    };

    PlayGame.prototype.createRandomPictures = function (self) {

        // setTimeout(function () {

            var cells = (self._settings.fields.height * self._settings.fields.width),
                arrPictures= [],
                iterations = Math.ceil(cells/10);

            if(iterations & 1) iterations++;


            for (key in self._settings.urlImages){

                for(var i = 0,max = iterations; i < max; i++){
                    arrPictures.push(self._settings.urlImages[key])
                }
            }

            //cut arr
            arrPictures.length = cells;

            arrPictures.sort(() => Math.ceil(Math.random() * (arrPictures.length - 1)));

            var images = document.querySelectorAll("img");

            for (var i =0, max = images.length; i < max; i++){
                images[i].setAttribute("src", arrPictures[i]);
            }

        // },500)
    };

    PlayGame.prototype.samePictures = function (self) {
        var areaElem = document.querySelector(self._settings.areaElem),
            firstSelectedEl,
            secondSelectedEl,
            thirdSelectedEle,
            counter = 0,
            audio = new Audio('../sound/sound.mp3');

            areaElem.addEventListener("click", function (event) {
            audio.play();

            var target = event.target;

            if(target.classList.contains("selected"))  return false;

            counterPlus();

            if(counter == 3){
                removeElements();
                target.classList.add("selected");
                resetVar();
                counterPlus("reset");
                return thirdSelectedEle = target.firstChild.getAttribute("src");
            }

            target.classList.add("selected");

            if(counter == 1) firstSelectedEl = target.firstChild.getAttribute("src");
            if(counter == 2) secondSelectedEl = target.firstChild.getAttribute("src");

            if(firstSelectedEl && secondSelectedEl && thirdSelectedEle){
                resetVar("reset all");
                removeElements();
                counterPlus("reset");
                return false
            }

            if(firstSelectedEl == secondSelectedEl){
                removeElements(" ");
                resetVar();
                counterPlus("reset");
                return false
            }

            if(firstSelectedEl == thirdSelectedEle){
                removeElements(" ");
                counterPlus("reset");
                resetVar("reset all");
                return false
            }

            function resetVar(all) {
                firstSelectedEl = "";
                secondSelectedEl = "";
                if ( all ) thirdSelectedEle = "";

            }

            function removeElements(all) {
                var selectedEl= document.querySelectorAll(".selected");

                for(var i = 0, max = selectedEl.length; i < max; i++){
                    if ( all ) {
                        selectedEl[i].remove();
                        self.gameOver()

                    }
                    selectedEl[i].classList.remove("selected")
                }
            }

            function counterPlus(val) {
                if(val){
                    return counter = 0
                }
                return counter++
            }
        });
    };

    PlayGame.prototype.gameOver = function (self) {
        var cells = document.querySelectorAll("th"),
            scoreCounterStart = document.querySelector(".top-section__score-count").innerHTML,
            payingTime = document.querySelector(".top-section__playing-time").innerHTML,
            payBtnAgain = document.querySelector(".play-btn-again");


        if (cells.length == 0){
            document.querySelector(".top-section__overlay-again")
                    .insertAdjacentHTML("afterbegin", `<p>It took you ${payingTime} seconds</p>`);

            document.querySelector(".top-section__overlay-again")
                    .insertAdjacentHTML("afterbegin", `<p>Your score ${scoreCounterStart} points</p>`);

            document.querySelector(".top-section__overlay-again").style.display = "inline-flex";


            payBtnAgain.addEventListener("click", function () {
                location.reload()
            });
        }
    };

    var param = new PlayGame({
        //urlFields: "https://kde.link/test/get_field_size.php",
        playBtn: '.play-btn',
        activeClass: 'selected',
        urlImages: {
            image1:"https://kde.link/test/1.png",
            image2:"https://kde.link/test/2.png",
            image3:"https://kde.link/test/3.png",
            image4:"https://kde.link/test/4.png",
            image5:"https://kde.link/test/5.png",
            image6:"https://kde.link/test/6.png",
            image7:"https://kde.link/test/7.png",
            image8:"https://kde.link/test/8.png",
            image9:"https://kde.link/test/9.png",
            image10:"https://kde.link/test/0.png",
        },
        areaElem: "tbody",
        playAreaElem: "table tbody",
        rowAreaElem: "tr",
        columnAreaElem: "th",
        score: 100,

        // fields:{
        //     height: 2,
        //     width: 2,
        //}

    });
})();




