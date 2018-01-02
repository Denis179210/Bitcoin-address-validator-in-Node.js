var gulp 		 = require("gulp"),
	sass 		 = require("gulp-sass"),
	less 		 = require("gulp-less"),
	browserSync  = require("browser-sync"),
	concat 		 = require("gulp-concat"),
	uglify 		 = require("gulp-uglifyjs"),
	cssnano 	 = require("gulp-cssnano"),
	rename 		 = require("gulp-rename"),
	del			 = require("del"),
	autoprefixer = require("gulp-autoprefixer");

gulp.task("sass", function() {
	return gulp.src("app/sass/*.sass")
	.pipe(sass())
	.pipe(gulp.dest("app/css"))
});

gulp.task("less", function() {
	return gulp.src("app/less/*.less")
	.pipe(less())
	.pipe(gulp.dest("app/css"))
});

gulp.task('autoprefixer', ["sass", "less"], function() {
    gulp.src('app/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
		.pipe(gulp.dest("app/css"))
		.pipe(browserSync.reload({stream : true}))
});

gulp.task("scripts", function() {

	return gulp.src([

		"app/libs/jquery/dist/jquery.min.js",
		"app/libs/magnific-popup/dist/jquery.magnific-popup.min.js",
		"app/libs/bootstrap/dist/js/bootstrap.min.js"

		])
	.pipe(concat("libs.min.js"))
	.pipe(uglify())
	.pipe(gulp.dest("app/js"));

});

gulp.task("css-libs", ["autoprefixer"], function() {

	return gulp.src("app/css/libs.css")
	.pipe(cssnano())
	.pipe(rename({suffix : ".min"}))
	.pipe(gulp.dest("app/css"))

});

gulp.task("server", function() {

	browserSync({
		server: {
			baseDir: "app"
		},
		notify: false
	});

});

gulp.task("clean", function() {

	return del.sync("dist");

});

gulp.task("watch", ["scripts", "server", "css-libs"],function() {

	gulp.watch("app/sass/**/*.sass", ["autoprefixer"]);
	gulp.watch("app/less/**/*.less", ["autoprefixer"]);
	gulp.watch("app/*.html", browserSync.reload);
	gulp.watch("app/js/**/*.js", browserSync.reload);

});

gulp.task("build", ["clean", "autoprefixer", "scripts"], function() {

	var buildCss 	= 	gulp.src([
						"app/css/libs.min.css",
						"app/css/normalize.css",
						"app/css/style.css",
						"app/css/main.css"
						])
						.pipe(gulp.dest("dist/css")),

		buildFonts	= 	gulp.src("app/fonts/*")
						.pipe(gulp.dest("dist/fonts")),

		buildJS		=	gulp.src("app/js/**//*")
						.pipe(gulp.dest("dist/js")),

		buildImg	=	gulp.src("app/img/*")
						.pipe(gulp.dest("dist/img")),

		buildHTML	=	gulp.src("app/*.html")
						.pipe(gulp.dest("dist"));

});