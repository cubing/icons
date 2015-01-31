Cubing Icons and Fonts
=======

These fonts were generated with [IcoMoon App](https://icomoon.io/app). If you want to just check out IcoMoon, click [here](https://icomoon.io/).

###cubing-icons.css
IcoMoon gives us a style.css from the download. Since this name is too generic, we are intentionally renaming it to cubing-icons.css, and we will continue to do so until we can figure out how to get this name by default.

###selection.json
This file can be imported in the [IcoMoon App](https://icomoon.io/app) to edit the fonts. This is preferred as opposed to creating a new font every time we want to add icons to the font files.

###demo.html
A very simple display of the icons using span tags. This can just be a quick way to play with the css/markup.

#How to modify the fonts
1. Go to the [IcoMoon App](https://icomoon.io/app).

2. Click the menu button, then Manage Projects.

3. Remove all the current projects.

4. Click Import Projects.

5. Browse to the cubing-icons directoy, an select the selection.json file to be uploaded.

6. Click the Load link for the project. We tried naming it Cubing Icons as the project name, but the selection.json file in the zip doesn't have the project name. The only way to keep the project name is to go back to Manage Projects and download the project, after the font is downloaded. That's a long-winded way of saying it's not necessary.

7. Click the Import Icons button. ![Import Icons](http://i.imgur.com/Ea9Y62u.png)

8. Select the svg files you wish to add. You'll notice that you now have a set called cubing-icons, and an untitled set. ![Sets](https://i.imgur.com/L6oeG7X.png)

9. You will need to click the icon you wish to select. In the previous image, the images with a white background and gold/yellow border are selected. The pentagon in Untitled Set is not selected. Only selected images get added to the font.
10. Click on Generate Font at the bottom. ![Generate Font](http://i.imgur.com/1AQ7lf0.png)

11. This page gives us one last chance to change the class names of the images. Please ensure they are sensible. The class names will be icon-222, for example. Do **not** add the icon- prefix to these names, as that prefix is automatically added.

12. You are able to edit the preferences found here: ![Preferences](http://i.imgur.com/5uSXgEs.png) Make sure that the font name is cubing-icons, and that "Encode & Embed Font in CSS" is checked. Close the modal when finished.

13. Click the download button at the bottom: ![Download](https://i.imgur.com/YS0ubnq.png)

14. Extract the files from the compressed download. Replace the cubing-icons/fonts contents with the new files, and the selection.json. Rename style.css to cubing-icons.css and replace it as well.

15. Commit your changes!