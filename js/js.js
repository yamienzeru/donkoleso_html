var consultantAnimation = false;
var roundmapAnimation = false;

$(function () {
    $(window).resize(function () {
        fixStickPanelPosition();
    });
    $(window).bind('orientationchange', function () {
        fixStickPanelPosition();
    });
    $("select").each(function () {
        var css = $(this).attr("class");
        if (!css || typeof css == "undefined") css = '';
        $(this).multiselect({
            noneSelectedText: "--",
            header: false,
            selectedList: 1,
            minWidth: 168,
            multiple: false,
            classes: css
        });
    });
    $(".searching .overlay").click(function () {
        if ($(this).parents(".disabled")) {
            $(".search-form .tab").toggleClass("active");
            $(".search-form .searching .tab").toggleClass("disabled");
        }
    });
    $(".search-form .tabs .tab").click(function () {
        if (!$(this).hasClass("active")) {
            $(".search-form .tab").toggleClass("active");
            $(".search-form .searching .tab").toggleClass("disabled");
        }
    });
    $(window).load(function () {
        $("html").addClass("fired");
    });
    $(".checkbox-label").each(function () {
        var is_checked = $(this).find("input:first:checked").length;
        if (is_checked) {
            $(this).find(".checkbox").addClass("on");
            $(this).addClass("on");
        } else {
            $(this).find(".checkbox").removeClass("on");
            $(this).removeClass("on");
        }
    });
    $(".checkbox-label").click(function () {
        var is_checked = $(this).find("input:first:checked").length;
        if (is_checked) {
            $(this).find(".checkbox").addClass("on");
            $(this).addClass("on");
        } else {
            $(this).find(".checkbox").removeClass("on");
            $(this).removeClass("on");
        }
    });

    /* calling popup */
    $("#call-popup .close-link").click(function () {
        $("#call-popup .call-popup").removeClass("opened");
        setTimeout(function () {
            $("#call-popup").fadeOut(100);
        }, 300);
    });
    $(".link-call-popup").click(function () {
        $("#call-popup").fadeIn(100, function () {
            $("#call-popup .call-popup").addClass("opened");
        });        
    });

    /* success popup */
    $(".link-open-success-popup").click(function () {
        $("#popup-goods-added").show();
        setTimeout(function () {
            $("#popup-goods-added").addClass("opened");
        }, 100);
        
    });
    $("#popup-goods-added .btn-close").click(function () {
        $("#popup-goods-added").removeClass("opened");
        setTimeout(function () {
            $("#popup-goods-added").hide();
        }, 300);
    });

    /* contact page animations */
    if ($(".consultants").length) {
        consultantAnimation = animateConsultants();
    }
    if ($(".maps").length) {
        roundmapAnimation = animateRoundMap();
    }
    fixStickPanelPosition();
    $(window).scroll(function () {
        if ($(".consultants").length) { 
            if (!consultantAnimation) {
                consultantAnimation = animateConsultants();
            }
        }
        if ($(".maps").length) {
            if (!roundmapAnimation) {
                roundmapAnimation = animateRoundMap();
            }
        }
        fixStickPanelPosition();

    });

    /* contact page Google Maps */
    if ($("#map-acsay").length && $("#map-novocherkassk").length && $("#map-reconstructor").length) {
        loadGoogleMapsScript();
    }

    /* slider on news details page */
    $('#bxslider').bxSlider({
        slideSelector: "div.slide",
        pagerType: "short",
        pagerShortSeparator: " из ",
        nextSelector: '#bxslider-next',
        prevSelector: '#bxslider-prev',
        nextText: '&nbsp;',
        prevText: '&nbsp;',
        responsive: false,
        speed:1000
    });

    /* counter for shopping cart */

    /* increase count */
    $(".counter .plus").click(function () {
        var val = parseInt($(this).parent().find(".counter-index em").attr("data-count"));
        if (isNaN(val)) {
            $(this).parent().find(".counter-index em").attr("data-count", 1);
            $(this).parent().find(".counter-index em").html(1);
        }
        else {
            $(this).parent().find(".counter-index em").attr("data-count", val+1);
            $(this).parent().find(".counter-index em").html(val + 1);
        }
    });

    /* decrease count */
    $(".counter a.minus").click(function () {
        var val = parseInt($(this).parent().find(".counter-index em").attr("data-count"));
        if (isNaN(val)) {
            $(this).parent().find(".counter-index em").attr("data-count", 1);
            $(this).parent().find(".counter-index em").html(1);
        }
        else {
            if (val > 1) {
                $(this).parent().find(".counter-index em").attr("data-count", val - 1);
                $(this).parent().find(".counter-index em").html(val - 1);
            }
            if (val <= 1) {
                $(this).parent().find(".counter-index em").attr("data-count", 1);
                $(this).parent().find(".counter-index em").html(1);
            }
        }
    });

    /* recalculate price if counter is changed */
    $(".shopping-cart .counter a.plus, .shopping-cart .counter a.minus").click(function () {
        var count = parseInt($(this).parent().find(".counter-index em").attr("data-count"));

        var str_per_one = $(this).parent().parent().parent().find(".col-price .price").attr("data-price");
        var per_one = parseFloat(str_per_one);
        var sum = 0;
        if (!isNaN(count) && !isNaN(per_one)) {
            sum = count * per_one;
            sum = sum.toFixed(2);
        }
        $(this).parent().parent().parent().find(".col-amount .price").attr("data-price", sum);
        $(this).parent().parent().parent().find(".col-amount .price").html(formatPrice(sum));
        var total = recalculateTotalPrice();
        $(".shopping-cart .amout-payment").attr("data-price", total[0]);
        $(".shopping-cart .amout-payment").html(total[1]);
    });

    /* remove item from shopping cart */
    $(".shopping-table .link-remove-product").click(function () {
        var obj = $(this).parent().parent();
        obj.fadeOut(500, function () {
            obj.remove();
            var total = recalculateTotalPrice();
            $(".shopping-cart .amout-payment").attr("data-price", total[0]);
            $(".shopping-cart .amout-payment").html(total[1]);
            if (total[0] == 0) {
                $(".shopping-cart-empty").show();
                $(".shopping-cart").hide();
            }
        });
    });

    $("#disk-brand").on("multiselectclick", function (event, ui) {
        var array_of_checked_values = $(this).multiselect("getChecked").map(function(){
            return this.value;    
        }).get();
        if (array_of_checked_values && array_of_checked_values[0] != -1) {
            $("#choose-disk-by-auto .ui-multiselect.second").removeClass("hidden");
        } else {
            $("#choose-disk-by-auto .ui-multiselect.second, #choose-disk-by-auto .ui-multiselect.third, #choose-disk-by-auto .ui-multiselect.fourth, #choose-disk-by-auto .checklists, #choose-disk-by-auto .availablelist").addClass("hidden");
            $("#disk-model, #disk-year, #disk-modification").each(function () {
                $(this).find("option[value=-1]").each(function () {
                    $(this).attr("selected", "selected");
                });
                $(this).multiselect("refresh");
            });
            $("#choose-disk-by-auto .checklists .checkbox, #choose-disk-by-auto .availablelist .checkbox").each(function () {
                $(this).find("input:checked").each(function () {
                    $(this).attr("checked", false);
                });
                $(this).removeClass("on");
                $(this).parent().removeClass("on");
            });
        }
    });
    $("#disk-model").on("multiselectclick", function (event, ui) {
        var array_of_checked_values = $(this).multiselect("getChecked").map(function () {
            return this.value;
        }).get();
        if (array_of_checked_values && array_of_checked_values[0] != -1) {
            $("#choose-disk-by-auto .ui-multiselect.third").removeClass("hidden");
        } else {
            $("#choose-disk-by-auto .ui-multiselect.third, #choose-disk-by-auto .ui-multiselect.fourth, #choose-disk-by-auto .checklists, #choose-disk-by-auto .availablelist").addClass("hidden");

            $("#disk-year, #disk-modification").each(function () {
                $(this).find("option[value=-1]").each(function () {
                    $(this).attr("selected", "selected");
                });
                $(this).multiselect("refresh");
            });
            $("#choose-disk-by-auto .checklists .checkbox, #choose-disk-by-auto .availablelist .checkbox").each(function () {
                $(this).find("input:checked").each(function () {
                    $(this).attr("checked", false);
                });
                $(this).removeClass("on");
                $(this).parent().removeClass("on");
            });
        }
    });
    $("#disk-year").on("multiselectclick", function (event, ui) {
        var array_of_checked_values = $(this).multiselect("getChecked").map(function () {
            return this.value;
        }).get();
        if (array_of_checked_values && array_of_checked_values[0] != -1) {
            $("#choose-disk-by-auto .ui-multiselect.fourth").removeClass("hidden");
        } else {
            $("#choose-disk-by-auto .ui-multiselect.fourth, #choose-disk-by-auto .checklists, #choose-disk-by-auto .availablelist").addClass("hidden");
            $("#disk-modification").each(function () {
                $(this).find("option[value=-1]").each(function () {
                    $(this).attr("selected", "selected");
                });
                $(this).multiselect("refresh");
            });
            $("#choose-disk-by-auto .checklists .checkbox, #choose-disk-by-auto .availablelist .checkbox").each(function () {
                $(this).find("input:checked").each(function () {
                    $(this).attr("checked", false);
                });
                $(this).removeClass("on");
                $(this).parent().removeClass("on");
            });
        }
    });
    $("#disk-modification").on("multiselectclick", function (event, ui) {
        var array_of_checked_values = $(this).multiselect("getChecked").map(function () {
            return this.value;
        }).get();
        if (array_of_checked_values && array_of_checked_values[0] != -1) {
            $("#choose-disk-by-auto .checklists, #choose-disk-by-auto .availablelist").removeClass("hidden");
        } else {
            $("#choose-disk-by-auto .checklists, #choose-disk-by-auto .availablelist").addClass("hidden");
            $("#choose-disk-by-auto .checklists .checkbox, #choose-disk-by-auto .availablelist .checkbox").each(function () {
                $(this).find("input:checked").each(function () {
                    $(this).attr("checked", false);
                });
                $(this).removeClass("on");
                $(this).parent().removeClass("on");
            });
        }
    });
    $("#btn-clean-filter-disk-auto").click(function () {
        $("#choose-disk-by-auto .ui-multiselect.second, #choose-disk-by-auto .ui-multiselect.third, #choose-disk-by-auto .ui-multiselect.fourth, #choose-disk-by-auto .checklists, #choose-disk-by-auto .availablelist").addClass("hidden");
        $("#disk-brand, #disk-model, #disk-year, #disk-modification").each(function () {
            $(this).find("option[value=-1]").each(function () {
                $(this).attr("selected", "selected");
            });
            $(this).multiselect("refresh");
        });
        $("#choose-disk-by-auto .checklists .checkbox, #choose-disk-by-auto .availablelist .checkbox").each(function () {
            $(this).find("input:checked").each(function () {
                $(this).attr("checked", false);
            });
            $(this).removeClass("on");
            $(this).parent().removeClass("on");
        });
    });

    $("#btn-clean-filter-disk-param").click(function () {
        $("#choose-disk-by-params select").each(function () {
            $(this).find("option[value=-1]").each(function () {
                $(this).attr("selected", "selected");
            });
            $(this).multiselect("refresh");
        });
        $("#choose-disk-by-params .checklists .checkbox, #choose-disk-by-params .availablelist .checkbox").each(function () {
            $(this).find("input:checked").each(function () {
                $(this).attr("checked", false);
            });
            $(this).removeClass("on");
            $(this).parent().removeClass("on");
        });
    });

    $(".sidebar-filter .button-set-double a").click(function () {
        if ($(this).hasClass("active")) return false;
        $(".sidebar-filter .button-set-double a").removeClass("active");
        $(".sidebar-filter .choose-content").removeClass("active");
        $(this).addClass("active");
        var id = $(this).attr("data-href");
        $("#" + id).addClass("active");
    });

    $("#link-show-all").click(function () {
        $("#full-list-of-manufactors").css("display", "table-row");
        $(this).hide();
        $("#link-show-main").show();
    });

    $("#link-show-main").click(function () {
        $("#full-list-of-manufactors").css("display", "none");
        $(this).hide();
        $("#link-show-all").show();
    });
});

/* recalculate price 
 * return array [float format, string format] */
function recalculateTotalPrice() {
    var amount = 0;
    if ($(".shopping-table tbody tr").length) {
        var i = 0;
        $(".shopping-table tbody tr").each(function () {
            amount = amount + parseFloat($(this).find(".col-amount .price:first").attr("data-price"));
            i++;
        });
        amount1 = formatPrice(amount);
        $("#shop-cart-amount-price").html(amount1);
        $("#shop-cart-goods-count").html(i);
        return [amount, amount1];
    } else {
        $("#shop-cart-amount-price").html(0);
        $("#shop-cart-goods-count").html(0);
        return [0, 0];
    }
}

/* function for money preformating (float) */
function formatPrice(float) {
    var string = float.toString();
    var floatPart = "";
    var intPart = "";
    var dot = string.indexOf(".");
    if (dot != -1) {
        if (string.indexOf(".00") == -1) {
            floatPart = string.substr(dot, string.length - 1);           
        }
        intPart = string.substr(0, dot);
        intPart = formatMoney(intPart, "", "", " ", " ");
    } else {
        intPart = formatMoney(string, "", "", " ", " ");
    }
    return intPart + floatPart;
}

/* function for money format (integer) */
function formatMoney(number, places, symbol, thousand, decimal) {
    number = number || 0;
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var negative = number < 0 ? "-" : "",
	    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
	    j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}


/* Contact page, round map animation */
function animateRoundMap() {
    var scrollTop = parseInt($(window).scrollTop());
    var offset = parseInt($(".maps:first").offset().top);
    if (scrollTop >= (offset - 300)) {
        $(".maps .c2").addClass("on");
        setTimeout(function () {
            $(".maps .c1").addClass("on");
        }, 200);
        setTimeout(function () {
            $(".maps .c3").addClass("on");
        }, 400);
        return true;
    }
    return false;
}

/* Contact page, consultans photos animation */
function animateConsultants() {
    var scrollTop = parseInt($(window).scrollTop());
    var offset = parseInt($(".consultants:first").offset().top);
    if (scrollTop >= (offset - 300)) {
        $(".consultants .person").addClass("on");
        return true;
    }
    return false;
}

/* Google Maps API loading */
function loadGoogleMapsScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=initializeGoogleMaps";
    document.body.appendChild(script);
}
/* Google maps loading callback */
function initializeGoogleMaps() {
    /* Acsay */
    var latAcsay = 47.273421;
    var lngAcsay = 39.823272;
    var AcsayLatlng = new google.maps.LatLng(latAcsay, lngAcsay);
    var mapAcsayOptions = {
        zoom: 14,
        center: AcsayLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        rotateControl: false
    }
    
    var mapAcsay = new google.maps.Map(document.getElementById('map-acsay'), mapAcsayOptions);

    var markerImage = new google.maps.MarkerImage('img/marker.png', new google.maps.Size(40, 45));
    var marker = new google.maps.Marker({
        position: AcsayLatlng,
        map: mapAcsay,
        icon: markerImage
    });

    /* Novocherkassk */
    var latNovocherkassk = 47.422233;
    var lngNovocherkassk = 40.051122;
    var NovocherkasskLatlng = new google.maps.LatLng(latNovocherkassk, lngNovocherkassk);
    var mapNovocherkasskOptions = {
        zoom: 14,
        center: NovocherkasskLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        rotateControl: false
    }
    var mapNovocherkassk = new google.maps.Map(document.getElementById('map-novocherkassk'), mapNovocherkasskOptions);

    var markerImage = new google.maps.MarkerImage('img/marker.png', new google.maps.Size(40, 45));
    var marker = new google.maps.Marker({
        position: NovocherkasskLatlng,
        map: mapNovocherkassk,
        icon: markerImage
    });

    /* Reconstructor */
    var latReconstructor = 47.301666;
    var lngReconstructor = 39.942074;
    var ReconstructorLatlng = new google.maps.LatLng(latReconstructor, lngReconstructor);
    var mapReconstructorOptions = {
        zoom: 14,
        center: ReconstructorLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        rotateControl: false
    }
    var mapReconstructor = new google.maps.Map(document.getElementById('map-reconstructor'), mapReconstructorOptions);

    var markerImage = new google.maps.MarkerImage('img/marker.png', new google.maps.Size(40, 45));
    var marker = new google.maps.Marker({
        position: ReconstructorLatlng,
        map: mapReconstructor,
        icon: markerImage
    });
}

function getClientHeight() {
    return document.compatMode == 'CSS1Compat' && !window.opera ? document.documentElement.clientHeight : document.body.clientHeight;
}
function addCssLink(path) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", path);
    head.appendChild(link);
}

/* compare panel fixing */
function fixStickPanelPosition() {
    if ($(".stick-toolbar").length) {
        var page_h = parseInt($(".container").height());
        var scroll = parseInt($(window).scrollTop());
        var st_h = parseInt($(".stick-toolbar").height());
        var screen_h = parseInt(getClientHeight());
        var delta = page_h - scroll - screen_h;
        if (delta < 57 && delta > 0) {
            $(".stick-toolbar").removeClass("at-bottom");
            $(".stick-toolbar").css("bottom", 56 - delta + "px");
        } else if (delta < 1) {
            $(".stick-toolbar").addClass("at-bottom");
        } else {
            $(".stick-toolbar").removeClass("at-bottom");
            $(".stick-toolbar").css("bottom", 0);
        }
    }
}