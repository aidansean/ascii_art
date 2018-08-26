function AsciiManager() {
    "use strict";
    var self = this;

    self.get = function (id) {
        return document.getElementById(id);
    };

    self.get_parameter_by_name = function (name) {
        // Taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
        var match = new RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, " "));
    };

    self.keyDown = function (event) {
        switch (event.key) {
        case 27:
            self.kill = true;
            break;

        case 32:
            self.pause = !self.pause;
            break;
        }
    };

    self.choose_value_by_uri = function (url_name, default_value, allowed_values) {
        // Take the default value, then try to match against other allowed values
        var value = default_value;

        var url_value = self.get_parameter_by_name(url_name);

        if (allowed_values) {
            Object.keys(allowed_values).forEach(function (index) {
                if (url_value === allowed_values[index]) {
                    value = allowed_values[index];
                }
            });
        }

        return value;
    };

    self.set_value_by_uri = function (url_name, default_value) {
        // Take the default value, then try to match against other allowed values
        var url_value = self.get_parameter_by_name(url_name);
        var value = default_value;
        if (url_value) {
            value = url_value;
        }
        return value;
    };

    self.character_sets = {
        AZaz: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ",
        AZaz09: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890",
        numbers: "01234567890",
        punctuation: ";\"'!@#$%^&*()-_=+[]{}|:/?.>,<`~±§\\",
        particles: "eμτνudcstbgWZHγ",
        particles2: "eμτνugγ",
        binary: "01"
    };
    self.modes = ["colour", "bw", "rgb", "pixelate", "matrix"];
    self.character_rules = ["parsimony", "random"];

    self.mode = self.choose_value_by_uri("mode", "colour", self.modes);
    self.character_set = self.choose_value_by_uri("char_set", "numbers", Object.keys(self.character_sets));
    self.character_rule = self.choose_value_by_uri("rule", "parsimony", self.character_rules);
    self.characters = self.choose_value_by_uri("characters", null);
    self.scale = parseFloat(self.get_parameter_by_name("scale"));
    if (!self.scale) {
        self.scale = 1;
    }

    if (!self.characters) {
        self.characters = self.character_sets[self.character_set];
    }
    self.image_url = "images/" + self.set_value_by_uri("image", "dungeon.jpg");

    self.type_face = "courier , monospace";

    self.cw = 100;
    self.ch = 100;
    self.rw = 6;
    self.rh = 10;

    self.kill = false;
    self.pause = false;
    self.delay = 10;
    self.steps_per_spurt = 250;
    self.background = [0, 0, 0];

    self.canvas = null;
    self.context = null;
    self.canvas_ascii = null;
    self.context_ascii = null;
    self.image_data = null;

    self.index_x = 0;
    self.index_y = 0;
    self.iMax = 0;
    self.jMax = 0;
    self.counter = 0;
    self.font_ratio = 1.45;

    self.rows = [];
    self.current_row = [];

    self.populate_selects = function () {
        var select_mode = self.get("select_mode");
        var select_charset = self.get("select_charset");
        var select_rule = self.get("select_rule");

        Object.keys(self.modes).forEach(function (index) {
            var mode = self.modes[index];
            var option = document.createElement("option");
            option.value = mode;
            option.innerHTML = mode;
            select_mode.appendChild(option);
        });
        Object.keys(self.character_sets).forEach(function (index) {
            var character_set = self.character_sets[index];
            var option = document.createElement("option");
            option.value = index;
            option.innerHTML = character_set;
            select_charset.appendChild(option);
        });
        Object.keys(self.character_rules).forEach(function (index) {
            var character_rule = self.character_rules[index];
            var option = document.createElement("option");
            option.value = character_rule;
            option.innerHTML = character_rule;
            select_rule.appendChild(option);
        });
    };

    self.change_parameters = function () {
        self.kill = true;

        self.mode = self.get("select_mode").value;
        self.characters = self.character_sets[self.get("select_charset").value];
        self.rule = self.get("select_rule").value;
        self.scale = parseFloat(self.get("input_scale").value);

        self.counter = 0;
        self.kill = false;
        self.rows = [];
        self.current_row = [];
        window.setTimeout(self.process_image, self.delay);
    };

    self.setup_ascii_canvas = function () {
        var f = 3;

        self.canvas_ascii = document.createElement("canvas");
        self.canvas_ascii.id = "canvas_ascii";
        self.canvas_ascii.width = f * self.rw;
        self.canvas_ascii.height = f * self.rh;
        self.canvas_ascii.style.width = f * self.rw + "px";
        self.canvas_ascii.style.height = f * self.rh + "px";
        self.context_ascii = self.canvas_ascii.getContext("2d");
        self.get("div_canvas_ascii_wrapper").appendChild(self.canvas_ascii);
    };

    self.initialise = function () {
        // Add event listeners.
        document.addEventListener("keydown", self.keyDown);
        self.get("button_change").addEventListener("click", self.change_parameters);

        self.populate_selects();

        // Sort out canvases.
        self.canvas = document.createElement("canvas");
        self.canvas.id = "canvas_image";
        self.context = self.canvas.getContext("2d");
        self.get("div_canvas_image_wrapper").appendChild(self.canvas);

        self.setup_ascii_canvas();

        // Process the image.
        self.get("p_image_url").textContent = "URL: " + self.image_url;
        self.image = self.get("img_source");
        self.image.src = self.image_url;
        self.image.onload = function () {
            self.process_image();
        };
    };

    self.process_image = function () {
        var pre = self.get("pre_art");

        // Set up all the dimensions.
        var iw = self.image.width;
        var ih = self.image.height;

        self.cw = Math.floor(self.scale * iw);
        self.ch = Math.floor(self.scale * ih);

        self.canvas.width = self.cw;
        self.canvas.height = self.ch;
        self.canvas.style.width = self.cw + "px";
        self.canvas.style.height = self.ch + "px";

        pre.style.width = self.cw + "px";
        pre.style.height = self.ch + "px";

        // Draw the image and get the pixels.
        self.context.drawImage(self.image, 0, 0, iw, ih, 0, 0, self.cw, self.ch);

        self.image_data = self.context.getImageData(0, 0, self.cw, self.ch);
        self.iMax = Math.floor(self.cw / self.rw);
        self.jMax = Math.floor(self.ch / self.rh);

        pre.style.font = (self.font_ratio * self.rh) + "px " + self.type_face;
        pre.style.lineHeight = (0.69 * self.font_ratio * self.rh) + "px";
        pre.style.letterSpacing = "-0.183em";

        self.context.font = "bold " + self.font_ratio * self.rh + "px " + self.type_face;
        self.context.font = self.font_ratio * self.rh + "px " + self.type_face;
        self.context.fillRect(0, 0, self.cw, self.ch);

        self.get("span_counter").textContent = self.counter + 0;
        self.get("span_total").textContent = self.iMax * self.jMax;
        self.get("textarea_source").value = "";

        self.index_x = self.iMax - 1;
        self.index_y = self.jMax - 1;

        self.heartbeat();
    };

    self.fill_pre = function () {
        var strings = [];
        var i = 0;
        var j = 0;
        var character = " ";
        var rgb = null;
        var rgb_string = "";
        var span_string = "";
        var html_string = "";
        var pre_html_string = "";

        j = self.rows[0].length - 1;
        while (j >= 0) {

            i = self.rows.length - 1;
            while (i >= 0) {
                character = self.rows[i][j];
                rgb = character[1];
                rgb_string = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
                span_string = "<span style=\"color:" + rgb_string + "\">" + character[0] + "</span>";
                strings.push(span_string);
                i -= 1;
            }
            strings.push("\n");
            j -= 1;
        }

        html_string = strings.join("");
        self.get("pre_art").innerHTML = html_string;

        pre_html_string = "<pre style=\"";
        pre_html_string += "background:black; ";
        pre_html_string += "color:white; ";
        pre_html_string += "text-align:left; ";
        pre_html_string += "font-weight:strong; ";
        pre_html_string += "padding:0px; ";
        pre_html_string += "font:" + (self.font_ratio * self.rh) + "px " + self.type_face;
        pre_html_string += "line-height:" + (0.69 * self.font_ratio * self.rh) + "px; ";
        pre_html_string += "letter-spacing:-0.253em; ";
        pre_html_string += "width:" + self.cw + "px; ";
        pre_html_string += "height:" + self.ch + "px; ";
        pre_html_string += "\">";

        self.get("textarea_source").value = pre_html_string + html_string + "</pre>";
    };

    self.heartbeat = function () {
        var step = 0;

        while (step < self.steps_per_spurt) {

            if (self.kill) {
                return;
            }

            if (!self.pause) {
                self.update_rectangle(self.index_x * self.rw, self.index_y * self.rh, self.rw, self.rh);

                self.index_y -= 1;

                if (self.index_y < 0) {
                    self.index_x -= 1;

                    self.rows.push(self.current_row);
                    self.current_row = [];

                    if (self.index_x <= 0) {
                        self.fill_pre();
                        self.get("span_counter").textContent = self.counter + 0;
                        return;
                    }
                    self.index_y = self.jMax - 1;
                }

                self.counter += 1;
                step += 1;
            }
        }

        self.get("span_counter").textContent = self.counter + 0;

        if (self.mode === "pixelate") {
            self.context.putImageData(self.image_data, 0, 0);
        }

        window.setTimeout(self.heartbeat, self.delay);
    };

    self.get_pixels = function (u, v, w, h, pixels_in) {
        var pixels = [];
        var i = 0;
        var j = 0;
        var k = 0;
        var r = 0;
        var g = 0;
        var b = 0;

        while (i < h) {
            pixels.push([]);
            j = 0;

            while (j < w) {
                k = (self.cw * (i + v) + (j + u)) * 4;
                r = pixels_in.data[k + 0];
                g = pixels_in.data[k + 1];
                b = pixels_in.data[k + 2];
                pixels[i].push([r, g, b]);
                j += 1;
            }
            i += 1;
        }
        return pixels;
    };

    self.get_rgb_from_rectangle = function (pixels, w, h) {
        var i = 0;
        var j = 0;
        var r = 0;
        var g = 0;
        var b = 0;
        var g_new = 0;
        var rgb_out = {};

        // Get rgb
        while (i < h) {
            j = 0;
            while (j < w) {
                r += pixels[i][j][0];
                g += pixels[i][j][1];
                b += pixels[i][j][2];
                j += 1;
            }
            i += 1;
        }
        r /= (1.0 * h * w);
        g /= (1.0 * h * w);
        b /= (1.0 * h * w);

        // Change depending on colour mode
        if (self.mode === "colour") {
            r = Math.floor(r);
            g = Math.floor(g);
            b = Math.floor(b);
        } else if (self.mode === "bw") {
            r = Math.floor((r + g + b) / 3.0);
            g = r;
            b = r;
        } else if (self.mode === "rgb") {
            if (r > g && r > b) {
                r = 255;
                g = 0;
                b = 0;
            } else if (g > r && g > b) {
                r = 0;
                g = 255;
                b = 0;
            } else if (b > r && b > g) {
                r = 0;
                g = 0;
                b = 255;
            } else {
                r = 0;
                g = 0;
                b = 0;
            }
        } else if (self.mode === "matrix") {
            g_new = r;
            if (g > r && g > b) {
                g_new = g;
            }
            if (b > r && b > g) {
                g_new = b;
            }
            g = Math.floor(g_new);
            r = 0;
            b = 0;
        }

        rgb_out = {
            r: r,
            g: g,
            b: b
        };
        return rgb_out;
    };

    self.get_best_character = function (w, h, pixels, fillStyle) {
        var best_character = self.characters[Math.floor(Math.random() * self.characters.length)];
        var best_parsimony = 1e20;
        var bkg = self.background;
        var background_string = "rgb(" + bkg[0] + "," + bkg[1] + "," + bkg[2] + ")";

        if (self.character_rule === "parsimony") {
            Object.keys(self.characters).forEach(function (index) {
                var character = self.characters[index];
                var data_ascii = null;
                var tmp_pixels = null;
                var parsimony = 0;
                var dr2 = 0;
                var dg2 = 0;
                var db2 = 0;
                var i = 0;
                var j = 0;
                var f = 3;

                self.context_ascii.fillStyle = background_string;
                self.context_ascii.fillRect(0, 0, f * w, f * h);

                self.context_ascii.fillStyle = fillStyle;
                self.context_ascii.fillText(character, w, h);

                data_ascii = self.context_ascii.getImageData(0, 0, w, h);
                tmp_pixels = self.get_pixels(0, 0, w, h, data_ascii);

                i = 0;
                while (i < pixels.length) {
                    j = 0;
                    while (j < pixels[i].length) {
                        dr2 = Math.pow(pixels[i][j][0] - tmp_pixels[i][j][0], 2);
                        dg2 = Math.pow(pixels[i][j][1] - tmp_pixels[i][j][1], 2);
                        db2 = Math.pow(pixels[i][j][2] - tmp_pixels[i][j][2], 2);
                        parsimony += (dr2 + dg2 + db2);
                        j += 1;
                    }
                    i += 1;
                }
                if (parsimony < best_parsimony) {
                    best_parsimony = parsimony;
                    best_character = character;
                }
            });
        }

        return best_character;
    };

    self.pixelate_rectangle = function (u, v, w, h, rgb) {
        var i = 0;
        var j = 0;
        var k = 0;
        while (i < h) {
            j = 0;
            while (j < w) {
                k = (self.cw * (i + v) + (j + u)) * 4;
                self.image_data.data[k + 0] = rgb.r;
                self.image_data.data[k + 1] = rgb.g;
                self.image_data.data[k + 2] = rgb.b;
                j += 1;
            }
            i += 1;
        }
    };

    self.update_rectangle = function (u, v, w, h) {
        var pixels = null;

        var best_character = "@";
        var rgb = null;
        var fillStyle;

        // Get the pxels
        if (v + h >= self.ch) {
            return;
        }

        pixels = self.get_pixels(u, v, w, h, self.image_data);
        rgb = self.get_rgb_from_rectangle(pixels, w, h);

        if (self.mode === "pixelate") {
            self.pixelate_rectangle(u, v, w, h, rgb);
            return;
        }

        fillStyle = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
        best_character = self.get_best_character(w, h, pixels, fillStyle);

        self.context.fillStyle = fillStyle;
        self.context.fillText(best_character, u, v + h);
        self.current_row.push([best_character, [rgb.r, rgb.g, rgb.b]]);
    };
}

function start() {
    "use strict";
    var manager = new AsciiManager();
    manager.initialise();
}

