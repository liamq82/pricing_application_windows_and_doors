$(document).ready(function() {

    $('#door_button').on('click', function(){
        var JSON_array = 'json=[{"width": 300, "height": 200},{"width": 100, "height": 200}]';
        $.post("php/json_decoder.php", JSON_array).done(function(data) {
            console.log('from server: ' + data);
        });
    });

    var products = [];
    var input_fields_valid = false;

    $('#window_button').smoothScroll();
    $('#step_2_proceed').smoothScroll();
    $('#proceed_to_step_4').smoothScroll();

    function updateModel(product_id) {
        var input = $(this).val();
        var product_index = -1;

        for (var i = 0; i < products.length; i++) {
            var this_product_id = products[i].id;
            if (product_id == this_product_id) {
                product_index = i;
            }
        }

        if ($(this).attr('id') === 'location') {
            products[product_index].location = input;
        } else if ($(this).attr('id') === 'width') {
            products[product_index].width = input;
        } else if ($(this).attr('id') === 'height') {
            products[product_index].height = input;
        } else if ($(this).attr('id') === 'color') {
            products[product_index].color = input;
        }

        return product_index;
    }

    function product(type, location, width, height, design, color, id) {
        this.type = type;
        this.location = location;
        this.width = width;
        this.height = height;
        this.design = design;
        this.color = color;
        this.id = id;
    };

    function createNewProduct() {
        var product_id = Math.floor((Math.random() * 100) + 1);
        var selected_design = $(this).attr('id');
        var my_product = new product('window', '', '', '', selected_design, '', product_id);
        products.push(my_product);
        return product_id
    }

    function validateFields(product) {
        var valid = true;
        if (product.location === '') {
            valid = false;
        } else if (product.width < 300 || product.width > 3000 || product.height < 300 || product.height > 5000) {
            valid = false;
        } else if (isNaN(product.width) || isNaN(product.height)) {
            valid = false;
        } else if (product.width === '' || product.height === '') {
            valid = false;
        }

        if (valid) {
            $("#proceed_to_step_4").show();
        } else {
            $("#proceed_to_step_4").hide();
        }
        return valid;
    }

    function renderProductDataAndDesigns(product) {
        var $step3 = $("#designs");
        var data_fields = "<div id=" + product.id + " class='row'><div class='col-xs-1'></div><div class='col-xs-4'><div class='thumbnail'><div class='input-group'><input id='location' type='text' class='form-control' placeholder='Window name/location'><span class='input-group-addon'></span></div><div class='input-group'><input id='width' type='text' class='form-control' placeholder='Width'><span class='input-group-addon'>milimeters</span></div><div class='input-group'><input id='height' type='text' class='form-control' placeholder='Height'><span class='input-group-addon'>milimeters</span></div><div class='btn-group btn-input clearfix'><button type='button' class='btn btn-default dropdown-toggle form-control' data-toggle='dropdown'><span data-bind='label'>White</span><span class='caret'></span></button><ul class='dropdown-menu' role='menu'><li><a>White</a></li><li><a>Cream</a></li><li><a>Woodgrain</a></li></ul></div></div></div>";
        var str = "<div class='col-xs-4'><div class='thumbnail'><img id='step_3_selected_design' src='images/" + product.design + ".png'></div></div></div>";
        var data_plus_str = data_fields + str;
        var html = $.parseHTML(data_plus_str);
        $step3.append(html);
        var selector_location = '#' + product.id + ' #location';
        $(selector_location).val(product.location);
        var selector_width = '#' + product.id + ' #width';
        $(selector_width).val(product.width);
        var selector_height = '#' + product.id + ' #height';
        $(selector_height).val(product.height);

        if (product.color === '') {
            product.color = 'White';
        }
        var selector_color = '#' + product.id + ' [data-bind="label"]';
        $(selector_color).text(product.color);

        var selector_colors = '#' + product.id + ' a';
        $(selector_colors).css("cursor", "pointer");
    }

    $("#step_1_change_selection").hide();
    $("#step_2").hide();
    $("#step_3").hide();
    $('#step_4').hide();
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
        var product_id = createNewProduct.call(this);

        $(this).siblings().show();
        $("#step_3").slideDown();

        $('#designs').children().remove();
        $.each(products, function(index, product) {
            renderProductDataAndDesigns(product);
        });

        $('#step_3 .form-control').bind('keyup', function() {
            var product_id = $(this).parent().parent().parent().parent().attr('id');
            var product_index = updateModel.call(this, product_id);
            validateFields(products[product_index]);
        });

        $('.dropdown-menu li').on('click', function(event) {
            var product_id = $(this).parent().parent().parent().parent().parent().attr('id');
            var product_index = updateModel.call(this, product_id);
            validateFields(products[product_index]);
            var $target = $(event.currentTarget);
            var color = $target.text();
            products[product_index].color = color;
            var btn_group = $target.closest('.btn-group');
            btn_group.find('[data-bind="label"]').text($target.text());
            var dropdown_toggle = $target.children('.dropdown-toggle');
            dropdown_toggle.dropdown('toggle');
            return false;
        });

        $('#proceed_to_step_4').on('click', function() {
            $('#step_4').slideDown();
        });

        if (products.length === 0) {
            $("#step_2_proceed").hide();
        } else {
            $("#step_2_proceed").show();
        }
    });

    $('#submit_data').on('click', function() {
        var name = $('#name_input').val();
        var email = $('#email_input').val();
        var mobile = $('#mobile_input').val();

        var POST_data = 'json=';
        var products_json_string = JSON.stringify(products);
        POST_data = POST_data + products_json_string;
        $.post("php/json_decoder.php", POST_data).done(function(data) {
            console.log('from server: ' + data);
        });


/*        var POST_data = 'window1=';
        var window1 = products[0];
        var window1_string = JSON.stringify(window1);
        POST_data = POST_data + window1_string;
        $.post("test.php", POST_data).done(function(data) {
            console.log('Sent back from server: ' + data);
        });*/

    });

});
