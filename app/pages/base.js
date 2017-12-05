;(function () {


    //главаня функция
    function PlayGame(data) {
        this._settings = data;

    }

    PlayGame.prototype.init = function () {
        var self = this;

        //здесь события
        this.getPlayField(self);
        this.createPlayField(self);
        this.createRandomPictures(self)
    };

    PlayGame.prototype.getPlayField = function (self) {
        let xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                let data = JSON.parse(this.responseText);

                console.log(data)

                return self._settings.fields = data;
            }
        };

        xmlhttp.open("GET", self._settings.urlFields, true);
        xmlhttp.send();


    };


    PlayGame.prototype.createPlayField = function (self) {
        setTimeout(function () {
            let inBox = document.querySelector(self._settings.playAreaElem);

            for (let i = 1, max = self._settings.fields.height; i <= max; i++){

                inBox.insertAdjacentHTML("afterbegin", `<tr></tr>`);//height

                for(let i = 1, max = self._settings.fields.width; i<= max; i++){

                    let row = document.querySelector(self._settings.rowAreaElem);

                    row.insertAdjacentHTML("afterbegin", `<th><img src=""></th>`);

                }
            }
        },500)
    };


    PlayGame.prototype.createRandomPictures = function (self) {
        setTimeout(function () {

            let cells = (self._settings.fields.height * self._settings.fields.width),
                arrPictures= [],
                size = 0,
                iterations = Math.ceil((cells - size)/10);

                console.log(size)

            if(iterations & 1) iterations++;

            for (key in self._settings.urlImages){
                size++;

                for(let i = 0,max = iterations; i < max; i++){
                    arrPictures.push(self._settings.urlImages[key])
                }
            }

            //cut arr
            arrPictures.length = cells;
            function rand() {
                return Math.ceil(Math.random() * (arrPictures.length - 0) + 0);
            }

            arrPictures.sort(rand);

            let images = document.querySelectorAll("img");

            for (var i =0, max = images.length; i < max; i++){
                images[i].setAttribute("src", arrPictures[i]);
            }

        },500)
    };


    //параметры игры
    let param = new PlayGame({
        urlFields: "https://kde.link/test/get_field_size.php",
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

        playAreaElem: "table tbody",
        rowAreaElem: "tr",
        columnAreaElem: "th",
        identicalPictures: 2,
        // fields:{
        //     width: 8,
        //     height:8
        // }

    });


    param.init();



})();




