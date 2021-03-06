/** https://github.com/emoreno911/UI-to-Code/tree/master/material_music **/
/*** In the player view Swipe left or right to change the current song ***/
var listItems = [],
    detailItems = [],
    playlist = [
        { "time": "178", "title": "Snowflake - Living Nightmare", "img": "http://dl.dropbox.com/s/wacl6yr2b32sqds/snowflake.jpg", "src": "http://dl.dropbox.com/s/4ef8ana3rsm7sdu/snowflake.mp3" },
        { "time": "124", "title": "Bensound - Dubstep", "img": "http://dl.dropbox.com/s/7a1psxm2i4m644k/dubstep2.jpg", "src": "http://dl.dropbox.com/s/ebsjr0uq9zfg9x0/dubstep.mp3" },
        { "time": "231", "title": "Luong Bang Quang - Voi Anh Em Van La Co Be", "img": "http://dl.dropbox.com/s/e2b9l3cbjy4wthw/retrosoul.jpg", "src": "https://dl.dropboxusercontent.com/s/hxr4enmk3r6k1mx/Voianhemvanlacobe-LuongBangQuang_36et.mp3" },
        { "time": "175", "title": "Snowflake - Holiday Funky Blues", "img": "http://dl.dropbox.com/s/myu3b9qtf74sz3i/snowflake2.jpg", "src": "https://dl.dropboxusercontent.com/s/ayibnz1h596hq2i/World%20Of%20Hardstyle%20-%20This%20Was%202016%20-%20Online%20Converter%20And%20Downloader%20-%20MP3%20or%20MP4.mp3" },
        { "time": "105", "title": "Bensound - Happy Rock", "img": "http://dl.dropbox.com/s/fz8452movdjnfe8/happyrock.jpg", "src": "http://dl.dropbox.com/s/03abwi15hveg4yj/happyrock.mp3" }
    ];

playlist.forEach(function(el, i) {
    let [artist, title] = el.title.split('-');
    let top = (66 * (i + 1)) + (i * 22);
    let z = i + 1;

    let itemList = `<div class="list-item" data-index="${i}">
        <div class="thumb">
        	<img src="${el.img}" alt="song_title" style="top: ${top}px">
        </div>
        <div class="title">
          <span>${title}</span>
          <small>${artist}</small>
        </div>
        <div class="length"><small>${formatTime(el.time) || "0:00"}</small></div>
      </div>`;

    let itemDetail = `<div class="slide">
      <div class="thumb">
        <div style="background-image:url(${el.img})"></div>
        <div style="background-image:url(${el.img})"></div>
      </div>
      <div class="title">
        <i class="zmdi zmdi-minus-circle-outline"></i>
        <h3><span>${title}</span><small>${artist}</small></h3>
        <i class="zmdi zmdi-favorite-outline"></i>
      </div>
    </div>`;

    listItems.push(itemList);
    detailItems.push(itemDetail);
});

document.querySelector('.list section').innerHTML = listItems.join('');
document.querySelector('.detail .slider').innerHTML = detailItems.join('');

let positionElement = document.querySelector('.wrapper'),
    sliderElement = document.querySelector('.slider');

let $listItemImg = $('.list-item img'),
    $detail = $('.detail');


var _player = new Player('.player', { tracks: playlist });
_player.$container.addEventListener('playerStateChanged', function(evt) {
    //console.log('player changed to ' + evt.detail);
    let $wrapper = $('.wrapper');

    if (evt.detail == 'play')
        $wrapper.removeClass('paused').addClass('playing');
    else if (evt.detail == 'pause')
        $wrapper.removeClass('playing').addClass('paused');
    else
        $wrapper.removeClass('paused').removeClass('playing');

}, false);

$('.player-indicator .playb').on('click', function(evt) {
    _player.play();
});


$('.list-item').on('click', function(evt) {
    // select the current detail item
    let $this = $(this),
        index = this.getAttribute('data-index');

    positionElement.setAttribute('data-pos', index);
    currentSlide = parseInt(index);

    $this.find('img').addClass('open');
    $detail.addClass('open');
    setTimeout(() => {
        $detail.addClass('ready');

        if (_player.currentTrack != currentSlide)
            _player.changeTrack(currentSlide, true);
    }, 300);
    musictopchangetitle(index);
});


$('.detail .close').on('click', function(evt) {
    $listItemImg.removeClass('open');
    $detail.addClass('lock');

    setTimeout(() => {
        $detail.removeClass('ready lock open');
    }, 250);
});

$('.controls .zmdi-fast-rewind').on('click', prev);
$('.controls .zmdi-fast-forward').on('click', next);
$('.player-indicator .zmdi-fast-rewind').on('click', prev);
$('.player-indicator .zmdi-fast-forward').on('click', next);

let slideCount = 5,
    step = 4,
    maxSpan = 100,
    currentSpan = 0,
    currentSlide = 0;
musictopchangetitle(currentSlide);
let hammertime = new Hammer(sliderElement);
hammertime.on("panleft panright panstart panend", function(evt) {

    if (evt.type == 'panleft') {
        currentSpan += step;

        if (currentSpan > maxSpan)
            next();
    }

    if (evt.type == 'panright') {
        currentSpan -= step;

        if (currentSpan < -(maxSpan + 20))
            prev();
    }

    // pull the borders
    if (evt.type == 'panstart' && evt.additionalEvent == 'panleft') {
        let s = currentSlide + 1;
        $('.slide:nth-child(' + s + ') .thumb').addClass('skewLeft');
    }

    if (evt.type == 'panstart' && evt.additionalEvent == 'panright') {
        let s = currentSlide + 1;
        $('.slide:nth-child(' + s + ') .thumb').addClass('skewRight');
    }

    if (evt.type == 'panend') {
        $('.thumb').removeClass('skewLeft skewRight');
        currentSpan = 0;
    }
});


function next() {
    let slide = parseInt(positionElement.getAttribute('data-pos')),
        newSlide = (slide + 1 > (slideCount - 1)) ? slide : slide + 1;
    positionElement.setAttribute('data-pos', newSlide);
    currentSlide = newSlide;
    currentSpan = 0;
    _player.changeTrack(currentSlide, true);
    // sync the selected list item with the current detail item
    $listItemImg
        .removeClass('open')
        .eq(currentSlide)
        .addClass('open');
    $detail.addClass('open');
    setTimeout(() => {
        $detail.addClass('ready');

        if (_player.currentTrack != currentSlide)
            _player.changeTrack(currentSlide, true);
    }, 300);
    musictopchangetitle(currentSlide);
}

function prev() {
    let slide = parseInt(positionElement.getAttribute('data-pos')),
        newSlide = (slide - 1 < 0) ? slide : slide - 1;
    positionElement.setAttribute('data-pos', newSlide);
    currentSlide = newSlide;
    currentSpan = 0;
    _player.changeTrack(currentSlide, true);
    // sync the selected list item with the current detail item
    $listItemImg
        .removeClass('open')
        .eq(currentSlide)
        .addClass('open');
    $detail.addClass('open');
    setTimeout(() => {
        $detail.addClass('ready');

        if (_player.currentTrack != currentSlide)
            _player.changeTrack(currentSlide, true);
    }, 300);
    musictopchangetitle(currentSlide);
}

function musictopchangetitle(pos) {
    let mtitle = playlist[pos].title;
    document.querySelector('.top-panel .player-indicator .title').innerHTML = mtitle;
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
}