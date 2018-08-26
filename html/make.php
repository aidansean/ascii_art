<?php
$title = 'ASCII art gallery' ;
$stylesheets = array('style.css') ;
$reset_css = true ;
$js_scripts = array('ascii.js') ;
include($_SERVER['FILE_PREFIX'] . '/_core/preamble.php') ;
?>
  <div class="right">
    <h3>About this page</h3>
    <div class="blurb">
      <p>This page is intended to turn an image into ASCII art using the magic of witchcraft.</p>
      <p id="p_image_url"></p>
    </div>
  </div>
    
  <div class="right">
    <h3>The images</h3>
    <div class="blurb">
      <div class="center">
        <p>Counter: <span id="span_counter"></span>/<span id="span_total"></span></p>
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Scale</th>
              <td><input id="input_scale" value="1" /></td>
            </tr>
            <tr>
              <th>Mode</th>
              <td><select id="select_mode"></select></td>
            </tr>
            <tr>
              <th>Character set</th>
              <td><select id="select_charset"></select></td>
            </tr>
            <tr>
              <th>Selection rule</th>
              <td><select id="select_rule"></select></td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th></th>
              <th><button id="button_change">Change</button></th>
            </tr>
          </thead>
        </table>

        <img id="img_source" alt="Source image"/>

        <div id="div_canvas_image_wrapper"></div>

        <pre id="pre_art"></pre><br />

        <textarea id="textarea_source"></textarea>

        <div id="div_canvas_ascii_wrapper"></div>
      </div>

    </div>
  </div>

<?php foot() ;
