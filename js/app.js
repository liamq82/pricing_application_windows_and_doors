$(document).ready(function() {

    var products = [];
    var input_fields_valid = false;

    $('#window_button').smoothScroll();
    // $("#design_content a[id^='design']").smoothScroll();
    $('#step_2_proceed').smoothScroll();

    function product(type, width, height, design, id) {
        this.type = type;
        this.width = width;
        this.height = height;
        this.design = design;
        this.id = id;
    };

    $("#step_1_change_selection").hide();
    $("#step_2").hide();
    $("#step_3").hide();
    $("#step_2 a[id^='selected']").hide();
    $("#step_2_proceed").hide();
    $("#proceed_to_step_4").hide();

    $('#step_2_proceed').click(function() {
        $(this).hide();
    });

    $("#window_button").click(function() {
        $('#step_1_content').slideUp();
        $("#step_2").slideDown();
        $("#step_1_change_selection").text('Window .... click to change');
        $("#step_1_change_selection").show('slow');
    });

    $("#door_button").click(function() {
        $('#step_1_content').slideUp();
        $("#step_2").slideDown();
        $("#step_1_change_selection").text('Door .... click to change');
        $("#step_1_change_selection").show('slow');
    });


    $("#step_1_change_selection").click(function() {
        if (typeof my_window != "undefined") {
            delete my_window;
        }

        if (typeof my_door != "undefined") {
            delete my_door;
        }

        var hidden = $('#step_2').is(':hidden');
        if (!hidden) {
            $("#step_2").slideUp();
        }

        $('#step_1_content').slideDown();
        $("#step_1_change_selection").hide('slow');
    });

    $("#design_content a[id^='design']").click(function() {
        var product_id = Math.floor((Math.random()*100)+1);
        var add_design;
        var selected_design = $(this).attr('id');
        var product_exists = false;
        var product_index = -1;
        $.each(products, function(index, product) {
            if (product.design === selected_design) {
                product_exists = true;
                product_index = index;
            }
        });

        if (product_exists) {
            var removed = products.splice(product_index, 1);
            $(this).text('Select');
            $(this).siblings().hide();
            add_design = false;
        } else {
            var my_product = new product('window', '', '', selected_design, product_id);
            products.push(my_product);
            $(this).text('Unselect');
            $(this).siblings().show();
            $("#step_3").slideDown();
            add_design = true;
        }

        if (add_design) {
            var $step3 = $("#designs");
            var design = selected_design;
            var data_fields = "<div id=" + design + " class='row'><div class='col-xs-1'></div><div class='col-xs-4'><div class='thumbnail'><div class='input-group'><input id='location' type='text' class='form-control' placeholder='Window name/location'><span class='input-group-addon'></span></div><div class='input-group'><input id='width' type='text' class='form-control' placeholder='Width'><span class='input-group-addon'>milimeters</span></div><div class='input-group'><input type='text' class='form-control' placeholder='Height'><span class='input-group-addon'>milimeters</span></div><div class='input-group'><input type='text' class='form-control' placeholder='Color'><span class='input-group-addon'></span></div></div></div>";
            var str = "<div class='col-xs-4'><div class='thumbnail'><img id='step_3_selected_design' src='images/" + design + ".png'></div></div></div>";
            var data_plus_str = data_fields + str;
            var html = $.parseHTML(data_plus_str);
            $step3.append(html);

            $('.form-control').bind('keyup', function() {
                if($(this).attr('id') === 'location'){
                    var input = $(this).val();
                    if (input !== '') {
                        input_fields_valid = true;
                    } else {
                        input_fields_valid = false;
                    }                    
                }else if($(this).attr('id') === 'width'){
                    var width = $(this).val();
                    if(isNaN(width)){
                        input_fields_valid = false;
                    }else{
                        if(width > 300 && width <3000){
                            input_fields_valid = true;
                        }else {
                            input_fields_valid = false;
                        }
                    }
                }

                if (input_fields_valid) {
                    $("#proceed_to_step_4").show();
                } else {
                    $("#proceed_to_step_4").hide();
                }
            });

        } else {
            var selector = '#designs #' + selected_design;
            $(selector).remove();
        }

        if (products.length === 0) {
            $("#step_2_proceed").hide();
        } else {
            $("#step_2_proceed").show();
        }

    });

});
