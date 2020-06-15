const {
  series,
  src,
  dest,
  watch
} = require("gulp");

const file = {
  src: "src/",
  dist: "dist/",
};

//引入插件，插件部分
const connect = require("gulp-connect"); //开启网络服务

const htmlclean = require("gulp-htmlclean"); //HTML压缩

const cleancss = require("gulp-clean-css"); //css压缩

const lesstocss = require("gulp-less"); //less转css

const babel = require("gulp-babel"); //babel插件转化es6语法

const uglify = require("gulp-uglify"); //js压缩

const stripdebug = require("gulp-strip-debug"); //消除调试的语句

const imagemin = require("gulp-imagemin"); //图片压缩

//html页面部分
function html() {
  return src(file.src + "html/*")
    .pipe(htmlclean())
    .pipe(dest(file.dist + "html/"))
    .pipe(connect.reload());
}

//css样式部分
function css() {
  return src(file.src + "css/*")
    .pipe(lesstocss())
    .pipe(cleancss())
    .pipe(dest(file.dist + "css/"))
    .pipe(connect.reload());
}

//js逻辑部分
function js() {
  return src(file.src + "js/*")
    .pipe(babel())
    .pipe(dest(file.dist + "js/"))
    .pipe(connect.reload());
}

//images图片部分
function images() {
  return src(file.src + "images/*")
    // .pipe(imagemin())
    .pipe(dest(file.dist + "images/"));
}

//热部署部分， 要配合着watch才能实现热更新功能
function server(cb) {
  connect.server({
    port: 5500,
    livereload: true, //自动刷新
  });
  cb();
}

//watch监听部分
watch(file.src + "html/*", function (cb) {
  html();
  cb();
});

watch(file.src + "css/*", function (cb) {
  css();
  cb();
});

watch(file.src + "js/*", function (cb) {
  js();
  cb();
});

exports.default = series(html, css, js, images, server);