<?php
$title = 'ASCII art gallery' ;
$stylesheets = array('style.css') ;
$reset_css = true ;
$js_scripts = array('ascii.js') ;
include($_SERVER['FILE_PREFIX'] . '/preamble.php') ;
?>
  <div class="right">
    <h3>About this page</h3>
    <div class="blurb">
      <p>This page is intended to turn an image into ASCII art using the magic of witchcraft.</p>
    </div>
  </div>
    
  <div class="right">
    <h3>The images</h3>
    <div class="blurb">
      <p>Counter: <span id="span_counter"></span>/<span id="span_total"></span></p>
      <div class="center"><img id="img_source" alt="Source image"/></div>
      <div id="div_canvas_image_wrapper"></div>
      <pre id="pre_art"></pre><br />
      <textarea id="textarea_source"></textarea>
      <div id="div_canvas_ascii_wrapper"></div>
    </div>
  </div>

<?php ($_SERVER['FILE_PREFIX'] . '/foot.php') ;
