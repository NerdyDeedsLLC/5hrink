// TODO: WAY BETTER ERROR-HANDLING
var gulp, sass, babel, autoprefixer, runCLICmd, browserSync;

gulp         = require('gulp');
sass         = require('gulp-sass');                // gulp-sass is a very light-weight wrapper around node-sass, which in turn is a Node binding for libsass, which in turn is a port of Sass
babel        = require("gulp-babel");               // Automatically converts ES6 code into CommonJS (http://bit.ly/vmu-gulp-babel)
autoprefixer = require('gulp-autoprefixer');        // Applies prefixes for common and popular platforns and browsers (-ms-, -webkit-)
runCLICmd    = require('gulp-run-command').default; // Allows for the execution of Bash shell commands from gulp.
browserSync  = require('browser-sync').create();    // Instantiates and executes a perpetual comm link with the browser


let successMsgCount = 0;
const successMessages = ["...Now dat's done.", "...Now dat is done also.", "...Dis here? Dis is def'nately doneded.", "...Dis too I have done.", "...Dat is also a ting I has done for you."];
var SUCCESS_MSG = () => {
    console.log(successMessages[successMsgCount]);
    successMsgCount = (successMsgCount >= successMessages.length) ? 0 : successMsgCount + 1;
}

let errorMsgCount = 0;
const errorMessages = ["D'awwwwww, de boss ain't gonna like dis! We's gots errors!"];
let errorOutput = "";
var ERROR_MSG = (errInput) => {
    console.log(errorMessages[errorMsgCount]);
    console.log("Dis is what da compiley man said:\n", errInput);
    errorMsgCount = (errorMsgCount >= errorMessages.length) ? 0 : errorMsgCount + 1;
}


/**
 * 
 * gulp.task(name [,deps] [,fn])
 * @param         {string}                    name   Named reference you're assigning to fn or calling
 * @param         {array}                     deps   An array of tasks to be executed and completed before your task will run.
 * @param         {function}                  fn     The function that performs the task's main operations.
 * @returns       {callback|stream|promise}          Return value generally is the result of fn; syntax is same as vanilla JS
 * @memberof      {@link http://bit.ly/vmu-gulp-docs|gulp}
 * @chainable     false
 * @description   
 *    Define a (concurrent & asynchronous!) task using Orchestrator {@link http://bit.ly/vmu-gulp-orchestrator}.
 *    
 */




var CSS_TASKS = function() {
    try {
        var sassSettings = {
            outputStyle: 'expanded',
            errLogToConsole: true
        };
        var autoprefixerSettings = {
            browsers: 'last 2 versions'
        };

        gulp.src('./_scss/**/*.scss')
            .pipe(sass(sassSettings).on('error', sass.logError))
            .pipe(autoprefixer(autoprefixerSettings))
            .pipe(gulp.dest('./public/lib/styles/'))
            .pipe(browserSync.stream());
        return true;
    } catch (e) {
        return e;
    }
};
const CSS_ROUTINE = (forceOutput = false) => {
    console.log("Messin' widda CSS'in...");
    let cssOutcome = CSS_TASKS();
    if (cssOutcome === true){
        SUCCESS_MSG();
        return true;
    } else {
        if(!forceOutput){
            errorOutput += cssOutcome + "\n";
            return false;
        }
        ERROR_MSG(cssOutcome);
    }
}






const JS_TASKS = function() {
    try{
        gulp.src('./_js/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./public/lib/js/'))
        return true;
    } catch(e) {
        return e;
    }
};
const JS_ROUTINE = (forceOutput = false) => {
    console.log("Trippin' trew youse scrippin'...");
    let jsOutcome = JS_TASKS();
    if (jsOutcome === true){
        SUCCESS_MSG();
        return true; 
    } else {
        if(!forceOutput){
            errorOutput += jsOutcome + "\n";
            return false;
        }
        ERROR_MSG(jsOutcome);
    }
}



const BROWSER_SYNC_TASKS = (watchList='scss,js,html', serverPath='./', forceOutput=false) => {
    try{
        browserSync.init({
            server: serverPath
        });
        if(watchList.indexOf('css') != -1)  gulp.watch('./_sass/**/*.scss', ['css']);
        if(watchList.indexOf('js') != -1)   gulp.watch('./_js/**/*.js', ['js']);
        if(watchList.indexOf('html') != -1) gulp.watch("./public/*.html").on('change', browserSync.reload);
        return true;
    } catch(e) {
        if(!forceOutput){
            errorOutput += e + "\n";
            return false;
        }
        ERROR_MSG(jsOutcome);
    }
}

const NODE_SERVER = (serverScript='5hrink.js') => {

    console.log("I will find dis Bourne tuff-guy an' he will do dis ting you ask, if'n he knows wots good fer'im.");
    runCLICmd(`nodemon "${serverScript}"`);
    return true;
}


const MASTER_ROUTINE = function() {
    console.log("Doin' da nerdy, boss!");
    if (CSS_ROUTINE() && JS_ROUTINE() && NODE_SERVER())// && BROWSER_SYNC_TASKS())
        console.log("Youse asked me t' do dese tings wot I done, an' I has done did dese tings wot you asked me t' do. Now dey is done.");
    else
        ERROR_MSG(errorOutput);
}

// Create Task Aliases
gulp.task('css', () => { CSS_ROUTINE(true); });
gulp.task('js', () => { JS_ROUTINE(true) });
gulp.task('serve', (jsServerController) => { NODE_SERVER(jsServerController) });
gulp.task('sync', (wl, sp) => { BROWSER_SYNC_TASKS(wl, sp, true) });
gulp.task('default', gulp.series(gulp.parallel('js', 'css')));

