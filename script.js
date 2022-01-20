/* contacts */

function myMap() {
    var myCenter = new google.maps.LatLng(55.733028,37.636415);
    var mapCanvas = document.getElementById("map");
    var mapOptions = {center: myCenter, zoom: 12};
    var map = new google.maps.Map(mapCanvas, mapOptions);
    var marker = new google.maps.Marker({position:myCenter});
    marker.setMap(map);
}

/* slider1 */

$(function(){
    var tolerance = 100;
    var speed = 650;
    var interactiveElements = $('input, button, a');
    var itemsLength = $('.panel').length;
    var active = 1;
    for (i=1; i<=itemsLength; i++){
        var $layer = $(".panel:nth-child("+i+")");
        var bgImg = $layer.attr("data-img");
        $layer.css({
            "background": "url("+bgImg+") no-repeat center / cover"
        });
    };
    setTimeout(function() {
        $(".panel").css({
            "transition": "cubic-bezier(.4,.95,.5,1.5) "+speed+"ms"
        });
    }, 200);
    $(".panel:not(:first)").addClass("right");
    function swipeScreen() {
        $('.swipe').on('mousedown touchstart', function(e) {
            
            var touch = e.originalEvent.touches;
            var start = touch ? touch[0].pageX : e.pageX;
            var difference;
            $(this).on('mousemove touchmove', function(e) {
                var contact = e.originalEvent.touches,
                end = contact ? contact[0].pageX : e.pageX;
                difference = end-start;
            });
            $(window).one('mouseup touchend', function(e) {
                e.preventDefault();
                // Переход вправо:
                if (active < itemsLength && difference < -tolerance) {
                    $(".panel:nth-child("+active+")").addClass("left");
                    $(".panel:nth-child("+(active+1)+")").removeClass("right");
                    active += 1;
                    btnDisable();
                };
                // Переход влево:
                if (active > 1 && difference > tolerance) {
                    $(".panel:nth-child("+(active-1)+")").removeClass("left");
                    $(".panel:nth-child("+active+")").addClass("right");
                    active -= 1;
                    btnDisable();
                };
                $('.swipe').off('mousemove touchmove');
            });
        });
    };
    swipeScreen();
    interactiveElements.on('touchstart touchend touchup', function(e) {
        e.stopPropagation();
    });
    // Кнопки:
    $(".btn-prev").click(function(){
        // Переход влево:
        if (active > 1) {
            $(".panel:nth-child("+(active-1)+")").removeClass("left");
            $(".panel:nth-child("+active+")").addClass("right");
            active -= 1;
            btnDisable();
        };
    });
    $(".btn-next").click(function(){
        // Переход вправо:
        if (active < itemsLength) {
            $(".panel:nth-child("+active+")").addClass("left");
            $(".panel:nth-child("+(active+1)+")").removeClass("right");
            active += 1;
            btnDisable();
        };
    });
    function btnDisable() {
        if (active >= itemsLength) {
            $(".btn-next").prop("disabled", true);
            $(".btn-prev").prop("disabled", false);
        }
        else if (active <= 1) {
            $(".btn-prev").prop("disabled", true);
            $(".btn-next").prop("disabled", false);
        }
        else {
            $(".btn-prev, .btn-next").prop("disabled", false);
        };
    };
});    

/* slider2 */
const panels = document.querySelectorAll('.panel1');
panels.forEach(panel1 => {
    panel1.addEventListener('click', () => {
        removeActiveClasses();
        panel1.classList.add('active');
    });
});
function removeActiveClasses() {
    panels.forEach(panel1 => {
        panel1.classList.remove('active');
    });
}

/* bubble */

const clip = (v, min, max = Infinity) => {
    if (v < min) return min;
    else if (v > max) return max;
    else return v;
};
const randRange = (min, max) => Math.random() * max + min;
function bubble(x, y, rect, hue, target) {
    const size = randRange(20, rect.width / 10);
    const circleHue = hue + randRange(-20, 20);
    const animDuration = randRange(clip(size ** 2/1000, 1), 6) 
    const zIndex = Math.random() < 0.1 ? 2 : -1;
    const circle = document.createElement("span");
    circle.className = "bubble";
    circle.style.left = x + "px";
    circle.style.top = y + "px";
    circle.style.width = size + "px";
    circle.style.height = size + "px";
    circle.style.background = `hsl(${circleHue}deg, 100%, 60%)`;
    circle.style.zIndex = zIndex
    circle.style.animationDuration = animDuration + "s";
    target.appendChild(circle);
}
function bubblestart() { 
    document.querySelectorAll("[data-bubble-hue]").forEach((target) => {
        const rect = target.getBoundingClientRect();
        const hue = Number(target.getAttribute("data-bubble-hue"));
        const count = Number(target.getAttribute("data-bubble-count") || 50);
        for (let i = 0; i < count; i++) {
            const x = randRange(0, rect.width);
            const y = randRange(0, rect.height);
            bubble(x, y, rect, hue, target);
        }
    });
}
window.addEventListener("resize", () => {
    let del = document.querySelectorAll(".bubble");
    del.forEach( e => e.remove() );
    bubblestart();
});
bubblestart();

/* cookie */

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
let cookiecook = getCookie("cookiecook"),
cookiewin = document.getElementsByClassName('cookie_notice')[0];    

if (cookiecook != "no") {
    cookiewin.style.display="block"; 
    document.getElementById("cookie_close").addEventListener("click", function(){
        cookiewin.style.display="none";    
        let date = new Date;
        date.setDate(date.getDate() + 1);    
        document.cookie = "cookiecook=no; path=/; expires=" + date.toUTCString();               
    });
}

/* exit */

$(document).mouseleave(function(e){
    if (e.clientY < 10) {
        $(".exitblock").fadeIn("fast");
    }    
});
$(document).click(function(e) {
    if (($(".exitblock").is(':visible')) && (!$(e.target).closest(".exitblock .modaltext").length)) {
        $(".exitblock").remove();
    }
});

/* interactive-map */

$(function() {
    $('[data-code]').mouseenter(function() {    
        $('.district span').html($(this).attr('data-title'));
        $('.district').show();
    });    
    $('[data-code]').mouseleave(function() {
        if (!$('.rf-map').hasClass("open")) {
            $('.district').hide();
        }
    });    
    $('.rf-map').on('click', '[data-code], .district-links div', function(){    
        let id = $(this).attr('data-code');
        if ($('#' + id).text() != '') {
            $('.district').show();
            $('.district span').html($(this).attr('data-title'));
            $('[data-code]').addClass('dropfill'); 
            $(this).addClass('mainfill'); 
            $('.rf-map').addClass('open');
            $('#' + id).fadeIn();
        }
    });
    $('.close-district').click(function() {
        $('.rf-map').removeClass('open');
        $('[data-code]').removeClass('dropfill');
        $('[data-code]').removeClass('mainfill');
        $('.district-text').hide();
        $('.district').hide();
    });    
    $('[data-code]').each(function() {  
        let id = $(this).attr('data-code');
        let title = $(this).attr('data-title');    
        if ($('#' + id).text() != '') {    
            $('.district-links').append('<div data-title="' + title + '" data-code="' + id + '">' + title + '</div>');    
        }
    }); 
});

/* contacts footer */

const contact_btn = document.querySelector('.contact-btn');
const close_btn = document.querySelector('.close-btn');
const contact_container = document.querySelector('.contact-container');
contact_btn.addEventListener('click', () => {
    contact_container.classList.toggle('visible')
});
close_btn.addEventListener('click', () => {
    contact_container.classList.remove('visible')
});


/* button up */

$('body').append('<div class="upbtn"></div>');            
$(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
        $('.upbtn').css({
            bottom: 0
        });
        } else {
        $('.upbtn').css({
            bottom: '-80px'
        });
    }
});
$('.upbtn').on('click',function() {
    $('html, body').animate({
        scrollTop: 0
    }, 500);
    return false;
});
