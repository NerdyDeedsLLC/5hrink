// TODO: WAY BETTER ERROR-HANDLING
var gulp, notify, print, pipelogger, watch, changed, sass, babel, autoprefixer, runCLICmd, browserSync, reload;

gulp         = require('gulp');
notify       = require("gulp-notify");
var streamify = require('gulp-streamify');
var gulpFn  = require('gulp-fn');

print        = require('gulp-print');
watch        = require('gulp-watch');
changed      = require('gulp-changed');
sass         = require('gulp-sass');                // gulp-sass is a very light-weight wrapper around node-sass, which in turn is a Node binding for libsass, which in turn is a port of Sass
babel        = require("gulp-babel");               // Automatically converts ES6 code into CommonJS (http://bit.ly/vmu-gulp-babel)
autoprefixer = require('gulp-autoprefixer');        // Applies prefixes for common and popular platforns and browsers (-ms-, -webkit-)
runCLICmd    = require('gulp-run-command').default; // Allows for the execution of Bash shell commands from gulp.
browserSync  = require('browser-sync').create();    // Instantiates and executes a perpetual comm link with the browser
reload       = browserSync.reload;
// pipelogger   = print.setLogFunction;

// print.setLogFunction(message => console.log('LOG', message));

var PATHS = {
    'server' : {
        'proxy': 'localhost:8080',
        'root': './'
    },
    'js' : {
        'source': '_js/*.js',
        'dest': './public/lib/js/'
    },
    'css' : {
        'source': '_scss/**/*.scss',
        'dest': './public/lib/styles/'
    },
    'html' : {
        'source': './public/*.html',
        'dest': './public/'
    }
}

function piper(){
    console.log.apply(console, arguments);
}

const NODE_SERVER = (serverScript='5hrink.js') => {

    console.log("I will find dis Bourne tuff-guy an' he will do dis ting you ask, if'n he knows wots good fer'im.");
    runCLICmd(`nodemon "${serverScript}"`);
    return true;
}

gulp.task('sync', function(done, watchList='css,html,js') {
        console.log('HERE:', watchList);
         browserSync.init({ proxy: PATHS.server.proxy });
        if(watchList.indexOf('css') != -1)  gulp.watch('./_sass/**/*.scss', ['css']);
        if(watchList.indexOf('js') != -1)   gulp.watch('./_js/**/*.js', ['js']);
        if(watchList.indexOf('html') != -1) gulp.watch("./public/*.html").on('change', browserSync.reload);
        return(done);
});

var successMsgCount = 0;
var successMessages = ["...Now dat's done.", "...Now dat is done also.", "...Dis here? Dis is def'nately doneded.", "...Dis too I have done.", "...Dat is also a ting I has done for you."];
function SUCCESS_MSG() {
    // console.log(successMessages[successMsgCount]);
    successMsgCount = (successMsgCount >= successMessages.length) ? 0 : successMsgCount + 1;
    return successMessages[successMsgCount];
}

var errorMsgCount = 0;
var errorMessages = ["D'awwwwww, de boss ain't gonna like dis! We's gots errors!"];
var errorOutput = "";
function ERROR_MSG (errInput) {
    console.log(errorMessages[errorMsgCount]);
    console.log("Dis is what da compiley man said:\n", errInput);
    errorMsgCount = (errorMsgCount >= errorMessages.length) ? 0 : errorMsgCount + 1;
}


gulp.task('build-css', function(stream){
    if(null == stream) stream = PATHS.css.source;

    var sassSettings = {
        outputStyle: 'expanded',
        errLogToConsole: true
    };
    var autoprefixerSettings = {
        browsers: 'last 2 versions'
    };
    return gulp.src(PATHS.css.source)
        .pipe(gulpFn((file, enc) => piper("Force-Building", file.path)))
        .pipe(sass(sassSettings).on('error', sass.logError))
        // .pipe(autoprefixer(autoprefixerSettings))
        .pipe(gulp.dest(PATHS.css.dest));
});
// gulp.task('build-scss', 'build-css');

gulp.task('node-server', function(done) {
    return gulpFn(()=> { runCLICmd('node ./5hrink.js'); })
    .pipe(watch('./5hrink.js', { ignoreInitial: false, name:'NODE_SERVER', verbose:true }));     
});

gulp.task('stream-css', function () {
    
    var sassSettings = {
        outputStyle: 'expanded',
        errLogToConsole: true
    };
    var autoprefixerSettings = {
        browsers: 'last 2 versions'
    };


    return  watch(PATHS.css.source, { ignoreInitial: true, name:'CSS-STREAM', verbose:true })
            .pipe(notify(SUCCESS_MSG()))
            .pipe(gulpFn((file, enc) => piper("Lookin' at ", file.path)))
            .pipe(changed(PATHS.css.dest))
            .pipe(gulpFn((file, enc) => piper(file.path, 'looks not da same!')))
            .pipe(sass(sassSettings).on('error', sass.logError))
            .pipe(autoprefixer(autoprefixerSettings))
            .pipe(gulp.dest(PATHS.css.dest))
            // .pipe()
            .pipe(browserSync.stream()
            .on('change', browserSync.reload))
            ;
});

gulp.task('stream-js', function () {
    notify(SUCCESS_MSG())
    return watch(PATHS.js.source, { ignoreInitial: true, name:'JS-STREAM', verbose:true })
            .pipe(notify(SUCCESS_MSG()))
            .pipe(gulpFn((file, enc) => piper("Lookin' at ", file.path)))
            .pipe(changed(PATHS.js.dest))
            .pipe(gulpFn((file, enc) => piper(file.path, 'looks not da same!')))
            .pipe(babel())
            .pipe(gulp.dest(PATHS.js.dest))
            .pipe(browserSync.stream())
            .on('change', browserSync.reload);
});


gulp.task('default', gulp.parallel('stream-css', 'stream-js', function(){browserSync.init({ proxy: PATHS.server.proxy });}));
