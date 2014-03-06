from project_module import project_object, image_object, link_object, challenge_object

p = project_object('ascii_art', 'ASCII art generator')
p.domain = 'http://www.aidansean.com/'
p.path = 'apollo'
p.preview_image_ = image_object('http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg', 408, 287)
p.github_repo_name = 'apollo'
p.mathjax = True
p.links.append(link_object(p.domain, 'ascii_art/', 'Live page'))
p.introduction = 'After talking to a friend who suggested I write a text based adventure game I decided could use a way to generate graphics that could be displayed as text.  To achieve this I used the HTML canvas to analyse images and comapared the distribution of colours with various characters, providing graphical, textual, and HTML outputs.'
p.overview = '''The tool allows the user to choose various character sets for processing the images, including particles for images related to particle physics. The user can also choose which display modes to use, including "colour", "black and white", "red green, and blue", "pixelate", "Matrix".

There are two rules for determining which characters to use, which are "parsimony", and "random". Parsimony chooses a single character of a single colour that best matches the local pixels.

<h3>Strategy</h3>
The source image is divided into rectangles of equal size. The rectangles are then painted to a canvas one by one, and the pixel colours analysed to define a single characteristic colour for the rectangle depending on the mode used. (For example, when the mode is "black and white" the characteristic colour is \\((\\bar{r}+\\bar{g}+\\bar{b})/3\\), where \\(\\bar{r}\\) is the average red value of the pixels, and similarly for green and blue.)

For each rectangle each character is tested one by one to find the best match between the pixels in the source image and those in the character using the characteristic colour. To find the character with the best match a parsimony parameter, \\(p\\), is defined as the sum of the squares of the differences between the rgb values of the pixels between the character and the source image. The character with the smallest value of \\(p\\) is chosen. The expression for \\(p\\) is:

\\( p = \\sum_i \\left[ (r_i^s-r_i^c)^2 + (g_i^s-g_i^c)^2 + (b_i^s-b_i^c)^2 \\right] \\)

where \\(r_i^s(c)\\) is the r value of the \\(i\\)th pixel in the source image (character), and similarly for green and blue.

This character then gets drawn to a large canvas for graphical output, added to a <code>span</code> element for textual output, and added to a <code>textarea</code> element for HTML output.'''

p.challenges.append(challenge_object('The versatility of the tool is limited by the same origin policy restrictions, meaning that currently users can only download image generated from sources files on the same server.', 'Create a secure and reliable service for uploading images to a temporary directory on the server.', 'To be done'))

p.challenges.append(challenge_object('In textual output, the font spacing requires tweaks depending on the browser used.', 'Edit the CSS to ensure consistent display of text between different clients.', 'To be done'))

p.challenges.append(challenge_object('For large images and large character sets the processing can cause the browser to freeze up and issues warnings.', 'The processing is split into "spurts" which consist of a fixed number of steps each.  The <code>window.setTimeout</code> method is used to moderate the CPU load.', 'Resolved'))
