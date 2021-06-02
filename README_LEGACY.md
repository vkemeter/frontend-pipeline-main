# frontend pipeline main package

- requires node 14
- gulp
- gulp-sass
- node-sass
- gulp-glass
- jquery 3.5.1 included (can be removed via config file)
- sassdash
- bootstrap 4.5.3
- family.scss

1. `yarn init`
2. `yarn add https://github.com/vkemeter/frontend-pipeline-main.git`
3. edit config files for your need.

see a example package here: https://github.com/vkemeter/frontend-pipeline-package

## backstopjs as visual regression tests included

* In the Folder ```/Test/backstop``` you will find the backstop config file. usually you dont need to edit this file
* two example files (scenario and cookies) are copied but ignored. rename and use this files for own scenarios
* the viewport config comes from your config.yaml file. the same dimensions as in scss and typoscript are used

### GULP DefaultTasks

#### TEST:Visual:Reference

this task is used to create the initial reference files. this reference will be created from your config in the section
```referenceUrl``` of each scenario

#### TEST:Visual:Test

this task will start the test based on your reference files.

#### TEST:Visual:Approve

you can approve your tests with this task. use --filter="Filename" to approve single screenshots.

see https://github.com/garris/BackstopJS for further informations
