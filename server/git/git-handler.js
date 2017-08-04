
var fs = require('fs');
var gulp = require('gulp');
var git = require('gulp-git');
var prompt = require('gulp-prompt');
var gitignore = require('gulp-gitignore');
var pack = require('../../package.json');

gulp.task('add', function() {
    gulp.src('./')
        .pipe(git.add());
});

gulp.task('up-version', function () {
    fs.readFile('./package.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            var obj = JSON.parse(data); //now it an object
            if (obj.version) {
                var versionHandler = obj.version.split(".");
                versionHandler[versionHandler.length-1] = ++versionHandler[versionHandler.length-1];
                obj.version = versionHandler.join(".");
                //this hack is required for markup saving
                function replacer(match, p1, p2, offset, string) {
                    return [p1, JSON.stringify(obj.version)].join(':');
                }
                console.log(`new version: ${obj.version}`);
                var json = data.replace(/(\"version\"):(\"[\.0-9]+\")/g,replacer);
                fs.writeFile('./package.json', json, 'utf8'); // write it back
            } else {
                console.log("Package.json versioning is unavailable!");
            }
        }});
});

// Commit files

gulp.task('commit', function() {
    //just source anything
    gulp.src('package.json')
        .pipe(prompt.prompt({
            type: 'input',
            name: 'commit',
            message: 'Please enter commit message...'
        }, function (res) {
            return gulp.src("./*",{buffer:false})
                .pipe(gitignore())
                .pipe(git.commit(res.commit));
        }));
});

//push all changes
gulp.task('push', function() {
    git.push('origin', 'master',{args:" --tags"}, function (err) {
        if (err) {
            console.error(err);
        }
    });
});

// Tag the repo

gulp.task('tag', function() {
    git.tag(pack.version, `minor ${pack.version}`, function (err) {
        if (err) {
            console.error(err);
        }
    });
});

gulp.task('git',['up-version','add','commit','tag','push']);
