var response;
var linkorderdata;
var change = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

$(window).load(function() {
    $("#page2").hide();
});

$("#settings_icon").click(function() {
    $("#page1").hide();
    $("#page2").fadeIn(1000);
    $("body").css("background-color", "#e6e6e6");
});

$("#done").click(function() {
    update(response);
    $("#page1").fadeIn(1000);
    $("#page2").hide();
    $("body").css("background-color", "#4e677e");
});

function update(data) {
    response = data;
    var new2 = data.Tiles.sort(function(a, b) {
        return a.DisplayOrder - b.DisplayOrder;
    });
    var out = "";
    var pagetwolist = "";
    var count = 0;
    $.each(change, function(index1, value1) {
        $.each(response.Tiles, function(index, value) {
            if (value.DisplayOrder == value1) {
                var order = value.DisplayOrder;
                if (value.TileProperties.HomeTileStatus == true) {
                    if (count % 4 == 0) {
                        out += "<tr>";
                    };
                    if (count % 4 < 4) {
                        out += "<td><img class='tab_img' src='" +
                            value.TileProperties.HomeURL +
                            "'><p class='table_p'>" +
                            value.Caption +
                            "</p></td>";
                    } else {
                        out += "</tr>";
                    };
                    count = count + 1;
                    pagetwolist += "<tr class='the_list_tr' id='t_" + order + "'> <td class='check' onClick='choose(" + order + ")'> <td class='content'>" + value.Caption + "</td><td class='drag'></td></tr>";
                } else {
                    pagetwolist += "<tr class='the_list_tr' id='t_" + order + "'> <td class='empty' onClick='choose(" + order + ")'> <td class='content'>" + value.Caption + "</td><td class='drag'></td></tr>";
                };
            };
        });
    });

    document.getElementById("img_table").innerHTML = out;
    document.getElementById("the_list").innerHTML = pagetwolist;
}

$(document).ready(function() {
    $.ajax({
        url: 'js/tiles2.json',
        dataType: 'json',
        success: update,
		header: "Access-Control-Allow-Headers: *",
        error: function(error) {
            console.log("NO");
        }
    });
    console.log("LOADED");
});

function choose(id) {
    var selector = "#t_" + id + " td:first-child";
    var className = $(selector).attr('class');
    console.log(selector);
    if (className == "check") {
        $(selector).addClass("empty").removeClass("check");
        $.each(response.Tiles, function(index, value) {
            if (value.DisplayOrder == id) {
                value.TileProperties.HomeTileStatus = false;
            }
        });
    } else if (className == "empty") {
        $(selector).addClass("check").removeClass("empty");
        $.each(response.Tiles, function(index, value) {
            if (value.DisplayOrder == id) {
                value.TileProperties.HomeTileStatus = true;
            }
        });
    }

}


$("#the_list").sortable({
    items: "tr",
    helper: fixWidthHelper,
    update: function() {
        change = [];
        linkorderdata = '&' + $("#the_list").sortable('serialize');
        $.each(linkorderdata.split("&t[]="), function(index, value) {
            change.push(parseInt(value));
        });
    }
});

function fixWidthHelper(e, ui) {
    ui.children().each(function() {
        $(this).width($(this).width());
        $(this).height($(this).height());
    });
    return ui;
}
