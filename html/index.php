<?php
$title = 'ASCII art' ;
$stylesheets = array('style.css') ;
include_once('project.php') ;
include_once($_SERVER['FILE_PREFIX'] . '/_core/preamble.php') ;
?>
  <div class="right">
    <h3>About this page</h3>
    <div class="blurb">
      <p>After talking to a friend who suggested I write a text based adventure game I decided could use a way to generate graphics that could be displayed as text.  To achieve this I used the HTML canvas to analyse images and compared the distribution of colours with various characters, providing graphical, textual, and HTML outputs.</p>
      
      <p>The tool allows the user to choose various character sets for processing the images, including particles for images related to particle physics. The user can also choose which display modes to use, including "colour", "black and white", "red, green, and blue", "pixelate", and "Matrix".  There are two rules for determining which characters to use, which are "parsimony", and "random". Parsimony chooses a single character of a single colour that best matches the local pixels.  To find out more, read the <a href="http://aidansean.com/projects/?tag=ascii_art">blog posts</a> or visit the <a href="https://github.com/aidansean/ascii_art">GitHub page.</a></p>
    </div>
    
    <div class="right">  
      <h3>The gallery</h3>
      <p>This page contains images that were made with the tool.  Click on the images for larger versions.</p>

      <table>
        <thead>
          <tr><th colspan="2" class="header_2">Underground</th></tr>
          <tr><th class="header_1">Before</th><th class="header_1">After</th></tr>
        </thead>
        <tbody>
          <tr>
            <td class="ascii"><a href="images/tfl.jpg"><img src="images/thumbnails/tfl.jpg" alt="Source image" width="375px" height="249px"/></a></td>
            <td class="ascii"><a href="images/tfl.png"><img src="images/thumbnails/tfl.png" alt="Source image" width="375px" height="249px"/></a></td>
          </tr>
        </tbody>
        <thead>
          <tr><th colspan="2" class="header_2">Sunset at CERN</th></tr>
          <tr><th class="header_1">Before</th><th class="header_1">After</th></tr>
        </thead>
        <tbody>
          <tr>
            <td class="ascii"><a href="images/cern.jpg"><img src="images/thumbnails/cern.jpg" alt="Source image" width="375px" height="249px"/></a></td>
            <td class="ascii"><a href="images/cern.png"><img src="images/thumbnails/cern.png" alt="Source image" width="375px" height="249px"/></a></td>
          </tr>
        </tbody>
        <thead>
          <tr><th colspan="2" class="header_2">New York skyline</th></tr>
          <tr><th class="header_1">Before</th><th class="header_1">After</th></tr>
        </thead>
        <tbody>
          <tr>
            <td class="ascii"><a href="images/nyc.jpg"><img src="images/thumbnails/nyc.jpg" alt="Source image" width="375px" height="249px"/></a></td>
            <td class="ascii"><a href="images/nyc.png"><img src="images/thumbnails/nyc.png" alt="Source image" width="375px" height="249px"/></a></td>
          </tr>
        </tbody>
        <thead>
          <tr><th colspan="2" class="header_2">Creepy staircase</th></tr>
          <tr><th class="header_1">Before</th><th class="header_1">After</th></tr>
        </thead>
        <tbody>
          <tr>
            <td class="ascii"><a href="images/stairs.jpg"><img src="images/thumbnails/stairs.jpg" alt="Source image" width="375px" height="249px"/></a></td>
            <td class="ascii"><a href="images/stairs.png"><img src="images/thumbnails/stairs.png" alt="Source image" width="375px" height="249px"/></a></td>
          </tr>
        </tbody>
        <thead>
          <tr><th colspan="2" class="header_2">Mandelbrot set</th></tr>
          <tr><th class="header_1">Before</th><th class="header_1">After</th></tr>
        </thead>
        <tbody>
          <tr>
            <td class="ascii"><a href="images/mandelbrot.jpg"><img src="images/thumbnails/mandelbrot.jpg" alt="Source image" width="360px" height="270px"/></a></td>
            <td class="ascii"><a href="images/mandelbrot.png"><img src="images/thumbnails/mandelbrot.png" alt="Source image" width="360px" height="270px"/></a></td>
          </tr>
        </tbody>
        <thead>
          <tr><th colspan="2" class="header_2">In the library</th></tr>
          <tr><th class="header_1">Before</th><th class="header_1">After</th></tr>
        </thead>
        <tbody>
          <tr>
            <td class="ascii"><a href="images/lee.jpg"><img src="images/thumbnails/lee.jpg" alt="Source image" width="249px" height="375px"/></a></td>
            <td class="ascii"><a href="images/lee.png"><img src="images/thumbnails/lee.png" alt="Source image" width="249px" height="375px"/></a></td>
          </tr>
        </tbody>
        <thead>
          <tr><th colspan="2" class="header_2">Statue of Liberty</th></tr>
          <tr><th class="header_1">Before</th><th class="header_1">After</th></tr>
        </thead>
        <tbody>
          <tr>
            <td class="ascii"><a href="images/liberty.jpg"><img src="images/thumbnails/liberty.jpg" alt="Source image" width="249px" height="375px"/></a></td>
            <td class="ascii"><a href="images/liberty.png"><img src="images/thumbnails/liberty.png" alt="Source image" width="249px" height="375px"/></a></td>
          </tr>
        </tbody>
        <thead>
          <tr><th colspan="2" class="header_2">Geneva airport</th></tr>
          <tr><th class="header_1">Before</th><th class="header_1">After</th></tr>
        </thead>
        <tbody>
          <tr>
            <td class="ascii"><a href="images/gva.jpg"><img src="images/thumbnails/gva.jpg" alt="Source image" width="375px" height="249px"/></a></td>
            <td class="ascii"><a href="images/gva.png"><img src="images/thumbnails/gva.png" alt="Source image" width="375px" height="249px"/></a></td>
          </tr>
        </tbody>
        <thead>
          <tr><th colspan="2" class="header_2">ATLAS event display</th></tr>
          <tr><th class="header_1">Before</th><th class="header_1">After</th></tr>
        </thead>
        <tbody>
          <tr>
            <td class="ascii"><a href="images/atlas.jpg"><img src="images/thumbnails/atlas.jpg" alt="Source image" width="375px" height="139px"/></a></td>
            <td class="ascii"><a href="images/atlas.png"><img src="images/thumbnails/atlas.png" alt="Source image" width="375px" height="139px"/></a></td>
          </tr>
        </tbody>
        <thead>
          <tr><th colspan="2" class="header_2">Spiral staircase</th></tr>
          <tr><th class="header_1">Before</th><th class="header_1">After</th></tr>
        </thead>
        <tbody>
          <tr>
            <td class="ascii"><a href="images/spiral.jpg"><img src="images/thumbnails/spiral.jpg" alt="Source image" width="375px" height="249px"/></a></td>
            <td class="ascii"><a href="images/spiral.png"><img src="images/thumbnails/spiral.png" alt="Source image" width="375px" height="249px"/></a></td>
          </tr>
        </tbody>
        <thead>
          <tr><th colspan="2" class="header_2">WMAP survery</th></tr>
          <tr><th class="header_1">Before</th><th class="header_1">After</th></tr>
        </thead>
        <tbody>
          <tr>
            <td class="ascii"><a href="images/wmap.jpg"><img src="images/thumbnails/wmap.jpg" alt="Source image" width="256px" height="140px"/></a></td>
            <td class="ascii"><a href="images/wmap.png"><img src="images/thumbnails/wmap.png" alt="Source image" width="256px" height="140px"/></a></td>
          </tr>
        </tbody>
        <thead>
          <tr><th colspan="2" class="header_2">Leicester Square</th></tr>
          <tr><th class="header_1">Before</th><th class="header_1">After</th></tr>
        </thead>
        <tbody>
          <tr>
            <td class="ascii"><a href="images/MMs.jpg"><img src="images/thumbnails/MMs.jpg" alt="Source image" width="375px" height="212px"/></a></td>
            <td class="ascii"><a href="images/MMs.png"><img src="images/thumbnails/MMs.png" alt="Source image" width="375px" height="212px"/></a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

<?php foot() ;
