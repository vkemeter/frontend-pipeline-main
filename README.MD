# frontend pipeline main package

- requires node 16
- gulp
- gulp-dart-sass
- jquery 3.6.0 included (can be removed via config file)
- bootstrap 5
- family.scss
- real favicon generator

1. `yarn init`
2. `yarn add https://github.com/vkemeter/frontend-pipeline-main.git`
3. copy config files and presets from preset folder
4. edit config files for your need

see a example package here: https://github.com/vkemeter/frontend-pipeline-package

## backstopjs as visual regression tests included

* In the Folder ```/Test/backstop``` you will find the backstop config file. usually you dont need to edit this file
* two example files (scenario and cookies) are copied but ignored. rename and use this files for own scenarios
* the viewport config comes from your config.yaml file. the same dimensions as in scss and typoscript are used

### GULP Tasks

#### TEST:Visual:Reference

this task is used to create the initial reference files. this reference will be created from your config in the section
```referenceUrl``` of each scenario

#### TEST:Visual:Test

this task will start the test based on your reference files. 

#### TEST:Visual:Approve

you can approve your tests with this task. use --filter="Filename" to approve single screenshots. 

see https://github.com/garris/BackstopJS for further informations

### FAVICON GENERATOR

a gulp task for creating modern favicons based on a svg file for all modern devices.

use the Favicon:: Tasks in series to generate them, or use the favicon task to run all tasks in series.

this will generate favicon files and a html partial for usage in your typoscript to inject it
in your html head.
